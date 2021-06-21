import Tool from "./tool.js";
import TransformFeedback from "../figure/transform-feedback.js";
import Utils from "../utils.js";
import { Utils as u, math } from "figures"

export default class TransformFeedbackTool extends Tool {
    constructor(f, m, b, id) {
        super(f, m, b, id);
        this.currentFeedbacks;
    }

    prepare(args) {
        super.prepare(args)
        if (args && args.transformFeedback) this._transformFeedback = args.transformFeedback;
        if (args && args.currentFeedbacks) this.currentFeedbacks = args.currentFeedbacks;
    }

    unUse(args) {
        if (this.updateFeedbackId) cancelAnimationFrame(this.updateFeedbackId);
        this.updateFeedbackId = null;
        if (!args || !args.keepFeedback) {
            if (this._transformFeedback) {
                this.frontRoot.removeChild(this._transformFeedback);
                this.transformFeedback.dispose();
                this._transformFeedback = null;
                this.frontRoot.refresh();
            }
        }
        super.unUse(args);
    }

    requestUpdateFeedbackFigures() {
        if (!this.using) return;
        let transfromFeedback = this.transformFeedback;
        if (this.updateFeedbackId) {
            cancelAnimationFrame(this.updateFeedbackId);
        }
        this.updateFeedbackId = requestAnimationFrame(() => {
            transfromFeedback.visible = false;
            transfromFeedback.rotation = 0;
            transfromFeedback.scalex = transfromFeedback.scaley = 1;
            transfromFeedback.skewx = transfromFeedback.skewy = 0;
            if (!this.currentFeedbacks) this.currentFeedbacks = [];

            this.currentFeedbacks.forEach(feedback => {
                if (feedback.parent) feedback.parent.removeChild(feedback);
                feedback.dispose();
                feedback.parent = null;
                feedback.relatedSelection = null;
            });
            this.currentFeedbacks.length = 0;

            this.currentSelections.forEach(selection => {
                while (selection.parent != this.mainRoot) {
                    selection = selection.parent;
                }
                let feedback = Tool.createDelegateFigure(selection, false);
                feedback.a = 0, feedback.ba = 0;
                this.transformFeedback.addFeedback(feedback);
                this.currentFeedbacks.push(feedback);
            })

            if (this.currentFeedbacks && this.currentFeedbacks.length != 0) {
                this.transformFeedback.visible = true;
                let sameRotation = true;
                let testRotation = this.currentSelections[0].rotation;
                for (let i = 1; i < this.currentSelections.length; i++) {
                    let selection = this.currentSelections[i];
                    while (selection.parent != this.mainRoot) {
                        selection = selection.parent;
                    }
                    // 计算有误差怎么办？
                    if (!TransformFeedbackTool.isSameRadian(testRotation, selection.rotation)) {
                        sameRotation = false;
                        break;
                    }
                }
                let transformBounds;
                if (sameRotation) {
                    // TODO ： 改进计算方法！
                    let vx = new math.Vector2(1, 0).rotate(testRotation);
                    let vy = new math.Vector2(0, 1).rotate(testRotation);
                    let projectx = [Infinity, -Infinity];
                    let projecty = [Infinity, -Infinity];
                    this.currentSelections.forEach(selection => {
                        while (selection.parent != this.mainRoot) {
                            selection = selection.parent;
                        }
                        let wvs = selection.worldVertices;
                        wvs.forEach(wv => {
                            let px = vx.dot(wv[0], wv[1]);
                            projectx[0] = Math.min(projectx[0], px);
                            projectx[1] = Math.max(projectx[1], px);

                            let py = vy.dot(wv[0], wv[1]);
                            projecty[0] = Math.min(projecty[0], py);
                            projecty[1] = Math.max(projecty[1], py);
                        });
                    });

                    let vx1 = vx.clone().scale(projectx[0]);
                    let vx2 = vx.clone().scale(projectx[1]);
                    let vy1 = vy.clone().scale(projecty[0]);
                    let vy2 = vy.clone().scale(projecty[1]);

                    let tpv = new math.Vector2(vx1.x - vy1.x, vx1.y - vy1.y);
                    let t = tpv.dot(vx.x, vx.y);
                    tpv.x = t * vx.x + vy1.x;
                    tpv.y = t * vx.y + vy1.y;

                    let rbv = new math.Vector2(vx2.x - vy2.x, vx2.y - vy2.y);
                    t = rbv.dot(vx.x, vx.y);
                    rbv.x = t * vx.x + vy2.x;
                    rbv.y = t * vx.y + vy2.y;

                    let dpv = new math.Vector2(rbv.x - tpv.x, rbv.y - tpv.y);
                    let w = vx.dot(dpv.x, dpv.y);
                    let h = vy.dot(dpv.x, dpv.y);
                    // let centerx = (rbv.x + tpv.x) / 2;
                    // let centery = (rbv.y + tpv.y) / 2;
                    this.transformFeedback.rotation = testRotation;
                    transformBounds = { left: tpv.x, top: tpv.y, right: tpv.x + w, bottom: tpv.y + h };

                } else {
                    transformBounds = Utils.calculateFiguresBounds(this.currentSelections);
                }

                this.transformFeedback.x = transformBounds.left;
                this.transformFeedback.y = transformBounds.top;
                this.transformFeedback.width = transformBounds.right - transformBounds.left;
                this.transformFeedback.height = transformBounds.bottom - transformBounds.top;
                this.transformFeedback.initFeedbackContainer();
                let tim = this.transformFeedback.worldMatrix.clone().invert();
                this.currentFeedbacks.forEach((feedback) => {
                    let fm = tim.clone().multiply(feedback.relatedSelection.worldMatrix);
                    let pose = fm.decompose();
                    u.applyPose(feedback, pose);
                });

            }
            this.feedbackFiguresUpdated();
            this.frontRoot.refresh();
            this.updateFeedbackId = null;
        });
    }

    feedbackFiguresUpdated() { }

    updateCurrentSelections(selections) {
        super.updateCurrentSelections(selections);
        this.requestUpdateFeedbackFigures();
    }

    get transformFeedback() {
        if (this._transformFeedback == null) {
            this._transformFeedback = new TransformFeedback();
            this.frontRoot.addChild(this._transformFeedback);
            // this.frontRoot.transformFeedback = this._transformFeedback;
        }
        return this._transformFeedback;
    }

    static isSameRadian(r1, r2) {
        return r1 == r2 || Math.abs(r1 - r2) <= EPSILON;
    }
}

const EPSILON = 0.00001