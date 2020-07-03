import SinglePathShape from "./single-path-shape";
import EllipsePath from "./ellipse-path";

export default class Ellipse extends SinglePathShape {
    constructor(props = {}) {
        super(props);
    }

    createSinglePath(props) {
        return new EllipsePath(props);
    }
}