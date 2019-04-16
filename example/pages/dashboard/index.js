import list from "../../config";
import Page from "../../common/page";

Page({
  data: {
    list
  },
  toDetail(e) {
    var path = e.target.dataset.url;
    wx.navigateTo({
      url: `/pages${path}/index`
    });
  }
});
