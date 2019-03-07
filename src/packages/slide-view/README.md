## SlideView侧滑栏

### 使用指南

在 app.json 或 index.json 中引入组件
```json
"usingComponents": {
  "van-slide-view": "path/to/jview-weapp/dist/slide-view/index"
}
```

### 代码演示

```html
<van-slide-view   bind:slideOpen="slideOpen" 
                  bind:slideClose="slideClose" 
                  width="750" 
                  height="110" 
                  slide-width="500">
    <view slot="left">
    </view>
    <view slot="right">
    </view>
</van-slide-view>
```

### API

| 参数 | 说明 | 类型 | 默认值 | 单位 |
|-----------|-----------|-----------|-------------|-------------|
| width | 组件整体的宽度 | `Number` | 屏幕宽度 | rpx |
| height | 组件整体的高度 | `Number` | `0` | rpx |
| slide-width | 滑动展示区域的宽度 | `Number` | `0` | rpx |

### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | 根节点样式类 |

### 更新日志

| 版本 | 类型 | 内容 |
|-----------|-----------|-----------|
| 0.0.1 | feature | 新增组件 |
