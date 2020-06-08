import RectanglePath from "./rectangle-path.js";
import SinglePathShape from "./single-path-shape.js";


export default class Rectangle extends SinglePathShape {
    constructor(params = {}) {
        super(params);
        let radius = params['radius'] == null ? 0 : params['radius'];
        this._rectanglePath = new RectanglePath({
            radius: radius,
            width: this.width,
            height: this.height
        })
        this.addPath(this._rectanglePath);
    }

    set startX(x) {
        this._rectanglePath.startX = x;
    }

    set startY(y) {
        this._rectanglePath.startY = y;
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