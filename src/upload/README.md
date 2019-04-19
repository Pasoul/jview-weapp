## Upload上传图片、视频

**注：** 本文中所有的原始文件对象统称为**原始文件**，而经过包装后的文件对象称为**文件对象**

**原始文件结构：**

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
| duration | 视频总时间 | `Number` |
| tempFilePath | 选定视频的临时文件路径 | `String` |
| size | 选定视频的数据量大小 | `Number` |
| height | 返回选定视频的高度 | `Number` |
| width | 返回选定视频的宽度 | `Number` |

**文件对象结构：**

图片文件：

| 参数 | 说明 | 类型 |
|-----------|-----------|-----------|
| fileProgress | 上传进度百分比 | `String`，eg：100% |
| id | 上传图片的唯一id | `	string` |
| path | 图片的本地临时文件路径 | `string` |
| previewPath | 图片的预览路径 | `string` |
| resultUrl | 上传成功之后的图片路径 | `string` |
| size | 图片大小 | `number` |
| status | 图片上传状态 | `string` |
| statusCls | 图片展示结果状态，目前只有`success`和`error`两种 | `string` |
| task | 图片当前上传任务 | `Object` |
| type | 文件类型 | `string` |
| uploadPath | 图片上传路径，和`path`参数相同 | `string` |

视频文件：

| 参数 | 说明 | 类型 |
|-----------|-----------|-----------|
| duration | 视频总时间 | `number` |
| errMsg | `wx.chooseVideo`API调用结果信息 | `String` |
| fileProgress | 上传进度百分比 | `String`，eg：100% |
| height | 返回选定视频的高度 | `Number` |
| id | 上传视频的唯一id | `	string` |
| previewPath | 视频缩略图 | `string` |
| resultUrl | 上传成功之后的视频路径 | `string` |
| size | 视频大小 | `number` |
| status | 视频上传状态 | `string` |
| statusCls | 视频展示结果状态，目前只有`success`和`error`两种 | `string` |
| task | 视频当前上传任务 | `Object` |
| tempFilePath | 选定视频的临时文件路径 | `String` |
| type | 文件类型 | `string` |
| uploadPath | 视频上传路径，和`tempFilePath`参数相同 | `string` |
| width | 返回选定视频的宽度 | `Number` |

文件上传状态：

| 参数 | 说明 |
|-----------|-----------|
| ready | 准备上传 |
| uploading | 上传中 |
| error | 上传失败 |
| success | 上传成功 |
| remove | 文件被移除 |

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
| defaults | 默认展示的文件列表 | `Array.<Object>` | 见子配置项 |
| action | 上传行为配置项 | `Object` | 见子配置项 |
| preview | 点击是否预览图片 | `Boolean` | `true` |
| play | 点击是否播放视频 | `Boolean` | `true` |
| simultaneousUploads | 并发上传数量 | `Number` | `1` |
| autoUpload | 是否自动上传 | `Boolean` | `true` |
| autoRetry | 上传失败是否自动重传（一次） | `Boolean` | `true` |
| chooseImage | 是否支持选择图片 | `Boolean` | `true` |
| chooseVideo | 是否支持选择视频 | `Boolean` | `true` |

### defaults子配置项

| 参数 | 说明 | 类型 |
|-----------|-----------|-----------|
| id | 文件唯一id | `String` |
| previewPath | 文件预览路径，若是图片该字段和`resultUrl`相等，若是视频，该字段是视频缩略图 | `String` |
| resultUrl | 文件服务器地址 | `String` |
| status | 文件上传状态，一般设置为`success` | `String` |
| statusCls | 文件上传成功展示icon，一般设置为`success` | `String` |
| type | 文件类型，`image` or `video` | `String` |

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
| abort | 中断上传 | - |
| retry | 重试上传（用于文件上传失败） | - |
| start | 开始上传 | - |
| removeFile | 删除文件 | 文件对象所处下标 |


### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | 根节点样式类 |

### 更新日志

| 版本 | 类型 | 内容 |
|-----------|-----------|-----------|
| 0.0.1 | feature | 新增组件 |
