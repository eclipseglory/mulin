import Matrix3 from "./math/matrix3.js";
import utils from "./utils.js";
import Transformable from "./transformable.js";


/**
 * 绘制基类，定义了一些图形的基本属性，例如左上角坐标以及图形大小
 * 在绘制的时候采用迭代绘制子节点的方式
 */
export default class Figure extends Transformable {

    constructor(params = { anchorX: 0.5, anchorY: 0.5 }) {
        super(params);
        this.name = params.name;
        this.id = params.id;
        this.blendMode = params.blendMode || 'source-over';
        this.opacity = params['opacity'] == null ? 1 : params['opacity'];
        this._hidden = params['hidden'] == null ? false : params['hidden'];
        this._clip = params['clip'] == null ? false : params['clip'];

        this._children = [];
        this._contentDirty = true;
        this._parent;
    }

    get contentDirty() { return this._contentDirty; }

    get clip() { return this._clip; }
    set clip(c) { this._clip = c; };


    static get DRP() { return utils.DRP; };

    set hidden(v) {
        this._hidden = v;
    }

    get hidden() {
        return this._hidden;
    }

    get width() {
        return super.width;
    }

    set width(v) {
        if (this.width != v) {
            super.width = v;
            this.fireContentDirty()
        }
    }

    get height() {
        return super.height;
    }

    set height(v) {
        if (this.height != v) {
            super.height = v;
            this.fireContentDirty()
        }
    }

    get left() {
        return this.x;
    }
    /**
     * Figure位于父节点的左上角y值
     */
    get top() {
        return this.y;
    }
    /**
     * Figure位于父节点的右上角x值
     */
    get right() {
        return this.x + this.width;
    }
    /**
     * Figure位于父节点的右下角y值
     */
    get bottom() {
        return this.y + this.height;
    }

    get children() { return this._children };

    /**
     * 设置节点的的中心位置位于某个节点的中心 
     * 如果相对Figure参数为空，将会找到Figure的父节点
     */
    centerMe(relativeFigure) {
        if (relativeFigure == null) relativeFigure = this._parent;
        if (relativeFigure != null) {
            this.x = Math.floor((relativeFigure.width - this.width) / 2);
            this.y = Math.floor((relativeFigure.height - this.height) / 2);
        }
    }

    /**
     * 添加一个绘制子节点。如果子节点已经添加到某节点下，该方法会抛出异常
     * @param {Figure} child 
     */
    addChild(child) {
        if (child._parent != null) {
            throw new Error('子节点不能同时挂在多个父节点下,请先将该子节点从原父节点移除后再添加');
        }
        this._children.push(child);
        child._parent = this;
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
            c[0]._parent = null;
        }
    }

    /**
     * 绘制Figure自身,需要继承类复写。
     * 所有Figure绘制都是从{0,0}点开始的，切勿使用自身的x和y，否则绘制结果会出问题
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} width Figure绘制区域宽度
     * @param {Number} height Figure绘制区域高度
     */
    _drawSelf(context, width, height) {
    }

    /**
     * 绘制Figure的子节点
     * @param {CanvasRenderingContext2D} context 
     */
    _drawChildren(context) {
        this._children.forEach(child => child.draw(context));
    }

    /**
     * Figure是否可以绘制
     */
    canDraw() {
        return this.width != 0 && this.height != 0 && this.opacity != 0
            && !this.hidden;
    }

    /**
     * 绘制整个Figure
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        if (!this.canDraw()) return;
        context.save();
        this._applyCurrentTransform(context);
        this._applyCurrentDrawingStates(context);
        this._drawSelf(context, this.width, this.height);
        this._drawChildren(context);
        context.restore();
    }

    /**
     * 设置当前Figure的绘制状态，例如透明度、填充色等
     */
    _applyCurrentDrawingStates(context) {
        context.globalAlpha = this.opacity;
        context.globalCompositeOperation = this.blendMode;
    }

    /**
     * 应用当前Figure的矩阵变换。
     * @param {CanvasRenderingContext2D} context 
     */
    _applyCurrentTransform(context) {
        let matrix = this.getTransformMatrix();
        let data = matrix.data;
        // 这里注意，CanvasRenderingContext2D的参数（a,b,c,d,e,f）的transform数据对应矩阵和我自己的只有6个数的3x3矩阵：
        // a,c,e    a0 a1 a2
        // b,d,f => a3 a4 a5
        // 0,0,1    0  0  1
        // 所以我要给的参数是：(a0,a3,a1,a4,a2,a5)
        context.transform(data[0], data[3], data[1], data[4], data[2], data[5]);
    }

    /**
     * 获取该子节点的最顶层节点
     */
    getRoot() {
        let p = this;
        while (p._parent != null) {
            p = p._parent;
        }
        return p;
    }

    fireContentDirty() {
        this._contentDirty = true;
    }

    saveContentDirty() {
        this._contentDirty = false;
    }

    /**
     * 坐标x和y是否在Figure的区域内。
     * 
     * x,y的值是一个相对于Canvas的值，对于任何Figure来说都是绝对的。
     * Figure自身仅判断是否在{left,top,right,bottom}区域内，特殊的图形需要自己实现这一方法。
     * 
     * 如果x，y在Figure区域内，返回Figure对象。没有则返回Null。
     * 如果Figure有子节点，则需要判断x，y是否在子节点内，并且返回子节点对象。
     * @param {Number} x 
     * @param {Number} y 
     * @param {Matrix3} parentMatrix
     */
    pointInMe(x, y, parentMatrix) {
        if (x == null || y == null) return null;
        //计算当前Figure的WorkdMatrix：
        let myMatrix = this._calculateTransformMatrix();
        let worldMatrix = Matrix3.IdentityMatrix();
        if (parentMatrix != null) {
            Matrix3.copyFrom(parentMatrix, worldMatrix);
            worldMatrix.multiply(myMatrix);
        } else {
            Matrix3.copyFrom(myMatrix, worldMatrix);
        }
        //计算变换后的四个顶点 (顺时针)
        let vertex = this.getVertex();
        for (let i = 0; i < vertex.length; i++) {
            worldMatrix.multiplyWithVertex(vertex[i], vertex[i]);
        }

        let isInside = utils.isPointInPolygon(x, y, vertex);
        if (!isInside) return null;

        let figure = this;
        for (let i = this._children.length - 1; i >= 0; i--) {
            let c = this._children[i];
            let cf = c.pointInMe(x, y, worldMatrix);
            if (cf != null) {
                figure = cf;
                break; // 因为靠前的figure就一个，在后面的figure不再计算判断
            }
        }

        return figure;
    }
    /**
     * 获得原Figure的顶点数组。默认是返回Figure绘制区域的四个顶点。
     * @returns {Array} 正常Figure的顶点，必须按照顺时针顺序组成数组放回
     */
    getVertex() {
        return [[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]];
    }

} 