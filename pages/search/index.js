import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus: false,
    inputVal:""
  },

  // 输入框  触发事件
  handleInput(e){
    let timeOut;
    const {value} = e.detail;
    // 检测合法性
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(()=> {
      this.qsearch(value);
    }, 500);
  },

  // 发送请求获取搜索建议数据
  async qsearch(query){
    const goods = await request({url:'/goods/qsearch',data:{query}});
    this.setData({
      goods
    })
  },

  // 取消按钮事件
  handleCancel(){
    this.setData({
      inputVal:"",
      goods:[],
      isFocus:false
    })
  }
})