import utils from "../utils.js";
import FillStyle from "../shapes/paint-style/fill-style.js";
import Matrix3 from "../math/matrix3.js";
import TransformArrow from "./transfrom-arrow.js";
import Drawable from "../drawable.js";
import Circle from "../shapes/circle.js";
import StrokeStyle from "../shapes/paint-style/stroke-style.js";
import Color from "../color.js";

const START_RADIAN = -90 * utils.PI_DIV_180
export default class TransformFigure extends Drawable {
    constructor(props = { width: 100, height: 100 }) {
        super(props);
        this.path;
        this._circleSVGMatrix = new Matrix3()
            .rotate(START_RADIAN).toSVGMatrix();
        this.fillStyle = new FillStyle({
            color: new Color([239, 255, 251, 0.8])
        });
        this.ring = new Circle();
        let ring = this.ring;
        ring.radius = this.width / 2;
        ring.borderColor = new Color([80, 216, 144]);
        ring.borderWidth = 2;
        ring.color = null;
        this.addChild(ring);

        this.rotateFigure = new Circle({
            radius: 7
        });
        this.rotateFigure.color = new Color([39, 39, 39]);
        this.rotateFigure.x = Math.cos(-Math.PI / 2) * (this.width / 2);
        this.rotateFigure.y = Math.sin(- Math.PI / 2) * (this.width / 2);
        this.addChild(this.rotateFigure);
        this.xAxis = new TransformArrow();
        this.addChild(this.xAxis);
        this.yAxis = new TransformArrow();
        this.yAxis.rotation = Math.PI / 2;
        this.addChild(this.yAxis);
    }

    getDrawable(ctx, x, y, matrix) {
        let figure = super.getDrawable(ctx, x, y, matrix);
        if (figure == this || figure == this.ring) return null;
        return figure;
    }

    get rotation() { return super.rotation; }
    set rotation(r) {
        if (this.rotation != r) {
            super.rotation = r;
            this.path = null;
        }
    }

    getSelfPath(ctx, w, h) {
        if (this.path == null) {
            this.path = utils.createPath2D(ctx.wx_canvas);
            if (this.path) {
                let subpath = utils.createPath2D(ctx.wx_canvas);
                this.createPath(subpath, w, h);
                this.path.addPath(subpath, this._circleSVGMatrix);
            }
        }
        return this.path;
    }

    applyDrawingStates(ctx) {
        super.applyDrawingStates(ctx);
    }

    createPath(ctx, w, h) {
        ctx.moveTo(0, 0);
        let flag = true;
        let end = this.rotation;
        if (this.rotation < 0) {
            flag = false;
            end = 360 + this.rotation % 360;
        }
        ctx.arc(0, 0, w / 2, 0, -end, flag);
    }

    drawSelf(ctx, w, h) {
        // let path = this.getSelfPath(ctx, w, h);
        // if (!path) {
        //     ctx.beginPath();
        //     ctx.save();
        //     ctx.rotate(START_RADIAN);
        //     this.createPath(ctx, w, h);
        //     ctx.restore();
        // }
        // this.fillStyle.paint(ctx, path);
    }

    getRowVertices() {
        let a = this.width / 2 + this.rotateFigure.radius;
        let b = this.height / 2 + this.rotateFigure.radius;
        let w = 2 * a + this.xAxis.totalLength - a;
        let h = w;
        return [[-a, -b], [w - a, -b], [w - a, w - b], [-a, h - b]];
    }
}