<template>
  <div class="property-item">
    <div
      class="property-label"
      :class="disabled ? 'disabled-label' : ''"
      :title="name == null ? '' : name"
    >
      <i v-if="icon != null" class="iconfont" :class="icon"></i>
      <span v-else
        ><label>{{ name }}</label></span
      >
    </div>
    <div class="property-value">
      <input
        v-if="disabled"
        class="form-control form-control-sm property-input"
        disabled
      />
      <input
        v-else
        class="form-control form-control-sm property-input"
        v-model.lazy="pvalue"
        :type="type"
        :step="step"
        :max="max"
        :min="min"
        @click="selectText"
        @keypress.enter="confirm"
      />
    </div>
  </div>
</template>

<script>
import {
  textclickfullselect,
  modelpropertychangeprocessor,
} from "../../mixins";

export default {
  name: "Property",
  mixins: [textclickfullselect, modelpropertychangeprocessor],
  emits: ["property:change"],
  computed: {
    pvalue: {
      get() {
        if (this.disabled) return;
        let dv = this.defaultValue;
        if (this.type == "number" && dv != null) {
          dv = Number.parseFloat(dv);
        }
        let v = this.getAnyPropertyValue(this.models, this.pk, dv);
        if (v == null) return;
        if (this.transformToAngel) {
          let angle = (v * 180) / Math.PI;
          return angle.toFixed(this.fixed);
        }
        return v.toFixed(this.fixed);
      },

      set(v) {
        if (this.selections == null) return;
        let value = v;
        if (this.type == "number") {
          value = Number.parseFloat(v);
        }
        if (this.transformToAngel) {
          value = (v * Math.PI) / 180;
        }
        let events = [];
        this.models.forEach((s) => {
          events.push({
            model: s,
            property: this.pk,
            value: value,
          });
        });
        this.$emit("property:change", events);
        // this.changeModelsProperty(this.models, this.pk, value);
        return;
      },
    },
    disabled() {
      if (this.models == null || this.models.length == 0) return true;
      for (let i = 0; i < this.models.length; i++) {
        const s = this.models[i];
        if (!this.pk in s) return true;
      }
      return false;
    },
  },

  props: {
    models: {
      type: Array,
    },
    name: {
      type: String,
      default: null,
    },
    fixed: {
      type: Number,
      default: 2,
    },
    transformToAngel: {
      type: Boolean,
      default: false,
    },
    pk: {
      type: String,
    },
    step: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
    },
    min: {
      type: Number,
    },
    type: {
      type: String,
      default: "number",
    },
    icon: {
      type: String,
      default: null,
    },

    defaultValue: {
      type: String,
      default: null,
    },
  },
};
</script>

<style>
</style>