import BaseStyle from "./base-style.js";
import Color from "../../color.js";
import GradientColor from "../../gradient-color.js";
import Matrix3 from "../../math/matrix3.js";

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
            let color = this.fillColor;
            if (color instanceof Color) {
                ctx.fillStyle = color.color;
            }
            if (color instanceof GradientColor) {
                ctx.fillStyle = color.getGradient(ctx);
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

    clone() {
        let fill = new FillStyle({
            name: this.name,
            opacity: this.opacity,
            fillRule: this.fillRule,
        });
        if (this._color) {
            fill._color = this._color.clone();
        }
        if (this.gradientColor) {
            fill.gradientColor = this.gradientColor.clone();
        }
        return fill;
    }
}