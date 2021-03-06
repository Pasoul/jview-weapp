"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function getAliToken(url) {
    return new Promise(function (resolve, reject) {
        var aliUploadToken = wx.getStorageSync("aliUploadToken") || "";
        var now = new Date().getTime();
        // 当前时间 - token存储的时间 > 50 min,则不取缓存
        if (aliUploadToken && aliUploadToken.expireTime && (now - aliUploadToken.expireTime) < 50 * 60 * 1000) {
            resolve(aliUploadToken);
        }
        else {
            wx.request({
                url: url,
                data: {
                    tokenType: "Ali"
                },
                method: 'POST',
                success: function success(res) {
                    if (res.statusCode === 200 && res.data.code === 200) {
                        wx.setStorageSync("aliUploadToken", __assign({}, res.data.rs, { expireTime: new Date().getTime() }));
                        resolve(res.data.rs);
                    }
                    else {
                        reject(res);
                    }
                },
                fail: function fail(err) {
                    reject(err);
                }
            });
        }
    });
}
exports.getAliToken = getAliToken;
