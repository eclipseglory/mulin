
export default class Animation {
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

    get isRunning() { return this._running; }

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
        })
    }

    cancel(promiseCall) {
        let render = this.render;
        render.endRAF();
        this._running = false;
        this.refreshCount = 0;
        if (promiseCall)
            promiseCall();
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