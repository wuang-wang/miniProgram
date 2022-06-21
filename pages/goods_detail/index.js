import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false,
  },

  GoodsInfo:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获取当前页面栈
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    // 获取缓存中商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect,
    })
  },

  // 点击轮播图，放大预览
  handlePrevewImage(e){
    const current = e.currentTarget.dataset.url;
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    wx.previewImage({
      current,
      urls,
    });
  },

  // 点开加入购物车
  handleCartAdd(){
    // 获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    // 判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index===-1) {
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      cart[index].num++;
    }
    // 把数据重新添加回缓存中
    wx.setStorageSync("cart",cart);
    // 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,
    });
  },

  // 点击商品收藏
  handleCollect(){
    let isCollect = false;
    let collect = wx.getStorageSync("collect")||[];
    // 判断商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index!==-1) {
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    wx.setStorageSync("collect",collect);
    this.setData({
      isCollect
    })
  }
})