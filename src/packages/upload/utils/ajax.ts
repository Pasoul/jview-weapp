export function getAliToken(url: string) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: {tokenType: "Ali"},
      method: 'POST',
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}