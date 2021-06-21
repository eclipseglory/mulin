import { shape } from "figures";

export default class RotateAnchor extends shape.CenterEllipse {
    constructor(props) {
        super(props);
    }
    calculateLocalBounds(b = { left, right, top, bottom }) {
        let r = super.calculateLocalBounds(b);
        r.left -= this.width;
        r.top -= this.height;
        r.right += this.width;
        r.bottom += this.height;
        return r;
    }
}