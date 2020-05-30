import Figure from "./figure.js";

export default class Container extends Figure {
    constructor(props = {}) {
        super(props);
        this.color = props.color || '#333333';
        this.animations = [];
    }

    addAnimation(a) {
        this.animations.push(a);
        a.parent = this;
    }

    applyDrawingStates(ctx) {
        super.applyDrawingStates(ctx);
        ctx.fillStyle = this.color;
    }

    drawSelf(ctx, w, h) {
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.closePath();
        ctx.fill();
    }
}