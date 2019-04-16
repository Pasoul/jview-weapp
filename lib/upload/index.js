"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var uploadAli_1 = require("./utils/uploadAli");
var constant_1 = require("./utils/constant");
function generateUUID() {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
component_1.VantComponent({
    props: {
        defaults: {
            type: Array,
            value: []
        },
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
                sizeType: ["original", "compressed"],
                // 选择图片的来源:从相册选图、使用相机
                sourceType: ["album", "camera"]
            }
        },
        // 上传视频选项
        videoOption: {
            type: Object,
            value: {
                sourceType: ["album", "camera"],
                compressed: true,
                maxDuration: 60,
                camera: "back"
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
                aliyunServerURL: "",
                aliyunTokenURL: "",
                ossDomain: ""
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
    computed: {
        renderFiles: function () {
            return this.data.files.filter(function (file) { return file.status !== constant_1.STATUS_REMOVE; });
        }
    },
    methods: {
        removeFile: function (e, id) {
            var _a;
            var fileId = e ? e.currentTarget.dataset.id : id;
            if (!fileId)
                return;
            var index = this.data.files.findIndex(function (file) { return file.id === fileId; });
            var file = this.data.files[index];
            this.$emit(constant_1.EVENT_REMOVED, file);
            file.task && file.task.abort();
            // 本质是设置index对应的file的status
            this.set((_a = {},
                _a["files[" + index + "].status"] = constant_1.STATUS_REMOVE,
                _a));
        },
        processFile: function (file, type) {
            file["status"] = constant_1.STATUS_READY;
            file["fileProgress"] = "0%";
            file["statusCls"] = "";
            file["resultUrl"] = "";
            file["type"] = type;
            file["id"] = generateUUID();
            if (type === constant_1.TYPE_IMAGE) {
                file["previewPath"] = file["uploadPath"] = file.path;
            }
            else if (type === constant_1.TYPE_VIDEO) {
                // file['previewPath'] = file.thumbTempFilePath;
                file["uploadPath"] = file.tempFilePath;
            }
            return file;
        },
        upload: function (retry) {
            var _this = this;
            var _a = this.data.action, aliyunTokenURL = _a.aliyunTokenURL, aliyunServerURL = _a.aliyunServerURL, ossDomain = _a.ossDomain;
            if (this.paused || !aliyunTokenURL || !aliyunServerURL)
                return;
            var len = this.data.files.length;
            var uploadingCount = 0, i = 0;
            var _loop_1 = function () {
                var _a;
                var file = this_1.data.files[i];
                var status_1 = file.status;
                // _retryId防止错误文件重复上传
                if (status_1 === constant_1.STATUS_READY || (retry && status_1 === constant_1.STATUS_ERROR && file._retryId !== this_1.retryId)) {
                    // 重传的文件移除icon,显示上传进度
                    if (status_1 === constant_1.STATUS_ERROR) {
                        this_1.set((_a = {},
                            _a["files[" + i + "].statusCls"] = "",
                            _a));
                    }
                    (function (i) {
                        uploadAli_1.uploadFile({
                            tempFile: file,
                            aliyunTokenURL: aliyunTokenURL,
                            aliyunServerURL: aliyunServerURL,
                            callback: function (uploadTask) {
                                uploadTask.onProgressUpdate(function (res) {
                                    var _a;
                                    _this.set((_a = {},
                                        _a["files[" + i + "].fileProgress"] = res.progress + "%",
                                        _a));
                                });
                            }
                        })
                            .then(function (aliyunFileKey) {
                            var _a;
                            // TODO：thumbTempFilePath真机bug：https://developers.weixin.qq.com/community/search?query=thumbTempFilePath&page=1，暂时用oss处理
                            var previewPath;
                            if (file.type === constant_1.TYPE_VIDEO) {
                                previewPath = ossDomain ? ossDomain + aliyunFileKey + "?x-oss-process=video/snapshot,t_1000,w_750" : aliyunFileKey;
                            }
                            _this.set((_a = {},
                                _a["files[" + i + "].statusCls"] = constant_1.STATUS_SUCCESS,
                                _a["files[" + i + "].status"] = constant_1.STATUS_SUCCESS,
                                _a["files[" + i + "].resultUrl"] = ossDomain ? ossDomain + aliyunFileKey : aliyunFileKey,
                                _a["files[" + i + "].previewPath"] = file.type === constant_1.TYPE_VIDEO ? previewPath : file.previewPath,
                                _a)).then(function () {
                                // 派发文件上传成功事件
                                _this.$emit(constant_1.EVENT_SUCCESS, file);
                                _this.upload(retry);
                            });
                        })
                            .catch(function (_a) {
                            var _b;
                            var tempFile = _a.tempFile;
                            tempFile.status !== constant_1.STATUS_REMOVE &&
                                _this.set((_b = {},
                                    _b["files[" + i + "].statusCls"] = constant_1.STATUS_ERROR,
                                    _b["files[" + i + "].status"] = constant_1.STATUS_ERROR,
                                    _b)).then(function () {
                                    // 派发文件上传失败事件
                                    _this.$emit(constant_1.EVENT_ERROR, file);
                                    _this.upload(retry);
                                });
                        });
                    })(i);
                    if (status_1 === constant_1.STATUS_ERROR) {
                        file._retryId = this_1.retryId;
                    }
                    uploadingCount++;
                }
                else if (status_1 == constant_1.STATUS_UPLOADING) {
                    uploadingCount++;
                }
                i++;
            };
            var this_1 = this;
            while (i < len && uploadingCount < this.data.simultaneousUploads) {
                _loop_1();
            }
        },
        chooseImage: function () {
            var _this = this;
            var _a = this.data.imageOption, _b = _a.count, count = _b === void 0 ? 9 : _b, _c = _a.sizeType, sizeType = _c === void 0 ? ["original", "compressed"] : _c, _d = _a.sourceType, sourceType = _d === void 0 ? ["album", "camera"] : _d;
            wx.chooseImage({
                count: count,
                sizeType: sizeType,
                sourceType: sourceType,
                success: function (res) {
                    var tempFiles = res.tempFiles;
                    // 选择完文件后触发，一般可用作文件过滤
                    _this.$emit(constant_1.EVENT_ADDED, res);
                    var newFiles = [];
                    var i = 0, file = tempFiles[i];
                    while (newFiles.length < count && file) {
                        // 处理file
                        file = _this.processFile(__assign({}, file), constant_1.TYPE_IMAGE);
                        if (!file.ignore) {
                            newFiles.push(file);
                            _this.set({
                                files: _this.data.files.concat(file)
                            }).then(function () {
                                _this.upload();
                            });
                        }
                        file = tempFiles[++i];
                    }
                }
            });
        },
        chooseVideo: function () {
            var _this = this;
            var _a = this.data.videoOption, _b = _a.sourceType, sourceType = _b === void 0 ? ["album", "camera"] : _b, _c = _a.compressed, compressed = _c === void 0 ? true : _c, _d = _a.maxDuration, maxDuration = _d === void 0 ? 60 : _d, _e = _a.camera, camera = _e === void 0 ? "back" : _e;
            wx.chooseVideo({
                sourceType: sourceType,
                compressed: compressed,
                maxDuration: maxDuration,
                camera: camera,
                success: function (res) {
                    // 选择完文件后触发，一般可用作文件过滤
                    _this.$emit(constant_1.EVENT_ADDED, res);
                    var file = _this.processFile(__assign({}, res), constant_1.TYPE_VIDEO);
                    if (!file.ignore) {
                        _this.set({
                            files: _this.data.files.concat(file)
                        }).then(function () {
                            _this.upload();
                        });
                    }
                }
            });
        },
        /**
         * 如果图片和视频都能选择，需要提示用户选择图片还是选择视频
         */
        chooseFile: function () {
            var _this = this;
            var _a = this.data, chooseImage = _a.chooseImage, chooseVideo = _a.chooseVideo;
            if (chooseImage && chooseVideo) {
                wx.showActionSheet({
                    itemList: ["选择图片", "选择视频"],
                    success: function (res) {
                        if (res.tapIndex === 0) {
                            _this.chooseImage();
                        }
                        else if (res.tapIndex === 1) {
                            _this.chooseVideo();
                        }
                    }
                });
            }
            else if (chooseImage) {
                this.chooseImage();
            }
            else if (chooseVideo) {
                this.chooseVideo();
            }
        },
        fullscreenchange: function (e) {
            this.playVideoFlag = !this.playVideoFlag;
            if (!this.playVideoFlag) {
                return;
            }
            // 如果退出全屏，则关闭视频
            this.videoContext.stop();
            this.set({
                videoSrc: ""
            });
        },
        playVideo: function (file) {
            var _this = this;
            if (!file.resultUrl) {
                console.error("\u8BF7\u68C0\u67E5\u6B64\u89C6\u9891\u662F\u5426\u6709\u5408\u6CD5\u5B57\u6BB5resultUrl\uFF0C:" + JSON.stringify(file));
                return;
            }
            this.set({
                videoSrc: file.resultUrl
            }).then(function () {
                // 组件内的video上下文需要绑定this
                if (!_this.videoContext) {
                    _this.videoContext = wx.createVideoContext("van-upload-preview_video", _this);
                }
                // 全屏
                _this.videoContext.play();
                _this.videoContext.requestFullScreen({ direction: 0 });
                _this.playVideoFlag = true;
            });
        },
        previewImage: function (file) {
            var imageLists = this.data.files.reduce(function (arr, item) {
                if (item.type === constant_1.TYPE_IMAGE && item.status === constant_1.STATUS_SUCCESS) {
                    arr.push(item.previewPath);
                }
                return arr;
            }, []);
            var currentIndex = imageLists.indexOf(file.resultUrl);
            wx.previewImage({
                urls: imageLists,
                current: imageLists[currentIndex]
            });
        },
        fileClick: function (e) {
            var index = e.currentTarget.dataset.index;
            var files = this.data.files;
            var file = files[index];
            this.$emit(constant_1.EVENT_CLICK, file);
            // 区分点击的是否是图片，并且设置Preview为true
            if (this.data.preview && file.type === constant_1.TYPE_IMAGE) {
                this.previewImage(file);
            }
            else if (this.data.play && file.type === constant_1.TYPE_VIDEO) {
                this.playVideo(file);
            }
        },
        start: function () {
            this.paused = false;
            this.upload();
        },
        abort: function () {
            this.paused = true;
            this.data.files.forEach(function (file) {
                if (file.status === constant_1.STATUS_UPLOADING) {
                    file.task && file.task.abort();
                    file.status = constant_1.STATUS_READY;
                }
            });
        },
        retry: function () {
            this.paused = false;
            this.retryId = Date.now();
            this.upload(true);
        }
    },
    watch: {
        autoUpload: function (newVal) {
            this.paused = !newVal;
        },
        defaults: function (newVal) {
            if (newVal.length) {
                this.set({
                    files: newVal
                });
            }
        }
    }
});
