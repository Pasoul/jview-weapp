"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// slide-view/slide-view.js
var _windowWidth = wx.getSystemInfoSync().windowWidth; // (px)
var component_1 = require("../common/component");
component_1.VantComponent({
    props: {
        //  slide-view组件的宽度
        width: {
            type: Number,
            value: 750 // 750rpx 即整屏宽
        },
        //  slide-view组件的高度
        height: {
            type: Number,
            value: 0
        },
        //  滑动展示区域的宽度（默认高度与slide-view相同）
        slideWidth: {
            type: Number,
            value: 0
        }
    },
    data: {
        //  movable-view偏移量
        x: 0,
        //  movable-view是否可以出界
        out: false
    },
    mounted: function () {
        this.updateRight();
    },
    methods: {
        close: function () {
            this.setData({
                x: 0
            });
        },
        updateRight: function () {
            var _this = this;
            // 获取右侧滑动显示区域的宽度
            this.getRect(".right").then(function (res) {
                _this._slideWidth = res.width;
                _this._threshold = res.width / 3;
                _this._viewWidth = _this.data.width + res.width * (750 / _windowWidth);
            });
        },
        onTouchStart: function (e) {
            this._startX = e.changedTouches[0].pageX;
            this._startY = e.changedTouches[0].pageY;
        },
        //  当滑动范围超过阈值自动完成剩余滑动
        onTouchEnd: function (e) {
            this._endX = e.changedTouches[0].pageX;
            this._endY = e.changedTouches[0].pageY;
            var _a = this, _endX = _a._endX, _endY = _a._endY, _startX = _a._startX, _startY = _a._startY, _threshold = _a._threshold;
            // 当slide-view展开的时候，从右往左滑动，不需要关闭slide-view，增加对x的判断。防止初始滑动不超过_threshold的距离，直接被return，不能回到初始位置。
            if (_endX < _startX && this.data.out === false && this.data.x !== 0)
                return;
            // 滑动超过30度角 return
            if (this.getAngle({ X: _startX, Y: _startY }, { X: _endX, Y: _endY }) > 30) {
                this.setData({
                    x: 0
                });
                return;
            }
            if (_startX - _endX >= _threshold) {
                this.setData({
                    x: -this._slideWidth
                });
                // 通知父组件打开slide-view
                this.$emit("slideOpen");
            }
            else if (_startX - _endX < _threshold && _startX - _endX > 0) {
                this.setData({
                    x: 0
                });
            }
            else if (_endX - _startX >= _threshold) {
                this.setData({
                    x: 0
                });
                this.$emit("slideClose");
            }
        },
        //  根据滑动的范围设定是否允许movable-view出界
        onChange: function (e) {
            if (!this.data.out && e.detail.x < -this._threshold) {
                this.setData({
                    out: true
                });
            }
            else if (this.data.out && e.detail.x >= -this._threshold) {
                this.setData({
                    out: false
                });
            }
        },
        /**
         * 计算滑动角度
         * @param {Object} start 起点坐标
         * @param {Object} end 终点坐标
         */
        getAngle: function (start, end) {
            var _X = end.X - start.X, _Y = end.Y - start.Y;
            return Math.abs((360 * Math.atan(_Y / _X)) / (2 * Math.PI));
        }
    }
});
