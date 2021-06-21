//index.js
//获取应用实例
const app = getApp()

Page({
  graph: null,
  lastFigure: null,
  data: {
    figure: null,
    edit: false,
    canDelete: false
  },
  addImage: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      success(re) {
        let path = re.tempFilePaths[0];
        that.graph.createImageFigure({
          src: path,
          onload(imageFigure) {
            imageFigure.setBoundsWithImageAspect({ width: 100 });
            that.graph.addChild(imageFigure);
            imageFigure.centerMe();
            that.graph.update(true);
          }
        })
      }
    })
  },
  addText: function () {
    let textFigure = new app.graph.text.Text({
      text: '文字内容',
      size: 12,
    });
    this.graph.addChild(textFigure);
    textFigure.centerMe();
    this.graph.update(true);
  },
  touchUp() {
    this.lastTouches = [];
  },

  touchStart(e) {
    this.lastTouches = [];
    let selectFigure;
    if (this.graph != null) {
      let offsetx = e.target.offsetLeft;
      let offsety = e.target.offsetTop;
      if (e.touches.length == 1) {
        let x = e.touches[0].x + offsetx;
        let y = e.touches[0].y + offsety;
        let figure = this.graph.pointInMe(x, y);
        if (figure != null && figure != this.graph) {
          selectFigure = figure;

          this.lastTouches.push({ x: e.touches[0].x, y: e.touches[0].y });
        }
      } else {
        if (e.touches.length == 2) {
          let x = e.touches[0].x + offsetx;
          let y = e.touches[0].y + offsety;
          let x1 = e.touches[1].x + offsetx;
          let y1 = e.touches[1].y + offsety;
          let midx = (x + x1) / 2, midy = (y + y1) / 2;
          let figure = this.graph.pointInMe(midx, midy);
          if (figure != null && figure != this.graph) {
            selectFigure = figure;
            this.lastTouches[e.touches[0].identifier] = ({ x: e.touches[0].x, y: e.touches[0].y });
            this.lastTouches[e.touches[1].identifier] = ({ x: e.touches[1].x, y: e.touches[1].y });
          }
        }
      }
    }
    this.selectFigureChange(selectFigure);
  },

  selectFigureChange(selectFigure) {
    if (this.selectedFigure == selectFigure) {
      return;
    }
    this.selectedFigure = selectFigure;
    let isText = this.isTextFigure(this.selectedFigure);
    let candelete = selectFigure != null;
    if (isText) {
      this.setData({
        canDelete: candelete,
        figure: {
          text: this.selectedFigure.text, borderWidth: this.selectedFigure.borderWidth,
          color: this.selectedFigure.color, borderColor: this.selectedFigure.borderColor
        },
        edit: true
      });
    } else {
      this.setData({
        canDelete: candelete,
        figure: {
        }, edit: false
      });
    }
  },

  getGesture(e) {
    if (this.selectedFigure != null) {
      if (e.touches.length == this.lastTouches.length) {
        if (e.touches.length == 1) {
          let touch = e.touches[0];
          let touch1 = this.lastTouches[0];
          let re = { dx: touch.x - touch1.x, dy: touch.y - touch1.y, touch: 1 };
          touch1.x = touch.x;
          touch1.y = touch.y;
          return re;
        } else {
          if (e.touches.length == 2) {
            let dx1 = e.touches[0].x - e.touches[1].x, dy1 = e.touches[0].y - e.touches[1].y;
            let dx2 = this.lastTouches[0].x - this.lastTouches[1].x, dy2 = this.lastTouches[0].y - this.lastTouches[1].y;
            let theta1 = Math.atan2(dy1, dx1);
            let theta2 = Math.atan2(dy2, dx2);
            let rotate = theta1 - theta2;
            let dis1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            let dis2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            let scale = (dis1 - dis2) / dis2;
            let re = { scale: scale, rotate: rotate * 180 / Math.PI, touch: 2 };
            this.lastTouches[0].x = e.touches[0].x;
            this.lastTouches[0].y = e.touches[0].y;
            this.lastTouches[1].x = e.touches[1].x;
            this.lastTouches[1].y = e.touches[1].y;
            return re;
          }
        }
      }
    }
  },

  touchMove(e) {
    let gestureDetail = this.getGesture(e);
    if (gestureDetail != null && this.selectedFigure != null) {
      if (gestureDetail.touch == 1) {
        this.selectedFigure.x += gestureDetail.dx;
        this.selectedFigure.y += gestureDetail.dy;
        this.graph.update(true);
      } else {
        if (gestureDetail.touch == 2) {
          this.selectedFigure.rotate += gestureDetail.rotate;
          this.selectedFigure.scaleX += gestureDetail.scale;
          this.selectedFigure.scaleY += gestureDetail.scale;
          this.graph.update(true);
          // console.log(gestureDetail);
        }
      }
    }
  },
  onLoad: function () {
  },

  onReady() {
    let that = this;
    wx.createSelectorQuery().select('#canvas').fields({ node: true, size: true }).exec(function (res) {
      let canvas = res[0].node;
      let width = res[0].width;
      let height = res[0].height;
      let graph = new app.graph.Graph(canvas, { canvasWidth: width, canvasHeight: height });
      // let rect = new Rectangle({
      //   x: 10, y: 10, width: 100, height: 50, color: 'blue'
      // })
      // graph.addChild(rect);
      graph.update();
      that.graph = graph;
    });
  },

  isTextFigure(figure) {
    return (figure != null && 'text' in figure);
  },

  /**
   * 删除选中图形
   * @param {*} e 
   */
  deleteSelect(e) {
    this.graph.removeChild(this.selectedFigure);
    this.selectFigure = null;
    let that = this;
    this.graph.update(true, function () {
      that.selectFigureChange(null);
    });
  },

  /////////////// 修改Text figure、、、、、、、

  textChnage(e) {
    if (!this.isTextFigure(this.selectedFigure)) return;
    let text = e.detail.value;
    if (text == null || text.length == 0) {
      text = '文字内容'; this.setData({
        'figure.text': '文字内容'
      })
    }
    this.selectedFigure.text = text;
    this.graph.update();
  },
  borderColorChange(e) {
    if (!this.isTextFigure(this.selectedFigure)) return;
    let color = e.detail.value;
    if (color == null || color.length == 0) {
      color = '#0e0e0e'; this.setData({
        'figure.color': '#0e0e0e'
      })
    }
    this.selectedFigure.borderColor = color;
    this.graph.update();
  },
  colorChange(e) {
    if (!this.isTextFigure(this.selectedFigure)) return;
    let color = e.detail.value;
    if (color == null || color.length == 0) {
      color = '#0e0e0e'; this.setData({
        'figure.borderColor': '#0e0e0e'
      })
    }
    this.selectedFigure.color = color;
    this.graph.update();
  },
  borderWidthChange(e) {
    if (!this.isTextFigure(this.selectedFigure)) return;
    let color = e.detail.value;
    let width = Number.parseFloat(color);
    if (isNaN(width)) {
      width = 0; this.setData({
        'figure.borderWidth': '0'
      })
    }
    this.selectedFigure.borderWidth = width;
    this.graph.update();
  }
})
