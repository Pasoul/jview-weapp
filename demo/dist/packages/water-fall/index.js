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
    }
  },
  mounted: function mounted() {
    this._normalizeLists();
  },
  methods: {
    _normalizeLists: function _normalizeLists() {
      var _this = this;

      var lists = this.data.lists;
      lists.forEach(function (item) {
        // 根据比例缩放图片
        var width = item.width,
            height = item.height;
        var scale = _this.data.width / width;
        var newHeight = Number((height * scale).toFixed(2));
        item['height'] = newHeight;
        var _this$data$renderList = _this.data.renderLists,
            colL = _this$data$renderList.colL,
            colR = _this$data$renderList.colR,
            colLHeight = _this$data$renderList.colLHeight,
            colRHeight = _this$data$renderList.colRHeight; // 判断当前图片添加到左列还是右列        

        if (colLHeight <= colRHeight) {
          _this.setData({
            "renderLists.colL": colL.concat(item),
            "renderLists.colLHeight": colLHeight + newHeight
          });
        } else {
          _this.setData({
            "renderLists.colR": colR.concat(item),
            "renderLists.colRHeight": colRHeight + newHeight
          });
        }
      });
      console.log(this.data.renderLists);
    }
  },
  watch: {
    "lists": function lists(val, oldVal) {
      console.log();
    }
  }
});