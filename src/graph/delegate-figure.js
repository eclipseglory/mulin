import Drawable from "./drawable.js";
import Matrix3 from "./math/matrix3.js";

/**
 * @deprecated
 * 
 * 这个将不再使用，太难处理了
 */
export default class DelegateFigure extends Drawable {
    constructor(figure, props = {}) {
        super(props);
        this._figure;
        this.figure = figure;
        this.fillStyle = props.fillStyle;
        this.strokeStyle = props.strokeStyle;
        this._delegateMatrix = new Matrix3();
    }

    get figure() { return this._figure }
    set figure(f) {
        if (f != this._figure) {
            this._figure = f;
            this.initPose();
        }
    }

    canDraw() {
        return this.figure != null
    }

    initPose() {
        let figure = this.figure;
        if (figure) {
            this.x = figure.x;
            this.y = figure.y;
            this.scaleY = figure.scaleY;
            this.scaleX = figure.scaleX;
            this.rotation = figure.rotation;
        } else {
            this.identityPose();
        }
    }

    /**
     * 初始化所有变换状态
     */
    identityPose() {
        this.x = 0; this.y = 0;
        this.scaleY = 1; this.scaleX = 1;
        this.rotation = 0;
    }

    getTransformMatrix() {
        if (this.scaleX == 0 || this.scaleY == 0) {
            return null;
        }
        let matrix = this._matrix;
        if (this.isTransformDirty()) {
            if (this.figure)
                matrix = this.figure.calculateTransformableMatrix(this, this._matrix);
            else
                matrix = this.calculateTransformableMatrix(this, this._matrix);
            this.saveTransform(); //计算完后设置为false避免下次计算
        }
        return matrix;
    }

    getWorldTransformMatrix() {
        return super.getWorldTransformMatrix();
        // if (this.scaleX == 0 || this.scaleY == 0) {
        //     // this.saveWorldTransform();
        //     return null;
        // }
        // if (this.isWorldTransformDirty()) {
        //     if (this.parent) {
        //         let matrix = this.getTransformMatrix();
        //         if (matrix == null) {
        //             // this.saveWorldTransform();
        //             return null;
        //         }
        //         let pw = this.parent.getWorldTransformMatrix();
        //         if (pw == null) {
        //             // this.saveWorldTransform();
        //             return null;
        //         }
        //         if (pw.isIdentity() || !(this.parent instanceof DelegateFigure)) {
        //             this._worldMatrix.from(matrix);
        //         } else {
        //             this._worldMatrix.from(pw);
        //             if (!matrix.isIdentity()) {
        //                 this._worldMatrix.simpleMultiply(matrix);
        //             }
        //         }
        //     } else {
        //         this._worldMatrix.from(this.getTransformMatrix());
        //     }
        //     this.saveWorldTransform();
        // }
        // return this._worldMatrix;
    }

    getParentTransformMatrix() {
        // let parent = this.parent;
        // if (parent && parent instanceof DelegateFigure) {
        //     let m = parent.get
        // }
    }

    applyCurrentTransform(ctx) {
        return super.applyCurrentTransform(ctx);
        // let matrix = this.getWorldTransformMatrix();
        // if (matrix == null) return false;
        // if (this.figure) {
        //     let parent = this.figure.parent;
        //     let out = this.figure.calculateTransformableMatrix(this);
        //     // let out = this.figure.calculateTransformableMatrix(this.figure);
        //     if (parent) {
        //         let wm = parent.getWorldTransformMatrix().clone();
        //         wm.simpleMultiply(out);
        //         out = wm;
        //     }
        //     matrix = matrix.clone();
        //     matrix.simpleMultiply(out);
        //     let data = matrix.data;
        //     ctx.setTransform(data[0], data[3], data[1], data[4], data[2], data[5]);
        // }
        // return true;
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