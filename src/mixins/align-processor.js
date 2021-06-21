import ActionFactory from "../actions/action-factory";
import CompositeAction from "../actions/compsite-action";
import Utils from "../utils";

export default {
    computed: {
        canAlign() {
            return (this.actionStack && this.selections && this.selections.length > 1)
        }
    },

    methods: {
        alignCenter(h = true, actionName = "align") {
            let totalBounds = Utils.calculateFiguresBounds(this.selections);
            let cx = totalBounds.left + (totalBounds.right - totalBounds.left) / 2;
            let cy = totalBounds.top + (totalBounds.bottom - totalBounds.top) / 2;

            let composite = new CompositeAction(actionName);
            this.selections.forEach(selection => {
                let b = selection.worldBounds;
                let bcx = b.left + (b.right - b.left) / 2;
                let bcy = b.top + (b.bottom - b.top) / 2;
                let deltax = cx - bcx, deltay = cy - bcy;
                let action;
                if (h)
                    action = ActionFactory.newTranslateAction([selection], deltax / this.document.scalex, 0);
                else action = ActionFactory.newTranslateAction([selection], 0, deltay / this.document.scaley);
                composite.add(action);
            })
            this.excuteAction(composite);
        },
        alignLeft() {
            this.align('left', 'Align Left', true, true);
        },

        alignRight() {
            this.align('right', 'Align right', false, true);
        },

        alignTop() {
            this.align('top', 'Align top', true, false);
        },

        alignBottom() {
            this.align('bottom', 'Align bottom', false, false);
        },

        align(property, actionName = "align", min = true, hf = true) {
            let value = this.selections[0].worldBounds[property];
            let bounds = {};
            this.selections.forEach(selection => {
                let b = bounds[selection.id];
                if (b == null) {
                    bounds[selection.id] = selection.worldBounds;
                    b = bounds[selection.id];
                }
                if (min)
                    value = Math.min(value, b[property]);
                else value = Math.max(value, b[property]);
            });

            let composite = new CompositeAction(actionName);
            this.selections.forEach(selection => {
                let b = bounds[selection.id];
                let delta = value - b[property];
                let action;
                if (hf)
                    action = ActionFactory.newTranslateAction([selection], delta / this.document.scalex, 0);
                else action = ActionFactory.newTranslateAction([selection], 0, delta / this.document.scaley);
                composite.add(action);
            })
            for (let p in bounds) delete bounds[p];
            bounds = null;
            this.excuteAction(composite);
        }
    }
}