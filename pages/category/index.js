import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    // 激活选中左侧菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },

  // 接口返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用缓存技术
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.getCates();
    }else{
      // 设置缓存过期时间
      if (Date.now()-Cates.time>1000*10) {
        // 超过过期时间，重新发送请求
        this.getCates();
      }else{
        this.Cates = Cates.data; 
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })  
      }
    }
  },

  // 获取分类数据
  async getCates() {
    const res=await request({url:"/categories"});
    this.Cates = res;
    // 把接口数据存入本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    // 构造左侧大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent,
    })
  },

  // 左侧菜单点击事件
  handleItemTap(e){
  const {index} = e.currentTarget.dataset;
  let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})