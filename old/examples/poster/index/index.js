const app = getApp()
const lib = require('../lib/graph.min.js');
const AIPKEY = '?apikey=0df993c66c0c636e29ecbb5344252a4a';// 这不知道是哪个好心人留下的api key
const REST_URL = 'http://api.douban.com/v2/movie/subject/';

Page({

  id: null,
  graph: null,
  data: {
    showImage: false,
    postData: null
  },

  closeImage() {
    this.setData({
      showImage: false
    })
  },

  generatePoster(e) {
    if (this.id && this.graph) {

      //显示loading
      wx.showLoading({
        mask: true
      });
      let that = this;
      let moveId = this.id;
      let graph = this.graph;
      let promise = new Promise(function (resolve, reject) {
        let url = REST_URL + moveId + AIPKEY;
        wx.request({
          url: url,
          header: {
            "content-type": "json" // 豆瓣api访问必须要写成json，否则访问会错误
          },
          success(res) {
            if (res.statusCode == 200) {
              resolve(res.data);
            } else {
              reject(res.data.msg);
            }
          },
          fail() {
            reject('访问错误');
          }
        })
      });
      // 开始处理Promise
      promise.then(function (data) {
        // 绘制海报图片1
        let p = new Promise(function (resolve, reject) {
          let imgSrc = data.images.large;
          graph.createImageFigure({
            src: imgSrc,
            mode: 'aspectFit',
            onload(imageFigure) {
              imageFigure.setBoundsWithImageAspect({
                height: graph.height
              });
              graph.addChild(imageFigure);
              graph.update(true, function () {
                graph.removeChild(imageFigure);
                resolve(data);
              });
            },
            onerror() { reject('图片加载错误'); }
          });
        });
        return p;
      }).then(function (data) {
        // 绘制海报文字
        let p = new Promise(function (resolve, reject) {
          // 增加一个矩形渐变背景：
          let rect = new lib.shapes.Rectangle({
            width: graph.width,
            height: graph.width / 3
          });
          rect.x = 0;
          rect.y = graph.height - rect.height;
          let gradient = graph.ctx.createLinearGradient(rect.width / 2, 0, rect.width / 2, rect.height);
          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(1, "#333333");
          rect.color = gradient;
          graph.addChild(rect);

          let summary = data.summary;
          // 只绘制三段，字体大小为14，绘制区域为rect宽度的80%
          let fontSize = 14;
          let lineHeight = 1.2;
          let fontWidth = fontSize * lineHeight; // 假设每个字宽为
          let totalWidth = rect.width * 0.8;
          let cnums = Math.floor(totalWidth / fontWidth);
          let text1 = summary.substring(0, cnums);
          let text2 = summary.substring(cnums, cnums * 2);
          let text3 = summary.substring(cnums * 2, cnums * 3);

          let textFigure = new lib.text.Text({
            lineHeight: lineHeight,
            fontSize: fontSize,
            fontWeight: 'bold',
            color: 'whitesmoke',
            borderColor: 'black',
            borderWidth: 0.3
          });

          textFigure.addLine(text1);
          textFigure.addLine(text2);
          // 最后一列加上省略号：
          text3 = text3.substring(0, text3.length - 3);
          text3 += '...';
          textFigure.addLine(text3);

          rect.addChild(textFigure);

          // 文字在矩形右侧中心
          textFigure.centerMe();
          textFigure.x = (rect.width - totalWidth) + (totalWidth - textFigure.width) / 2;

          graph.keep = true; // 保留之前绘制结果
          graph.update(true, function () {
            graph.keep = null;
            // 将要未绘制的矩形区域传给下一个pomise处理
            data.rect = { x: rect.x, y: rect.y, h: rect.height, w: rect.width * 0.2 };
            // 清除之前绘制的矩形区域
            graph.removeChild(rect);
            resolve(data);
          })
        });
        return p;
      }).then(function (data) {
        let p = new Promise(function (resolve, reject) {
          // 随便绘制一个人物头像，在之前矩形区域的左边
          let rect = data.rect;
          let cast = data.casts[0];
          let avatar = cast.avatars.medium;

          // 头像大小为绘制区域的80%
          let w = rect.w * 0.8;
          let h = rect.h * 0.8;
          let r = Math.min(w, h);

          graph.createImageFigure({
            src: avatar,
            width: r, height: r,
            mode: 'aspectFill',
            onload(imageFigure) {
              // 绘制一个圆形剪切头像：
              let circle = new lib.shapes.Circle({
                radius: r / 2,
                clip: true,
                x: rect.x + (rect.w - r) / 2,
                y: rect.y + (rect.h - r) / 2,
              });
              circle.addChild(imageFigure);
              imageFigure.centerMe();
              graph.addChild(circle);
              graph.keep = true;
              graph.update(true, function () {
                graph.removeChild(circle);
                graph.keep = false;
                resolve(true);
              });
            },
            onerror() { reject('加载错误'); }
          })
        });
        return p;
      }).then(function () {
        // 绘制完成，生成临时图片并显示

        wx.canvasToTempFilePath({
          canvas: graph.canvas,
          success(res) {
            wx.hideLoading();
            // wx.previewImage({
            //   urls: [res.tempFilePath]
            // })
            that.setData({
              postData: res.tempFilePath,
              showImage: true
            });
          },
          fail() {
            throw '生成图片错误';
          }
        })
      }).catch(function (e) {
        //发生错误，关闭loading
        wx.hideLoading();
        console.error(e);
      });;
    }
  },

  changeId(e) {
    this.id = e.detail.value;
  },

  onLoad: function () {
    let query = wx.createSelectorQuery();
    let that = this;
    query.select('#hidden-canvas').fields({ size: true, node: true }).exec(function (res) {
      if (res[0]) {
        // 原canvas的大小为0，这里定义一个内存为400x600的画布
        // 这样原来的canvas既不显示，又能绘制，即假离屏
        let g = new lib.Graph(res[0].node, {
          canvasWidth: 400,
          canvasHeight: 600
        });
        that.graph = g;
      }
    });
  },
})
