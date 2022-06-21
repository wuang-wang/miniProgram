import {request} from '../../request/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList:[],
    // 分类导航数据
    catesList:[],
    // 商品分类数据
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList(){
    request({ url: "/home/swiperdata" })
    .then(result => {
      this.setData({
        swiperList:result
      })
    })
  },
  // 获取分类导航数据
  getCatesList(){
    request({ url: "/home/catitems" })
    .then(result => {
      this.setData({
        catesList:result
      })
    })
  },
  // 获取商品分类数据
  getFloorList(){
    request({ url: "/home/floordata" })
    .then(result => {
      this.setData({
        floorList:result
      })
    })
  }
})