import VertexController from "./vertex-controller.js";
import { shape, CanvasKitUtils } from "figures";

export default class Vertex extends shape.CenterRect {
    constructor(pointModel, props) {
        super(props);
        this.model = pointModel;
        this._linePaint = CanvasKitUtils.newPaint();
        this._linePaint.setStyle(CanvasKitUtils.strokeStyle);
        this._linePaint.setColorComponents(0, 0, 255, 1);
        this._linePaint.setAntiAlias(false);
        this._isfocus = false;
    }

    get type() {
        if (this.model) return this.model.type
    }

    set type(t) {
        if (this.model && this.model.type != t) {
            this.model.type = t;
        }
    }

    focus() {
        this._isfocus = true;
    }

    blur() {
        this._isfocus = false;
    }

    hideController(flagIn = true, flagOut = true) {
        if (this.inController) this.inController.visible = true;
        if (this.outController) this.outController.visible = true;
        if (this.inController && flagIn) this.inController.visible = false;
        if (this.outController && flagOut) this.outController.visible = false;
    }

    showController(in1 = true, out = true) {
        if (this.inController) this.inController.visible = false;
        if (this.outController) this.outController.visible = false;
        if (this.inController && in1) this.inController.visible = true;
        if (this.outController && out) this.outController.visible = true;
    }

    initControllerPoints() {
        let m = this.master.worldMatrix;
        if (!this.inController && this.model && this.model.in) {
            let x = this.x;
            let y = this.y;
            if (this.model.in) {
                x = this.model.inX;
                y = this.model.inY;
                let p = m.multiplyWithVertexDatas(x, y);
                x = p[0], y = p[1];
            }
            this.inController = new VertexController(this.model, false, {
                x: x, y: y,
                width: this.width, height: this.height
            });
            this.inController.master = this.master;
            this.inController.relate = this;
            this.parent.addChild(this.inController);
        }
        if (!this.outController && this.model && this.model.out) {
            let x = this.x;
            let y = this.y;
            if (this.model.out) {
                x = this.model.outX;
                y = this.model.outY;
                let p = m.multiplyWithVertexDatas(x, y);
                x = p[0], y = p[1];
            }
            this.outController = new VertexController(this.model, true, {
                x: x, y: y,
                width: this.width, height: this.height
            });
            this.outController.master = this.master;
            this.outController.relate = this;
            this.parent.addChild(this.outController);
        }
    }

    drawSelf(ctx) {

        let x = 0;
        let y = 0;
        if (this.inController && this.inController.isVisible) {
            let x1 = this.inController.x - this.x;
            let y1 = this.inController.y - this.y;
            ctx.drawLine(x, y, x1, y1, this._linePaint);
        }

        if (this.outController && this.outController.isVisible) {
            let x2 = this.outController.x - this.x;
            let y2 = this.outController.y - this.y;
            ctx.drawLine(x, y, x2, y2, this._linePaint);
        }
        this.br = 255, this.bb = 255, this.bg = 255;
        if (this._isfocus) {
            this.r = 255, this.g = 0, this.b = 0;
        } else {
            this.r = 0, this.g = 0, this.b = 0;
        }
        super.drawSelf(ctx);
    }


    dispose() {
        this.master = null;
        if (this.model) this.model.dispose();
        if (this._linePaint) {
            this.getTarget()._linePaint.delete();
        }
        if (this.inController) {
            this.inController.parent.removeChild(this.inController);
            this.inController.dispose();
            this.inController = null;
        }
        if (this.outController) {
            this.outController.parent.removeChild(this.outController);
            this.outController.dispose();
            this.outController = null;
        }
        super.dispose();
    }

    update(x, y) {
        this.x = x;
        this.y = y;
        let m = this.master.worldMatrix.clone().invert();
        let p = m.multiplyWithVertexDatas(x, y);
        this.model.x = p[0];
        this.model.y = p[1];
    }

    calculateLocalBounds(b = { left, top, right, bottom }) {
        let bounds = super.calculateLocalBounds(b);
        bounds.left -= this.width;
        bounds.top -= this.height;
        bounds.right += this.width;
        bounds.bottom += this.height;
        return bounds
    }
}