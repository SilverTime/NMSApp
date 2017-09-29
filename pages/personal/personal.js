var app = getApp();
var ajaxUrl = require('../../utils/url.js');
Page({
  data: {
    userInfo: {},
    motto: 'Hello World',
    orderItems: [],
    showModalStatus: false,
    inputpassword: "",
  },
  //主题
  subject: function () {
      wx.navigateTo({
        url: '../subjectList/subjectList',
      })
  },
  //网站
  website: function () {
    wx.navigateTo({
      url: '../webManage/webManage',
    })
  },
  //周报
  weekly: function () {
    wx.navigateTo({
      url: '../weekly/weekly',
    })
  },
  //解绑
  unBind: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要解除当前系统账号与微信账号绑定？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            showModalStatus: true
          })
        }
      }
    })
  },
  onLoad: function () {
    //console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  //密码输入框事件，每输入一个字符，就会触发一次 
  passwordInput: function (e) {
    this.setData({
      inputpassword: e.detail.value
    })
  },
  sure: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.change(currentStatu);
    let my_password = ajaxUrl.hex_md5(this.data.inputpassword);
    //ajax请求解绑
    wx.request({
      method: 'POST',
      url: ajaxUrl.ajaxUrl() + 'user/unBindWeixin',
      data: {
        "password": my_password,
        "bindWeixinId": getApp().globalData.userInfo.avatarUrl,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.result.result == "success") {
          wx.showToast({
            title: "解绑成功",
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function () { wx.navigateTo({ url: '../choosePage/choosePage', }) }, 1000);
          
        }
        else if (res.data.data.result.result == "passwordError") {
          wx.showModal({
            title: '提示',
            content: '密码错误',
            showCancel: false,
            success: function (res) {

            }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: '无法解绑',
            showCancel: false,
            success: function (res) {

            }
          })
        }
      },
      fail: function (res) {
        //console.log(res);
      }
    })

  },
  cancel: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.change(currentStatu);
  },
  change: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })
      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})