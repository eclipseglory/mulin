
function projectionsOnAxis(vertices, axis) {
    let min = Infinity;
    let max = -Infinity;
    vertices.forEach(vertex => {
        let projection = dot(axis[0], axis[1], vertex[0], vertex[1]);
        min = Math.min(min, projection);
        max = Math.max(max, projection);
    });
    return { min, max };
}

function dot(x1, y1, x2, y2) {
    return (x1 * x2 + y1 * y2);
}

function isContact(project1, project2) {
    if (project1.min > project2.max || project2.min > project1.max) {
        return false;
    }
    return true;
}

/**
 * 该方法是用SAT算法检测选择框是否和图形相交。
 */
function contactTest(vertices1, axis1, vertices2, axis2) {
    let k = {};
    let r1 = f(axis1, k);
    if (!r1) return false;
    r1 = f(axis2, k);
    if (!r1) return false;
    return true;

    function f(axis2, k) {
        for (let i = 0; i < axis2.length; i++) {
            let axis = axis2[i];
            let xie = axis[0] == 0 ? Infinity : axis[1] / axis[0];
            if (k[xie]) continue;
            k[xie] = true;
            let project1 = projectionsOnAxis(vertices1, axis);
            let project2 = projectionsOnAxis(vertices2, axis);
            let contacted = isContact(project1, project2);
            if (!contacted) return false;
        }
        return true;
    }
}


export default {
    contactTest: contactTest
}