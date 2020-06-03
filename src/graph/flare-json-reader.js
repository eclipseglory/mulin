import Container from "./container.js";
import utils from "./utils.js";
import Shape from "./shapes/shape.js";
import EllipsePath from "./shapes/ellipse-path.js";
import Animation from "../animation/animation.js";
import AnimationPropertyKey from "../animation/animation-property-key.js";
import Path from "./shapes/path.js";
import Point from "./shapes/point.js";
import Group from './group.js';
import RadicalGradientColor from "./radical-gradient-color.js";
import LinearGradientColor from "./linear-gradient-color.js";
import RectanglePath from "./shapes/rectangle-path.js";
import StrokeStyle from "./shapes/paint-style/stroke-style.js";
import FillStyle from "./shapes/paint-style/fill-style.js";
import StarPath from "./shapes/star-path.js";

export default class FlareJSONReader {
    constructor() { }

    static readJSONObject(obj) {
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

                let renderObj = this.readNodes(artboard, container, tempstack);
                this.initClips(container, tempstack);
                containers.push({ render: renderObj, artboard: container, animations: this.readAnimations(artboard, tempstack) });
            }

        });
        return containers;
    }

    static read(content) {
        let obj = JSON.parse(content);
        return this.readJSONObject(obj);
    }

    static initClips(container, tempstack) {
        if (container.clips) {
            for (let i = 0; i < container.clips.length; i++) {
                let id = container.clips[i].node;
                container.clips[i].shape = tempstack[id];
                delete container.clips[i].node;
            }
        }
        container.children.forEach(child => {
            this.initClips(child, tempstack);
        })
    }

    static getPropertyName(p) {
        if (p == 'posX') return 'x';
        if (p == 'posY') return 'y';
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
                                figure: figure,
                                property: propertyName
                            });
                            array.forEach(keyFrames => {
                                keyFrames.forEach(keyFrame => {
                                    keyFrame.time *= 1000;
                                    // keyframe的时间值是一个百分比
                                    if (animation.duration == 0) keyFrame.time = 0;
                                    else
                                        keyFrame.time = keyFrame.time / animation.duration;
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

    static readAnimations(artboard, tempstack) {
        let animations = artboard.animations;
        let anims = [];
        animations.forEach(animation => {
            let ani = new Animation(animation);
            ani.duration *= 1000;
            this.readKeyed(animation.keyed, ani, tempstack);
            anims.push(ani);
        });
        return anims;
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
        let renderObj = [];
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
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
                    opacity: node.opacity,
                    clips: node.clips
                });
                let parent = container;
                if (node.parent != null) {
                    parent = tempstack[node.parent];
                }
                parent.addChild(group);
                tempstack[i] = group;
            }
            if (node.type == 'shape') {
                let shape = new Shape({
                    drawOrder: node.drawOrder,
                    x: node.translation[0],
                    y: node.translation[1],
                    id: i,
                    rotation: node.rotation,
                    name: node.name,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity,
                    visible: node.isVisible,
                    clips: node.clips
                });
                let parent = container;
                if (node.parent != null) {
                    parent = tempstack[node.parent];
                }
                renderObj.push(shape);
                parent.addChild(shape);
                tempstack[i] = shape;
            }

            if (node.type == 'ellipse') {
                let parent = tempstack[node.parent];
                // ellipse的translation是以中心开始的，这里要转一下：
                let path = new EllipsePath({
                    drawOrder: node.drawOrder,
                    x: node.translation[0],
                    y: node.translation[1],
                    width: node.width,
                    height: node.height,
                    id: i,
                    name: node.name,
                    rotation: node.ratation,
                    scaleX: node.scale[0],
                    scaleY: node.scale[1],
                    opacity: node.opacity
                });
                tempstack[i] = path;
                parent.addPath(path);
            }

            if (node.type == 'rectangle') {
                let parent = tempstack[node.parent];
                let path = new RectanglePath({
                    drawOrder: node.drawOrder,
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
                    radius: node.cornerRadius,
                });
                tempstack[i] = path;
                parent.addPath(path);
            }

            if (node.type == 'star') {
                let parent = tempstack[node.parent];
                let path = new StarPath({
                    drawOrder: node.drawOrder,
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
                    innerRadius: node.innerRadius,
                    starPoints: node.points
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

        return renderObj;
    }
}