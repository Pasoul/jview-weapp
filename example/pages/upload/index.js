import Page from "../../common/page";

Page({
  data: {
    defaults: [{
      id: "xxx",
      previewPath: "https://images2.bestjlb.com/v2jlbossb81242458a9b86c0cb60aaea16a8667215514127979246691.jpeg",
      resultPath: "https://images2.bestjlb.com/v2jlbossb81242458a9b86c0cb60aaea16a8667215514127979246691.jpeg",
      status: "success",
      statusCls: 'success',
      type: 'image'
    }, {
      id: "yyy",
      previewPath: "https://images2.bestjlb.com/v2jlbossce92dfff00fd44eef3d85bcd84c0aaf915514280481079201.mp4.jpeg?x-oss-process=image/format,jpg/resize,w_343/auto-orient,1",
      resultUrl: "https://images2.bestjlb.com/v2jlbossce92dfff00fd44eef3d85bcd84c0aaf915514280481079201.mp4",
      status: "success",
      statusCls: 'success',
      type: 'video'
    }],
    action: {
      aliyunServerURL: 'https://jlbapp.oss-cn-hangzhou.aliyuncs.com',
      aliyunTokenURL: 'https://test-weapp.zhixuezhen.com/jlb-weapp/upload/token/get.shtml',
      ossDomain: 'https://images2.bestjlb.com/'
    },
    preview: true,
    play: true,
    autoUpload: true,
    simultaneousUploads: 1,
    chooseImage: true,
    chooseVideo: true,
    uploadImage: "",
    useDefaultBtn: false,
    useDefaultFile: false,
    chooseVideo2: false,
    simultaneousUploads2: 1,
    autoUpload2: true,
    previewImage: "",
    hideUploadBtn: false,
    videoOption: {
      sourceType: ['album', 'camera'],
      compressed: true,
      camera: 'back'
    }
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
      console.log(e);
      // const maxSize = 3 * 1024 * 1024; // 1M
      // if (e.detail.size > maxSize) {
      //   e.detail.ignore = true;
      //   wx.showToast({
      //     title: '选取视频大于3M',
      //     icon: 'none'
      //   });
      // }
    }
  },
  fileClick(e) {
    const { type, size } = e.detail;
    const title = type === 'image' ? '图片' : '视频';
    const calcSize = (size / 1000).toFixed(2);
    if (type === 'image' && this.data.preview) return;
    if (type === 'video' && this.data.play) return;
    wx.showToast({
      icon: 'none',
      title: `当前点击${title}大小${calcSize}kb`
    });
  },
  fileSuccess(file) {
    console.log(file);
  },
  fileError(file) {},
  fileRemoved(file) {
    console.log(file);
  },
  removeFile() {
    const component = this.selectComponent(`#vanUpload1`);
    const files = component.data.files.filter(file => file.status !== 'remove');
    const lastFile = files[files.length - 1];
    component.removeFile(null, lastFile.id);
  },
  start() {
    this.selectComponent(`#vanUpload1`).start();
  },
  abort() {
    this.selectComponent(`#vanUpload1`).abort();
  },
  retry() {
    this.selectComponent(`#vanUpload1`).retry();
  },
  switchImage(e) {
    this.setData({
      chooseImage: e.detail.value
    });
  },
  switchVideo(e) {
    this.setData({
      chooseVideo: e.detail.value
    });
  },
  switchUpload(e) {
    this.setData({
      autoUpload: e.detail.value
    });
  },
  switchPreview(e) {
    this.setData({
      preview: e.detail.value
    });
  },
  switchPlay(e) {
    this.setData({
      play: e.detail.value
    });
  },
  fileClick2(e) {},
  fileSuccess2(e) {
    this.setData({
      hideUploadBtn: true,
      previewImage: e.detail.previewPath
    });
  }
});
