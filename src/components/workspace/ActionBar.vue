<template>
  <div class="canvas-action-bar darkbg">
    <div class="action-bar-main">
      <div class="action-container">
        <button
          type="button"
          class="btn btn-primary btn-sm action-button"
          @click="deleteSelections"
          :class="canDelete ? '' : 'disabled'"
        >
          <i class="iconfont icon-trash"></i>
        </button>
      </div>

      <div class="action-container"><div class="action-spliter"></div></div>

      <div class="action-container">
        <button
          @click="undo"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canUndo ? '' : 'disabled'"
        >
          <i class="iconfont icon-undo"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="redo"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canRedo ? '' : 'disabled'"
        >
          <i class="iconfont icon-redo"></i>
        </button>
      </div>

      <div class="action-container"><div class="action-spliter"></div></div>

      <div class="action-container">
        <button
          @click="groupFigures"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canGroup ? '' : 'disabled'"
        >
          <i class="iconfont icon-group"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="unGroupFigures"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canUnGroup ? '' : 'disabled'"
        >
          <i class="iconfont icon-ungroup"></i>
        </button>
      </div>

      <div class="action-container"><div class="action-spliter"></div></div>

      <div class="action-container">
        <button
          @click="clip"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canClip ? '' : 'disabled'"
        >
          <i class="iconfont icon-mask-clip larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="unClip"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canUnClip ? '' : 'disabled'"
        >
          <i class="iconfont icon-mask-unclip larger-action-icon"></i>
        </button>
      </div>

      <div class="action-container"><div class="action-spliter"></div></div>

      <div class="action-container">
        <button
          @click="bringFront"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canBringFront ? '' : 'disabled'"
        >
          <i class="iconfont icon-bring-front larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="sendBack"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canSendBack ? '' : 'disabled'"
        >
          <i class="iconfont icon-send-back larger-action-icon"></i>
        </button>
      </div>

      <div class="action-container"><div class="action-spliter"></div></div>

      <div class="action-container">
        <button
          @click="alignLeft"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canAlign ? '' : 'disabled'"
        >
          <i class="iconfont icon-align-left more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="alignCenter(true, 'Align Center')"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canAlign ? '' : 'disabled'"
        >
          <i class="iconfont icon-align-center more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="alignRight"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canAlign ? '' : 'disabled'"
        >
          <i class="iconfont icon-align-right more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="alignTop"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canAlign ? '' : 'disabled'"
        >
          <i class="iconfont icon-align-top more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="alignCenter(false, 'Align V-Center')"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canAlign ? '' : 'disabled'"
        >
          <i class="iconfont icon-align-v-center more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="alignBottom"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canAlign ? '' : 'disabled'"
        >
          <i class="iconfont icon-align-bottom more-larger-action-icon"></i>
        </button>
      </div>

      <div class="action-container"><div class="action-spliter"></div></div>

      <div class="action-container">
        <button
          @click="distribute('left', true)"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canDistribute ? '' : 'disabled'"
        >
          <i class="iconfont icon-distribute-left more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="distribute('center', true)"
          type="button"
          class="btn btn-primary btn-sm  action-button"
          :class="canDistribute ? '' : 'disabled'"
        >
          <i
            class="iconfont icon-distribute-center more-larger-action-icon"
          ></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="distribute('right', true)"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canDistribute ? '' : 'disabled'"
        >
          <i class="iconfont icon-distribute-right more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="distribute('top', false)"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canDistribute ? '' : 'disabled'"
        >
          <i class="iconfont icon-distribute-top more-larger-action-icon"></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="distribute('center', false)"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canDistribute ? '' : 'disabled'"
        >
          <i
            class="iconfont icon-distribute-v-center more-larger-action-icon"
          ></i>
        </button>
      </div>
      <div class="action-container">
        <button
          @click="distribute('bottom', false)"
          type="button"
          class="btn btn-primary btn-sm action-button"
          :class="canDistribute ? '' : 'disabled'"
        >
          <i
            class="iconfont icon-distribute-bottom more-larger-action-icon"
          ></i>
        </button>
      </div>
    </div>
    <div class="action-bar-other">
      <input
        v-show="hasRootFigure"
        class="form-control form-control-sm property-input"
        v-model.lazy="mainScale"
        @click="selectText"
        @keypress.enter="confirm"
        style="width: 6em; text-align: center"
      />
    </div>
  </div>
</template>

<script>
import {
  changeindexprocessor,
  alignprocessor,
  clipprocessor,
  distributeprocessor,
  selectiondeleteprocessor,
  groupfiguresprocessor,
  textclickfullselect,
} from "../../mixins";
import docstoremapper from "../../store/doc-store-mapper";

const mixins = [
  textclickfullselect,
  changeindexprocessor,
  clipprocessor,
  alignprocessor,
  distributeprocessor,
  selectiondeleteprocessor,
  groupfiguresprocessor,
  docstoremapper,
];

export default {
  name: "ActionBar",
  mixins,
  computed: {
    hasRootFigure() {
      return this.document != null;
    },
    mainScale: {
      get() {
        if (this.document) {
          let zoom = this.document.zoom;
          let r = (zoom * 100).toFixed(2) + "%";
          return r;
        }
      },
      set(v) {
        if (this.document) {
          let z = Number.parseFloat(v);
          if (isNaN(z)) return;
          this.document.zoom = z / 100;
          this.document.placeAtCenter();
          this.document.refresh();
        }
      },
    },
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
.canvas-action-bar {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 0px 10px 0px 10px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
   height:2em;
  /* border-bottom: #777777 solid 1px; */
  border-radius: 5px;
}

.action-bar-main {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.action-spliter {
  width: 1px;
  height: 1.5em;
  background-color: #777777;
}

.action-container {
  padding: 0 5px 0 5px;
  box-sizing: border-box;
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
  color: #313131;
}

.action-button:hover {
  background-color: transparent;
  border: none;
  box-shadow: none;
}
</style>