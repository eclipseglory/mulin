import Matrix3 from "./math/matrix3.js";
import utils from "./utils.js";
import Drawable from "./drawable.js";


/**
 * 绘制基类，定义了一些图形的基本属性，例如左上角坐标以及图形大小
 * 在绘制的时候采用迭代绘制子节点的方式
 */
export default class Figure extends Drawable {

    constructor(params = { anchorX: 0.5, anchorY: 0.5 }) {
        super(params);
    }


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
     * Figure是否可以绘制
     */
    canDraw() {
        return this.width != 0 && this.height != 0 && super.canDraw();
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