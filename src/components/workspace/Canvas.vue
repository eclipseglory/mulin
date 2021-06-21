<template>
  <div id="work-space" :class="canvasBGColor">
    <div id="tools-container">
      <tools-bar
        @tool:update="toolUpdate"
        :currentTool="currentTool"
        :disabled="this.mainRoot == null"
      />
    </div>
    <div id="canvas-space">
      <div id="canvas-toolbar">
        <action-bar />
      </div>
      <div id="canvas-container" :style="'cursor:' + cursor">
        <div
          v-show="loading"
          class="painter-canvas loading-container darkbg"
          style="z-index: 4"
        >
          <div class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <textarea
          v-show="this.showTextInput"
          ref="canvas-text-input"
          id="canvas-text-input"
          class="form-control"
          autofocus="autofocus"
          :style="textInputStyle"
          style="max-width: 300px; position: absolute; z-index: 3"
        />
        <canvas
          id="front-canvas"
          class="painter-canvas"
          style="z-index: 2"
          @mousedown.self="mousedown"
          @mouseleave="mouseleave"
          @mousemove="mousemove"
          @mouseup="mouseup"
          @mouseover="mouseover"
          @mouseout="mouseout"
          @mousewheel="mousewheel"
        />
        <canvas id="main-canvas" class="painter-canvas" style="z-index: 1" />
        <canvas id="backend-canvas" class="painter-canvas" style="z-index: 0" />
      </div>
    </div>
  </div>
</template>

<script>
import ToolsBar from "./ToolsBar.vue";

import TransformFeedback from "../../figure/transform-feedback.js";
import { DocumentRoot } from "figures";

import ActionFactory from "../../actions/action-factory.js";
import CompositeAction from "../../actions/compsite-action.js";

import SelectTool from "../../tool/select-tool.js";
import TranslateTool from "../../tool/transformtools/translate-tool.js";
import RotateTool from "../../tool/transformtools/rotate-tool.js";
import EResizeTool from "../../tool/transformtools/e-resize-tool.js";
import WResizeTool from "../../tool/transformtools/w-resize-tool.js";
import NResizeTool from "../../tool/transformtools/n-resize-tool.js";
import SResizeTool from "../../tool/transformtools/s-resize-tool.js";
import SEResizeTool from "../../tool/transformtools/se-resize-tool.js";
import NEResizeTool from "../../tool/transformtools/ne-resize-tool.js";
import SWResizeTool from "../../tool/transformtools/sw-resize-tool.js";
import NWResizeTool from "../../tool/transformtools/nw-resize-tool.js";
import RectTool from "../../tool/shaptools/rect-tool.js";
import EllipseTool from "../../tool/shaptools/ellipse-tool.js";
import StarTool from "../../tool/shaptools/star-tool.js";
import PolygonTool from "../../tool/shaptools/polygon-tool.js";
import PenTool from "../../tool/pen-tool.js";
import VertexSelectTool from "../../tool/vertex-select-tool.js";
import TranslateRootTool from "../../tool/translate-root-tool.js";
import LineTool from "../../tool/shaptools/line-tool.js";
import TextTool from "../../tool/texttools/text-tool.js";
import VTextTool from "../../tool/texttools/v-text-tool.js";
import LinearGradientTool from "../../tool/gradient/linear-gradient-tool.js";
import RadialGradientTool from "../../tool/gradient/radical-gradient-tool.js";

import ActionBar from "./ActionBar.vue";

import { keyboardhandler, rootfigurecreator } from "../../mixins";
import docstoremapper from "../../store/doc-store-mapper";

const mixins = [keyboardhandler, rootfigurecreator, docstoremapper];

export default {
  name: "Canvas",
  mixins,
  components: {
    ToolsBar,
    ActionBar,
  },
  emits: ["selection:change", "tooltip:update"],
  mounted() {
    //   初始化Tools：
    this.tools = {};
    this.createTools(this.frontRoot, this.mainRoot);

    let ref = this.$refs["canvas-text-input"];

    ref.addEventListener("focus", (event) => {
      this.canHandlerInput = false;
    });

    ref.addEventListener("blur", (event) => {
      this.canHandlerInput = true;
    });

    ref.addEventListener("keydown", (event) => {
      if (event.key == "Escape") {
        let tool = this.getCurrentTool();
        if (tool instanceof TextTool) tool.activing = false;
        this.textInputCompleted({ source: this.getCurrentTool() });
      }
    });
  },
  methods: {
    textInputCompleted(event) {
      let ref = this.$refs["canvas-text-input"];
      ref.blur();
      this.showTextInput = false;
      let value = ref.value;
      ref.value = null;
      if (event) {
        let tool = event.source;
        if (tool && tool instanceof TextTool && value && value.length != 0) {
          if (tool.create) {
            let textFigure = tool.createNewText(
              value,
              this.textInput.x,
              this.textInput.y
            );
            if (textFigure) {
              this.addShape({ figure: textFigure, name: "Text" });
            }
          }
          if (tool.edit) {
            let figure = tool.editingFigure;
            if (figure && figure.text != value) {
              let action = ActionFactory.newChangePropertyAction(
                figure,
                "text",
                value
              );
              this.excuteAction(action);
            }
          }
        }
      }
    },
    createNewMainRoot(width, height, name = "Utitled") {
      new Promise((resolve, reject) => {
        try {
          this.loading = true;
          this.disposeMainRoot();

          let document = new DocumentRoot(
            this.mainSurface,
            this.frontRoot.width,
            this.frontRoot.height,
            {
              width: width,
              height: height,
              name: name,
            }
          );
          this.updateDocument(document);
          // document.surface = this.mainSurface;
          // document.init();

          // this.currentTool = "select";
          // this.$el.focus();
          // resolve(document);
          resolve();
        } catch (e) {
          console.error(e);
          reject(e);
        }
      })
        .catch((e) => console.error(e))
        .finally(() => (this.loading = false));
    },

    disposeMainRoot() {
      if (this.mainRoot != null) {
        this.cleanSelections();
        this.mainRoot.off("addChild", this.figureAdded);
        this.mainRoot.off("removeChild", this.figureRemoved);
        this.mainRoot.dispose();
        this.updateDocument(null);
        this.configToolsMainRoot(null);
        this.cleanActionStack();
      }
      this.mainRoot = null;
    },

    configToolsMainRoot(main) {
      for (let id in this.tools) {
        let tool = this.tools[id];
        tool.mainRoot = main;
      }
    },
    createTools(frontRoot, mainRoot, back) {
      let me = this;
      register(new SelectTool(frontRoot, mainRoot, back));

      register(new RotateTool(frontRoot, mainRoot, back));
      register(new EResizeTool(frontRoot, mainRoot, back));
      register(new NResizeTool(frontRoot, mainRoot, back));
      register(new WResizeTool(frontRoot, mainRoot, back));
      register(new SResizeTool(frontRoot, mainRoot, back));
      register(new SEResizeTool(frontRoot, mainRoot, back));
      register(new NEResizeTool(frontRoot, mainRoot, back));
      register(new SWResizeTool(frontRoot, mainRoot, back));
      register(new NWResizeTool(frontRoot, mainRoot, back));
      register(new TranslateTool(frontRoot, mainRoot, back));

      register(new TranslateRootTool(frontRoot, mainRoot, back));

      register(new TextTool(frontRoot, mainRoot, back));
      register(new VTextTool(frontRoot, mainRoot, back));

      register(new PenTool(frontRoot, mainRoot, back));
      register(new RectTool(frontRoot, mainRoot, back));
      register(new StarTool(frontRoot, mainRoot, back));
      register(new EllipseTool(frontRoot, mainRoot, back));
      register(new PolygonTool(frontRoot, mainRoot, back));
      register(new VertexSelectTool(frontRoot, mainRoot, back));
      register(new LineTool(frontRoot, mainRoot, back));
      register(new LinearGradientTool(frontRoot, mainRoot, back));
      register(new RadialGradientTool(frontRoot, mainRoot, back));

      function register(tool) {
        if (me.registedTools == null) {
          me.registedTools = [];
        }
        me.tools[tool.id] = tool;
        tool.on("transformFigure", me.figureTransform);
        tool.on("complete", me.toolCompleted);
        tool.on("active", me.toolActived);
        tool.on("selectionChange", (e) => {
          me.selectionChange(e.event);
        });
        tool.on("toolSwitch", me.toolSwitch);
        tool.on("updateTooltip", me.toolTipUpdated);
        tool.on("cursorChange", me.cursorChange);
        tool.on("showTextInput", me.displayTextInput);
        tool.on("hideTextInput", me.textInputCompleted);
        me.registedTools.push(tool);
      }
    },

    displayTextInput(e) {
      let event = e.event;
      this.showTextInput = true;
      this.canHandlerInput = false;
      this.textInput.x = event.x;
      this.textInput.y = event.y;
      this.textInput.width = event.width == null ? 200 : event.width;
      this.textInput.width = Math.min(200, this.textInput.width);
      this.textInput.height = event.height == null ? 50 : event.height;
      this.textInput.height = Math.min(50, this.textInput.height);
      this.textInput.size = event.size == null ? 10 : event.size;
      let value = event.value;
      this.$nextTick(() => {
        let ref = this.$refs["canvas-text-input"];
        ref.value = value;
        ref.focus();
      });
    },
    mousewheel(event) {
      if (!event.altKey) return;
      if (this._zoomId) {
        cancelAnimationFrame(this._zoomId);
      }
      this._zoomId = requestAnimationFrame(() => {
        if (event.altKey) {
          this.zoomMainRoot(event.deltaY < 0);
        }
      });
    },
    mousedown(event) {
      let ref = this.$refs["canvas-text-input"];
      ref.blur();
      if (this.spacePressed && this.mainRoot) {
        this.toolSwitch({
          event: {
            id: "move-root",
            x: event.offsetX,
            y: event.offsetY,
          },
        });
        return;
      }
      this.activeTool(
        this.getCurrentTool(),
        event.offsetX,
        event.offsetY,
        event
      );
    },
    mousemove(event) {
      // BUG： 有时候会出现能点击但不能移动的情况，可能是焦点方面的问题
      // 注意，当前tool不一定就是tool instance，有些tool会内部切换
      let current = this.getCurrentTool();
      current =
        this.currentActivedTool == null ? current : this.currentActivedTool;
      if (current) {
        current.move(event.offsetX, event.offsetY, event);
      }
    },

    deactiveCurrentTool(event) {
      // deactive tool必须是active tool：
      if (this.currentActivedTool) {
        // console.log(`deactive ${this.currentActivedTool.id} tool`);
        this.currentActivedTool.deactive(event.offsetX, event.offsetY, event);
      }
      this.currentActivedTool = null;
    },

    mouseout(event) {
      this.deactiveCurrentTool(event);
    },
    mouseover(event) {
      this.deactiveCurrentTool(event);
    },
    mouseup(event) {
      this.deactiveCurrentTool(event);
    },
    mouseleave(event) {
      this.deactiveCurrentTool(event);
    },

    zoomMainRoot(zoomIn) {
      if (this.mainRoot) {
        let delta = 0.05;
        if (!zoomIn) delta *= -1;
        // ??? 为什么修改了main root会引发selection change？
        // 难道是因为selection里的数据的parent修改会引发变化？
        this.mainRoot.zoom += delta;
        this.mainRoot.refresh();
      }
    },

    getCurrentTool() {
      return this.tools[this.currentTool];
    },

    cursorChange(e) {
      this.$nextTick(() => {
        this.cursor = e.event.cursor;
      });
    },

    useTool(tool, args) {
      tool.prepare(args);
      tool.updateCurrentSelections(this.selections);
      this.cursor = tool.defaultCursor;
    },

    unUseTool(tool, args) {
      tool.unUse(args);
      tool.updateCurrentSelections();
      this.cursor = "default";
    },

    toolTipUpdated(event) {
      let tooltip = event.event.tooltip;
      this.$emit("tooltip:update", tooltip);
    },

    activeTool(tool, x, y, event) {
      if (tool) {
        // console.log(`active ${tool.id} tool`);
        this.cursor = tool.defaultCursor;
        tool.active(x, y, event);
      }
    },

    toolSwitch(event) {
      let source = event.source;
      let data = event.event;
      let mouseEvent;
      if (data.args) mouseEvent = data.args.mouseEvent;
      let id = data.id;
      let x = data.x;
      let y = data.y;
      let args = data.args;
      let tool = this.tools[id];
      if (tool) {
        if (source) {
          source.deactive(x, y, mouseEvent);
        }
        this.useTool(tool, args);
        // console.log(`swtich to ${tool.id} tool`);
        this.activeTool(tool, x, y, mouseEvent);
      }
    },

    toolActived(event) {
      this.currentActivedTool = event.source;
      // console.log(`${event.source.id} tool was actived`);
    },

    isAddShapeTool(id) {
      return (
        id == "rect" ||
        id == "ellipse" ||
        id == "star" ||
        id == "polygon" ||
        id == "line" ||
        id == "text" ||
        id == "v-text"
      );
    },

    isTransformTool(id) {
      return (
        id == "rotate" ||
        id == "e-resize" ||
        id == "s-resize" ||
        id == "n-resize" ||
        id == "w-resize" ||
        id == "se-resize" ||
        id == "sw-resize" ||
        id == "ne-resize" ||
        id == "nw-resize"
      );
    },

    processVertexSelectResult(result) {
      let type = result.type;
      let shape = result.figure;
      let point = result.point;
      if (type == "move") {
        let action = ActionFactory.newTranslateAction(
          result.figures,
          result.dx,
          result.dy
        );
        this.excuteAction(action);
        // this.actionStack.excute(action);
      }
      if (type == "vertex") {
        let vertex = result.vertex;
        let copy = result.copy;
        // return { type: 'vertex', vertex: selection, copy: this._lastVertexHover.model };
        let action = new CompositeAction();
        if (vertex.x != copy.x)
          action.add(
            ActionFactory.newChangePropertyAction(vertex, "x", copy.x)
          );
        if (vertex.y != copy.y)
          action.add(
            ActionFactory.newChangePropertyAction(vertex, "y", copy.y)
          );
        if (vertex.type != copy.type)
          action.add(
            ActionFactory.newChangePropertyAction(vertex, "type", copy.type)
          );
        if (copy.in != vertex.in) {
          action.add(
            ActionFactory.newChangePropertyAction(vertex, "in", copy.in)
          );
        }
        if (copy.out != vertex.out) {
          action.add(
            ActionFactory.newChangePropertyAction(vertex, "out", copy.out)
          );
        }
        this.excuteAction(action);
        // this.actionStack.excute(action);
      }
    },

    processPenResult(result) {
      let type = result.type;
      let shape = result.figure;
      let point = result.point;
      let path = result.path;
      let index = result.index;
      let action;
      if (type == "add") {
        if (shape) {
          action = ActionFactory.newAddFigureAction(
            shape,
            this.mainRoot,
            "路径图形"
          );
        } else if (point) {
          action = ActionFactory.newInsertPointAction(point, path, index);
        }
      }
      if (type == "close") {
        action = ActionFactory.newChangePropertyAction(path, "close", true);
      }
      if (type == "minus") {
        action = ActionFactory.newDeletePointAction(path, index);
      }
      if(type =='change'){
        action = ActionFactory.newChangePropertyAction(point,'out',null);
      }
      if (action) this.excuteAction(action);
      if (type == "close") {
        this.selectionChange({ type: "new", selections: [] });
      }
      this.mainRoot.refresh();
    },

    toolCompleted(e) {
      let event = e.event;
      let id = event.id;
      // console.log(`${id} tool was completed`);
      let result = event.result;
      if (result && this.isAddShapeTool(id)) {
        this.addShape(result, "添加图形");
      }
      if (result && id == "pen") {
        this.processPenResult(result);
      }
      if (result && id == "vertex-select") {
        this.processVertexSelectResult(result);
      }
      if (result && id == "linearGradient") {
        this.updateLinearGradient(result);
      }
      if (result && id == "radialGradient") {
        this.updateRadicalGradient(result);
      }
      if (id == "move" && result) {
        if (result.type == "move") {
          let action = ActionFactory.newTranslateAction(
            result.figures,
            result.dx,
            result.dy
          );
          this.excuteAction(action);
        }
        if (result.type == "new") {
          let composite = new CompositeAction();
          result.figures.forEach((f) => {
            composite.add(
              ActionFactory.newAddFigureAction(f, this.mainRoot, f.name)
            );
          });
          this.excuteAction(composite);
        }
      }
      if (result && this.isTransformTool(id)) {
        let action = ActionFactory.newPoseChangeAction(result);
        this.excuteAction(action);
      }
      if (result && id == "select") {
        // console.log("select tool update selections");
        this.selectionChange(result);
      }
      this.mainRoot.refresh();
      let tool = this.getCurrentTool();
      if (this.currentActivedTool.id != tool.id) {
        this.unUseTool(this.currentActivedTool);
        // this.useTool(tool);
        tool.updateCurrentSelections(this.selections);
        this.cursor = tool.defaultCursor;
      }
      this.currentActivedTool = null;
    },

    updateLinearGradient(result) {
      let action = new CompositeAction();
      this.selections.forEach((selection) => {
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.linearGradient,
            "x1",
            result.x1
          )
        );
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.linearGradient,
            "y1",
            result.y1
          )
        );
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.linearGradient,
            "x2",
            result.x2
          )
        );
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.linearGradient,
            "y2",
            result.y2
          )
        );
      });
      if (!action.isEmpty) this.excuteAction(action);
    },

    updateRadicalGradient(result) {
      let action = new CompositeAction();
      this.selections.forEach((selection) => {
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.radialGradient,
            "x",
            result.x
          )
        );
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.radialGradient,
            "y",
            result.y
          )
        );
        action.add(
          ActionFactory.newChangePropertyAction(
            selection.radialGradient,
            "radius",
            result.radius
          )
        );
      });
      if (!action.isEmpty) this.excuteAction(action);
    },

    getTransformFeedback() {
      if (this.transformFeedback == null) {
        this.transformFeedback = new TransformFeedback();
        this.frontRoot.addChild(this.transformFeedback);
        this.frontRoot.transformFeedback = this.transformFeedback;
      }
      return this.transformFeedback;
    },

    addShape(event) {
      if (!event) return;
      let figure = event.figure;
      if (!figure) return;
      let name = event.name;
      let action = ActionFactory.newAddFigureAction(
        figure,
        this.mainRoot,
        name
      );
      this.excuteAction(action);
    },

    vertexAdded(point) {},

    vertexRemoved(point) {},

    figureAdded(event) {
      let newFigure = event.event.child;
      this.selectionChange({ type: "new", selections: [newFigure] });
    },

    figureRemoved(event) {
      let removed = event.event.child;
      this.removeSelection(removed);
    },

    selectionChange(event) {
      if (!event) return;
      if (event.type == "new") {
        this.updateSelections(event.selections);
      }
      if (event.type == "plus") {
        this.concatSelections(event.selections);
      }
      if (event.type == "minus") {
        this.removeSelections(event.selections);
      }
    },

    toolUpdate(id) {
      this.currentTool = id;
    },
  },
  data() {
    return {
      cursor: "auto",
      currentTool: null,
      loading: false,
      textInput: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        size: 10,
      },
      showTextInput: false,
    };
  },
  computed: {
    mainRoot() {
      return this.document;
    },
    textInputStyle() {
      return {
        left: `${this.textInput.x}px`,
        top: `${this.textInput.y}px`,
        width: `${this.textInput.width}px`,
        height: `${this.textInput.height}px`,
        "font-size": `${this.textInput.size}px`,
      };
    },
    canvasBGColor() {
      if (this.mainRoot) {
        return "graybg";
      } else {
        return "blackbg";
      }
    },

    currentSelections() {
      return this.selections;
    },
  },

  watch: {
    currentTool(c, old) {
      if (c == old) return;
      let tool = this.tools[c];
      let oldTool = this.tools[old];
      if (oldTool) {
        this.unUseTool(oldTool);
      }
      if (tool) {
        this.useTool(tool);
      }
    },
    document(doc, old) {
      doc.on("addChild", this.figureAdded);
      doc.on("removeChild", this.figureRemoved);
      this.updateDocument(doc);
      this.configToolsMainRoot(doc);

      doc.surface = this.mainSurface;
      doc.screanWidth = this.frontRoot.width;
      doc.screanHeight = this.frontRoot.height;
      doc.init();
      // this.mainRoot = doc;

      this.currentTool = "select";
      this.$el.focus();
      this.mainRoot.refresh();
    },
    currentSelections: {
      handler(c, old) {
        let tool = this.getCurrentTool();
        if (tool) tool.updateCurrentSelections(c);
        if (this.mainRoot) this.mainRoot.refresh();
        this.frontRoot.refresh();
      },
      deep: true,
    },

    actionStack: {
      handler() {
        let tool = this.getCurrentTool();
        if (tool) tool.updateCurrentSelections(this.selections);
        this.frontRoot.refresh();
        if (this.mainRoot) this.mainRoot.refresh();
      },
      deep: true,
    },
  },

  props: {
    // currentTool: {
    //   type: String,
    //   default: null,
    // },
  },
};
</script>

<style>
#work-space {
  display: flex;
  align-content: stretch;
  width: 100%;
  height: 100%;
}

#canvas-space {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

#canvas-toolbar {
  width: 100%;
}

#canvas-container {
  position: relative;
  flex-grow: 1;
  padding: 0px;
  box-sizing: border-box;
  display: flex;
}

.painter-canvas {
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
}

.action-icon {
  cursor: pointer;
}

.disable-icon {
  color: #777777;
  cursor: auto;
}

.canvas-action-spliter {
  border-left: #777777 solid 1px;
}

#canvas-text-input {
  padding: 0px;
}
</style>
