export default class BaseStyle {
    constructor(props = {}) {
        this.name = props.name;
        this.id = props.id;
        this.color = props.color;
        this.opacity = props.opacity;
        if (this.opacity == null) {
            this.opacity = 1;
        }
    }

    canDraw() {
        return this.color != null && this.opacity != 0;
    }

    _applyStyle(ctx) {
        ctx.globalAlpha = this.opacity;
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