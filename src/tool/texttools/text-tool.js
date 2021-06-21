import { Text } from "figures";
import Tool from "../tool.js";

export default class TextTool extends Tool {
    constructor(f, m, b, id = 'text') {
        super(f, m, b, id);
    }

    prepare(args) {
        super.prepare(args)
        this.fireSelectionChangeEvent([])
    }

    toolActived(x, y, event) {
        super.toolActived(x, y, event);
        this.deleteHoverFigure();
        this.frontRoot.refresh();
        this.activing = true;
        this.edit = false;
        this.create = false;
        this.editingFigure = null;
        let figure = this.mainRoot.findFigure(x, y);
        figure = figure == this.mainRoot ? null : figure;
        if (figure) {
            if (figure instanceof Text) {
                this.edit = true;
                this.editingFigure = figure;
                let p = figure.worldMatrix.multiplyWithVertexDatas(0, 0);
                this.frontRoot.worldMatrix.clone().invert().multiplyWithVertexDatas(p[0], p[1], p);
                // this.fireEvent('showTextInput', {
                //     x: p[0], y: p[1], size: figure.size * Math.max(figure.scaley, figure.scalex),
                //     value: figure.text, width: figure.width * figure.scalex,
                //     height: figure.height * figure.scaley
                // });

                this.fireEvent('showTextInput', {
                    x: p[0], y: p[1],
                    value: figure.text
                });
                return;
            }
        }
        this.create = true;
        this.fireEvent('showTextInput', { x, y: y - 10, size: 10, value: '' });
    }

    // toolDeactived(x, y, event) {
    //     let value = event.value;
    //     if (value) {
    //         let m = this.mainRoot.worldMatrix.clone().invert();
    //         console.log(x, y);
    //         let p = m.multiplyWithVertexDatas(x, y + 10);
    //         return { figure: this.createNewText(value, p[0], p[1]), name: "Text" }
    //     }
    // }

    updateHoverFigure(figure) {
        if (!figure) {
            this.deleteHoverFigure();
        } else {
            if (!this._lastHoverDelegate) {
                this._lastHoverDelegate = Tool.createDelegateFigure(figure);
                this.frontRoot.addChild(this._lastHoverDelegate);
            } else {
                if (this._lastHoverDelegate.relatedSelection.id != figure.id) {
                    this.deleteHoverFigure();
                    this._lastHoverDelegate = Tool.createDelegateFigure(figure);
                    this.frontRoot.addChild(this._lastHoverDelegate);
                }
            }
        }
    }

    deleteHoverFigure() {
        if (this._lastHoverDelegate) {
            this._lastHoverDelegate.dispose();
            this.frontRoot.removeChild(this._lastHoverDelegate);
            this._lastHoverDelegate.parent = null;
            this._lastHoverDelegate.relatedSelection = null;
            this._lastHoverDelegate = null;
        }
    }

    hoverMove(x, y, event) {
        let figure = this.mainRoot.findFigure(x, y);
        figure = figure == this.mainRoot ? null : figure;
        if (figure) {
            if (figure instanceof Text) {
                this.updateHoverFigure(figure);
                this.frontRoot.refresh();
                return `Text [x:${figure.x.toFixed(0)},y:${figure.y.toFixed(0)}]`;
            }
        } else {
            if (this._lastHoverDelegate) {
                this.deleteHoverFigure();
                this.frontRoot.refresh();
            }
        }
    }

    createNewText(text, x, y) {
        let m = this.mainRoot.worldMatrix.clone().invert();
        let p = m.multiplyWithVertexDatas(x, y);
        return new Text({ x: p[0], y: p[1], text, size: 10, name: 'Text' })
    }

    reset() {
        this.deleteHoverFigure();
        this.frontRoot.refresh();
        super.reset();
    }

    unUse() {
        this.deleteHoverFigure();
        this.frontRoot.refresh();
        if (this.activing) {
            this.fireEvent('hideTextInput');
            this.activing = false;
        }
        super.unUse();
    }

}