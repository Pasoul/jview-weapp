import { VantComponent } from "../../common/component";
import { uploadFile } from './utils/uploadAli';
import { EVENT_ADDED, EVENT_SUCCESS, EVENT_ERROR, STATUS_READY, STATUS_ERROR, STATUS_SUCCESS, STATUS_UPLOADING } from './utils/constant';
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
    // 子配置项
    action: {
      type: Object,
      value: {
        aliyunServerURL: '',
        aliyunTokenURL: '',
        ossDomain: ''
      }
    },
    // 并发上传数
    simultaneousUploads: {
      type: Number,
      value: 4
    }
  },
  data: {
    files: []
  },
  methods: {
    processFile: function processFile(file) {
      file['status'] = STATUS_READY;
      file['fileProgress'] = '0%';
      file['statusCls'] = '';
      file['resultUrl'] = '';
      return file;
    },
    upload: function upload(retry) {
      var _this = this;

      var _this$data$action = this.data.action,
          aliyunTokenURL = _this$data$action.aliyunTokenURL,
          aliyunServerURL = _this$data$action.aliyunServerURL,
          ossDomain = _this$data$action.ossDomain;
      if (this.paused || !aliyunTokenURL || !aliyunServerURL) return;
      var len = this.data.files.length;
      var uploadingCount = 0,
          i = 0,
          self = this;

      var _loop = function _loop() {
        var file = _this.data.files[i];
        var status = file.status; // _retryId防止错误文件重复上传

        if (status === STATUS_READY || retry && status === STATUS_ERROR && file._retryId !== _this.retryId) {
          (function (i) {
            uploadFile({
              tempFile: file,
              aliyunTokenURL: aliyunTokenURL,
              aliyunServerURL: aliyunServerURL,
              callback: function callback(uploadTask) {
                uploadTask.onProgressUpdate(function (res) {
                  self.set({
                    ["files[" + i + "].fileProgress"]: res.progress + '%'
                  });
                });
              }
            }).then(function (aliyunFileKey) {
              self.set({
                ["files[" + i + "].statusCls"]: STATUS_SUCCESS,
                ["files[" + i + "].status"]: STATUS_SUCCESS,
                ["files[" + i + "].resultUrl"]: ossDomain ? ossDomain + aliyunFileKey : aliyunFileKey
              }).then(function () {
                // 派发文件上传成功事件
                self.$emit(EVENT_SUCCESS, file);
                self.upload(retry);
              });
            }).catch(function (err) {
              self.set({
                ["files[" + i + "].statusCls"]: STATUS_ERROR,
                ["files[" + i + "].status"]: STATUS_ERROR
              }).then(function () {
                // 派发文件上传失败事件
                self.$emit(EVENT_ERROR, file);
                self.upload(retry);
              });
            });
          })(i);

          if (status === STATUS_ERROR) {
            file._retryId = _this.retryId;
          }

          uploadingCount++;
        } else if (status == STATUS_UPLOADING) {
          uploadingCount++;
        }

        i++;
      };

      while (i < len && uploadingCount < this.data.simultaneousUploads) {
        _loop();
      }
    },
    chooseImage: function chooseImage() {
      var _this2 = this;

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

          _this2.$emit(EVENT_ADDED, {
            tempFiles: tempFiles,
            tempFilePaths: tempFilePaths
          });

          var newFiles = [];
          var i = 0,
              file = tempFiles[i];

          while (newFiles.length < count && file) {
            // 处理file
            file = _this2.processFile(file);

            if (!file.ignore) {
              newFiles.push(file);

              _this2.set({
                files: _this2.data.files.concat(file)
              }).then(function () {
                _this2.upload();
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
      var _this3 = this;

      var _this$data = this.data,
          chooseImage = _this$data.chooseImage,
          chooseVideo = _this$data.chooseVideo;

      if (chooseImage && chooseVideo) {
        wx.showActionSheet({
          itemList: ["选择图片", "选择视频"],
          success: function success(res) {
            if (res.tapIndex === 0) {
              _this3.chooseImage();
            } else if (res.tapIndex === 1) {
              _this3.chooseVideo();
            }
          }
        });
      } else if (chooseImage) {
        this.chooseImage();
      } else if (chooseVideo) {
        this.chooseVideo();
      }
    },
    fileClick: function fileClick() {},
    abort: function abort() {
      this.paused = true;
      this.data.files.forEach(function (file) {
        console.log(file); // if (file.status === STATUS_UPLOADING) {
        //   file.task.abort();
        //   file.status = STATUS_READY;
        // }
      });
    },
    retry: function retry() {
      this.paused = false;
      this.retryId = Date.now();
      this.upload(true);
    }
  }
});