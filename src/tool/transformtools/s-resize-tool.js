import ScaleTool from './scale-tool.js';

export default class SResizeTool extends ScaleTool {
    constructor(f, n, b) {
        super(f, n, b, 's-resize');
    }

    get isIllegalData() {
        return this.ey - this.sy == 0;
    }

    getTransformAnchor(feedback) {
        return { x: feedback.width, y: 0 }
    }

    processDx() { return 0 }
}