<template>
  <div id="editor-main">
    <div id="main-left" class="darkbg main-left-panel">
      <div style="width: 100%; min-height: 61.8%; max-height: 61.8%">
        <document />
      </div>
      <div
        style="width: 100%; min-height: 37%; max-height: 37%"
        class="resource-panel"
      >
        <resource-panel />
        <!-- <div
          class="gray-splitter"
          style="height: 5px; background-color: #414141; margin-bottom: 0px;width:100%"
        ></div>
        <div style="flex-grow: 1">
          <resource-panel />
        </div> -->
      </div>
    </div>
    <div id="main-center">
      <Canvas
        ref="canvas"
        @selection:change="selectionChange"
        @tooltip:update="tooltipUpdate"
      />
    </div>
    <div id="main-right">
      <PropertyBar />
    </div>
  </div>
</template>

<script>
import ToolsBar from "./workspace/ToolsBar.vue";
import PropertyBar from "./property/PropertyBar.vue";
import Canvas from "./workspace/Canvas.vue";
import Document from "./structure/Document.vue";
import ResourcePanel from "./structure/ResourcePanel.vue";

export default {
  name: "Main",
  components: {
    ToolsBar,
    PropertyBar,
    Canvas,
    Document,
    ResourcePanel,
  },
  emits: ["tooltip:update"],

  methods: {
    createNewDocument(event) {
      if (event.type != "create") return;
      this.$refs["canvas"].createNewMainRoot(
        event.width,
        event.height,
        event.name
      );
    },
    tooltipUpdate(event) {
      this.$emit("tooltip:update", event);
    },
    selectionChange(event) {
      // 分发selection去其他components
      this.selections = event.selections;
    },
    propertyChange(events) {
      this.$refs["canvas"].changeFigureProperty(events);
    },
  },

  data() {
    return {
      currentTool: "select",
      selections: [],
    };
  },
};
</script>

<style>
#editor-main {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

#editor-main:focus {
  border: none;
}

#main-left {
  width: 14.6%;
  max-height: 100%;
  min-height: 100%;
  box-sizing: border-box;
}

#main-right {
  width: 14.6%;
}

#main-center {
  flex-grow: 1;
}

.main-left-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.resource-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: col-resize;
}
</style>