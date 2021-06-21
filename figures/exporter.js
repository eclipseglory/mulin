
const L = '<'
const R = '>'
const E = '/>'
const LINE_SPACE = '  ';

async function exportToSVG(json, lineSpace = LINE_SPACE) {
    if (!json) return;
    let tag = getSVGTag(json.type);
    if (tag && json.id != null) {
        let s = `${L}${tag} id="${json.id}" `;
        s += getSVGPropertiesString(tag, json);
        let transform = getTransformString(tag, json);
        if (transform && transform.length != 0) {
            s += ` transform="${transform}"`
        }
        if (json.children) {
            s += R;
            for (let i = 0; i < json.children.length; i++) {
                const cj = json.children[i];
                let cs = await exportToSVG(cj, lineSpace + LINE_SPACE)
                if (cs) s += `\n${lineSpace}${cs}`;
            }
            s += `\n${L}/${tag}${R}`;
        } else {
            s += `${E}`;
        }
        return s;
    }
}

function getSVGTag(type) {
    if (!type) return;
    if (type == 'document' || type == 'root') return 'svg';
    if (type == 'center-rect') return 'rect';
    if (type == 'center-ellipse') return 'ellipse';
    if (type == 'center-star' || type == 'star' || type == 'center-polygon' || type == 'polygon' ||
        type == 'path-shape') return 'path';
    if (type == 'group') return 'g';
    return type;
}

function getSVGPropertiesString(svgTag, json) {
    if (svgTag == 'svg') {
        return `viewbox="0 0 ${json.width} ${json.height}"  style="background-color:gray" version="1.1" xmlns="http://www.w3.org/2000/svg"`;
    }
    let ps = ''
    let position = getSVGPositionString(svgTag, json);
    if (position) ps += ` ${position}`;
    let dimension = getSVGDimensionString(svgTag, json);
    if (dimension) ps += ` ${dimension}`;
    let extension = getExtensionString(svgTag, json);
    if (extension) ps += ` ${extension}`;
    return ps;
}

function getSVGPositionString(tag, json) {
    if (tag == 'ellipse') return `cx="${json.cx}" cy="${json.cy}"`
    if (tag == 'rect' || tag == 'star' || tag == 'polygon') {
        return `x="${json.x - json.width / 2}" y="${json.y - json.height / 2}"`
    }
    return `x="${json.x}" y="${json.y}"`
}

function getSVGDimensionString(tag, json) {
    if (tag == 'ellipse') return `rx="${json.radiusx}" ry="${json.radiusy}"`
    if (tag == 'rect') return `rx="${json.radiusx}" ry="${json.radiusy}" width="${json.width}" height="${json.height}"`
}

function getExtensionString(tag, json) {
    if (tag == 'path') return `d="${json.pathSvg}"`
}

function getTransformString(svgTag, json) {
    if (svgTag == 'svg') return;
    let str = '';
    // if (json.x != 0 || json.y != 0)
    //     str += ` translate(${json.x} ${json.y})`;
    if (json.rotation != 0) {
        str += ` rotate(${json.rotation * 180 / Math.PI})`
    }
    if (json.scalex != 1 || json.scaley != 1) {
        str += ` scale(${json.scalex} ${json.scaley})`
    }
    if (json.skewx != 0) {
        str += ` skewX(${json.skewx * 180 / Math.PI})`
    }
    if (json.skewy != 0) {
        str += ` skewY(${json.skewy * 180 / Math.PI})`
    }
    return str;
}

export {
    exportToSVG
}