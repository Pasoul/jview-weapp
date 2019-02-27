// slide-view/slide-view.js
var _windowWidth = wx.getSystemInfoSync().windowWidth; // (px)

import { VantComponent } from '../../common/component';
VantComponent({
  /**
   * 组件的属性列表
   */
  props: {
    //  组件显示区域的宽度 (rpx)
    width: {
      type: Number,
      value: 750 // 750rpx 即整屏宽

    },
    //  组件显示区域的高度 (rpx)
    height: {
      type: Number,
      value: 0
    },
    //  组件滑动显示区域的宽度 (rpx)
    slideWidth: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    viewWidth: _windowWidth,
    // (rpx)
    //  movable-view偏移量
    x: 0,
    //  movable-view是否可以出界
    out: false
  },
  mounted: function mounted() {
    this.updateRight();
  },
  methods: {
    close: function close() {
      this.setData({
        x: 0
      });
    },
    updateRight: function updateRight() {
      var _this = this;

      // 获取右侧滑动显示区域的宽度
      this.getRect('.right').then(function (res) {
        _this._slideWidth = res.width;
        _this._threshold = res.width / 3;
        _this._viewWidth = _this.data.width + res.width * (750 / _windowWidth);

        _this.setData({
          viewWidth: _this._viewWidth
        });
      });
    },
    onTouchStart: function onTouchStart(e) {
      this._startX = e.changedTouches[0].pageX;
    },
    //  当滑动范围超过阈值自动完成剩余滑动
    onTouchEnd: function onTouchEnd(e) {
      this._endX = e.changedTouches[0].pageX;
      var _endX = this._endX,
          _startX = this._startX,
          _threshold = this._threshold; // 当slide-view展开的时候，从右往左滑动，不需要关闭slide-view

      if (_endX < _startX && this.data.out === false) return;

      if (_startX - _endX >= _threshold) {
        this.setData({
          x: -this._slideWidth
        });
      } else if (_startX - _endX < _threshold && _startX - _endX > 0) {
        this.setData({
          x: 0
        });
      } else if (_endX - _startX >= _threshold) {
        this.setData({
          x: 0
        });
      } else if (_endX - _startX < _threshold && _endX - _startX > 0) {
        this.setData({
          x: -this._slideWidth
        });
      }
    },
    //  根据滑动的范围设定是否允许movable-view出界
    onChange: function onChange(e) {
      if (!this.data.out && e.detail.x < -this._threshold) {
        this.setData({
          out: true
        });
      } else if (this.data.out && e.detail.x >= -this._threshold) {
        this.setData({
          out: false
        });
      }
    }
  }
});