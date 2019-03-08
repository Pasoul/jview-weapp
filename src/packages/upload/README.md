## Upload上传图片、视频

**注：** 本文中所有的原始文件对象统称为**原始文件**，而经过包装后的文件对象称为**文件对象**

原始文件结构：

图片文件：

| 参数 | 说明 | 类型 |
|-----------|-----------|-----------|
| errMsg | `wx.chooseImage`API调用结果信息 | `String` |
| tempFilePaths | 图片的本地临时文件路径列表 | `	Array.<string>` |
| tempFiles | 图片的本地临时文件列表 | `Array.<Object>` |

视频文件：

| 参数 | 说明 | 类型 |
|-----------|-----------|-----------|
| errMsg | `wx.chooseVideo`API调用结果信息 | `String` |
| duration | 点击是否预览图片 | `Number` |
| tempFilePath | 选定视频的临时文件路径 | `String` |
| size | 选定视频的数据量大小 | `Number` |
| height | 返回选定视频的高度 | `Number` |
| width | 返回选定视频的宽度 | `Number` |

### 使用指南

在 app.json 或 index.json 中引入组件
```json
"usingComponents": {
  "van-upload": "path/to/jview-weapp/dist/upload/index"
}
```

### 代码演示

```html
 <van-upload  id="vanUpload" 
              simultaneous-uploads="{{simultaneousUploads}}"
              action="{{action}}"
              bind:file-add="fileAdd">
</van-upload>
```
```js
Page({
  data: {
    action: {
        aliyunServerURL: 'https://jlbapp.oss-cn-hangzhou.aliyuncs.com',
        aliyunTokenURL: 'https://test-weapp.zhixuezhen.com/jlb-weapp/upload/token/get.shtml',
        ossDomain: 'https://images2.bestjlb.com/'
    },
    simultaneousUploads: 1
  },
  fileAdd(e) {
    const errMsg = e.detail.errMsg || "";
    if (!errMsg) return;
    if (errMsg === "chooseImage:ok") {
      let hasIgnore = false;
      const maxSize = 1 * 1024 * 1024; // 1M
      const files = e.detail.tempFiles;
      for (const k in files) {
        const file = files[k];
        if (file.size > maxSize) {
          file.ignore = true;
          hasIgnore = true;
        }
      }
      hasIgnore && wx.showToast({
        title: '选取图片大于1M',
        icon: 'none'
      });
    } else if (errMsg === "chooseVideo:ok") {
      const maxSize = 3 * 1024 * 1024; // 3M
      if (e.detail.size > maxSize) {
        e.detail.ignore = true;
        wx.showToast({
          title: '选取视频大于3M',
          icon: 'none'
        });
      }
    }
  },
})
```

配置 action 表示上传的 URL 地址、获取上传aliyunToken等，而 simultaneous-uploads 则表示支持的并发上传个数。

通过 files-added 事件可以实现文件过滤，设置 file.ignore = true 即可。

### API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| action | 上传行为配置项 | `Object` | 见子配置项 |
| preview | 点击是否预览图片 | `Boolean` | `true` |
| play | 点击是否播放视频 | `Boolean` | `true` |
| simultaneousUploads | 并发上传数量 | `Number` | `1` |
| autoUpload | 是否自动上传 | `Boolean` | `true` |
| chooseImage | 是否支持选择图片 | `Boolean` | `true` |
| chooseVideo | 是否支持选择视频 | `Boolean` | `true` |

### action子配置项

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| aliyunServerURL | 图片上传地址 | `String` | '' |
| aliyunTokenURL | 获取图片上传到oss所需参数 | `String` | '' |
| ossDomain | 上传成功后图片的域名 | `String` | '' |

### Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
| bind:file-add | 选择完文件后触发，一般可用作文件过滤 | 原始文件 |
| bind:file-click | 文件点击后触发 | 文件对象 |
| bind:file-success | 文件上传成功后触发 | 文件对象 |
| bind:file-error | 文件上传失败后触发 | 文件对象 |
| bind:file-removed | 文件被删除后触发 | 文件对象 |

### 实例方法

| 方法名 | 说明 | 参数 |
|-----------|-----------|-----------|
| abort | 开始上传 | - |
| retry | 	重试上传 | - |

### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | 根节点样式类 |

### 更新日志

| 版本 | 类型 | 内容 |
|-----------|-----------|-----------|
| 0.0.1 | feature | 新增组件 |
