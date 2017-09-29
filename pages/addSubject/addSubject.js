// addSubject.js
var ajaxUrl = require('../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDetail: "",
    topicId: 0,
    topicName:"",
    inWords: "",
    exWords: "",
  },
  inputTopicName: function (e) {
    this.setData({
      topicName: e.detail.value
    })
  },
  inputInWords: function (e) {
     this.setData({
       inWords: e.detail.value
     })
   },
  inputExWords: function (e) {
     this.setData({
       exWords: e.detail.value
     })
   },
  sameSubject: function (e) {
    //console.log(this.data.topicId);
    var topicId = this.data.topicId;
    var topicName = this.data.topicName;
    var inWords = this.data.inWords;
    var exWords = this.data.exWords;
    if (topicId !=0){
      //修改
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'topic/editTopic',
        data: {
          "topicId": topicId,
          "topicName": topicName,
          "inWords": inWords,
          "exWords": exWords,
        },
        // dataType:'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': getApp().globalData.cookie
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: "修改成功",
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function(){wx.navigateBack()}, 1000);
        },
        fail: function (res) {
          console.log(res);
          wx.showToast({
            title: "修改失败",
            icon: 'loading',
            duration: 1000,
            mask: true
          })
        }
      })

    }else{
      //增加
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'topic/addTopic',
        data: {
          "topicId": topicId,
          "topicName": topicName,
          "inWords": inWords,
          "exWords": exWords,
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
          setTimeout(function () {wx.navigateBack()}, 1000);
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var topicId = options.topicId;
    var that = this;
    if(topicId != undefined){
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'topic/viewTopic',
        data: {
          "topicId": topicId,
        },
        // dataType:'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': getApp().globalData.cookie
        },
        success: function (res) {
          //console.log(res.data.data.result);
          if(res.data.data.ret=true){
            that.setData({
              dataDetail: res.data.data.result,
              topicId: topicId,
              topicName: res.data.data.result.topicName,
              inWords: res.data.data.result.inWords,
              exWords: res.data.data.result.exWords,
            })
          }
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