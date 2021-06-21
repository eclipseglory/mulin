<template>
  <div class="sub-property-row">
    <div class="single-row">
      <div class="form-check form-switch">
        <label for="closePath">Closed</label>
        <input
          @change="pathCloseChange"
          :checked="pathClosed"
          class="form-check-input"
          type="checkbox"
          id="closePath"
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
  name: "path-extend-property",

  methods: {
    pathCloseChange(event) {
      let checked = event.target.checked;
      this.changeProperty(this.currentSelection, "close", checked);
    },
  },

  computed: {
    pathClosed() {
      return this.currentSelection.close;
    },
  },
};
</script>

<style>
</style>