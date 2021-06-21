import PoseChangeTool from "./pose-change-tool.js";
import { Utils, math } from 'figures';

const PI_1_4 = Math.PI / 4;

export default class RotateTool extends PoseChangeTool {
    constructor(f, m, b) {
        super(f, m, b, 'rotate');
        this.sr;
        this.anchor = { x: 0.5, y: 0.5 };
    }

    prepare(args) {
        super.prepare(args);
        this.anchor = args != null && args.anchor != null ? args.anchor : this.anchor;
    }

    active(x, y) {
        super.active(x, y);
        if (!this.transformFeedback) return;
        let figure = this.transformFeedback;
        let m = figure.worldMatrix.clone();
        this.cx = this.w = this.anchor.x * figure.width;
        this.cy = this.h = this.anchor.y * figure.height;
        let p = m.multiplyWithVertexDatas(this.cx, this.cy);
        this.cx = p[0]; this.cy = p[1];
        this.sr = Math.atan2(y - this.cy, x - this.cx);
        this.startRotation = this.transformFeedback.rotation;
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
        super.activeMove(x, y, l, t, r, b, dx, dy);
        if (!this.transformFeedback) return;
        let feedback = this.transformFeedback;
        let cr = Math.atan2(y - this.cy, x - this.cx);
        let delta = cr - this.sr;

        if (event.altKey) {
            // TODO:按住alt，旋转角度以45度为单位旋转：
            // let c = Math.floor(delta / PI_1_4);
            // if (c == 0) c = 1;
            // let sign = 1;
            // if (c < 0) sign = -1;
            // delta = PI_1_4 * c;
            // delta *= sign;
        }

        let pose = new math.Matrix3().translate(this.cx, this.cy)
            .rotate(delta + this.startRotation)
            .translate(-this.w, -this.h).decompose();
        Utils.applyPose(feedback, pose);
        // 这里由于计算误差，所以设置一下。变换框是不会拉伸和倾斜的
        feedback.scalex = feedback.scaley = 1;
        feedback.skewx = feedback.skewy = 0;
        this.frontRoot.refresh();
    }

    get isIllegalData() {
        if (!this.transformFeedback) return;
        return this.transformFeedback.rotation - this.startRotation == 0
    }

    reset() {
        super.reset();
        this.startRotation = null;
        this.sr = null;
        this.cx = this.cy = null;
    }
}