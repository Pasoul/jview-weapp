"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transition = function (showDefaultValue) {
    return Behavior({
        properties: {
            customStyle: String,
            show: {
                type: Boolean,
                value: showDefaultValue,
                observer: 'observeShow' // observer 表示属性值被更改时的响应函数
            },
            duration: {
                type: Number,
                value: 300
            }
        },
        data: {
            type: '',
            inited: false,
            display: false,
            supportAnimation: true
        },
        attached: function () {
            if (this.data.show) {
                this.show();
            }
            this.detectSupport();
        },
        methods: {
            detectSupport: function () {
                var _this = this;
                wx.getSystemInfo({
                    success: function (info) {
                        if (info && info.system && info.system.indexOf('iOS 8') === 0) {
                            _this.set({ supportAnimation: false });
                        }
                    }
                });
            },
            observeShow: function (value) {
                if (value) {
                    this.show();
                }
                else {
                    if (this.data.supportAnimation) {
                        this.set({ type: 'leave' });
                    }
                    else {
                        this.set({ display: false });
                    }
                }
            },
            show: function () {
                this.set({
                    inited: true,
                    display: true,
                    type: 'enter'
                });
            },
            onAnimationEnd: function () {
                if (!this.data.show) {
                    this.set({
                        display: false
                    });
                }
            }
        }
    });
};
