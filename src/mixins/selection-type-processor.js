import { Group, ImageFigure, Point, Text } from "figures";
import { Line, PathShape, Polygon, Rect, Shape, Star } from "figures/shape";

export default {
    computed: {
        isSingleSelection() {
            return this.selections && this.selections.length == 1;
        },

        currentSelection() {
            if (this.selections) {
                return this.selections[0];
            }
        },

        hasSelection() {
            if (!this.selections || this.selections.length == 0) return false;
            return true;
        },

        hasBorderOrFillProperty() {
            if (this.hasSelection) {
                for (let index = 0; index < this.selections.length; index++) {
                    const selection = this.selections[index];
                    if (selection instanceof Point || selection instanceof ImageFigure) return false;

                }
                return true
            }
            return false;
        },

        isLine() {
            if (!this.isSingleSelection) return false;
            let s = this.currentSelection;
            if (s instanceof Line) {
                return true;
            }
            return false;
        },

        isImage() {
            if (!this.isSingleSelection) return false;
            let s = this.currentSelection;
            if (s instanceof ImageFigure) {
                return true;
            }
            return false;
        },

        isText() {
            if (!this.isSingleSelection) return false;
            let s = this.currentSelection;
            if (s instanceof Text) {
                return true;
            }
            return false;
        },

        isShape() {
            if (!this.isSingleSelection) return false;
            let s = this.currentSelection;
            if (s instanceof Shape) {
                return true;
            }
            return false;
        },
        isGroup() {
            if (!this.isSingleSelection) return false;
            let s = this.currentSelection;
            if (s instanceof Group) {
                return true;
            }
            return false;
        },
        isVertex() {
            if (this.isSingleSelection) {
                return this.currentSelection instanceof Point;
            }
            return false;
        },
        isRect() {
            if (this.isSingleSelection) {
                let m = this.currentSelection;
                return m instanceof Rect;
            }
            return false;
        },

        isStar() {
            if (this.isSingleSelection) {
                let m = this.currentSelection;
                return m instanceof Star;
            }
            return false;
        },

        isPolygon() {
            if (this.isSingleSelection) {
                let m = this.currentSelection;
                return m instanceof Polygon;
            }
            return false;
        },

        isPath() {
            if (this.isSingleSelection) {
                let m = this.currentSelection;
                if (m instanceof PathShape) {
                    if (this.isStar || this.isPolygon) return false;
                    return true;
                }
            }
            return false;
        },
    },
}