import BezierEasing from '../graph/math/bezier-easing.js';

export default class AnimationPropertyKey {
    constructor(props = {}) {
        this.duration = props.duration;
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
            time: props.time / this.duration,
            value: props.value,
            timingFunctionType: props.interpolatorType
        }

        if (keyFrame.timingFunctionType == 2) {
            keyFrame.bezierEasing = new BezierEasing(props.cubicX1, props.cubicY1, props.cubicX2, props.cubicY2)
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
            let delta = this.currentKey.delta;
            if (delta == null) {
                delta = ((this.nextKey.value - this.currentKey.value) / (this.nextKey.time - this.currentKey.time));
                this.currentKey.delta = delta;
            }
            let c = currentPercent - this.currentKey.time;
            return this.currentKey.value + c * delta;
        }
        if (this.currentKey.timingFunctionType == 2) {
            let bezierEasing = this.currentKey.bezierEasing;
            if (bezierEasing) {
                let t = (currentPercent - this.currentKey.time) / (this.nextKey.time - this.currentKey.time);
                let y = bezierEasing.easing(t);
                return this.currentKey.value + y * (this.nextKey.value - this.currentKey.value);
            }
        }
        return this.figure[this.property];
    }
}