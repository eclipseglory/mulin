import AddFigureAction from "./add-figure-action.js";
import TranslateAction from "./translate-action.js";
import CompositeAction from "./compsite-action.js"
import PoseChangeAction from "./pose-change-action.js";
import InsertPointAction from "./insert-point-action.js";
import ChangePropertyAction from "./change-property-action.js";
import DeletePointAction from "./delete-point-action.js";
import RemoveFigureAction from "./remove-figure-action.js";
import ChangeIndexAction from "./change-index-action.js";
import UpdateLinearGradientColorStopsAction from "./update-linear-gradient-color-stops-action.js";
import UpdateRadialGradientColorStopsAction from "./update-radial-gradient-color-stops-action.js";

export default class ActionFactory {

    static newUpdateLinearGraidentStopsAction(model, stops, pk = 'linearGradient') {
        return new UpdateLinearGradientColorStopsAction(model, stops, pk);
    }

    static newUpdateRadialGraidentStopsAction(model, stops, pk = 'radicalGradient') {
        return new UpdateRadialGradientColorStopsAction(model, stops, pk);
    }

    static newChangeIndexAction(figure, newIndex) {
        return new ChangeIndexAction(figure, newIndex);
    }

    static newRemoveFigureAction(figure, parent) {
        return new RemoveFigureAction(figure, parent);
    }

    static newChangePropertyAction(model, property, value) {
        return new ChangePropertyAction(model, property, value);
    }

    static newInsertPointAction(point, path, index) {
        return new InsertPointAction(point, path, index);
    }

    static newDeletePointAction(path, index) {
        return new DeletePointAction(path, index);
    }

    static newAddFigureAction(child, parent, name = '添加图形') {
        return new AddFigureAction(child, parent, name);
    }

    static newTranslateAction(figures, dx, dy) {
        let action = new CompositeAction();
        figures.forEach(f => {
            action.add(new TranslateAction(f, dx, dy));
        });
        return action;
    }

    static newPoseChangeAction(events) {
        let action = new CompositeAction();
        events.forEach(e => {
            action.add(new PoseChangeAction(e.figure, e.pose));
        })
        return action;
    }
}