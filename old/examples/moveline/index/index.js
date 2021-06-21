const app = getApp()
const graphlib = require('../lib/graph.min.js');
Page({
  graph: null,
  deltaX: null,
  dash: { 1: [], 2: [5] },
  /**
   * 页面的初始数据
   */
  data: {
    lineMode: [
      { id: 1, value: 'direct', name: '折线', checked: true },
      { id: 2, value: 'curved', name: '曲线' },
    ],
    cap: [
      { id: 1, value: 'round', name: '圆头', checked: true },
      { id: 2, value: 'butt', name: '圆角' },
      { id: 3, value: 'square', name: '方头' },
    ],
    dash: [
      { id: 1, value: 1, name: '实线', checked: true },
      { id: 2, value: 2, name: '虚线' },
    ],
    join: [
      { id: 1, value: 'round', name: '圆头', checked: true },
      { id: 2, value: 'bevel', name: '方头' },
      { id: 3, value: 'miter', name: '尖头' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery();
    let that = this;
    query.select('#canvas').fields({ node: true, size: true }).exec(function (res) {
      if (res[0] != null) {
        that.graph = new graphlib.Graph(res[0].node, {
          canvasWidth: res[0].width,
          canvasHeight: res[0].height
        });
        that.randomLine();
      }
    });
  },
  dashChange(e) {
    let graph = this.graph;
    if (graph) {
      let line = graph.children[0];
      line.lineDash = this.dash[e.detail.value];
      if (!graph.rAFisRunning) graph.update(true);
    }
  },
  modeChange(e) {
    let graph = this.graph;
    if (graph) {
      let line = graph.children[0];
      line.mode = e.detail.value;
      if (!graph.rAFisRunning) graph.update(true);
    }
  },

  capChange(e) {
    let graph = this.graph;
    if (graph) {
      let line = graph.children[0];
      line.cap = e.detail.value;
      if (!graph.rAFisRunning) graph.update(true);
    }
  },

  joinChange(e) {
    let graph = this.graph;
    if (graph) {
      let line = graph.children[0];
      line.join = e.detail.value;
      if (!graph.rAFisRunning) graph.update(true);
    }
  },

  widthChange(e) {
    let graph = this.graph;
    if (graph) {
      let line = graph.children[0];
      line.width = e.detail.value;
      if (!graph.rAFisRunning) graph.update(true);
    }
  },

  randomLine() {
    let graph = this.graph;
    if (graph == null) return;
    // let pointsNum = Math.floor(Math.random() * 8 + 2);
    const pointsNum = 10;
    let dx = Math.floor(graph.width / pointsNum);
    this.deltaX = dx;
    let points = new Array(pointsNum + 2);
    for (let i = 0; i < pointsNum + 2; i++) {
      let y = Math.random() * graph.height;
      points[i] = { x: i * dx, y: y };
    }
    let line = new graphlib.line.Line({
      points: points,
      color: '#f38181',
      // mode: 'curved'
    });
    graph.addChild(line);
    graph.update(true);
  },

  moveLine() {
    const graph = this.graph;
    const deltaX = this.deltaX;
    if (graph) {
      if (graph.rAFisRunning) {
        graph.endRAF();
      } else {
        graph.startRAF({
          afterDraw() {
            graph.x -= 1;
            if (Math.abs(graph.x) >= deltaX) {
              graph.x = 0;
              let line = graph.children[0];
              line.removePointAt(0);
              let points = line.points;
              points.forEach(function (point) {
                point.x -= deltaX;
              });
              let newPoint = {
                x: points[points.length - 1].x + deltaX
                , y: Math.random() * graph.height
              };
              line.addPoint(newPoint);
            }
          }
        })
      }
    }

  },

  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    if (this.graph) {
      this.graph.endRAF();
    }
  },

})
