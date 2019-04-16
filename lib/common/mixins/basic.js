"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 定义基础特性，触发事件和查询节点信息
exports.basic = Behavior({
    methods: {
        $emit: function () {
            this.triggerEvent.apply(this, arguments);
        },
        getRect: function (selector, all) {
            var _this = this;
            return new Promise(function (resolve) {
                wx.createSelectorQuery()
                    .in(_this)[all ? 'selectAll' : 'select'](selector)
                    .boundingClientRect(function (rect) {
                    if (all && Array.isArray(rect) && rect.length) {
                        resolve(rect);
                    }
                    if (!all && rect) {
                        resolve(rect);
                    }
                })
                    .exec();
            });
        }
    }
});
