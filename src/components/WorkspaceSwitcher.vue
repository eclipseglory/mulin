<template>
  <div style="width: 100%; height: 100%" class="column-icons-container">
    <div
      v-for="(s, key) in switchers"
      :key="key"
      :class="s.actived ? 'column-icon-button-actived' : 'column-icon-button'"
    >
      <i
        :class="'iconfont ' + s.icon + ' switch-icon'"
        @click="clickSwitchIcon(key)"
      ></i>
    </div>
  </div>
</template>

<script>
import docmanager from "../store/doc-store-mapper";

const mixins = [docmanager];

export default {
  mixins,
  emits: ["swichComponent"],
  data() {
    return {
      switchers: {
        Drawer: {
          icon: "icon-drawing",
          actived: true,
          path: "Drawer",
        },
        Animation: {
          icon: "icon-animation",
          actived: false,
          path: "Animation",
        },
      },
    };
  },
  methods: {
    clickSwitchIcon(id) {
      if (this.switchers[id] && !this.switchers[id].actived) {
        for (let key in this.switchers) {
          this.switchers[key].actived = false;
        }
        this.switchers[id].actived = true;
        let p = this.switchers[id].path;
        if (p) {
          this.switchWorkspace(id);
          this.$emit("swichComponent", { path: p });
        }
      }
    },
  },
};
</script>

<style>
.column-icons-container {
  display: flex;
  flex-direction: column;
}

.column-icon-button {
  padding: 5px;
  box-sizing: border-box;
  border-left: 2px solid transparent;
  color: #777777;
}

.column-icon-button-actived {
  padding: 5px;
  box-sizing: border-box;
  border-left: 2px solid whitesmoke;
  color: whitesmoke;
}

.switch-icon {
  font-size: 1.8em;
}

.switch-icon:hover {
  cursor: pointer;
  color: whitesmoke;
}
</style>