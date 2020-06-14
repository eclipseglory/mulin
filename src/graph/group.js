import Drawable from "./drawable.js";
import StrokeStyle from "./shapes/paint-style/stroke-style.js";
import utils from "./utils.js";
import Color from "./color.js";

export default class Group extends Drawable {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
        super(props);
        this.strokeStyles = [];
        this.fillStyles = [];
        this.addStrokeStyle(new StrokeStyle({
            color: new Color([60, 60, 60]),
            width: 2,
            join: 1
        }));
        this._nodeSize = 20;
        this.path;
    }

    addFillStyle(style) {
        if (this.fillStyles.indexOf(style) == -1)
            this.fillStyles.push(style);
    }

    addStrokeStyle(style) {
        if (this.strokeStyles.indexOf(style) == -1)
            this.strokeStyles.push(style);
    }

    removeFillStyle(style) {
        this.removeFillStyleAt(this.fillStyles.indexOf(style));
    }

    removeFillStyleAt(index) {
        if (index < 0 || index > this.fillStyles.length - 1) return;
        this.fillStyles.splice(index, 1);
    }

    removeStrokeStyle(style) {
        this.removeStrokeStyleAt(this.strokeStyles.indexOf(style));
    }

    removeStrokeStyleAt(index) {
        if (index < 0 || index > this.strokeStyles.length - 1) return;
        this.strokeStyles.splice(index, 1);
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
            if (invertMatrix == null) return null;
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

    drawChildren(ctx) {
        ctx.save();
        super.drawChildren(ctx);
        ctx.restore();
        this.drawGroupNode(ctx, this.width, this.height);
    }

    /**
     * Group Node实际是一个虚拟的图形，在实际图形中是不会绘制的，可以看做一个多图形的公用
     * 锚点以及公共剪切设置的存在，但在编辑器中是需要展示的，所以这里简单绘制一个图案以便在
     * 编辑器中展示出来。
     * 由于该图形需要显示在所有子图形之上，所以不会在``drawSelf``中实现，而是在``drawChildren``方法
     * 结束后再调用
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} w 
     * @param {Number} h 
     */
    drawGroupNode(ctx, w, h) {
        if (!ctx.drawGroupNode) return;
        let path = this.getSelfPath(ctx);
        this.fillStyles.forEach(fillStyle => {
            fillStyle.paint(ctx, path);
        });
        this.strokeStyles.forEach(strokeStyle => {
            strokeStyle.paint(ctx, path);
        })
    }
}