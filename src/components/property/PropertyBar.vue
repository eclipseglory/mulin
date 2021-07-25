<template>
  <small>
    <div id="property-view" class="darkbg">
      <div id="selection-title">
        <i id="title-icon" class="iconfont" :class="titleIcon"></i>
        <strong>{{ title }}</strong>
      </div>
      <div id="properties-accordions-container">
        <div
          class="accordion accordion-flush properties-accordion-root"
          id="collapse-root"
        >
          <div class="accordion-item properties-accordion-item">
            <div class="accordion-header" id="basic-properties">
              <button
                id="accordion-button1"
                class="accordion-button properties-accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="true"
                aria-controls="flush-collapseOne"
              >
                <small
                  ><i
                    class="iconfont icon-position"
                    style="margin-right: 5px"
                  ></i
                  ><span>General</span>
                </small>
              </button>
            </div>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="basic-properties"
              data-bs-parent="#collapse-root"
            >
              <div class="property-accordion-contents">
                <div v-if="canShow">
                  <div v-if="canShow" class="property-row">
                    <Property
                      name="X"
                      pk="x"
                      :fixed="0"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                    <Property
                      name="Y"
                      pk="y"
                      :fixed="0"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                  </div>
                  <div v-if="showDimension" class="property-row">
                    <Property
                      icon="icon-width"
                      name="Width"
                      pk="width"
                      :fixed="0"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                    <Property
                      icon="icon-height"
                      name="Height"
                      pk="height"
                      :fixed="0"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                  </div>
                  <div v-if="showScale" class="property-row">
                    <Property
                      icon="icon-scaly-x"
                      name="ScaleX"
                      pk="scalex"
                      :step="0.1"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                    <Property
                      icon="icon-scale-y"
                      name="ScaleY"
                      pk="scaley"
                      :step="0.1"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                  </div>
                  <div v-if="showSkew" class="property-row">
                    <Property
                      icon="icon-x-skew"
                      name="Skew X"
                      pk="skewx"
                      :transformToAngel="true"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                    <Property
                      icon="icon-y-skew"
                      name="Skew Y"
                      pk="skewy"
                      :transformToAngel="true"
                      :models="selections"
                      @property:change="propertyChange"
                    />
                  </div>
                  <div v-if="showRotation" class="property-row">
                    <div style="width: 50%">
                      <Property
                        icon="icon-rotation"
                        name="Rotation"
                        pk="rotation"
                        :transformToAngel="true"
                        :models="selections"
                        @property:change="propertyChange"
                      />
                    </div>
                  </div>

                  <div class="gray-splitter"></div>

                  <!-- 不同figure的扩展属性 -->
                  <component :is="specialPropertiesComponent" />
                </div>
                <small v-else style="color: #777777">Invalidate</small>
              </div>
            </div>
          </div>
          <div class="accordion-item properties-accordion-item">
            <h2 class="accordion-header" id="border-property">
              <button
                class="accordion-button collapsed properties-accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                <small>
                  <i class="iconfont icon-border" style="margin-right: 5px"></i>
                  <span>Border</span></small
                >
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="border-property"
              data-bs-parent="#collapse-root"
            >
              <div class="property-accordion-contents">
                <BorderProperty />
              </div>
            </div>
          </div>
          <div class="accordion-item properties-accordion-item">
            <h2 class="accordion-header" id="flush-headingThree">
              <button
                class="accordion-button collapsed properties-accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                <small>
                  <i class="iconfont icon-fill" style="margin-right: 5px"></i>
                  <span>Fill</span>
                </small>
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#collapse-root"
            >
              <div class="property-accordion-contents">
                <fill-property />
              </div>
            </div>
          </div>
        </div>
      </div></div
  ></small>
</template>

<script>
import BorderProperty from "./BorderProperty.vue";
import { Point } from "figures";
import Property from "./Property.vue";
import FillProperty from "./FillProperty.vue";
import Utils from "../../utils";
import {
  selectiontypeprocessor,
  propertychangeeventhandler,
} from "../../mixins";
import { defineAsyncComponent } from "vue";

const mixins = [propertychangeeventhandler, selectiontypeprocessor];
const components = {
  Property,
  BorderProperty,
  FillProperty,
};

export default {
  name: "PropertyBar",
  mixins,
  components,
  computed: {
    specialPropertiesComponent() {
      if (this.isRect) {
        return defineAsyncComponent(() =>
          import("./extend-property/RectExtendProperty")
        );
      }
      if (this.isVertex) {
        return defineAsyncComponent(() =>
          import("./extend-property/VerticesExtendProperty")
        );
      }
      if (this.isPath) {
        return defineAsyncComponent(() =>
          import("./extend-property/PathExtendProperty")
        );
      }
      if (this.isStar) {
        return defineAsyncComponent(() =>
          import("./extend-property/StarExtendProperty")
        );
      }
      if (this.isPolygon) {
        return defineAsyncComponent(() =>
          import("./extend-property/PolygonExtendProperty")
        );
      }
      if (this.isText) {
        return defineAsyncComponent(() =>
          import("./extend-property/TextExtendProperty")
        );
      }
    },
    title() {
      if (this.isEmptySelections) {
        return "No Selections";
      } else {
        if (this.selections) {
          if (this.selections.length > 1) {
            return "Multiple Selections";
          } else {
            let selection = this.currentSelection;
            if (selection.name) return selection.name;
            if (selection instanceof Point) return "Vertex";
            return "Unknown";
          }
        }
      }
    },

    titleIcon() {
      if (this.isEmptySelections) {
      } else {
        if (this.selections) {
          if (this.selections.length > 1) {
            return "icon-shapes";
          } else {
            let selection = this.currentSelection;
            return Utils.objectIcon(selection);
          }
        }
      }
    },

    canShow() {
      return this.isSingleSelection;
    },

    showDimension() {
      if (this.canShow) {
        if (this.isVertex || this.isPath || this.isLine || this.isText)
          return false;
        return true;
      }
      return false;
    },

    showScale() {
      if (this.canShow) {
        if (this.isVertex) return false;
        return true;
      }
      return false;
    },

    showSkew() {
      if (this.canShow) {
        if (this.isVertex) return false;
        return true;
      }
      return false;
    },

    showRotation() {
      if (this.canShow) {
        if (this.isVertex) return false;
        return true;
      }
      return false;
    },
  },
  methods: {},
};
</script>

<style>
#vertex-type-container {
  width: 100%;
  display: flex;
  justify-content: baseline;
  align-items: center;
  flex-direction: column;
}

.sub-property-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.single-row {
  width: 100%;
  padding: 5px 0 0 0;
  box-sizing: border-box;
}

#title-icon {
  margin-left: 10px;
  margin-right: 10px;
}
#selection-title {
  width: 100%;
  text-align: start;
  font-size: 1em;
  padding-bottom: 5px;
  box-sizing: border-box;
  border-bottom: #777777 solid 1px;
}

#property-view {
  height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
  color: whitesmoke;
  border-radius: 5px;
}

.properties-accordion-root {
  background-color: transparent;
}

#properties-accordions-container {
  flex-grow: 1;
  width: 100%;
  padding-top: 10px;
  max-height: 100%;
  box-sizing: border-box;
  background-color: transparent;
}

#collapse-root {
  height: 100%;
}

#properties-accordion-root {
  height: 100%;
}

.properties-accordion-body {
  display: flex;
  flex-direction: column;
}

.property-item {
  display: flex;
  color: #dddddd;
  justify-content: space-between;
  width: 100%;
  align-items: baseline;
}
.property-input {
  border: none;
  background-color: transparent;
  color: #dddddd;
  border-bottom: transparent solid 1px;
  border-radius: 0;
}

.property-input:focus {
  color: whitesmoke;
  background-color: transparent;
  box-shadow: none;
  border-bottom: whitesmoke solid 1px;
  border-radius: 0;
}

.property-row {
  display: flex;
  flex: 50% 50%;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 5px 0 0 0;
}

.property-accordion-contents {
  padding: 10px 0 10px 0;
  box-sizing: border-box;
  color: #dddddd;
}

.properties-accordion-item {
  background-color: transparent;
}

.properties-accordion-button {
  background-color: #313131;
  color: whitesmoke;
}

.properties-accordion-button:focus {
  box-shadow: none;
  color: whitesmoke;
}
.properties-accordion-button:not(.collapsed) {
  color: whitesmoke;
  background-color: #313131;
}

.properties-accordion-button::after {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z'/%3E%3C/svg%3E");
}

.properties-accordion-button:not(.collapsed):after {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z'/%3E%3C/svg%3E");
  transform: rotate(180deg);
}

.properties-accordion-body {
  padding: 5px 0px 5px 0px;
  box-sizing: border-box;
}
</style>