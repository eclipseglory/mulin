const app = getApp()

let graphlib = require('../graph.min.js');

Page({
  graph: null,
  rect: null,
  data: {

  },
  onLoad: function () {
    let query = wx.createSelectorQuery();
    let that = this;
    query.select('#canvas').fields({ size: true, node: true }).exec(function (res) {
      if (res[0]) {
        let graph = new graphlib.Graph(res[0].node, {
          canvasWidth: res[0].width,
          canvasHeight: res[0].height,
        });
        let w = Math.floor(graph.width / 2);
        let h = Math.floor(w / 2);
        that.graph = graph;
        let rect = new graphlib.shapes.Rectangle({
          width: w,
          height: h,
        });
        that.rect = rect;

        graph.addChild(rect);
        rect.centerMe();
        graph.startRAF({
          afterDraw() {
            rect.rotate += 1;
            if (rect.rotate >= 360) {
              rect.rotate = rect.rotate % 360;
            }
          }
        });
      }
    });
  },

  onUnload() {
    if (this.graph != null) {
      // 必须停止循环刷新
      this.graph.endRAF();
    }
  },

  /**
   * 生成一个随机的rgb颜色字符串
   */
  randomRGB() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return 'rgb(' + r + "," + g + ',' + b + ')';
  },

  randomColor(e) {
    // 仅测试一下Gradient，从Rect的左上角到右下角的渐变色
    let gradient = this.graph.ctx.createLinearGradient(0, 0, this.rect.width, this.rect.height);
    gradient.addColorStop(0.3, this.randomRGB());
    gradient.addColorStop(0.7, this.randomRGB());
    this.rect.color = gradient;
    // 可以直接设置颜色值：
    // this.rect.color = "#ee00ee";
  },

  /**
   * 随机一个边框颜色
   * @param {*} e 
   */
  randomBorderColor(e) {
    this.rect.borderColor = this.randomRGB();
    // 也可以设置成Gradient渐变
  },

  borderWidthChange(e) {
    this.rect.borderWidth = e.detail.value;
  },

  radiusChange(e) {
    this.rect.radius = e.detail.value;
  }
})
