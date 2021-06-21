import EventEmitter from "./event-emitter.js";
import Matrix3 from "./math/matrix3.js";
import Utils from "./utils.js";

const PI2 = Math.PI * 2;
const HALF_PI = Math.PI / 2;

export default class Transformable extends EventEmitter {
    constructor(props = {
        x: 0, y: 0, width: 0, height: 0, scalex: 1,
        scaley: 1, rotation: 0
    }) {
        super();
        // HACK : 如果被Proxy截获，可以用这个方法获得自己
        this.getTarget = () => {
            if (!this.__target) this.__target = this;
            return this.__target;
        };
        this.getTarget();
        this.x = props == null || props.x == null ? 0 : props.x;
        this.y = props == null || props.y == null ? 0 : props.y;
        this.width = props == null || props.width == null ? 0 : props.width;
        this.height = props == null || props.height == null ? 0 : props.height;
        this.scalex = props == null || props.scalex == null ? 1 : props.scalex;
        this.scaley = props == null || props.scaley == null ? 1 : props.scaley;
        this.skewx = props == null || props.skewx == null ? 0 : props.skewx;
        this.skewy = props == null || props.skewy == null ? 0 : props.skewy;
        this.rotation = props == null || props.rotation == null ? 0 : props.rotation;
        this._matrix = new Matrix3();
        this._transformDirty = true;
        this._boundsdirty = true;
        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };
        this._axis;
        this.parent;
        this._disposed = false;
    }

    static get PI2() {
        return PI2
    }

    static get HALF_PI() {
        return HALF_PI
    }

    get isDisposed() { return this._disposed; }

    get width() { return this._width; }

    set width(v) {
        if (this._width != v) {
            this._width = v;
            this.fireTransformDirty();
            this.fireBoundsDirty();
        }
    }

    get height() { return this._height; }

    set height(v) {
        if (this._height != v) {
            this._height = v;
            this.fireTransformDirty();
            this.fireBoundsDirty();
        }
    }

    get scalex() {
        return this._scalex;
    }

    set scalex(v) {
        if (this._scalex != v) {
            this._scalex = v;
            this.fireTransformDirty();
        }
    }

    get scaley() {
        return this._scaley;
    }

    set scaley(v) {
        if (this._scaley != v) {
            this._scaley = v;
            this.fireTransformDirty();
        }
    }

    get skewx() {
        return this._skewx;
    }

    set skewx(v) {
        if (this._skewx != v) {
            this._skewx = v;
            this.fireTransformDirty();
        }
    }

    get skewy() {
        return this._skewy;
    }

    set skewy(v) {
        if (this._skewy != v) {
            this._skewy = v;
            this.fireTransformDirty();
        }
    }

    get worldVertices() {
        let vs = this.bounds;
        let localVertices = [[vs.left, vs.top], [vs.right, vs.top], [vs.right, vs.bottom], [vs.left, vs.bottom]];
        let worldMatrix = this.worldMatrix;
        //计算变换后的四个顶点 (顺时针)
        let wv = [];
        for (let i = 0; i < localVertices.length; i++) {
            wv.push(worldMatrix.multiplyWithVertex(localVertices[i]));
        }
        return wv;
    }

    // 这个轴只是x和y的，因为这里不会做很强的碰撞测试，只考虑图形的bounds而已
    get axis() {
        if (!this._axis) {
            this._axis = [[1, 0], [0, 1]];
        }
        return this._axis;
    }

    get worldAxis() {
        let matrix = this.worldMatrix.clone();
        let axis = this.axis;
        matrix.data[2] = 0;
        matrix.data[5] = 0;
        let r = []
        axis.forEach(a => {
            r.push(matrix.multiplyWithVertexDatas(a[0], a[1]));
        })
        return r;
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

    get matrix() {
        if (this._transformDirty) {
            Transformable.calculateTransformableMatrix(this.x, this.y, this.width, this.height
                , this.rotation, this.scalex, this.scaley, this.skewx, this.skewy, this._matrix);
            this._transformDirty = false;
        }
        return this._matrix;
    }


    /**
     * 不再对其进行储存，每次使用都进行计算获取
     */
    get worldMatrix() {
        if (this.parent) {
            let pm = this.parent.worldMatrix;
            return pm.clone().multiply(this.matrix);
        } else {
            return this.matrix;
        }
    }

    get bounds() {
        if (this._boundsdirty) {
            this._bounds = this.calculateLocalBounds(this._bounds);
            this._boundsdirty = false;
        }
        return this._bounds;
    }

    getRelateBounds(matrix) {
        if (!matrix) return this.bounds;
        let vs = this.bounds;
        let localVertices = [[vs.left, vs.top], [vs.right, vs.top], [vs.right, vs.bottom], [vs.left, vs.bottom]];
        let wvs = [];
        for (let i = 0; i < localVertices.length; i++) {
            wvs.push(matrix.multiplyWithVertex(localVertices[i]));
        }
        let wb = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
        wvs.forEach(wv => {
            wb.left = Math.min(wv[0], wb.left);
            wb.top = Math.min(wv[1], wb.top);
            wb.right = Math.max(wv[0], wb.right);
            wb.bottom = Math.max(wv[1], wb.bottom);
        })
        return wb;
    }

    calculateLocalBounds(out = { left, top, right, bottom }) {
        out.left = 0;
        out.top = 0;
        out.right = this.width;
        out.bottom = this.height;
        return out;
    }


    get worldBounds() {
        let wvs = this.worldVertices;
        let wb = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
        wvs.forEach(wv => {
            wb.left = Math.min(wv[0], wb.left);
            wb.top = Math.min(wv[1], wb.top);
            wb.right = Math.max(wv[0], wb.right);
            wb.bottom = Math.max(wv[1], wb.bottom);
        })
        return wb;
    }

    fireBoundsDirty() {
        this._boundsdirty = true;
        this.fireEvent('boundsDirty', true);
    }

    fireTransformDirty() {
        this._transformDirty = true;
        this.fireEvent('transformDirty', true);
    }

    /**
     * 判断某个点是否在figure的bounds范围内
     * @param {number} x xzuobiao
     * @param {number} y yzuobiao
     * @param {boolean} isWorldPoint shi bushi world zuo biao xi
     * @returns 
     */
    containsPoint(x, y, isWorldPoint = true) {
        let x1 = x;
        let y1 = y;
        if (isWorldPoint) {
            let m = this.worldMatrix.clone();
            let realPoint = m.invert().multiplyWithVertexDatas(x1, y1);
            x1 = realPoint[0]; y1 = realPoint[1];
        }
        return Utils.containsPoint(x1, y1, this.bounds)
    }

    dispose() {
        if (this.isDisposed) return
        this._disposed = true;
        this.__target = null;
        this.fireEvent('disposed');
        super.dispose();
    }

    clone() {
        if (this.isDisposed) return;
        let me = this.createMySelf();
        if (me) {
            me.x = this.x;
            me.y = this.y;
            me.width = this.width;
            me.height = this.height;
            me.scalex = this.scalex;
            me.scaley = this.scaley;
            me.skewx = this.skewx;
            me.skewy = this.skewy;
            me.rotation = this.rotation;
            return me;
        }
    }

    createMySelf() { }

    async toJsonObject() {
        return {
            type: this.getJsonObjectName(),
            x: this.x, y: this.y, width: this.width, height: this.height,
            rotation: this.rotation, scalex: this.scalex, scaley: this.scaley,
            skewx: this.skewx, skewy: this.skewy
        }
    }

    getJsonObjectName() {
        return 'transformable';
    }


    /**
     * 通过图形pose计算该图形当前的变换矩阵
     * @param {Number} x  默认0，图形左上角横坐标
     * @param {Number} y  默认0，图形左上角纵坐标
     * @param {Number} width  默认0，图形宽度
     * @param {Number} height  默认0，图形高度
     * @param {Number} rotation 默认0，图形旋转弧度
     * @param {Number} scaleX  默认1，图形的横向伸缩量
     * @param {Number} scaleY  默认1，图形的纵向伸缩量
     * @param {Number} skewx  默认0，图形的横向倾斜弧度
     * @param {Number} skewy  默认0，图形的纵向倾斜弧度
     * @param {Number} anchor 默认为{x:0.5,y:0.5}，图形的变换锚点, 0 <= x,y <= 1
     * @param {Matrix3} out 
     * @returns 
     */
    static calculateTransformableMatrix(x, y, width, height,
        rotation = 0, scaleX = 1, scaleY = 1, skewx = 0, skewy = 0, out = new Matrix3()) {
        if (scaleX == 0 || scaleY == 0) {
            return null;
        }
        let matrix = out.identity();
        matrix = matrix.translate(x, y);

        if (rotation !== 0) {
            matrix.rotate(rotation);
        }

        if (scaleX !== 1 || scaleY !== 1) {
            matrix.scale(scaleX, scaleY);//.translate(tx / scaleX - tx, ty / scaleY - ty);
        }

        if (skewx !== 0 || skewy !== 0) {
            matrix.skew(skewx, skewy);
        }
        return out;
    }

}