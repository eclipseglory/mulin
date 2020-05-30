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

    _applyCurrentDrawingStates(ctx) {
        super._applyCurrentDrawingStates(ctx);
        ctx.fillStyle = this.color;
    }

    _drawSelf(ctx, w, h) {
        ctx.rect(0, 0, w, h);
        ctx.fill();
    }
}