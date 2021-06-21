export default class Utils {
    static isContacted(rect1, rect2) {
        return !(rect1.left > rect2.right || rect1.top > rect2.bottom ||
            rect2.left > rect1.right || rect2.top > rect1.bottom);
    }

    static containsPoint(x, y, bounds) {
        return x >= bounds.left && x <= bounds.right
            && y >= bounds.top && y <= bounds.bottom;
    }

    static transformToRelatedBounds(bounds, matrix) {
        let lt = [bounds.left, bounds.top];
        let rb = [bounds.right, bounds.bottom];
        let p1 = matrix.multiplyWithVertex(lt);
        let p2 = matrix.multiplyWithVertex(rb);
        let left = Math.min(p1[0], p2[0]);
        let top = Math.min(p1[1], p2[1]);
        let right = Math.max(p1[0], p2[0]);
        let bottom = Math.max(p1[1], p2[1]);
        return { left, top, right, bottom };
    }

    static transformRGBToHex(r, g, b) {
        let rf = r.toString(16);
        if (rf.length == 1) rf = "0" + rf;
        let gf = g.toString(16);
        if (gf.length == 1) gf = "0" + gf;
        let bf = b.toString(16);
        if (bf.length == 1) bf = "0" + bf;
        return `#${rf}${gf}${bf}`;
    }


    static decomposeMatrix(matrix, QRList = true) {
        return matrix.decompose(QRList);
    }

    static applyPose(figure, pose) {
        if (!figure || !pose) return;
        figure.x = pose.translation.x;
        figure.y = pose.translation.y;
        figure.rotation = pose.rotation;
        figure.skewx = pose.skew.x;
        figure.skewy = pose.skew.y;
        figure.scaley = pose.scale.y;
        figure.scalex = pose.scale.x;
    }

    static distance(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
}