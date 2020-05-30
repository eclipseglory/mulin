import Container from "./container.js";
import utils from "./utils.js";
import Shape from "./shapes/shape.js";
import StrokeStyle from "./shapes/stroke-style.js";
import FillStyle from "./shapes/fill-style.js";
import CirclePath from "./shapes/circle-path.js";
import Animation from "../animation/animation.js";
import AnimationPropertyKey from "../animation/animation-property-key.js";

export default class FlareJSONReader {
    constructor() { }

    static read(content) {
        let obj = JSON.parse(content);
        // DEBUG:
        console.log(obj);
        let containers = [];

        obj.artboards.forEach(artboard => {
            if (artboard.type == 'artboard') {
                let tempstack = new Array(artboard.nodes.length);
                let container = new Container({
                    x: artboard.translation[0],
                    y: artboard.translation[1],
                    width: artboard.width,
                    height: artboard.height,
                    color: utils.convertColorArrayToString(artboard.color),
                    opacity: artboard.opacity
                });
                containers.push(container);
                this.readNodes(artboard, container, tempstack);
                this.readAnimations(artboard, container, tempstack);
            }
        });
        return containers;
    }

    static getPropertyName(p) {
        if (p == 'strokeStart') {
            return 'start';
        }
        if (p == 'strokeWidth') {
            return 'width';
        }
    }

    static readKeyed(keyed, animation, tempstack) {
        keyed.forEach(key => {
            let figure;
            for (let p in key) {
                if (p == 'component') {
                    figure = tempstack[key[p]];
                } else {
                    if (figure) {
                        let propertyName = this.getPropertyName(p);
                        if (propertyName) {
                            let array = key[p];
                            let propertyAnimation = new AnimationPropertyKey({
                                duration: animation.duration, // 这个duration其实是为了计算一个比例，并非真正的运行时间
                                figure: figure,
                                property: propertyName
                            });
                            array.forEach(keyFrames => {
                                keyFrames.forEach(keyFrame => {
                                    keyFrame.time *= 1000;
                                    propertyAnimation.addKeyFrame(keyFrame);
                                });
                            });
                            animation.addKeyedAnimation(propertyAnimation);
                        }
                    }
                }
            }
        });
    }

    static readAnimations(artboard, container, tempstack) {
        let animations = artboard.animations;
        animations.forEach(animation => {
            let ani = new Animation(animation);
            ani.duration *= 1000;
            this.readKeyed(animation.keyed, ani, tempstack);
            container.addAnimation(ani);
        });
    }

    static readNodes(artboard, container, tempstack) {
        let nodes = artboard.nodes;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node.type == 'shape') {
                let shape = new Shape({
                    x: node.translation[0],
                    y: node.translation[1],
                    id: i,
                    name: node.name,
                    rotate: node.ratation,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity
                });
                if (node.parent == null) {
                    container.addChild(shape);
                }
                tempstack[i] = shape;
            }

            if (node.type == 'ellipse') {
                let parent = tempstack[node.parent];
                // ellipse的translation是以中心开始的，这里要转一下：
                let path = new CirclePath({
                    x: node.translation[0] - node.width / 2,
                    y: node.translation[1] - node.height / 2,
                    width: node.width,
                    height: node.height,
                    id: i,
                    name: node.name,
                    rotate: node.ratation,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity
                });
                tempstack[i] = path;
                parent.addPath(path);
            }

            if (node.type == 'colorStroke') {
                let shape = tempstack[node.parent];
                let strokeStyle = new StrokeStyle({
                    cap: node.cap,
                    join: node.join,
                    width: node.width,
                    opacity: node.opacity,
                    start: node.start,
                    end: node.end,
                    offset: node.offset,
                    color: utils.convertColorArrayToString(node.color),
                    name: node.name,
                    id: i
                });
                tempstack[i] = strokeStyle;
                shape.strokeStyle = strokeStyle;
            }

            if (node.type == 'colorFill') {
                let shape = tempstack[node.parent];
                let fillStyle = new FillStyle({
                    opacity: node.opacity,
                    color: utils.convertColorArrayToString(node.color),
                    name: node.name,
                    id: i
                });
                tempstack[i] = fillStyle;
                shape.fillStyle = fillStyle;
            }
        }
    }
}