# 简介 

Graph工具包(或者叫lib)将常用的CanvasRenderingContext2D绘制方法封装成类，便于使用。

以绘制一个基于中心位置旋转了45度的圆角矩形为例，直接使用Context 2D代码如下：

```javascript
    ....
    // 矩形大小和位置以及圆角半径：
    let x = 100,y = 100,w = 100,h = 50, r = 10;
    let selector = wx.createSelectorQuery();
    selector.select('#canvas-id').fields({node:true,size:true})
        .exec(function(result){
            if(result[0]){
                let canvas = result[0].node;
                let ctx = canvas.getContext('2d');

                // 根据像素比初始化画布内存以及Context缩放：
                let dpr = wx.getSystemInfoSync().pixelRatio;
                canvas.width = result[0].width*dpr;
                canvas.height = result[0].height*dpr;
                ctx.scale(dpr,dpr);

                // 基于矩形中心旋转45度
                ctx.translate(50,50);
                ctx.rotate(45*Math.PI/180);
                ctx.translate(-50,-50);

                // 绘制圆角矩形
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.arc(x + w - r, y + r, r, -Math.PI/2, 0);
                ctx.lineTo(x + w, y + h - r);
                ctx.arc(x + w - r, y + h - r, r, 0, Math.PI/2);
                ctx.lineTo(x+r, y+h);
                ctx.arc(x + r, y + h - r, r, Math.PI/2, Math.PI);
                ctx.lineTo(x, y + r);
                ctx.arc(x + r, y + r, r, Math.PI, Math.PI *1.5);
                ctx.closePath();

                ctx.fillStyle= "some color";
                ctx.fill();
            }
        });
    ....
```
从上面代码可以得知，要利用Context2d绘制，除了要熟悉API外，还要知道如何进行transform的变换，代码繁琐。在一些情况下，为了加快绘制速度，还会用到临时Canvas的辅助以及一些线性代数的计算，甚至是卷积内核计算，这无疑给专注业务的开发人员增加了工作量。

Graph的目的在于，将图形、文字、图片等封装成一个一个的类，通过设置类的属性即可得到对应的图形以及图形变换，减少了代码编写，也不必知道过多的计算细节。

还以绘制圆角矩形为例，使用Graph的代码如下：

```javascript
    const graphLib = require('../some path/graph.min.js');
    ....
    // 矩形大小和位置以及圆角半径：
    let x = 100,y = 100,w = 100,h = 50, r = 10;
    let selector = wx.createSelectorQuery();
    selector.select('#canvas-id').fields({node:true,size:true})
        .exec(function(result){
            if(result[0]){
                let canvas = result[0].node;
                // 新建一个Graph类：
                let graph = new graphLib.Graph(canvas,{
                    canvasWidth:result[0].width,
                    canvasHeight:result[0].height
                });
                // 新建一个Rectangle
                let rrect = new graphLib.shape.Rectangle({
                    x : 100, y : 100 , width:100 , height:100,
                    radius:10, rotate:45,
                    color:'some color'
                });

                // 将图形添加到Graph中：
                graph.addChild(rrect);

                // 刷新Graph得到绘制结果：
                graph.update();
            }
        });
    ....
```
# 安装和使用

下载```release```文件夹中的```graph.js```或者```graph.min.js```，在小程序的js文件中通过```require```进行引入：
```javascript
    const lib = require('path/graph.min.js');
```
即可使用```lib```中封装好的绘制类:
```javascript
    var graph = new lib.Graph(.....)
```

或者直接将```src```中的代码全部下载到项目中，更便于debug，以及可以继承扩展一些类。（墙裂推荐）

# 示例

- **矩形绘制代码片段**
该示例展示了如何绘制一个渐变色的矩形以及如何使用定时刷新来达到简单的动画效果。点击这里：[Rectangle示例](/examples/rectangle)
- **绘制线**
该示例展示了绘制一条具有多个点的线段，可以通过设置属性更改线段的样式、颜色等。点这里：[线示例](/examples/moveline)
- **电影海报绘制**
该示例展示如何定义一个“离屏”Canvas，在绘制工作较大的时候如何利用Graph的keep属性进行分段绘制。此外还```ImageFigure```以及```Text```的一些基本用法。点这里 : [海报绘制示例](/examples/poster)
- **自定义T恤**
该示例展示了如创建加修改文字以及图片，利用简单的手势对图片和文字进行移动、缩放、旋转，来设计一个自定义的T恤。点这里：[Custom T-shirt示例](/examples/tshirt)

*...更多示例会慢慢添加*

# 文档

请移步“项目维基”