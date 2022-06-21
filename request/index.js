let ajaxTime=0;

export const request=(params)=>{
    // 判断url中是否带有 /my/请求的私有路径
    let header = {...params.header};
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }

    ajaxTime++;
    wx.showLoading({
        title: '加载中',
        mask: true,
    });

    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success:(result)=>{
                resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTime--;
                if (ajaxTime===0) {
                    // 关闭加载中图标
                    wx.hideLoading();
                }
            }
        })
    })
}