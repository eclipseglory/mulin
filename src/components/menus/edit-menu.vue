<template>
  <li>
    <a class="dropdown-item" @click="undo" :class="canUndo ? '' : 'disabled'">
      <small><label>Undo</label></small></a
    >
  </li>
  <li>
    <a class="dropdown-item" @click="redo" :class="canRedo ? '' : 'disabled'">
      <small><label>Redo</label></small></a
    >
  </li>
  <li><hr class="dropdown-divider" /></li>
  <li>
    <a
      class="dropdown-item"
      @click="deleteSelections"
      :class="canDelete ? '' : 'disabled'"
    >
      <small><label>Delete</label></small></a
    >
  </li>
</template>

<script>
import baseMenuVue from "./base-menu.vue";

import { selectiondeleteprocessor } from "../../mixins";

const mixins = [selectiondeleteprocessor];
export default {
  extends: baseMenuVue,
  mixins,
  computed: {
    canRedo() {
      if (this.actionStack) return this.actionStack.canRedo();
    },
    canUndo() {
      if (this.actionStack) return this.actionStack.canUndo();
    },
  },
};
</script>

<style>
</style>