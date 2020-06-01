import Color from "./color.js";
import utils from "./utils.js";

export default class GradientColor {
    constructor(values = []) {
        this._colorStops;
        this._gradient;
        this.values = values;
    }

    get colorStopValuesOffset() { return 4; }
    get coordOffset() { return 0; }

    _createGradient(ctx) {

    }

    getGradient(ctx) {
        if (this._gradient == null) {
            this._gradient = this._createGradient(ctx);
            this._colorStops.forEach(stop => {
                this._gradient.addColorStop(stop[0], stop[1].color);
            });
        }
        return this._gradient;
    }

    addColorStop(offset, color) {
        if (this._colorStops == null) {
            this._colorStops = [];
        }
        this._colorStops.push([offset, color]);
        this._gradient = null;
    }

    setColorStop(index, offset, color) {
        let m = this._colorStops[index];
        if (m) {
            m[0] = offset;
            m[1] = color;
            this._gradient = null;
        }
    }


    set start(v) {
        if (v instanceof Array) {
            let offset = this.coordOffset;
            if (this._values[offset] != v[0] || this._values[offset + 1] != v[1]) {
                this._values[offset] = v[0];
                this._values[offset + 1] = v[1];
                this._gradient = null;
            }
        }
    }

    // get start() { return [this._values[0], this._values[1]]; }

    set end(v) {
        if (v instanceof Array) {
            let offset = this.coordOffset;
            if (this._values[offset + 2] != v[0] || this._values[offset + 3] != v[1]) {
                this._values[offset + 2] = v[0];
                this._values[offset + 3] = v[1];
                this._gradient = null;
            }
        }
    }

    // get end() { return this._end; }

    set values(array) {
        if (array instanceof Array) {
            let stopOffset = this.colorStopValuesOffset;
            if ((array.length - stopOffset) % 5 == 0) {
                if (this._values == null) {
                    this._values = array;
                }
                let values = this._values;
                let coordOffset = this.coordOffset;
                if (array[coordOffset] != values[coordOffset] || array[coordOffset + 1] != values[1 + coordOffset]
                    || array[coordOffset + 2] != values[2 + coordOffset] || array[coordOffset + 3] != values[3 + coordOffset]) {
                    for (let i = 0; i < 4; i++) values[i + coordOffset] = array[i + coordOffset];
                    this._gradient = null;
                }
                let stopLength = Math.floor((array.length - stopOffset) / 5);
                for (let i = 0; i < stopLength; i++) {
                    let index = i * 5 + stopOffset;
                    if (this._colorStops == null) {
                        this._colorStops = new Array(stopLength);
                    }
                    let stop = this._colorStops[i];
                    if (!stop) {
                        this._colorStops[i] = new Array(2);
                        this._colorStops[i][0] = array[index + 4];
                        this._colorStops[i][1] = new Color(utils.converColorArray([array[index], array[index + 1],
                        array[index + 2], array[index + 3]]));
                        continue;
                    }
                    let offset = stop[0];
                    let color = stop[1];
                    let r = array[index];
                    if (color.setColor(array, index, true)) {
                        this._gradient = null;
                    }
                    if (array[index + 4] != offset) {
                        stop[0] = offset;
                        this._gradient = null;
                    }
                }

            } else {
                console.warn('gradient颜色的array数据结构不正确');
            }
        }
    }

    get values() {
        return this._values;
    }
}