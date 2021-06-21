<template>
  <div class="sub-property-row">
    <div class="property-row">
      <Property
        name="sides"
        pk="sides"
        :fixed="0"
        :models="selections"
        @property:change="propertyChange"
      />
    </div>
  </div>
</template>

<script>
import Property from "../Property.vue";
import BaseExtendProperty from "./BaseExtendProperty";

export default {
  components: { Property },
  extends: BaseExtendProperty,
  name: "polygon-extend-property",
};
</script>

<style>
</style>