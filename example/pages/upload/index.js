import Page from "../../common/page";

Page({
  data: {
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
    hideUploadBtn: false
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
      const maxSize = 3 * 1024 * 1024; // 1M
      if (e.detail.size > maxSize) {
        e.detail.ignore = true;
        wx.showToast({
          title: '选取视频大于3M',
          icon: 'none'
        });
      }
    }
  },
  fileClick(e) {
    console.log(e);
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
    // console.log(file);
  },
  fileError(file) {},
  fileRemoved(file) {
    console.log(file);
  },
  removeFile() {
    const component = this.selectComponent(`#vanUpload1`);
    const files = component.data.files;
    component.removeFile(null, files.length - 1);
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
