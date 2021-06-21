import Tool from "./tool.js";
import Utils from "../utils.js";
import TransformFeedbackTool from "./transform-feedback-tool.js";
import { Group, shape, math, quadtree } from "figures";

export default class SelectTool extends TransformFeedbackTool {
    constructor(fr, mr, br) {
        super(fr, mr, br, 'select');
        this.notifySelectionChange = true;
    }

    get rect() {
        if (!this._selectRect) {
            let color = Tool.FEEDBACK_COLOR;
            let bcolor = Tool.FEEDBACK_B_COLOR;
            this._selectRect = new shape.Rect({
                r: color[0], g: color[1], b: color[2], a: 0.5,
                showBorder: true,
                br: bcolor[0], bg: bcolor[1], bb: bcolor[2],
                borderWidth: 1
            });
            this.frontRoot.addChild(this._selectRect);
        }
        return this._selectRect;
    }

    toolActived(x, y, event) {
        this.rect.visible = false;
        this.deleteHoverFigure();
        let figure = this.frontRoot.findFigure(x, y);
        figure = figure == this.frontRoot ? null : figure;
        let transformId = this.getTransformToolId(figure);
        if (transformId) {
            this.notifySelectionChange = false;
            this.switchTool(transformId, x, y, {
                currentFeedbacks: this.currentFeedbacks,
                transformFeedback: this.transformFeedback,
                keepFeedback: true,
                mouseEvent: event
            });
        } else {
            figure = this.mainRoot.findFigure(x, y);
            figure = figure == this.mainRoot ? null : figure;
            if (figure /*&& !(figure instanceof Group)*/) {
                while (figure.parent != this.mainRoot) {
                    figure = figure.parent;
                }
                if (this.currentSelections
                    && this.currentSelections.indexOf(figure) != -1) {
                    this.notifySelectionChange = false;
                }
                this.switchTool('move', x, y, {
                    currentFeedbacks: this.currentFeedbacks,
                    transformFeedback: this.transformFeedback,
                    keepFeedback: true, mouseEvent: event
                });
            } else {
                this.rect.width = this.rect.height = 0;
                this.rect.visible = true;
            }
        }
    }

    toolDeactived(x, y, event) {
        if (!this.notifySelectionChange) return;
        let l = Math.min(this.sx, this.ex);
        let t = Math.min(this.sy, this.ey);
        let r = Math.max(this.sx, this.ex);
        let b = Math.max(this.sy, this.ey);
        let type = 'new';
        if (event && event.ctrlKey) type = 'plus';
        if (event && event.shiftKey) type = 'minus'
        if (event && event.ctrlKey && event.shiftKey) type = 'new';
        if (l == r && t == b) {
            let select = this.mainRoot.findFigure(l, t);
            select = select == this.mainRoot ? null : select;
            // 如果是Group的话，点击到子figure，那么返回的要是Group
            if (select) {
                while (select.parent != this.mainRoot) select = select.parent;
            }
            let selections = [];
            if (select) selections.push(select);

            return { selections: selections, type };
        } else {
            let blur = this.mainRoot.findChildren({ left: l, top: t, right: r, bottom: b });
            let selections = [];
            if (blur && blur.length != 0) {
                blur.forEach(node => {
                    let f = node instanceof quadtree.QuadTreeNode ? node.value : node;
                    // 选择框的轴是固定的
                    if (math.SAT.contactTest(f.worldVertices, f.worldAxis,
                        this.rect.worldVertices, [[0, 1], [1, 0]])) {
                        selections.push(f);
                    }
                })
            }
            return { selections: selections, type };
        }
    }

    hoverMove(x, y) {
        if (this.mainRoot.children.length == 0) return;
        let transform = this.frontRoot.findFigure(x, y);
        let transformId = this.getTransformToolId(transform);
        this.changeCursor(this.defaultCursor);
        if (transformId) {
            let cursor = Utils.CURSOR[transformId];
            if (cursor) this.changeCursor(cursor);
            this.deleteHoverFigure();
            this.frontRoot.refresh();
            return `变换:${transformId}`;
        } else {
            let figure = this.mainRoot.findFigure(x, y);
            figure = figure == this.mainRoot ? null : figure;
            if (figure instanceof Group) figure = null;
            if (this.currentSelectionsContains(figure)) {
                this.changeCursor(Utils.CURSOR['move']);
            }
            this.updateHoverFigure(figure);
            this.frontRoot.refresh();
            if (figure) return `${figure.name} [x:${figure.x.toFixed(0)},y:${figure.y.toFixed(0)},w:${figure.width},h:${figure.height}]`;
        }
    }

    feedbackFiguresUpdated() {
        this.updateHoverFigure();
    }

    currentSelectionsContains(figure) {
        if (!this.currentSelections || !figure) return false;
        for (let i = 0; i < this.currentSelections.length; i++) {
            const c = this.currentSelections[i];
            if (c.id == figure.id) return true;
        }
        return false;
    }

    getTransformToolId(figure) {
        if (!figure) return;
        let t = this.transformFeedback;
        if (t != null) {
            if (figure == t.rotateAnchor) return 'rotate';
            if (figure == t.topAnchor) return 'n-resize'
            if (figure == t.bottomAnchor) return 's-resize'
            if (figure == t.leftAnchor) return 'w-resize'
            if (figure == t.rightAnchor) return 'e-resize'
            if (figure == t.seAnchor) return 'se-resize'
            if (figure == t.neAnchor) return 'ne-resize'
            if (figure == t.swAnchor) return 'sw-resize'
            if (figure == t.nwAnchor) return 'nw-resize'
        }
    }

    isTransformTool(figure) {
        let t = this.transformFeedback;
        if (t != null) {
            return figure == t.topAnchor || figure == t.rotateAnchor
                || figure == t.bottomAnchor || figure == t.rightAnchor
                || figure == t.leftAnchor || figure == t.seAnchor || figure == t.neAnchor
                || figure == t.swAnchor || figure == t.nwAnchor;
        }
    }

    deleteHoverFigure() {
        if (this._lastHoverDelegate) {
            this._lastHoverDelegate.dispose();
            this.frontRoot.removeChild(this._lastHoverDelegate);
            this._lastHoverDelegate.parent = null;
            this._lastHoverDelegate.relatedSelection = null;
            this._lastHoverDelegate = null;
        }
    }

    updateHoverFigure(figure) {
        if (!figure) {
            this.deleteHoverFigure();
        } else {
            if (!this._lastHoverDelegate) {
                if (!this.isTransformTool(figure)) {
                    this._lastHoverDelegate = Tool.createDelegateFigure(figure);
                    this.frontRoot.addChild(this._lastHoverDelegate);
                }
            } else {
                if (this._lastHoverDelegate.relatedSelection.id != figure.id) {
                    this.deleteHoverFigure();
                    this._lastHoverDelegate = Tool.createDelegateFigure(figure);
                    this.frontRoot.addChild(this._lastHoverDelegate);
                }
            }
        }
    }

    activeMove(x, y, l, t, r, b) {
        this.rect.x = l;
        this.rect.y = t;
        this.rect.width = r - l;
        this.rect.height = b - t;
        this.frontRoot.refresh();
    }

    reset() {
        super.reset();
        this.deleteHoverFigure();
        this.notifySelectionChange = true;
        this.rect.visible = false;
        this.rect.width = this.rect.height = 0;
        this.frontRoot.refresh();
    }

    unUse() {
        this.deleteHoverFigure();
        super.unUse();
    }
}