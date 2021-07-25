<template>
  <div id="editor-main">
    <div id="work-space-switcher" class="darkbg">
      <WrokspaceSwitcher @swichComponent="changeComponent" />
    </div>
    <div style="flex-grow: 1; max-height: 100%; min-height: 100%">
      <component :is="mainWorkComponent" />
    </div>
  </div>
</template>

<script>
import WrokspaceSwitcher from "./WorkspaceSwitcher.vue";
import { defineAsyncComponent } from "vue";

export default {
  name: "Main",
  components: {
    WrokspaceSwitcher,
  },
  emits: ["tooltip:update"],

  methods: {
    changeComponent(event) {
      this.currentMainComponent = event.path;
    },
  },

  data() {
    return {
      currentMainComponent: "Drawer",
    };
  },

  computed: {
    mainWorkComponent() {
      if (this.currentMainComponent == "Drawer") {
        return defineAsyncComponent(() => import("./Drawer.vue"));
      }
      if (this.currentMainComponent == "Animation") {
        return defineAsyncComponent(() => import("./Animation.vue"));
      }
    },
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

#work-space-switcher {
  width: 3em;
  max-height: 100%;
  min-height: 100%;
  padding: 5px 0 5px 0;
  box-sizing: border-box;
}
</style>