import ScaleTool from './scale-tool.js';

export default class WResizeTool extends ScaleTool {
    constructor(f, n, b) {
        super(f, n, b, 'w-resize');
    }

    getTransformAnchor(feedback) {
        return { x: feedback.width, y: feedback.height }
    }

    processDx(dx) { return -dx }
    processDy(dy) { return 0 };

    get isIllegalData() {
        return this.ex - this.sx == 0;
    }
}