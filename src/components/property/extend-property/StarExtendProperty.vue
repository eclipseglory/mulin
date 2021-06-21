<template>
  <div class="sub-property-row">
    <div class="property-row">
      <Property
        name="corners"
        pk="corners"
        :fixed="0"
        :models="selections"
        @property:change="propertyChange"
      />
      <Property
        name="inner"
        pk="radius"
        :fixed="2"
        :step="0.1"
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
  name: "star-extend-property",
};
</script>

<style>
</style>