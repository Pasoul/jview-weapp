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
  fileRemoved(file) {
    console.log(file);
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
