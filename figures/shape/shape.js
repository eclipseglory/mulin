import CanvasKitUtils from "../canvaskit-utils.js";
import utils from "../canvaskit-utils.js"
import Figure from "../figure.js";

export default class Shape extends Figure {
    constructor(props) {
        super(props);
        this.setAntiAlias(true);

        this.borderWidth = props == null || props.borderWidth == null ? 1 : props.borderWidth;
        this.cap = props == null || props.cap == null ? CanvasKitUtils.StrokeCap.Butt : props.cap;
        this.join = props == null || props.join == null ? CanvasKitUtils.StrokeJoin.Bevel : props.join;
        this.miter = props == null || props.miter == null ? 2 : props.miter;
    }


    setAntiAlias(f) {
        if (!this._paint) return;
        this.getTarget()._paint.setAntiAlias(f);
    }

    get cap() {
        if (!this._paint) return;
        return this.getTarget()._paint.getStrokeCap();
    }

    set cap(c) {
        if (!this._paint) return;
        this.getTarget()._paint.setStrokeCap(c);
    }

    get join() {
        if (!this._paint) return;
        return this.getTarget()._paint.getStrokeJoin();
    }

    set join(c) {
        if (!this._paint) return;
        this.getTarget()._paint.setStrokeJoin(c);
    }

    get miter() {
        if (!this._paint) return;
        return this.getTarget()._paint.getStrokeMiter();
    }

    set miter(c) {
        if (!this._paint) return;
        this.getTarget()._paint.setStrokeMiter(c);
    }

    get width() {
        return super.width;
    }

    set width(w) {
        if (w != this.width) {
            super.width = w;
            this.fireShapeDirty();
        }
    }

    get height() {
        return super.height;
    }

    set height(w) {
        if (w != this.height) {
            super.height = w;
            this.fireShapeDirty();
        }
    }

    deletePath() {
        if (this._path) {
            this.getTarget()._path.delete();
            this._path = null;
        }
    }

    fireShapeDirty() {
        this.deletePath();
        this.fireBoundsDirty();
        this.updateRelatedQuadTree();
        this.fireEvent('shapeDirty');
    }

    getPath() {
        if (!this._path) {
            this._path = utils.newPath();
            this.drawPath(this._path);
        }
        return this._path;
    }

    applyClip(ctx) {
        let path = this.getPath();
        if (path) ctx.clipPath(path, CanvasKitUtils.ClipOp.Intersect, true);
    }

    drawSelf(canvas) {
        if (this.alpha <= 0) return;
        let path = this.getPath();
        let pathEffect = this.getPathEffect();
        if (pathEffect) this._paint.setPathEffect(pathEffect);
        if (path) {
            if (this.a > 0 && this.fill > 0) {
                this._paint.setShader(null);
                this._paint.setStyle(utils.fillStyle);
                if (this.fill == 1) {
                    this._paint.setColorComponents(this.r / 255, this.g / 255, this.b / 255,
                        this.a * this.alpha);
                }
                if (this.fill == 2) {
                    let shader = this.linearGradient.getShader();
                    if (shader) this._paint.setShader(shader);
                }
                if (this.fill == 3) {
                    let shader = this.radialGradient.getShader();
                    if (shader) this._paint.setShader(shader);
                }

                canvas.drawPath(path, this._paint);
            }
            if (this.showBorder > 0 && this.borderWidth > 0 && this.ba > 0) {
                this._paint.setStrokeWidth(this.borderWidth);
                this._paint.setShader(null);
                this._paint.setStyle(utils.strokeStyle);
                if (this.showBorder == 1)
                    this._paint.setColorComponents(this.br / 255, this.bg / 255, this.bb / 255,
                        this.ba * this.alpha);
                if (this.showBorder == 2) {
                    let shader = this.borderLinearGradient.getShader();
                    if (shader) this._paint.setShader(shader);
                }
                if (this.showBorder == 3) {
                    let shader = this.borderRadialGradient.getShader();
                    if (shader) this._paint.setShader(shader);
                }
                canvas.drawPath(path, this._paint);
            }
        }

        //debug: 绘制bounds
        // {
        // let b = this.bounds;
        // canvas.drawRect(CanvasKitUtils.newXYWHRect(b.left, b.top,
        //     b.right - b.left, b.bottom - b.top),
        //     this._paint);
        // }
    }

    drawPath(path) { }

    dispose() {
        if (this.isDisposed) return;
        this.deletePath();
        super.dispose();
    }

    clone() {
        let me = super.clone();
        if (me) {
            me.borderWidth = this.borderWidth;
            me.cap = this.cap;
            me.join = this.join;
            me.miter = this.miter;
            return me;
        }
    }

    getJsonObjectName() { return 'shape' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        let border = obj.border;
        if (border) {
            border.width = this.borderWidth, border.cap = this.cap.value, border.join = this.join.value;
            border.miter = this.miter;
        }
        return obj;
    }

    getSVGExtensionString() {
        let str = super.getSVGExtensionString();
        if (this.showBorder > 0) {
            let join = utils.getJoinText(this.join);
            if (join) str += ` stroke-linejoin="${join}"`
            if (join == 'miter') str += ` stroke-miterlimit="${this.miter}"`
            let cap = utils.getCapText(this.cap);
            if (cap) str += ` stroke-linecap="${cap}"`
        }
        return str;
    }

}