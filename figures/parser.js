import { DocumentRoot, Group, Point, RootFigure, Text } from ".";
import CanvasKitUtils from "./canvaskit-utils";
import { CenterEllipse, CenterPolygon, CenterRect, CenterStar, Ellipse, Line, PathShape, Polygon, Rect, Star } from "./shape";


async function loadFromJson(json) {
    if (json == null || json.type == null) return;
    let f = createFigureViaType(json);
    if (f) {
        if (json.showChildren != null) f.showChildren = json.showChildren;
        if (json.visible != null) f.visible = json.visible;
        if (json.clip != null) f.clip = json.clip;
        if (json.border) {
            f.br = json.border.r;
            f.bb = json.border.b;
            f.bg = json.border.g;
            f.ba = json.border.a;
            f.borderWidth = json.border.width;
            if (json.border.cap == CanvasKitUtils.StrokeCap.Butt.value) {
                f.cap = CanvasKitUtils.StrokeCap.Butt;
            }
            if (json.border.cap == CanvasKitUtils.StrokeCap.Round.value) {
                f.cap = CanvasKitUtils.StrokeCap.Round;
            }
            if (json.border.cap == CanvasKitUtils.StrokeCap.Square.value) {
                f.cap = CanvasKitUtils.StrokeCap.Square;
            }
            if (json.border.cap == CanvasKitUtils.StrokeJoin.Bevel.value) {
                f.join = CanvasKitUtils.StrokeJoin.Bevel;
            }
            if (json.border.cap == CanvasKitUtils.StrokeJoin.Round.value) {
                f.join = CanvasKitUtils.StrokeJoin.Round;
            }
            if (json.border.cap == CanvasKitUtils.StrokeJoin.Miter.value) {
                f.join = CanvasKitUtils.StrokeJoin.Miter;
            }
            // f.dashOffset = json.border.dashOffset;
            // f.dashLength = json.border.dashLength;
            f.miter = json.border.miter;
        }
        if (json.children) {
            for (let i = 0; i < json.children.length; i++) {
                const child = json.children[i];
                f.addChild(await loadFromJson(child));
            }
        }
        return f;
    }
}

function createFigureViaType(json) {
    if (json == null || json.type == null) return;
    let figure;
    if (json.type == 'document') {
        figure = new DocumentRoot(null, 0, 0, json);
    }
    if (json.type == 'root') {
        figure = new RootFigure(null, json);
    }
    if (json.type == 'line') {
        figure = new Line(json);
    }

    if (json.type == 'text' || json.type == 'v-text') {
        figure = new Text(json);
    }

    if (json.type == 'rect') {
        figure = new Rect(json);
    }
    if (json.type == 'ellipse') {
        figure = new Ellipse(json);
    }
    if (json.type == 'star') {
        figure = new Star(json);
    }
    if (json.type == 'polygon') {
        figure = new Polygon(json);
    }

    if (json.type == 'center-rect') {
        figure = new CenterRect(json);
    }
    if (json.type == 'center-ellipse') {
        figure = new CenterEllipse(json);
    }
    if (json.type == 'center-star') {
        figure = new CenterStar(json);
    }
    if (json.type == 'center-polygon') {
        figure = new CenterPolygon(json);
    }

    if (json.type == 'group') {
        figure = new Group(json);
    }

    if (json.type == 'path-shape') figure = new PathShape(json);

    setFigureProperties(figure, json);

    return figure;
}

function setFigureProperties(figure, json) {
    if (!figure || !json || !json.type) return;
    if (json.type == 'document') {
        figure.zoom = json.zoom;
        figure.padding = json.padding;
    }
    if (json.type == 'center-rect') {
        figure.x = json.cx, figure.y = json.cy;
    }

    if (json.type == 'ellipse') {
        // figure.width = json.rx * 2;
        // figure.height = json.ry * 2;
    }

    if (json.type == 'center-ellipse') {
        figure.x = json.cx, figure.y = json.cy;
        // figure.width = json.rx * 2;
        // figure.height = json.ry * 2;
    }

    if (json.type == 'center-polygon') {
        figure.x = json.cx, figure.y = json.cy;
    }

    if (json.type == 'center-star') {
        figure.x = json.cx, figure.y = json.cy;
    }

    if (json.type == 'line') {
        let from = json.from;
        if (from) {
            figure.getPathModel().addPoint(new Point(from.x, from.y))
        }
        let to = json.to;
        if (to) {
            figure.getPathModel().addPoint(new Point(to.x, to.y))
        }
    }

    if (json.type == 'path-shape') {
        let points = json.points;
        if (points) {
            let pathModel = figure.getPathModel();
            points.forEach(p => {
                let pm = new Point(p.x, p.y, p.type);
                if (p.in) {
                    pm.inX = p.in.x, pm.inY = p.in.y;
                }
                if (p.out) {
                    pm.outX = p.out.x, pm.outY = p.out.y;
                }
                pathModel.addPoint(pm);
            })
        }
    }
}


export { loadFromJson };