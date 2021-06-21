import CanvasKitUtils from "../canvaskit-utils";

const __me = Symbol();
export default class Gradient {
    constructor() {
        // HACK : 如果被Proxy截获，可以用这个方法获得自己
        this.getTarget = () => {
            if (!this[__me]) this[__me] = this;
            return this[__me];
        };
        this.getTarget();
        this._colorStops = [];
    }

    get colorStops() {
        return this._colorStops;
    }

    deleteShader() {
        if (this._shader) {
            this.getTarget()._shader.delete();
        }
        this._shader = null;
    }

    createShader(kit) { }

    getShader() {
        if (CanvasKitUtils.CanvasKit) {
            if (!this._shader) {
                this._shader = this.createShader(CanvasKitUtils.CanvasKit);
            }
            return this._shader;
        }
    }

    replaceColorStops(stops) {
        this._colorStops.splice(0, this._colorStops.length, ...stops);
        this.deleteShader();
    }

    addColorStop(color) {
        this._colorStops.push(color);
        this.deleteShader();
    }

    removeColorStopAt(index) {
        if (index < 0 || index > this._colorStops.length - 1) return;
        this._colorStops.splice(index, 1);
        this.deleteShader();
    }

    removeColorStop(color) {
        let index = this._colorStops.indexOf(color);
        this.removeColorStopAt(index);
    }

    insertColorStopAt(color, index) {
        if (index < 0 || index > this._colorStops.length - 1) return;
        this._colorStops.splice(index, 0, color);
        this.deleteShader();
    }

    sort() {
        this._colorStops.sort((a, b) => {
            return a.pos - b.pos;
        })
    }

    createColorArray() {
        let colors = [];
        this._colorStops.forEach(c => {
            colors.push([c.color[0] / 255, c.color[1] / 255, c.color[2] / 255, c.color[3]]);
        })
        return colors;
    }

    createPosArray() {
        return this._colorStops.map(item => item.pos);
    }

    dispose() {
        this._colorStops.length = 0;
        this._colorStops = null;;
        this.deleteShader();
    }

    clone() {
        let c = new Gradient();
        this.colorStops.forEach(stop => {
            c.addColorStop(stop.clone())
        })
        return c;
    }
}