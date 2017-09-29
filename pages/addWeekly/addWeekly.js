// addWebsite.js
var ajaxUrl = require('../../utils/url.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    abstractcEndtime: '终稿时间',
    abstractcPubtime:"",
    abstractcName:"",
    abstractcState: 0,
  },
  datePickerBindchangeB: function (e) {
    this.setData({
      abstractcEndtime: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //产生时间
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var currentTime = "";
    currentTime = year + '-' + month + '-' + day;
    that.setData({
      abstractcPubtime: currentTime
    });
  },
  sameWebsite: function (e) {
    var abstractcEndtime = this.data.abstractcEndtime;
    var abstractcPubtime = this.data.abstractcPubtime;
    var abstractcName = this.data.abstractcName;
    var abstractcState = this.data.abstractcState;
    if (abstractcEndtime == "终稿时间" || abstractcName==""){
      wx.showToast({
        title: "文摘名称和终稿时间不能为空！",
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
    else{
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'abstractCategory/createAbstract',
        data: {
          "abstractcUserId": getApp().globalData.userId,
          "abstractcName": abstractcName,
          "abstractcState": abstractcState,
          "abstractcPubtime": abstractcPubtime,
          "abstractcEndtime": abstractcEndtime,
        },
        // dataType:'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': getApp().globalData.cookie
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: "添加成功",
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function () { wx.navigateBack() }, 1000);
        },
        fail: function (res) {
          console.log(res);
          wx.showToast({
            title: "添加失败",
            icon: 'loading',
            duration: 1000,
            mask: true
          })
        }
      })
    }
  },
  inputSiteName: function (e) {
    this.setData({
      abstractcName: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})