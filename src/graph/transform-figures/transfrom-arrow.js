import Drawable from "../drawable.js";
import utils from "../utils.js";
import FillStyle from "../shapes/paint-style/fill-style.js";
import Shape from "../shapes/shape.js";
import Path from "../shapes/path.js";
import Point from "../shapes/point.js";

export default class TransformArrow extends Shape {
    constructor(props = { arrowLength: 70, arrowSize: 15, arrowHeight: 2, color: [79, 152, 202] }) {
        super(props);
        this.arrowLength = props.arrowLength;
        this.arrowHeight = props.arrowHeight;
        this.arrowSize = props.arrowSize;
        this.addFillStyle(new FillStyle({ color: props.color }));
        // this.fillStyle = new FillStyle({ color: props.color })
        this._singlePath = new Path();
        let path = this._singlePath;
        this._initArrowPath(path);
        path.isClose = true;
        this.addPath(path);
    }

    _initArrowPath(path) {
        path.addPoint(new Point({
            x: 0, y: -1
        }));
        path.addPoint(new Point({
            x: this.arrowLength, y: -1
        }));
        path.addPoint(new Point({
            x: this.arrowLength, y: -this.arrowSize / 2
        }));
        path.addPoint(new Point({
            x: this.arrowLength + this.arrowSize, y: 0
        }));
        path.addPoint(new Point({
            x: this.arrowLength, y: this.arrowSize / 2
        }));
        path.addPoint(new Point({
            x: this.arrowLength, y: 1
        }));
        path.addPoint(new Point({
            x: 0, y: 1
        }));
    }
    get totalLength() {
        return this.arrowLength + this.arrowSize;
    }

    _getTestStrokeWidth() {
        return 10;
    }

    containsPoint(ctx, x, y, matrix, strokeWidth = this._getTestStrokeWidth()) {
        if (x == null || y == null) return false;
        let worldMatrix = this.getWorldTransformMatrix();
        if (matrix) {
            matrix = matrix.clone();
            matrix.simpleMultiply(worldMatrix);
            worldMatrix = matrix;
        }
        let invertMatrix = worldMatrix.getInvert();
        if (invertMatrix == null) return false;
        let point = invertMatrix.multiplyWithVertexDatas(x, y);
        return this.containsRelativePoint(ctx, point[0], point[1], strokeWidth);
    }

    // getSelfPath(ctx, w, h) {
    //     if (this.path == null) {
    //         this.path = utils.createPath2D(ctx.wx_canvas);
    //         if (this.path) {
    //             this.path = utils.createPath2D(ctx.wx_canvas);
    //             this.createPath(this.path, w, h);
    //         }
    //     }
    //     return this.path;
    // }

    // createPath(ctx, w, h) {
    //     ctx.rect(0, -1, this.arrowLength, this.arrowHeight);
    //     ctx.moveTo(this.arrowLength, -this.arrowSize / 2);
    //     ctx.lineTo(this.arrowLength + this.arrowSize, 0);
    //     ctx.lineTo(this.arrowLength, this.arrowSize / 2)
    //     ctx.lineTo(this.arrowLength, -this.arrowSize / 2)
    // }

    // drawSelf(ctx, w, h) {
    //     let path = this.getSelfPath(ctx, w, h);
    //     if (!path) {
    //         ctx.beginPath();
    //         this.createPath(ctx, w, h);
    //     }
    //     this.fillStyle.paint(ctx, path);
    // }

    getRowVertices() {
        let l = this.arrowLength;
        let t = -this.arrowSize / 2;
        let r = l + this.arrowSize;
        let b = t + this.arrowSize;
        return [[l, t], [r, t], [r, b], [l, b]];
    }
}