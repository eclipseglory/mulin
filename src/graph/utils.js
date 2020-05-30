const PI_DIV_180 = Math.PI / 180;
const DRP = pixelRatio();

function isPointInPolygon(x, y, polygon) {
    if (x == null || y == null || polygon == null) return false;
    if (polygon.length < 3) return false;
    let minX = polygon[0][0];
    let maxX = polygon[0][0];
    let minY = polygon[0][1];
    let maxY = polygon[0][1];
    for (let i = 1; i < polygon.length; i++) {
        let q = polygon[i];
        minX = Math.min(q[0], minX);
        maxX = Math.max(q[0], maxX);
        minY = Math.min(q[1], minY);
        maxY = Math.max(q[1], maxY);
    }

    if (x < minX || x > maxX || y < minY || y > maxY) {
        return false;
    }
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if ((polygon[i][1] > y) != (polygon[j][1] > y) &&
            x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]) {
            inside = !inside;
        }
    }

    return inside;
}

function pixelRatio() {
    if (!window) {
        return wx.getSystemInfoSync().pixelRatio;
    } else {
        return window.devicePixelRatio;
    }
}

function requestAnimationFrame(canvas, handle) {
    if (!window) {
        return canvas.requestAnimationFrame(handle);
    } else {
        return window.requestAnimationFrame(handle);
    }
}

function cancelAnimationFrame(canvas, id) {
    if (!window) {
        canvas.cancelAnimationFrame(id);
    } else {
        window.cancelAnimationFrame(id);
    }
}

function createPath2D(canvas, path) {
    if (!window) {
        return canvas.createPath2D(path);
    } else {
        return new Path2D(path)
    }
}

function convertColorArrayToString(color) {
    if (color.length == 3) {
        return 'rgb(' + Math.floor(color[0] * 255) + ',' + Math.floor(color[1] * 255)
            + ',' + Math.floor(color[2] * 255) + ')';
    }
    if (color.length == 4)
        return 'rgba(' + Math.floor(color[0] * 255) + ',' + Math.floor(color[1] * 255)
            + ',' + Math.floor(color[2] * 255) + ',' + color[3] + ')';
}

export default {
    PI_DIV_180: PI_DIV_180,
    DRP: DRP,
    convertColorArrayToString: convertColorArrayToString,
    isPointInPolygon: isPointInPolygon,
    pixelRatio: pixelRatio,
    requestAnimationFrame: requestAnimationFrame,
    cancelAnimationFrame: cancelAnimationFrame,
    createPath2D: createPath2D
}