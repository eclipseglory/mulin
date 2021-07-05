import { Path, Point } from "../../figures";
import { PathShape } from "../../figures/shape";
import { douglasPeucker, smoothLines } from "../douglas-peucker.js";
import Tool from "./tool";

export default class CurveLineTool extends Tool {
    constructor(f, m, b, id = 'curve') {
        super(f, m, b, id);
    }

    disposeLine() {
        if (this.line) {
            this.frontRoot.removeChild(this.line);
            this.line.parent = null;
            this.line.dispose();
            this.line = null;
        }
    }

    toolActived(x, y, event) {
        this.disposeLine();
        if (this.line == null) {
            this.line = new PathShape({ x: x, y: y });
            this.line.addPoint(new Point(0, 0));
            this.frontRoot.addChild(this.line);
        }
        this.frontRoot.refresh();
    }

    activeMove(x, y) {
        if (this.line) {
            this.line.addPoint(new Point(x - this.line.x, y - this.line.y));
            this.frontRoot.refresh();
        }
    }

    toolDeactived(x, y, event) {
        let model = this.line.getPathModel().clone();
        let tx = this.line.x;
        let ty = this.line.y;
        let nx = this.line.x;
        let ny = this.line.y;
        let m = this.mainRoot.worldMatrix.clone().invert();
        let p1 = m.multiplyWithVertexDatas(nx, ny);
        nx = p1[0], ny = p1[1];
        this.disposeLine();
        this.frontRoot.refresh();
        if (this.sx - x == 0 && this.sy - y == 0) return;
        let points = model.points.map((p) => {
            // let p1 = m.multiplyWithVertexDatas(p.x + tx, p.y + y);
            return [p.x / this.mainRoot.scalex, p.y / this.mainRoot.scaley]
        });
        let newPoints = douglasPeucker(points);
        model.dispose();
        model = null;
        points.length = 0;
        points = null;
        console.log(newPoints);
        let ps;
        if (newPoints.length >= 3) {
            ps = smoothLines(newPoints);
            newPoints.length = 0; newPoints = null;
        } else {
            ps = newPoints.map(np => { return { x: np[0], y: np[1] } });
            newPoints.length = 0; newPoints = null;
        }

        let pathFigure = new PathShape({ x: nx, y: ny });
        ps.forEach((p) => {
            let point = new Point(p.x, p.y, 1);
            pathFigure.addPoint(point);
            if (p.in) {
                point.inX = p.in.x;
                point.inY = p.in.y;
            }
            if (p.out) {
                point.outX = p.out.x;
                point.outY = p.out.y;
            }
        });
        return { figure: pathFigure, name: 'Curve Figure' };
    }
}