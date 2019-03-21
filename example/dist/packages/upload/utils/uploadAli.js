import { Base64 } from './base64';
import { Crypto } from './crypto';
import { getAliToken } from "./ajax";
import { STATUS_UPLOADING } from './constant';
import "./hmac.js";
import "./sha1.js"; // import { TempFileImage } from '../index'
// interface uploadFile {
//   tempFile: TempFileImage
//   aliyunTokenURL: string
//   aliyunServerURL: string
//   callback(uploadTask:Weapp.UploadTask):void
// }

export function uploadFile(_ref) {
  var tempFile = _ref.tempFile,
      aliyunTokenURL = _ref.aliyunTokenURL,
      aliyunServerURL = _ref.aliyunServerURL,
      callback = _ref.callback;

  if (!tempFile || !tempFile.uploadPath) {
    wx.showModal({
      title: "图片错误",
      content: "请重试",
      showCancel: false
    });
    return;
  }

  tempFile.status = STATUS_UPLOADING;
  return new Promise(function (resolve, reject) {
    getAliToken(aliyunTokenURL).then(function (res) {
      uploadHandle(tempFile, res.data.rs, aliyunServerURL, callback, resolve, reject);
    }).catch(function (err) {
      reject(err);
    });
  });
}

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
    success: function success(res) {
      if (res.statusCode === 200) {
        resolve(aliyunFileKey);
      } else {
        reject({
          tempFile: tempFile
        });
      }
    },
    fail: function fail(err) {
      reject({
        tempFile: tempFile
      });
    }
  });
  tempFile.task = uploadTask;
  callback && callback(uploadTask);
}

var getPolicyBase64 = function getPolicyBase64(timeout) {
  var date = new Date();
  date.setHours(date.getHours() + timeout);
  var srcT = date.toISOString();
  var policyText = {
    expiration: srcT,
    //  设置该Policy的失效时间
    conditions: [["content-length-range", 0, 1000 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };
  var policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
};

var getSignature = function getSignature(policyBase64, accesskey) {
  var bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  var signature = Crypto.util.bytesToBase64(bytes);
  return signature;
};

export default {
  uploadFile: uploadFile
};