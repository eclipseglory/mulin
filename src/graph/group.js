import Drawable from "./drawable.js";
import StrokeStyle from "./shapes/paint-style/stroke-style.js";
import Color from "./color.js";
import utils from "./utils.js";

export default class Group extends Drawable {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
        super(props);
        this.strokeStyle = new StrokeStyle({
            color: [60, 60, 60],
            width: 2,
            join: 2
        })
        this._nodeSize = 20;
        this.path;
    }

    get nodeSize() {
        return this._nodeSize;
    }

    set nodeSize(s) {
        if (this._nodeSize != s) {
            this, this._nodeSize = s;
            this.path = null;
        }
    }

    containsPoint(ctx, x, y, matrix) {
        if (x == null || y == null) return false;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let c = this._children[i];
            if (c.containsPoint(ctx, x, y, matrix)) {
                return true;
            }
        }
        return false;
    }

    getDrawable(ctx, x, y, matrix) {
        if (x == null || y == null) return null;
        if (ctx.drawGroupNode) {
            let x1 = x; let y1 = y;
            let worldMatrix = this.getWorldTransformMatrix();
            if (matrix) {
                matrix = matrix.clone();
                matrix.simpleMultiply(worldMatrix);
                worldMatrix = matrix;
            }
            let invertMatrix = worldMatrix.getInvert();
            let point = invertMatrix.multiplyWithVertexDatas(x1, y1);
            let r = this.nodeSize / 2;
            if (point[0] >= -r && point[1] >= -r && point[0] <= r && point[1] <= r)
                return this;
        }
        for (let i = this._children.length - 1; i >= 0; i--) {
            let c = this._children[i];
            if (c.containsPoint(ctx, x, y, matrix)) {
                return c.getDrawable(ctx, x, y, matrix);
            }
        }
        return null;
    }

    getNodeShapePath(ctx) {
        if (this.path == null) {
            this.path = utils.createPath2D(ctx.wx_canvas);
            if (this.path != null) {
                this.createPath(this.path);
            }
        }
        return this.path;
    }

    createPath(ctx) {
        let x = -this.nodeSize / 2
        let y = x;
        let q = this.nodeSize / 4;

        ctx.moveTo(x + 3 * q, y);
        ctx.lineTo(x + this.nodeSize, y);
        ctx.lineTo(x + this.nodeSize, y + q);

        ctx.moveTo(x + this.nodeSize, y + q * 3);
        ctx.lineTo(x + this.nodeSize, y + this.nodeSize);
        ctx.lineTo(x + 3 * q, y + this.nodeSize);

        ctx.moveTo(x + q, y + this.nodeSize);
        ctx.lineTo(x, y + this.nodeSize);
        ctx.lineTo(x, y + q * 3);

        ctx.moveTo(x, y + q);
        ctx.lineTo(x, y);
        ctx.lineTo(x + q, y);

        ctx.moveTo(0, 0);
        ctx.rect(- (q / 2), -(q / 2), q, q);
    }


    getSelfPath(ctx, w, h) {
        let path = this.getNodeShapePath(ctx);
        if (!path) {
            ctx.beginPath();
            this.createPath(ctx);
        }
        return path;
    }

    drawSelf(ctx, w, h) {
        if (!ctx.drawGroupNode) return;
        let path = this.getSelfPath(ctx);
        this.strokeStyle.paint(ctx, path);
    }
}