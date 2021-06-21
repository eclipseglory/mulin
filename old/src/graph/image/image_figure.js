import Figure from "../figure.js";
import Graph from "../graph.js";

const ASPECT_FILL = 'aspectFill';
const SCALE_FILL = 'scaleToFill';
const ASPECT_FIT = 'aspectFit';

const POSTION_CENTER = 'center';
export default class ImageFigure extends Figure {
    constructor(params) {
        params = params || {};
        super(params);
        this._image = params['image'];
        this._mode = params['mode'] || SCALE_FILL;
        this._position = params['position'] || POSTION_CENTER;
        //这个参数可以手动给，使用Graph的createImageFigure方法，会自动检测有没有设置临时Canvas，有的话就传入
        this._tempCanvas = params['tempCanvas'];
    }

    get mode() { return this._mode }

    set mode(v) {
        if (this._mode != v) {
            this._mode = v;
            this._contentDirty = true;
        }
    }

    get position() { return this._position }

    set position(v) {
        if (this._position != v) {
            this._position = v;
            this._contentDirty = true;
        }
    }

    get image() {
        return this._image;
    }

    set image(img) {
        if (this._image != img) {
            this._image = img;
            this._contentDirty = true;
        }
    }


    /**
     * 根据已有的image比例来设置自己的绘制区域。传入参数如果为空，绘制区域高度和宽度和图片设置一样。
     * 如果传入参数带有width,则将绘制区域宽度设置为width，高度将会按照image比例设置。
     * 如果没有width，则看有没有height参数。
     * @param {Map<Number,Number>} params {width : 整数 ; sheight : 整数}
     */
    setBoundsWithImageAspect(params) {
        if (this._image == null) return;
        if (params == null) {
            this.width = this._image.width;
            this.height = this._image.height;
        } else {
            let w = params['width'];
            let h = params['height'];
            let imgW = this._image.width;
            let imgH = this._image.height;
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

    _paintImage(ctx, w, h, imgWidth, imgHeight) {

        /**@TODO 关于POSITION属性还没有做 ，图片不管任何模式现在都是居中*/

        // ScaleFill模式，就是让图片填充到整个绘制区域
        if (this._mode == SCALE_FILL) {
            ctx.drawImage(this._image, 0, 0, w, h);
            return;
        }

        //Aspect Fill,填充图片的最短边，另外一条边会被切割
        if (this._mode == ASPECT_FILL) {
            // sw/sh = imgWidth/imgHeight
            let sw = imgWidth;
            let sh = Math.floor(sw * h / w);
            if (sh > imgHeight) {
                sh = imgHeight;
                sw = Math.floor(sh * w / h);
            }
            let sx = Math.floor((imgWidth - sw) / 2);
            let sy = Math.floor((imgHeight - sh) / 2);
            if (this._position == POSTION_CENTER) {
            }

            ctx.drawImage(this._image, sx, sy, sw, sh, 0, 0, w, h);
            return;
        }
        // Aspect Fit，整个图片等比例缩放，最长边会本完全显示
        if (this._mode == ASPECT_FIT) {
            let tw = w;
            let th = Math.floor(tw * imgHeight / imgWidth);
            if (th > h) {
                th = h;
                tw = Math.floor(th * imgWidth / imgHeight);
            }
            let tx = Math.floor((w - tw) / 2);
            let ty = Math.floor((h - th) / 2);
            ctx.drawImage(this._image, tx, ty, tw, th);
            return;
        }
    }

    _drawSelf(context, w, h) {
        /**@TODO 这里需要离屏canvas和webgl来做性能优化以及filter，但是由于离屏canvas不支持toDataURL方法，只能手动设置一个在屏的 */
        /**@TODO 在屏的临时canvas还没有实现webgl绘图以及filter */
        if (this.image == null || this.width == 0 || this.height == 0) return;
        let imgWidth = this._image.width;
        let imgHeight = this._image.height;
        let ctx = context;
        if (this._contentDirty) {
            if (this._tempCanvas != null) {
                //利用临时Canvas先绘制剪切过的Image
                this._tempCanvas.width = w;//* Figure.DRP;
                this._tempCanvas.height = h;//* Figure.DRP;
                let tempCtx = this._tempCanvas.getContext('2d');
                // tempCtx.scale(Figure.DRP, Figure.DRP);
                this._paintImage(tempCtx, w, h, imgWidth, imgHeight);
                this._tempImage = this._tempCanvas.createImage();
                let that = this;
                this._tempImage.onload = function () {
                    that._contentDirty = false;
                    let root = that.getRoot();
                    if (root instanceof Graph) {
                        // 生好了图片后，通知Graph，rAF刷新一次
                        root.update(true);
                    }
                };
                this._tempImage.onerror = function () {
                    console.error('临时canvas绘制生成image发生错误');
                }
                this._tempImage.src = this._tempCanvas.toDataURL();
            } else {
                this._paintImage(context, w, h, imgWidth, imgHeight);
            }
        } else {
            /**@TODO 绘制的时候没有考虑PixelRatio，因为不想再让绘制缩放计算一次，很有可能会造成绘制出来的图片像素低。
             * 要解决这问题，可以在 drawImage 传入当前的宽度和高度，在绘制临时图片的时候放大临时canvas，但这样一来双缓冲就没意义了
             */
            if (this._tempImage != null)
                ctx.drawImage(this._tempImage, 0, 0);
        }
    }
}