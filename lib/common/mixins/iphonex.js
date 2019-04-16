"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isIPhoneX = null;
function getIsIPhoneX() {
    return new Promise(function (resolve, reject) {
        if (isIPhoneX !== null) {
            resolve(isIPhoneX);
        }
        else {
            wx.getSystemInfo({
                success: function (_a) {
                    var model = _a.model, screenHeight = _a.screenHeight;
                    var iphoneX = /iphone x/i.test(model);
                    var iphoneNew = /iPhone11/i.test(model) && screenHeight === 812;
                    isIPhoneX = iphoneX || iphoneNew;
                    resolve(isIPhoneX);
                },
                fail: reject
            });
        }
    });
}
exports.iphonex = Behavior({
    properties: {
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        }
    },
    created: function () {
        var _this = this;
        getIsIPhoneX().then(function (isIPhoneX) {
            _this.set({ isIPhoneX: isIPhoneX });
        });
    }
});
