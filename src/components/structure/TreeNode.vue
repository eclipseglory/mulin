<template>
  <div>
    <div class="tree-node" v-if="model != null">
      <div class="tree-node-label" @click="expand">
        <div
          :id="'collapse-icon-' + model.id"
          v-if="hasChildren"
          class="collapse-icon"
          :class="collapsed ? 'collapse-icon-rotate' : ''"
        >
          <i class="iconfont icon-arrow-right" style="font-size: 1em"></i>
        </div>
        <div v-else style="width: 1.4em"></div>
        <i class="iconfont node-icon" :class="nodeIcon"></i>
        <small>{{ model.name }}</small>
      </div>
      <div class="tree-node-contents" :style="'padding-left:2em'">
        <div v-if="collapsed">
          <tree-node
            v-for="child in children"
            v-bind:key="child.id"
            :model="child"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from "../../utils";
export default {
  name: "TreeNode",
  data() {
    return {
      iconWidth: 0,
    };
  },
  updated() {
    if (!this.model) return;
    let e = this.$el;
    let a = e.querySelector("#collapse-icon-" + this.model.id);
    if (a == null) return;
    this.iconWidth = a.clientWidth;
  },
  computed: {
    collapsed() {
      if (!this.model) return false;
      if (this.model.collapsed == null) {
        this.model.collapsed = true;
      }
      return this.model.collapsed;
    },

    nodeIcon() {
      return Utils.objectIcon(this.model);
    },

    children() {
      if (this.hasChildren) return this.model.children;
    },

    hasChildren() {
      if (this.model && this.model.children)
        return this.model.children.length > 0;
    },
  },
  methods: {
    expand(event) {
      if (!this.hasChildren) return;
      if (this.model.collapsed == null) {
        this.model.collapsed = true;
      } else this.model.collapsed = !this.model.collapsed;
    },
  },
  props: {
    model: {
      type: Object,
    },
  },
};
</script>

<style>
.tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tree-node-label {
  padding: 5px 0 5px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #aaaaaa;
  width: 100%;
}

.tree-node-label:hover {
  color: whitesmoke;
  cursor: pointer;
}

.tree-node-contents {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;
  box-sizing: border-box;
}

.collapse-icon,
.collapse-icon-rotate {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.2em 0 0.2em;
  box-sizing: border-box;
}

.collapse-icon-rotate {
  transform: rotate(90deg);
}

.node-icon {
  margin-right: 2px;
  font-size: 1em;
}
</style>