import { Matrix3 } from "figures/math";
import PoseChangeTool from "./pose-change-tool.js";

export default class ScaleTool extends PoseChangeTool {
    constructor(f, m, b, id) {
        super(f, m, b, id);
    }

    get isIllegalData() {
        return this.ex - this.sx == 0 && this.ey - this.ex == 0;
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
        super.activeMove(x, y, l, t, r, b, dx, dy);
        if (!this.transformFeedback) return;
        let m = this.transformFeedback.worldMatrix.clone().invert();
        let p1 = m.multiplyWithVertexDatas(this.lx, this.ly);
        let p2 = m.multiplyWithVertexDatas(x, y);
        dx = p2[0] - p1[0], dy = p2[1] - p1[1];
        dx = this.processDx(dx);
        dy = this.processDy(dy);
        if (event.shiftKey) {
            let d = Math.max(dx, dy);
            if (dx < 0 || dy < 0) {
                d = Math.min(dx, dy);
            }
            dx = dy = d;
        }
        let feedback = this.transformFeedback;
        let tp = this.getTransformAnchor(feedback);
        let w = feedback.width + dx;
        let h = feedback.height + dy;
        if (event.altKey) {
            w += dx, h += dy;
            tp.x = feedback.width / 2;
            tp.y = feedback.height / 2;
        }
        let sx = w / feedback.width;
        let sy = h / feedback.height;
        let m1 = new Matrix3();
        let hw = tp.x;
        let hy = tp.y;
        m1.translate(feedback.x, feedback.y).rotate(feedback.rotation)
            .scale(sx, sy)
            .translate(hw / sx - hw, hy / sy - hy);// tx / scaleX - tx, ty / scaleY - ty
        let newPose = m1.decompose();
        feedback.x = newPose.translation.x;
        feedback.y = newPose.translation.y;
        feedback.height = h;
        feedback.width = w;
        this.frontRoot.refresh();
    }

    processDx(dx) {
        return dx;
    }

    processDy(dy) {
        return dy;
    }

    getTransformAnchor(feedback) {
        return { x: 0, y: 0 };
    }
}