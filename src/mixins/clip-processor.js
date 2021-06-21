import CompositeAction from "../actions/compsite-action.js";
import ActionFactory from "../actions/action-factory";
import { Shape } from "figures/shape";
export default {
    computed: {
        canClip() {
            return this.clipMask != null && this.actionStack != null && this.document != null;
        },
        canUnClip() {
            if (this.selections && this.actionStack != null && this.document != null) {
                //只要选中图形里有剪切蒙版，就可以反操作
                for (let i = 0; i < this.selections.length; i++) {
                    const selection = this.selections[i];
                    if (selection.clip && selection.children.length > 0) return true;
                }
            }
            return false;
        },
        clipMask() {
            if (!this.isEmptySelections && this.selections.length > 1) {
                let index = -1;
                let mask;
                for (let i = 0; i < this.selections.length; i++) {
                    const selection = this.selections[i];
                    let sp = selection.parent;
                    if (sp) {
                        let si = sp.indexOfChild(selection);
                        if (si > index) {
                            index = si;
                            mask = selection;
                        }
                    }
                }
                if (mask instanceof Shape) return mask;
            }
        },
    },

    methods: {
        clip() {
            let mask = this.clipMask;
            let figures = [];
            this.selections.forEach((s) => {
                if (mask != s) figures.push(s);
            });
            let m = mask.worldMatrix.invert();
            let actions = new CompositeAction();
            figures.forEach((f) => {
                let ca = new CompositeAction();
                let mf = f.worldMatrix;
                let fm = m.clone().multiply(mf);
                let ta = ActionFactory.newPoseChangeAction([
                    { figure: f, pose: fm.decompose() },
                ]);
                ca.add(ta);
                let ra = ActionFactory.newRemoveFigureAction(f, f.parent);
                ca.add(ra);
                let aa = ActionFactory.newAddFigureAction(f, mask);
                ca.add(aa);

                actions.add(ca);
            });
            if (!mask.clip) {
                actions.add(ActionFactory.newChangePropertyAction(mask, "clip", true));
            }
            if (mask.showBorder != 0) {
                actions.add(
                    ActionFactory.newChangePropertyAction(mask, "showBorder", 0)
                );
            }
            if (mask.fill != 0) {
                actions.add(ActionFactory.newChangePropertyAction(mask, "fill", 0));
            }

            this.excuteAction(actions);
        },
        // TODO #11 取消剪切蒙版后，剪切主体在图层下，应该在图层顶部
        unClip() {
            let masks = [];
            this.selections.forEach((selection) => {
                if (selection.clip && selection.children.length >= 1) {
                    masks.push(selection);
                }
            });
            let action = new CompositeAction();
            masks.forEach((mask) => {
                let figures = mask.children;
                let mca = new CompositeAction();
                figures.forEach((figure) => {
                    let m = figure.worldMatrix;
                    let pm = this.document.worldMatrix.clone().invert();
                    let pose = pm.multiply(m).decompose();
                    let ca = new CompositeAction();

                    ca.add(ActionFactory.newRemoveFigureAction(figure, mask));
                    ca.add(ActionFactory.newAddFigureAction(figure, this.document));
                    ca.add(ActionFactory.newPoseChangeAction([{ figure, pose }]));

                    mca.add(ca);
                });

                if (mask.clip) {
                    mca.add(ActionFactory.newChangePropertyAction(mask, "clip", false));
                }
                if (mask.showBorder == 0) {
                    mca.add(
                        ActionFactory.newChangePropertyAction(mask, "showBorder", 1)
                    );
                }
                if (mask.fill == 0) {
                    mca.add(ActionFactory.newChangePropertyAction(mask, "fill", 1));
                }
                action.add(mca);
            });
            this.excuteAction(action);
        },
    },

}