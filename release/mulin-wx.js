(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mulin"] = factory();
	else
		root["mulin"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./build/es5-graph/entries.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/animation/animation-property-key.js":
/*!***************************************************!*\
  !*** ./build/animation/animation-property-key.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AnimationPropertyKey; });
/* harmony import */ var _graph_math_bezier_easing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../graph/math/bezier-easing.js */ "./build/graph/math/bezier-easing.js");


class AnimationPropertyKey {
    constructor(props = {}) {
        this.figure = props.figure;
        this.property = props.property;
        this.keyStack = [];
        this.currentKey;
        this.nextKey;
    }

    get startKeyFrame() {
        return this.keyStack[0];
    }

    get lastKeyFrame() {
        return this.keyStack[this.keyStack.length - 1];
    }

    addKeyFrame(props = {}) {
        let last = this.keyStack[this.keyStack.length - 1];
        if (last) {
            if (last.time > props.time) throw '属性关键帧的后续时间不能大于前一个';
        }
        let keyFrame = {
            id: this.keyStack.length,
            time: props.time,
            value: props.value,
            timingFunctionType: props.interpolatorType
        };

        if (keyFrame.timingFunctionType == 2) {
            keyFrame.bezierEasing = new _graph_math_bezier_easing_js__WEBPACK_IMPORTED_MODULE_0__["default"](props.cubicX1, props.cubicY1, props.cubicX2, props.cubicY2);
        }
        this.keyStack.push(keyFrame);
    }

    applyCurrent(currentPercent) {
        let start = this.startKeyFrame;
        let last = this.lastKeyFrame;

        if (currentPercent <= start.time) {
            this.figure[this.property] = start.value;
            return;
        }

        if (currentPercent >= last.time) {
            this.figure[this.property] = last.value;
            return;
        }
        // 查找当前运行所在关键帧的位置
        // TODO 这里要最好改成2分查找比较快
        if (this.currentKey == null && this.nextKey == null) {
            for (let i = 0; i < this.keyStack.length - 1; i++) {
                let c = this.keyStack[i];
                let n = this.keyStack[i + 1];
                if (currentPercent >= c.time && currentPercent <= n.time) {
                    this.nextKey = n;
                    this.currentKey = c;
                    break;
                }
            }
        }

        if (currentPercent >= this.currentKey.time && currentPercent <= this.nextKey.time) {
            this.figure[this.property] = this._getCurrentValue(currentPercent);
            return;
        } else {

            if (currentPercent > this.nextKey.time) {
                this.currentKey = this.nextKey;
                this.nextKey = this.keyStack[this.currentKey.id + 1];
                this.applyCurrent(currentPercent);
                return;
            }
            if (currentPercent < this.currentKey.time) {
                this.nextKey = this.currentKey;
                this.currentKey = this.keyStack[this.currentKey.id - 1];
                this.applyCurrent(currentPercent);
            }
        }
    }

    reset() {
        this.currentKey = null;
        this.nextKey = null;
    }

    _getCurrentValue(currentPercent) {
        if (this.currentKey.timingFunctionType == 0) {
            //第一个类型是HOLD，就是不变
            return this.figure[this.property];
        }
        if (this.currentKey.timingFunctionType == 1) {
            //第2个类型是Linear
            let c = currentPercent - this.currentKey.time;
            // 允许Array类型
            if (this.currentKey.value instanceof Array) {
                let currentValue = new Array(this.currentKey.value.length);
                for (let i = 0; i < currentValue.length; i++) {
                    let deltas = this.currentKey.deltas;
                    if (deltas == null) {
                        deltas = new Array(currentValue.length);
                        this.currentKey.deltas = deltas;
                    }
                    deltas[i] = (this.nextKey.value[i] - this.currentKey.value[i]) / (this.nextKey.time - this.currentKey.time);
                    currentValue[i] = this.currentKey.value[i] + c * deltas[i];
                }
                return currentValue;
            } else {
                let delta = this.currentKey.delta;
                if (delta == null) {
                    delta = (this.nextKey.value - this.currentKey.value) / (this.nextKey.time - this.currentKey.time);
                    this.currentKey.delta = delta;
                }
                return this.currentKey.value + c * delta;
            }
        }
        if (this.currentKey.timingFunctionType == 2) {
            let bezierEasing = this.currentKey.bezierEasing;
            if (bezierEasing) {
                let t = (currentPercent - this.currentKey.time) / (this.nextKey.time - this.currentKey.time);
                let y = bezierEasing.easing(t);
                if (this.currentKey.value instanceof Array) {
                    let currentValue = new Array(this.currentKey.value.length);
                    for (let i = 0; i < currentValue.length; i++) {
                        currentValue[i] = this.currentKey.value[i] + y * (this.nextKey.value[i] - this.currentKey.value[i]);
                    }
                    return currentValue;
                } else {
                    return this.currentKey.value + y * (this.nextKey.value - this.currentKey.value);
                }
            }
        }
        return this.figure[this.property];
    }
}

/***/ }),

/***/ "./build/animation/animation.js":
/*!**************************************!*\
  !*** ./build/animation/animation.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Animation; });

class Animation {
    constructor(props = {}) {
        this.duration = props.duration;
        if (this.duration == null) this.duration = 0;
        this.fps = props.fps;
        if (this.fps == null) this.fps = 60;
        this.isLooping = props.isLooping;
        if (this.isLooping == null) this.isLooping = false;
        this.name = props.name;

        this.keyed = [];

        this._running = false;
        this.render = props.render;
        this.refreshCount = 0;
    }

    addKeyedAnimation(ani) {
        this.keyed.push(ani);
    }

    get isRunning() {
        return this._running;
    }

    applyAnimationState(percent) {
        let keyed = this.keyed;
        keyed.forEach(keyFrame => {
            keyFrame.applyCurrent(percent);
        });
    }

    start() {
        let render = this.render;
        if (!render) return;
        if (this._running) return Promise.reject('已经开始运行了');
        let total = this.duration * this.fps / 1000;
        let that = this;
        return new Promise((resolve, reject) => {
            let start = render.startRAF({
                beforeDraw() {
                    if (that.refreshCount > total) {
                        if (!that.isLooping) {
                            that.cancel(resolve);
                            return;
                        } else {
                            that.refreshCount = 0;
                        }
                    }
                    let percent = that.refreshCount / total;
                    that.applyAnimationState(percent);
                },
                afterDraw() {
                    that.refreshCount++;
                }
            });
            if (start) {
                this._running = true;
            }
        });
    }

    cancel(promiseCall) {
        let render = this.render;
        render.endRAF();
        this._running = false;
        this.refreshCount = 0;
        if (promiseCall) promiseCall();
    }

    pause() {
        let temp = this.refreshCount;
        this.cancel();
        this.refreshCount = temp;
    }

    /**
     * @deprecated
     */
    _resetKeyedFrames() {
        this.keyed.forEach(keyedFrame => {
            keyedFrame.reset();
        });
    }

}

/***/ }),

/***/ "./build/es5-graph/color.js":
/*!**********************************!*\
  !*** ./build/es5-graph/color.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
    function Color() {
        var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];

        _classCallCheck(this, Color);

        this._color;
        if (color.length == 3) {
            this._color = ['rgba(', color[0], ',', color[1], ',', color[2], ',', 1, ')'];
        }
        if (color.length == 4) {
            this._color = ['rgba(', color[0], ',', color[1], ',', color[2], ',', color[3], ')'];
        }
        this._colorString;
    }

    _createClass(Color, [{
        key: '_converColorValue',
        value: function _converColorValue(v) {
            if (v >= 0 && v <= 1) {
                return Math.floor(255 * v);
            }
            return v;
        }
    }, {
        key: 'setColor',
        value: function setColor(array, offset, includeAlpha) {
            this.r = array[offset];
            this.g = array[offset + 1];
            this.b = array[offset + 2];
            if (includeAlpha) {
                this.a = array[offset + 3];
            }
            return this._colorString == null;
        }
    }, {
        key: 'color',
        set: function set(array) {
            if (array instanceof Array) {
                this.setColor(array, 0, array.length == 4);
            }
        },
        get: function get() {
            if (this._colorString == null) {
                if (this._color[7] == 1) {
                    var r = this._color[1].toString(16);
                    if (r.length == 1) r = '0' + r;

                    var g = this._color[3].toString(16);
                    if (g.length == 1) g = '0' + g;

                    var b = this._color[5].toString(16);
                    if (b.length == 1) b = '0' + b;

                    this._colorString = '#' + r + g + b;
                } else this._colorString = this._color.join('');
            }
            return this._colorString;
        }
    }, {
        key: 'r',
        get: function get() {
            return this._color[1];
        },
        set: function set(r) {
            r = this._converColorValue(r);
            if (r != this._color[1]) {
                this._color[1] = r;
                this._colorString = null;
            }
        }
    }, {
        key: 'g',
        set: function set(r) {
            r = this._converColorValue(r);
            if (r != this._color[3]) {
                this._color[3] = r;
                this._colorString = null;
            }
        },
        get: function get() {
            return this._color[3];
        }
    }, {
        key: 'b',
        set: function set(r) {
            r = this._converColorValue(r);
            if (r != this._color[5]) {
                this._color[5] = r;
                this._colorString = null;
            }
        },
        get: function get() {
            return this._color[5];
        }
    }, {
        key: 'a',
        set: function set(r) {
            if (r != this._color[7]) {
                this._color[7] = r;
                this._colorString = null;
            }
        },
        get: function get() {
            return this._color[7];
        }
    }]);

    return Color;
}();

exports.default = Color;

/***/ }),

/***/ "./build/es5-graph/container.js":
/*!**************************************!*\
  !*** ./build/es5-graph/container.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _figure = __webpack_require__(/*! ./figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

var _color = __webpack_require__(/*! ./color.js */ "./build/es5-graph/color.js");

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 一个矩形的容器，能够绘制自身
 */
var Container = function (_Figure) {
    _inherits(Container, _Figure);

    function Container() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Container);

        var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

        _this.color = new _color2.default(props.color);
        return _this;
    }

    _createClass(Container, [{
        key: "applyDrawingStates",
        value: function applyDrawingStates(ctx) {
            _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), "applyDrawingStates", this).call(this, ctx);
            ctx.fillStyle = this.color.color;
        }
    }, {
        key: "drawSelf",
        value: function drawSelf(ctx, w, h) {
            ctx.beginPath();
            ctx.rect(0, 0, w, h);
            ctx.closePath();
            ctx.fill();
        }
    }]);

    return Container;
}(_figure2.default);

exports.default = Container;

/***/ }),

/***/ "./build/es5-graph/drawable.js":
/*!*************************************!*\
  !*** ./build/es5-graph/drawable.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformable = __webpack_require__(/*! ./transformable.js */ "./build/es5-graph/transformable.js");

var _transformable2 = _interopRequireDefault(_transformable);

var _utils = __webpack_require__(/*! ./utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Drawable = function (_Transformable) {
    _inherits(Drawable, _Transformable);

    function Drawable() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Drawable);

        var _this = _possibleConstructorReturn(this, (Drawable.__proto__ || Object.getPrototypeOf(Drawable)).call(this, props));

        _this.drawOrder = props.drawOrder;
        _this.name = props.name;
        _this.id = props.id;
        _this.blendMode = props.blendMode || 'source-over';
        _this._visible = props.visible;
        if (_this._visible == null) _this.visible = true;

        _this.clips = props.clips;
        return _this;
    }
    /// 属性 ////


    _createClass(Drawable, [{
        key: "addClip",


        /// 方法////

        value: function addClip(shape, intersect) {
            if (this.clips == null) this.clips = [];
            this.clips.push({ shape: shape, intersect: intersect });
        }

        /**
         * 是否可以绘制
         */

    }, {
        key: "canDraw",
        value: function canDraw() {
            return this.opacity != 0 && this.visible && this.scaleX != 0 && this.scaleY != 0;
        }
    }, {
        key: "applyDrawingStates",
        value: function applyDrawingStates(context) {
            context.globalAlpha = this.opacity;
            context.globalCompositeOperation = this.blendMode;
        }
    }, {
        key: "getClipRegion",
        value: function getClipRegion() {
            // TODO 有个问题没实现：
            // 在Canvas2d中，如果有多个Clips，只能剪切第一个，没剪切一次会替换上一次的剪切区域
            // 所以这里只使用数组中最后一个剪切区域
            // 但给出的剪切区域是多个，需要将多个图形作为一个剪切区域呢
            var region = void 0;
            if (this.clips) {
                region = this.clips[this.clips.length - 1];
            }
            if (region) return region;

            if (this._parent) {
                region = this._parent.getClipRegion();
            }
            return region;
        }
    }, {
        key: "_clipRegion",
        value: function _clipRegion(ctx, region) {
            var intersect = region.intersect;
            var shape = region.shape;
            if (shape.drawPaths == null) return;
            var path = shape.getShapePath(ctx);
            var m = shape.getWorldTransformMatrix();
            if (m == null) {
                return false;
            }
            if (path) {
                ctx.setTransform(m.toSVGMatrix());
                if (intersect) ctx.clip(path);else ctx.clip(path, 'evenodd');
            } else {
                ctx.beginPath(); //清空之前的path栈
                ctx.setTransform(m.toSVGMatrix());
                shape.drawPaths(ctx, shape.width, shape.height);
                ctx.closePath();
                if (intersect) ctx.clip();else ctx.clip('evenodd');
            }
            return true;
        }
    }, {
        key: "clip",
        value: function clip(ctx) {
            var region = this.getClipRegion();
            var lastClipRegion = ctx.lastClipRegion;
            if (region == null && lastClipRegion == null) {
                return true;
            }
            if (region != null && lastClipRegion != null) {
                if (region.shape == lastClipRegion.shape && region.intersect == lastClipRegion.intersect) {
                    // 如果是相同的剪切区域和相同的剪切方式，则不再剪切
                    return true;
                } else {
                    ctx.restore();
                    ctx.save();
                    ctx.lastClipRegion = region;
                    return this._clipRegion(ctx, region);
                }
            }
            if (region == null || lastClipRegion == null) {
                var r = region;
                r = r || lastClipRegion;
                ctx.lastClipRegion = r;
                ctx.restore();
                ctx.save();
                return this._clipRegion(ctx, r);
            }
            return false;
        }
    }, {
        key: "draw",
        value: function draw(context) {
            if (!this.canDraw()) return;
            if (this.name == 'star_fall_1') {
                console.log();
            }
            // 剪切区域保存给兄弟节点,子节点会继承剪切区域，并且通过对比查看是否需要剪切
            var notEmpty = this.clip(context);
            if (!notEmpty) {
                // 如果剪切区域是一个scale为0的区域，则说明图形绘制在一个没有大小的区域内
                // 则不需要绘制
                return;
            }
            var tempRegion = context.lastClipRegion;

            // 如果计算矩阵成功就进行绘制，否则就不绘制
            // 所谓计算成功是说，scale不为0
            if (this.applyCurrentTransform(context)) {
                context.save();
                this.applyDrawingStates(context);
                this.drawSelf(context, this.width, this.height);
                context.restore();
                this.drawChildren(context);
            }

            context.lastClipRegion = tempRegion;
        }
    }, {
        key: "drawChildren",
        value: function drawChildren(context) {
            this._children.forEach(function (child) {
                child.draw(context);
            });
        }

        /**
         * 应用当前矩阵变换。
         * @param {CanvasRenderingContext2D} context 
         */

    }, {
        key: "applyCurrentTransform",
        value: function applyCurrentTransform(context) {
            var matrix = this.getWorldTransformMatrix();
            if (matrix == null) return false;
            var data = matrix.data;
            // 这里注意，CanvasRenderingContext2D的参数（a,b,c,d,e,f）的transform数据对应矩阵和我自己的只有6个数的3x3矩阵：
            // a,c,e    a0 a1 a2
            // b,d,f => a3 a4 a5
            // 0,0,1    0  0  1
            // 所以我要给的参数是：(a0,a3,a1,a4,a2,a5)
            context.setTransform(data[0], data[3], data[1], data[4], data[2], data[5]);
            return true;
        }

        /**
         * 绘制自身,需要继承类复写。
         * 所有Drawable绘制都是从{0,0}点开始的，切勿使用自身的x和y，否则绘制结果会出问题
         * @param {CanvasRenderingContext2D} context 
         * @param {Number} width Figure绘制区域宽度
         * @param {Number} height Figure绘制区域高度
         */

    }, {
        key: "drawSelf",
        value: function drawSelf(context, width, height) {
            // 需要覆写
        }
    }, {
        key: "visible",
        get: function get() {
            return this._visible;
        },
        set: function set(v) {
            this._visible = v;
        }
    }]);

    return Drawable;
}(_transformable2.default);

exports.default = Drawable;

/***/ }),

/***/ "./build/es5-graph/entries.js":
/*!************************************!*\
  !*** ./build/es5-graph/entries.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _graph = __webpack_require__(/*! ./graph.js */ "./build/es5-graph/graph.js");

var _graph2 = _interopRequireDefault(_graph);

var _figure = __webpack_require__(/*! ./figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

var _circle = __webpack_require__(/*! ./shapes/circle.js */ "./build/es5-graph/shapes/circle.js");

var _circle2 = _interopRequireDefault(_circle);

var _polygon = __webpack_require__(/*! ./shapes/polygon.js */ "./build/es5-graph/shapes/polygon.js");

var _polygon2 = _interopRequireDefault(_polygon);

var _shape = __webpack_require__(/*! ./shapes/shape.js */ "./build/es5-graph/shapes/shape.js");

var _shape2 = _interopRequireDefault(_shape);

var _rectangle = __webpack_require__(/*! ./shapes/rectangle.js */ "./build/es5-graph/shapes/rectangle.js");

var _rectangle2 = _interopRequireDefault(_rectangle);

var _matrix = __webpack_require__(/*! ./math/matrix3.js */ "./build/es5-graph/math/matrix3.js");

var _matrix2 = _interopRequireDefault(_matrix);

var _text = __webpack_require__(/*! ./text/text.js */ "./build/es5-graph/text/text.js");

var _text2 = _interopRequireDefault(_text);

var _render = __webpack_require__(/*! ./render.js */ "./build/es5-graph/render.js");

var _render2 = _interopRequireDefault(_render);

var _flareJsonReader = __webpack_require__(/*! ./flare-json-reader.js */ "./build/es5-graph/flare-json-reader.js");

var _flareJsonReader2 = _interopRequireDefault(_flareJsonReader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = "0.0.1.202006040451";
var style = "color:red;background-color:yellow";

var outdefine = {
    version: version,
    Graph: _graph2.default,
    Figure: _figure2.default,
    Render: _render2.default,
    FlareJSONReader: _flareJsonReader2.default,
    shapes: {
        Circle: _circle2.default,
        Polygon: _polygon2.default,
        Shape: _shape2.default,
        Rectangle: _rectangle2.default
    },
    math: {
        Matrix3: _matrix2.default
    },
    text: {
        Text: _text2.default
    }
};
var out = {};
definedReadOnly(outdefine, out);

function definedReadOnly(maps, out) {
    var _loop = function _loop(p) {
        var v = maps[p];
        var v1 = v;
        if ((typeof v1 === "undefined" ? "undefined" : _typeof(v1)) == 'object') {
            v1 = {};
            definedReadOnly(v, v1);
        }
        Object.defineProperty(out, p, {
            get: function get() {
                return v1;
            }
        });
    };

    for (var p in maps) {
        _loop(p);
    }
}
var forWX = true;
var t = forWX ? ' 无Path2D版' : '';
console.log("%c Mulin" + t + "(version " + version + ") by 老脸", style);
exports.default = out;

/***/ }),

/***/ "./build/es5-graph/figure.js":
/*!***********************************!*\
  !*** ./build/es5-graph/figure.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _matrix = __webpack_require__(/*! ./math/matrix3.js */ "./build/es5-graph/math/matrix3.js");

var _matrix2 = _interopRequireDefault(_matrix);

var _utils = __webpack_require__(/*! ./utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _drawable = __webpack_require__(/*! ./drawable.js */ "./build/es5-graph/drawable.js");

var _drawable2 = _interopRequireDefault(_drawable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 绘制基类，定义了一些图形的基本属性，例如左上角坐标以及图形大小
 * 在绘制的时候采用迭代绘制子节点的方式
 */
var Figure = function (_Drawable) {
    _inherits(Figure, _Drawable);

    function Figure() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { anchorX: 0.5, anchorY: 0.5 };

        _classCallCheck(this, Figure);

        return _possibleConstructorReturn(this, (Figure.__proto__ || Object.getPrototypeOf(Figure)).call(this, params));
    }

    /**
     * 设置节点的的中心位置位于某个节点的中心 
     * 如果相对Figure参数为空，将会找到Figure的父节点
     */


    _createClass(Figure, [{
        key: "centerMe",
        value: function centerMe(relativeFigure) {
            if (relativeFigure == null) relativeFigure = this._parent;
            if (relativeFigure != null) {
                this.x = Math.floor((relativeFigure.width - this.width) / 2);
                this.y = Math.floor((relativeFigure.height - this.height) / 2);
            }
        }

        /**
         * Figure是否可以绘制
         */

    }, {
        key: "canDraw",
        value: function canDraw() {
            return this.width != 0 && this.height != 0 && _get(Figure.prototype.__proto__ || Object.getPrototypeOf(Figure.prototype), "canDraw", this).call(this);
        }

        /**
         * 获取该子节点的最顶层节点
         */

    }, {
        key: "getRoot",
        value: function getRoot() {
            var p = this;
            while (p._parent != null) {
                p = p._parent;
            }
            return p;
        }

        /**
         * 坐标x和y是否在Figure的区域内。
         * 
         * x,y的值是一个相对于Canvas的值，对于任何Figure来说都是绝对的。
         * Figure自身仅判断是否在{left,top,right,bottom}区域内，特殊的图形需要自己实现这一方法。
         * 
         * 如果x，y在Figure区域内，返回Figure对象。没有则返回Null。
         * 如果Figure有子节点，则需要判断x，y是否在子节点内，并且返回子节点对象。
         * @param {Number} x 
         * @param {Number} y 
         * @param {Matrix3} parentMatrix
         */

    }, {
        key: "pointInMe",
        value: function pointInMe(x, y, parentMatrix) {
            if (x == null || y == null) return null;
            //计算当前Figure的WorkdMatrix：
            var myMatrix = this._calculateTransformMatrix();
            var worldMatrix = _matrix2.default.IdentityMatrix();
            if (parentMatrix != null) {
                _matrix2.default.copyFrom(parentMatrix, worldMatrix);
                worldMatrix.multiply(myMatrix);
            } else {
                _matrix2.default.copyFrom(myMatrix, worldMatrix);
            }
            //计算变换后的四个顶点 (顺时针)
            var vertex = this.getVertex();
            for (var i = 0; i < vertex.length; i++) {
                worldMatrix.multiplyWithVertex(vertex[i], vertex[i]);
            }

            var isInside = _utils2.default.isPointInPolygon(x, y, vertex);
            if (!isInside) return null;

            var figure = this;
            for (var _i = this._children.length - 1; _i >= 0; _i--) {
                var c = this._children[_i];
                var cf = c.pointInMe(x, y, worldMatrix);
                if (cf != null) {
                    figure = cf;
                    break; // 因为靠前的figure就一个，在后面的figure不再计算判断
                }
            }

            return figure;
        }
        /**
         * 获得原Figure的顶点数组。默认是返回Figure绘制区域的四个顶点。
         * @returns {Array} 正常Figure的顶点，必须按照顺时针顺序组成数组放回
         */

    }, {
        key: "getVertex",
        value: function getVertex() {
            return [[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]];
        }
    }]);

    return Figure;
}(_drawable2.default);

exports.default = Figure;

/***/ }),

/***/ "./build/es5-graph/flare-json-reader.js":
/*!**********************************************!*\
  !*** ./build/es5-graph/flare-json-reader.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _container = __webpack_require__(/*! ./container.js */ "./build/es5-graph/container.js");

var _container2 = _interopRequireDefault(_container);

var _utils = __webpack_require__(/*! ./utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _shape5 = __webpack_require__(/*! ./shapes/shape.js */ "./build/es5-graph/shapes/shape.js");

var _shape6 = _interopRequireDefault(_shape5);

var _ellipsePath = __webpack_require__(/*! ./shapes/ellipse-path.js */ "./build/es5-graph/shapes/ellipse-path.js");

var _ellipsePath2 = _interopRequireDefault(_ellipsePath);

var _animation = __webpack_require__(/*! ../animation/animation.js */ "./build/animation/animation.js");

var _animation2 = _interopRequireDefault(_animation);

var _animationPropertyKey = __webpack_require__(/*! ../animation/animation-property-key.js */ "./build/animation/animation-property-key.js");

var _animationPropertyKey2 = _interopRequireDefault(_animationPropertyKey);

var _path4 = __webpack_require__(/*! ./shapes/path.js */ "./build/es5-graph/shapes/path.js");

var _path5 = _interopRequireDefault(_path4);

var _point = __webpack_require__(/*! ./shapes/point.js */ "./build/es5-graph/shapes/point.js");

var _point2 = _interopRequireDefault(_point);

var _group = __webpack_require__(/*! ./group.js */ "./build/es5-graph/group.js");

var _group2 = _interopRequireDefault(_group);

var _radicalGradientColor = __webpack_require__(/*! ./radical-gradient-color.js */ "./build/es5-graph/radical-gradient-color.js");

var _radicalGradientColor2 = _interopRequireDefault(_radicalGradientColor);

var _linearGradientColor = __webpack_require__(/*! ./linear-gradient-color.js */ "./build/es5-graph/linear-gradient-color.js");

var _linearGradientColor2 = _interopRequireDefault(_linearGradientColor);

var _rectanglePath = __webpack_require__(/*! ./shapes/rectangle-path.js */ "./build/es5-graph/shapes/rectangle-path.js");

var _rectanglePath2 = _interopRequireDefault(_rectanglePath);

var _strokeStyle = __webpack_require__(/*! ./shapes/paint-style/stroke-style.js */ "./build/es5-graph/shapes/paint-style/stroke-style.js");

var _strokeStyle2 = _interopRequireDefault(_strokeStyle);

var _fillStyle3 = __webpack_require__(/*! ./shapes/paint-style/fill-style.js */ "./build/es5-graph/shapes/paint-style/fill-style.js");

var _fillStyle4 = _interopRequireDefault(_fillStyle3);

var _starPath = __webpack_require__(/*! ./shapes/star-path.js */ "./build/es5-graph/shapes/star-path.js");

var _starPath2 = _interopRequireDefault(_starPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlareJSONReader = function () {
    function FlareJSONReader() {
        _classCallCheck(this, FlareJSONReader);
    }

    _createClass(FlareJSONReader, null, [{
        key: "readJSONObject",
        value: function readJSONObject(obj) {
            var _this = this;

            var containers = [];

            obj.artboards.forEach(function (artboard) {
                if (artboard.type == 'artboard') {
                    var tempstack = new Array(artboard.nodes.length);
                    var container = new _container2.default({
                        x: artboard.translation[0],
                        y: artboard.translation[1],
                        width: artboard.width,
                        height: artboard.height,
                        color: _utils2.default.converColorArray(artboard.color),
                        opacity: artboard.opacity
                    });

                    var renderObj = _this.readNodes(artboard, container, tempstack);
                    _this.initClips(container, tempstack);
                    containers.push({ render: renderObj, artboard: container, animations: _this.readAnimations(artboard, tempstack) });
                }
            });
            return containers;
        }
    }, {
        key: "read",
        value: function read(content) {
            var obj = JSON.parse(content);
            return this.readJSONObject(obj);
        }
    }, {
        key: "initClips",
        value: function initClips(container, tempstack) {
            var _this2 = this;

            if (container.clips) {
                for (var i = 0; i < container.clips.length; i++) {
                    var id = container.clips[i].node;
                    container.clips[i].shape = tempstack[id];
                    delete container.clips[i].node;
                }
            }
            container.children.forEach(function (child) {
                _this2.initClips(child, tempstack);
            });
        }
    }, {
        key: "getPropertyName",
        value: function getPropertyName(p) {
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
    }, {
        key: "readKeyed",
        value: function readKeyed(keyed, animation, tempstack) {
            var _this3 = this;

            keyed.forEach(function (key) {
                var figure = void 0;
                for (var p in key) {
                    if (p == 'component') {
                        figure = tempstack[key[p]];
                    } else {
                        if (figure) {
                            var propertyName = _this3.getPropertyName(p);
                            if (propertyName && propertyName in figure) {
                                (function () {
                                    var array = key[p];
                                    var propertyAnimation = new _animationPropertyKey2.default({
                                        figure: figure,
                                        property: propertyName
                                    });
                                    array.forEach(function (keyFrames) {
                                        keyFrames.forEach(function (keyFrame) {
                                            keyFrame.time *= 1000;
                                            // keyframe的时间值是一个百分比
                                            if (animation.duration == 0) keyFrame.time = 0;else keyFrame.time = keyFrame.time / animation.duration;
                                            propertyAnimation.addKeyFrame(keyFrame);
                                        });
                                    });
                                    animation.addKeyedAnimation(propertyAnimation);
                                })();
                            }
                        }
                    }
                }
            });
        }
    }, {
        key: "readAnimations",
        value: function readAnimations(artboard, tempstack) {
            var _this4 = this;

            var animations = artboard.animations;
            var anims = [];
            animations.forEach(function (animation) {
                var ani = new _animation2.default(animation);
                ani.duration *= 1000;
                _this4.readKeyed(animation.keyed, ani, tempstack);
                anims.push(ani);
            });
            return anims;
        }
    }, {
        key: "readPathPoints",
        value: function readPathPoints(path, points) {
            points.forEach(function (point) {
                path.addPoint(new _point2.default({
                    type: point.pointType,
                    x: point.translation[0],
                    y: point.translation[1],
                    in: point.in,
                    out: point.out
                }));
            });
        }
    }, {
        key: "readNodes",
        value: function readNodes(artboard, container, tempstack) {
            var nodes = artboard.nodes;
            var renderObj = [];
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.type == 'node') {
                    var group = new _group2.default({
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
                    var parent = container;
                    if (node.parent != null) {
                        parent = tempstack[node.parent];
                    }
                    parent.addChild(group);
                    tempstack[i] = group;
                }
                if (node.type == 'shape') {
                    var shape = new _shape6.default({
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
                    var _parent = container;
                    if (node.parent != null) {
                        _parent = tempstack[node.parent];
                    }
                    renderObj.push(shape);
                    _parent.addChild(shape);
                    tempstack[i] = shape;
                }

                if (node.type == 'ellipse') {
                    var _parent2 = tempstack[node.parent];
                    // ellipse的translation是以中心开始的，这里要转一下：
                    var path = new _ellipsePath2.default({
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
                    _parent2.addPath(path);
                }

                if (node.type == 'rectangle') {
                    var _parent3 = tempstack[node.parent];
                    var _path = new _rectanglePath2.default({
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
                        radius: node.cornerRadius
                    });
                    tempstack[i] = _path;
                    _parent3.addPath(_path);
                }

                if (node.type == 'star') {
                    var _parent4 = tempstack[node.parent];
                    var _path2 = new _starPath2.default({
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
                    tempstack[i] = _path2;
                    _parent4.addPath(_path2);
                }

                if (node.type == 'path') {
                    var _parent5 = tempstack[node.parent];
                    var _path3 = new _path5.default({
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
                    this.readPathPoints(_path3, node.points);
                    tempstack[i] = _path3;
                    _parent5.addPath(_path3);
                }

                if (node.type == 'colorStroke') {
                    var _shape = tempstack[node.parent];
                    var strokeStyle = new _strokeStyle2.default({
                        cap: node.cap,
                        join: node.join,
                        width: node.width,
                        opacity: node.opacity,
                        start: node.start,
                        end: node.end,
                        offset: node.offset,
                        color: _utils2.default.converColorArray(node.color),
                        name: node.name,
                        id: i
                    });
                    tempstack[i] = strokeStyle;
                    _shape.addStrokeStyle(strokeStyle);
                }

                if (node.type == 'colorFill') {
                    var _shape2 = tempstack[node.parent];
                    var fillStyle = new _fillStyle4.default({
                        opacity: node.opacity,
                        color: _utils2.default.converColorArray(node.color),
                        name: node.name,
                        id: i,
                        fillRule: node.fillRule
                    });
                    tempstack[i] = fillStyle;
                    _shape2.addFillStyle(fillStyle);
                }

                if (node.type == 'gradientFill') {
                    var _shape3 = tempstack[node.parent];
                    var values = [node.start[0], node.start[1], node.end[0], node.end[1]];
                    values = values.concat(node.colorStops);
                    var linearGradientColor = new _linearGradientColor2.default(values);
                    var _fillStyle = new _fillStyle4.default({
                        gradientColor: linearGradientColor,
                        opacity: node.opacity,
                        name: node.name,
                        id: i,
                        fillRule: node.fillRule
                    });
                    tempstack[i] = _fillStyle;
                    _shape3.addFillStyle(_fillStyle);
                }

                if (node.type == 'radialGradientFill') {
                    var _shape4 = tempstack[node.parent];
                    var _values = [node.secondaryRadiusScale, node.start[0], node.start[1], node.end[0], node.end[1]];
                    _values = _values.concat(node.colorStops);
                    var radicalGradientColor = new _radicalGradientColor2.default(_values);
                    var _fillStyle2 = new _fillStyle4.default({
                        gradientColor: radicalGradientColor,
                        opacity: node.opacity,
                        name: node.name,
                        fillRule: node.fillRule,
                        id: i
                    });
                    tempstack[i] = _fillStyle2;
                    _shape4.addFillStyle(_fillStyle2);
                }
            }

            return renderObj;
        }
    }]);

    return FlareJSONReader;
}();

exports.default = FlareJSONReader;

/***/ }),

/***/ "./build/es5-graph/gradient-color.js":
/*!*******************************************!*\
  !*** ./build/es5-graph/gradient-color.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _color = __webpack_require__(/*! ./color.js */ "./build/es5-graph/color.js");

var _color2 = _interopRequireDefault(_color);

var _utils = __webpack_require__(/*! ./utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GradientColor = function () {
    function GradientColor() {
        var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, GradientColor);

        this._colorStops;
        this._gradient;
        this.values = values;
    }

    _createClass(GradientColor, [{
        key: "_createGradient",
        value: function _createGradient(ctx) {}
    }, {
        key: "getGradient",
        value: function getGradient(ctx) {
            var _this = this;

            if (this._gradient == null) {
                this._gradient = this._createGradient(ctx);
                this._colorStops.forEach(function (stop) {
                    _this._gradient.addColorStop(stop[0], stop[1].color);
                });
            }
            return this._gradient;
        }
    }, {
        key: "addColorStop",
        value: function addColorStop(offset, color) {
            if (this._colorStops == null) {
                this._colorStops = [];
            }
            this._colorStops.push([offset, color]);
            this._gradient = null;
        }
    }, {
        key: "setColorStop",
        value: function setColorStop(index, offset, color) {
            var m = this._colorStops[index];
            if (m) {
                m[0] = offset;
                m[1] = color;
                this._gradient = null;
            }
        }
    }, {
        key: "colorStopValuesOffset",
        get: function get() {
            return 4;
        }
    }, {
        key: "coordOffset",
        get: function get() {
            return 0;
        }
    }, {
        key: "start",
        set: function set(v) {
            if (v instanceof Array) {
                var offset = this.coordOffset;
                if (this._values[offset] != v[0] || this._values[offset + 1] != v[1]) {
                    this._values[offset] = v[0];
                    this._values[offset + 1] = v[1];
                    this._gradient = null;
                }
            }
        }

        // get start() { return [this._values[0], this._values[1]]; }

    }, {
        key: "end",
        set: function set(v) {
            if (v instanceof Array) {
                var offset = this.coordOffset;
                if (this._values[offset + 2] != v[0] || this._values[offset + 3] != v[1]) {
                    this._values[offset + 2] = v[0];
                    this._values[offset + 3] = v[1];
                    this._gradient = null;
                }
            }
        }

        // get end() { return this._end; }

    }, {
        key: "values",
        set: function set(array) {
            if (array instanceof Array) {
                var stopOffset = this.colorStopValuesOffset;
                if ((array.length - stopOffset) % 5 == 0) {
                    if (this._values == null) {
                        this._values = array;
                    }
                    var values = this._values;
                    var coordOffset = this.coordOffset;
                    if (array[coordOffset] != values[coordOffset] || array[coordOffset + 1] != values[1 + coordOffset] || array[coordOffset + 2] != values[2 + coordOffset] || array[coordOffset + 3] != values[3 + coordOffset]) {
                        for (var i = 0; i < 4; i++) {
                            values[i + coordOffset] = array[i + coordOffset];
                        }this._gradient = null;
                    }
                    var stopLength = Math.floor((array.length - stopOffset) / 5);
                    for (var _i = 0; _i < stopLength; _i++) {
                        var index = _i * 5 + stopOffset;
                        if (this._colorStops == null) {
                            this._colorStops = new Array(stopLength);
                        }
                        var stop = this._colorStops[_i];
                        if (!stop) {
                            this._colorStops[_i] = new Array(2);
                            this._colorStops[_i][0] = array[index + 4];
                            this._colorStops[_i][1] = new _color2.default(_utils2.default.converColorArray([array[index], array[index + 1], array[index + 2], array[index + 3]]));
                            continue;
                        }
                        var offset = stop[0];
                        var color = stop[1];
                        var r = array[index];
                        if (color.setColor(array, index, true)) {
                            this._gradient = null;
                        }
                        if (array[index + 4] != offset) {
                            stop[0] = offset;
                            this._gradient = null;
                        }
                    }
                } else {
                    console.warn('gradient颜色的array数据结构不正确');
                }
            }
        },
        get: function get() {
            return this._values;
        }
    }]);

    return GradientColor;
}();

exports.default = GradientColor;

/***/ }),

/***/ "./build/es5-graph/graph.js":
/*!**********************************!*\
  !*** ./build/es5-graph/graph.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _figure = __webpack_require__(/*! ./figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @deprecated
 * 不再有Graph了
 */
var Graph = function (_Figure) {
    _inherits(Graph, _Figure);

    function Graph() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Graph);

        return _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, props));
    }

    return Graph;
}(_figure2.default);

exports.default = Graph;

/***/ }),

/***/ "./build/es5-graph/group.js":
/*!**********************************!*\
  !*** ./build/es5-graph/group.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _drawable = __webpack_require__(/*! ./drawable.js */ "./build/es5-graph/drawable.js");

var _drawable2 = _interopRequireDefault(_drawable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Group = function (_Drawable) {
    _inherits(Group, _Drawable);

    function Group() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { anchorX: 0, anchorY: 0 };

        _classCallCheck(this, Group);

        return _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, props));
    }

    return Group;
}(_drawable2.default);

exports.default = Group;

/***/ }),

/***/ "./build/es5-graph/linear-gradient-color.js":
/*!**************************************************!*\
  !*** ./build/es5-graph/linear-gradient-color.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gradientColor = __webpack_require__(/*! ./gradient-color.js */ "./build/es5-graph/gradient-color.js");

var _gradientColor2 = _interopRequireDefault(_gradientColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinearGradientColor = function (_GradientColor) {
    _inherits(LinearGradientColor, _GradientColor);

    function LinearGradientColor() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LinearGradientColor);

        return _possibleConstructorReturn(this, (LinearGradientColor.__proto__ || Object.getPrototypeOf(LinearGradientColor)).call(this, props));
    }

    _createClass(LinearGradientColor, [{
        key: "_createGradient",
        value: function _createGradient(ctx) {
            return ctx.createLinearGradient(this.values[0], this.values[1], this.values[2], this.values[3]);
        }
    }]);

    return LinearGradientColor;
}(_gradientColor2.default);

exports.default = LinearGradientColor;

/***/ }),

/***/ "./build/es5-graph/math/matrix3.js":
/*!*****************************************!*\
  !*** ./build/es5-graph/math/matrix3.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _TEMP = null;
var _TEMP2 = null;

/**
 * 只有两列数据的3x3矩阵。反正最后一列是固定的
 */

var Matrix3 = function () {
    function Matrix3() {
        var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Float32Array(6);

        _classCallCheck(this, Matrix3);

        this._array = array;
        this.identity();
    }
    /**
     * 是否是一个单位矩阵。
     * 有时候判断这6个数比乘一次矩阵要快很多
     */


    _createClass(Matrix3, [{
        key: "isIdentity",
        value: function isIdentity() {
            var data = this._array;
            return data[0] == 1 && data[1] == 0 && data[2] == 0 && data[3] == 0 && data[4] == 1 && data[5] == 0;
        }

        /** 这个方法仅允许我使用 */

    }, {
        key: "clone",
        value: function clone() {
            var matrix = new Matrix3();
            var data = this.data;
            var out = matrix.data;
            for (var i = 0; i < data.length; i++) {
                out[i] = data[i];
            }
            return matrix;
        }
    }, {
        key: "from",
        value: function from(m) {
            var data = this.data;
            var from = m.data;
            for (var i = 0; i < data.length; i++) {
                data[i] = from[i];
            }
        }
    }, {
        key: "identity",
        value: function identity() {
            var out = this._array;
            out[0] = 1, out[1] = 0, out[2] = 0;
            out[3] = 0, out[4] = 1, out[5] = 0;
            return this;
        }
    }, {
        key: "rotate",
        value: function rotate(radian) {
            // let m = this.data;
            var c = Math.cos(radian);
            var s = Math.sin(radian);
            // m[0] = c, m[1] = -s, m[2] = 0;
            // m[3] = s, m[4] = c, m[5] = 0;
            this.multiplyWithDatas(c, s, -s, c, 0, 0);
            return this;
        }
    }, {
        key: "scale",
        value: function scale(scalex, scaley) {
            // let m = this.data;
            // m[0] = scalex, m[1] = 0, m[2] = 0;
            // m[3] = 0, m[4] = scaley, m[5] = 0;
            this.multiplyWithDatas(scalex, 0, 0, scaley, 0, 0);
            return this;
        }
    }, {
        key: "translate",
        value: function translate(x, y) {
            // let m = this.data;
            // m[0] = 1, m[1] = 0, m[2] = x;
            // m[3] = 0, m[4] = 1, m[5] = y;
            this.multiplyWithDatas(1, 0, 0, 1, x, y);
            return this;
        }
    }, {
        key: "multiplyWithVertexDatas",
        value: function multiplyWithVertexDatas(x, y, out) {
            if (out == null) out = new Float32Array(2);
            var a = this.data;
            out[0] = a[0] * x + a[1] * y + a[2]; // z补位是1
            out[1] = a[3] * x + a[4] * y + a[5];
            return out;
        }
    }, {
        key: "multiplyWithVertex",
        value: function multiplyWithVertex(p, out) {
            return this.multiplyWithVertexDatas(p[0], p[1], out);
        }
    }, {
        key: "multiplyWithDatas",
        value: function multiplyWithDatas(b00, b01, b10, b11, b20, b21) {
            var a = this.data;
            var out = this.data;
            var a00 = a[0],
                a01 = a[3]; //, a02 = a[2];
            var a10 = a[1],
                a11 = a[4]; //, a12 = a[5];
            var a20 = a[2],
                a21 = a[5]; //, a22 = a[8];

            out[0] = b00 * a00 + b01 * a10; // + b02 * a20;
            out[3] = b00 * a01 + b01 * a11; // + b02 * a21;
            // out[2] = 0;//b00 * a02 + b01 * a12 + b02 * a22;

            out[1] = b10 * a00 + b11 * a10; // + b12 * a20;
            out[4] = b10 * a01 + b11 * a11; // + b12 * a21;
            // out[5] = 0;//b10 * a02 + b11 * a12 + b12 * a22;

            out[2] = b20 * a00 + b21 * a10 + a20; // b22 * a20;
            out[5] = b20 * a01 + b21 * a11 + a21; //b22 * a21;
            // out[8] = 1;//b20 * a02 + b21 * a12 + b22 * a22;
            return this;
        }

        /**
         * 和一个3x3的6个数据矩阵相乘
         * @param {Matrix3} m 
         */

    }, {
        key: "multiply",
        value: function multiply(m) {
            var b = m.data;
            return this.multiplyWithDatas(b[0], b[3], b[1], b[4], b[2], b[5]);
            // let b00 = b[0], b01 = b[3];// b02 = b[2];
            // let b10 = b[1], b11 = b[4];// b12 = b[5];
            // let b20 = b[2], b21 = b[5];// b22 = b[8];
        }
        /**
         * 有病
         */

    }, {
        key: "toSVGMatrix",
        value: function toSVGMatrix() {
            var data = this.data;
            return { a: data[0], b: data[3], c: data[1], d: data[4], e: data[2], f: data[5] };
        }
    }, {
        key: "data",
        get: function get() {
            return this._array;
        }
    }], [{
        key: "copyFrom",
        value: function copyFrom(from, to) {
            var t = to.data;
            var f = from.data;
            t[0] = f[0];
            t[1] = f[1];
            t[2] = f[2];
            t[3] = f[3];
            t[4] = f[4];
            t[5] = f[5];
        }
    }, {
        key: "IdentityMatrix",
        value: function IdentityMatrix(out) {
            if (out == null) out = new Float32Array(6);
            var m3 = new Matrix3(out);
            return m3.identity();
        }
    }, {
        key: "TEMP",
        get: function get() {
            if (_TEMP == null) {
                _TEMP = new Matrix3();
                _TEMP.identity();
            }
            return _TEMP;
        }

        /** 这个方法仅允许我使用 */

    }, {
        key: "TEMP2",
        get: function get() {
            if (_TEMP2 == null) {
                _TEMP2 = new Matrix3();
                _TEMP.identity();
            }
            return _TEMP2;
        }
    }]);

    return Matrix3;
}();

exports.default = Matrix3;

/***/ }),

/***/ "./build/es5-graph/radical-gradient-color.js":
/*!***************************************************!*\
  !*** ./build/es5-graph/radical-gradient-color.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gradientColor = __webpack_require__(/*! ./gradient-color.js */ "./build/es5-graph/gradient-color.js");

var _gradientColor2 = _interopRequireDefault(_gradientColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadicalGradientColor = function (_GradientColor) {
    _inherits(RadicalGradientColor, _GradientColor);

    function RadicalGradientColor() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, RadicalGradientColor);

        return _possibleConstructorReturn(this, (RadicalGradientColor.__proto__ || Object.getPrototypeOf(RadicalGradientColor)).call(this, props));
    }

    _createClass(RadicalGradientColor, [{
        key: "_createGradient",
        value: function _createGradient(ctx) {
            var dx = this.values[1] - this.values[3];
            var dy = this.values[2] - this.values[4];
            var radialGradient = ctx.createRadialGradient(this.values[1], this.values[2], 0, this.values[1], this.values[2], Math.sqrt(dx * dx + dy * dy));
            return radialGradient;
        }
    }, {
        key: "colorStopValuesOffset",
        get: function get() {
            return 5;
        }
    }, {
        key: "coordOffset",
        get: function get() {
            return 1;
        }
    }]);

    return RadicalGradientColor;
}(_gradientColor2.default);

exports.default = RadicalGradientColor;

/***/ }),

/***/ "./build/es5-graph/render.js":
/*!***********************************!*\
  !*** ./build/es5-graph/render.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _figure = __webpack_require__(/*! ./figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

var _utils = __webpack_require__(/*! ./utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 */
var Render = function () {
    function Render(canvas) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Render);

        if (canvas == null) throw new Error('Canvas不能为空');
        var ctx = canvas.getContext('2d');
        if (ctx == null) throw new Error('很遗憾,当前设备不支持Canvas2d。或者你看看是不是传入的canvas错了？');

        this._tempCanvas = params['tempCanvas'];
        this.keep = params['keep'];
        this.width = params['canvasWidth'] || canvas._width; // 这tm才是style的大小,找大半天
        if (this.width == null) this.width = canvas.clientWidth;
        this.height = params['canvasHeight'] || canvas._height;
        if (this.height == null) this.height = canvas.clientWidth;

        // graph节点的高度和宽度不能根据pixelRatio调整
        // 调整canvas在内存的实际大小
        canvas.width = _utils2.default.DRP * this.width;
        canvas.height = _utils2.default.DRP * this.height;
        if (window) {
            // 如果是在浏览器端
            canvas.style.width = this.width + 'px';
            canvas.style.height = this.height + 'px';
        }
        this.ctx = ctx;
        this.ctx.wx_canvas = canvas; //我服了，到处要使用canvas的地方
        this.canvas = canvas;
        // 伸缩自身，因为canvas内存大小都变了
        // this.anchorY = 0;
        // this.anchorX = 0;
        // this.scaleX = utils.DRP;
        // this.scaleY = utils.DRP;
        this._rafId, this._rafUpdateId;
        this.renderQueue = [];
        this.animations = [];
        this._runningAnimation;
    }

    _createClass(Render, [{
        key: "startAnimation",
        value: function startAnimation() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var animation = this.animations[index];
            if (!animation) return Promise.reject('没有找到对应动画');
            animation.render = this;
            this._runningAnimation = animation;
            return animation.start();
        }
    }, {
        key: "pauseAnimation",
        value: function pauseAnimation() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var animation = this.animations[index];
            if (!animation) return;
            animation.render = this;
            animation.pause();
        }
    }, {
        key: "pauseRunningAnimation",
        value: function pauseRunningAnimation() {
            if (this._runningAnimation && this._runningAnimation.isRunning) {
                this._runningAnimation.pause();
            }
        }
    }, {
        key: "cancelAnimation",
        value: function cancelAnimation() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var handleCall = arguments[1];

            var animation = this.animations[index];
            if (!animation) {
                if (handleCall) handleCall();
                return;
            };
            animation.render = this;
            animation.cancel(handleCall);
            this._runningAnimation = null;
        }
    }, {
        key: "cancelRunningAnimation",
        value: function cancelRunningAnimation(handleCall) {
            if (this._runningAnimation && this._runningAnimation.isRunning) {
                this._runningAnimation.cancel(handleCall);
                this._runningAnimation = null;
            } else {
                if (handleCall) handleCall();
            }
        }
    }, {
        key: "getRunningAnimationIndex",
        value: function getRunningAnimationIndex() {
            if (!this._runningAnimation) return -1;
            return this.animations.indexOf(this._runningAnimation);
        }
    }, {
        key: "createRoot",
        value: function createRoot() {
            return new _figure2.default({
                anchroX: 0, anchroY: 0,
                scaleX: _utils2.default.DRP,
                scaleY: _utils2.default.DRP,
                width: this.width,
                height: this.height
            });
        }
    }, {
        key: "addRenderNode",
        value: function addRenderNode(node) {
            this.renderQueue.push(node);
        }
    }, {
        key: "sort",
        value: function sort() {
            this.renderQueue.sort(function (a, b) {
                if (a.drawOrder == null || b.drawOrder == null) return 0;
                return a.drawOrder - b.drawOrder;
            });
        }

        // 不再迭代绘制子节点,而是绘制队列

    }, {
        key: "drawQueue",
        value: function drawQueue(ctx) {
            this.renderQueue.forEach(function (child) {
                child.draw(ctx);
            });
        }
    }, {
        key: "createImage",
        value: function createImage(params) {
            if (params == null) return null;
            var src = params['src'];
            var onload = params['onload'];
            var onerror = params['onerror'];
            if (src == null) {
                if (onerror) onerror('src不能为空');
                return;
            }
            var img = this.canvas.createImage();
            img.onload = function () {
                if (onload) onload(img);
            };
            img.onerror = onerror;
            img.src = src;
        }

        /**
         * 因为微信小程序的image对象需要从canvas创建，于是为了方便，我就只能从Graph节点定义一个方法来创建一个ImageFigure对象咯。
         * 参数是一个Map对象。
         * @param {Map<String,String>} params {src : 图片路径，可以是网络图片或者临时文件路径，
         * 也可以是项目内的路径;onload : 图片加载成功后会创建一个ImageFigure对象，并将这个对象作为唯一参数回调该方法；
         * onerror : 图片加载失败后回调;
         * width:创建的ImageFigure绘制区域宽度
         * height:创建的ImageFigure绘制区域高度
         * }
         */

    }, {
        key: "createImageFigure",
        value: function createImageFigure(params) {
            if (params == null) return null;
            var src = params['src'];
            var _onload = params['onload'];
            var _onerror = params['onerror'];
            var width = params['width'] == null ? 0 : params['width'];
            var height = params['height'] == null ? 0 : params['height'];
            var tempCanvas = this._tempCanvas;
            this.createImage({
                src: src,
                onload: function onload(img) {
                    if (_onload) {
                        var imageFigure = new ImageFigure({
                            mode: params['mode'],
                            image: img,
                            width: width, height: height,
                            tempCanvas: tempCanvas
                        });
                        _onload(imageFigure);
                    }
                },
                onerror: function onerror() {
                    if (_onerror) _onerror('图片加载错误,输入路径为 ：' + src);
                }
            });
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            if (this.keep == null) {
                // 如果不保存之前绘制结果就直接清除
                ctx.clearRect(0, 0, this.width * _utils2.default.DRP, this.height * _utils2.default.DRP);
            }
            ctx.lastClipRegion = null;
            ctx.save();
            this.drawQueue(ctx);
            ctx.restore();
        }

        /**
         * 调用此方法，Graph会利用requestAnimationFrame定时重绘。如果已经开始了定时重绘，则调用该方法无效。
         * 方法参数中可以定义两个方法，一个是beforeDraw,传入方法会在每次绘制之前调用；
         * 另一个是afterDraw,该传入方法会在每次绘制结束后调用。
         * 这两个通常可以用来对Figure进行一些修改，以达到某些显示更新后Figure的目的，比如移动、旋转某Figure。
         * 但是由于性能问题，该方法尽量在需要时开启，达到目的后用endRAF方法停止
         * @param {Map<String,Function>} params 
         * @param {Boolean} 是否开始成功
         */

    }, {
        key: "startRAF",
        value: function startRAF(params) {
            if (this._rafId == null) {
                var _refresh = function _refresh() {
                    if (beforeDraw) beforeDraw();
                    that.update(false);
                    if (afterDraw) afterDraw();

                    if (that._stopRAF) {
                        that._stopRAF = false;
                        that._rafId = null;
                        return;
                    }
                    that._rafId = _utils2.default.requestAnimationFrame(canvas, _refresh);
                    // that._rafId = canvas.requestAnimationFrame(refresh);
                };

                this._stopRAF = false;
                var beforeDraw = void 0,
                    afterDraw = void 0;
                if (params) {
                    beforeDraw = params['beforeDraw'];
                    afterDraw = params['afterDraw'];
                }
                var canvas = this.canvas;
                var that = this;
                _refresh();

                return true;
            }
            return false;
        }

        /**
         * 取消定时刷新
         */

    }, {
        key: "endRAF",
        value: function endRAF() {
            if (this._rafId != null) {
                _utils2.default.cancelAnimationFrame(this.canvas, this._rafId);
                this._rafId = null;
                this._stopRAF = true;
            }
        }

        /**
         * 重绘整个Graph。带入参数如果为true，则会将绘制压入rAF中；为false立即开始绘制。参数默认值为true
         * @param {Boolean} raf 默认值true
         */

    }, {
        key: "update",
        value: function update() {
            var raf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var afterUpdate = arguments[1];

            if (raf) {
                var ctx = this.ctx;
                var that = this;
                if (this._rafUpdateId) {
                    _utils2.default.cancelAnimationFrame(this.canvas, this._rafUpdateId);
                }
                this._rafUpdateId = _utils2.default.requestAnimationFrame(this.canvas, function () {
                    that.draw(ctx);
                    that._rafUpdateId = null;
                    if (afterUpdate) afterUpdate();
                });
            } else this.draw(this.ctx);
        }
    }, {
        key: "rAFisRunning",
        get: function get() {
            return this._rafId != null;
        }
    }]);

    return Render;
}();

exports.default = Render;

/***/ }),

/***/ "./build/es5-graph/shapes/circle.js":
/*!******************************************!*\
  !*** ./build/es5-graph/shapes/circle.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _shape = __webpack_require__(/*! ./shape.js */ "./build/es5-graph/shapes/shape.js");

var _shape2 = _interopRequireDefault(_shape);

var _ellipsePath = __webpack_require__(/*! ./ellipse-path.js */ "./build/es5-graph/shapes/ellipse-path.js");

var _ellipsePath2 = _interopRequireDefault(_ellipsePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = function (_Shape) {
    _inherits(Circle, _Shape);

    function Circle() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Circle);

        var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, params));

        _this._circlePath = new _ellipsePath2.default(); //加一个圆形path进去
        _this._radius = params['radius'] == null ? 0 : params['radius'];
        _this._circlePath.width = _this._radius * 2;
        _this._circlePath.height = _this._circlePath.width;
        _this._angle = params['angle'] == null ? 360 : params['angle'];
        _this._center;
        _this.addPath(_this._circlePath);
        return _this;
    }
    // 不允许再设置宽度和高度，统一设置半径


    _createClass(Circle, [{
        key: "canDraw",
        value: function canDraw() {
            return _get(Circle.prototype.__proto__ || Object.getPrototypeOf(Circle.prototype), "canDraw", this).call(this) && this.radius != 0;
        }
    }, {
        key: "width",
        set: function set(v) {},
        get: function get() {
            return this.radius * 2;
        }
    }, {
        key: "height",
        set: function set(v) {},
        get: function get() {
            return this.radius * 2;
        }
    }, {
        key: "angle",
        get: function get() {
            return this._angle;
        },
        set: function set(v) {
            if (this._angle != v) {
                this._angle = v;
                if (Math.abs(this._angle) >= 360) {
                    if (this._angle < 0) this._angle = -360;else this._angle = 360;
                }
            }
        }
    }, {
        key: "radius",
        get: function get() {
            return this._radius;
        },
        set: function set(v) {
            if (this._radius != v) {
                this._radius = v;
                this._circlePath.width = v * 2;
                this._circlePath.height = v * 2;
            }
        }
    }, {
        key: "center",
        get: function get() {
            if (!this._center) {
                this._center = { x: 0, y: 0 };
            }
            this._center.x = this.x + this._radius;
            this._center.y = this.y + this._radius;
            return this._center;
        }
    }]);

    return Circle;
}(_shape2.default);

exports.default = Circle;

/***/ }),

/***/ "./build/es5-graph/shapes/ellipse-path.js":
/*!************************************************!*\
  !*** ./build/es5-graph/shapes/ellipse-path.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(/*! ./path.js */ "./build/es5-graph/shapes/path.js");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var START = -Math.PI / 2;
var END = Math.PI * 1.5;
/**
 * 特殊的正圆形Path
 */

var EllipsePath = function (_Path) {
    _inherits(EllipsePath, _Path);

    function EllipsePath() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { anchorX: 0, anchorY: 0 };

        _classCallCheck(this, EllipsePath);

        var _this = _possibleConstructorReturn(this, (EllipsePath.__proto__ || Object.getPrototypeOf(EllipsePath)).call(this, props));

        _this._dirty = true;
        return _this;
    }

    _createClass(EllipsePath, [{
        key: "createPath",


        /**
         * 这要以中心为原点
         * @param {*} ctx 
         * @param {*} w 
         * @param {*} h 
         */
        value: function createPath(ctx, w, h) {
            ctx.moveTo(0, -w / 2);
            if (w == h) ctx.arc(0, 0, w / 2, START, END);else {
                ctx.ellipse(0, 0, w / 2, h / 2, 0, START, END);
            }
            ctx.closePath();
        }
    }, {
        key: "calculatePathLength",
        value: function calculatePathLength() {
            if (this.width == this.height) return Math.PI * this.width;else {
                var a = this.width / 2;
                var b = this.height / 2;
                return Math.PI * 2 * Math.min(a, b) + 4 * Math.abs(a - b);
            }
        }
    }, {
        key: "isClose",
        get: function get() {
            return true;
        }
    }]);

    return EllipsePath;
}(_path2.default);

exports.default = EllipsePath;

/***/ }),

/***/ "./build/es5-graph/shapes/paint-style/base-style.js":
/*!**********************************************************!*\
  !*** ./build/es5-graph/shapes/paint-style/base-style.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _color = __webpack_require__(/*! ../../color.js */ "./build/es5-graph/color.js");

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseStyle = function () {
    function BaseStyle() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, BaseStyle);

        this.name = props.name;
        this.id = props.id;
        this._color;
        if (props.color != null) this._color = new _color2.default(props.color);
        this.gradientColor = props.gradientColor;
        this.opacity = props.opacity;
        if (this.opacity == null) {
            this.opacity = 1;
        }
    }

    _createClass(BaseStyle, [{
        key: "canDraw",
        value: function canDraw() {
            return (this.color != null || this.gradientColor != null) && this.opacity != 0;
        }
    }, {
        key: "_applyStyle",
        value: function _applyStyle(ctx) {
            ctx.globalAlpha *= this.opacity;
        }
    }, {
        key: "paint",
        value: function paint(ctx, path) {
            if (!this.canDraw()) return;
            ctx.save();
            this._applyStyle(ctx);
            this._paintStyle(ctx, path);
            ctx.restore();
        }
    }, {
        key: "_paintStyle",
        value: function _paintStyle(ctx, path) {}
    }, {
        key: "color",
        get: function get() {
            return this._color;
        },
        set: function set(array) {
            if (array instanceof _color2.default) {
                this._color = array;
                return;
            }
            if (array instanceof Array) {
                if (this._color == null) {
                    this._color = new _color2.default(array);
                    return;
                }
                this._color.color = array;
            }
        }
    }]);

    return BaseStyle;
}();

exports.default = BaseStyle;

/***/ }),

/***/ "./build/es5-graph/shapes/paint-style/fill-style.js":
/*!**********************************************************!*\
  !*** ./build/es5-graph/shapes/paint-style/fill-style.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _baseStyle = __webpack_require__(/*! ./base-style.js */ "./build/es5-graph/shapes/paint-style/base-style.js");

var _baseStyle2 = _interopRequireDefault(_baseStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FillStyle = function (_BaseStyle) {
    _inherits(FillStyle, _BaseStyle);

    function FillStyle() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, FillStyle);

        var _this = _possibleConstructorReturn(this, (FillStyle.__proto__ || Object.getPrototypeOf(FillStyle)).call(this, props));

        _this.fillRule = props.fillRule;
        return _this;
    }

    _createClass(FillStyle, [{
        key: "_applyStyle",
        value: function _applyStyle(ctx) {
            _get(FillStyle.prototype.__proto__ || Object.getPrototypeOf(FillStyle.prototype), "_applyStyle", this).call(this, ctx);
            if (this.fillColor != null) {
                ctx.fillStyle = this.fillColor.color;
            } else {
                if (this.gradientColor != null) {
                    ctx.fillStyle = this.gradientColor.getGradient(ctx);
                }
            }
        }
    }, {
        key: "_paintStyle",
        value: function _paintStyle(ctx, path) {
            if (path) {
                ctx.fill(path);
            } else {
                ctx.fill();
            }
        }
    }, {
        key: "fillColor",
        get: function get() {
            return this.color;
        },
        set: function set(value) {
            this.color = value;
        }
    }, {
        key: "fillRadial",
        get: function get() {
            return this.fillGradient;
        },
        set: function set(v) {
            this.fillGradient = v;
        }
    }, {
        key: "fillGradient",
        get: function get() {
            return this.gradientColor.values;
        },
        set: function set(values) {
            if (this.gradientColor != null) {
                this.gradientColor.values = values;
            }
        }
    }]);

    return FillStyle;
}(_baseStyle2.default);

exports.default = FillStyle;

/***/ }),

/***/ "./build/es5-graph/shapes/paint-style/stroke-style.js":
/*!************************************************************!*\
  !*** ./build/es5-graph/shapes/paint-style/stroke-style.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _baseStyle = __webpack_require__(/*! ./base-style.js */ "./build/es5-graph/shapes/paint-style/base-style.js");

var _baseStyle2 = _interopRequireDefault(_baseStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JOIN = ['bevel', 'round', 'miter'];
var CAP = ['butt', 'round', 'square'];

var StrokeStyle = function (_BaseStyle) {
    _inherits(StrokeStyle, _BaseStyle);

    function StrokeStyle() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, StrokeStyle);

        var _this = _possibleConstructorReturn(this, (StrokeStyle.__proto__ || Object.getPrototypeOf(StrokeStyle)).call(this, props));

        _this.trim = props.trim;
        if (_this.trim == null) _this.trim = 0;
        _this.end = props.end;
        if (_this.end == null) _this.end = 1;
        _this.start = props.start;
        if (_this.start == null) _this.start = 0;
        _this.offset = props.offset;
        if (_this.offset == null) _this.offset = 0;
        _this.join = props.join;
        if (_this.join == null) _this.join = 0; // "bevel" || "round" || "miter";
        _this.cap = props.cap;
        if (_this.cap == null) _this.cap = 0; // "butt" || "round" || "square";
        _this.width = props.width;
        if (_this.width == null) _this.width = 0;
        return _this;
    }

    _createClass(StrokeStyle, [{
        key: 'canDraw',
        value: function canDraw() {
            return _get(StrokeStyle.prototype.__proto__ || Object.getPrototypeOf(StrokeStyle.prototype), 'canDraw', this).call(this) && this.end - this.start != 0; // && this.offset < 1 && (this.end - this.start != 0);
        }
    }, {
        key: '_applyStyle',
        value: function _applyStyle(ctx, length) {
            _get(StrokeStyle.prototype.__proto__ || Object.getPrototypeOf(StrokeStyle.prototype), '_applyStyle', this).call(this, ctx);
            if (this.color != null) {
                ctx.strokeStyle = this.strokeColor.color;
            } else {
                if (this.gradientColor != null) {
                    ctx.strokeStyle = this.gradientColor.getGradient(ctx);
                }
            }
            ctx.lineWidth = this.width;
            ctx.lineJoin = JOIN[this.join];
            ctx.lineCap = CAP[this.cap];
            // 利用虚线模拟路径分段绘制
            if (this.offset == 0 && this.start == 0 && this.end == 1) {} else {
                if (this.end - this.start < 1) {
                    var visibleLength = (this.end - this.start) * length;
                    ctx.lineDashOffset = -(this.offset + this.start) * length;
                    ctx.setLineDash([visibleLength, length - visibleLength]);
                }
            }
        }
    }, {
        key: '_paintStyle',
        value: function _paintStyle(ctx, path) {
            if (path) {
                ctx.stroke(path);
            } else {
                ctx.stroke();
            }
        }
    }, {
        key: 'paint',
        value: function paint(ctx, path, length) {
            if (!this.canDraw()) return;
            ctx.save();
            this._applyStyle(ctx, length);
            this._paintStyle(ctx, path);
            ctx.restore();
        }
    }, {
        key: 'strokeColor',
        get: function get() {
            return this.color;
        },
        set: function set(value) {
            this.color = value;
        }
    }]);

    return StrokeStyle;
}(_baseStyle2.default);

exports.default = StrokeStyle;

/***/ }),

/***/ "./build/es5-graph/shapes/path.js":
/*!****************************************!*\
  !*** ./build/es5-graph/shapes/path.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _utils = __webpack_require__(/*! ../utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _transformable = __webpack_require__(/*! ../transformable.js */ "./build/es5-graph/transformable.js");

var _transformable2 = _interopRequireDefault(_transformable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Path = function (_Transformable) {
    _inherits(Path, _Transformable);

    function Path() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Path);

        var _this = _possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this, props));

        _this._points = [];
        _this._path;
        _this._isClose = props.isClose;
        if (_this._isClose == null) _this._isClose = false;
        _this._dirty = false;
        if (_this._points.length != 0) _this._dirty = true;
        _this._path2d;
        _this._dirtyPoints = [];
        _this._length = null;
        return _this;
    }

    //// 属性 ////

    _createClass(Path, [{
        key: "addPoint",


        //// 方法 ///////

        value: function addPoint(p) {
            if (p._parent == this) return;
            if (p._parent != null) throw '该点已经添加到其他线上，请先用它之前线删除它';
            this._points.push(p);
            p._parent = this;
            this.fireDirty();
        }
    }, {
        key: "removePointAt",
        value: function removePointAt(index) {
            if (index < 0 || index > this._points.length - 1) return;
            var p = this._points[index];
            p._parent = null;
            this._points.splice(index, 1);

            var di = this._dirtyPoints.indexOf(p);
            if (di != -1) this._dirtyPoints.splice(di, 1);
            this.fireDirty();
        }
    }, {
        key: "removePoint",
        value: function removePoint(p) {
            this.removePointAt(this._points.indexOf(p));
        }
    }, {
        key: "isDirty",
        value: function isDirty() {
            return this._dirty || this._dirtyPoints.length != 0;
        }
    }, {
        key: "fireDirty",
        value: function fireDirty() {
            this._dirty = true;
            this._length = null;
        }
    }, {
        key: "firePointDirty",
        value: function firePointDirty(p) {
            var index = this._dirtyPoints.indexOf(p);
            if (index == -1) {
                this._dirtyPoints.push(p);
                this.fireDirty();
            }
        }
    }, {
        key: "saveDirty",
        value: function saveDirty() {
            this._dirty = false;
            this._dirtyPoints.forEach(function (point) {
                point.saveDirty();
            });
            this._dirtyPoints.length = 0;
        }
    }, {
        key: "getPath2D",
        value: function getPath2D(ctx) {
            if (this.isDirty()) {
                this._path2d = _utils2.default.createPath2D(ctx.wx_canvas); //ctx.wx_canvas.createPath2D();
                if (this._path2d && this._path2d.closePath == null) {
                    this._path2d = null;
                    //真机上path2d创建出来是一个object，根本不能用
                }
                if (this._path2d != null) {
                    this.createPath(this._path2d, this.width, this.height);
                }
            }
            return this._path2d;
        }
    }, {
        key: "createPath",
        value: function createPath(ctx, w, h) {
            if (this._points.length <= 1) return; //至少两个点
            var start = this._points[0];
            var prePoint = start;
            var nextPoint = void 0;
            if (start == null) return;
            ctx.moveTo(start.x, start.y);
            for (var i = 1; i < this._points.length; i++) {
                nextPoint = this._points[i];
                this._lineToNext(prePoint, nextPoint, ctx);
                prePoint = nextPoint;
            }
            if (this._isClose) {
                nextPoint = start;
                this._lineToNext(prePoint, nextPoint, ctx);
            }
            this.saveDirty();
        }
    }, {
        key: "_lineToNext",
        value: function _lineToNext(prePoint, nextPoint, ctx) {
            var pout = prePoint.out;
            var nin = nextPoint.in;
            if (prePoint.type == 0 && nextPoint.type == 0) {
                ctx.lineTo(nextPoint.x, nextPoint.y);
                return;
            }
            if (pout == null && nin == null) {
                ctx.lineTo(nextPoint.x, nextPoint.y);
            } else {
                var control = pout;
                var control1 = nin;
                if (control == null || control1 == null) {
                    var c = control;
                    c = c || control1;
                    ctx.quadraticCurveTo(c[0], c[1], nextPoint.x, nextPoint.y);
                } else {
                    ctx.bezierCurveTo(control[0], control[1], control1[0], control1[1], nextPoint.x, nextPoint.y);
                }
            }
        }
    }, {
        key: "calculatePathLength",
        value: function calculatePathLength() {
            var sum = 0;
            var start = void 0,
                next = void 0;
            for (var i = 0; i < this._points.length - 1; i++) {
                start = this._points[i];
                next = this._points[i + 1];
                sum += this._calculateSegmentLength(start, next);
            }
            if (this.isClose) {
                start = next;
                next = this._points[0];
                sum += this._calculateSegmentLength(start, next);
            }
            return sum;
        }
    }, {
        key: "_calculateSegmentLength",
        value: function _calculateSegmentLength(p1, p2) {
            var pout = p1.out;
            var nin = p2.in;
            if (pout == null && nin == null) {
                var deltax = p2.x - p1.x;
                var deltay = p2.y - p1.y;
                return Math.sqrt(deltax * deltax + deltay * deltay);
            } else {
                var control = pout;
                var control1 = nin;
                if (control == null || control1 == null) {
                    var c = control;
                    c = c || control1;
                    return _utils2.default.bezierLength(p1, { x: c[0], y: c[1] }, p2);
                } else {
                    return _utils2.default.bezierLength(p1, { x: control[0], y: control[1] }, { x: control1[0], y: control1[1] }, p2);
                }
            }
        }
    }, {
        key: "width",
        get: function get() {
            return _get(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), "width", this);
        },
        set: function set(w) {
            if (this.width != w) {
                _set(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), "width", w, this);
                this.fireDirty();
            }
        }
    }, {
        key: "height",
        get: function get() {
            return _get(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), "height", this);
        },
        set: function set(w) {
            if (this.height != w) {
                _set(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), "height", w, this);
                this.fireDirty();
            }
        }
    }, {
        key: "length",
        get: function get() {
            if (this._length == null) {
                this._length = this.calculatePathLength();
            }
            return this._length;
        }
    }, {
        key: "isClose",
        get: function get() {
            return this._isClose;
        },
        set: function set(c) {
            if (this._isClose != c) {
                this._isClose = c;
                this._dirty = true;
                this._length = null;
            }
        }
    }, {
        key: "pathVertices",
        set: function set(vertices) {
            for (var index = 0, offset = 0; index < this._points.length; index++) {
                var point = this._points[index];
                point.setVertices(vertices, offset);
                if (point.type == 0) {
                    offset += 3;
                } else {
                    offset += 6;
                }
            }
        }
    }]);

    return Path;
}(_transformable2.default);

exports.default = Path;

/***/ }),

/***/ "./build/es5-graph/shapes/point.js":
/*!*****************************************!*\
  !*** ./build/es5-graph/shapes/point.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 0 };

        _classCallCheck(this, Point);

        if (props.x == null) throw 'x不能为空';
        if (props.y == null) throw 'y不能为空';
        this._x = props.x;
        this._y = props.y;
        this.type = props.type;
        this._in = props.in;
        this._out = props.out;
        this._radius = props.radius;
        this._dirty = false;
        this._parent;
    }

    _createClass(Point, [{
        key: 'setVertices',
        value: function setVertices(points, offset) {
            if (this.type === 0) {
                this.x = points[offset];
                this.y = points[offset + 1];
                this.radius = points[offset + 2];
                return;
            } else {
                this.x = points[offset];
                this.y = points[offset + 1];
                this.setInX(points[offset + 2]);
                this.setInY(points[offset + 3]);
                this.setOutX(points[offset + 4]);
                this.setOutY(points[offset + 5]);
            }
        }
    }, {
        key: 'setInX',
        value: function setInX(v) {
            if (this.in == null) {
                this._in = [0, 0];
            }
            if (this.in[0] != v) {
                this.in[0] = v;
                this.fireDirty();
            }
        }
    }, {
        key: 'setInY',
        value: function setInY(v) {
            if (this.in == null) {
                this._in = [0, 0];
            }
            if (this.in[1] != v) {
                this.in[1] = v;
                this.fireDirty();
            }
        }
    }, {
        key: 'setOutX',
        value: function setOutX(v) {
            if (this.out == null) {
                this._out = [0, 0];
            }
            if (this.out[0] != v) {
                this.out[0] = v;
                this.fireDirty();
            }
        }
    }, {
        key: 'setOutY',
        value: function setOutY(v) {
            if (this.out == null) {
                this._out = [0, 0];
            }
            if (this.out[1] != v) {
                this.out[1] = v;
                this.fireDirty();
            }
        }
    }, {
        key: 'fireDirty',
        value: function fireDirty() {
            if (this._parent) {
                this._dirty = true;
                // 因为一个path上的点可能会有很多，为了不让path遍历查找dirty的点
                // 所以让加入path的point主动通知path dirty
                // 同样，为了让path在save的时候不需要遍历所有点让其dirty重置，所以
                // 让path加入dirty的点，仅保存dirty点即可
                this._parent.firePointDirty(this);
            }
        }
    }, {
        key: 'saveDirty',
        value: function saveDirty() {
            this._dirty = false;
        }
    }, {
        key: 'radius',
        get: function get() {
            return this._radius;
        },
        set: function set(r) {
            if (this._radius != r) {
                this._radius = r;
                this.fireDirty();
            }
        }
    }, {
        key: 'vertices',
        set: function set(points) {
            if (points instanceof Array) {
                this.setVertices(points, 0);
            }
        }
    }, {
        key: 'dirty',
        get: function get() {
            return this._dirty;
        }
    }, {
        key: 'x',
        get: function get() {
            return this._x;
        },
        set: function set(v) {
            if (this._x != v) {
                this._x = v;
                this.fireDirty();
            }
        }
    }, {
        key: 'y',
        get: function get() {
            return this._y;
        },
        set: function set(v) {
            if (this._y != v) {
                this._y = v;
                this.fireDirty();
            }
        }
    }, {
        key: 'in',
        get: function get() {
            return this._in;
        }
    }, {
        key: 'out',
        get: function get() {
            return this._out;
        }
    }]);

    return Point;
}();

exports.default = Point;

/***/ }),

/***/ "./build/es5-graph/shapes/polygon.js":
/*!*******************************************!*\
  !*** ./build/es5-graph/shapes/polygon.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _shape = __webpack_require__(/*! ./shape */ "./build/es5-graph/shapes/shape.js");

var _shape2 = _interopRequireDefault(_shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Polygon = function (_Shape) {
    _inherits(Polygon, _Shape);

    function Polygon(params) {
        _classCallCheck(this, Polygon);

        params = params || {};

        // 没个point是一个二维数组 0是x，1是y
        var _this = _possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, params));

        _this._close = params['close'] == null ? true : params['close'];
        _this._points = params['points'] || [];
        return _this;
    }

    _createClass(Polygon, [{
        key: 'addPoint',
        value: function addPoint(point) {
            this._points.push(point);
            this._contentDirty = true;
        }
    }, {
        key: 'removePointAt',
        value: function removePointAt(index) {
            this._points.splice(index, 1);
            this._contentDirty = true;
        }
    }, {
        key: 'canDraw',
        value: function canDraw() {
            // 多边形至少3个点
            return this._points.length >= 3 && _get(Polygon.prototype.__proto__ || Object.getPrototypeOf(Polygon.prototype), 'canDraw', this).call(this);
        }
    }, {
        key: '_createShapePath',
        value: function _createShapePath(ctx, w, h) {
            ctx.beginPath();
            var points = this._points;
            ctx.moveTo(points[0][0], points[0][1]);
            for (var i = 1; i < points.length; i++) {
                var p = points[i];
                ctx.lineTo(p[0], p[1]);
            }

            if (this.close) {
                ctx.closePath();
            }
        }
    }, {
        key: 'points',
        get: function get() {
            return this._points;
        }
    }, {
        key: 'close',
        get: function get() {
            return this._close;
        },
        set: function set(c) {
            if (this._close != c) {
                this._close = c;
                this._contentDirty = true;
            }
        }
    }]);

    return Polygon;
}(_shape2.default);

exports.default = Polygon;

/***/ }),

/***/ "./build/es5-graph/shapes/rectangle-path.js":
/*!**************************************************!*\
  !*** ./build/es5-graph/shapes/rectangle-path.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(/*! ./path.js */ "./build/es5-graph/shapes/path.js");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HALF_PI = Math.PI / 2;

var RectanglePath = function (_Path) {
    _inherits(RectanglePath, _Path);

    function RectanglePath() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { anchorX: 0.5, anchorY: 0.5 };

        _classCallCheck(this, RectanglePath);

        if (props.anchorX == null) props.anchorX = 0.5;
        if (props.anchorY == null) props.anchorY = 0.5;

        var _this = _possibleConstructorReturn(this, (RectanglePath.__proto__ || Object.getPrototypeOf(RectanglePath)).call(this, props));

        _this._dirty = true;
        _this._radius = props.radius;
        if (_this._radius == null) _this._radius = 0;
        return _this;
    }

    _createClass(RectanglePath, [{
        key: "createPath",


        /**
         * 这要以中心为原点
         * @param {*} ctx 
         * @param {*} w 
         * @param {*} h 
         */
        value: function createPath(ctx, w, h) {
            if (this.radius == 0) {
                // ctx.moveTo(-w / 2, -h / 2);
                ctx.rect(-w / 2, -h / 2, w, h);
                ctx.closePath();
            } else {
                var min = Math.min(w, h);

                var r = this.radius;
                if (r > min / 2) {
                    r = min / 2;
                }
                var left = -w / 2;
                var top = -h / 2;
                var right = left + w;
                var bottom = top + h;
                ctx.moveTo(left + r, top);
                ctx.lineTo(right - r, top);
                ctx.arc(right - r, top + r, r, -HALF_PI, 0);
                ctx.lineTo(right, bottom - r);
                ctx.arc(right - r, bottom - r, r, 0, HALF_PI);
                ctx.lineTo(left + r, bottom);
                ctx.arc(left + r, bottom - r, r, HALF_PI, Math.PI);
                ctx.lineTo(left, top + r);
                ctx.arc(left + r, top + r, r, Math.PI, Math.PI + HALF_PI);
                ctx.closePath();
            }
        }
    }, {
        key: "calculatePathLength",
        value: function calculatePathLength() {
            if (this.radius == 0) {
                return (this.width + this.height) * 2;
            } else {
                var l = (this.width + this.height) * 2;
                var min = Math.min(this.width, this.height);

                var r = this.radius;
                if (r > min / 2) {
                    r = min / 2;
                }
                l -= 8 * r;
                l += Math.PI * 2 * r;
                return l;
            }
        }
    }, {
        key: "isClose",
        get: function get() {
            return true;
        }
    }, {
        key: "radius",
        get: function get() {
            return this._radius;
        },
        set: function set(r) {
            if (this._radius != r) {
                this._radius = r;
                this.fireDirty();
            }
        }
    }]);

    return RectanglePath;
}(_path2.default);

exports.default = RectanglePath;

/***/ }),

/***/ "./build/es5-graph/shapes/rectangle.js":
/*!*********************************************!*\
  !*** ./build/es5-graph/shapes/rectangle.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _shape = __webpack_require__(/*! ./shape.js */ "./build/es5-graph/shapes/shape.js");

var _shape2 = _interopRequireDefault(_shape);

var _rectanglePath = __webpack_require__(/*! ./rectangle-path.js */ "./build/es5-graph/shapes/rectangle-path.js");

var _rectanglePath2 = _interopRequireDefault(_rectanglePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rectangle = function (_Shape) {
    _inherits(Rectangle, _Shape);

    function Rectangle(params) {
        _classCallCheck(this, Rectangle);

        params = params || {};

        var _this = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, params));

        var radius = params['radius'] == null ? 0 : params['radius'];
        _this._rectanglePath = new _rectanglePath2.default({
            anchorX: 0.5, anchorY: 0.5,
            radius: radius,
            width: _this.width,
            height: _this.height
        });
        _this.addPath(_this._rectanglePath);
        return _this;
    }

    _createClass(Rectangle, [{
        key: "canDraw",
        value: function canDraw() {
            return _get(Rectangle.prototype.__proto__ || Object.getPrototypeOf(Rectangle.prototype), "canDraw", this).call(this) && this.width != 0 && this.height != 0;
        }
    }, {
        key: "width",
        get: function get() {
            return _get(Rectangle.prototype.__proto__ || Object.getPrototypeOf(Rectangle.prototype), "width", this);
        },
        set: function set(w) {
            _set(Rectangle.prototype.__proto__ || Object.getPrototypeOf(Rectangle.prototype), "width", w, this);
            this._rectanglePath.width = w;
        }
    }, {
        key: "height",
        get: function get() {
            return _get(Rectangle.prototype.__proto__ || Object.getPrototypeOf(Rectangle.prototype), "height", this);
        },
        set: function set(w) {
            _set(Rectangle.prototype.__proto__ || Object.getPrototypeOf(Rectangle.prototype), "height", w, this);
            this._rectanglePath.height = w;
        }
    }, {
        key: "radius",
        get: function get() {
            return this._rectanglePath.radius;
        },
        set: function set(v) {
            if (this._rectanglePath.radius != v) {
                this._rectanglePath.radius = v;
            }
        }
    }]);

    return Rectangle;
}(_shape2.default);

exports.default = Rectangle;

/***/ }),

/***/ "./build/es5-graph/shapes/shape.js":
/*!*****************************************!*\
  !*** ./build/es5-graph/shapes/shape.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _drawable = __webpack_require__(/*! ../drawable.js */ "./build/es5-graph/drawable.js");

var _drawable2 = _interopRequireDefault(_drawable);

var _utils = __webpack_require__(/*! ../utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 几回图形绘制基类
 */
var Shape = function (_Drawable) {
    _inherits(Shape, _Drawable);

    function Shape() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Shape);

        var _this = _possibleConstructorReturn(this, (Shape.__proto__ || Object.getPrototypeOf(Shape)).call(this, props));

        _this.fillStyles = [];
        _this.strokeStyles = [];
        // this.fillStyle = props.fillStyle;
        // this.strokeStyle = props.strokeStyle;
        _this._path2d;
        _this._paths = [];
        return _this;
    }

    //// 属性 ////

    /// 方法 ////

    _createClass(Shape, [{
        key: "getShapePath",
        value: function getShapePath(ctx) {
            if (this.isDirty()) {
                // 这些操作全是因为微信没有path2d造成的
                this._path2d = _utils2.default.createPath2D(ctx.wx_canvas); //ctx.wx_canvas.createPath2D();
                if (this._path2d != null) {
                    this.createSubPath2D(ctx);
                }
                this.saveDirty();
            }
            return this._path2d;
        }
    }, {
        key: "addFillStyle",
        value: function addFillStyle(style) {
            this.fillStyles.push(style);
        }
    }, {
        key: "addStrokeStyle",
        value: function addStrokeStyle(style) {
            this.strokeStyles.push(style);
        }
    }, {
        key: "getShapeLength",
        value: function getShapeLength() {
            var sum = 0;
            this._paths.forEach(function (path) {
                sum += path.length;
            });
            return sum;
        }
    }, {
        key: "isDirty",
        value: function isDirty() {
            for (var index = 0; index < this._paths.length; index++) {
                var path = this._paths[index];
                if (path.isDirty()) return true;
            }
            return false;
        }
    }, {
        key: "saveDirty",
        value: function saveDirty() {
            for (var index = 0; index < this._paths.length; index++) {
                var path = this._paths[index];
                path.saveDirty();
            }
        }
    }, {
        key: "addPath",
        value: function addPath(path) {
            if (this._paths.indexOf(path) == -1) this._paths.push(path);
        }
    }, {
        key: "removePathAt",
        value: function removePathAt(index) {
            if (index < 0 || index > this._paths.length - 1) return;
            this._paths.splice(index, 1);
        }
    }, {
        key: "removePath",
        value: function removePath(path) {
            this.removePathAt(this._paths.indexOf(path));
        }
    }, {
        key: "canDraw",
        value: function canDraw() {
            return (this.fillStyles.length != 0 || this.strokeStyles.length != 0) && this._paths.length != 0 && _get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), "canDraw", this).call(this);
        }
    }, {
        key: "drawPaths",
        value: function drawPaths(ctx, w, h) {
            this._paths.forEach(function (p) {
                ctx.save();
                var matrix = p.getTransformMatrix();
                if (!matrix.isIdentity()) {
                    var data = matrix.data;
                    ctx.transform(data[0], data[3], data[1], data[4], data[2], data[5]);
                }
                p.createPath(ctx, p.width, p.height);
                ctx.restore();
            });
        }
    }, {
        key: "drawSelf",
        value: function drawSelf(ctx, w, h) {
            var _this2 = this;

            var path2d = this.getShapePath(ctx);

            if (path2d == null) {
                // 没有path就硬画
                ctx.beginPath(); // 清空之前的Path栈
                this.drawPaths(ctx, w, h);
            }

            this.fillStyles.forEach(function (fillStyle) {
                fillStyle.paint(ctx, _this2._path2d);
            });
            if (this.strokeStyles.length > 0) {
                var length = this.getShapeLength();
                this.strokeStyles.forEach(function (strokeStyle) {
                    strokeStyle.paint(ctx, _this2._path2d, length);
                });
            }
        }
    }, {
        key: "createSubPath2D",
        value: function createSubPath2D(ctx) {
            var _this3 = this;

            this._paths.forEach(function (p) {
                var matrix = p.getTransformMatrix();
                if (matrix.isIdentity()) {
                    _this3._path2d.addPath(p.getPath2D(ctx));
                } else {
                    _this3._path2d.addPath(p.getPath2D(ctx), matrix.toSVGMatrix());
                }
            });
        }
    }]);

    return Shape;
}(_drawable2.default);

exports.default = Shape;

/***/ }),

/***/ "./build/es5-graph/shapes/star-path.js":
/*!*********************************************!*\
  !*** ./build/es5-graph/shapes/star-path.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _path = __webpack_require__(/*! ./path.js */ "./build/es5-graph/shapes/path.js");

var _path2 = _interopRequireDefault(_path);

var _point = __webpack_require__(/*! ./point.js */ "./build/es5-graph/shapes/point.js");

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StarPath = function (_Path) {
    _inherits(StarPath, _Path);

    function StarPath() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, StarPath);

        var _this = _possibleConstructorReturn(this, (StarPath.__proto__ || Object.getPrototypeOf(StarPath)).call(this, props));

        _this._innerRadius = props.innerRadius;
        if (_this._innerRadius == null) _this._innerRadius = 0.5;
        _this._starPoints = props.starPoints;
        if (_this._starPoints == null) _this._starPoints = 5;else _this._starPoints = Math.floor(_this._starPoints);
        _this._isClose = true;
        _this._points = new Array(_this._starPoints * 2);
        _this._outlinecreated = false;
        _this._inlinecreated = false;
        return _this;
    }

    _createClass(StarPath, [{
        key: '_createStarPoints',
        value: function _createStarPoints() {
            var count = this._starPoints;
            var delta = Math.PI * 2 / count;

            var outAngleOffset = -Math.PI / 2;
            var outIndexOffset = 0;

            var inAngleOffset = outAngleOffset + delta / 2;
            var inIndexOffset = 1;

            var a = this.width / 2;
            var a1 = a * this.innerRadius;
            var b = this.height / 2;
            var b1 = b * this.innerRadius;

            for (var i = 0, angle = 0, index = 0; i < count; i++) {
                if (!this._outlinecreated) {
                    var theta = angle + outAngleOffset;
                    var x = Math.cos(theta) * a;
                    var y = Math.sin(theta) * b;
                    this._points[index + outIndexOffset] = new _point2.default({ x: x, y: y, type: 0 });
                }
                if (!this._inlinecreated) {
                    var _theta = angle + inAngleOffset;
                    var _x2 = Math.cos(_theta) * a1;
                    var _y = Math.sin(_theta) * b1;
                    this._points[index + inIndexOffset] = new _point2.default({ x: _x2, y: _y, type: 0 });
                }
                angle += delta;
                index += 2;
            }
            this._outlinecreated = true;
            this._inlinecreated = true;
        }
    }, {
        key: 'createPath',
        value: function createPath(ctx, w, h) {
            this._createStarPoints();
            _get(StarPath.prototype.__proto__ || Object.getPrototypeOf(StarPath.prototype), 'createPath', this).call(this, ctx, w, h);
        }
    }, {
        key: 'isClose',
        get: function get() {
            return true;
        }
    }, {
        key: 'innerRadius',
        get: function get() {
            return this._innerRadius;
        },
        set: function set(r) {
            if (this._innerRadius != r) {
                this._innerRadius = r;
                this._inlinecreated = false;
                this.fireDirty();
            }
        }
    }, {
        key: 'starPoints',
        get: function get() {
            return this._starPoints;
        },
        set: function set(r) {
            var ir = Math.floor(r);
            if (this._starPoints != ir) {
                this._starPoints = ir;

                this._outlinecreated = false;
                this._inlinecreated = false;
                this._points = new Array(ir * 2);

                this.fireDirty();
            }
        }
    }]);

    return StarPath;
}(_path2.default);

exports.default = StarPath;

/***/ }),

/***/ "./build/es5-graph/text/text.js":
/*!**************************************!*\
  !*** ./build/es5-graph/text/text.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _figure = __webpack_require__(/*! ../figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ALIGN_CENTER = 'center';
var ALIGN_LEFT = 'left';
var ALIGN_RIGHT = 'right';

var BASELINE_MIDDLE = "middle";
var BASELINE_TOP = "top";
var BASELINE_BOTTOM = "bottom";

var Text = function (_Figure) {
    _inherits(Text, _Figure);

    function Text(params) {
        _classCallCheck(this, Text);

        params = params || {};

        var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, params));

        _this._text = params['text'];
        _this._fontFamily = params['fontFamily'] || 'arial';
        _this._fontSize = params['fontSize'] == null ? 16 : params['fontSize'];
        _this._fontWeight = params['fontWeight'] || 'normal';
        _this._fontStyle = params['fontStyle'] || '';
        _this.maxWidth = params['maxWidth'];
        _this._color = params['color'] || '#0e0e0e';
        _this._borderColor = params['borderColor'];
        _this._borderWidth = params['borderWidth'] == null ? 0 : params['borderWidth'];
        _this._width = 0; // 文字的宽度跟文本内容有关
        _this.align = params['align'] || ALIGN_LEFT;
        _this.baseLine = params['baseLine'] || BASELINE_TOP;
        _this.lineHeight = params['lineHeight'] == null ? 1.5 : params['lineHeight'];
        _this._textArray = [];
        _this._textDirty = true;
        return _this;
    }

    // set anchor() { }
    // get anchor() { return super.anchor; }
    // 文字的x，y将是整个Figure的中心，这里需要复写
    // centerMe() {
    //     if (this._parent != null) {
    //         this.x = (this._parent.width) / 2;
    //         this.y = (this._parent.height) / 2;
    //     }
    // }

    /**
     * 因为文字的bounds跟align和baseline有关系，所以这里要复写
     */


    _createClass(Text, [{
        key: 'getVertex',
        value: function getVertex() {
            var x = 0,
                y = 0;
            var width = this.width;
            var height = this.height;
            if (this.align == ALIGN_CENTER) {
                x = -width / 2;
            }
            if (this.align == ALIGN_RIGHT) {
                x = -width;
            }

            if (this.baseline == BASELINE_MIDDLE) {
                y = -height / 2;
            }

            if (this.baseline == BASELINE_BOTTOM) {
                y = -height;
            }

            return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
        }
    }, {
        key: '_getTextArray',
        value: function _getTextArray() {
            if (this._textDirty) {
                this._textArray = this._text.split('\n');
                this._textDirty = false;
            }
            return this._textArray;
        }
    }, {
        key: 'addLine',
        value: function addLine(str) {
            this._text += '\n' + str;
            this._textArray.push(str);
            this._contentDirty = true;
            this._textDirty = false;
        }
    }, {
        key: 'removeLine',
        value: function removeLine(index) {
            if (index < 0 || index > this._textArray.length - 1) return;
            this._textArray.splice(index, 1);
            this._text = '';
            for (var _index = 0; _index < this._textArray.length; _index++) {
                var str = this._textArray[_index];
                this._text += str;
                if (_index != this._textArray.length - 1) {
                    this._text += '\n';
                }
            }
            this._contentDirty = true;
            this._textDirty = false;
        }
    }, {
        key: 'canDraw',
        value: function canDraw() {
            return this._text != null && this._text.length != 0 && _get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'canDraw', this).call(this);
        }
    }, {
        key: '_applyCurrentDrawingStates',
        value: function _applyCurrentDrawingStates(ctx) {
            ctx.font = this.font;
            ctx.fillStyle = this.color;
            // 这里强制设置baseline为top，是为了让多行文字绘制的时候更好计算y的坐标
            // text figure的baseline可以做到baseline效果的，当然少了好几个选项，
            // 如果对其余baseline选项有兴趣的朋友可以看看我在github上的tielifa里怎么实现文字baseline设置的。
            ctx.textBaseline = 'top';
            ctx.textAlign = this.align;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            _get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), '_applyCurrentDrawingStates', this).call(this, ctx);
        }
    }, {
        key: '_drawSelf',
        value: function _drawSelf(ctx, w, h) {
            ctx.save();
            var textArray = this._getTextArray();
            var y = 0,
                x = 0;
            if (this.baseLine == BASELINE_TOP) {
                y = 0;
            }
            if (this.baseLine == BASELINE_MIDDLE) {
                y = -h / 2;
            }
            if (this.baseLine == BASELINE_BOTTOM) {
                y = -h;
            }
            if (this.maxWidth != null) {
                for (var index = 0; index < textArray.length; index++) {
                    var str = textArray[index];
                    ctx.fillText(str, x, y, this.maxWidth);
                    if (this.borderWidth != 0 && this.borderColor != null) {
                        ctx.strokeText(str, x, y, this.maxWidth);
                    }
                    y += this.fontSize * this.lineHeight;
                }
            } else {
                for (var _index2 = 0; _index2 < textArray.length; _index2++) {
                    var _str = textArray[_index2];
                    ctx.fillText(_str, x, y);
                    if (this.borderWidth != 0 && this.borderColor != null) {
                        ctx.strokeText(_str, x, y);
                    }
                    y += this.fontSize * this.lineHeight;
                }
            }
            // ctx.fillStyle = 'red';
            // ctx.fillRect(-5, -5, 10, 10);
            ctx.restore();
        }
    }, {
        key: 'color',
        get: function get() {
            return this._color;
        },
        set: function set(c) {
            if (this._color != c) {
                this._color = c;
                // this._contentDirty = true;
            }
        }
    }, {
        key: 'borderColor',
        get: function get() {
            return this._borderColor;
        },
        set: function set(c) {
            if (this._borderColor != c) {
                this._borderColor = c;
                // this._contentDirty = true;
            }
        }
    }, {
        key: 'borderWidth',
        get: function get() {
            return this._borderWidth;
        },
        set: function set(c) {
            if (this._borderWidth != c) {
                this._borderWidth = c;
                // this._contentDirty = true;
            }
        }
    }, {
        key: 'fontStyle',
        get: function get() {
            return this._fontStyle;
        },
        set: function set(s) {
            if (this._fontStyle != s) {
                this._fontStyle = s;
                this._contentDirty = true;
            }
        }
    }, {
        key: 'fontFamily',
        get: function get() {
            return this._fontFamily;
        },
        set: function set(s) {
            if (this._fontFamily != s) {
                this._fontFamily = s;
                this._contentDirty = true;
            }
        }
    }, {
        key: 'fontSize',
        get: function get() {
            return this._fontSize;
        },
        set: function set(s) {
            if (this._fontSize != s) {
                this._fontSize = s;
                this._contentDirty = true;
            }
        }
    }, {
        key: 'fontWeight',
        get: function get() {
            return this._fontWeight;
        },
        set: function set(s) {
            if (this._fontWeight != s) {
                this._fontWeight = s;
                this._contentDirty = true;
            }
        }
    }, {
        key: 'font',
        get: function get() {
            return this.fontStyle + ' ' + this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;
        }
    }, {
        key: 'width',
        set: function set(w) {},
        get: function get() {
            if (this._contentDirty) {
                if (this._text != '' || this._text != null) {
                    var parent = this.getRoot();
                    if (parent != null && parent.ctx) {
                        parent.ctx.save();
                        parent.ctx.font = this.font;
                        var array = this._getTextArray();
                        var w = -Infinity;
                        for (var index = 0; index < array.length; index++) {
                            var str = array[index];
                            w = Math.max(parent.ctx.measureText(str).width, w);
                        }
                        this._width = w;
                        parent.ctx.restore();
                        this._contentDirty = false;
                    }
                } else {
                    return 0;
                }
            }
            if (this.maxWidth != null) {
                return Math.min(this._width, this.maxWidth);
            }
            return this._width;
        }
        // 我经常这么干,文字行的高度确实不是很好计算，特别是在没有dom的情况下。
        // 这里是设置一个百分比，通常字体的高度是字体大小的1.5倍左右(字符'j Í')
        // 有兴趣的朋友可以看看我在github的tielifa中是如何计算的

    }, {
        key: 'height',
        set: function set(h) {},
        get: function get() {
            return this._fontSize * this.lineHeight * this._getTextArray().length;
        }
    }, {
        key: 'text',
        get: function get() {
            return this._text;
        },
        set: function set(t) {
            if (this._text != t) {
                this._text = t;
                this._contentDirty = true;
                this._textDirty = true;
            }
        }
    }]);

    return Text;
}(_figure2.default);

exports.default = Text;

/***/ }),

/***/ "./build/es5-graph/transformable.js":
/*!******************************************!*\
  !*** ./build/es5-graph/transformable.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix = __webpack_require__(/*! ./math/matrix3.js */ "./build/es5-graph/math/matrix3.js");

var _matrix2 = _interopRequireDefault(_matrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PI_DIV_180 = Math.PI / 180;

var Transformable = function () {
    function Transformable() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Transformable);

        this._x = props.x;
        if (this._x == null) this._x = 0;

        this._y = props.y;
        if (this._y == null) this._y = 0;

        this._scaleX = props.scaleX;
        if (this._scaleX == null) this._scaleX = 1;

        this._scaleY = props.scaleY;
        if (this._scaleY == null) this._scaleY = 1;

        this._anchorX = props.anchorX;
        if (this._anchorX == null) this._anchorX = 0;

        this._anchorY = props.anchorY;
        if (this._anchorY == null) this._anchorY = 0;

        this._rotation = props.rotation;
        if (this._rotation == null) this._rotation = 0;

        this._width = props.width;
        if (this._width == null) this._width = 0;

        this._height = props.height;
        if (this._height == null) this._height = 0;

        this._matrix = new _matrix2.default();

        this._worldMatrix = new _matrix2.default();

        this._parent;

        this._children = [];

        this._worldTransformDirty = true;

        this._transformDirty = true;

        /// 单独把alpha拿出来放到transformable里，因为alpah也是继承关系。不要在意这些细节
        this._opacity = props.opacity;
        if (this._opacity == null) this._opacity = 1;
        this._opacityChange = true;
    }

    //// 属性 //////////

    _createClass(Transformable, [{
        key: "isWorldTransformDirty",


        /// 方法 ///////////

        value: function isWorldTransformDirty() {
            return this._worldTransformDirty;
        }
    }, {
        key: "isTransformDirty",
        value: function isTransformDirty() {
            return this._transformDirty;
        }
    }, {
        key: "fireTransformDirty",
        value: function fireTransformDirty() {
            this._transformDirty = true;
            this.fireWorldTransformDirty();
        }
    }, {
        key: "saveTransform",
        value: function saveTransform() {
            this._transformDirty = false;
        }
    }, {
        key: "fireWorldTransformDirty",
        value: function fireWorldTransformDirty() {
            this._worldTransformDirty = true;
            this._children.forEach(function (child) {
                child.fireWorldTransformDirty();
            });
        }
    }, {
        key: "saveWorldTransform",
        value: function saveWorldTransform() {
            this._worldTransformDirty = false;
        }
    }, {
        key: "forEachChild",
        value: function forEachChild(process) {
            this._children.forEach(function (child) {
                process(child);
            });
        }

        /**
         * 添加一个绘制子节点。如果子节点已经添加到某节点下，该方法会抛出异常
         * @param {Figure} child 
         */

    }, {
        key: "addChild",
        value: function addChild(child) {
            if (child.parent != null) {
                throw new Error('子节点不能同时挂在多个父节点下,请先将该子节点从原父节点移除后再添加');
            }
            this._children.push(child);
            child.parent = this;
            child.fireWorldTransformDirty();
        }

        /**
         * 删除一个子节点
         * @param {Figure} child 
         */

    }, {
        key: "removeChild",
        value: function removeChild(child) {
            this.removeChildAt(this._children.indexOf(child));
        }

        /**
         * 删除对应位置的子节点
         * @param {Number} index 
         */

    }, {
        key: "removeChildAt",
        value: function removeChildAt(index) {
            if (index < 0 || index > this._children.length - 1) return;
            var c = this._children.splice(index, 1);
            if (c != null && c.length == 1) {
                c[0].parent = null;
                c[0].fireWorldTransformDirty();
            }
        }

        /**
         * 计算当前Figure的矩阵变换。这个方法的调用会和_transformDirty有关，如果_transformDirty为true则会计算变换矩阵，反之不计算.
         * _transformDirty的设置会在Figure的一些属性中更改，保证没有发生过变换坚决不计算
         */

    }, {
        key: "getTransformMatrix",
        value: function getTransformMatrix() {
            if (this.scaleX == 0 || this.scaleY == 0) {
                // this.saveTransform();
                return null;
            }
            var matrix = this._matrix;
            if (this.isTransformDirty()) {
                matrix.identity();
                matrix = matrix.translate(this.x, this.y);
                var tx = this.anchorX * this.width;
                var ty = this.anchorY * this.height;
                if (this.rotation !== 0) {
                    matrix.translate(tx, ty).rotate(this.rotation).translate(-tx, -ty);
                }

                if (this.scaleX !== 1 || this.scaleY !== 1) {
                    matrix.scale(this.scaleX, this.scaleY).translate(tx / this.scaleX - tx, ty / this.scaleY - ty);
                }
                this.saveTransform(); //计算完后设置为false避免下次计算
            }
            return matrix;
        }

        /**
         * 为了避免利用context进行不必要的矩阵相乘，这里保存并计算figure相对于canvas的matrix
         * 这个world transform matrix将会应用到绘制中,舍弃context的transform方法的矩阵连乘
         */

    }, {
        key: "getWorldTransformMatrix",
        value: function getWorldTransformMatrix() {
            // 这里避免计算出现NaN，返回一个null，告诉其他子figure，不用显示
            if (this.scaleX == 0 || this.scaleY == 0) {
                // this.saveWorldTransform();
                return null;
            }
            if (this.isWorldTransformDirty()) {
                if (this.parent) {
                    var matrix = this.getTransformMatrix();
                    if (matrix == null) {
                        // this.saveWorldTransform();
                        return null;
                    }
                    var pw = this.parent.getWorldTransformMatrix();
                    if (pw == null) {
                        // this.saveWorldTransform();
                        return null;
                    }
                    if (pw.isIdentity()) {
                        this._worldMatrix.from(matrix);
                    } else {
                        this._worldMatrix.from(pw);
                        if (!matrix.isIdentity()) {
                            this._worldMatrix.multiply(matrix);
                        }
                    }
                } else {
                    this._worldMatrix.from(this.getTransformMatrix());
                }
                this.saveWorldTransform();
            }
            return this._worldMatrix;
        }
    }, {
        key: "opacity",
        get: function get() {
            if (this._opacityChange) {
                if (this._parent) {
                    this._opacity *= this._parent.opacity;
                }
                this._opacityChange = false;
            }
            return this._opacity;
        },
        set: function set(v) {
            if (this._opacity != v) {
                this._children.forEach(function (child) {
                    child._opacityChange = true;
                });
                this._opacity = v;
            }
        }
    }, {
        key: "children",
        get: function get() {
            return this._children;
        }
    }, {
        key: "parent",
        get: function get() {
            return this._parent;
        },
        set: function set(p) {
            this._parent = p;
        }
    }, {
        key: "width",
        get: function get() {
            return this._width;
        },
        set: function set(v) {
            if (this._width != v) {
                this._width = v;
                this.fireTransformDirty();
            }
        }
    }, {
        key: "height",
        get: function get() {
            return this._height;
        },
        set: function set(v) {
            if (this._height != v) {
                this._height = v;
                this.fireTransformDirty();
            }
        }
    }, {
        key: "scaleX",
        get: function get() {
            return this._scaleX;
        },
        set: function set(v) {
            if (this._scaleX != v) {
                this._scaleX = v;
                this.fireTransformDirty();
            }
        }
    }, {
        key: "scaleY",
        get: function get() {
            return this._scaleY;
        },
        set: function set(v) {
            if (this._scaleY != v) {
                this._scaleY = v;
                this.fireTransformDirty();
            }
        }

        /**
         * Figure基于变换锚点的旋转角度
         * @returns {Number} 角度值
         */

    }, {
        key: "rotation",
        get: function get() {
            return this._rotation;
        },
        set: function set(v) {
            if (this._rotation != v) {
                this._rotation = v;
                this.fireTransformDirty();
            }
        }

        /**
         * 变换锚点。
         * @returns {Map} {x,y} 分别是指该Figure的变换锚点将维护自身高度和宽比的百分比
         */

    }, {
        key: "anchor",
        get: function get() {
            return [this._anchorX, this._anchorY];
        }

        /**
         * 设置Figure的x方向变换锚点百分比
         */

    }, {
        key: "anchorX",
        set: function set(v) {
            if (this._anchorX != v) {
                this._anchorX = v;
                this.fireTransformDirty();
            }
        },
        get: function get() {
            return this._anchorX;
        }

        /**
         * 设置Figure的y方向变换锚点百分比
         */

    }, {
        key: "anchorY",
        set: function set(v) {
            if (this._anchorY != v) {
                this._anchorY = v;
                this.fireTransformDirty();
            }
        },
        get: function get() {
            return this._anchorY;
        }
    }, {
        key: "x",
        get: function get() {
            return this._x;
        },
        set: function set(v) {
            if (this._x != v) {
                this._x = v;
                this.fireTransformDirty();
            }
        }
    }, {
        key: "y",
        get: function get() {
            return this._y;
        },
        set: function set(v) {
            if (this._y != v) {
                this._y = v;
                this.fireTransformDirty();
            }
        }
    }]);

    return Transformable;
}();

exports.default = Transformable;

/***/ }),

/***/ "./build/es5-graph/utils.js":
/*!**********************************!*\
  !*** ./build/es5-graph/utils.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _color = __webpack_require__(/*! ./color.js */ "./build/es5-graph/color.js");

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PI_DIV_180 = Math.PI / 180;
var DRP = pixelRatio();

// 这是为了模拟不能生成Path2D直接绘制的效果
var isWX = false;
if (false) {}else isWX = true;

// Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
var Tvalues = [-0.0640568928626056260850430826247450385909, 0.0640568928626056260850430826247450385909, -0.1911188674736163091586398207570696318404, 0.1911188674736163091586398207570696318404, -0.3150426796961633743867932913198102407864, 0.3150426796961633743867932913198102407864, -0.4337935076260451384870842319133497124524, 0.4337935076260451384870842319133497124524, -0.5454214713888395356583756172183723700107, 0.5454214713888395356583756172183723700107, -0.6480936519369755692524957869107476266696, 0.6480936519369755692524957869107476266696, -0.7401241915785543642438281030999784255232, 0.7401241915785543642438281030999784255232, -0.8200019859739029219539498726697452080761, 0.8200019859739029219539498726697452080761, -0.8864155270044010342131543419821967550873, 0.8864155270044010342131543419821967550873, -0.9382745520027327585236490017087214496548, 0.9382745520027327585236490017087214496548, -0.9747285559713094981983919930081690617411, 0.9747285559713094981983919930081690617411, -0.9951872199970213601799974097007368118745, 0.9951872199970213601799974097007368118745];

// Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
var Cvalues = [0.1279381953467521569740561652246953718517, 0.1279381953467521569740561652246953718517, 0.1258374563468282961213753825111836887264, 0.1258374563468282961213753825111836887264, 0.121670472927803391204463153476262425607, 0.121670472927803391204463153476262425607, 0.1155056680537256013533444839067835598622, 0.1155056680537256013533444839067835598622, 0.1074442701159656347825773424466062227946, 0.1074442701159656347825773424466062227946, 0.0976186521041138882698806644642471544279, 0.0976186521041138882698806644642471544279, 0.086190161531953275917185202983742667185, 0.086190161531953275917185202983742667185, 0.0733464814110803057340336152531165181193, 0.0733464814110803057340336152531165181193, 0.0592985849154367807463677585001085845412, 0.0592985849154367807463677585001085845412, 0.0442774388174198061686027482113382288593, 0.0442774388174198061686027482113382288593, 0.0285313886289336631813078159518782864491, 0.0285313886289336631813078159518782864491, 0.0123412297999871995468056670700372915759, 0.0123412297999871995468056670700372915759];

var ZERO = { x: 0, y: 0, z: 0 };

function derivative(t, order, dpoints) {
    var _3d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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

function derive(points) {
    var _3d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var dpoints = [];
    for (var p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
        var list = [];
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
    var order = 2;
    var points = void 0;
    if (p3 != null) {
        order = 3;
        points = [p0, p1, p2, p3];
    } else {
        points = [p0, p1, p2];
    }
    var dpoints = derive(points);
    for (i = 0; i < len; i++) {
        t = z * Tvalues[i] + z;
        sum += Cvalues[i] * arcfn(t, order, dpoints);
    }
    return z * sum;
}

function arcfn(t, order, dpoints) {
    var _3d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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
    var minX = polygon[0][0];
    var maxX = polygon[0][0];
    var minY = polygon[0][1];
    var maxY = polygon[0][1];
    for (var i = 1; i < polygon.length; i++) {
        var q = polygon[i];
        minX = Math.min(q[0], minX);
        maxX = Math.max(q[0], maxX);
        minY = Math.min(q[1], minY);
        maxY = Math.max(q[1], maxY);
    }

    if (x < minX || x > maxX || y < minY || y > maxY) {
        return false;
    }
    var inside = false;
    for (var _i = 0, j = polygon.length - 1; _i < polygon.length; j = _i++) {
        if (polygon[_i][1] > y != polygon[j][1] > y && x < (polygon[j][0] - polygon[_i][0]) * (y - polygon[_i][1]) / (polygon[j][1] - polygon[_i][1]) + polygon[_i][0]) {
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
    if (isWX) return null;
    if (!window) {
        var path2d = canvas.createPath2D(path);
        if (path2d && path2d.closePath == null) {
            return null;
        }
        return path2d;
    } else {
        return new Path2D(path);
    }
}

function converColorArray(color) {
    if (color.length == 3) {
        return [Math.floor(color[0] * 255), Math.floor(color[1] * 255), Math.floor(color[2] * 255)];
    }
    if (color.length == 4) return [Math.floor(color[0] * 255), Math.floor(color[1] * 255), Math.floor(color[2] * 255), color[3]];
}

function createColorStops(array, length) {
    var colorStops = [];
    for (var i = 0; i < length * 5; i += 5) {
        var color = new _color2.default(converColorArray([array[i], array[i + 1], array[i + 2], array[i + 3]]));
        colorStops.push([array[i + 4], color]);
    }
    return colorStops;
}

exports.default = {
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
};

/***/ }),

/***/ "./build/graph/math/bezier-easing.js":
/*!*******************************************!*\
  !*** ./build/graph/math/bezier-easing.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BezierEasing; });
/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;

const kSplineTableSize = 11;
const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

const float32ArraySupported = typeof Float32Array === 'function';

// function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
// function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
// function C(aA1) { return 3.0 * aA1; }

// // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
// function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
// function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

// function binarySubdivide(aX, aA, aB, mX1, mX2) {
//     var currentX, currentT, i = 0;
//     do {
//         currentT = aA + (aB - aA) / 2.0;
//         currentX = calcBezier(currentT, mX1, mX2) - aX;
//         if (currentX > 0.0) {
//             aB = currentT;
//         } else {
//             aA = currentT;
//         }
//     } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
//     return currentT;
// }

// function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
//     for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
//         var currentSlope = getSlope(aGuessT, mX1, mX2);
//         if (currentSlope === 0.0) {
//             return aGuessT;
//         }
//         var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
//         aGuessT -= currentX / currentSlope;
//     }
//     return aGuessT;
// }

// function LinearEasing(x) {
//     return x;
// }

// export default function bezier(mX1, mY1, mX2, mY2) {
//     if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
//         throw new Error('bezier x values must be in [0, 1] range');
//     }

//     if (mX1 === mY1 && mX2 === mY2) {
//         return LinearEasing;
//     }

//     // Precompute samples table
//     var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
//     for (var i = 0; i < kSplineTableSize; ++i) {
//         sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
//     }

//     function getTForX(aX) {
//         var intervalStart = 0.0;
//         var currentSample = 1;
//         var lastSample = kSplineTableSize - 1;

//         for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
//             intervalStart += kSampleStepSize;
//         }
//         --currentSample;

//         // Interpolate to provide an initial guess for t
//         var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
//         var guessForT = intervalStart + dist * kSampleStepSize;

//         var initialSlope = getSlope(guessForT, mX1, mX2);
//         if (initialSlope >= NEWTON_MIN_SLOPE) {
//             return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
//         } else if (initialSlope === 0.0) {
//             return guessForT;
//         } else {
//             return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
//         }
//     }

//     return function BezierEasing(x) {
//         // Because JavaScript number are imprecise, we should guarantee the extremes are right.
//         if (x === 0 || x === 1) {
//             return x;
//         }
//         return calcBezier(getTForX(x), mY1, mY2);
//     };
// };

// 将他的代码改成es6的类：

class BezierEasing {
    constructor(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }

        this.mY1 = mY1;
        this.mY2 = mY2;
        this.mX1 = mX1;
        this.mX2 = mX2;

        this.linearEasing = false;
        if (mX1 === mY1 && mX2 === mY2) {
            this.linearEasing = true;
        } else {
            // Precompute samples table
            this.sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
            for (var i = 0; i < kSplineTableSize; ++i) {
                this.sampleValues[i] = this.calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }
    }

    easing(x) {
        if (x === 0 || x === 1) {
            return x;
        }
        if (this.linearEasing) return x;
        return this.calcBezier(this.getTForX(x, this.mX1, this.mX2), this.mY1, this.mY2);
    }

    getTForX(aX, mX1, mX2) {
        let intervalStart = 0.0;
        let currentSample = 1;
        let lastSample = kSplineTableSize - 1;
        let sampleValues = this.sampleValues;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;

        // Interpolate to provide an initial guess for t
        let dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        let guessForT = intervalStart + dist * kSampleStepSize;

        let initialSlope = this.getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return this.newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
            return guessForT;
        } else {
            return this.binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
    }

    A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }
    B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
    }
    C(aA1) {
        return 3.0 * aA1;
    }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    calcBezier(aT, aA1, aA2) {
        return ((this.A(aA1, aA2) * aT + this.B(aA1, aA2)) * aT + this.C(aA1)) * aT;
    }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    getSlope(aT, aA1, aA2) {
        return 3.0 * this.A(aA1, aA2) * aT * aT + 2.0 * this.B(aA1, aA2) * aT + this.C(aA1);
    }

    binarySubdivide(aX, aA, aB, mX1, mX2) {
        let currentX,
            currentT,
            i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = this.calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            } else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }

    newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
            let currentSlope = this.getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            let currentX = this.calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
}

/***/ })

/******/ })["default"];
});