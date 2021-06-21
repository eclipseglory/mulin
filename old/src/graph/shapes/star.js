import SinglePathShape from "./single-path-shape";
import StarPath from "./star-path";

export default class Star extends SinglePathShape {
    constructor(props = {}) {
        super(props)
    }

    createSinglePath(props) {
        return new StarPath(props);
    }

    get innerRadius() { return this._singlePath.innerRadius; }
    set innerRadius(r) {
        this._singlePath.innerRadius = r;
    }

    get starPoints() { return this._singlePath.starPoints; }
    set starPoints(r) {
        this._singlePath.starPoints = r;
    }
}