import Container from "./container.js";
import utils from "./utils.js";
import Shape from "./shapes/shape.js";
import StrokeStyle from "./shapes/stroke-style.js";
import FillStyle from "./shapes/fill-style.js";
import CirclePath from "./shapes/circle-path.js";
import Animation from "../animation/animation.js";
import AnimationPropertyKey from "../animation/animation-property-key.js";
import Path from "./shapes/path.js";
import Point from "./shapes/point.js";
import Group from './group.js';
import RadicalGradientColor from "./radical-gradient-color.js";
import LinearGradientColor from "./linear-gradient-color.js";

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
                    color: utils.converColorArray(artboard.color),
                    opacity: artboard.opacity
                });
                containers.push(container);
                this.readNodes(artboard, container, tempstack);
                this.sortDrawable(container);
                this.readAnimations(artboard, container, tempstack);
            }
        });
        return containers;
    }

    static sortDrawable(parent) {
        let children = parent._children;
        if (children != null && children.length > 1) {
            children.sort((a, b) => {
                if (a.drawOrder != null && b.drawOrder != null) {
                    return a.drawOrder - b.drawOrder;
                }
                return 0;
            })

            children.forEach(child => {
                this.sortDrawable(child);
            })
        }
    }

    static getPropertyName(p) {
        if (p == 'strokeStart') {
            return 'start';
        }
        if (p == 'strokeEnd') {
            return 'end';
        }
        if (p == 'strokeWidth') {
            return 'width';
        }
        if (p == 'strokeOffset') {
            return 'offset';
        }
        return p;
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
                        if (propertyName && propertyName in figure) {
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

    static readPathPoints(path, points) {
        points.forEach(point => {
            path.addPoint(new Point({
                type: point.pointType,
                x: point.translation[0],
                y: point.translation[1],
                in: point.in,
                out: point.out
            }));
        });
    }

    static readNodes(artboard, container, tempstack) {
        let nodes = artboard.nodes;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node.drawOrder != null) {
                console.log(node.name, node.drawOrder);
            }
            if (node.type == 'node') {
                let group = new Group({
                    drawOrder: node.drawOrder,
                    x: node.translation[0],
                    y: node.translation[1],
                    id: i,
                    name: node.name,
                    rotate: node.ratation,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity
                });
                let parent = container;
                if (node.parent != null) {
                    parent = tempstack[node.parent];
                }
                parent.addChild(group);
                if (parent.drawOrder == null) {
                    parent.drawOrder = group.drawOrder;
                }
                parent.drawOrder = Math.max(group.drawOrder, parent.drawOrder);
                tempstack[i] = group;
            }
            if (node.type == 'shape') {
                let shape = new Shape({
                    drawOrder: node.drawOrder,
                    x: node.translation[0],
                    y: node.translation[1],
                    id: i,
                    name: node.name,
                    rotate: node.ratation,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity,
                    visible: node.isVisible
                });
                let parent = container;
                if (node.parent != null) {
                    parent = tempstack[node.parent];
                }
                if (parent.drawOrder == null) {
                    parent.drawOrder = shape.drawOrder;
                }
                parent.drawOrder = Math.max(shape.drawOrder, parent.drawOrder);
                parent.addChild(shape);
                tempstack[i] = shape;
            }

            if (node.type == 'ellipse') {
                let parent = tempstack[node.parent];
                // ellipse的translation是以中心开始的，这里要转一下：
                let path = new CirclePath({
                    drawOrder: node.drawOrder,
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

            if (node.type == 'path') {
                let parent = tempstack[node.parent];
                let path = new Path({
                    x: node.translation[0],
                    y: node.translation[1],
                    width: node.width,
                    height: node.height,
                    id: i,
                    name: node.name,
                    rotate: node.ratation,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity,
                    isClose: node.isClosed
                });
                this.readPathPoints(path, node.points);
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
                    color: utils.converColorArray(node.color),
                    name: node.name,
                    id: i
                });
                tempstack[i] = strokeStyle;
                shape.addStrokeStyle(strokeStyle);
            }

            if (node.type == 'colorFill') {
                let shape = tempstack[node.parent];
                let fillStyle = new FillStyle({
                    opacity: node.opacity,
                    color: utils.converColorArray(node.color),
                    name: node.name,
                    id: i,
                    fillRule: node.fillRule,
                });
                tempstack[i] = fillStyle;
                shape.addFillStyle(fillStyle);
            }

            if (node.type == 'gradientFill') {
                let shape = tempstack[node.parent];
                let values = [node.start[0], node.start[1], node.end[0], node.end[1]];
                values = values.concat(node.colorStops);
                let linearGradientColor = new LinearGradientColor(values);
                let fillStyle = new FillStyle({
                    gradientColor: linearGradientColor,
                    opacity: node.opacity,
                    name: node.name,
                    id: i,
                    fillRule: node.fillRule,
                });
                tempstack[i] = fillStyle;
                shape.addFillStyle(fillStyle);
            }

            if (node.type == 'radialGradientFill') {
                let shape = tempstack[node.parent];
                let values = [node.secondaryRadiusScale, node.start[0], node.start[1], node.end[0], node.end[1]];
                values = values.concat(node.colorStops);
                let radicalGradientColor = new RadicalGradientColor(values);
                let fillStyle = new FillStyle({
                    gradientColor: radicalGradientColor,
                    opacity: node.opacity,
                    name: node.name,
                    fillRule: node.fillRule,
                    id: i
                });
                tempstack[i] = fillStyle;
                shape.addFillStyle(fillStyle);
            }
        }
    }
}