import CanvasKitUtils from "./canvaskit-utils.js";
import Figure from "./figure.js";

export default class RootFigure extends Figure {
    constructor(surface, props) {
        super(props);
        this.surface = surface;
        this._rAFid;
        this._figureMap = new Map();
    }

    isVisible() {
        return true;
    }

    recordAdd(child) {
        if (!child || !this._figureMap) return;
        this._figureMap.set(child.id, child);
    }

    recordRemove(child) {
        if (!child || !this._figureMap) return;
        this._figureMap.delete(child.id);
    }

    getFigureById(id) {
        if (!id || !this._figureMap) return;
        return this._figureMap.get(id);
    }

    // drawOnce() {
    //     this.surface.drawOnce((canvas) => {
    //         this.draw(canvas);
    //     })
    // }

    // drawrAF() {
    //     if (this._rAFid) {
    //         this.surface.cancelAnimationFrame(this._rAFid);
    //     }
    //     this._rAFid = this.surface.requestAnimationFrame((canvas) => {
    //         this.draw(canvas);
    //     })
    // }

    clear() {
        if (!this.surface) return;
        if (this._rAFid) {
            this.getTarget().surface.cancelAnimationFrame(this._rAFid);
        }
        this._rAFid = this.getTarget().surface.requestAnimationFrame((canvas) => {
            canvas.clear(CanvasKitUtils.TRANSPARENT);
        })
    }

    refresh(beforeDraw) {
        if (!this.surface) return;
        if (this._rAFid) {
            this.getTarget().surface.cancelAnimationFrame(this._rAFid);
        }
        this._rAFid = this.getTarget().surface.requestAnimationFrame((canvas) => {
            if (beforeDraw) beforeDraw();
            canvas.clear(CanvasKitUtils.TRANSPARENT);
            this.getTarget().draw(canvas);
        })
    }

    dispose() {
        if (this.isDisposed) return;
        this.surface = null;
        if (this._rAFid) cancelAnimationFrame(this._rAFid);
        this._rAFid = null;
        this._figureMap.clear();
        super.dispose();
    }

    getJsonObjectName() { return 'root' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        return obj;
    }

    getSVGPositionString() { }

    getSVGTransformString() { }

    getSVGAppendContents(defines) {
        if (defines && defines.length != 0) {
            let str = '';
            str += `<defs>\n`;
            defines.forEach(d => {
                str += `\n${d}`;
            })
            str += `\n</defs>`;
            return str;
        }
        return;
    }

    getSVGLabelName() {
        return 'svg';
    }

    getSVGExtensionString() {
        return `viewbox="0 0 ${this.width} ${this.height}" ${SVG_XMLNS_STR} style="background-color:gray"`;
    }
}

const SVG_XMLNS_STR = 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';