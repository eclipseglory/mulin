import Drawable from "./drawable.js";

export default class Group extends Drawable {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
        super(props);
    }

    /**
     * Group不一样，它没有大小，但它可以包含多个其他figure，所以这里在坐标定位的时候要改一下方法
     * @param {*} x 
     * @param {*} y 
     */
    containsPoint(x, y, matrix) {
        if (x == null || y == null) return false;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let c = this._children[i];
            if (c.containsPoint(x, y, matrix)) {
                return true;
            }
        }
        return false;
    }
}