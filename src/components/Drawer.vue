<template>
  <div id="drawer-space">
    <div style="width: 14.2%">
      <div style="width: 100%; min-height: 61.8%; max-height: 61.8%">
        <document />
      </div>
      <div
        style="width: 100%; min-height: 37%; max-height: 37%"
        class="resource-panel"
      >
        <resource-panel />
      </div>
    </div>
    <div style="flex-grow: 1">
      <Canvas />
    </div>
    <div style="width: 14.2%; padding: 5px;box-sizing:border-box">
      <PropertyBar />
    </div>
  </div>
</template>

<script>
import Document from "./structure/Document.vue";
import ResourcePanel from "./structure/ResourcePanel.vue";
import Canvas from "./workspace/Canvas.vue";
import PropertyBar from "./property/PropertyBar.vue";
const components = { Document, ResourcePanel, Canvas, PropertyBar };
export default {
  components,
};
</script>

<style>
#drawer-space {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
}
</style>