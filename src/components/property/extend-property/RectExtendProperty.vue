<template>
  <div class="property-row">
    <property
      name="rx"
      pk="radiusx"
      :fixed="0"
      :models="selections"
      @property:change="propertyChange"
    />
    <property
      name="ry"
      pk="radiusy"
      :fixed="0"
      :models="selections"
      @property:change="propertyChange"
    />
  </div>
</template>

<script>
import Property from "../Property.vue";
import BaseExtendProperty from "./BaseExtendProperty";

export default {
  components: { Property },
  extends: BaseExtendProperty,
  name: "rect-extend-property",
};
</script>

<style>
</style>