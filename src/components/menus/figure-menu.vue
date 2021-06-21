<template>
  <li>
    <a class="dropdown-item">
      <small><label>Symmetry</label></small>
      <label class="float-end">&raquo;</label></a
    >
    <ul class="submenu dropdown-menu">
      <li>
        <a
          class="dropdown-item"
          :class="isEmptySelections ? 'disabled' : ''"
          @click="horizontalFigures"
          ><small><label>Horizontal</label></small></a
        >
      </li>
      <li>
        <a
          class="dropdown-item"
          :class="isEmptySelections ? 'disabled' : ''"
          @click="verticalFigures"
          ><small><label>Vertical</label></small></a
        >
      </li>
    </ul>
  </li>

  <!-- <li>
    <a class="dropdown-item">
      <small><label>Order</label></small>
      <label class="float-end">&raquo;</label></a
    >
    <ul class="submenu dropdown-menu">
      <li>
        <a class="dropdown-item" :class="isEmptySelections ? 'disabled' : ''"
          ><small><label>Front</label></small></a
        >
      </li>
      <li>
        <a class="dropdown-item" :class="isEmptySelections ? 'disabled' : ''"
          ><small><label>Vertical</label></small></a
        >
      </li>
    </ul>
  </li>

  <li><hr class="dropdown-divider" /></li> -->
</template>

<script>
import { ActionFactory, CompositeAction } from "../../actions";
import baseMenuVue from "./base-menu.vue";
export default {
  extends: baseMenuVue,
  methods: {
    horizontalFigures() {
      console.log(this.selections);
      if (this.selections) {
        let actions = new CompositeAction();
        this.selections.forEach((selection) => {
          let sx = selection.scalex;
          actions.add(
            ActionFactory.newChangePropertyAction(selection, "scalex", -sx)
          );
        });
        this.excuteAction(actions);
      }
    },
    verticalFigures() {
      if (this.selections) {
        let actions = new CompositeAction();
        this.selections.forEach((selection) => {
          let sy = selection.scaley;
          actions.add(
            ActionFactory.newChangePropertyAction(selection, "scaley", -sy)
          );
        });
        this.excuteAction(actions);
      }
    },
  },
};
</script>

<style>
</style>