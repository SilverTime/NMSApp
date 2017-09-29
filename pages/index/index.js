//index.js
var ajaxUrl = require('../../utils/url.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      'avatarUrl':'../../images/logo.png',
      'username': '../../images/username.png',
      'password': '../../images/password.png',
    },
    message: "",
    inputusername: "",
    inputpassword: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // //ajax请求登录
    // wx.request({
    //   method: 'GET',
    //   url: 'data:image/gif;base64,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',
    //   data: "",
    //   // dataType:'json',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
  },
  //点击登录按钮，触发事件 
  login: function (e) {
    // console.log(this.data.inputusername);
    // console.log(this.data.inputpassword);
    if (this.data.inputusername.length<=0){
      this.setData({
        message: "温馨提示： 用户名不能为空!"
      })
      return false;
    }
    if (this.data.inputpassword.length <= 0) {
      this.setData({
        message: "温馨提示： 密码不能为空!"
      })
      return false;
    }
    // this.setData({
    //   message: ""
    // })
    let my_password = ajaxUrl.hex_md5(this.data.inputpassword);
    //console.log(my_password);
    var my_data={
      "userName": this.data.inputusername,
      "password": my_password,
    };
    //ajax请求登录
    wx.request({
      method:'POST',
      url: ajaxUrl.ajaxUrl() + 'user/loginWeixin',
      data: my_data,
      // dataType:'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
         //console.log(res)
        if (res.data.data.result.result == "success"){
          var cookHeader = res.header["Set-Cookie"];
          var Cookie = cookHeader.slice(0, cookHeader.indexOf(";"));
          // console.log(cookHeader);
          // console.log(Cookie);
          getApp().globalData.cookie = Cookie;
          getApp().globalData.userId = res.data.data.result.user.userId;
          getApp().globalData.userTrueName = res.data.data.result.user.userTrueName;
          wx.switchTab({
            url: '../dataList/dataList',
          })
        }
         else if (res.data.data.result.result == "passwordError"){
          wx.showModal({
            title: '提示',
            content: '密码错误',
            showCancel:false,
            success: function (res) {
              
            }
          })
        }
        else{
          wx.showModal({
            title: '提示',
            content: '账号不存在',
            showCancel: false,
            success: function (res) {

            }
          })
        }
      },
      fail:function(res){
        //console.log(res);
      }
    })
  },
  //用户名输入框事件，每输入一个字符，就会触发一次 
  usernameInput: function (e) {
    this.setData({
      inputusername: e.detail.value
    })
  },
  //密码输入框事件，每输入一个字符，就会触发一次 
  passwordInput: function (e) {
    this.setData({
      inputpassword: e.detail.value
    })
  },
})