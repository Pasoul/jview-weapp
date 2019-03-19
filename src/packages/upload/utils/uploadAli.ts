import { Base64 } from './base64';
import { Crypto } from './crypto'
import { getAliToken } from "./ajax";
import { STATUS_UPLOADING, TYPE_IMAGE, TYPE_VIDEO } from './constant';
import "./hmac.js";
import "./sha1.js";
// import { TempFileImage } from '../index'

// interface uploadFile {
//   tempFile: TempFileImage
//   aliyunTokenURL: string
//   aliyunServerURL: string
//   callback(uploadTask:Weapp.UploadTask):void
// }

export function uploadFile({tempFile, aliyunTokenURL, aliyunServerURL, callback}) {
  if (!tempFile || !tempFile.uploadPath) {
    wx.showModal({
      title: "图片错误",
      content: "请重试",
      showCancel: false
    });
    return;
  }
  tempFile.status = STATUS_UPLOADING;
  return new Promise((resolve, reject) => {
      getAliToken(aliyunTokenURL)
      .then(res => {
        uploadHandle(tempFile, res.data.rs, aliyunServerURL, callback, resolve, reject);
      })
      .catch(err => {
        reject(err)
      });
  })
}

function uploadHandle(tempFile, res, aliyunServerURL, callback, resolve, reject) {
  const policyBase64 = getPolicyBase64(res.durationSeconds);
  const signature = getSignature(policyBase64, res.accessKeySecret);
  const aliyunFileKey = "jlboss" + tempFile.uploadPath.replace("wxfile://", "").replace("http://", "");
  const uploadTask = wx.uploadFile({
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
    success: function(res) {
      if(res.statusCode === 200) {
        resolve(aliyunFileKey);
      } else {
        reject({tempFile});
      }
    },
    fail: function(err) {
      reject({tempFile});
    }
  });
  tempFile.task = uploadTask;
  callback && callback(uploadTask)
}
const getPolicyBase64 = function(timeout) {
  const date = new Date();
  date.setHours(date.getHours() + timeout);
  const srcT = date.toISOString();
  const policyText = {
    expiration: srcT, //  设置该Policy的失效时间
    conditions: [
      ["content-length-range", 0, 1000 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
};

const getSignature = function(policyBase64, accesskey) {
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);

  return signature;
};
export default {
  uploadFile
};
