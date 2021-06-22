import { CanvasKitUtils, Figure } from "."

export default class ImageFigure extends Figure {
    constructor(props) {
        super(props);
        this.image = props == null ? null : props.image;
        this.srcWidth = props == null || props.srcWidth == null ? 0 : props.srcWidth;
        this.srcHeight = props == null || props.srcHeight == null ? 0 : props.srcHeight;
        this.srcX = props == null || props.srcX == null ? 0 : props.srcX;
        this.srcY = props == null || props.srcY == null ? 0 : props.srcY;
    }

    set clip(v) { }
    get clip() { return false }

    drawSelf(canvas) {
        if (!this.image) return;
        let rect = CanvasKitUtils.newXYWHRect(-this.width / 2, -this.height / 2, this.width, this.height);
        let sr = CanvasKitUtils.newXYWHRect(this.srcX, this.srcY, this.srcWidth, this.srcHeight);
        canvas.drawImageRect(this.image, sr, rect, this._paint);
    }

    createMySelf() {
        return new ImageFigure({ image: this.getTarget().image });
    }

    clone() {
        let me = super.clone();
        me.srcWidth = this.srcWidth;
        me.srcHeight = this.srcHeight;
        me.srcX = this.srcX;
        me.srcY = this.srcY;
        return me;
    }

    calculateLocalBounds(out = { left, top, right, bottom }) {
        out.left = -this.width / 2;
        out.top = -this.height / 2;
        out.right = this.width / 2;
        out.bottom = this.height / 2;
        return out;
    }
}