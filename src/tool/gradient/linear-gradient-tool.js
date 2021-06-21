import { Point } from "figures";
import { CenterEllipse, Line } from "figures/shape";
import Tool from "../tool";

export default class LinearGradientTool extends Tool {
    constructor(f, m, b) {
        super(f, m, b, 'linearGradient');
    }

    prepare(args) {
        super.prepare(args);
        this.moveFigure = null;
    }

    deleteFeedback() {
        if (this.start) {
            this.frontRoot.removeChild(this.start);
            this.start.parent = null;
            this.start.related = null;
            this.start.dispose();
            this.start = null;
        }
        if (this.end) {
            this.frontRoot.removeChild(this.end);
            this.end.parent = null;
            this.end.related = null;
            this.end.dispose();
            this.end = null;
        }
        if (this.line) {
            this.frontRoot.removeChild(this.line);
            this.line.parent = null;
            this.line.dispose();
            this.line = null;
        }
        this.frontRoot.refresh();
    }

    updateCurrentSelections(selections) {
        super.updateCurrentSelections(selections);
        this.deleteFeedback();
        if (selections && selections.length == 1) {
            let selection = selections[0];
            this.createFeedback(selection);
        }
    }

    createFeedback(figure) {
        this.deleteFeedback();
        if (figure.fill != 2) return;
        let m = figure.worldMatrix;
        let gradient = figure.linearGradient;
        let p1 = m.multiplyWithVertexDatas(gradient.x1, gradient.y1);
        let frist = gradient.colorStops[0];
        let last = gradient.colorStops[gradient.colorStops.length - 1];

        this.line = new Line({ x: p1[0], y: p1[1], borderWidth: 2 });
        this.line.addPoint(new Point(0, 0, 0));
        this.frontRoot.addChild(this.line);

        this.start = new CenterEllipse({
            x: p1[0], y: p1[1], width: 15, height: 15,
            r: frist.color[0], g: frist.color[1], b: frist.color[2], a: frist.color[3],
            br: Tool.FEEDBACK_B_COLOR[0], bg: Tool.FEEDBACK_B_COLOR[1], bb: Tool.FEEDBACK_B_COLOR[2],
        })
        this.start.related = figure;
        this.frontRoot.addChild(this.start);

        let p2 = m.multiplyWithVertexDatas(gradient.x2, gradient.y2);
        this.end = new CenterEllipse({
            x: p2[0], y: p2[1], width: 15, height: 15,
            r: last.color[0], g: last.color[1], b: last.color[2], a: last.color[3],
            br: Tool.FEEDBACK_B_COLOR[0], bg: Tool.FEEDBACK_B_COLOR[1], bb: Tool.FEEDBACK_B_COLOR[2],
        })
        this.end.related = figure;
        this.frontRoot.addChild(this.end);

        this.line.addPoint(new Point(p2[0] - p1[0], p2[1] - p1[1], 0));
        this.frontRoot.refresh();
    }

    updateHover(figure) {
        if (this.hover && this.hover.related == figure) {
            return;
        }
        if (this.hover) {
            this.frontRoot.removeChild(this.hover);
            this.hover.parent = null;
            this.hover.dispose();
            this.hover = null;
        }
        if (figure && figure.fill == 2) {
            this.hover = Tool.createDelegateFigure(figure);
            this.hover.related = figure;
            this.frontRoot.addChild(this.hover);
        }
        this.frontRoot.refresh()
    }

    hoverMove(x, y, event) {
        super.hoverMove(x, y, event);
        let f = this.mainRoot.findFigure(x, y);
        let f2 = this.frontRoot.findFigure(x, y);
        if (f2 == this.end || f2 == this.start) {
            this.updateHover()
            return;
        }
        f = f == this.mainRoot ? null : f;
        this.updateHover(f);
    }

    toolActived(x, y, event) {
        super.toolActived(x, y, event);
        this.updateHover();
        let f2 = this.frontRoot.findFigure(x, y);
        if (f2 == this.end || f2 == this.start) {
            this.moveFigure = f2;
            return;
        } else {
            f2 = this.mainRoot.findFigure(x, y);
            f2 = f2 == this.mainRoot ? null : f2;
            if (!f2) {
                this.fireSelectionChangeEvent([]); return;
            }
            if (f2.fill == 2) {
                this.fireSelectionChangeEvent([f2]);
            }
        }
    }

    toolDeactived(x, y, event) {
        super.toolDeactived(x, y, event);
        if ((this.sx - this.ex == 0 && this.sy - this.ey == 0) || !this.moveFigure) return;
        if (this.start && this.end) {
            let f = this.start.related;
            let m = f.worldMatrix.clone().invert();
            let p = m.multiplyWithVertexDatas(this.start.x, this.start.y);
            let p1 = m.multiplyWithVertexDatas(this.end.x, this.end.y);
            return { x1: p[0], y1: p[1], x2: p1[0], y2: p1[1] };
        }
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
        if (this.moveFigure) {
            this.moveFigure.x += dx;
            this.moveFigure.y += dy;
            let l1, l2;
            if (this.moveFigure == this.start) {
                l1 = this.line.getPathModel().getPoint(0);
                l2 = this.line.getPathModel().getPoint(1);
            } else {
                l1 = this.line.getPathModel().getPoint(1);
                l2 = this.line.getPathModel().getPoint(0);
            }
            l1.x += dx;
            l1.y += dy;
            if (event.altKey) {
                let another = this.start == this.moveFigure ? this.end : this.start;
                another.x -= dx;
                another.y -= dy;
                l2.x -= dx;
                l2.y -= dy;
            }
            this.frontRoot.refresh();
        }
    }

    reset() {
        super.reset();
        this.moveFigure = null;
    }

    unUse() {
        super.unUse();
        this.updateHover();
        this.deleteFeedback();
    }
}