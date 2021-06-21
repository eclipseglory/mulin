import ActionFactory from "../actions/action-factory";
import CompositeAction from "../actions/compsite-action";

export default {
    computed: {
        canDistribute() {
            return this.actionStack && this.selections && this.selections.length > 2;
        }
    },

    methods: {
        distribute(property = 'left', isH = true) {
            let figures = this.selections.map(f => f);
            let composite = new CompositeAction();
            function getPropertyValue(property, isH, bounds) {
                if (property == 'center') {
                    if (isH) {
                        return bounds.left + (bounds.right - bounds.left) / 2;
                    } else {
                        return bounds.top + (bounds.bottom - bounds.top) / 2;
                    }
                } else {
                    return bounds[property];
                }
            }
            figures.sort((a, b) => {
                let wb1 = a.worldBounds;
                let wb2 = b.worldBounds;
                return getPropertyValue(property, isH, wb1) - getPropertyValue(property, isH, wb2);
            });
            let f1 = figures[0], f2 = figures[figures.length - 1];
            let wb1 = f1.worldBounds;
            let wb2 = f2.worldBounds;
            let cx1 = getPropertyValue(property, isH, wb1);
            let cx2 = getPropertyValue(property, isH, wb2);

            let width = cx2 - cx1;
            let delta = width / (figures.length - 1);
            let rcx = cx1 + delta;
            for (let i = 1; i < figures.length - 1; i++) {
                let f = figures[i];
                let wb1 = f.worldBounds;
                let cx1 = getPropertyValue(property, isH, wb1)
                let dx = rcx - cx1;
                if (isH)
                    composite.add(ActionFactory.newTranslateAction([f], dx / this.document.scalex, 0));
                else composite.add(ActionFactory.newTranslateAction([f], 0, dx / this.document.scaley));
                rcx += delta;
            }
            this.excuteAction(composite);
        }
    }
}