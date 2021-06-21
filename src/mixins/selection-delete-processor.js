import { Figure, Point } from "figures";
import { VerticesShape } from "figures/shape";
import { ActionFactory, CompositeAction } from "../actions";

export default {
    computed: {
        canDelete() {
            if (this.actionStack && this.document) {
                return !this.isEmptySelections;
            }
            return false;
        }
    },

    methods: {
        deleteSelections() {
            if (this.isEmptySelections || !this.actionStack) return;
            let composite = new CompositeAction();

            this.selections.forEach((selection) => {
                if (selection instanceof Figure) {
                    let action = ActionFactory.newRemoveFigureAction(selection, selection.parent);
                    composite.add(action);
                }
                if (selection instanceof Point) {
                    let parent = selection.parent;
                    while (true) {
                        if (parent == null || parent instanceof VerticesShape) {
                            break;
                        }
                        parent = parent.parent;
                    }
                    if (parent) {
                        let index = parent.getPathModel().points.indexOf(selection);
                        if (index != -1) {
                            let action = new ActionFactory.newDeletePointAction(
                                parent,
                                index
                            );
                            composite.add(action);
                        }
                    }
                }
            });
            this.excuteAction(composite);
        },
    }
}