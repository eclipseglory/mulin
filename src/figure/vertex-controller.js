import { shape } from "figures";

export default class VertexController extends shape.CenterEllipse {
    constructor(model, isOut = false, props) {
        super(props);
        this.model = model;
        this.isOut = isOut
        this.r = 122;
        this.g = 255;
        this.b = 0;
        this.master;
        this._isfocus = false;
    }

    focus() {
        this._isfocus = true;
    }

    blur() {
        this._isfocus = false;
    }


    dispose() {
        this.master = null;
        this.relate = null;
        super.dispose();
    }

    update(x, y) {
        this.x = x;
        this.y = y;
        let m = this.master.worldMatrix.clone().invert();
        let p = m.multiplyWithVertexDatas(x, y);
        if (this.isOut) {
            this.model.outX = p[0];
            this.model.outY = p[1];
        } else {
            this.model.inX = p[0];
            this.model.inY = p[1];
        }
    }

    calculateLocalBounds(b = { left, top, right, bottom }) {
        let bounds = super.calculateLocalBounds(b);
        bounds.left -= this.width;
        bounds.top -= this.height;
        bounds.right += this.width;
        bounds.bottom += this.height;
        return bounds
    }

    drawSelf(ctx) {
        if (this._isfocus) {
            this.r = 255, this.g = 0, this.b = 0;
        } else {
            this.r = 122;
            this.g = 255;
            this.b = 0;
        }
        super.drawSelf(ctx);
    }
}