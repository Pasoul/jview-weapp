import { VantComponent } from "../../common/component";

const DIRECTION_H = "horizontal";
const DIRECTION_V = "vertical";

VantComponent({
  props: {
    direction: {
      type: String,
      value: DIRECTION_H
    },
    labels: {
      type: Array,
      value: []
    },
    txts: {
      type: Array,
      value: this.labels
    }
  },
  watch: {
    direction: function(val) {
      if (val !== DIRECTION_H && val !== DIRECTION_V) {
        console.error(`direction值必须是${DIRECTION_H}或${DIRECTION_V}，当前设置${val}`);
      }
    }
  }
});
