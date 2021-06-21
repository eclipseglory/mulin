import { Point } from "figures";
import { Line } from "figures/shape";
import Tool from "../tool.js";

export default class LineTool extends Tool {
    constructor(f, m, b) {
        super(f, m, b, 'line');
    }

    deleteLine() {
        if (this.line) {
            this.line.parent.removeChild(this.line);
            this.line.dispose();
            this.line.parent = null;
            this.line = null;
        }
    }

    createLine(x, y) {
        this.deleteLine();
        if (!this.line) {
            this.line = new Line({ x: x, y: y });
            this.line.getPathModel().addPoint(new Point());
            this.line.getPathModel().addPoint(new Point());
            this.frontRoot.addChild(this.line);
        }
        return this.line;
    }

    toolActived(x, y, event) {
        super.toolActived(x, y, event);
        let line = this.createLine(x, y);
        line.x = x;
        line.y = y;
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
        super.activeMove(x, y, l, t, r, b, dx, dy, event);
        let p = this.line.getPathModel().getPoint(1)
        if (!p) return;
        p.x += dx;
        p.y += dy;
        this.frontRoot.refresh();
    }

    toolDeactived(x, y, event) {
        super.toolDeactived(x, y, event);
        if (!this.line || !this.mainRoot) return;
        if (this.ex - this.sx == 0 && this.ey - this.sy == 0) {
            return;
        }
        let start = [this.line.x, this.line.y];
        let m = this.mainRoot.worldMatrix.clone().invert();
        start = m.multiplyWithVertexDatas(start[0], start[1]);
        let newLine = new Line({ name: 'Line', x: start[0], y: start[1] });
        newLine.getPathModel().addPoint(new Point());
        let endPoint = this.line.getPathModel().getPoint(1);
        newLine.getPathModel().addPoint(new Point(endPoint.x / this.mainRoot.scalex, endPoint.y / this.mainRoot.scaley));
        this.deleteLine();
        this.frontRoot.refresh();

        return { figure: newLine, name: 'Line' };
    }

    reset() {
        this.deleteLine();
        super.reset();
    }

    unUse() {
        this.deleteLine();
        super.unUse();
    }
}