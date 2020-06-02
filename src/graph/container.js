import Figure from "./figure.js";
import Color from "./color.js";

/**
 * 一个矩形的容器，能够绘制自身
 */
export default class Container extends Figure {
    constructor(props = {}) {
        super(props);
        this.color = new Color(props.color);
    }


    applyDrawingStates(ctx) {
        super.applyDrawingStates(ctx);
        ctx.fillStyle = this.color.color;
    }

    drawSelf(ctx, w, h) {
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.closePath();
        ctx.fill();
    }
}