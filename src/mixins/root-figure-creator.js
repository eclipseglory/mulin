import { CanvasKitUtils, RootFigure } from 'figures';

export default {
    mounted() {
        window.addEventListener('resize', () => {
            this.loading = true;
            if (this._resizeUpdateId) {
                clearTimeout(this._resizeUpdateId);
            }
            this._resizeUpdateId = setTimeout(() => {
                this.initCanvas();
                if (this.frontRoot)
                    this.frontRoot.refresh();
                if (this.mainRoot) {
                    this.mainRoot.init();
                    this.mainRoot.refresh();
                }
                this.loading = false;
            }, 500);

        });
        this.initCanvas();
    },
    methods: {
        initCanvas() {
            let el = this.$el;
            let container = el.querySelector("#canvas-container");
            let w = container.clientWidth;
            let h = container.clientHeight;

            let ratio = window.devicePixelRatio;

            let front = el.querySelector("#front-canvas");
            let main = el.querySelector("#main-canvas");
            let backend = el.querySelector("#backend-canvas");

            setCanvasSize(front, w, h, ratio);
            setCanvasSize(main, w, h, ratio);
            setCanvasSize(backend, w, h, ratio);
            if (this.frontSurface) {
                this.frontSurface.delete();
            }
            this.frontSurface = CanvasKitUtils.makeCanvasSurface("front-canvas");
            let fc = this.frontSurface.getCanvas();
            fc.scale(ratio, ratio);
            if (!this.frontRoot) {
                this.frontRoot = new RootFigure(this.frontSurface, {
                    width: w,
                    height: h,
                });
            } else {
                this.frontRoot.getTarget().surface = this.frontSurface;
                this.frontRoot.width = w;
                this.frontRoot.height = h;
            }
            if (this.mainSurface) {
                this.mainSurface.delete();
            }
            this.mainSurface = CanvasKitUtils.makeCanvasSurface("main-canvas");
            let mc = this.mainSurface.getCanvas();
            mc.scale(ratio, ratio);
            if (this.mainRoot) {
                this.mainRoot.getTarget().surface = this.mainSurface;
                this.mainRoot.screanWidth = w;
                this.mainRoot.screanHeight = h;
            }

            function setCanvasSize(canvas, w, h, radio) {
                canvas.width = w * radio;
                canvas.height = h * radio;
            }
        }

    }
}