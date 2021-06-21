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
</template>

<script>
import docstoremapper from "../../store/doc-store-mapper";

const mixins = [docstoremapper];
export default {
  mixins,
};
</script>

<style>
</style>