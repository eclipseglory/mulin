import BaseStyle from "./base-style.js";


const JOIN = ['bevel', 'round', 'miter'];
const CAP = ['butt', 'round', 'square'];

export default class StrokeStyle extends BaseStyle {
    constructor(props = {}) {
        super(props);
        this.trim = props.trim;
        if (this.trim == null) this.trim = 0;
        this.end = props.end;
        if (this.end == null) this.end = 1;
        this.start = props.start;
        if (this.start == null) this.start = 0;
        this.offset = props.offset;
        if (this.offset == null) this.offset = 0;
        this.join = props.join;
        if (this.join == null) this.join = 0; // "bevel" || "round" || "miter";
        this.cap = props.cap;
        if (this.cap == null) this.cap = 0; // "butt" || "round" || "square";
        this.width = props.width;
        if (this.width == null) this.width = 0;
    }

    canDraw() {
        return super.canDraw() && (this.end - this.start != 0);// && this.offset < 1 && (this.end - this.start != 0);
    }

    _applyStyle(ctx, length) {
        super._applyStyle(ctx);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineJoin = JOIN[this.join];
        ctx.lineCap = CAP[this.cap];
        // 利用虚线模拟路径分段绘制
        if (this.offset == 0 && this.start == 0 && this.end == 1) {

        } else {
            if (this.end - this.start < 1) {
                let visibleLength = (this.end - this.start) * length;
                ctx.lineDashOffset = -(this.offset + this.start) * length;
                ctx.setLineDash([visibleLength, length - visibleLength]);
            }
        }
    }

    _paintStyle(ctx, path) {
        if (path) {
            ctx.stroke(path);
        } else {
            ctx.stroke();
        }
    }

    paint(ctx, path, length) {
        if (!this.canDraw()) return;
        ctx.save();
        this._applyStyle(ctx, length);
        this._paintStyle(ctx, path);
        ctx.restore();
    }
}