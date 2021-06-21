import { Utils } from "figures";
import { CenterEllipse } from "figures/shape";
import Tool from "../tool";

export default class RadialGradientTool extends Tool {
    constructor(f, m, b) {
        super(f, m, b, 'radialGradient');
    }

    prepare(args) {
        super.prepare(args);
        this.moveFigure = null;
    }

    deleteFeedback() {
        if (this.center) {
            this.frontRoot.removeChild(this.center);
            this.center.parent = null;
            this.center.related = null;
            this.center.dispose();
            this.center = null;
        }
        if (this.radius) {
            this.frontRoot.removeChild(this.radius);
            this.radius.parent = null;
            this.radius.related = null;
            this.radius.dispose();
            this.radius = null;
        }
        if (this.circle) {
            this.frontRoot.removeChild(this.circle);
            this.circle.parent = null;
            this.circle.dispose();
            this.circle = null;
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
        if (figure.fill != 3) return;
        let m = figure.worldMatrix;
        let pose = m.decompose();
        let scalex = pose.scale.x;
        let scaley = pose.scale.y;
        let gradient = figure.radialGradient;
        let p1 = m.multiplyWithVertexDatas(gradient.x, gradient.y);
        let frist = gradient.colorStops[0];
        let last = gradient.colorStops[gradient.colorStops.length - 1];

        this.circle = new CenterEllipse({
            x: p1[0], y: p1[1], width: gradient.radius * 2 * scalex,
            height: gradient.radius * 2 * scaley, borderWidth: 1, fill: 0,
            br: Tool.FEEDBACK_B_COLOR[0], bg: Tool.FEEDBACK_B_COLOR[1], bb: Tool.FEEDBACK_B_COLOR[2],
        });
        this.frontRoot.addChild(this.circle);

        this.center = new CenterEllipse({
            x: p1[0], y: p1[1], width: 15, height: 15,
            r: frist.color[0], g: frist.color[1], b: frist.color[2], a: frist.color[3],
            br: Tool.FEEDBACK_B_COLOR[0], bg: Tool.FEEDBACK_B_COLOR[1], bb: Tool.FEEDBACK_B_COLOR[2],
        })
        this.center.related = figure;
        this.frontRoot.addChild(this.center);

        // let p2 = m.multiplyWithVertexDatas(gradient.x2, gradient.y2);
        this.radius = new CenterEllipse({
            x: p1[0] + gradient.radius * scalex, y: p1[1], width: 15, height: 15,
            r: last.color[0], g: last.color[1], b: last.color[2], a: last.color[3],
            br: Tool.FEEDBACK_B_COLOR[0], bg: Tool.FEEDBACK_B_COLOR[1], bb: Tool.FEEDBACK_B_COLOR[2],
        })
        this.radius.related = figure;
        this.frontRoot.addChild(this.radius);

        // this.circle.addPoint(new Point(p2[0] - p1[0], p2[1] - p1[1], 0));
        // this.frontRoot.refresh();
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
        if (figure && figure.fill == 3) {
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
        if (f2 == this.radius || f2 == this.center || f2 == this.circle) {
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
        if (f2 == this.radius || f2 == this.center) {
            this.moveFigure = f2;
            return;
        } else {
            f2 = this.mainRoot.findFigure(x, y);
            f2 = f2 == this.mainRoot ? null : f2;
            if (!f2) {
                this.fireSelectionChangeEvent([]); return;
            }
            if (f2.fill == 3) {
                this.fireSelectionChangeEvent([f2]);
            }
        }
    }

    toolDeactived(x, y, event) {
        super.toolDeactived(x, y, event);
        if ((this.sx - this.ex == 0 && this.sy - this.ey == 0) || !this.moveFigure) return;
        if (this.center && this.radius) {
            let f = this.center.related;
            let m = f.worldMatrix;
            let pose = m.decompose();
            m = m.invert();
            let p = m.multiplyWithVertexDatas(this.center.x, this.center.y);
            let dis = Utils.distance(this.radius.x, this.radius.y, this.center.x, this.center.y);
            return { x: p[0], y: p[1], radius: dis / pose.scale.x };
        }
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
        if (this.moveFigure == this.center) {
            this.moveFigure.x += dx;
            this.moveFigure.y += dy;
            this.radius.x += dx;
            this.radius.y += dy;
            this.circle.x += dx;
            this.circle.y += dy;
        }
        if (this.moveFigure == this.radius) {
            let f = this.moveFigure.related;
            let pose = f.worldMatrix.decompose();
            this.radius.x += dx;
            let dis = Utils.distance(this.radius.x, this.radius.y, this.center.x, this.center.y);
            this.circle.width = dis * 2;
            this.circle.height = this.circle.width * pose.scale.y / pose.scale.x;
        }

        this.frontRoot.refresh();
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