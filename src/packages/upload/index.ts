import { VantComponent } from "../../common/component";
import { uploadFile } from './utils/uploadAli';
import { 
  EVENT_ADDED, 
  EVENT_SUCCESS,
  EVENT_ERROR,
  STATUS_READY, 
  STATUS_ERROR, 
  STATUS_SUCCESS, 
  STATUS_UPLOADING
} from './utils/constant';

export interface TempFile extends Weapp.TempFile {
  status?: string
  fileProgress?:string
  statusCls?:string
  resultUrl?:string
}

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
        sourceType: ['album', 'camera'],
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
    files: [],
  },
  methods: {
    processFile(file:TempFile):TempFile {
      file['status'] = STATUS_READY;
      file['fileProgress'] = '0%';
      file['statusCls'] = '';
      file['resultUrl'] = ''
      return file
    },
    upload(retry?:boolean) {
      const { aliyunTokenURL, aliyunServerURL, ossDomain } = this.data.action;
      if ( this.paused || !aliyunTokenURL || !aliyunServerURL ) return;
      const len = this.data.files.length;
      let uploadingCount = 0, i = 0, self = this;
      while (i < len && uploadingCount < this.data.simultaneousUploads) {
        const file = this.data.files[i];
        const status = file.status;
        // _retryId防止错误文件重复上传
        if (status === STATUS_READY || (retry && status === STATUS_ERROR && file._retryId !== this.retryId)) {
          (function(i) {
            uploadFile({
              tempFile: file, 
              aliyunTokenURL: aliyunTokenURL, 
              aliyunServerURL: aliyunServerURL,
              callback: (uploadTask) => {
                uploadTask.onProgressUpdate(res => {
                  self.set({
                    ["files["+i+"].fileProgress"]: res.progress + '%'
                  })
                })
              }
            }).then((aliyunFileKey) => {
              self.set({
                ["files["+i+"].statusCls"]: STATUS_SUCCESS,
                ["files["+i+"].status"]: STATUS_SUCCESS,
                ["files["+i+"].resultUrl"]: ossDomain ? ossDomain + aliyunFileKey : aliyunFileKey
              }).then(() => {
                // 派发文件上传成功事件
                self.$emit(EVENT_SUCCESS, file);
                self.upload(retry);
              })
              
            }).catch(err => {
              self.set({
                ["files["+i+"].statusCls"]: STATUS_ERROR,
                ["files["+i+"].status"]: STATUS_ERROR
              }).then(() => {
                // 派发文件上传失败事件
                self.$emit(EVENT_ERROR, file);
                self.upload(retry);
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
        count: count,
        sizeType: sizeType,
        sourceType: sourceType,
        success: res => {
          const {tempFiles, tempFilePaths} = res;
          // 选择完文件后触发，一般可用作文件过滤
          this.$emit(EVENT_ADDED, {tempFiles, tempFilePaths})
          const newFiles = [];
          let i = 0, file = tempFiles[i];
          while (newFiles.length < count && file) {
            // 处理file
            file = this.processFile(file);
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
    chooseVideo() {},
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
    fileClick() {

    },
    abort() {
      this.paused = true;
      this.data.files.forEach(file => {
        console.log(file);
        
        // if (file.status === STATUS_UPLOADING) {
        //   file.task.abort();
        //   file.status = STATUS_READY;
        // }
      })
    },
    retry() {
      this.paused = false;
      this.retryId = Date.now();
      this.upload(true);
    }
  }
})