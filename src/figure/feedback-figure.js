import { CanvasKitUtils } from 'figures';
import { Shape } from 'figures/shape';

export default class FeedbackFigure extends Shape {
    constructor(props) {
        super(props);
        this.relatedSelection;
        this.relateFigure;
    }

    fireShapeDirty() { }

    copyPath(target) {
        if (this._path) this.getTarget()._path.delete();
        if (target.getPath) {
            this.getTarget()._path = target.getTarget().getPath().copy();
        } else {
            this.getTarget()._path = CanvasKitUtils.newPath();
            let bounds = target.bounds;
            this.getTarget()._path.addRect(CanvasKitUtils.newXYWHRect(bounds.left, bounds.top,
                bounds.right - bounds.left, bounds.bottom - bounds.top));
        }

    }

    isVisible() {
        return this.visible && (this.scalex != 0 || this.scaley != 0);
    }
}