// dataDetails.js
var ajaxUrl = require('../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDetail:"",
    webId:0,
    collectId:0,
    dataCollectDetail:""
  },
  
  /**
   * 生命周期函数--监听页面加载,用于接收上个页面传递参数
   */
  onLoad: function (options) {
    //详细舆情信息id
    var webId = options.webId;
    var collectId = options.collectId;
    //console.log("webId:" + webId);
    //console.log("collectId:" + collectId);
    var my_data = "";
    var that = this;
    if (webId != null){
      //ajax请求舆论详细信息
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'webpage/viewDetail',
        data: {
          "webId": webId,
        },
        // dataType:'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': getApp().globalData.cookie
        },
        success: function (res) {
          console.log(res);
          if (res.data.ret == true) {
            my_data = res.data.data.result;
          }

          that.setData({
            webId: webId,
            dataDetail: my_data
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
    if (collectId != null){
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'collect/viewDetail',
        data: {
          "collectId": collectId,
        },
        // dataType:'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': getApp().globalData.cookie
        },
        success: function (res) {
          console.log(res);
          if (res.data.ret == true) {
            my_data = res.data.data.result;
          }

          that.setData({
            collectId: collectId,
            dataCollectDetail: my_data
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
   




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