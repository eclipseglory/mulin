import Shape from "./shape";
import PolygonPath from "./polygon-path";

export default class Polygon extends Shape {
    constructor(params = {}) {
        super(params);
        this._polygonPath = new PolygonPath(params);
    }

    set width(w) { this._polygonPath.width = w; }
    get width() { return this._polygonPath.width; }

    set height(w) { this._polygonPath.height = w; }
    get height() { return this._polygonPath.height; }

    get sides() {
        return this._polygonPath.sides;
    }

    set sides(s) { this._polygonPath.sides = s; }

    get close() { return true; }


    canDraw() {
        return this.sides > 2 && super.canDraw();
    }

    getVertices() {
        return this._polygonPath.getVertices();
    }
}