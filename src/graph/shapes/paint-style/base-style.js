import Color from "../../color.js";

export default class BaseStyle {
    constructor(props = {}) {
        this.name = props.name;
        this.id = props.id;
        this._color;
        if (props.color != null)
            this._color = new Color(props.color);
        this.gradientColor = props.gradientColor;
        this.opacity = props.opacity;
        if (this.opacity == null) {
            this.opacity = 1;
        }
    }

    get color() {
        return this._color;
    }

    set color(array) {
        if (array instanceof Color) {
            this._color = array;
            return;
        }
        if (array instanceof Array) {
            if (this._color == null) {
                this._color = new Color(array);
                return;
            }
            this._color.color = array;
        }
    }

    canDraw() {
        return (this.color != null || this.gradientColor != null) && this.opacity != 0;
    }

    _applyStyle(ctx) {
        ctx.globalAlpha *= this.opacity;
    }

    paint(ctx, path) {
        if (!this.canDraw()) return;
        ctx.save();
        this._applyStyle(ctx);
        this._paintStyle(ctx, path);
        ctx.restore();
    }

    _paintStyle(ctx, path) { }
}