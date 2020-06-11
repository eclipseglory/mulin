import Drawable from "./drawable.js";
import Matrix3 from "./math/matrix3.js";

export default class DelegateFigure extends Drawable {
    constructor(figure, props = {}) {
        super(props);
        this.figure = figure;
        this.fillStyle = props.fillStyle;
        this.strokeStyle = props.strokeStyle;
        this._delegateMatrix = new Matrix3();
    }

    /**
     * 初始化所有变换状态
     */
    identityPose() {
        this.x = 0; this.y = 0;
        this.scaleY = 1; this.scaleX = 1;
        this.rotation = 0;
    }

    applyCurrentTransform(ctx) {
        let matrix = this.getWorldTransformMatrix();
        if (matrix == null) return false;

        let figureMatrix = this.figure.getWorldTransformMatrix();
        this._delegateMatrix.from(matrix);
        this._delegateMatrix.simpleMultiply(figureMatrix);

        let data = this._delegateMatrix.data;
        ctx.setTransform(data[0], data[3], data[1], data[4], data[2], data[5]);
        return true;
    }

    clip() { return true; }

    drawSelf(ctx, w, h) {
        let path = this.figure.getSelfPath(ctx, w, h);
        if (this.fillStyle) {
            this.fillStyle.paint(ctx, path);
        }
        if (this.strokeStyle) {
            this.strokeStyle.paint(ctx, path);
        }
    }

    // drawChildren(ctx) { }
}