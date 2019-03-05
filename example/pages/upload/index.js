import Page from "../../common/page";

Page({
  data: {
    action: {
      aliyunServerURL: 'https://jlbapp.oss-cn-hangzhou.aliyuncs.com',
      aliyunTokenURL: 'https://test-weapp.zhixuezhen.com/jlb-weapp/upload/token/get.shtml',
      ossDomain: 'https://images2.bestjlb.com/'
    }
  },
  fileSuccess(file) {
    // console.log(file);
  },
  abort() {
    this.selectComponent(`#vanUpload1`).abort();
  },
  retry() {
    this.selectComponent(`#vanUpload1`).retry();
  }
});
