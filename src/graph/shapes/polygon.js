import PolygonPath from "./polygon-path";
import SinglePathShape from "./single-path-shape";

export default class Polygon extends SinglePathShape {
    constructor(params = {}) {
        super(params);
    }

    createSinglePath(props) {
        return new PolygonPath(props);
    }


    get sides() {
        return this._singlePath.sides;
    }

    set sides(s) { this._singlePath.sides = s; }

    canDraw() {
        return this.sides > 2 && super.canDraw();
    }

    getVertices() {
        return this._singlePath.getVertices();
    }
}