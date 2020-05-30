import BaseStyle from "./base-style.js";

export default class FillStyle extends BaseStyle {
    constructor(props = { color: '#000000' }) {
        super(props);
        this.fillRule = props.fillRule;
    }

    _applyStyle(ctx) {
        super._applyStyle(ctx);
        ctx.fillStyle = this.color;
    }

    _paintStyle(ctx, path) {
        if (path) {
            ctx.fill(path);
        } else {
            ctx.fill();
        }
    }
}