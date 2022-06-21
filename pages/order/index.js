import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      {
        id: 0,
        name: "全部",
        isActive: true,
      },{
        id: 1,
        name: "待付款",
        isActive: false,
      },{
        id: 2,
        name: "待发货",
        isActive: false,
      },{
        id: 3,
        name: "退款/退货",
        isActive: false,
      }
    ]
  },

  onShow(options){
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }

    // 获取当前小程序的页面栈
    let pages =  getCurrentPages();
    // 数组中  索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    console.log(currentPage.options);
    // 获取url上的type参数
    const {type} = currentPage.options;
    this.changeTitleByIndex(type-1)
    this.getOrders(type);
  },

  // 获取订单列表
  async getOrders(type){
    const res = await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Data(v.create_time*1000).toLocalString())})),
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
    this.getOrders(index+1)
  },
})