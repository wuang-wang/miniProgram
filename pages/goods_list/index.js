import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"综合",
        isActive:true,
      },{
        id:1,
        name:"销量",
        isActive:false,
      },{
        id:2,
        name:"价格",
        isActive:false,
      }
    ],
    goodsList:[]
  },

  // 接口参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:7
  },

  totalPage:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total=res.total;
    this.totalPage = Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e){
    // 获取点击标题索引
    const {index} = e.detail;
    // 修改原属组
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    // 重新复制data
    this.setData({
      tabs
    })
  },

  // 上拉加载事件
  onReachBottom(){
    if (this.QueryParams.pagenum >= this.totalPage) {
      wx.showToast({title: '无更多数据',});
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goodsList:[],
    })
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  }
})
