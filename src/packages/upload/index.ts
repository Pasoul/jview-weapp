import { VantComponent } from "../../common/component";
// import { isEmoji } from '/node_modules/jlb-tools';
const EVENT_ADDED = 'files-added';

const STATUS_READY = 'ready';
const STATUS_UPLOADING = 'uploading';
const STATUS_ERROR = 'error';
const STATUS_SUCCESS = 'success';

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
  mounted() {
    console.log(11);
    
    // console.log(isEmoji('😈'))
  },
  methods: {
    upload(retry) {
      const options = this.actionOptions;
      if (!options) return;
      const len = this.data.files.length;
      let uploadingCount = 0, i = 0;
      while (i < len && uploadingCount < this.data.simultaneousUploads) {
        const file = this.data.files[i];
        const status = file.status;
        // _retryId防止错误文件重复上传
        if (status === STATUS_READY || (retry && status === STATUS_ERROR && file._retryId !== this.retryId)) {
          // if (status === STATUS_ERROR) {

          // }
        }
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
            if (!file.ignore) {
              newFiles.push(file);
              this.set({
                "files[i]": file
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

    }
  },
  watch: {
    "action": function(newVal) {
      if (typeof newVal === 'string') {
        this.setData({
          actionOptions: newVal ? { target: newVal } : null
        })
      } else {
        this.setData({
          actionOptions: newVal
        })
      }
    }
  }
})