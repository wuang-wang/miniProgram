Page({
  handleGetUserInfo(e){
    // 获取用户信息
    const {userInfo} = e.detail;
    // 将用户信息存入缓存中
    wx.setStorageSync("userInfo", userInfo);
    // 跳转回原页面
    wx.navigateBack({
      delta: 1
    });
  }
})