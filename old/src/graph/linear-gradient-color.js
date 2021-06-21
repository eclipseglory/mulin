import GradientColor from "./gradient-color.js";

export default class LinearGradientColor extends GradientColor {
    constructor(props = {}) {
        super(props);
    }

    get startX() { return this.values[0]; }
    set startX(x) {
        if (this.values[0] != x) {
            this._gradient = null;
            this.values[0] = x;
        }
    }

    get startY() { return this.values[1]; }
    set startY(y) {
        if (this.values[1] != y) {
            this._gradient = null;
            this.values[1] = y;
        }
    }

    get endX() { return this.values[2]; }
    set endX(x) {
        if (this.values[2] != x) {
            this._gradient = null;
            this.values[2] = x;
        }
    }

    get endY() { return this.values[3]; }
    set endY(y) {
        if (this.values[3] != y) {
            this._gradient = null;
            this.values[3] = y;
        }
    }

    _createGradient(ctx) {
        return ctx.createLinearGradient(this.values[0], this.values[1], this.values[2], this.values[3]);
    }
}