import VertexController from "../figure/vertex-controller.js";
import Vertex from "../figure/vertex.js";
import VerticesPathFeedback from "../figure/vertices-path-feedback.js";
import Tool from "./tool.js";

import { Point, shape, Utils } from 'figures'

export default class VertexSelectTool extends Tool {
    constructor(f, m, b, id = 'vertex-select') {
        super(f, m, b, id);
    }

    unUse() {
        this.stopUpdate();
        this.disposeShadowPath();
        this.deleteLastHover();
        if (this.currentSelections && this.currentSelections[0] instanceof Point) {
            let p = this.currentSelections[0];
            let parent = p.parent;
            while (true) {
                if (parent == null || parent instanceof shape.VerticesShape) {
                    break;
                }
                parent = parent.parent;
            }
            if (parent) {
                this.fireSelectionChangeEvent([parent]);
            }
            else {
                this.fireSelectionChangeEvent([]);
            }
        }
        this.frontRoot.refresh();
    }

    get shadowPath() {
        if (this._shadowPath == null) {
            this._shadowPath = new VerticesPathFeedback({
                a: 0, borderWidth: 1
            });
            Tool.setFeedbackColors(this._shadowPath);
            this.frontRoot.addChild(this._shadowPath);
        }
        return this._shadowPath;
    }

    updateShadowPath(figure) {
        this.shadowPath = null;
        if (!figure) return;
        if (figure instanceof VertexController) {
            figure = figure.parent;
        }
        if (figure instanceof Vertex) {
            this.shadowPath = figure.master;
        }
    }

    disposeShadowPath() {
        if (!this._shadowPath) return;
        this.frontRoot.removeChild(this._shadowPath);
        this._shadowPath.parent = null;
        this._shadowPath.dispose();
        this._shadowPath.relatedPath = null;
        this._shadowPath = null;
        this._selectedVertex = null;
        this._selectedVertexType = null;
    }

    updateVertexShapeFeedback(path) {
        if (!path) return;
        this.shadowPath.id = path.id;
        this.shadowPath.visible = true;
        this.shadowPath.close = path.close;
        this.shadowPath.relatedPath = path;
        this.shadowPath.deletePathModel(); // 清空重新生成
        let pose = path.worldMatrix.decompose();
        Utils.applyPose(this.shadowPath, pose);
        path.getPathModel().points.forEach(p => {
            let p1 = p.clone();
            this.shadowPath.addPoint(p1);
        });
        this.shadowPath.applyRestingVisible();
        this.frontRoot.refresh();
    }

    updateCurrentSelections(selections) {
        super.updateCurrentSelections(selections);
        if (this.shadowPath) this.shadowPath.visible = false
        if (this._updateId) {
            cancelAnimationFrame(this._updateId);
        }
        this._updateId = requestAnimationFrame(() => {
            if (this.currentSelections && this.currentSelections.length == 1) {
                let s = this.currentSelections[0];
                if (s instanceof shape.PathShape) {
                    this.updateVertexShapeFeedback(s);
                    if (this._selectedVertex) this._selectedVertex.blur();
                    this._selectedVertex = null;
                    this._selectedVertexType = null;
                }
                if (s instanceof Point) {
                    if (s.parent == null) {
                        // 说明这个是被删除的点，重新发送selection：
                        if (this.shadowPath) {
                            this.fireSelectionChangeEvent([this.shadowPath.relatedPath]);
                        }
                        return;
                    }
                    let path = this.shadowPath.relatedPath;
                    this.updateVertexShapeFeedback(path);
                    let pathmodel = path.getPathModel();
                    let index = pathmodel.points.indexOf(s);
                    let f = this.shadowPath.getVertexFigure(index);
                    if (this._lastVertexHover) this._lastVertexHover.blur();
                    if (this._lastVertexHover == f) this._lastVertexHover = null;
                    if (this._selectedVertex) this._selectedVertex.blur();
                    this._selectedVertex = f;
                    this._selectedVertex.focus();
                    this.focusVertex(this._selectedVertex);
                }
            } else {
                this.disposeShadowPath();
                this.deleteLastHover();
                this.frontRoot.refresh();
            }
        });
    }

    findRealModel(vertex) {
        if (vertex instanceof VertexController) {
            vertex = vertex.relate;
        }

        let index = this.shadowPath.indexOfVertex(vertex);
        let path = this.mainRoot.getFigureById(this.shadowPath.id);
        return path.getPathModel().getPoint(index);
    }

    toolActived(x, y, args) {
        super.toolActived(x, y, args);
        this.actionType = null;
        let figure = this.frontRoot.findFigure(x, y);
        figure = figure == this.frontRoot ? null : figure;
        if (figure instanceof Vertex || figure instanceof VertexController) {
            let model = this.findRealModel(figure);
            let selection = this.currentSelections[0];
            let isnew = !model.equals(selection);
            if (figure instanceof Vertex) {
                this.focusVertex(figure);
                this.actionType = 'changevertex';

            }
            if (figure instanceof VertexController) {
                this.actionType = 'changevertexcontroller';
            }
            if (isnew) {
                this.fireSelectionChangeEvent([model]);
            }
            if (this.actionType == 'changevertex') {
                this._selectedVertexType = 'v';
            }
            if (this.actionType == 'changevertexcontroller') {
                let isin = figure == figure.relate.inController;
                this._selectedVertexType = isin ? 'in' : 'out';
            }
            return;
        } else {
            figure = this.mainRoot.findFigure(x, y);
            figure = figure == this.mainRoot ? null : figure;
            if (figure instanceof shape.PathShape) {
                if (!this._shadowPath || this.shadowPath.id != figure.id || this._selectedVertex) {
                    this.fireSelectionChangeEvent([figure]);
                }
                this.actionType = 'move';
                return;
            }
        }
        this.fireSelectionChangeEvent([]);
    }

    focusVertex(vertex) {
        if (!vertex) return;
        this.shadowPath.applyRestingVisible();
        this.shadowPath.a = 0.2;
        vertex.showController(true, true);
        let index = this.shadowPath.indexOfVertex(vertex);
        let nv = this.shadowPath.getVertexFigure(index + 1);
        if (nv) nv.showController(true, false);
        let pv = this.shadowPath.getVertexFigure(index - 1);
        if (pv) pv.showController(false, true);
        this.frontRoot.refresh();
    }

    stopUpdate() {
        if (this._updateId) cancelAnimationFrame(this._updateId);
        this._updateId = null;
    }

    toolDeactived(x, y) {
        super.toolDeactived(x, y);
        this.stopUpdate();
        if (this.actionType == null) {
            return;
        }
        if (this.ex - this.sx == 0 && this.ey - this.sy == 0) return;
        if (this.actionType == 'move') {
            let selection = this.currentSelections[0];
            if (selection && selection instanceof shape.PathShape) {
                let m = selection.parent.worldMatrix.clone().invert();
                let lp = m.multiplyWithVertexDatas(this.sx, this.sy);
                let p = m.multiplyWithVertexDatas(this.ex, this.ey);
                let dx = p[0] - lp[0];
                let dy = p[1] - lp[1];
                return { type: 'move', figures: [selection], dx: dx, dy: dy };
            }
        }
        if (this.actionType == 'changevertex' || this.actionType == 'changevertexcontroller') {
            let selection = this.currentSelections[0];
            if (selection && selection instanceof Point && this._selectedVertex) {
                return {
                    type: 'vertex', vertex: selection,
                    copy: this._selectedVertex.model.clone()
                };
            }
        }
    }

    updateVertexHover(f) {
        if (this._lastVertexHover == f) return;
        if (this._lastVertexHover != null) this._lastVertexHover.blur();
        this._lastVertexHover = f;
        if (this._lastVertexHover) this._lastVertexHover.focus();
        this.frontRoot.refresh();
    }

    hoverMove(x, y) {
        super.hoverMove(x, y);
        let cf = this.frontRoot.findFigure(x, y);
        cf = cf == this.frontRoot ? null : cf;
        if (cf instanceof Vertex || cf instanceof VertexController) {
            this.updateHoverFigure();
            this.updateVertexHover(cf);
            if (this._selectedVertex) this._selectedVertex.focus()
            return;
        }
        let figure = this.mainRoot.findFigure(x, y);
        figure = figure == this.mainRoot ? null : figure;
        if (figure instanceof shape.PathShape || !figure) {
            this.updateVertexHover();
            this.updateHoverFigure(figure);
        }
        if (this._selectedVertex) this._selectedVertex.focus()
    }

    deleteLastHover() {
        if (this.lastHoverFigure) {
            this.frontRoot.removeChild(this.lastHoverFigure);
            this.lastHoverFigure.parent = null;
            this.lastHoverFigure.dispose();
            this.lastHoverFigure.relatedSelection = null;
            this.lastHoverFigure = null;
        }
    }


    updateHoverFigure(figure) {
        if (!figure) {
            this.deleteLastHover();
        } else {
            if (this.lastHoverFigure && this.lastHoverFigure.relatedSelection.id == figure.id) {
                return;
            }
            this.deleteLastHover();
            this.lastHoverFigure = Tool.createDelegateFigure(figure);
            if (this._shadowPath)
                this.frontRoot.insertChild(this.lastHoverFigure, this.frontRoot.indexOfChild(this._shadowPath));
            else this.frontRoot.addChild(this.lastHoverFigure);
        }

        this.frontRoot.refresh();
    }

    activeMove(x, y, l, t, r, b, dx, dy) {
        super.activeMove(x, y, l, t, r, b, dx, dy);
        if (this.actionType == 'move') {
            if (!this.lastHoverFigure) {
                let selection = this.currentSelections[0];
                if (selection && selection instanceof shape.PathShape) {
                    this.lastHoverFigure = Tool.createDelegateFigure(selection);
                    this.frontRoot.addChild(this.lastHoverFigure);
                }
            }
            if (this.lastHoverFigure) {
                this.lastHoverFigure.x += dx;
                this.lastHoverFigure.y += dy;
            }
        }
        if (this.actionType == 'changevertex') {
            if (this._selectedVertex) {
                this._selectedVertex.update(this._selectedVertex.x + dx, this._selectedVertex.y + dy);
                let in1 = this._selectedVertex.inController;
                if (in1) {
                    in1.update(in1.x + dx, in1.y + dy);
                }
                let out = this._selectedVertex.outController;
                if (out) {
                    out.update(out.x + dx, out.y + dy);
                }
            }
        }
        if (this.actionType == 'changevertexcontroller') {
            let controller = this._selectedVertex.inController;
            let another = this._selectedVertex.outController;
            if (this._selectedVertexType == 'out') {
                let t = controller;
                controller = another;
                another = t;
            }
            if (controller)
                controller.update(controller.x + dx, controller.y + dy);
            if (this._selectedVertex.type == 1) {
                if (another)
                    another.update(another.x - dx, another.y - dy);
            }
        }
        this.frontRoot.refresh();
    }

    getAnotherController(controller) {
        let p = controller.parent;
        if (p instanceof Vertex) {
            if (controller == p.inController) return p.outController;
            if (controller == p.outController) return p.inController;
        }
    }

    reset() {
        this.stopUpdate();
        this.deleteLastHover();
        super.reset();
    }
}