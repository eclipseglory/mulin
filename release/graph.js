(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["graph"] = factory();
	else
		root["graph"] = factory();
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

var _image_figure = __webpack_require__(/*! ./image/image_figure.js */ "./build/es5-graph/image/image_figure.js");

var _image_figure2 = _interopRequireDefault(_image_figure);

var _line = __webpack_require__(/*! ./line/line.js */ "./build/es5-graph/line/line.js");

var _line2 = _interopRequireDefault(_line);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '0.0.1';
var style = "color:red;background-color:yellow";

var outdefine = {
    version: version,
    Graph: _graph2.default,
    Figure: _figure2.default,
    image: {
        ImageFiguer: _image_figure2.default
    },
    line: {
        Line: _line2.default
    },
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

console.log("%c Graph(version " + version + ") by 老脸", style);
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

var _matrix = __webpack_require__(/*! ./math/matrix3.js */ "./build/es5-graph/math/matrix3.js");

var _matrix2 = _interopRequireDefault(_matrix);

var _utils = __webpack_require__(/*! ./utils.js */ "./build/es5-graph/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PI_DIV_180 = Math.PI / 180;
var _DPR = wx.getSystemInfoSync().pixelRatio;

/**
 * 绘制基类，定义了一些图形的基本属性，例如左上角坐标以及图形大小
 * 在绘制的时候采用迭代绘制子节点的方式
 */

var Figure = function () {
    function Figure(params) {
        _classCallCheck(this, Figure);

        params = params || {};
        this._x = params['x'] == null ? 0 : params['x'];
        this._y = params['y'] == null ? 0 : params['y'];
        this._width = params['width'] == null ? 0 : params['width'];
        this._height = params['height'] == null ? 0 : params['height'];
        //默认变换锚点位置在中心
        this._anchor = params['anchor'] == null ? { x: 0.5, y: 0.5 } : params['anchor'];
        this._rotate = params['rotate'] == null ? 0 : params['rotate'];
        this._scaleX = params['scaleX'] == null ? 1 : params['scaleX'];
        this._scaleY = params['scaleY'] == null ? 1 : params['scaleY'];
        this.opacity = params['opacity'] == null ? 1 : params['opacity'];
        this._hidden = params['hidden'] == null ? false : params['hidden'];
        this._clip = params['clip'] == null ? false : params['clip'];

        this._children = [];
        this._transformDirty = true;
        this._contentDirty = true;
        this._currentTransformMatrix = new _matrix2.default();
        this._parent;
    }

    _createClass(Figure, [{
        key: "centerMe",


        /**
         * 设置节点的的中心位置位于父节点的中心 
         */
        value: function centerMe() {
            if (this._parent != null) {
                this.x = Math.floor((this._parent.width - this.width) / 2);
                this.y = Math.floor((this._parent.height - this.height) / 2);
            }
        }

        /**
         * 添加一个绘制子节点。如果子节点已经添加到某节点下，该方法会抛出异常
         * @param {Figure} child 
         */

    }, {
        key: "addChild",
        value: function addChild(child) {
            if (child._parent != null) {
                throw new Error('子节点不能同时挂在多个父节点下,请先将该子节点从原父节点移除后再添加');
            }
            this._children.push(child);
            child._parent = this;
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
                c[0]._parent = null;
            }
        }

        /**
         * 绘制Figure自身,需要继承类复写。
         * 所有Figure绘制都是从{0,0}点开始的，切勿使用自身的x和y，否则绘制结果会出问题
         * @param {CanvasRenderingContext2D} context 
         * @param {Number} width Figure绘制区域宽度
         * @param {Number} height Figure绘制区域高度
         */

    }, {
        key: "_drawSelf",
        value: function _drawSelf(context, width, height) {}

        /**
         * 绘制Figure的子节点
         * @param {CanvasRenderingContext2D} context 
         */

    }, {
        key: "_drawChildren",
        value: function _drawChildren(context) {
            this._children.forEach(function (child) {
                return child.draw(context);
            });
        }

        /**
         * Figure是否可以绘制
         */

    }, {
        key: "canDraw",
        value: function canDraw() {
            return this.width != 0 && this.height != 0 && this.opacity != 0 && !this.hidden;
        }

        /**
         * 绘制整个Figure
         * @param {CanvasRenderingContext2D} context 
         */

    }, {
        key: "draw",
        value: function draw(context) {
            if (!this.canDraw()) return;
            context.save();
            this._applyCurrentTransform(context);
            this._applyCurrentDrawingStates(context);
            this._drawSelf(context, this.width, this.height);
            this._drawChildren(context);
            context.restore();
        }

        /**
         * 设置当前Figure的绘制状态，例如透明度、填充色等
         */

    }, {
        key: "_applyCurrentDrawingStates",
        value: function _applyCurrentDrawingStates(context) {
            context.globalAlpha = this.opacity;
        }

        /**
         * 计算当前Figure的矩阵变换。这个方法的调用会和_transformDirty有关，如果_transformDirty为true则会计算变换矩阵，反之不计算.
         * _transformDirty的设置会在Figure的一些属性中更改，保证没有发生过变换坚决不计算
         */

    }, {
        key: "_calculateTransformMatrix",
        value: function _calculateTransformMatrix() {
            var matrix = this._currentTransformMatrix;
            if (this._transformDirty) {
                var temp = _matrix2.default.TEMP; //这个temp就一个静态的，除了我其他人不得使用
                matrix = matrix.translate(this.x, this.y);
                var tx = this.anchor.x * this.width;
                var ty = this.anchor.y * this.height;
                if (this.rotate !== 0) {
                    matrix = matrix.multiply(temp.translate(tx, ty));
                    matrix = matrix.multiply(temp.rotate(this.rotate * PI_DIV_180));
                    matrix = matrix.multiply(temp.translate(-tx, -ty));
                }

                if (this.scaleX !== 1 || this.scaleY !== 1) {
                    matrix = matrix.multiply(temp.scale(this.scaleX, this.scaleY));
                    matrix = matrix.multiply(temp.translate(tx / this.scaleX - tx, ty / this.scaleY - ty));
                }
                this._transformDirty = false; //计算完后设置为false避免下次计算
            }
            return matrix;
        }

        /**
         * 应用当前Figure的矩阵变换。
         * @param {CanvasRenderingContext2D} context 
         */

    }, {
        key: "_applyCurrentTransform",
        value: function _applyCurrentTransform(context) {
            var matrix = this._calculateTransformMatrix();
            var data = matrix.data;
            // 这里注意，CanvasRenderingContext2D的参数（a,b,c,d,e,f）的transform数据对应矩阵和我自己的只有6个数的3x3矩阵：
            // a,c,e    a0 a1 a2
            // b,d,f => a3 a4 a5
            // 0,0,1    0  0  1
            // 所以我要给的参数是：(a0,a3,a1,a4,a2,a5)
            context.transform(data[0], data[3], data[1], data[4], data[2], data[5]);
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
    }, {
        key: "clip",
        get: function get() {
            return this._clip;
        },
        set: function set(c) {
            this._clip = c;
        }
    }, {
        key: "hidden",
        set: function set(v) {
            this._hidden = v;
        },
        get: function get() {
            return this._hidden;
        }
    }, {
        key: "scaleX",
        get: function get() {
            return this._scaleX;
        },
        set: function set(v) {
            if (this._scaleX != v) {
                this._scaleX = v;
                this._transformDirty = true;
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
                this._transformDirty = true;
            }
        }

        /**
         * Figure基于变换锚点的旋转角度
         * @returns {Number} 角度值
         */

    }, {
        key: "rotate",
        get: function get() {
            return this._rotate;
        },
        set: function set(v) {
            if (this._rotate != v) {
                this._rotate = v;
                if (Math.abs(this._rotate) >= 360) {
                    this._rotate = this._rotate % 360;
                }
                this._transformDirty = true;
            }
        }

        /**
         * Figure变换锚点。
         * @returns {Map} {x,y} 分别是指该Figure的变换锚点将维护自身高度和宽比的百分比
         */

    }, {
        key: "anchor",
        get: function get() {
            return this._anchor;
        }

        /**
         * 设置Figure的x方向变换锚点百分比
         */

    }, {
        key: "anchorX",
        set: function set(v) {
            if (this._anchor.x != v) {
                this._anchor.x = v;
                this._transformDirty = true;
            }
        }
        /**
         * 设置Figure的y方向变换锚点百分比
         */

    }, {
        key: "anchorY",
        set: function set(v) {
            if (this._anchor.y != v) {
                this._anchor.y = v;
                this._transformDirty = true;
            }
        }

        /**
         * Figure位于父节点的左上角x值
         */

    }, {
        key: "left",
        get: function get() {
            return this.x;
        }
        /**
         * Figure位于父节点的左上角y值
         */

    }, {
        key: "top",
        get: function get() {
            return this.y;
        }
        /**
         * Figure位于父节点的右上角x值
         */

    }, {
        key: "right",
        get: function get() {
            return this.x + this.width;
        }
        /**
         * Figure位于父节点的右下角y值
         */

    }, {
        key: "bottom",
        get: function get() {
            return this.y + this.height;
        }

        /**
         * Figure位于父节点的左上角x值
         */

    }, {
        key: "x",
        get: function get() {
            return this._x;
        },
        set: function set(v) {
            if (this._x != v) {
                this._x = v;
                this._transformDirty = true;
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
                this._transformDirty = true;
            }
        }
    }, {
        key: "width",
        get: function get() {
            return this._width;
        },
        set: function set(v) {
            if (this._width != v) {
                this._width = v;
                this._contentDirty = true;
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
                this._contentDirty = true;
            }
        }
    }, {
        key: "children",
        get: function get() {
            return this._children;
        }
    }], [{
        key: "PIDIV180",
        get: function get() {
            return PI_DIV_180;
        }
    }, {
        key: "DRP",
        get: function get() {
            return _DPR;
        }
    }]);

    return Figure;
}();

exports.default = Figure;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _figure = __webpack_require__(/*! ./figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

var _image_figure = __webpack_require__(/*! ./image/image_figure.js */ "./build/es5-graph/image/image_figure.js");

var _image_figure2 = _interopRequireDefault(_image_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Graph = function (_Figure) {
    _inherits(Graph, _Figure);

    function Graph(canvas, params) {
        _classCallCheck(this, Graph);

        if (canvas == null) throw new Error('Canvas不能为空');
        var ctx = canvas.getContext('2d');
        if (ctx == null) throw new Error('很遗憾,当前设备不支持Canvas2d。或者你看看是不是传入的canvas错了？');
        params = params || {};
        params['clip'] = true;

        var _this = _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, {}));

        _this._tempCanvas = params['tempCanvas'];
        _this.width = params['canvasWidth'] || canvas._width; // 这tm才是style的大小,找大半天
        _this.height = params['canvasHeight'] || canvas._height;
        // graph节点的高度和宽度不能根据pixelRatio调整
        // 调整canvas在内存的实际大小
        canvas.width = _figure2.default.DRP * _this.width;
        canvas.height = _figure2.default.DRP * _this.height;
        _this.ctx = ctx;
        _this.ctx.wx_canvas = canvas; //我服了，到处要使用canvas的地方
        _this.canvas = canvas;
        // 伸缩自身，因为canvas内存大小都变了
        // 不用自己的scale是因为那个是基于中心拉伸的，直接让ctx的transform matrix拉伸即可
        _this.ctx.scale(_figure2.default.DRP, _figure2.default.DRP);
        _this._rafId, _this._rafUpdateId;
        return _this;
    }

    _createClass(Graph, [{
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
                        var imageFigure = new _image_figure2.default({
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
            // 根节点每次绘制都清空自身
            // 注意！如果需要保留之前绘制结果，这个方法需要复写，具体如何保留之前绘制内容，可以参考CanvasRendingContext2d的Blend
            ctx.clearRect(0, 0, this.width, this.height);
            _get(Graph.prototype.__proto__ || Object.getPrototypeOf(Graph.prototype), "draw", this).call(this, ctx);
        }

        /**
         * 调用此方法，Graph会利用requestAnimationFrame定时重绘。如果已经开始了定时重绘，则调用该方法无效。
         * 方法参数中可以定义两个方法，一个是beforeDraw,传入方法会在每次绘制之前调用；
         * 另一个是afterDraw,该传入方法会在每次绘制结束后调用。
         * 这两个通常可以用来对Figure进行一些修改，以达到某些显示更新后Figure的目的，比如移动、旋转某Figure。
         * 但是由于性能问题，该方法尽量在需要时开启，达到目的后用endRAF方法停止
         * @param {Map<String,Function>} params 
         */

    }, {
        key: "startRAF",
        value: function startRAF(params) {
            if (this._rafId == null) {
                var _refresh = function _refresh() {
                    if (beforeDraw) beforeDraw();
                    that.update(false);
                    if (afterDraw) afterDraw();
                    that._rafId = canvas.requestAnimationFrame(_refresh);
                };

                var beforeDraw = void 0,
                    afterDraw = void 0;
                if (params) {
                    beforeDraw = params['beforeDraw'];
                    afterDraw = params['afterDraw'];
                }
                var canvas = this.canvas;
                var that = this;
                _refresh();
            }
        }

        /**
         * 取消定时刷新
         */

    }, {
        key: "endRAF",
        value: function endRAF() {
            if (this._rafId != null) {
                this.canvas.cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        }
    }, {
        key: "update",


        /**
         * 重绘整个Graph。带入参数如果为true，则会将绘制压入rAF中；为false立即开始绘制。参数默认值为true
         * @param {Boolean} raf 默认值true
         */
        value: function update() {
            var raf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (raf) {
                var ctx = this.ctx;
                var that = this;
                if (this._rafUpdateId) {
                    this.canvas.cancelAnimationFrame(this._rafUpdateId);
                }
                this._rafUpdateId = this.canvas.requestAnimationFrame(function () {
                    that.draw(ctx);
                    that._rafUpdateId = null;
                });
            } else this.draw(this.ctx);
        }
    }, {
        key: "rAFisRunning",
        get: function get() {
            return this._rafId != null;
        }
    }]);

    return Graph;
}(_figure2.default);

exports.default = Graph;

/***/ }),

/***/ "./build/es5-graph/image/image_figure.js":
/*!***********************************************!*\
  !*** ./build/es5-graph/image/image_figure.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _figure = __webpack_require__(/*! ../figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

var _graph = __webpack_require__(/*! ../graph.js */ "./build/es5-graph/graph.js");

var _graph2 = _interopRequireDefault(_graph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ASPECT_FILL = 'aspectFill';
var SCALE_FILL = 'scaleToFill';
var ASPECT_FIT = 'aspectFit';

var POSTION_CENTER = 'center';

var ImageFigure = function (_Figure) {
    _inherits(ImageFigure, _Figure);

    function ImageFigure(params) {
        _classCallCheck(this, ImageFigure);

        params = params || {};

        var _this = _possibleConstructorReturn(this, (ImageFigure.__proto__ || Object.getPrototypeOf(ImageFigure)).call(this, params));

        _this._image = params['image'];
        _this._mode = params['mode'] || SCALE_FILL;
        _this._position = params['position'] || POSTION_CENTER;
        //这个参数可以手动给，使用Graph的createImageFigure方法，会自动检测有没有设置临时Canvas，有的话就传入
        _this._tempCanvas = params['tempCanvas'];
        return _this;
    }

    _createClass(ImageFigure, [{
        key: "setBoundsWithImageAspect",


        /**
         * 根据已有的image比例来设置自己的绘制区域。传入参数如果为空，绘制区域高度和宽度和图片设置一样。
         * 如果传入参数带有width,则将绘制区域宽度设置为width，高度将会按照image比例设置。
         * 如果没有width，则看有没有height参数。
         * @param {Map<Number,Number>} params {width : 整数 ; sheight : 整数}
         */
        value: function setBoundsWithImageAspect(params) {
            if (this._image == null) return;
            if (params == null) {
                this.width = this._image.width;
                this.height = this._image.height;
            } else {
                var w = params['width'];
                var h = params['height'];
                var imgW = this._image.width;
                var imgH = this._image.height;
                if (w != null) {
                    this.width = w;
                    this.height = Math.floor(w * imgH / imgW);
                } else {
                    if (h != null) {
                        this.height = h;
                        this.width = Math.floor(h * imgW / imgH);
                    }
                }
            }
        }
    }, {
        key: "_paintImage",
        value: function _paintImage(ctx, w, h, imgWidth, imgHeight) {

            /**@TODO 关于POSITION属性还没有做 ，图片不管任何模式现在都是居中*/

            // ScaleFill模式，就是让图片填充到整个绘制区域
            if (this._mode == SCALE_FILL) {
                ctx.drawImage(this._image, 0, 0, w, h);
                return;
            }

            //Aspect Fill,填充图片的最短边，另外一条边会被切割
            if (this._mode == ASPECT_FILL) {
                // sw/sh = imgWidth/imgHeight
                var sw = imgWidth;
                var sh = Math.floor(sw * h / w);
                if (sh > imgHeight) {
                    sh = imgHeight;
                    sw = Math.floor(sh * w / h);
                }
                var sx = Math.floor((imgWidth - sw) / 2);
                var sy = Math.floor((imgHeight - sh) / 2);
                if (this._position == POSTION_CENTER) {}

                ctx.drawImage(this._image, sx, sy, sw, sh, 0, 0, w, h);
                return;
            }
            // Aspect Fit，整个图片等比例缩放，最长边会本完全显示
            if (this._mode == ASPECT_FIT) {
                var tw = w;
                var th = Math.floor(tw * imgHeight / imgWidth);
                if (th > h) {
                    th = h;
                    tw = Math.floor(th * imgWidth / imgHeight);
                }
                var tx = Math.floor((w - tw) / 2);
                var ty = Math.floor((h - th) / 2);
                ctx.drawImage(this._image, tx, ty, tw, th);
                return;
            }
        }
    }, {
        key: "_drawSelf",
        value: function _drawSelf(context, w, h) {
            /**@TODO 这里需要离屏canvas和webgl来做性能优化以及filter，但是由于离屏canvas不支持toDataURL方法，只能手动设置一个在屏的 */
            /**@TODO 在屏的临时canvas还没有实现webgl绘图以及filter */
            if (this.image == null || this.width == 0 || this.height == 0) return;
            var imgWidth = this._image.width;
            var imgHeight = this._image.height;
            var ctx = context;
            if (this._contentDirty) {
                if (this._tempCanvas != null) {
                    //利用临时Canvas先绘制剪切过的Image
                    this._tempCanvas.width = w; //* Figure.DRP;
                    this._tempCanvas.height = h; //* Figure.DRP;
                    var tempCtx = this._tempCanvas.getContext('2d');
                    // tempCtx.scale(Figure.DRP, Figure.DRP);
                    this._paintImage(tempCtx, w, h, imgWidth, imgHeight);
                    this._tempImage = this._tempCanvas.createImage();
                    var that = this;
                    this._tempImage.onload = function () {
                        that._contentDirty = false;
                        var root = that.getRoot();
                        if (root instanceof _graph2.default) {
                            // 生好了图片后，通知Graph，rAF刷新一次
                            root.update(true);
                        }
                    };
                    this._tempImage.onerror = function () {
                        console.error('临时canvas绘制生成image发生错误');
                    };
                    this._tempImage.src = this._tempCanvas.toDataURL();
                } else {
                    this._paintImage(context, w, h, imgWidth, imgHeight);
                }
            } else {
                /**@TODO 绘制的时候没有考虑PixelRatio，因为不想再让绘制缩放计算一次，很有可能会造成绘制出来的图片像素低。
                 * 要解决这问题，可以在 drawImage 传入当前的宽度和高度，在绘制临时图片的时候放大临时canvas，但这样一来双缓冲就没意义了
                 */
                if (this._tempImage != null) ctx.drawImage(this._tempImage, 0, 0);
            }
        }
    }, {
        key: "mode",
        get: function get() {
            return this._mode;
        },
        set: function set(v) {
            if (this._mode != v) {
                this._mode = v;
                this._contentDirty = true;
            }
        }
    }, {
        key: "position",
        get: function get() {
            return this._position;
        },
        set: function set(v) {
            if (this._position != v) {
                this._position = v;
                this._contentDirty = true;
            }
        }
    }, {
        key: "image",
        get: function get() {
            return this._image;
        },
        set: function set(img) {
            if (this._image != img) {
                this._image = img;
                this._contentDirty = true;
            }
        }
    }]);

    return ImageFigure;
}(_figure2.default);

exports.default = ImageFigure;

/***/ }),

/***/ "./build/es5-graph/line/line.js":
/*!**************************************!*\
  !*** ./build/es5-graph/line/line.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _figure = __webpack_require__(/*! ../figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* 线较为特殊，所以不让它具有width，height，x，y属性，也就不让它能够自动实现变换。
* 另外也不允许他拥有子节点,所以不必从Figure继承。
但由于js没有接口，只能是将很多方法跟Figure同名，便于其他Figure调用
 */
var Line = function () {
    function Line(params) {
        _classCallCheck(this, Line);

        params = params || {};
        this._hidden = params['hidden'] == null ? false : params['hidden'];
        this._points = params['points'] || [];
        this.color = params['color'] || '#000000';
        this.width = params['width'] == null ? 1 : params['width'];
        // Cap的值为 round , square , butt
        this.cap = params['cap'] || 'round';
        // join的值为 "bevel" || "round" || "miter"
        this.join = params['join'] || 'round';
        this.lineDash = params['lineDash'] || []; // 默认实线
        this.miterLimit = params['miterLimit'] == null ? 10 : params['miterLimit']; // 默认为10
        this.dashOffset = params['dashOffset'] == null ? 0 : params['dashOffset']; // 默认值为0
        this._mode = params['mode'] || 'direct';
        // this._close = params['close'] == null ? false : params['close'];
        // this._f = params['f'] == null ? 0.3 : params['f'];
        // this._t = params['t'] == null ? 0.6 : params['t'];
        this._path2d;
        this._contentDirty = true;
    }

    _createClass(Line, [{
        key: 'addPoint',
        value: function addPoint(p) {
            this._points.push(p);
            this._contentDirty = true;
        }
    }, {
        key: 'removePointAt',
        value: function removePointAt(index) {
            if (index < 0 || index > this._points.length - 1) return;
            this._points.splice(index, 1);
            this._contentDirty = true;
        }

        /**
         * 不推荐使用，将会被删除
         * @deprecated
         * @param {Object>} p 
         */

    }, {
        key: 'removePoint',
        value: function removePoint(p) {
            this.removePointAt(this._points.indexOf(p));
        }
    }, {
        key: '_applyCurrentDrawingStates',
        value: function _applyCurrentDrawingStates(ctx) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.lineCap = this.cap;
            ctx.lineJoin = this.join;
            ctx.lineDashOffset = this.dashOffset;
            ctx.lineMiterLimit = this.miterLimit;
            ctx.setLineDash(this.lineDash);
        }
    }, {
        key: 'canDraw',
        value: function canDraw() {
            return this.color != null && this.opacity != 0 && this.lineWidth != 0 && !this.hidden;
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {
            if (!this.canDraw()) return;
            ctx.save();
            this._applyCurrentDrawingStates(ctx);
            this._drawSelf(ctx);
            ctx.restore();
        }
    }, {
        key: '_drawSelf',
        value: function _drawSelf(ctx) {
            if (this._points.length < 2) return;
            var first = this._points[0];
            if (first == null) return;
            if (this._contentDirty) {
                if (this._path2d == null) {
                    this._path2d = ctx.wx_canvas.createPath2D();
                }
                if (this._path2d) this._createLine(this.path2d);
                this._contentDirty = false;
            }

            if (this._path2d != null) {
                ctx.stroke(this._path2d);
            } else {
                //说明根本就没有path2d这东西，直接画
                this._createLine(ctx);
                ctx.stroke();
            }
        }

        /**
         * 根据所有点创建一个线的path
         * @param {CanvasRenderingContext2D} ctx 也可以是Path2D 
         */

    }, {
        key: '_createLine',
        value: function _createLine(ctx) {
            var first = this._points[0];
            ctx.beginPath();
            if (this._mode == 'direct') {
                ctx.moveTo(first.x, first.y);
                for (var i = 1; i < this._points.length; i++) {
                    var p = this._points[i];
                    ctx.lineTo(p.x, p.y);
                }
            }

            if (this._mode == 'curved') {
                this.bzCurve(ctx, this._points);
            }
        }
    }, {
        key: '_gradient',
        value: function _gradient(a, b) {
            return (b.y - a.y) / (b.x - a.x);
        }
        /**
         * @param {CanvasRenderingContext2D} ctx 
         * @param {Array} points 
         * @param {Number} f 
         * @param {Number} t 
         */

    }, {
        key: 'bzCurve',
        value: function bzCurve(ctx, points, f, t) {
            ctx.moveTo(points[0].x, points[0].y);

            var m = 0,
                dx1 = 0,
                dy1 = 0;

            var preP = points[0];
            for (var i = 1; i < points.length; i++) {
                var curP = points[i];
                // let nexP = points[i + 1];
                // let dx2, dy2;
                // if (nexP) {
                //     m = this._gradient(preP, nexP);
                //     dx2 = (nexP.x - curP.x) * -f;
                //     dy2 = dx2 * m * t;
                // } else {
                //     dx2 = 0;
                //     dy2 = 0;
                // }

                // ctx.bezierCurveTo(
                //     preP.x - dx1, preP.y - dy1,
                //     curP.x + dx2, curP.y + dy2,
                //     curP.x, curP.y
                // );
                ctx.bezierCurveTo((preP.x + curP.x) / 2, preP.y, (curP.x + preP.x) / 2, curP.y, curP.x, curP.y);
                // dx1 = dx2;
                // dy1 = dy2;
                preP = curP;
            }
        }
    }, {
        key: 'mode',
        get: function get() {
            return this._mode;
        },
        set: function set(m) {
            if (this._mode != m) {
                this._mode = m;
                this._contentDirty = true;
            }
        }
    }, {
        key: 'hidden',
        get: function get() {
            return this._hidden;
        },
        set: function set(h) {
            this._hidden = h;
        }
    }, {
        key: 'points',
        get: function get() {
            return this._points;
        }
    }]);

    return Line;
}();

exports.default = Line;

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
    function Matrix3(array) {
        _classCallCheck(this, Matrix3);

        this._array = array || new Float32Array(6);
    }

    /** 这个方法仅允许我使用 */


    _createClass(Matrix3, [{
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
            var m = this.data;
            var c = Math.cos(radian);
            var s = Math.sin(radian);
            m[0] = c, m[1] = -s, m[2] = 0;
            m[3] = s, m[4] = c, m[5] = 0;
            return this;
        }
    }, {
        key: "scale",
        value: function scale(scalex, scaley) {
            var m = this.data;
            m[0] = scalex, m[1] = 0, m[2] = 0;
            m[3] = 0, m[4] = scaley, m[5] = 0;
            return this;
        }
    }, {
        key: "translate",
        value: function translate(x, y) {
            var m = this.data;
            m[0] = 1, m[1] = 0, m[2] = x;
            m[3] = 0, m[4] = 1, m[5] = y;
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
    }, {
        key: "multiply",
        value: function multiply(m) {
            var b = m.data;
            return this.multiplyWithDatas(b[0], b[3], b[1], b[4], b[2], b[5]);
            // let b00 = b[0], b01 = b[3];// b02 = b[2];
            // let b10 = b[1], b11 = b[4];// b12 = b[5];
            // let b20 = b[2], b21 = b[5];// b22 = b[8];
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

var _shape = __webpack_require__(/*! ./shape.js */ "./build/es5-graph/shapes/shape.js");

var _shape2 = _interopRequireDefault(_shape);

var _figure = __webpack_require__(/*! ../figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = function (_Shape) {
    _inherits(Circle, _Shape);

    function Circle(params) {
        _classCallCheck(this, Circle);

        params = params || {};

        var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, params));

        _this._radius = params['radius'] == null ? 0 : params['radius'];
        _this._angle = params['angle'] == null ? 360 : params['angle'];
        _this._center;
        return _this;
    }
    // 不允许再设置宽度和高度，统一设置半径


    _createClass(Circle, [{
        key: "_createShapePath",
        value: function _createShapePath(ctx, w, h) {
            ctx.beginPath();
            var center = this.center;
            if (Math.abs(this._angle) >= 360) ctx.arc(center.x, center.y, this.radius, 0, Math.PI * 2);else {
                ctx.moveTo(center.x, center.y);
                var anclock = this.angle < 0;
                ctx.arc(center.x, center.y, this.radius, 0, this._angle * _figure2.default.PIDIV180, anclock);
            }
            ctx.closePath();
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
                this._contentDirty = true;
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
                this._contentDirty = true;
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

var _shape = __webpack_require__(/*! ./shape.js */ "./build/es5-graph/shapes/shape.js");

var _shape2 = _interopRequireDefault(_shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HALF_PI = Math.PI / 2;

var Rectangle = function (_Shape) {
    _inherits(Rectangle, _Shape);

    function Rectangle(params) {
        _classCallCheck(this, Rectangle);

        params = params || {};

        var _this = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, params));

        _this._radius = params['radius'] == null ? 0 : params['radius'];
        return _this;
    }

    _createClass(Rectangle, [{
        key: '_createShapePath',
        value: function _createShapePath(ctx, w, h) {
            ctx.beginPath();
            if (this.radius == 0) {
                ctx.rect(0, 0, w, h);
            } else {
                var min = Math.min(w, h);
                if (this.radius > min / 2) throw new Error('圆角矩形半径怎么可能大于它的宽度或者长度一半呢?');
                var r = this.radius;
                ctx.moveTo(r, 0);
                ctx.lineTo(w - r, 0);
                ctx.arc(w - r, r, r, -HALF_PI, 0);
                ctx.lineTo(w, h - r);
                ctx.arc(w - r, h - r, r, 0, HALF_PI);
                ctx.lineTo(r, h);
                ctx.arc(r, h - r, r, HALF_PI, Math.PI);
                ctx.lineTo(0, r);
                ctx.arc(r, r, r, Math.PI, Math.PI + HALF_PI);
            }
            ctx.closePath();
        }
    }, {
        key: 'radius',
        get: function get() {
            return this._radius;
        },
        set: function set(v) {
            if (this._radius != v) {
                this._radius = v;
                this._contentDirty = true;
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

var _figure = __webpack_require__(/*! ../figure.js */ "./build/es5-graph/figure.js");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 几回图形绘制基类
 */
var Shape = function (_Figure) {
    _inherits(Shape, _Figure);

    function Shape(params) {
        _classCallCheck(this, Shape);

        params = params || {};

        var _this = _possibleConstructorReturn(this, (Shape.__proto__ || Object.getPrototypeOf(Shape)).call(this, params));

        _this.fillColor = params['color'] == null ? '#000000' : params['color'];
        _this.borderColor = params['borderColor']; //默认不绘制border
        _this.borderWidth = params['borderWidth'] == null ? 0 : params['borderWidth']; // ctx默认的线宽度是1，不能改小
        _this.borderStyle = params['borderWidth'] == null ? 'solid' : params['borderWidth'];

        _this._path2D = null;
        return _this;
    }

    _createClass(Shape, [{
        key: '_applyCurrentDrawingStates',
        value: function _applyCurrentDrawingStates(ctx) {
            _get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), '_applyCurrentDrawingStates', this).call(this, ctx);
            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
        }
    }, {
        key: 'canDraw',
        value: function canDraw() {
            return (this.fillColor != null || this.strokeColor != null && this.borderWidth != 0) && _get(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), 'canDraw', this).call(this);
        }
    }, {
        key: '_drawSelf',
        value: function _drawSelf(ctx, w, h) {

            if (this._contentDirty) {
                // 真机上不允许createPath2D参数为null
                this._path2D = ctx.wx_canvas.createPath2D();
                if (this._path2D && this._path2D.beginPath == null) {
                    this._path2D = null;
                    //真机上path2d创建出来是一个object，根本不能用
                }
                if (this._path2D) this._createShapePath(this._path2D, w, h);
            }
            if (this._path2D == null) {
                this._createShapePath(ctx, w, h);
            }

            if (this._clip) {
                if (this._path2D != null) {
                    ctx.clip(this.path2D);
                } else {
                    ctx.clip();
                }
            }
            if (this.fillColor != null) {
                if (this._path2D != null) ctx.fill(this._path2D);else ctx.fill();
            }

            if (this.borderWidth != 0 && this.borderColor != null) {
                if (this._path2D != null) ctx.stroke(this._path2D);else ctx.stroke();
            }
        }

        /**
         * 几何图形构建自己的几何路径
         * @param {CanvasRenderingContext2D} ctx 
         * @param {Number} w 
         * @param {Number} h 
         */

    }, {
        key: '_createShapePath',
        value: function _createShapePath(ctx, w, h) {}
    }]);

    return Shape;
}(_figure2.default);

exports.default = Shape;

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
        _this.align = params['align'] || 'center';
        _this.baseLine = params['baseLine'] || 'middle';
        _this._anchor.x = 0;
        _this._anchor.y = 0;
        return _this;
    }
    // set anchor() { }
    // get anchor() { return super.anchor; }
    // 文字的x，y将是整个Figure的中心，这里需要复写


    _createClass(Text, [{
        key: 'centerMe',
        value: function centerMe() {
            if (this._parent != null) {
                this.x = this._parent.width / 2;
                this.y = this._parent.height / 2;
            }
        }

        // 文字的x，y是中心，所以顶点数据和一般的figure不同，需要复习该方法

    }, {
        key: 'getVertex',
        value: function getVertex() {
            var width = this.width;
            var height = this.height;
            return [[-width / 2, -height / 2], [width, -height / 2], [width, height], [-width / 2, height]];
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
            ctx.textBaseline = this.baseLine;
            ctx.textAlign = this.align;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            _get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), '_applyCurrentDrawingStates', this).call(this, ctx);
        }
    }, {
        key: '_drawSelf',
        value: function _drawSelf(ctx, w, h) {
            ctx.save();
            if (this.maxWidth != null) {
                ctx.fillText(this._text, 0, 0, this.maxWidth);
                if (this.borderWidth != 0 && this.borderColor != null) {
                    ctx.strokeText(this._text, 0, 0, this.maxWidth);
                }
            } else {
                ctx.fillText(this._text, 0, 0);
                if (this.borderWidth != 0 && this.borderColor != null) {
                    ctx.strokeText(this._text, 0, 0);
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
                        this._width = parent.ctx.measureText(this._text).width;
                        parent.ctx.restore();
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
        //我经常这么干

    }, {
        key: 'height',
        set: function set(h) {},
        get: function get() {
            return this._fontSize * 1.5;
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
            }
        }
    }]);

    return Text;
}(_figure2.default);

exports.default = Text;

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

exports.default = {
    isPointInPolygon: isPointInPolygon
};

/***/ })

/******/ })["default"];
});