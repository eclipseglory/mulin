import Figure from "./figure.js";
import Color from "./color.js";
import utils from "./utils.js";

/**
 * 一个矩形的容器，能够绘制自身
 */
export default class Container extends Figure {
    constructor(props = {}) {
        super(props);
        this.color = new Color(props.color);
        this.path;
    }

    get width() { return super.width }
    set width(w) {
        if (this.width != w) {
            super.width = w;
            this.path = null;
        }
    }

    get height() { return super.height }
    set height(w) {
        if (this.height != w) {
            super.height = w;
            this.path = null;
        }
    }

    applyDrawingStates(ctx) {
        super.applyDrawingStates(ctx);
        ctx.fillStyle = this.color.color;
    }

    getPath2D(ctx, w, h) {
        if (this.path == null) {
            this.path = utils.createPath2D(ctx.wx_canvas);
            if (this.path) {
                this.drawPath(this.path, w, h);
            }
        }
        return this.path;
    }

    clip(ctx) {
        return true;
    }

    drawPath(ctx, w, h) {
        ctx.moveTo(0, 0);
        ctx.rect(0, 0, w, h);
        ctx.closePath();
    }

    drawSelf(ctx, w, h) {
        let path = this.getPath2D(ctx, w, h);
        if (path) {
            ctx.fill(path);
        } else {
            ctx.beginPath();
            this.drawPath(ctx, w, h);
            ctx.fill();
        }
    }

    // drawChildren(ctx){
    //     ctx.save();
    //     ctx.beginPath();
    //     ctx.rect(0,0,this.width,this.height);
    // }
}