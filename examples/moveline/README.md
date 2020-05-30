# 线示例
## 说明
通过```Line```类可以创建一条线：
```javascript

    let line = new Line({
        points : [.....]
    });
    graph.addChild(line);
```

## 缺陷
绘制折线样式的时候，算法过于简单，没有正确处理不同临近点在不同斜率下的四次贝塞尔曲线控制点设置。

## 小程序代码片段连接
https://developers.weixin.qq.com/s/WAoQvmmq7bhd

(如果无法导入请直接下载代码)

## 示例截图
![图片](preview.jpg)