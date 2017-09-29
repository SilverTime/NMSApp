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
      "bindWeixinId": getApp().globalData.userInfo.avatarUrl,
    };
    //ajax请求绑定账号
    wx.request({
      method:'POST',
      url: ajaxUrl.ajaxUrl() + 'user/bindWeixin',
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
          wx.showToast({
            title: "绑定成功",
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function () { wx.switchTab({ url: '../dataList/dataList', }) }, 1000);
        }
         else if (res.data.data.result.result == "passwordError"){
          wx.showModal({
            title: '提示',
            content: '密码错误',
            showCancel: false,
            success: function (res) {
              
            }
          })
        }
        else if (res.data.data.result.result == "userExist") {
          wx.showModal({
            title: '提示',
            content: '该账号已经被绑定',
            showCancel: false,
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