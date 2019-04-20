"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_1 = require("./base64");
var crypto_1 = require("./crypto");
var ajax_1 = require("./ajax");
var constant_1 = require("./constant");
require("./hmac");
require("./sha1");
function uploadFile(_a) {
    var tempFile = _a.tempFile, aliyunTokenURL = _a.aliyunTokenURL, aliyunServerURL = _a.aliyunServerURL, callback = _a.callback;
    if (!tempFile || !tempFile.uploadPath) {
        wx.showModal({
            title: "图片错误",
            content: "请重试",
            showCancel: false
        });
        return;
    }
    tempFile.status = constant_1.STATUS_UPLOADING;
    return new Promise(function (resolve, reject) {
        ajax_1.getAliToken(aliyunTokenURL)
            .then(function (res) {
            uploadHandle(tempFile, res, aliyunServerURL, callback, resolve, reject);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.uploadFile = uploadFile;
function uploadHandle(tempFile, res, aliyunServerURL, callback, resolve, reject) {
    var policyBase64 = getPolicyBase64(res.durationSeconds);
    var signature = getSignature(policyBase64, res.accessKeySecret);
    var aliyunFileKey = "jlboss" + tempFile.uploadPath.replace("wxfile://", "").replace("http://", "");
    var uploadTask = wx.uploadFile({
        url: aliyunServerURL,
        filePath: tempFile.uploadPath,
        name: "file",
        header: {
            "content-type": "multipart/form-data"
        },
        formData: {
            key: aliyunFileKey,
            policy: policyBase64,
            OSSAccessKeyId: res.accessKeyId,
            signature: signature,
            "x-oss-security-token": res.accessToken,
            success_action_status: "200"
        },
        success: function (res) {
            if (res.statusCode === 200) {
                resolve(aliyunFileKey);
            }
            else {
                wx.removeStorageSync("aliUploadToken");
                reject({ tempFile: tempFile });
            }
        },
        fail: function (err) {
            wx.removeStorageSync("aliUploadToken");
            reject({ tempFile: tempFile });
        }
    });
    tempFile.task = uploadTask;
    callback && callback(uploadTask);
}
var getPolicyBase64 = function (timeout) {
    var date = new Date();
    date.setHours(date.getHours() + timeout);
    var srcT = date.toISOString();
    var policyText = {
        expiration: srcT,
        conditions: [
            ["content-length-range", 0, 1000 * 1024 * 1024] // 设置上传文件的大小限制,5mb
        ]
    };
    var policyBase64 = base64_1.Base64.encode(JSON.stringify(policyText));
    return policyBase64;
};
var getSignature = function (policyBase64, accesskey) {
    var bytes = crypto_1.Crypto.HMAC(crypto_1.Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    var signature = crypto_1.Crypto.util.bytesToBase64(bytes);
    return signature;
};
exports.default = {
    uploadFile: uploadFile
};
