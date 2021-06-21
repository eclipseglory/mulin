<template>
  <div>
    <div
      v-if="!hasFillProperty || isLine"
      style="text-algin: left; color: grey"
    >
      <small>Invalidate</small>
    </div>
    <div v-else>
      <div class="property-item">
        <label class="property-label">Mode</label>
        <div class="property-value" style="width: 70%">
          <select class="form-select form-select-sm" v-model="fillMode">
            <option
              v-for="(value, key) in modeOptions"
              :key="key"
              :value="key"
              :title="value.description"
            >
              {{ value.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="gray-splitter" style="margin-top: 20px"></div>
      <color-config-property
        id="fill-"
        :models="selections"
        colorTypeProperty="fill"
        @colorType:change="colorTypeChanged"
        @color:change="colorChanged"
        @linear-gradient:change="linearGradientChanged"
        @radial-gradient:change="radialGradientChanged"
        @linear-gradient:stopschange="gradientStopsChanged"
        @radial-gradient:stopschange="gradientStopsChanged"
        rpk="r"
        gpk="g"
        bpk="b"
        apk="a"
        linearGradientKey="linearGradient"
        radialGradientKey="radialGradient"
      />
    </div>
  </div>
</template>

<script>
import {
  textclickfullselect,
  propertychangeeventhandler,
  selectiontypeprocessor,
} from "../../mixins";
import ColorConfigProperty from "./ColorConfigProperty.vue";
import { Point, CanvasKitUtils } from "figures";
import Property from "./Property.vue";
import { ActionFactory, CompositeAction } from "../../actions";

export default {
  name: "FillProperty",
  mixins: [
    textclickfullselect,
    propertychangeeventhandler,
    selectiontypeprocessor,
  ],
  components: { ColorConfigProperty, Property },
  methods: {
    colorTypeChanged(type) {
      this.changeModelsProperty(this.selections, "fill", type);
    },
    colorChanged(events) {
      this.propertyChange(events);
    },

    linearGradientChanged(event) {
      this.propertyChange(event);
    },

    radialGradientChanged(event) {
      this.propertyChange(event);
    },

    gradientStopsChanged(event) {
      let models = event.models;
      let stops = event.stops;
      let ca = new CompositeAction();
      models.forEach((model) => {
        if (model.fill == 2) {
          let action = ActionFactory.newUpdateLinearGraidentStopsAction(
            model,
            stops,
            "linearGradient"
          );
          ca.add(action);
        }
        if (model.fill == 3) {
          let action = ActionFactory.newUpdateRadialGraidentStopsAction(
            model,
            stops,
            "radialGradient"
          );
          ca.add(action);
        }
      });
      if (!ca.isEmpty) this.excuteAction(ca);
    },
  },

  computed: {
    fillMode: {
      get() {
        let mode = this.getAnyPropertyValue(
          this.selections,
          "blendMode",
          CanvasKitUtils.BlendModeOptions.get(3)
        );
        if (mode) return mode.value;
      },
      set(v) {
        let mode = CanvasKitUtils.BlendModeOptions.get(Number.parseInt(v));
        if (mode)
          this.changeModelsProperty(this.selections, "blendMode", mode.mode);
      },
    },
    modeOptions() {
      let obj = {};
      CanvasKitUtils.BlendModeOptions.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    },
    hasFillProperty() {
      if (!this.isEmptySelections) {
        for (let index = 0; index < this.selections.length; index++) {
          const selection = this.selections[index];
          if (selection instanceof Point) return false;
        }
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
</style>