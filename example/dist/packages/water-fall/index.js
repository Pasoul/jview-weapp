import { VantComponent } from "../../common/component";
VantComponent({
  props: {
    marginRight: {
      type: Number,
      value: 15
    },
    //图片显示宽度
    width: {
      type: Number,
      value: 367 // 750rpx 即整屏宽

    },
    lists: {
      type: Array,
      value: []
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
    /**
     * colL：瀑布流左列数据
     * colR：瀑布流右列数据
     * colLHeight：瀑布流左列高度
     * colRHeight：瀑布流右列高度
     */
    renderLists: {
      colL: [],
      colR: [],
      colLHeight: 0,
      colRHeight: 0
    },
    // 预览图片列表，从总列表中过滤出图片类型
    previewImgUrls: [],
    // 播放视频的链接
    videoSrc: ""
  },
  methods: {
    _normalizeLists: function _normalizeLists(lists) {
      var _this = this;

      lists.forEach(function (item) {
        // 根据比例缩放图片
        var width = item.width,
            height = item.height;
        var scale = _this.data.width / width / 2;
        var newHeight = Number((height * scale).toFixed(2));
        item['newHeight'] = newHeight;
        var _this$data$renderList = _this.data.renderLists,
            colL = _this$data$renderList.colL,
            colR = _this$data$renderList.colR,
            colLHeight = _this$data$renderList.colLHeight,
            colRHeight = _this$data$renderList.colRHeight; // 图片添加到览的链接列表

        _this.addPreview(item); // 判断当前图片添加到左列还是右列        


        if (colLHeight <= colRHeight) {
          _this.set({
            "renderLists.colL": colL.concat(item),
            "renderLists.colLHeight": colLHeight + newHeight
          });
        } else {
          _this.set({
            "renderLists.colR": colR.concat(item),
            "renderLists.colRHeight": colRHeight + newHeight
          });
        }
      });
    },
    addPreview: function addPreview(item) {
      if (!item.url) {
        console.error("\u8BF7\u68C0\u67E5\u6B64\u56FE\u7247\u662F\u5426\u6709\u5408\u6CD5\u5B57\u6BB5url\uFF0Cid:" + item.id);
        return;
      }

      if (item.type === 1) {
        this.set({
          previewImgUrls: this.data.previewImgUrls.concat(item.url)
        });
      }
    },
    previewImg: function previewImg(item) {
      wx.previewImage({
        urls: this.data.previewImgUrls,
        current: item.url
      });
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
    playVideo: function playVideo(item) {
      var _this2 = this;

      if (!item.videoSrc) {
        console.error("\u8BF7\u68C0\u67E5\u6B64\u89C6\u9891\u662F\u5426\u6709\u5408\u6CD5\u5B57\u6BB5videoSrc\uFF0Cid:" + item.id);
        return;
      }

      this.set({
        videoSrc: item.videoSrc
      }).then(function () {
        if (!_this2.videoContext) {
          _this2.videoContext = wx.createVideoContext("van-water-fall_video");
        } // 组件内的video上下文需要绑定this


        _this2.videoContext = wx.createVideoContext("van-water-fall_video", _this2); // 全屏

        _this2.videoContext.play();

        _this2.videoContext.requestFullScreen();
      });
    },
    clickImg: function clickImg(e) {
      var _e$currentTarget$data = e.currentTarget.dataset,
          id = _e$currentTarget$data.id,
          type = _e$currentTarget$data.type;
      var item = this.data.lists.find(function (v) {
        return v.id === id;
      });

      if (!item || !id) {
        console.error("\u627E\u4E0D\u5230\u9884\u89C8\u56FE\u7247\u7684id:" + id);
        return;
      } // 如果点击的是图片，并且设置可以预览


      if (this.data.preview && type === 1) {
        this.previewImg(item);
      } // 如果点击的是播放按钮，并且设置可以播放


      if (this.data.play && type === 3) {
        this.playVideo(item);
      }

      this.$emit('clickImg', item);
    }
  },
  watch: {
    "lists": function lists(newVal, oldVal) {
      if (newVal.length) {
        this._normalizeLists(newVal.slice(oldVal.length, newVal.length));
      }
    }
  }
});