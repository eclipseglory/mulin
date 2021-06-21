import ScaleTool from './scale-tool.js';

export default class EResizeTool extends ScaleTool {
    constructor(f, n, b) {
        super(f, n, b, 'e-resize');
    }

    get isIllegalData() {
        return this.ex - this.sx == 0;
    }

    processDy(dy) { return 0 }
}