import SinglePathShape from "./single-path-shape";
import TrianglePath from "./triangle-path";

export default class Triangle extends SinglePathShape {
    constructor(props = {}) {
        super(props);
    }

    createSinglePath(props) {
        return new TrianglePath(props);
    }
}