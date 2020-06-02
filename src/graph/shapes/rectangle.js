import Shape from "./shape.js";
import RectanglePath from "./rectangle-path.js";


export default class Rectangle extends Shape {
    constructor(params) {
        params = params || {};
        super(params);
        let radius = params['radius'] == null ? 0 : params['radius'];
        this._rectanglePath = new RectanglePath({
            anchorX: 0.5, anchorY: 0.5,
            radius: radius,
            width: this.width,
            height: this.height
        })
        this.addPath(this._rectanglePath);
    }

    get width() {
        return super.width;
    }

    set width(w) {
        super.width = w;
        this._rectanglePath.width = w;
    }

    get height() {
        return super.height;
    }

    set height(w) {
        super.height = w;
        this._rectanglePath.height = w;
    }

    get radius() {
        return this._rectanglePath.radius;
    }

    set radius(v) {
        if (this._rectanglePath.radius != v) {
            this._rectanglePath.radius = v;
        }
    }

    canDraw() {
        return super.canDraw() && this.width != 0 && this.height != 0;
    }
}