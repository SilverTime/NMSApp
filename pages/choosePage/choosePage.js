var ajaxUrl = require('../../utils/url.js');
var app = getApp();
var loginBindWeixin = function (bindWeixinId) {
  //直接登录
  wx.request({
    method: 'POST',
    url: ajaxUrl.ajaxUrl() + 'user/loginBindWeixin',
    data: {
      "bindWeixinId": bindWeixinId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //console.log(res)
      //已经绑定成功
      if (res.data.data.result.result == "success") {
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
      //还未绑定
      else if (res.data.data.result.result == "null") {
        wx.navigateTo({
          url: '../bindWeixin/bindWeixin',
        })
      }
    },
    fail: function (res) {
      //console.log(res);
    }
  })
}
Page({
  data: {
  },
  onShow: function (options) {
    var bindWeixinId;
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.userInfo = res.userInfo;
        bindWeixinId = res.userInfo.avatarUrl;
        loginBindWeixin(bindWeixinId);
      }
    })


  },
})