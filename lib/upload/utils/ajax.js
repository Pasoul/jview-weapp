"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAliToken(url) {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: { tokenType: "Ali" },
            method: 'POST',
            success: function (res) {
                resolve(res);
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}
exports.getAliToken = getAliToken;
