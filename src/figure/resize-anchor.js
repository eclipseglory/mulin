import { shape } from "figures";

export default class ResizeAnchor extends shape.CenterRect {
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