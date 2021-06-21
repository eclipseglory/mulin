<template>
  <div class="text-extend-class">
    <div class="single-row">
      <div class="property-item label-value-container" title="Font family">
        <div class="property-label">
          <i class="iconfont icon-font-family"></i>
        </div>
        <div class="property-value" style="width: 70%">
          <select class="form-select form-select-sm" v-model="currentFont">
            <option v-for="font in fonts" :key="font" :value="font">
              {{ font }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="single-row">
      <Property
        name="Font Size"
        icon="icon-font-size"
        pk="size"
        :fixed="1"
        :min="0.1"
        :models="selections"
        @property:change="propertyChange"
      />
    </div>

    <div class="property-row">
      <Property
        icon="icon-text-spacing"
        name="Letter space"
        pk="letterSpace"
        :models="selections"
        @property:change="propertyChange"
      />
      <Property
        icon="icon-line-spacing"
        name="Line space"
        pk="lineSpace"
        :models="selections"
        @property:change="propertyChange"
      />
    </div>

    <div class="single-row">
      <div class="property-item">
        <label class="property-label" title="Letter Space">
          <i class="iconfont icon-text-spacing"></i>
        </label>
        <div class="property-value" style="width: 50%">
          <div
            class="btn-group btn-group-sm"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              class="btn-check"
              id="leftAlign"
              autocomplete="off"
              v-model="hAlign"
              value="left"
            />
            <label class="btn btn-outline-secondary" for="leftAlign"
              ><i class="iconfont icon-text-align-left"></i
            ></label>

            <input
              type="radio"
              class="btn-check"
              id="centerAlign"
              autocomplete="off"
              v-model="hAlign"
              value="center"
            />
            <label class="btn btn-outline-secondary" for="centerAlign"
              ><i class="iconfont icon-text-align-center"></i
            ></label>

            <input
              type="radio"
              class="btn-check"
              id="rightAlign"
              autocomplete="off"
              v-model="hAlign"
              value="right"
            />
            <label class="btn btn-outline-secondary" for="rightAlign"
              ><i class="iconfont icon-text-align-right"></i
            ></label>
          </div>
        </div>
      </div>
    </div>
    <!-- 从AI中没有就找到这类对齐，SVG也无法生成对应的，所以目前先禁用该选项 -->
    <!-- <div class="single-row">
      <div class="property-item">
        <label class="property-label" title="Line Space"
          ><i class="iconfont icon-line-spacing"></i
        ></label>
        <div class="property-value" style="width:50%">
          <div
            class="btn-group btn-group-sm"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              class="btn-check"
              id="topAlign"
              autocomplete="off"
              v-model="vAlign"
              value="top"
            />
            <label class="btn btn-outline-secondary" for="topAlign"
              ><i class="iconfont icon-text-align-top"></i
            ></label>

            <input
              type="radio"
              class="btn-check"
              id="midAlign"
              autocomplete="off"
              v-model="vAlign"
              value="middle"
            />
            <label class="btn btn-outline-secondary" for="midAlign"
              ><i class="iconfont icon-text-align-mid"></i
            ></label>

            <input
              type="radio"
              class="btn-check"
              id="bottomAlign"
              autocomplete="off"
              v-model="vAlign"
              value="bottom"
            />
            <label class="btn btn-outline-secondary" for="bottomAlign"
              ><i class="iconfont icon-text-align-bottom"></i
            ></label>
          </div>
        </div>
      </div> 
    </div>-->
  </div>
</template>

<script>
import Property from "../Property.vue";
import BaseExtendProperty from "./BaseExtendProperty";

export default {
  components: { Property },
  extends: BaseExtendProperty,
  name: "text-extend-property",
  computed: {
    currentFont: {
      get() {
        if (this.isText) {
          let s = this.currentSelection;
          return s.fontFamily;
        }
      },

      set(v) {
        this.changeProperty(this.currentSelection, "fontFamily", v);
      },
    },

    hAlign: {
      get() {
        if (this.isText) {
          let s = this.currentSelection;
          return s.hAlign;
        }
      },
      set(v) {
        console.log(v);
        this.changeProperty(this.currentSelection, "hAlign", v);
      },
    },

    vAlign: {
      get() {
        if (this.isText) {
          let s = this.currentSelection;
          return s.vAlign;
        }
      },
      set(v) {
        console.log(v);
        this.changeProperty(this.currentSelection, "vAlign", v);
      },
    },
  },
};
</script>

<style>
.text-extend-class {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#font-select-container {
  display: flex;
}
</style>