import Drawable from "./drawable.js";

export default class Group extends Drawable {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
        super(props);
    }

    containsPoint(ctx, x, y, matrix) {
        if (x == null || y == null) return false;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let c = this._children[i];
            if (c.containsPoint(ctx, x, y, matrix)) {
                return true;
            }
        }
        return false;
    }

    getDrawable(ctx, x, y, matrix) {
        if (x == null || y == null) return null;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let c = this._children[i];
            if (c.containsPoint(ctx, x, y, matrix)) {
                return c.getDrawable(ctx, x, y, matrix);
            }
        }
        return null;
    }
}