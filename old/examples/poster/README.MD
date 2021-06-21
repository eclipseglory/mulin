# 海报绘制
## 说明
```Text```类可以绘制多行文字。
```Graph```类具有一个```keep```属性，当设置为```true```的时候，Graph会保留之前绘制的结果。在分批绘制大量图片和文字的时候，通过设置该属性，可以让绘制不在同一个时间片内执行，这样就可以不阻塞主线程的刷新，即不会卡。
```javascript
    // graph是一个已经创建好的对象
    graph.keep = true;
    graph.update(true,function(){
        // 绘制完成后进行一些处理
        graph.removeChild(someFigure);//移除绘制过的图形
        graph.keep = null; // 恢复原本清空状态
    });
```
配合上```Promise```使用更好。


## 小程序代码片段连接
https://developers.weixin.qq.com/s/InyDynmM7Yh0

(如果无法导入请直接下载代码)

## 示例截图
![图片](preview.jpg)