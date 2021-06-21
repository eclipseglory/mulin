import { Group } from "figures";
import { ActionFactory, CompositeAction } from "../actions";
import Utils from "../utils";

export default {
    computed: {
        canGroup() {
            if (!this.selections || !this.actionStack || !this.document) return false;
            return this.selections.length > 1;
        },
        canUnGroup() {
            if (!this.selections || !this.actionStack || !this.document) return false;
            if (this.selections.length == 0) return false;
            for (let i = 0; i < this.selections.length; i++) {
                const selection = this.selections[i];
                if (!(selection instanceof Group)) {
                    return false;
                }
            }
            return true;
        },
    },

    methods: {
        unGroupFigures() {
            let action = new CompositeAction();
            this.selections.forEach((group) => {
                if (!(group instanceof Group)) return;
                let ga = new CompositeAction();
                let fs = group.children;
                fs.forEach((figure) => {
                    let m = figure.worldMatrix;
                    // 默认是在mainroot的figure：
                    let pm = this.document.worldMatrix.clone().invert();
                    let pose = pm.multiply(m).decompose();
                    let fa = new CompositeAction();
                    // 先删除， 再加入到根 最后修改pose，
                    let ra = ActionFactory.newRemoveFigureAction(figure, group);
                    fa.add(ra);
                    let aa = ActionFactory.newAddFigureAction(figure, this.document);
                    fa.add(aa);
                    let pa = ActionFactory.newPoseChangeAction([
                        {
                            figure: figure,
                            pose: pose,
                        },
                    ]);
                    fa.add(pa);
                    ga.add(fa);
                });
                let ra = ActionFactory.newRemoveFigureAction(group, this.document);
                ga.add(ra);
                action.add(ga);
            });

            this.excuteAction(action);
        },

        groupFigures() {
            let group = new Group({ name: "Group" });

            let figures = this.selections.map((v) => v);
            let bounds = Utils.calculateFiguresBounds(figures);
            let m = this.document.worldMatrix.clone().invert();
            let p1 = m.multiplyWithVertexDatas(bounds.left, bounds.top);
            let p2 = m.multiplyWithVertexDatas(bounds.right, bounds.bottom);
            group.x = p1[0];
            group.y = p1[1];
            group.width = p2[0] - p1[0];
            group.height = p2[1] - p1[1];
            let action = new CompositeAction();
            let add = ActionFactory.newAddFigureAction(group, this.document);
            action.add(add);

            figures.forEach((figure) => {
                let ca = new CompositeAction();
                let ta = ActionFactory.newTranslateAction(
                    [figure],
                    -group.x,
                    -group.y
                );
                ca.add(ta);
                if (figure.parent) {
                    let ra = ActionFactory.newRemoveFigureAction(figure, figure.parent);
                    ca.add(ra);
                }
                // 这里注意，Vue的proxy加入作为节点，在真实绘制调用的时候就会出问题
                let aa = ActionFactory.newAddFigureAction(figure.getTarget(), group);
                ca.add(aa);
                action.add(ca);
            });
            this.excuteAction(action);
        },
    }
}