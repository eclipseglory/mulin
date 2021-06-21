<template>
  <div>
    <div class="single-row">
      <div class="color-config-root" style="width: 100%">
        <div
          class="btn-group btn-group-sm"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            class="btn-check"
            :id="id + 'fill_none'"
            autocomplete="off"
            v-model="colorType"
            :value="0"
          />
          <label
            class="btn btn-outline-secondary"
            :for="id + 'fill_none'"
            title="None"
            ><i class="iconfont icon-cancel"></i
          ></label>

          <input
            type="radio"
            class="btn-check"
            :id="id + 'fill'"
            autocomplete="off"
            v-model="colorType"
            :value="1"
          />
          <label
            class="btn btn-outline-secondary"
            :for="id + 'fill'"
            title="Regular Fill"
            ><i class="iconfont icon-fill"></i
          ></label>

          <input
            type="radio"
            class="btn-check"
            :id="id + 'l-gradient'"
            autocomplete="off"
            v-model="colorType"
            :value="2"
          />
          <label
            class="btn btn-outline-secondary"
            :for="id + 'l-gradient'"
            title="Linear Gradient"
            ><i class="iconfont icon-l-gradient"></i
          ></label>

          <input
            type="radio"
            class="btn-check"
            :id="id + 'r-gradient'"
            autocomplete="off"
            v-model="colorType"
            :value="3"
          />
          <label
            class="btn btn-outline-secondary"
            :for="id + 'r-gradient'"
            title="Radial Gradient"
            ><i class="iconfont icon-r-gradient"></i
          ></label>
        </div>
      </div>
    </div>

    <div v-if="colorType > 1" class="single-row">
      <div v-if="colorType == 2 && isSingleModel" class="property-row">
        <Property
          :models="[currentSingleModel[linearGradientKey]]"
          name="Sx"
          pk="x1"
          @property:change="linearGradientChange"
        />
        <Property
          :models="[currentSingleModel[linearGradientKey]]"
          name="Sy"
          pk="y1"
          @property:change="linearGradientChange"
        />
      </div>
      <div v-if="colorType == 2 && isSingleModel" class="property-row">
        <Property
          :models="[currentSingleModel[linearGradientKey]]"
          name="Ex"
          pk="x2"
          @property:change="linearGradientChange"
        />
        <Property
          :models="[currentSingleModel[linearGradientKey]]"
          name="Ey"
          pk="y2"
          @property:change="linearGradientChange"
        />
      </div>

      <div v-if="colorType == 3 && isSingleModel" class="property-row">
        <Property
          :models="[currentSingleModel[radialGradientKey]]"
          name="X"
          pk="x"
          @property:change="radialGradientChange"
        />
        <Property
          :models="[currentSingleModel[radialGradientKey]]"
          name="Y"
          pk="y"
          @property:change="radialGradientChange"
        />
      </div>
      <div v-if="colorType == 3 && isSingleModel" class="single-row">
        <Property
          :models="[currentSingleModel[radialGradientKey]]"
          name="r"
          pk="radius"
          @property:change="radialGradientChange"
        />
      </div>

      <div class="color-stops-container">
        <div class="color-strip">
          <div
            class="color-stops"
            ref="colorStrip"
            :style="stripStyle"
            @mousedown="addColorStop"
          >
            <div
              v-for="(stop, index) in colorStops"
              :key="index"
              :stop="stop"
              :style="getStopPosition(stop)"
              class="color-stop"
              :id="index"
              @mousedown.prevent.stop="colorStopMousedown"
              @mousemove.prevent="colorStopMousemove"
              @mouseup.prevent="colorStopMouseup"
              @mouseout.prevent="colorStopdeactive"
              @mouseleave.prevent="colorStopdeactive"
            ></div>
          </div>
        </div>
        <button
          class="btn btn-secondary btn-sm"
          :class="canDeleteStop ? '' : 'disabled'"
          @click="deleteCurrentStop"
        >
          <i class="iconfont icon-trash" />
        </button>
      </div>
    </div>

    <!-- <div class="gray-splitter"></div> -->
    <div v-if="canFill">
      <color-property
        title="Color"
        @property:change="colorChanged"
        :models="currentModels"
        :ak="apk"
        :rk="rpk"
        :bk="bpk"
        :gk="gpk"
      />
    </div>
    <div v-if="currentSelectStop != null" class="single-row">
      <Property
        :models="[currentSelectStop]"
        name="Pos"
        pk="pos"
        @property:change="currentStopPosChange"
      />
    </div>
  </div>
</template>

<script>
import ColorProperty from "./ColorProperty.vue";
import { Point, Utils } from "figures";
import { ColorStop } from "figures/gradient";
import Property from "./Property.vue";
import { ActionFactory } from "../../actions";
import {
  textclickfullselect,
  propertychangeeventhandler,
  selectiontypeprocessor,
} from "../../mixins";
import { toRaw } from "vue";
const mixins = [
  textclickfullselect,
  propertychangeeventhandler,
  selectiontypeprocessor,
];

export default {
  components: { ColorProperty, Property },
  mixins,
  emits: [
    "colorType:change",
    "color:change",
    "linear-gradient:change",
    "radial-gradient:change",
    "linear-gradient:stopschange",
    "radial-gradient:stopschange",
  ],
  data() {
    return {
      currentSelectStop: null,
      stripWidth: 0,
      colorStops: null,
    };
  },
  mounted() {
    this.createColorStops();
  },
  updated() {
    this.models;
    let strip = this.$refs["colorStrip"];
    if (strip) {
      let w = strip.clientWidth;
      if (w != this.stripWidth) {
        this.stripWidth = w;
      }
    }
  },

  methods: {
    isSameColorStop(s1, s2) {
      return (
        s1.color[0] == s2.color[0] &&
        s1.color[1] == s2.color[1] &&
        s1.color[2] == s2.color[2] &&
        s1.color[3] == s2.color[3] &&
        s1.pos == s2.pos
      );
    },
    getModelGradient(model) {
      if (this.colorType == 2) return model[this.linearGradientKey];
      if (this.colorType == 3) return model[this.radialGradientKey];
    },
    createColorStops() {
      this.colorStops = null;
      if (!this.models || this.models.length == 0) return;
      if (this.colorType > 1) {
        let first = this.models[0];
        let gradient = this.getModelGradient(first);
        let colorStops = [
          {
            color: [0, 0, 0, 1],
            pos: 0,
          },
          {
            color: [1, 1, 1, 1],
            pos: 1,
          },
        ];
        if (gradient) {
          colorStops = gradient.colorStops.map((item) => {
            return {
              color: [
                item.color[0],
                item.color[1],
                item.color[2],
                item.color[3],
              ],
              pos: item.pos,
            };
          });
        }
        let useDefault = false;
        for (let i = 1; i < this.models.length; i++) {
          const model = this.models[i];
          const g = this.getModelGradient(model);
          if (g.colorStops.length != colorStops.length) {
            useDefault = true;
            break;
          }
          for (let j = 0; j < colorStops.length; j++) {
            const gs = g.colorStops[j];
            if (!this.isSameColorStop(gs, colorStops[j])) {
              useDefault = true;
              break;
            }
          }
        }

        if (useDefault) {
          this.colorStops = [
            {
              color: [0, 0, 0, 1],
              pos: 0,
            },
            {
              color: [1, 1, 1, 1],
              pos: 1,
            },
          ];
        } else {
          this.colorStops = colorStops;
        }

        if (this.currentSelectStop) {
          for (let i = 0; i < this.colorStops.length; i++) {
            const cs = this.colorStops[i];
            if (this.isSameColorStop(cs, this.currentSelectStop)) {
              this.currentSelectStop = cs;
              break;
            }
          }
        }
      }
    },
    currentStopPosChange(event) {
      if (this.currentSelectStop) {
        let e = event[0];
        let v = e.value;
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        this.currentSelectStop.pos = v;
        // this.calculateGradientStyle();
        this.updateColorStops();
      }
    },
    deleteCurrentStop() {
      if (this.currentSelectStop) {
        let index = this.colorStops.indexOf(toRaw(this.currentSelectStop));
        if (index != -1) this.colorStops.splice(index, 1);
        this.updateColorStops();
        this.currentSelectStop = null;
      }
    },
    colorChanged(event) {
      if (this.colorType == 1) {
        this.$emit("color:change", event);
        return;
      }
      if (this.colorType > 1) {
        if (this.currentSelectStop) {
          event.forEach((e) => {
            if (e.property == this.rpk) {
              this.currentSelectStop.color[0] = e.value;
            }
            if (e.property == this.gpk) {
              this.currentSelectStop.color[1] = e.value;
            }
            if (e.property == this.bpk) {
              this.currentSelectStop.color[2] = e.value;
            }
            if (e.property == this.apk) {
              this.currentSelectStop.color[3] = e.value;
            }
          });
          this.updateColorStops();
        }
      }
    },

    colorStopsChanged(model, stops) {
      let changed = false;
      let currentStops;
      if (this.fillType == 2) {
        currentStops = model[this.linearGradientKey].colorStops;
      }
      if (this.fillType == 3) {
        currentStops = model[this.radialGradientKey].colorStops;
      }
      if (!currentStops) return false;
      if (currentStops.length != stops.length) changed = true;
      if (!changed) {
        for (let i = 0; i < currentStops.length; i++) {
          const s1 = currentStops[i];
          const s2 = stops[i];
          if (!s1.equals(s2)) {
            changed = true;
            break;
          }
        }
      }
      return changed;
    },

    updateColorStops() {
      let stops = this.colorStops.map(
        (stop) =>
          new ColorStop(
            stop.color[0],
            stop.color[1],
            stop.color[2],
            stop.color[3],
            stop.pos
          )
      );
      let event = { models: [], stops };
      for (let i = 0; i < this.models.length; i++) {
        const model = this.models[i];
        if (this.colorStopsChanged(model, stops)) {
          event.models.push(model);
        }
      }

      if (event.models.length > 0) {
        if (this.colorType == 2) {
          this.$emit("linear-gradient:stopschange", event);
        }
        if (this.colorType == 3) {
          this.$emit("radial-gradient:stopschange", event);
        }
      }
    },

    linearGradientChange(event) {
      this.$emit("linear-gradient:change", event);
    },

    radialGradientChange(event) {
      this.$emit("radial-gradient:change", event);
    },

    addColorStop(e) {
      let offsetX = e.offsetX;
      let value = offsetX / this.stripWidth;
      let stop = {
        color: [0, 0, 0, 1],
        pos: value,
      };
      this.colorStops.push(stop);
      this.colorStops.sort((a, b) => {
        return a.pos - b.pos;
      });
      let index = this.colorStops.indexOf(stop);
      // 在两头的颜色就取前一个颜色
      if (index == 0) {
        let c = this.colorStops[1];
        stop.color = [c.color[0], c.color[1], c.color[2], c.color[3]];
      }
      if (index == this.colorStops.length - 1) {
        let c = this.colorStops[this.colorStops.length - 2];
        stop.color = [c.color[0], c.color[1], c.color[2], c.color[3]];
      }

      // 在两个颜色之间需要计算：
      if (index != 0 && index != this.colorStops.length - 1) {
        let pIndex = index - 1;
        let nIndex = index + 1;
        let color1 = this.colorStops[pIndex];
        let color2 = this.colorStops[nIndex];
        let length = color2.pos - color1.pos;
        let percent = stop.pos - color1.pos;
        percent = percent / length;
        let resultRed = Math.floor(
          color1.color[0] + percent * (color2.color[0] - color1.color[0])
        );
        let resultGreen = Math.floor(
          color1.color[1] + percent * (color2.color[1] - color1.color[2])
        );
        let resultBlue = Math.floor(
          color1.color[2] + percent * (color2.color[2] - color1.color[2])
        );
        stop.color = [resultRed, resultGreen, resultBlue, 1];
      }
      this.currentSelectStop = stop;
      this.updateColorStops();
    },
    getStopPosition(stop) {
      let pos = stop.pos;
      let w = pos * this.stripWidth;
      let index = 0;
      if (stop == this.currentSelectStop) index = 1;
      let style = {
        left: `${w - 5}px`,
        "z-index": index,
        "background-color": `rgba(${stop.color[0]},${stop.color[1]},${stop.color[2]},${stop.color[3]})`,
      };
      if (stop == this.currentSelectStop) {
        style.border = "2px solid whitesmoke";
      }
      return style;
    },

    colorStopMousedown(event) {
      let target = event.target;
      target.focus();
      this.currentSelectStop = this.getStopById(target.id);
      this.selected = true;
    },

    colorStopMouseup(event) {
      this.colorStopdeactive();
    },

    colorStopMousemove(event) {
      if (!this.currentSelectStop || this.stripWidth == 0 || !this.selected)
        return;
      let x = event.movementX;
      let p = x / this.stripWidth;
      this.currentSelectStop.pos += p;
      if (this.currentSelectStop.pos < 0) this.currentSelectStop.pos = 0;
      if (this.currentSelectStop.pos > 1) this.currentSelectStop.pos = 1;
    },

    colorStopdeactive(event) {
      if (this.selected) {
        this.selected = false;
        this.updateColorStops();
      }
    },

    getStopById(id) {
      return this.colorStops[id];
    },
  },

  watch: {
    models: {
      handler() {
        this.createColorStops();
      },
      deep: true,
    },
    colorType(n, old) {
      this.createColorStops();
    },
  },

  computed: {
    gradient() {
      if (this.isSingleModel && this.colorType > 1) {
        let s = this.currentSingleModel;
        let gradient;
        if (this.colorType == 2) gradient = s[this.linearGradientKey];
        if (this.colorType == 3) gradient = s[this.radialGradientKey];
        return gradient;
      }
    },
    gradientString() {
      if (this.colorStops == null || this.colorStops.length == 0) return "";
      let str = "";
      this.colorStops.sort((a, b) => {
        return a.pos - b.pos;
      });
      for (let i = 0; i < this.colorStops.length; i++) {
        const stop = this.colorStops[i];
        str += `rgba(${stop.color[0]},${stop.color[1]},${stop.color[2]},${stop.color[3]})`;
        str += ` ${stop.pos * 100}%`;
        if (i < this.colorStops.length - 1) str += `,`;
      }
      return `linear-gradient(90deg,${str})`;
    },
    canDeleteStop() {
      return this.currentSelectStop != null && this.colorStops.length > 2;
    },
    currentModels() {
      if (this.fillType == 1) {
        return this.models;
      }
      if (this.fillType > 1) {
        if (this.currentSelectStop) {
          let obj = {};
          obj[this.rpk] = this.currentSelectStop.color[0];
          obj[this.gpk] = this.currentSelectStop.color[1];
          obj[this.bpk] = this.currentSelectStop.color[2];
          obj[this.apk] = this.currentSelectStop.color[3];
          return [obj];
        }
      }
    },

    currentSingleModel() {
      if (this.models && this.models.length == 1) return this.models[0];
    },
    canFill() {
      if (this.fillType == 0) return false;
      if (this.fillType == 1) return true;
      if (this.fillType == 2 || this.fillType == 3)
        return this.currentSelectStop != null;
    },
    isSingleModel() {
      return this.models && this.models.length == 1;
    },
    colorType: {
      get() {
        if (this.models)
          return this.getAnyPropertyValue(
            this.models,
            this.colorTypeProperty,
            0
          );
      },

      set(v) {
        this.$emit("colorType:change", v);
      },
    },

    fillType() {
      if (this.models)
        return this.getAnyPropertyValue(this.models, this.colorTypeProperty, 0);
    },

    stripStyle() {
      if (this.colorStops == null || this.colorStops.length == 0) return;
      return { background: `${this.gradientString}` };
    },
  },

  props: {
    id: {
      type: String,
      default: "color-config",
    },
    colorTypeProperty: {
      type: String,
    },
    models: {
      type: Array,
    },
    rpk: { type: String, default: "r" },
    gpk: { type: String, default: "g" },
    bpk: { type: String, default: "b" },
    apk: { type: String, default: "a" },
    linearGradientKey: { type: String, default: "linearGradient" },
    radialGradientKey: { type: String, default: "radialGradient" },
  },
};
</script>

<style>
.color-config-root {
  width: 100%;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  justify-content: center;
}

.color-stops-container {
  display: flex;
  flex: 90% 10%;
  padding: 5px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
}

.color-stops {
  height: 1em;
  flex-grow: 1;
  position: relative;
  border: 1px solid whitesmoke;
  border-radius: 0.2em;
}

.color-stops:hover {
  cursor: copy;
}

.color-strip {
  width: 100%;
  padding: 0 10px 0 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.color-stop {
  width: 10px;
  height: 1.5em;
  top: -0.25em;
  position: absolute;
  background-color: white;
  border: 1px solid #adb5bd;
  border-radius: 0.5em;
}

.color-stop:hover {
  cursor: pointer;
}
</style>