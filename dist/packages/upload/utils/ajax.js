export function getAliToken(url) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: {
        tokenType: "Ali"
      },
      method: 'POST',
      success: function success(res) {
        resolve(res);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}