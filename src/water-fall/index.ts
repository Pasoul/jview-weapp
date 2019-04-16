import { VantComponent } from "../common/component";

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
    _normalizeLists(lists) {
      lists.forEach(item => {
        // 根据比例缩放图片
        let { width, height } = item;
        let scale = this.data.width / width / 2;
        let newHeight = Number((height * scale).toFixed(2));
        item["newHeight"] = newHeight;
        let { colL, colR, colLHeight, colRHeight } = this.data.renderLists;
        // 图片添加到览的链接列表
        this.addPreview(item);
        // 判断当前图片添加到左列还是右列
        if (colLHeight <= colRHeight) {
          this.set({
            "renderLists.colL": colL.concat(item),
            "renderLists.colLHeight": colLHeight + newHeight
          });
        } else {
          this.set({
            "renderLists.colR": colR.concat(item),
            "renderLists.colRHeight": colRHeight + newHeight
          });
        }
      });
    },
    addPreview(item) {
      if (!item.url) {
        console.error(`请检查此图片是否有合法字段url，id:${item.id}`);
        return;
      }
      if (item.type === 1) {
        this.set({
          previewImgUrls: this.data.previewImgUrls.concat(item.url)
        });
      }
    },
    previewImg(item) {
      wx.previewImage({
        urls: this.data.previewImgUrls,
        current: item.url
      });
    },
    fullscreenchange(e) {
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
    playVideo(item) {
      if (!item.videoSrc) {
        console.error(`请检查此视频是否有合法字段videoSrc，id:${item.id}`);
        return;
      }
      this.set({
        videoSrc: item.videoSrc
      }).then(() => {
        if (!this.videoContext) {
          // 组件内的video上下文需要绑定this
          this.videoContext = wx.createVideoContext("van-water-fall_video", this);
        }
        this.videoContext.play();
        this.videoContext.requestFullScreen({ direction: 0 });
        this.playVideoFlag = true;
      });
    },
    clickImg(e) {
      let { id, type } = e.currentTarget.dataset;
      let item = this.data.lists.find(v => v.id === id);
      if (!item || !id) {
        console.error(`找不到预览图片的id:${id}`);
        return;
      }
      // 如果点击的是图片，并且设置可以预览
      if (this.data.preview && type === 1) {
        this.previewImg(item);
      }
      // 如果点击的是播放按钮，并且设置可以播放
      if (this.data.play && type === 3) {
        this.playVideo(item);
      }
      this.$emit("fileClick", item);
    }
  },
  watch: {
    lists: function(newVal, oldVal) {
      if (newVal.length) {
        this._normalizeLists(newVal.slice(oldVal.length, newVal.length));
      }
    }
  }
});
