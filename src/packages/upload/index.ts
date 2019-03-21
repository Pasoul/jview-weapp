import { VantComponent } from "../../common/component";
import { uploadFile } from './utils/uploadAli';
import { 
  EVENT_ADDED, 
  EVENT_SUCCESS,
  EVENT_ERROR,
  EVENT_REMOVED,
  EVENT_CLICK,
  STATUS_READY, 
  STATUS_ERROR, 
  STATUS_SUCCESS, 
  STATUS_UPLOADING,
  STATUS_REMOVE,
  TYPE_IMAGE,
  TYPE_VIDEO
} from './utils/constant';

type FileType = 'image' | 'video'

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

VantComponent({
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
        sizeType: ['original', 'compressed'],
        // 选择图片的来源:从相册选图、使用相机
        sourceType: ['album', 'camera'],
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
    videoSrc: "",
  },

  computed: {
    renderFiles() {
      return this.data.files.filter(file => file.status !== STATUS_REMOVE)
    }
  },

  methods: {
    removeFile(e, id) {
      let fileId = e ? e.currentTarget.dataset.id : id;
      if(!fileId) return;
      const index = this.data.files.findIndex(file => file.id === fileId);
      const file = this.data.files[index];
      this.$emit(EVENT_REMOVED, file);
      file.task && file.task.abort();
      // 本质是设置index对应的file的status
      this.set({
        ["files["+index+"].status"]: STATUS_REMOVE
      });
    },

    processFile(file, type:FileType){
      file['status'] = STATUS_READY;
      file['fileProgress'] = '0%';
      file['statusCls'] = '';
      file['resultUrl'] = '';
      file['type'] = type;
      file['id'] = generateUUID();
      if (type === TYPE_IMAGE) {
        file['previewPath'] = file['uploadPath'] =  file.path;
      } else if (type === TYPE_VIDEO) {
        // file['previewPath'] = file.thumbTempFilePath;
        file['uploadPath'] = file.tempFilePath;
      }
      return file
    },

    upload(retry?:boolean) {
      const { aliyunTokenURL, aliyunServerURL, ossDomain } = this.data.action;
      if ( this.paused || !aliyunTokenURL || !aliyunServerURL ) return;
      const len = this.data.files.length;
      let uploadingCount = 0, i = 0;

      while (i < len && uploadingCount < this.data.simultaneousUploads) {
        const file = this.data.files[i];
        const status = file.status;
        // _retryId防止错误文件重复上传
        if (
            status === STATUS_READY 
            || (retry && status === STATUS_ERROR && file._retryId !== this.retryId)
          ) {
          // 重传的文件移除icon,显示上传进度
          if (status === STATUS_ERROR) {
            this.set({
              ["files["+i+"].statusCls"]: ''
            })
          }

          ((i) => {
            uploadFile({
              tempFile: file, 
              aliyunTokenURL: aliyunTokenURL, 
              aliyunServerURL: aliyunServerURL,
              callback: (uploadTask) => {
                uploadTask.onProgressUpdate(res => {
                  this.set({
                    ["files["+i+"].fileProgress"]: res.progress + '%'
                  })
                })
              }
            }).then((aliyunFileKey:string) => {
              // TODO：thumbTempFilePath真机bug：https://developers.weixin.qq.com/community/search?query=thumbTempFilePath&page=1，暂时用oss处理
              let previewPath;
              if (file.type === TYPE_VIDEO) {
                previewPath = ossDomain 
                              ? ossDomain + aliyunFileKey + '?x-oss-process=video/snapshot,t_1000,w_750'
                              : aliyunFileKey;
              }
              this.set({
                ["files["+i+"].statusCls"]: STATUS_SUCCESS,
                ["files["+i+"].status"]: STATUS_SUCCESS,
                ["files["+i+"].resultUrl"]: ossDomain ? ossDomain + aliyunFileKey : aliyunFileKey,
                ["files["+i+"].previewPath"]: file.type === TYPE_VIDEO ? previewPath : file.previewPath
              }).then(() => {
                // 派发文件上传成功事件
                this.$emit(EVENT_SUCCESS, file);
                this.upload(retry);
              })
              
            }).catch(({tempFile}) => {
              tempFile.status !== STATUS_REMOVE && 
              this.set({
                ["files["+i+"].statusCls"]: STATUS_ERROR,
                ["files["+i+"].status"]: STATUS_ERROR
              }).then(() => {
                // 派发文件上传失败事件
                this.$emit(EVENT_ERROR, file);
                this.upload(retry);
              })
            })
          })(i)
          
          if (status === STATUS_ERROR) {
            file._retryId = this.retryId;
          }
          uploadingCount ++;
        } else if (status == STATUS_UPLOADING) {
          uploadingCount ++;
        }
        
        i++;
      }
    },

    chooseImage() {
      let {
            count = 9, 
            sizeType = ['original', 'compressed'], 
            sourceType = ['album', 'camera']
          } = this.data.imageOption;
      wx.chooseImage({
        count,
        sizeType,
        sourceType,
        success: res => {
          const {tempFiles} = res;
          // 选择完文件后触发，一般可用作文件过滤
          this.$emit(EVENT_ADDED, res)
          const newFiles = [];
          let i = 0, file = tempFiles[i];
          while (newFiles.length < count && file) {
            // 处理file
            file = this.processFile({...file}, TYPE_IMAGE);
            if (!file.ignore) {
              newFiles.push(file);
              this.set({
               files: this.data.files.concat(file)
              }).then(() => {
                this.upload()
              })
            }
            file = tempFiles[++i];
          }
        }
      });
    },

    chooseVideo() {
      let {
        sourceType = ['album', 'camera'],
        compressed = true,
        maxDuration = 60,
        camera = 'back'
      } = this.data.videoOption;
      wx.chooseVideo({
        sourceType,
        compressed,
        maxDuration,
        camera,
        success: (res) => {
          // 选择完文件后触发，一般可用作文件过滤
          this.$emit(EVENT_ADDED, res)
          let file = this.processFile({...res}, TYPE_VIDEO);
          if (!file.ignore) {
            this.set({
              files: this.data.files.concat(file)
            }).then(() => {
              this.upload()
            })
          }
        }
      })
    },

    /**
     * 如果图片和视频都能选择，需要提示用户选择图片还是选择视频
     */
    chooseFile() {
      let {chooseImage, chooseVideo} = this.data;
      if (chooseImage && chooseVideo) {
        wx.showActionSheet({
          itemList: ["选择图片", "选择视频"],
          success: res => {
            if (res.tapIndex === 0) {
              this.chooseImage();
            } else if (res.tapIndex === 1) {
              this.chooseVideo();
            }
          }
        });
      } else if (chooseImage) {
        this.chooseImage();
      } else if (chooseVideo) {
        this.chooseVideo();
      }
    },

    fullscreenchange(e) {
      this.playVideoFlag = !this.playVideoFlag;
      if (!this.playVideoFlag) {
        return;
      }
      // 如果退出全屏，则关闭视频
      this.videoContext.stop();
      this.set({
        videoSrc: ''
      })
    },

    playVideo(file) {
      if (!file.resultUrl) {
        console.error(`请检查此视频是否有合法字段resultUrl，:${JSON.stringify(file)}`)
        return;
      }
      this.set({
        videoSrc: file.resultUrl
      }).then(() => {
        // 组件内的video上下文需要绑定this
        if (!this.videoContext) {
          this.videoContext = wx.createVideoContext("van-upload-preview_video", this);
        }
        // 全屏
        this.videoContext.play();
        this.videoContext.requestFullScreen({direction: 0});
        this.playVideoFlag = true;
      })
    },

    previewImage(file) {
      let imageLists = this.data.files.reduce((arr, item) => {
        if (item.type === TYPE_IMAGE && item.status === STATUS_SUCCESS) {
          arr.push(item.previewPath)
        }
        return arr;
      }, []); 
      let currentIndex = imageLists.indexOf(file.resultUrl);
      wx.previewImage({
        urls: imageLists,
        current: imageLists[currentIndex]
      })
    },

    fileClick(e) {
      let index = e.currentTarget.dataset.index;
      const files = this.data.files;
      const file = files[index];
      this.$emit(EVENT_CLICK, file);
      // 区分点击的是否是图片，并且设置Preview为true
      if(this.data.preview && file.type === TYPE_IMAGE) {
        this.previewImage(file)
      } else if (this.data.play && file.type === TYPE_VIDEO) {
        this.playVideo(file)
      }
    },

    start() {
      this.paused = false
      this.upload()
    },

    abort() {
      this.paused = true;
      this.data.files.forEach(file => {
        if (file.status === STATUS_UPLOADING) {
          file.task && file.task.abort();
          file.status = STATUS_READY;
        }
      })
    },

    retry() {
      this.paused = false;
      this.retryId = Date.now();
      this.upload(true);
    }
  },
  watch: {
    "autoUpload": function(newVal) {
      this.paused = !newVal;
    },

    "defaults": function(newVal) {
      if (newVal.length) {
        this.set({
          files: newVal
        })
      }
    }
  }
})