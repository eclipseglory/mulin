import Graph from "./graph.js";
import Figure from "./figure.js";
import Circle from "./shapes/circle.js";
import Polygon from "./shapes/polygon.js";
import Shape from "./shapes/shape.js";
import Rectangle from "./shapes/rectangle.js";
import Matrix3 from "./math/matrix3.js";
import Text from "./text/text.js";
import Render from "./render.js";
import FlareJSONReader from './flare-json-reader.js';

const version = __VERSION__;
const style = "color:red;background-color:yellow";


let outdefine = {
    version: version,
    Graph: Graph,
    Figure: Figure,
    Render: Render,
    FlareJSONReader: FlareJSONReader,
    shapes: {
        Circle: Circle,
        Polygon: Polygon,
        Shape: Shape,
        Rectangle: Rectangle
    },
    math: {
        Matrix3: Matrix3
    },
    text: {
        Text: Text
    }
};
let out = {};
definedReadOnly(outdefine, out);

function definedReadOnly(maps, out) {
    for (let p in maps) {
        let v = maps[p];
        let v1 = v;
        if (typeof v1 == 'object') {
            v1 = {};
            definedReadOnly(v, v1);
        }
        Object.defineProperty(out, p, {
            get: function () {
                return v1;
            }
        });
    }
}
var forWX = __ISWX__;
var t = forWX ? ' 无Path2D版' : '';
console.log("%c Mulin" + t + "(version " + version + ") by 老脸", style);
export default out;