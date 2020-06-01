import GradientColor from "./gradient-color.js";

export default class RadicalGradientColor extends GradientColor {
    constructor(props = {}) {
        super(props);
    }

    get colorStopValuesOffset() { return 5; }
    get coordOffset() { return 1; }

    _createGradient(ctx) {
        let dx = this.values[1] - this.values[3];
        let dy = this.values[2] - this.values[4];
        let radialGradient = ctx.createRadialGradient(this.values[1], this.values[2], 0, this.values[1], this.values[2], Math.sqrt(dx * dx + dy * dy));
        return radialGradient;
    }
}