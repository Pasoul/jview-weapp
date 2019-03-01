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
    totalLength: 0
  },
  methods: {
    _normalizeLists(lists) {
      lists.forEach(item => {
        // 根据比例缩放图片
        let {width, height} = item;
        let scale = this.data.width / width / 2;
        let newHeight = Number((height * scale).toFixed(2));
        item['height'] = newHeight;
        let { colL, colR, colLHeight, colRHeight } = this.data.renderLists;
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
    previewImg() {
      // wx.previewImage({

      // })
    },
    clickImg(e) {
      let {id, type} = e.currentTarget.dataset;
      // 如果点击的是图片，并且设置可以预览
      if (this.data.preview && type === 1) {
        this.previewImg()
      }
      this.$emit('clickImg', {id, type});
    }
  },
  watch: {
    "lists": function(newVal, oldVal) {
      if(newVal.length) {
        this._normalizeLists(newVal.slice(oldVal.length, newVal.length));
      }
    }
  }
})