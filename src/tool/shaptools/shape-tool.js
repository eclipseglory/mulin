import Utils from "../../utils.js";
import Tool from "../tool.js"

export default class ShapeTool extends Tool {
    constructor(f, m, b, id) {
        super(f, m, b, id);
    }

    get defaultCursor() {
        return Utils.CURSOR.add;
    }

    prepare() { this.fireSelectionChangeEvent([], 'new'); }

    createShape(x, y) {
    }

    toolActived(x, y) {
        this.fireSelectionChangeEvent([], 'new');
        this._newShape = this.createShape(x, y);
        if (!this._newShape) return;
        this._newShape.alpha = 0.8;
        this.frontRoot.addChild(this._newShape);
    }

    updateShapeBounds(shape, l, t, r, b, event) {
        let w = r - l;
        let h = b - t;
        if (event.shiftKey) {
            // 等比例图形:
            let a = Math.max(w, h);
            w = a;
            h = a;
        }
        if (event.altKey) {
            shape.width = w * 2;
            shape.height = h * 2;
            shape.x = this.sx;
            shape.y = this.sy;
        } else {
            shape.width = w;
            shape.height = h;
            shape.x = l + w / 2;
            shape.y = t + h / 2
        }
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
        if (!this._newShape) return;
        this.updateShapeBounds(this._newShape, l, t, r, b, event);
        this.frontRoot.refresh();
        return `Create ${this._newShape.name} [x:${l},y:${t},w:${r - l},h:${b - t}]`;
    }

    toolDeactived(x, y) {
        if (!this._newShape || !this.mainRoot) return;
        let m = this._newShape.worldMatrix.clone();
        this.frontRoot.removeChild(this._newShape);
        this._newShape.alpha = 1;
        this.frontRoot.refresh();
        if (this._newShape.width == 0 || this._newShape.height == 0) {
            this._newShape.dispose();
            this._newShape = null;
            return;
        }
        let mm = this.mainRoot.worldMatrix.clone().invert();
        let pose = mm.multiply(m).decompose();
        this._newShape.x = pose.translation.x;
        this._newShape.y = pose.translation.y;
        this._newShape.width = this._newShape.width * pose.scale.x;
        this._newShape.height = this._newShape.height * pose.scale.y;
        // this.addNewFigure(this._newShape, this.figureName);
        return { figure: this._newShape, name: this.figureName };
    }

    get figureName() {
        return 'Shape';
    }

    reset() {
        this._newShape = null;
        super.reset();
    }
}