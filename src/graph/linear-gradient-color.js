import GradientColor from "./gradient-color.js";

export default class LinearGradientColor extends GradientColor {
    constructor(props = {}) {
        super(props);
    }

    _createGradient(ctx) {
        return ctx.createLinearGradient(this.values[0], this.values[1], this.values[2], this.values[3]);
    }
}