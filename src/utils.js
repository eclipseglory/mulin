const CURSOR = {
    default: 'default',
    select: 'default',
    move: "move",
    add: "crosshair",
    'e-resize': "e-resize",
    's-resize': "s-resize",
    'w-resize': "w-resize",
    'n-resize': "n-resize",
    'se-resize': "se-resize",
    'ne-resize': "ne-resize",
    'sw-resize': "sw-resize",
    'nw-resize': "nw-resize",
    rotate: 'url(assets/images/cursor-rotate.png), auto',
    'vertex-select': 'url()',
    'move-root': 'grab'
};
import { shape, Group, Point, Text } from "figures"

export default class Utils {
    static calculateFiguresBounds(figures, useWorldMatrix = true) {
        if (!figures || figures.length == 0) return { left: 0, top: 0, right: 0, bottom: 0 };
        let tb = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
        figures.forEach(figure => {
            if (useWorldMatrix) {
                let wb = figure.worldBounds;
                tb.left = Math.min(wb.left, tb.left);
                tb.right = Math.max(wb.right, tb.right);
                tb.top = Math.min(wb.top, tb.top);
                tb.bottom = Math.max(wb.bottom, tb.bottom);
            } else {
                tb.left = Math.min(figure.x, tb.left);
                tb.right = Math.max(figure.x + figure.width, tb.right);
                tb.top = Math.min(figure.y, tb.top);
                tb.bottom = Math.max(figure.y + figure.height, tb.bottom);
            }
        })
        return tb;
    }

    static objectIcon(obj) {
        if (!obj) return;
        if (obj instanceof shape.Rect) return "icon-square";
        if (obj instanceof shape.Ellipse) return "icon-circle";
        if (obj instanceof shape.Star) return "icon-star";
        if (obj instanceof shape.Polygon) return "icon-polygon";
        if (obj instanceof shape.PathShape) return "icon-path-shape";
        if (obj instanceof Group) return "icon-group";
        if (obj instanceof shape.Line) return "icon-line";
        if (obj instanceof Text) return "icon-text";
        if (obj instanceof Point) return 'icon-vertices';
    }

    static CURSOR = CURSOR;
}