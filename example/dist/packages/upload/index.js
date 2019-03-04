import { VantComponent } from "../../common/component"; // import { isEmoji } from '/node_modules/jlb-tools';

var EVENT_ADDED = 'files-added';
var STATUS_READY = 'ready';
var STATUS_UPLOADING = 'uploading';
var STATUS_ERROR = 'error';
var STATUS_SUCCESS = 'success';
VantComponent({
  props: {
    // 使用上传按钮默认样式
    useDefaultBtn: {
      type: Boolean,
      value: true
    },
    // 使用预览文件默认样式
    useDefaultFile: {
      type: Boolean,
      value: true
    },
    // 是否选择图片
    chooseImage: {
      type: Boolean,
      value: true
    },
    // 图片选项
    imageOption: {
      type: Object,
      value: {
        // 最多可以选择的图片张数
        count: 9,
        // 所选的图片的尺寸:原图、压缩图
        sizeType: ['original', 'compressed'],
        // 选择图片的来源:从相册选图、使用相机
        sourceType: ['album', 'camera']
      }
    },
    // 是否选择视频
    chooseVideo: {
      type: Boolean,
      value: true
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      value: true
    },
    // 子配置项,如果 action 是字符串，则会被处理成 { target: action } 这样结构
    action: {
      type: null,
      default: ""
    },
    // 并发上传数
    simultaneousUploads: {
      type: Number,
      value: 1
    }
  },
  data: {
    files: [],
    actionOptions: ""
  },
  mounted: function mounted() {
    console.log(11); // console.log(isEmoji('😈'))
  },
  methods: {
    upload: function upload(retry) {
      var options = this.actionOptions;
      if (!options) return;
      var len = this.data.files.length;
      var uploadingCount = 0,
          i = 0;

      while (i < len && uploadingCount < this.data.simultaneousUploads) {
        var file = this.data.files[i];
        var status = file.status; // _retryId防止错误文件重复上传

        if (status === STATUS_READY || retry && status === STATUS_ERROR && file._retryId !== this.retryId) {// if (status === STATUS_ERROR) {
          // }
        }
      }
    },
    chooseImage: function chooseImage() {
      var _this = this;

      var _this$data$imageOptio = this.data.imageOption,
          _this$data$imageOptio2 = _this$data$imageOptio.count,
          count = _this$data$imageOptio2 === void 0 ? 9 : _this$data$imageOptio2,
          _this$data$imageOptio3 = _this$data$imageOptio.sizeType,
          sizeType = _this$data$imageOptio3 === void 0 ? ['original', 'compressed'] : _this$data$imageOptio3,
          _this$data$imageOptio4 = _this$data$imageOptio.sourceType,
          sourceType = _this$data$imageOptio4 === void 0 ? ['album', 'camera'] : _this$data$imageOptio4;
      wx.chooseImage({
        count: count,
        sizeType: sizeType,
        sourceType: sourceType,
        success: function success(res) {
          var tempFiles = res.tempFiles,
              tempFilePaths = res.tempFilePaths; // 选择完文件后触发，一般可用作文件过滤

          _this.$emit(EVENT_ADDED, {
            tempFiles: tempFiles,
            tempFilePaths: tempFilePaths
          });

          var newFiles = [];
          var i = 0,
              file = tempFiles[i];

          while (newFiles.length < count && file) {
            if (!file.ignore) {
              newFiles.push(file);

              _this.set({
                "files[i]": file
              }).then(function () {
                _this.upload();
              });
            }

            file = tempFiles[++i];
          }
        }
      });
    },
    chooseVideo: function chooseVideo() {},

    /**
     * 如果图片和视频都能选择，需要提示用户选择图片还是选择视频
     */
    chooseFile: function chooseFile() {
      var _this2 = this;

      var _this$data = this.data,
          chooseImage = _this$data.chooseImage,
          chooseVideo = _this$data.chooseVideo;

      if (chooseImage && chooseVideo) {
        wx.showActionSheet({
          itemList: ["选择图片", "选择视频"],
          success: function success(res) {
            if (res.tapIndex === 0) {
              _this2.chooseImage();
            } else if (res.tapIndex === 1) {
              _this2.chooseVideo();
            }
          }
        });
      } else if (chooseImage) {
        this.chooseImage();
      } else if (chooseVideo) {
        this.chooseVideo();
      }
    },
    fileClick: function fileClick() {}
  },
  watch: {
    "action": function action(newVal) {
      if (typeof newVal === 'string') {
        this.setData({
          actionOptions: newVal ? {
            target: newVal
          } : null
        });
      } else {
        this.setData({
          actionOptions: newVal
        });
      }
    }
  }
});