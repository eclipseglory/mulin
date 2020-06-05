import Matrix3 from "./math/matrix3.js";

const PI_DIV_180 = Math.PI / 180;

export default class Transformable {
    constructor(props = {}) {
        this._x = props.x;
        if (this._x == null) this._x = 0;

        this._y = props.y;
        if (this._y == null) this._y = 0;

        this._scaleX = props.scaleX;
        if (this._scaleX == null) this._scaleX = 1;

        this._scaleY = props.scaleY;
        if (this._scaleY == null) this._scaleY = 1;

        this._anchorX = props.anchorX;
        if (this._anchorX == null) this._anchorX = 0;

        this._anchorY = props.anchorY;
        if (this._anchorY == null) this._anchorY = 0;

        this._rotation = props.rotation;
        if (this._rotation == null) this._rotation = 0;

        this._width = props.width;
        if (this._width == null) this._width = 0;

        this._height = props.height;
        if (this._height == null) this._height = 0;

        this._matrix = new Matrix3();

        this._worldMatrix = new Matrix3();

        this._parent;

        this._children = [];

        this._worldTransformDirty = true;

        this._transformDirty = true;

        /// 单独把alpha拿出来放到transformable里，因为alpah也是继承关系。不要在意这些细节
        this._opacity = props.opacity;
        if (this._opacity == null) this._opacity = 1;
        this._opacityChange = true;
    }

    //// 属性 //////////

    get opacity() {
        if (this._opacityChange) {
            if (this._parent) {
                this._opacity *= this._parent.opacity;
            }
            this._opacityChange = false;
        }
        return this._opacity;
    }

    set opacity(v) {
        if (this._opacity != v) {
            this._children.forEach(child => {
                child._opacityChange = true;
            });
            this._opacity = v;
        }
    }

    get children() {
        return this._children;
    }

    get parent() { return this._parent; }
    set parent(p) { this._parent = p; }

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


    /// 方法 ///////////

    isWorldTransformDirty() {
        return this._worldTransformDirty;
    }

    isTransformDirty() {
        return this._transformDirty;
    }

    fireTransformDirty() {
        this._transformDirty = true;
        this.fireWorldTransformDirty();
    }
    saveTransform() { this._transformDirty = false; }

    fireWorldTransformDirty() {
        this._worldTransformDirty = true;
        this._children.forEach(child => {
            child.fireWorldTransformDirty();
        });
    }

    saveWorldTransform() {
        this._worldTransformDirty = false;
    }

    forEachChild(process) {
        this._children.forEach(child => {
            process(child);
        })
    }

    cleanChildren() {
        this._children.forEach(child => {
            child.parent = null;
            child.fireWorldTransformDirty();
        });
        this._children.length = 0;
    }

    /**
     * 添加一个绘制子节点。如果子节点已经添加到某节点下，该方法会抛出异常
     * @param {Figure} child 
     */
    addChild(child) {
        if (child.parent != null) {
            throw new Error('子节点不能同时挂在多个父节点下,请先将该子节点从原父节点移除后再添加');
        }
        this._children.push(child);
        child.parent = this;
        child.fireWorldTransformDirty();
    }

    /**
     * 删除一个子节点
     * @param {Figure} child 
     */
    removeChild(child) {
        this.removeChildAt(this._children.indexOf(child));
    }

    /**
     * 删除对应位置的子节点
     * @param {Number} index 
     */
    removeChildAt(index) {
        if (index < 0 || index > this._children.length - 1) return;
        let c = this._children.splice(index, 1);
        if (c != null && c.length == 1) {
            c[0].parent = null;
            c[0].fireWorldTransformDirty();
        }
    }

    /**
     * 计算当前Figure的矩阵变换。这个方法的调用会和_transformDirty有关，如果_transformDirty为true则会计算变换矩阵，反之不计算.
     * _transformDirty的设置会在Figure的一些属性中更改，保证没有发生过变换坚决不计算
     */
    getTransformMatrix() {
        if (this.scaleX == 0 || this.scaleY == 0) {
            // this.saveTransform();
            return null;
        }
        let matrix = this._matrix;
        if (this.isTransformDirty()) {
            matrix.identity();
            matrix = matrix.translate(this.x, this.y);
            let tx = this.anchorX * this.width;
            let ty = this.anchorY * this.height;
            if (this.rotation !== 0) {
                matrix.translate(tx, ty).rotate(this.rotation).translate(-tx, -ty);
            }

            if (this.scaleX !== 1 || this.scaleY !== 1) {
                matrix.scale(this.scaleX, this.scaleY).translate(tx / this.scaleX - tx, ty / this.scaleY - ty);
            }
            this.saveTransform(); //计算完后设置为false避免下次计算
        }
        return matrix;
    }

    /**
     * 为了避免利用context进行不必要的矩阵相乘，这里保存并计算figure相对于canvas的matrix
     * 这个world transform matrix将会应用到绘制中,舍弃context的transform方法的矩阵连乘
     */
    getWorldTransformMatrix() {
        // 这里避免计算出现NaN，返回一个null，告诉其他子figure，不用显示
        if (this.scaleX == 0 || this.scaleY == 0) {
            // this.saveWorldTransform();
            return null;
        }
        if (this.isWorldTransformDirty()) {
            if (this.parent) {
                let matrix = this.getTransformMatrix();
                if (matrix == null) {
                    // this.saveWorldTransform();
                    return null;
                }
                let pw = this.parent.getWorldTransformMatrix();
                if (pw == null) {
                    // this.saveWorldTransform();
                    return null;
                }
                if (pw.isIdentity()) {
                    this._worldMatrix.from(matrix);
                } else {
                    this._worldMatrix.from(pw);
                    if (!matrix.isIdentity()) {
                        this._worldMatrix.multiply(matrix);
                    }
                }
            } else {
                this._worldMatrix.from(this.getTransformMatrix());
            }
            this.saveWorldTransform();
        }
        return this._worldMatrix;
    }
}