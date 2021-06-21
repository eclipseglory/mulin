import Vertex from "./vertex.js";
import { shape } from 'figures'

export default class VerticesPathFeedback extends shape.PathShape {
    constructor(props) {
        super(props);
        this.vertexSize = props == null || props.vertexSize == null ? 7 : props.vertexSize;
        this.vertexFigures = [];// 它们的关系不是父子
    }

    deletePathModel() {
        super.deletePathModel();
        this.vertexFigures.forEach(v => {
            let p = v.parent;
            if (p) p.removeChild(v);
            v.dispose();
        });
        this.vertexFigures.length = 0;
    }

    applyWorkingVisible() {
        this.hideAllVertex();
        this.visible = true;
        this.a = 0.2;
        let v = this.getLastPreVertexFigure();
        if (v) {
            v.visible = true;
            v.showController(false, true);
        }
        let v2 = this.getLastVertexFigure();
        if (v2) {
            v2.visible = true;
            v2.showController(true, true);
        }
    }

    applyRestingVisible() {
        this.showAllVertex()
        this.hideAllVertexController();
        this.visible = true;
        this.a = 0;
    }

    indexOfVertex(figure) {
        for (let i = 0; i < this.vertexFigures.length; i++) {
            const element = this.vertexFigures[i];
            if (figure == element) return i;
        }
        return -1;
    }

    hideAllVertex() {
        this.vertexFigures.forEach(v => v.visible = false);
    }


    showAllVertex() {
        this.vertexFigures.forEach(v => v.visible = true);
    }

    hideAllVertexController() {
        this.vertexFigures.forEach(v => {
            v.hideController(true, true);
        });
    }

    getVertexFigure(index) {
        return this.vertexFigures[index];
    }

    getFirstVertexFigure() {
        return this.vertexFigures[0];
    }

    getLastVertexFigure() {
        return this.vertexFigures[this.vertexFigures.length - 1];
    }

    getLastPreVertexFigure() {
        return this.vertexFigures[this.vertexFigures.length - 2];
    }

    getVertexFigureCount() { return this.vertexFigures.length }

    addVertexFigure(point) {
        if (this.parent && point) {
            let vertex = new Vertex(point, {
                width: this.vertexSize, height: this.vertexSize,
                r: 0, g: 0, b: 0
            });
            vertex.master = this;
            let w = this.worldMatrix;
            let p = w.multiplyWithVertexDatas(point.x, point.y);
            vertex.x = p[0], vertex.y = p[1];

            this.parent.addChild(vertex);
            this.vertexFigures.push(vertex);
            vertex.initControllerPoints();
            return vertex;
        }
    }

    removeVertexFigure(point) {
        if (this.parent) {
            for (let i = 0; i < this.vertexFigures.length; i++) {
                const figure = this.vertexFigures[i];
                if (figure.model.equals(point)) {
                    this.vertexFigures.splice(i, 1);
                    this.parent.removeChild(figure);
                    figure.dispose();
                    return figure;
                }
            }
        }
    }

    addPoint(point) {
        super.addPoint(point);
        return this.addVertexFigure(point);
    }

    insertPoint(point, index) {
        super.insertPoint(point, index);
        return this.addVertexFigure(point);
    }

    deletePoint(point) {
        super.deletePoint(point);
        return this.removeVertexFigure(point);
    }

    deleteAt(index) {
        let point = super.deleteAt(index);
        return this.removeVertexFigure(point);
    }
}