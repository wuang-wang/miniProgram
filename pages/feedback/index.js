// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isActive: true,
      },{
        id: 1,
        name: "商品、商家投诉",
        isActive: false,
      }
    ],
    chooseImgs:[],
    textVal:""
  },

  // 外网的图片的路径数组
  UpLoadImgs:[],

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

  // 选择图片上传
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs:[...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    });
  },

  // 删除图片
  handleRemoveImg(e){
    // 获取被点击组件的索引
    const {index} = e.currentTarget.dataset;
    console.log(index);
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },

  // 文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal: e.detail.value,
    })
  },

  // 提交按钮事件
  handleFormSubmit(){
    // 获取输入框内容
    const { textVal,chooseImgs } = this.data;
    // 合法性验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }

    wx.showLoading({
      title: "上传中",
      mask: true,
    });

    if (chooseImgs.length != 0) {
      // 遍历图片数组
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片上传地址
          url: 'https://imgchr.com/',
          // 被上传图片路径
          filePath: v,
          // 上传图片的名称
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (result)=>{
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
  
            // 判断图片是否全部上传
            if (i===chooseImgs.length-1) {
              wx.hideLoading();
              console.log("上传成功");
              this.setData({
                textVal:"",
                chooseImgs:[]
              })
              wx.wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    }else{
      wx.hideLoading();
      console.log("只提交文本，未上传图片");
      wx.navigateBack({
        delta: 1
      })
    }
  }
})