import Drawable from "./drawable.js";


/**
 * 绘制基类，定义了一些图形的基本属性，例如左上角坐标以及图形大小
 * 在绘制的时候采用迭代绘制子节点的方式
 */
export default class Figure extends Drawable {

    constructor(params = { anchorX: 0.5, anchorY: 0.5 }) {
        super(params);
        this._vertices = null;
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
} 