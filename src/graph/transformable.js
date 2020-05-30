import Matrix3 from "./math/matrix3.js";

const PI_DIV_180 = Math.PI / 180;

export default class Transformable {
    constructor(props = { x: 0, y: 0, scaleX: 0, scaleY: 0, rotation: 0, anchorX: 0, anchorY: 0, width: 0, height: 0 }) {
        this._x = props.x;
        this._y = props.y;
        this._scaleX = props.scaleX;
        this._scaleY = props.scaleY;
        this._anchorX = props.anchorX;
        this._anchorY = props.anchorY;
        this._rotation = props.rotation;
        this._width = props.width;
        this._height = props.height;

        this._matrix = new Matrix3();

        this._transformDirty = true;
    }

    //// 属性 //////////

    get width() { return this._width; }

    set width(v) {
        if (this._width != v) {
            this._width = v;
            this.fireTransformDirty();
        }
    }

    get height() { return this._height; }

    set height(v) {
        if (this._height != v) {
            this._height = v;
            this.fireTransformDirty();
        }
    }

    get scaleX() {
        return this._scaleX;
    }

    set scaleX(v) {
        if (this._scaleX != v) {
            this._scaleX = v;
            this.fireTransformDirty();
        }
    }

    get scaleY() {
        return this._scaleY;
    }

    set scaleY(v) {
        if (this._scaleY != v) {
            this._scaleY = v;
            this.fireTransformDirty();
        }
    }


    /**
     * Figure基于变换锚点的旋转角度
     * @returns {Number} 角度值
     */
    get rotation() {
        return this._rotation;
    }

    set rotation(v) {
        if (this._rotation != v) {
            this._rotation = v;
            this.fireTransformDirty();
        }
    }

    /**
     * 变换锚点。
     * @returns {Map} {x,y} 分别是指该Figure的变换锚点将维护自身高度和宽比的百分比
     */
    get anchor() {
        return [this._anchorX, this._anchorY];
    }

    /**
     * 设置Figure的x方向变换锚点百分比
     */
    set anchorX(v) {
        if (this._anchorX != v) {
            this._anchorX = v;
            this.fireTransformDirty();
        }
    }

    get anchorX() { return this._anchorX; }

    /**
     * 设置Figure的y方向变换锚点百分比
     */
    set anchorY(v) {
        if (this._anchorY != v) {
            this._anchorY = v;
            this.fireTransformDirty();
        }
    }

    get anchorY() { return this._anchorY; }

    get x() {
        return this._x;
    }

    set x(v) {
        if (this._x != v) {
            this._x = v;
            this.fireTransformDirty();
        }
    }

    get y() {
        return this._y;
    }

    set y(v) {
        if (this._y != v) {
            this._y = v;
            this.fireTransformDirty();
        }
    }


    get transformDirty() { return this._transformDirty; }


    /// 方法 ///////////
    fireTransformDirty() { this._transformDirty = true; }
    saveTransform() { this._transformDirty = false; }

    /**
     * 计算当前Figure的矩阵变换。这个方法的调用会和_transformDirty有关，如果_transformDirty为true则会计算变换矩阵，反之不计算.
     * _transformDirty的设置会在Figure的一些属性中更改，保证没有发生过变换坚决不计算
     */
    getTransformMatrix() {
        let matrix = this._matrix;
        if (this.transformDirty) {
            matrix.identity();
            matrix = matrix.translate(this.x, this.y);
            let tx = this.anchorX * this.width;
            let ty = this.anchorY * this.height;
            if (this.rotation !== 0) {
                matrix.translate(tx, ty).rotate(this.rotation * PI_DIV_180).translate(-tx, -ty);
            }

            if (this.scaleX !== 1 || this.scaleY !== 1) {
                matrix.scale(this.scaleX, this.scaleY).translate(tx / this.scaleX - tx, ty / this.scaleY - ty);
            }
            this.saveTransform(); //计算完后设置为false避免下次计算
        }
        return matrix;
    }

}