## WaterFall瀑布流

### 使用指南

在 app.json 或 index.json 中引入组件
```json
"usingComponents": {
  "van-water-fall": "path/to/jview-weapp/dist/water-fall/index"
}
```

### 代码演示

```html
<van-water-fall lists="{{lists}}" 
                preview="{{preview}}" 
                width="{{width}}" 
                bind:fileClick="onFileClick">
</van-water-fall>
```

### API

| 参数 | 说明 | 类型 | 默认值 | 单位 |
|-----------|-----------|-----------|-------------|-------------|
| width | 图片显示宽度 | `Number` | 屏幕宽度 | rpx |
| lists | 瀑布流渲染数据 | `Array` | `[]` | - |
| preview | 点击图片是否可以预览 | `Boolean` | `true` | - |

### Lists元素

| 属性 | 说明 | 类型 |
|-----------|-----------|-----------|
| id | 列表每一项的id | Number |
| type | 区分图片和视频 | Number`1 图片 3 视频` |
| url | 展示图片的链接，若类型为视频请获取第一帧图片 | String |
| desc | 对图片、视频的描述说明 | String |
| width | 图片、视频的原始宽度 | Number |
| height | 图片、视频的原始高度 | Number |


### Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
| bind:fileClick | 点击单个视频、图片时触发 | 当前点击项的id、type |

### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | 根节点样式类 |

### 更新日志

| 版本 | 类型 | 内容 |
|-----------|-----------|-----------|
| 0.0.1 | feature | 新增组件 |
