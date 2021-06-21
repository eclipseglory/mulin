const app = getApp()
const mulin = app.mulin;
const flareObject = require('./flareJson.js');
Page({
  createRender: undefined,
  data: {

  },
  onLoad: function () {
    let query = wx.createSelectorQuery();
    this.createRender = Promise.all([flareObject.flare, new Promise((resolve, reject) => {
      query.select('#canvas').fields({ node: true, size: true }).exec(function (result) {
        let res = result[0];
        let render = new mulin.Render(res.node, { canvasWidth: res.width, canvasHeight: res.height });
        resolve(render);
      });
    })]);
  },

  onReady() {
    this.createRender.then((result) => {
      let content = result[0];
      let render = result[1];

      let flrObjs = mulin.FlareJSONReader.readJSONObject(content);

      let root = render.createRoot();
      let flrObj = flrObjs[0];
      let artboard = flrObj.artboard;
      // 加入到顶部节点：
      root.addChild(artboard);
      // 放到canvas中间.
      artboard.x = (root.width - artboard.width) / 2;
      artboard.y = (root.height - artboard.height) / 2;

      // 因为文件定义的图形大小不可能都适配屏幕画布，这里要fit一下：
      if (artboard.width > root.width) {
        let scale = root.width / artboard.width;
        artboard.scaleX = scale;
        artboard.scaleY = scale;
        // 当前文件中的artboard是基于(0,0)拉伸，缩放后需要缩进才能居中：
        artboard.x += (artboard.width - root.width) / 2;
      } else {
        if (artboard.height > root.height) {
          let scale = root.height / artboard.height;
          artboard.scaleX = scale;
          artboard.scaleY = scale;
          // 当前文件中的artboard是基于(0,0)拉伸，缩放后需要缩进才能居中：
          artboard.y += (artboard.height - root.height) / 2;
        }
      }

      // 只绘制需要渲染的节点：
      flrObj.render.forEach(r => {
        render.addRenderNode(r);
      });
      // 排序：
      // render.addRenderNode(root);
      render.sort();

      // 赋值动画：
      render.animations = flrObj.animations;

      // 开始动画：
      render.startAnimation(0);
      // render.update();
    });
  }
})
