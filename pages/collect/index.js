// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs: [
      {
        id: 0,
        name: "商品收藏",
        isActive: true,
      },{
        id: 1,
        name: "品牌收藏",
        isActive: false,
      },{
        id: 2,
        name: "店铺收藏",
        isActive: false,
      },{
        id: 3,
        name: "浏览足迹",
        isActive: false,
      }
    ]
  },

  onShow(){
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      collect
    })
  },

  // 根据标题索引来激活选中标题数组
  changeTitleByIndex(index){
    // 修改原属组
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    // 重新复制data
    this.setData({
      tabs
    })
  },

  // tab切换
  handleTabsItemChange(e){
    // 获取点击标题索引
    const {index} = e.detail;
    this.changeTitleByIndex(index)
  },
})