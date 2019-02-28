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
  mounted() {
    this._normalizeLists();
  },
  methods: {
    _normalizeLists() {
      let lists = this.data.lists;
      lists.forEach(item => {
        // 根据比例缩放图片
        let {width, height} = item;
        let scale = this.data.width / width;
        let newHeight = Number((height * scale).toFixed(2));
        item['height'] = newHeight;
        let { colL, colR, colLHeight, colRHeight } = this.data.renderLists;
        // 判断当前图片添加到左列还是右列        
        if (colLHeight <= colRHeight) {
          this.setData({
            "renderLists.colL": colL.concat(item),
            "renderLists.colLHeight": colLHeight + newHeight
          });
        } else {
          this.setData({
            "renderLists.colR": colR.concat(item),
            "renderLists.colRHeight": colRHeight + newHeight
          });
        }
      });
      console.log(this.data.renderLists);
    },
  },
  watch: {
    "lists": function(val, oldVal) {
      console.log();
    }
  }
})