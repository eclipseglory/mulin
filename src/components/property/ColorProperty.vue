<template>
  <div class="color-container">
    <div class="color-input-container">
      <div style="margin-right: 20px">
        <label v-if="title != null">{{ title }}</label>
      </div>
      <div style="width: 100%">
        <input
          type="color"
          class="form-control form-control-sm form-control-color my-color-input"
          @change="colorChanged"
          :value="currentColorString"
        />
      </div>
    </div>

    <div class="color-rgb-container">
      <div class="color-value-container">
        <label>R</label>
        <input
          class="form-control form-control-sm property-input"
          type="number"
          max="255"
          min="0"
          placeholder="R"
          v-model.lazy="r"
          @click="selectText"
          @keypress.enter="confirm"
        />
      </div>

      <div class="color-value-container">
        <label>G</label>
        <input
          class="form-control form-control-sm property-input"
          placeholder="G"
          type="number"
          max="255"
          min="0"
          v-model.lazy="g"
          @click="selectText"
          @keypress.enter="confirm"
        />
      </div>
      <div class="color-value-container">
        <label>B</label>
        <input
          class="form-control form-control-sm property-input"
          placeholder="B"
          type="number"
          max="255"
          min="0"
          v-model.lazy="b"
          @click="selectText"
          @keypress.enter="confirm"
        />
      </div>
    </div>
    <div class="color-a-container">
      <label style="margin-right: 5px">Opacity</label>
      <input
        class="form-control form-control-sm property-input"
        type="number"
        max="1"
        min="0"
        step="0.1"
        v-model.lazy="a"
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
import { Point, Utils } from "figures";

export default {
  name: "ColorProperty",
  emits: ["property:change"],
  mixins: [textclickfullselect, modelpropertychangeprocessor],
  methods: {
    canChangeProperty(model) {
      if (model instanceof Point) return false;
      return true;
    },
    colorChanged(event) {
      let str = event.target.value;
      if (str && str.length == 7) {
        let r = str.substring(1, 3);
        r = Number.parseInt(r, 16);
        let g = str.substring(3, 5);
        g = Number.parseInt(g, 16);
        let b = str.substring(5, 7);
        b = Number.parseInt(b, 16);
        let properties = {};
        properties[this.rk] = r;
        properties[this.gk] = g;
        properties[this.bk] = b;
        let events = [];
        this.models.forEach((model) => {
          events.push({
            model: model,
            property: this.rk,
            value: r,
          });
          events.push({
            model: model,
            property: this.gk,
            value: g,
          });
          events.push({
            model: model,
            property: this.bk,
            value: b,
          });
        });
        this.$emit("property:change", events);
        // this.changeModelsProperties(this.selections, properties);
      }
    },
  },
  computed: {
    currentColorString() {
      return Utils.transformRGBToHex(this.r, this.g, this.b);
    },

    r: {
      get() {
        return this.getAnyPropertyValue(this.models, this.rk, 0);
      },
      set(v) {
        v = Number.parseInt(v);
        let events = [];
        this.models.forEach((model) => {
          events.push({
            model: model,
            property: this.rk,
            value: v,
          });
        });
        this.$emit("property:change", events);
        // this.changeModelsProperty(this.selections, this.rk, v);
      },
    },
    g: {
      get() {
        return this.getAnyPropertyValue(this.models, this.gk, 0);
      },
      set(v) {
        v = Number.parseInt(v);
        let events = [];
        this.models.forEach((model) => {
          events.push({
            model: model,
            property: this.gk,
            value: v,
          });
        });
        this.$emit("property:change", events);
        // this.changeModelsProperty(this.selections, this.gk, v);
      },
    },
    b: {
      get() {
        return this.getAnyPropertyValue(this.models, this.bk, 0);
      },
      set(v) {
        v = Number.parseInt(v);
        let events = [];
        this.models.forEach((model) => {
          events.push({
            model: model,
            property: this.bk,
            value: v,
          });
        });
        this.$emit("property:change", events);
        // this.changeModelsProperty(this.selections, this.bk, v);
      },
    },
    a: {
      get() {
        return this.getAnyPropertyValue(this.models, this.ak, 0);
      },
      set(v) {
        let events = [];
        this.models.forEach((model) => {
          events.push({
            model: model,
            property: this.ak,
            value: v,
          });
        });
        this.$emit("property:change", events);
        // this.changeModelsProperty(this.selections, this.ak, v);
      },
    },
  },
  props: {
    models: {
      type: Array,
    },
    title: {
      type: String,
    },
    rk: {
      type: String,
      default: "r",
    },
    gk: {
      type: String,
      default: "g",
    },
    bk: {
      type: String,
      default: "b",
    },
    ak: {
      type: String,
      default: "a",
    },
  },
};
</script>

<style>
.color-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
  box-sizing: border-box;
}

.color-rgb-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex: 33% 33% 33%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.my-color-input {
  max-width: 100%;
  border: none;
  background-color: transparent;
}

.my-color-input:focus {
  border: none;
  background-color: transparent;
  box-shadow: none;
}

.color-input-container {
  width: 100%;
  display: flex;
  align-items: center;
}

.color-a-container {
  width: 100%;
  display: flex;
  align-items: baseline;
}

.color-value-container {
  width: 100%;
  display: flex;
  align-items: baseline;
}
</style>