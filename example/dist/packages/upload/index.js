function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { VantComponent } from "../../common/component";
import { uploadFile } from './utils/uploadAli';
import { EVENT_ADDED, EVENT_SUCCESS, EVENT_ERROR, EVENT_REMOVED, EVENT_CLICK, STATUS_READY, STATUS_ERROR, STATUS_SUCCESS, STATUS_UPLOADING, TYPE_IMAGE, TYPE_VIDEO } from './utils/constant';
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
    // 上传图片选项
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
    // 上传视频选项
    videoOption: {
      type: Object,
      value: {
        sourceType: ['album', 'camera'],
        compressed: true,
        maxDuration: 60,
        camera: 'back'
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
    },
    preview: {
      type: Boolean,
      value: true
    },
    play: {
      type: Boolean,
      value: true
    }
  },
  data: {
    files: [],
    videoSrc: ""
  },
  methods: {
    removeFile: function removeFile(e, index) {
      var fileIndex = e ? e.currentTarget.dataset.index : index;
      if (index < 0) return;
      var files = this.data.files;
      var file = files[fileIndex];
      this.$emit(EVENT_REMOVED, file);
      file.task && file.task.abort();
      files.splice(fileIndex, 1);
      this.set({
        files: files
      }); // files数组改变，需要重新调用upload计算总上传文件数

      this.upload();
    },
    processFile: function processFile(file, type) {
      file['status'] = STATUS_READY;
      file['fileProgress'] = '0%';
      file['statusCls'] = '';
      file['resultUrl'] = '';
      file['type'] = type;

      if (type === TYPE_IMAGE) {
        file['previewPath'] = file['uploadPath'] = file.path;
      } else if (type === TYPE_VIDEO) {
        // file['previewPath'] = file.thumbTempFilePath;
        file['uploadPath'] = file.tempFilePath;
      }

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
              // TODO：thumbTempFilePath真机bug：https://developers.weixin.qq.com/community/search?query=thumbTempFilePath&page=1，暂时用oss处理
              var previewPath;

              if (file.type === TYPE_VIDEO) {
                previewPath = ossDomain ? ossDomain + aliyunFileKey + '?x-oss-process=video/snapshot,t_1000,w_750' : aliyunFileKey;
              }

              self.set({
                ["files[" + i + "].statusCls"]: STATUS_SUCCESS,
                ["files[" + i + "].status"]: STATUS_SUCCESS,
                ["files[" + i + "].resultUrl"]: ossDomain ? ossDomain + aliyunFileKey : aliyunFileKey,
                ["files[" + i + "].previewPath"]: file.type === TYPE_VIDEO ? previewPath : file.previewPath
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
          var tempFiles = res.tempFiles; // 选择完文件后触发，一般可用作文件过滤

          _this2.$emit(EVENT_ADDED, res);

          var newFiles = [];
          var i = 0,
              file = tempFiles[i];

          while (newFiles.length < count && file) {
            // 处理file
            file = _this2.processFile(_extends({}, file), TYPE_IMAGE);

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
    chooseVideo: function chooseVideo() {
      var _this3 = this;

      var _this$data$videoOptio = this.data.videoOption,
          _this$data$videoOptio2 = _this$data$videoOptio.sourceType,
          sourceType = _this$data$videoOptio2 === void 0 ? ['album', 'camera'] : _this$data$videoOptio2,
          _this$data$videoOptio3 = _this$data$videoOptio.compressed,
          compressed = _this$data$videoOptio3 === void 0 ? true : _this$data$videoOptio3,
          _this$data$videoOptio4 = _this$data$videoOptio.maxDuration,
          maxDuration = _this$data$videoOptio4 === void 0 ? 60 : _this$data$videoOptio4,
          _this$data$videoOptio5 = _this$data$videoOptio.camera,
          camera = _this$data$videoOptio5 === void 0 ? 'back' : _this$data$videoOptio5;
      wx.chooseVideo({
        sourceType: sourceType,
        compressed: compressed,
        maxDuration: maxDuration,
        camera: camera,
        success: function success(res) {
          // 选择完文件后触发，一般可用作文件过滤
          _this3.$emit(EVENT_ADDED, res);

          var file = _this3.processFile(_extends({}, res), TYPE_VIDEO);

          if (!file.ignore) {
            _this3.set({
              files: _this3.data.files.concat(file)
            }).then(function () {
              _this3.upload();
            });
          }
        }
      });
    },

    /**
     * 如果图片和视频都能选择，需要提示用户选择图片还是选择视频
     */
    chooseFile: function chooseFile() {
      var _this4 = this;

      var _this$data = this.data,
          chooseImage = _this$data.chooseImage,
          chooseVideo = _this$data.chooseVideo;

      if (chooseImage && chooseVideo) {
        wx.showActionSheet({
          itemList: ["选择图片", "选择视频"],
          success: function success(res) {
            if (res.tapIndex === 0) {
              _this4.chooseImage();
            } else if (res.tapIndex === 1) {
              _this4.chooseVideo();
            }
          }
        });
      } else if (chooseImage) {
        this.chooseImage();
      } else if (chooseVideo) {
        this.chooseVideo();
      }
    },
    fullscreenchange: function fullscreenchange(e) {
      if (!e.target.fullScreen) {
        // 如果退出全屏，则关闭视频
        this.videoContext.stop();
        this.set({
          videoSrc: ''
        });
      }
    },
    playVideo: function playVideo(file) {
      var _this5 = this;

      if (!file.resultUrl) {
        console.error("\u8BF7\u68C0\u67E5\u6B64\u89C6\u9891\u662F\u5426\u6709\u5408\u6CD5\u5B57\u6BB5resultUrl\uFF0C:" + JSON.stringify(file));
        return;
      }

      this.set({
        videoSrc: file.resultUrl
      }).then(function () {
        if (!_this5.videoContext) {
          _this5.videoContext = wx.createVideoContext("van-water-fall_video");
        } // 组件内的video上下文需要绑定this


        _this5.videoContext = wx.createVideoContext("van-water-fall_video", _this5); // 全屏

        _this5.videoContext.play();

        _this5.videoContext.requestFullScreen();
      });
    },
    previewImage: function previewImage(file) {
      var imageLists = this.data.files.reduce(function (arr, item) {
        if (item.type === TYPE_IMAGE && item.status === STATUS_SUCCESS) {
          arr.push(item.resultUrl);
        }

        return arr;
      }, []);
      var currentIndex = imageLists.indexOf(file.resultUrl);
      wx.previewImage({
        urls: imageLists,
        current: imageLists[currentIndex]
      });
    },
    fileClick: function fileClick(e) {
      var index = e.currentTarget.dataset.index;
      var files = this.data.files;
      var file = files[index];
      this.$emit(EVENT_CLICK, file); // 区分点击的是否是图片，并且设置Preview为true

      if (this.data.preview && file.type === TYPE_IMAGE) {
        this.previewImage(file);
      } else if (this.data.play && file.type === TYPE_VIDEO) {
        this.playVideo(file);
      }
    },
    start: function start() {
      this.paused = false;
      this.upload();
    },
    abort: function abort() {
      this.paused = true;
      this.data.files.forEach(function (file) {
        if (file.status === STATUS_UPLOADING) {
          file.task && file.task.abort();
          file.status = STATUS_READY;
        }
      });
    },
    retry: function retry() {
      this.paused = false;
      this.retryId = Date.now();
      this.upload(true);
    }
  },
  watch: {
    "autoUpload": function autoUpload(newVal) {
      this.paused = !newVal;
    }
  }
});