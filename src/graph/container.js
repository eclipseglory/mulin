import Figure from "./figure.js";
import Color from "./color.js";

export default class Container extends Figure {
    constructor(props = {}) {
        super(props);
        this.color = new Color(props.color);
        this.animations = [];
    }

    addAnimation(a) {
        this.animations.push(a);
        a.parent = this;
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