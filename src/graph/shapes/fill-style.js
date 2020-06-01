import BaseStyle from "./base-style.js";
import Color from "../color.js";

export default class FillStyle extends BaseStyle {
    constructor(props = {}) {
        super(props);
        this.fillRule = props.fillRule;
    }

    get fillColor() {
        return this.color;
    }

    set fillColor(value) {
        this.color = value;
    }

    get fillRadial() {
        return this.fillGradient;
    }

    set fillRadial(v) {
        this.fillGradient = v;
    }

    get fillGradient() {
        return this.gradientColor.values;
    }

    set fillGradient(values) {
        if (this.gradientColor != null) {
            this.gradientColor.values = values;
        }
    }

    _applyStyle(ctx) {
        super._applyStyle(ctx);
        if (this.fillColor != null) {
            ctx.fillStyle = this.fillColor.color;
        } else {
            if (this.gradientColor != null) {
                ctx.fillStyle = this.gradientColor.getGradient(ctx);
            }
        }
    }

    _paintStyle(ctx, path) {
        if (path) {
            ctx.fill(path);
        } else {
            ctx.fill();
        }
    }
}