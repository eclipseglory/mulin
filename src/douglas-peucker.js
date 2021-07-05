/**
 * 该算法是将多个顺序连接的点进行简化的算法，更多详情请查阅：
 * https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
 * @param {Array} points 
 * @param {Number} epsilon 
 * @param {Number} start
 * @param {Number} end
 */
 function douglasPeucker(points, epsilon = 10, start, end) {
    if (!points || points.length == 0) return;
    if (points.length < 3) {
        return points.map((v) => [v[0], v[1]]);
    }
    start = start == null ? 0 : start;
    end = end == null ? points.length - 1 : end;
    if (start < 0 || end < 0 || start > points.length - 1 || end > points.length - 1) return;
    if (end - start < 2) {
        let r = [];
        for (let i = start; i <= end; i++) {
            r.push([points[i][0], points[i][1]])
        }
        return r;
    }
    let dmax = -Infinity;
    let index = -1;
    let v = new _Vector(points[end][0] - points[start][0], points[end][1] - points[start][1]);
    v.normalize();
    for (let i = start + 1; i < end; i++) {
        let dis = _perpendicularDistanceSquare(points[i], points[start], v);
        if (dis > dmax) {
            dmax = dis;
            index = i;
        }
    }

    if (dmax > epsilon * epsilon) {
        let r1 = douglasPeucker(points, epsilon, start, index);
        let r2 = douglasPeucker(points, epsilon, index, end);
        r1.pop();
        return r1.concat(r2);
    } else {
        let r = [[points[start][0], points[start][1]], [points[end][0], points[end][1]]];
        return r;
    }
}

/**
 * 这个方法来自：https://github.com/pshihn/bezier-points/blob/master/src/curve-to-bezier.ts
 * @param {Array} pointsIn 
 * @param {Nmber} curveTightness 
 * @returns 
 */
function smoothLines(pointsIn, curveTightness = 0.3) {
    const len = pointsIn.length;
    if (len < 3) {
        throw new Error('A curve must have at least three points.');
    }
    const out = [];
    if (len === 3) {
        return [
            {
                x: pointsIn[0][0], y: pointsIn[0][1],
                out: {
                    x: pointsIn[1][0], y: pointsIn[1][1]
                }
            },
            {
                x: pointsIn[2][0], y: pointsIn[2][1],
            }
        ]
    } else {
        const points = [];
        points.push(pointsIn[0], pointsIn[0]);
        for (let i = 1; i < pointsIn.length; i++) {
            points.push(pointsIn[i]);
            if (i === (pointsIn.length - 1)) {
                points.push(pointsIn[i]);
            }
        }
        const b = [];
        const s = 1 - curveTightness;
        // out.push([points[0][0], points[0][0]]);
        let pre = { x: points[0][0], y: points[0][1] };
        out.push(pre);
        let next;
        for (let i = 1; (i + 2) < points.length; i++) {
            const cachedVertArray = points[i];
            b[0] = [cachedVertArray[0], cachedVertArray[1]];
            b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
            b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
            b[3] = [points[i + 1][0], points[i + 1][1]];
            pre.out = { x: b[1][0], y: b[1][1] };
            next = {
                x: b[3][0], y: b[3][1], in: {
                    x: b[2][0], y: b[2][1]
                }
            };
            out.push(next);
            pre = next;
            // out.push(b[1], b[2], b[3]);
        }
    }
    return out;
}

/**
 * 计算投影点到某线段的距离的平方
 * @param {Array} p 投影点
 * @param {Array} p1 线段起点
 * @param {Array} v 线段单位向量
 */
function _perpendicularDistanceSquare(p, p1, v) {
    let v2 = new _Vector(p[0] - p1[0], p[1] - p1[1]);
    let d = v2.dot(v.x, v.y);
    let x = p1[0] + v.x * d;
    let y = p1[1] + v.y * d;
    let dx = x - p[0];
    let dy = y - p[1];
    return dx * dx + dy * dy;
}

/**
 * 方便计算创建的一个向量类。内部类
 */
class _Vector {
    constructor(x, y) {
        this.x = x, this.y = y
    }

    _length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let l = this._length();
        this.x = this.x / l;
        this.y = this.y / l;
    }

    dot(x, y) {
        return this.x * x + this.y * y;
    }
}
export {
    douglasPeucker,
    smoothLines
}