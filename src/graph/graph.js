import Figure from "./figure.js";
import ImageFigure from "./image/image_figure.js";
import utils from "./utils.js";

export default class Graph extends Figure {
    constructor(canvas, params) {
        if (canvas == null) throw new Error('Canvas不能为空');
        let ctx = canvas.getContext('2d');
        if (ctx == null) throw new Error('很遗憾,当前设备不支持Canvas2d。或者你看看是不是传入的canvas错了？');
        params = params || {};
        params['clip'] = true;
        super({});
        this._tempCanvas = params['tempCanvas'];
        this.keep = params['keep'];
        this.width = params['canvasWidth'] || canvas._width; // 这tm才是style的大小,找大半天
        if (this.width == null) this.width = canvas.clientWidth;
        this.height = params['canvasHeight'] || canvas._height;
        if (this.height == null) this.height = canvas.clientWidth;

        // graph节点的高度和宽度不能根据pixelRatio调整
        // 调整canvas在内存的实际大小
        canvas.width = utils.DRP * this.width;
        canvas.height = utils.DRP * this.height;
        if (window) {
            // 如果是在浏览器端
            canvas.style.width = this.width + 'px';
            canvas.style.height = this.height + 'px';
        }
        this.ctx = ctx;
        this.ctx.wx_canvas = canvas; //我服了，到处要使用canvas的地方
        this.canvas = canvas;
        // 伸缩自身，因为canvas内存大小都变了
        this.anchorY = 0;
        this.anchorX = 0;
        this.scaleX = utils.DRP;
        this.scaleY = utils.DRP;
        this._rafId, this._rafUpdateId;
    }

    createImage(params) {
        if (params == null) return null;
        let src = params['src'];
        let onload = params['onload'];
        let onerror = params['onerror'];
        if (src == null) {
            if (onerror) onerror('src不能为空');
            return;
        }
        let img = this.canvas.createImage();
        img.onload = function () { if (onload) onload(img) };
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
    createImageFigure(params) {
        if (params == null) return null;
        let src = params['src'];
        let onload = params['onload'];
        let onerror = params['onerror'];
        let width = params['width'] == null ? 0 : params['width'];
        let height = params['height'] == null ? 0 : params['height'];
        let tempCanvas = this._tempCanvas;
        this.createImage({
            src: src,
            onload: function (img) {
                if (onload) {
                    let imageFigure = new ImageFigure({
                        mode: params['mode'],
                        image: img,
                        width: width, height: height,
                        tempCanvas: tempCanvas
                    });
                    onload(imageFigure);
                }
            },
            onerror: function () {
                if (onerror) onerror('图片加载错误,输入路径为 ：' + src);
            }
        });
    }

    draw(ctx) {
        if (this.keep == null) {
            // 如果不保存之前绘制结果就直接清除
            ctx.clearRect(0, 0, this.width, this.height);
        } else {

        }
        super.draw(ctx);
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
    startRAF(params) {
        if (this._rafId == null) {
            this._stopRAF = false;
            let beforeDraw, afterDraw;
            if (params) {
                beforeDraw = params['beforeDraw'];
                afterDraw = params['afterDraw'];
            }
            let canvas = this.canvas;
            let that = this;
            refresh();
            function refresh() {
                if (beforeDraw) beforeDraw();
                that.update(false);
                if (afterDraw) afterDraw();

                if (that._stopRAF) {
                    that._stopRAF = false;
                    that._rafId = null;
                    return;
                }
                that._rafId = utils.requestAnimationFrame(canvas, refresh);
                // that._rafId = canvas.requestAnimationFrame(refresh);
            }
            return true;
        }
        return false;
    }

    /**
     * 取消定时刷新
     */
    endRAF() {
        if (this._rafId != null) {
            utils.cancelAnimationFrame(this.canvas, this._rafId);
            this._rafId = null;
            this._stopRAF = true;
        }
    }

    get rAFisRunning() {
        return this._rafId != null;
    }

    /**
     * 重绘整个Graph。带入参数如果为true，则会将绘制压入rAF中；为false立即开始绘制。参数默认值为true
     * @param {Boolean} raf 默认值true
     */
    update(raf = true, afterUpdate) {
        if (raf) {
            let ctx = this.ctx;
            let that = this;
            if (this._rafUpdateId) {
                utils.cancelAnimationFrame(this.canvas, this._rafUpdateId);
            }
            this._rafUpdateId = utils.requestAnimationFrame(this.canvas, function () {
                that.draw(ctx);
                that._rafUpdateId = null;
                if (afterUpdate) afterUpdate();
            });
        } else
            this.draw(this.ctx);
    }
}