<template>
  <div>
    <div class="sub-property-row">
      <div id="vertex-type-container">
        <div style="width: 100%; text-align: start; margin: 5px 0 0px 0">
          <!-- <div style="margin-bottom: 5px">
                        <small>Vertex Type</small>
                      </div>
                      <ul
                        class="pagination pagination-sm justify-content-start"
                      >
                        <li
                          id="vertexType0"
                          @click.stop="changeVertexType"
                          :class="vertexType == 0 ? 'active' : ''"
                          class="page-item"
                        >
                          <label class="page-link"
                            ><i class="fas fa-wave-square"></i
                          ></label>
                        </li>
                        <li
                          id="vertexType1"
                          class="page-item"
                          :class="vertexType == 1 ? 'active' : ''"
                          @click.stop="changeVertexType"
                        >
                          <label class="page-link"
                            ><i class="fas fa-bezier-curve"></i
                          ></label>
                        </li>
                        <li
                          id="vertexType2"
                          class="page-item"
                          :class="vertexType == 2 ? 'active' : ''"
                          @click.stop="changeVertexType"
                        >
                          <label class="page-link"
                            ><i class="fas fa-code-branch"></i
                          ></label>
                        </li>
                      </ul> -->
        </div>

        <div style="height: 1px; width: 100%; background-color: #444444"></div>
      </div>
    </div>
    <div class="sub-property-row">
      <div class="single-row">
        <div class="form-check form-switch">
          <label for="inController">In Controller</label>
          <input
            @change="controllerChange"
            :checked="hasInController"
            class="form-check-input"
            type="checkbox"
            id="inController"
          />
        </div>
      </div>
      <div v-if="hasInController" class="property-row">
        <Property
          name="x"
          pk="inX"
          :fixed="0"
          :models="selections"
          @property:change="propertyChange"
        />
        <Property
          name="y"
          pk="inY"
          :fixed="0"
          :models="selections"
          @property:change="propertyChange"
        />
      </div>
    </div>

    <div class="sub-property-row">
      <div class="single-row">
        <div class="form-check form-switch">
          <label for="outController">Out Controller</label>
          <input
            @change="controllerChange"
            :checked="hasOutController"
            class="form-check-input"
            type="checkbox"
            id="outController"
          />
        </div>
      </div>
      <div v-if="hasOutController" class="property-row">
        <Property
          name="x"
          pk="outX"
          :fixed="0"
          :models="selections"
          @property:change="propertyChange"
        />
        <Property
          name="y"
          pk="outY"
          :fixed="0"
          :models="selections"
          @property:change="propertyChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Property from "../Property.vue";
import BaseExtendProperty from "./BaseExtendProperty";

export default {
  components: { Property },
  extends: BaseExtendProperty,
  name: "vertices-extend-property",
  methods: {
    changeVertexType(event) {
      // TODO 实现这个方法
      // let str = event.currentTarget.id;
      // if (!str) return;
      // let index = str.indexOf("vertexType");
      // if (index == -1) return;
      // let typeStr = str.substring(index + 10);
    },
    controllerChange(event) {
      let property = "in";
      if (event.target.id == "outController") property = "out";
      let model = this.currentSelection;
      let checked = event.target.checked;
      let value = null;
      if (checked) {
        value = [model.x, model.y];
      }
      this.changeProperty(model, property, value);
    },
  },

  computed: {
    vertexType() {
      if (this.isVertex) {
        return this.currentSelection.type;
      }
    },
    hasInController() {
      if (this.isVertex) {
        return this.currentSelection.in != null;
      }
      return false;
    },

    hasOutController() {
      if (this.isVertex) {
        return this.currentSelection.out != null;
      }
      return false;
    },
  },
};
</script>

<style>
</style>