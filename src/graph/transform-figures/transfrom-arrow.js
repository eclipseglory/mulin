import Drawable from "../drawable.js";
import utils from "../utils.js";
import FillStyle from "../shapes/paint-style/fill-style.js";

export default class TransformArrow extends Drawable {
    constructor(props = { arrowLength: 70, arrowSize: 15, arrowHeight: 2, color: [79, 152, 202] }) {
        super(props);
        this.arrowLength = props.arrowLength;
        this.arrowHeight = props.arrowHeight;
        this.arrowSize = props.arrowSize;
        this.fillStyle = new FillStyle({ color: props.color })
    }

    get totalLength() {
        return this.arrowLength + this.arrowSize;
    }

    getSelfPath(ctx, w, h) {
        if (this.path == null) {
            this.path = utils.createPath2D(ctx.wx_canvas);
            if (this.path) {
                this.path = utils.createPath2D(ctx.wx_canvas);
                this.createPath(this.path, w, h);
            }
        }
        return this.path;
    }

    createPath(ctx, w, h) {
        ctx.rect(0, -1, this.arrowLength, this.arrowHeight);
        ctx.moveTo(this.arrowLength, -this.arrowSize / 2);
        ctx.lineTo(this.arrowLength + this.arrowSize, 0);
        ctx.lineTo(this.arrowLength, this.arrowSize / 2)
        ctx.lineTo(this.arrowLength, -this.arrowSize / 2)
    }

    drawSelf(ctx, w, h) {
        let path = this.getSelfPath(ctx, w, h);
        if (!path) {
            ctx.beginPath();
            this.createPath(ctx, w, h);
        }
        this.fillStyle.paint(ctx, path);
    }

    getRowVertices() {
        let l = this.arrowLength;
        let t = -this.arrowSize / 2;
        let r = l + this.arrowSize;
        let b = t + this.arrowSize;
        return [[l, t], [r, t], [r, b], [l, b]];
    }
}