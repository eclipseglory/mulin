## 0.0.4.27
- 完成ActionStack
- 完成添加figure的action
- 完成Selection，包括多选单选
- 完成四叉树查询
- 完成sat，图形重新加入顶点以及轴的设定
## 0.0.4.28
- 实现transform feedback的显示
- 实现移动，旋转
## 0.0.4.29
~~**<span style="color:red">被卡住了，Decompose, 不解决这个问题无法继续做</span>.**~~

- 解决了Decompose的问题
- 加入了Skew变换
- **<span style="color:yellow">取消了anchor的设定<span>**
- 将所有拉伸和旋转统一成PoseChange

## 0.0.4.30
- 实现了拉伸
- 实现删除
- 将selection再次加入到vue进行管理

很开心，Tool和selection以及action stack的大致框架已经确定，比以前那个要清晰很多！
## 0.0.5.1
- 实现绘制圆形图形
- 实现绘制星形图形
- 实现绘制多边形图形

## 0.0.5.2
- 钢笔绘制完成一部分
- 重新定义了tool的生命周期
- tool的rAF加入到基类中
- property view起了个头

无实质进展

## 0.0.5.3
- 实现钢笔绘制
- 实现钢笔绘制中可删除顶点
- 实现property view基础属性修改

顶点选择也算基本完成，但是由于在实现钢笔绘制的工程中对原有tool的生命周期等进行了修改，造成了大量bug，当然也在实现顶点选择的时候发现了大量关于bounds的bug

## 0.0.5.4
~~**<span style="color:red">实现同rotation变换框绘制的时候被卡住了</span>**~~
- <spand style="color:yellow">重做了Feedback变幻框，将原来以中心旋转的变换框改成了以左上角旋转。变换框不再直接管理feedback figures，而是交由内部的一个feedback container，让feedback figures作为其子节点显示。变换框的拉伸不再修改scale，而是直接修改width/height。</span>
- 重新实现了figure的bounds获取：对于path图形，利用canvaskit的api接口，其他简单图形沿用之前的方案。以此修复之前bounds的问题
- 取消了之前自做聪明的circle bounds
- 重做了所有pose change tools
- 重做了translate tool
- 同旋转角度的图形选择后变换框也会是同样旋转角度

至此，之前旋转后拉伸，移动等bug全部清除，变换工具基本定型。


# plant:

- 实现顶点选择
- 实现顶点类型(对称，自由，半对称)
- 实现钢笔绘制中可以更改顶点类型
- 实现编组，反编组
- 修改图标
- 实现对齐功能
- 实现剪切蒙版
- 实现border的大小修改
- 实现border类型修改
- 实现border颜色修改
- 实现填充颜色修改
- 实现渐变颜色修改
- 实现color picker
- 实现cache feedback，不然总是在重新创建
- 实现html canvas resize后的更新
- 加入resize spliter控制右侧propertyview大小

# BUGS:
-  四叉树查询bug
-  sat碰撞测试bug
-  四叉树删除节点的bug
- move tool的cursor不会立即改变

# FIXED:
- ~~钢笔工具在删除顶点后，feedback显示不更新~~
- ~~钢笔工具hover选择顶点不准确~~
- ~~钢笔工具减少点有时不执行~~
- ~~钢笔工具close图形有时候不执行~~
- ~~曲线bounds没有~~
-  ~~圆形，多边形，星形的bounds问题~~
-  ~~redo undo后feedback显示bug~~
- ~~holver feedback figure有时候不会即使清除~~
