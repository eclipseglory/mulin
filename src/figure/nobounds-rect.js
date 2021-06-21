import { shape } from "figures";

export default class NoboundsRect extends shape.Rect {
    constructor(props) {
        super(props);
    }

    containsPoint(x, y, flag) {
        return false;
    }
}