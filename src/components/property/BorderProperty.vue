<template>
  <div>
    <div v-if="!hasBorderProperty" style="text-algin: left; color: grey">
      <small>Invalidate</small>
    </div>
    <div v-else>
      <div class="property-row">
        <Property
          :multiple="true"
          defaultValue="0"
          name="Width"
          pk="borderWidth"
          :models="selections"
          @property:change="propertyChange"
        />
        <Property
          :multiple="true"
          defaultValue="2"
          name="Miter"
          pk="miter"
          :models="selections"
          @property:change="propertyChange"
        />
      </div>

      <div class="single-row">
        <div class="property-item">
          <div class="property-label">
            <label title="Line Join Type"
              ><i class="iconfont icon-join-bevel"></i
            ></label>
          </div>
          <div class="property-value" style="width: 50%">
            <div
              class="btn-group btn-group-sm"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                class="btn-check"
                name="btnradio1"
                id="btnradio1"
                autocomplete="off"
                :value="0"
                v-model="joinValue"
              />
              <label
                class="btn btn-outline-secondary"
                for="btnradio1"
                title="Miter Join"
                ><i class="iconfont icon-join-miter"></i
              ></label>

              <input
                type="radio"
                class="btn-check"
                name="btnradio1"
                id="btnradio2"
                autocomplete="off"
                :value="1"
                v-model="joinValue"
              />
              <label
                class="btn btn-outline-secondary"
                for="btnradio2"
                title="Round Join"
                ><i class="iconfont icon-join-round"></i
              ></label>

              <input
                type="radio"
                class="btn-check"
                name="btnradio1"
                id="btnradio3"
                autocomplete="off"
                :value="2"
                v-model="joinValue"
              />
              <label
                class="btn btn-outline-secondary"
                for="btnradio3"
                title="Bevel Join"
                ><i class="iconfont icon-join-bevel"></i
              ></label>
            </div>
          </div>
        </div>
      </div>

      <div class="single-row">
        <div class="property-item">
          <div class="property-label">
            <label title="Line Cap"
              ><i class="iconfont icon-cap-butt"></i
            ></label>
          </div>
          <div class="property-value" style="width: 50%">
            <div
              class="btn-group btn-group-sm"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="cap-btnradio1"
                autocomplete="off"
                :value="0"
                v-model="capValue"
              />
              <label
                class="btn btn-outline-secondary"
                for="cap-btnradio1"
                title="Butt Cap"
                ><i class="iconfont icon-cap-butt"></i
              ></label>

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="cap-btnradio2"
                autocomplete="off"
                :value="1"
                v-model="capValue"
              />
              <label
                class="btn btn-outline-secondary"
                for="cap-btnradio2"
                title="Round Cap"
              >
                <i class="iconfont icon-cap-round"></i>
              </label>

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="cap-btnradio3"
                autocomplete="off"
                :value="2"
                v-model="capValue"
              />
              <label
                class="btn btn-outline-secondary"
                for="cap-btnradio3"
                title="Square Cap"
                ><i class="iconfont icon-cap-square"></i
              ></label>
            </div>
          </div>
        </div>
      </div>

      <div class="property-row">
        <Property
          :multiple="true"
          defaultValue="0"
          name="Offset"
          pk="dashOffset"
          :models="selections"
          @property:change="propertyChange"
        />
        <Property
          :multiple="true"
          defaultValue="0"
          name="Length"
          pk="dashLength"
          :models="selections"
          @property:change="propertyChange"
        />
      </div>

      <div class="gray-splitter"></div>

      <color-config-property
        id="border-"
        :models="currentModels"
        colorTypeProperty="showBorder"
        @color:change="colorChanged"
        @colorType:change="colorTypeChanged"
        @linear-gradient:change="linearGradientChanged"
        @radial-gradient:change="radialGradientChanged"
        @linear-gradient:stopschange="gradientStopsChanged"
        @radial-gradient:stopschange="gradientStopsChanged"
        rpk="br"
        gpk="bg"
        bpk="bb"
        apk="ba"
        linearGradientKey="borderLinearGradient"
        radialGradientKey="borderRadialGradient"
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
import { CanvasKitUtils, Point, ImageFigure } from "figures";
import Property from "./Property.vue";
import ColorProperty from "./ColorProperty.vue";
import ColorConfigProperty from "./ColorConfigProperty.vue";
import { ActionFactory, CompositeAction } from "../../actions";

export default {
  name: "BorderProperty",
  mixins: [
    textclickfullselect,
    propertychangeeventhandler,
    selectiontypeprocessor,
  ],
  components: { Property, ColorProperty, ColorConfigProperty },

  computed: {
    joinValue: {
      get() {
        if (this.join) return this.join.value;
      },
      set(v) {
        v = Number.parseInt(v);
        let c;
        switch (v) {
          case 0:
            c = CanvasKitUtils.StrokeJoin.Miter;
            break;
          case 1:
            c = CanvasKitUtils.StrokeJoin.Round;
            break;
          case 2:
            c = CanvasKitUtils.StrokeJoin.Bevel;
            break;
        }
        if (!c || c == this.join) return;
        this.changeModelsProperty(this.selections, "join", c);
      },
    },
    capValue: {
      get() {
        if (this.cap) return this.cap.value;
      },
      set(v) {
        v = Number.parseInt(v);
        let c;
        switch (v) {
          case 0:
            c = CanvasKitUtils.StrokeCap.Butt;
            break;
          case 1:
            c = CanvasKitUtils.StrokeCap.Round;
            break;
          case 2:
            c = CanvasKitUtils.StrokeCap.Square;
            break;
        }
        if (!c || c == this.cap) return;
        this.changeModelsProperty(this.selections, "cap", c);
      },
    },
    width: {
      get() {
        return this.getAnyPropertyValue(this.selections, "borderWidth", 0);
      },
      set(w) {
        let v = Number.parseInt(w);
        this.changeModelsProperty(this.selections, "borderWidth", v);
      },
    },
    miter: {
      get() {
        return this.getAnyPropertyValue(this.selections, "miter", 0);
      },
      set(w) {
        let v = Number.parseInt(w);
        this.changeModelsProperty(this.selections, "miter", v);
      },
    },
    join: {
      get() {
        return this.getAnyPropertyValue(
          this.selections,
          "join",
          CanvasKitUtils.StrokeCap.Bevel
        );
      },
    },
    cap: {
      get() {
        return this.getAnyPropertyValue(
          this.selections,
          "cap",
          CanvasKitUtils.StrokeCap.Butt
        );
      },
    },

    showBorder() {
      return this.getAnyPropertyValue("showBorder", false);
    },

    hasBorderProperty() {
      if (!this.isEmptySelections) {
        for (let index = 0; index < this.selections.length; index++) {
          const selection = this.selections[index];
          if (selection instanceof Point || selection instanceof ImageFigure) return false;
        }
        return true;
      }
      return false;
    },

    currentModels() {
      return this.selections;
    },
  },
  methods: {
    canChangeProperty(model) {
      if (model instanceof Point) return false;
      return true;
    },
    colorTypeChanged(type) {
      this.changeModelsProperty(this.selections, "showBorder", type);
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
        if (model.showBorder == 2) {
          let action = ActionFactory.newUpdateLinearGraidentStopsAction(
            model,
            stops,
            "borderLinearGradient"
          );
          ca.add(action);
        }
        if (model.showBorder == 3) {
          let action = ActionFactory.newUpdateRadialGraidentStopsAction(
            model,
            stops,
            "borderRadialGradient"
          );
          ca.add(action);
        }
      });
      if (!ca.isEmpty) this.excuteAction(ca);
    },
  },
};
</script>

<style>
.button-group-container {
  display: flex;
  justify-content: flex-start;
  width: 80%;
}

.radio-group-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 5px;
}
</style>