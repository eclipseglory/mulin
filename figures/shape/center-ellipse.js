import CanvasKitUtils from "../canvaskit-utils.js";
import Ellipse from "./ellipse.js";

export default class CenterEllipse extends Ellipse {
    constructor(props) {
        super(props);
    }

    drawPath(path) {
        let rect = CanvasKitUtils.newXYWHRect(-this.width / 2, -this.height / 2,
            this.width, this.height);
        path.addOval(rect);
    }

    calculateLocalBounds(out = { left: 0, top: 0, right: 0, bottom: 0 }) {
        out.left = -this.width / 2;
        out.top = -this.height / 2;
        out.right = this.width / 2;
        out.bottom = this.height / 2;
        return out;
    }

    createMySelf() {
        return new CenterEllipse({ radiusx: this.radiusx, radiusy: this.radiusy });
    }

    getJsonObjectName(){return 'center-ellipse'}

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.cx = obj.x, obj.cy = obj.y;
        delete obj.x, delete obj.y;
        return obj;
    }

    getSVGLabelName() { return 'ellipse' }

    getSVGPositionString() { return `cx="0" cy="0"` }

    getSVGDimensionString() {
        return `rx="${this.width / 2}" ry="${this.height / 2}"`
    }
}