// addWebsite.js
var ajaxUrl = require('../../utils/url.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeArr: ['新闻', '论坛', '微博', '微信'],
    typeIndex:0,
    index:0,
    codeArr: ['UTF-8', 'GBK','GB2312'],
    codeIndex:0,
    pickerArr:['UrlCrawler(1)'],
    pickerIndex:0,
    dataDetail: "",
    siteId: 0,
    siteName:"",
    siteURL: "",
    sitePublicTimeTarget: "",
    siteContentTarget: "",
    siteTitleTarget: "",
    siteListTarget: "",
    siteURLFilter: "",
    siteAuthorTarget:"",
    crawlEnable:1,
    code:"UTF-8",
    siteType:1,
    crawlerId:1,
    checkBox: [
      { name: '是否允许采集', value: '1', checked: 'true' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var my_data = "";
    var that = this;
    var siteId = options.siteId;
    if (siteId != null) {
      //ajax请求网站详细信息
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'site/forDetail',
        data: {
          "siteId": siteId,
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
            siteId: siteId,
            dataDetail: my_data,
            siteName: my_data.siteName,
            siteURL: my_data.siteURL,
            sitePublicTimeTarget: my_data.sitePublicTimeTarget,
            siteContentTarget: my_data.siteContentTarget,
            siteTitleTarget: my_data.siteTitleTarget,
            siteListTarget: my_data.siteListTarget,
            siteURLFilter: my_data.siteURLFilter,
            siteAuthorTarget: my_data.siteAuthorTarget,
            code: my_data.code,
            siteType: my_data.siteType,
            crawlerId: my_data.crawlerId,
            crawlEnable: my_data.crawlEnable,
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
  },
  checkboxChange: function (e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value.length == 0){
      this.setData({
        crawlEnable: 0
      })
    }
    else{
      this.setData({
        crawlEnable: 1
      })
    }

  },
  sameWebsite: function (e) {
    var siteId = this.data.siteId;
    var siteName = this.data.siteName;
    var siteURL = this.data.siteURL;
    var sitePublicTimeTarget = this.data.sitePublicTimeTarget;
    var siteContentTarget = this.data.siteContentTarget;
    var siteTitleTarget = this.data.siteTitleTarget;
    var siteListTarget = this.data.siteListTarget;
    var siteURLFilter = this.data.siteURLFilter;
    var siteAuthorTarget = this.data.siteAuthorTarget;
    var code = this.data.code;
    var siteType = this.data.siteType;
    var crawlerId = this.data.crawlerId;
    var crawlEnable = this.data.crawlEnable;
    if (siteName == "" || siteURL==""){
      wx.showToast({
        title: "网站名和网址不能为空！",
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
    else{
      if (siteId != 0) {
        //修改
        wx.request({
          method: 'POST',
          url: ajaxUrl.ajaxUrl() + 'site/updateSite',
          data: {
            "siteId": siteId,
            "siteName": siteName,
            "siteURL": siteURL,
            "sitePublicTimeTarget": sitePublicTimeTarget,
            "siteContentTarget": siteContentTarget,
            "siteTitleTarget": siteTitleTarget,
            "siteListTarget": siteListTarget,
            "siteURLFilter": siteURLFilter,
            "siteAuthorTarget": siteAuthorTarget,
            "code": code,
            "siteType": siteType,
            "crawlerId": crawlerId,
            "crawlEnable": crawlEnable,
          },
          // dataType:'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': getApp().globalData.cookie
          },
          success: function (res) {
            //console.log(res);
            wx.showToast({
              title: "修改成功",
              icon: 'success',
              duration: 1000,
              mask: true
            })
            setTimeout(function () { wx.navigateBack() }, 1000);
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

      }
      else {
        //增加
        wx.request({
          method: 'POST',
          url: ajaxUrl.ajaxUrl() + 'site/addSite',
          data: {
            "siteName": siteName,
            "siteURL": siteURL,
            "sitePublicTimeTarget": sitePublicTimeTarget,
            "siteContentTarget": siteContentTarget,
            "siteTitleTarget": siteTitleTarget,
            "siteListTarget": siteListTarget,
            "siteURLFilter": siteURLFilter,
            "siteAuthorTarget": siteAuthorTarget,
            "code": code,
            "siteType": siteType,
            "crawlerId": crawlerId,
            "crawlEnable": crawlEnable,
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
    }
  },
  inputSiteName: function (e) {
    this.setData({
      siteName: e.detail.value
    })
  },
  inputSiteURL: function (e) {
    this.setData({
      siteURL: e.detail.value
    })
  },
  inputSitePublicTimeTarget: function (e) {
    this.setData({
      sitePublicTimeTarget: e.detail.value
    })
  },
  inputSiteContentTarget: function (e) {
    this.setData({
      siteContentTarget: e.detail.value
    })
  },
  inputSiteTitleTarget: function (e) {
    this.setData({
      siteTitleTarget: e.detail.value
    })
  },
  inputSiteListTarget: function (e) {
    this.setData({
      siteListTarget: e.detail.value
    })
  },
  inputSiteURLFilter: function (e) {
    this.setData({
      siteURLFilter: e.detail.value
    })
  },
  inputSiteAuthorTarget: function (e) {
    this.setData({
      siteAuthorTarget: e.detail.value
    })
  },
  inputPickerCode: function (e) {
    this.setData({
      code: this.data.codeArr[e.detail.value]
    })
  }, 
  inputPickerCrawler: function(e) {
    this.setData({
      crawlerId: parseInt(e.detail.value) + 1
    })
  }, 
  inputPickerSiteType: function (e) {
    this.setData({
      siteType: parseInt(e.detail.value) + 1
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