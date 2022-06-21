import {getSetting,chooseAddress,openSetting,showModal,showToast} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  }, 

  onShow (){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart")||[];

    this.setData({
      address,
    });
    this.setCart(cart);
  },

  // 点开收货地址按钮
  async handleChooseAddress(){
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 调用获取收货地址api
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 存入缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },

  // 商品选中
  handleItemChange(e){
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中取反
    cart[index].checked = !cart[index].checked;
    // 购物车中的数据重新设置回data和缓存中
    this.setCart(cart);
  },

  // 设置购物车状态的同时，重新计算 底部工具栏的数据
  setCart(cart){
    let allChecked = true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    });
    // 判断数组是否为空，若为空，则复选框不选中
    allChecked = cart.length!=0 ? allChecked : false;

    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart",cart);
  },

  // 商品全选功能
  handleItemAllCheck(){
    // 获取data中的全选变量allChecked
    let {cart,allChecked} = this.data;
    allChecked = !allChecked;
    // 遍历购物车数组，让里面商品选中状态跟随allChecked改变而改变
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },

  // 商品数量的加减
  async handleItemNumEdit(e){
    // 获取传递过来的参数
    const { operation,id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num ===1 && operation === -1){
      const res = await showModal({ content:"确定删除商品？"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      // 进行数量的修改
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  // 商品结算
  async handlePay(){
    const { address,totalNum } = this.data;
    // 判断收货地址
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"})
      return;
    };
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"})
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})