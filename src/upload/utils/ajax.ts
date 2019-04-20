export interface iWxResponse {
  data: { code: number, msg: string | null, rs: object, suc: boolean, timestamp: number};
  errMsg: string;
  cookies: Array<string>;
  header: object;
  statusCode: number
}

export function getAliToken(url) {
  return new Promise(function (resolve, reject) {
    const aliUploadToken = wx.getStorageSync("aliUploadToken") || "";
    const now = new Date().getTime();
      // 当前时间 - token存储的时间 > 50 min,则不取缓存
    if (aliUploadToken && aliUploadToken.expireTime && (now - aliUploadToken.expireTime) < 50 * 60 * 1000 ) {
      resolve(aliUploadToken)
    } else {
      wx.request({
        url: url,
        data: {
          tokenType: "Ali"
        },
        method: 'POST',
        success: function success(res: iWxResponse) {
          if (res.statusCode === 200 && res.data.code === 200) {
            wx.setStorageSync("aliUploadToken", {
              ...res.data.rs,
              expireTime: new Date().getTime()
            })
            resolve(res.data.rs);
          } else {
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