import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  }, 

  onShow (){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart")||[];
    // 获取过滤后的数据
    cart = cart.filter(v=>v.checked)

    this.setData({
      address,
    });

    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    });

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  // 支付事件
  async handleOrderPay(){
    try {
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 设置请求头
      // const header = {Authorization:token};

      // 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = { order_price, consignee, goods };

      // 准备发送请求  创建订单  获取订单编号
      const {order_number} = await request({url:"/my/orders/create",method:"post",data:orderParams});

      // 发起预支付接口
      const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"post",data:{order_number}});

      // 发起微信支付
      const res = await requestPayment(pay);

      // 查询后台 订单状态
      const order = await request({url:"/my/orders/chkOrder",method:"post",data:{order_number}});
      await showToast({title: "支付成功"});

      // 删除缓存中已经支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.wx.setStorageSync("cart", newCart);
      
      // 跳转至订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      });
    } catch (error) {
      await showToast({title: "支付失败"})
      console.log(error);
    }
   }
})