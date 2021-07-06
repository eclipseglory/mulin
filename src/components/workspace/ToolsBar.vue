<template>
  <div id="tool" class="darkbg">
    <div class="tools-group" v-for="group in groups" :key="group.name">
      <div class="tool-container" v-for="tool in group.tools" :key="tool.id">
        <button
          :id="tool.id"
          type="button"
          class="btn btn-primary action-button"
          @click="click"
        >
          <span :class="tool.id == currentTool ? '' : 'deactive-icon'"
            ><i class="iconfont" :class="tool.icon" style="font-size: 20px"></i
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolsBar",
  emits: ["tool:update"],
  props: {
    currentTool: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      groups: [
        {
          name: "Select Tools",
          tools: [
            {
              id: "select",
              icon: "icon-mousepointer",
            },
            {
              id: "vertex-select",
              icon: "icon-vertexpointer",
            },
          ],
        },

        {
          name: "Pen Tools",
          tools: [
            {
              id: "pen",
              icon: "icon-pen",
            },
            {
              id: "curve",
              icon: "icon-pen-curve",
            },
          ],
        },

        {
          name: "Text Tools",
          tools: [
            {
              id: "text",
              icon: "icon-text",
            },
            {
              id: "v-text",
              icon: "icon-v-text",
            },
          ],
        },

        {
          name: "Line Tools",
          tools: [
            {
              id: "line",
              icon: "icon-line",
            },
          ],
        },

        {
          name: "Shape Tools",
          tools: [
            {
              id: "rect",
              icon: "icon-square",
            },
            {
              id: "ellipse",
              icon: "icon-circle",
            },
            {
              id: "star",
              icon: "icon-star",
            },
            {
              id: "polygon",
              icon: "icon-polygon",
            },
          ],
        },
        {
          name: "Gradient Tools",
          tools: [
            { id: "linearGradient", icon: "icon-l-gradient" },
            { id: "radialGradient", icon: "icon-r-gradient" },
          ],
        },
      ],
    };
  },
  methods: {
    click(event) {
      if (this.disabled) return;
      let id = event.currentTarget.id;
      if (id) {
        if (this.currentTool != id) {
          this.$emit("tool:update", id);
        }
      }
    },

    iconClass(id) {
      if (this.disabled) return "deactive-icon";
      if (this.isActive(id)) {
        return "active-tool";
      } else {
        return "deactive-icon clickable-icon";
      }
    },

    isActive(id) {
      return id == this.currentTool && !this.disabled;
    },
  },
};
</script>

<style>
#tool {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px 5px 20px 5px;
}

.tools-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom: #333333 solid 1px;
  padding: 10px 0 10px 0;
  box-sizing: border-box;
}

.tool-container {
  flex: 50%;
  max-width: 50%;
}

.deactive-icon {
  color: #777777;
}

.active-tool {
  font-size: 16px;
  color: whitesmoke;
  cursor: pointer;
}

.clickable-icon {
  cursor: pointer;
  font-size: 16px;
}

.action-button {
  padding: 2px;
  border: none;
  box-shadow: none;
  background-color: transparent;
  color: #dddddd;
}

.action-button:focus {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.btn-primary.disabled,
.btn-primary:disabled {
  background-color: transparent;
  border-color: transparent;
  color: #777777;
}

.action-button:hover {
  background-color: transparent;
  border: none;
  box-shadow: none;
}
</style>