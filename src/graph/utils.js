import Color from "./color.js";

const PI_DIV_180 = Math.PI / 180;
const DRP = pixelRatio();

// 这是为了模拟不能生成Path2D直接绘制的效果
var isWX = false;

// Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
const Tvalues = [
    -0.0640568928626056260850430826247450385909,
    0.0640568928626056260850430826247450385909,
    -0.1911188674736163091586398207570696318404,
    0.1911188674736163091586398207570696318404,
    -0.3150426796961633743867932913198102407864,
    0.3150426796961633743867932913198102407864,
    -0.4337935076260451384870842319133497124524,
    0.4337935076260451384870842319133497124524,
    -0.5454214713888395356583756172183723700107,
    0.5454214713888395356583756172183723700107,
    -0.6480936519369755692524957869107476266696,
    0.6480936519369755692524957869107476266696,
    -0.7401241915785543642438281030999784255232,
    0.7401241915785543642438281030999784255232,
    -0.8200019859739029219539498726697452080761,
    0.8200019859739029219539498726697452080761,
    -0.8864155270044010342131543419821967550873,
    0.8864155270044010342131543419821967550873,
    -0.9382745520027327585236490017087214496548,
    0.9382745520027327585236490017087214496548,
    -0.9747285559713094981983919930081690617411,
    0.9747285559713094981983919930081690617411,
    -0.9951872199970213601799974097007368118745,
    0.9951872199970213601799974097007368118745
];

// Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
const Cvalues = [
    0.1279381953467521569740561652246953718517,
    0.1279381953467521569740561652246953718517,
    0.1258374563468282961213753825111836887264,
    0.1258374563468282961213753825111836887264,
    0.121670472927803391204463153476262425607,
    0.121670472927803391204463153476262425607,
    0.1155056680537256013533444839067835598622,
    0.1155056680537256013533444839067835598622,
    0.1074442701159656347825773424466062227946,
    0.1074442701159656347825773424466062227946,
    0.0976186521041138882698806644642471544279,
    0.0976186521041138882698806644642471544279,
    0.086190161531953275917185202983742667185,
    0.086190161531953275917185202983742667185,
    0.0733464814110803057340336152531165181193,
    0.0733464814110803057340336152531165181193,
    0.0592985849154367807463677585001085845412,
    0.0592985849154367807463677585001085845412,
    0.0442774388174198061686027482113382288593,
    0.0442774388174198061686027482113382288593,
    0.0285313886289336631813078159518782864491,
    0.0285313886289336631813078159518782864491,
    0.0123412297999871995468056670700372915759,
    0.0123412297999871995468056670700372915759
];

const ZERO = { x: 0, y: 0, z: 0 };

function derivative(t, order, dpoints, _3d = false) {
    var mt = 1 - t,
        a,
        b,
        c = 0,
        p = dpoints[0];
    if (order === 2) {
        p = [p[0], p[1], ZERO];
        a = mt;
        b = t;
    }
    if (order === 3) {
        a = mt * mt;
        b = mt * t * 2;
        c = t * t;
    }
    var ret = {
        x: a * p[0].x + b * p[1].x + c * p[2].x,
        y: a * p[0].y + b * p[1].y + c * p[2].y
    };
    if (_3d) {
        ret.z = a * p[0].z + b * p[1].z + c * p[2].z;
    }
    return ret;
}

function derive(points, _3d = false) {
    let dpoints = [];
    for (let p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
        let list = [];
        for (var j = 0, dpt; j < c; j++) {
            dpt = {
                x: c * (p[j + 1].x - p[j].x),
                y: c * (p[j + 1].y - p[j].y)
            };
            if (_3d) {
                dpt.z = c * (p[j + 1].z - p[j].z);
            }
            list.push(dpt);
        }
        dpoints.push(list);
        p = list;
    }
    return dpoints;
}

/**
 * 贝塞尔曲线长度计算代码抄自：https://github.com/Pomax/bezierjs MIT协议，做了一点点修改
 * @param {*} p0 
 * @param {*} p1 
 * @param {*} p2 
 * @param {*} p3 
 */
function bezierLength(p0, p1, p2, p3) {
    var z = 0.5,
        sum = 0,
        len = Tvalues.length,
        i,
        t;
    let order = 2;
    let points;
    if (p3 != null) {
        order = 3;
        points = [p0, p1, p2, p3];
    } else {
        points = [p0, p1, p2];
    }
    let dpoints = derive(points);
    for (i = 0; i < len; i++) {
        t = z * Tvalues[i] + z;
        sum += Cvalues[i] * arcfn(t, order, dpoints);
    }
    return z * sum;
}

function arcfn(t, order, dpoints, _3d = false) {
    var d = derivative(t, order, dpoints);
    var l = d.x * d.x + d.y * d.y;
    // if (typeof d.z !== "undefined") {
    //     l += d.z * d.z;
    // }
    return Math.sqrt(l);
}

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
    // DEBUG ,模拟在wx环境下无法创建path2d
    if (isWX)
        return null;
    if (!window) {
        let path2d = canvas.createPath2D(path);
        if (path2d && path2d.closePath == null) {
            return null;
        }
        return path2d;
    } else {
        return new Path2D(path)
    }
}

function converColorArray(color) {
    if (color.length == 3) {
        return [Math.floor(color[0] * 255), Math.floor(color[1] * 255), Math.floor(color[2] * 255)];
    }
    if (color.length == 4)
        return [Math.floor(color[0] * 255), Math.floor(color[1] * 255), Math.floor(color[2] * 255), color[3]];
}

function createColorStops(array, length) {
    let colorStops = [];
    for (let i = 0; i < length * 5; i += 5) {
        let color = new Color(converColorArray([array[i], array[i + 1], array[i + 2], array[i + 3]]));
        colorStops.push([array[i + 4], color]);
    }
    return colorStops;
}

export default {
    PI_DIV_180: PI_DIV_180,
    DRP: DRP,
    isWX: isWX,
    createColorStops: createColorStops,
    bezierLength: bezierLength,
    converColorArray: converColorArray,
    isPointInPolygon: isPointInPolygon,
    pixelRatio: pixelRatio,
    requestAnimationFrame: requestAnimationFrame,
    cancelAnimationFrame: cancelAnimationFrame,
    createPath2D: createPath2D
}