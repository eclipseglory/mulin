import { math } from 'figures';
import Tool from "../tool.js";

export default class PoseChangeTool extends Tool {
    constructor(f, m, b, id) {
        super(f, m, b, id);
    }

    prepare(args) {
        if (args) {
            this.currentFeedbacks = args.currentFeedbacks;
            this.transformFeedback = args.transformFeedback;
            this.currentFeedbacks.forEach(fb => {
                fb.a = 0.2, fb.ba = 0.8;
            })
        }
    }

    get isIllegalData() {
        return false;
    }

    processFinalResult(pose) { }

    toolDeactived(x, y) {
        super.toolDeactived(x, y);
        if (this.isIllegalData) return;
        let result = [];
        this.currentFeedbacks.forEach(feedback => {
            try {
                let applyFigure = feedback.relatedSelection;
                if (applyFigure == null) {
                    console.error('发生错误，没有找到feedbackfigure id对应的figure');
                    return;
                }
                let ipm2;
                if (applyFigure.parent) {
                    ipm2 = applyFigure.parent.worldMatrix.clone().invert();
                } else {
                    ipm2 = new math.Matrix3();
                }
                let fm = feedback.worldMatrix;
                ipm2.multiply(fm);
                let pose = ipm2.decompose();
                this.processFinalResult(pose);
                result.push({
                    figure: applyFigure, pose: pose
                });
            } catch (e) {
                console.error(e);
            }

        });

        return result;
    }
}