import RectanglePath from "./rectangle-path.js";
import SinglePathShape from "./single-path-shape.js";


export default class Rectangle extends SinglePathShape {
    constructor(params = {}) {
        super(params);
    }

    createSinglePath(props) {
        return new RectanglePath(props);
    }

    set startX(x) {
        this._singlePath.startX = x;
    }

    set startY(y) {
        this._singlePath.startY = y;
    }

    get radius() {
        return this._singlePath.radius;
    }

    set radius(v) {
        if (this._singlePath.radius != v) {
            this._singlePath.radius = v;
        }
    }

    canDraw() {
        return super.canDraw() && this.width != 0 && this.height != 0;
    }
}