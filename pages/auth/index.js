import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from '../../utils/asyncWx.js'

Page({
  // 获取用户信息
  async handlegetUserInfo(e){
    try {
      // 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 获取小程序登陆后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 发送请求，获取用户的token
      const {token} = await request({url:"/user/wxlogin",data:loginParams,method:"post"});
      console.log(token);
      // 把token存入缓存中，同时跳转回上一页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})