import Vertex from "../figure/vertex.js";
import VerticesPathFeedback from "../figure/vertices-path-feedback.js";
import Tool from "./tool.js";
import { Point, shape, Utils } from 'figures'

export default class PenTool extends Tool {
    constructor(f, m, b, id = 'pen') {
        super(f, m, b, id);
        this.vertices = [];
        this.vertexSize = 4;
    }

    updateCurrentSelections(selections) {
        super.updateCurrentSelections(selections);
        if (!selections || !(selections[selections.length - 1] instanceof shape.PathShape)) {
            this.currentPath = null; // 不销毁，因为会有redo操作
            this.disposeCurrentShadow();
        } else {
            if (this.currentPath == null && !selections[selections.length - 1].close) {
                this.currentPath = selections[selections.length - 1];
                this.createShadowPath(this.currentPath);
            }
        }
        this.updateVertexShapeFeedback();
    }

    updateVertexShapeFeedback() {
        if (this._updateFeedbackid) {
            cancelAnimationFrame(this._updateFeedbackid);
        }
        if (this.shadowPath) this.shadowPath.visible = false;
        this._updateFeedbackid = requestAnimationFrame(() => {
            if (this.shadowPath == null) return;
            let selection = this.currentSelections[this.currentSelections.length - 1];
            if (selection.id == this.shadowPath.id && selection) {
                this.shadowPath.visible = true;
                Utils.applyPose(this.shadowPath, selection.worldMatrix.decompose());
                this.shadowPath.deletePathModel(); // 清空重新生成
                selection.getPathModel().points.forEach(p => {
                    let p1 = p.clone();
                    this.shadowPath.addPoint(p1);
                });
                this.shadowPath.applyRestingVisible();
                this.frontRoot.refresh();
            }
        });
    }

    prepare(args) {
        // this.fireSelectionChangeEvent([], 'new');
    }

    unUse(args) {
        cancelAnimationFrame(this._updateFeedbackid);
        this._updateFeedbackid = null;
        this.disposeCurrentShadow();
        this.currentPath = null;
    }

    createShadowPath(figure) {
        this.disposeCurrentShadow();
        this.shadowPath = new VerticesPathFeedback({
            x: figure.x, y: figure.y, a: 0, borderWidth: 1
        });
        this.shadowPath.id = figure.id;
        this.shadowPath.related = figure;
        Tool.setFeedbackColors(this.shadowPath);
        this.frontRoot.addChild(this.shadowPath);
        this.frontRoot.refresh();
    }

    addNewPoint(x, y) {
        if (this.currentPath == null) {
            this.currentPath = new shape.PathShape({
                x: x, y: y
            });
            this.currentPath.name = 'Path Shape';
            this.createShadowPath(this.currentPath);
            let m = this.currentPath.worldMatrix.clone().invert();
            let p = m.multiplyWithVertexDatas(x, y);
            let point = new Point(p[0], p[1]);
            this.currentPath.addPoint(point);
            let point2 = point.clone();
            this.shadowPath.addPoint(point2);
            this.currentAdded = this.currentPath;
            this.frontRoot.refresh();
            return;
        }
        let m = this.currentPath.worldMatrix.clone().invert();
        let p = m.multiplyWithVertexDatas(x, y);
        let point = new Point(p[0], p[1]);
        this.shadowPath.addPoint(point);
        this.currentAdded = point;
        {
            this.shadowPath.applyWorkingVisible();
            this.frontRoot.refresh();
        }
    }

    toolActived(x, y) {
        super.toolActived(x, y);
        this.completeType = null;
        this.minusIndex = -1;
        let clickFigure = this.frontRoot.findFigure(x, y);
        clickFigure = (clickFigure == this.frontRoot || clickFigure == this.shadowPath) ? null : clickFigure;
        if (clickFigure) {
            this.updateHoverFigure();
            if (!this.shadowPath) return;
            let index = this.shadowPath.indexOfVertex(clickFigure);
            console.log(index, this.shadowPath.getPathModel().pointsCount);
            // TODO: 如果是最后一个节点,修改顶点类型
            if (index != -1) {
                if (index == 0) {
                    this.completeType = 'close';
                } else if (index < this.shadowPath.getPathModel().pointsCount - 1) {
                    this.completeType = 'minus';
                    this.minusIndex = index;
                } else if (index == this.shadowPath.getPathModel().pointsCount - 1) {
                    let point = this.shadowPath.getPathModel().getPoint(index);
                    if (point.out != null) {
                        this.completeType = 'change';
                        this.minusIndex = index;
                    }
                }
                return;
            }
        } else {
            this.completeType = 'add';
            this.addNewPoint(x, y);
        }

    }

    toolDeactived(x, y) {
        super.toolDeactived(x, y);
        let event;
        if (this.completeType == 'add') {
            if (this.currentAdded instanceof shape.PathShape) {
                let m1 = this.currentAdded.getPathModel();
                let m2 = this.shadowPath.getPathModel();
                let firstPoint = m1.getPoint(0);
                firstPoint.copyFrom(m2.getPoint(0));
                let matrix = this.currentAdded.worldMatrix;
                let pm = this.mainRoot.worldMatrix.clone().invert();
                let translation = pm.multiply(matrix).decompose().translation;
                let temp = this.currentAdded;
                this.currentAdded = null;
                temp.x = translation.x;
                temp.y = translation.y;
                event = {
                    type: 'add', figure: temp, point: firstPoint
                };
            }
            if (this.currentAdded instanceof Point) {
                let p = this.currentAdded.clone();
                this.currentAdded = null;
                event = {
                    type: 'add', point: p,
                    path: this.currentPath, index: this.currentPath.pointsCount
                };
            }
        }

        if (this.completeType == 'close') {
            this.disposeCurrentShadow();
            let temp = this.getSelectionById(this.currentPath.id);
            this.currentPath = null; //完成一个曲线图形
            event = { type: this.completeType, path: temp };
        }
        if (this.completeType == 'minus') {
            let temp = this.getSelectionById(this.currentPath.id);
            event = { type: this.completeType, index: this.minusIndex, path: temp };
        }
        if (this.completeType == 'change') {
            let temp = this.getSelectionById(this.currentPath.id);
            let point = temp.getPathModel().getPoint(this.minusIndex);
            event = { type: this.completeType, point };
        }
        if (this.shadowPath) this.shadowPath.applyRestingVisible();
        this.frontRoot.refresh();
        return event;
    }

    getSelectionById(id) {
        if (!this.currentSelections) return;
        for (let i = 0; i < this.currentSelections.length; i++) {
            const selection = this.currentSelections[i];
            if (selection.id == id) return selection;
        }
    }

    disposeCurrentShadow() {
        if (this.shadowPath == null) return;
        this.frontRoot.removeChild(this.shadowPath);
        this.shadowPath.dispose();
        this.shadowPath = null;
        this.frontRoot.refresh();
    }

    hoverMove(x, y) {
        let current = this.frontRoot.findFigure(x, y);
        if (current == this._lastHover && current != null) return;
        current = (current instanceof Vertex) ? current : null;
        this.updateHoverFigure(current);
    }

    updateHoverFigure(current) {
        if (this._lastHover != current) {
            if (this._lastHover) this._lastHover.blur();
            this._lastHover = current;
            if (this._lastHover) this._lastHover.focus();
            this.frontRoot.refresh();
        }
    }

    activeMove(x, y, l, t, r, b, dx, dy) {
        super.activeMove(x, y, l, t, r, b, dx, dy);
        if (!(this.completeType == 'add')) return;
        let vertex = this.shadowPath.getLastVertexFigure();
        if (vertex) {
            if (!vertex.outController || !vertex.inController) {
                vertex.type = 1;
                vertex.model.inX = vertex.model.x;
                vertex.model.inY = vertex.model.y;
                vertex.model.outX = vertex.model.x;
                vertex.model.outY = vertex.model.y;
                vertex.initControllerPoints();
            }

            let out = vertex.outController;
            out.update(out.x + dx, out.y + dy);
            let in1 = vertex.inController;
            in1.update(in1.x - dx, in1.y - dy);
            this.frontRoot.refresh();
        }
    }

    reset() {
        super.reset();
        cancelAnimationFrame(this._updateFeedbackid);
        this._updateFeedbackid = null;
        this.completeType = null;
        this.minusIndex = -1;
    }
}