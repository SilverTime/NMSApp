var util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts.js');
var ajaxUrl = require('../../utils/url.js')
var app = getApp();
var eChart = null;

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
var now1 = new Date();
var date1 = new Date(now1.getTime() - 6 * 30 * 24 * 3600 * 1000);
var year1 = date1.getFullYear();
var month1 = date1.getMonth() + 1;
var day1 = date1.getDate();
var hour1 = date1.getHours();
var minute1 = date1.getMinutes();
var second1 = date1.getSeconds();
var sixMonth = year1 + '-' + month1 + '-' + day1;

var startTime = "";
var endTime = "";
var allDate;

var ptDistribution = function (that) {
  var time = {};
  var count = {};
  var name = {};
  var mmp = [];
  var name1 = [];
  allDate = getAllDate(startTime, endTime);
  wx.request({
    method: 'POST',
    url: ajaxUrl.ajaxUrl() + 'statistic/ptDistribution',
    data: {
      "startTime": sixMonth,
      "endTime": currentTime,
    },
    // dataType:'json',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': getApp().globalData.cookie
    },
    success: function (res) {
      //console.log(res);
    },
    fail: function (res) {
      console.log(res);
    }
  })
  
}
var queryThreeMonths = function (that) {
  wx.request({
    method: 'POST',
    url: ajaxUrl.ajaxUrl() + 'statistic/outline',
    data: {
      "startTime": sixMonth,
      "endTime": currentTime,
    },
    // dataType:'json',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': getApp().globalData.cookie
    },
    success: function (res) {
      //console.log(res);

      that.setData({
        outline: res.data.data.outline,
        sentimentNum: res.data.data.outline[0],
        topicNum: res.data.data.outline[1],
        NEsentimentNum: res.data.data.outline[2],
        webNum: res.data.data.outline[3],
      })
    },
    fail: function (res) {
      console.log(res);
    }
  })
}

var getAllDate = function (startTime, endTime) {
  var maxTime;
  var minTime;
  var maxTimeByDay;
  var minTimeByDay;
  var allDate = [];

  maxTime = endTime;
  minTime = startTime;
  maxTimeByDay = maxTime.split(" ")[0];
  minTimeByDay = minTime.split(" ")[0];
  // alert(maxTimeByDay);

  var endTime = getDate(maxTimeByDay);
  var startTime = getDate(minTimeByDay);
  //	 alert()
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear();

    var month = startTime.getMonth().toString().length == 1 ? "0" + startTime.getMonth().toString() : startTime.getMonth();
    var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
    //	   alert(year+"-"+month+"-"+day);
    startTime.setDate(startTime.getDate() + 1);
    if (month == "00") {
      month = "12";
      year = year - 1;
    }
    allDate.push(year + "-" + month + "-" + day);
  }

  return allDate;
}

var getDate = function(datestr) {
  var temp = datestr.split("-");
  var date = new Date(temp[0], temp[1], temp[2]);
  return date;
}
Page({
  data: {
    array: ['舆情时段', '主题分布', '情感分布', '网站分布'],
    dateValueB:'开始时间',
    dateValueE:'结束时间',
    info: [],
    index: 0,
    abstractcId:0,
    outline:[],
    searchKeyword: '', //需要搜索的字符 
    searchSongList: [], //放置返回数据的数组 
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 1, // 设置加载的第几次，默认是第一次 
    callbackcount: 15,  //返回数据的个数 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false //“没有数据”的变量，默认false，隐藏 

  },


  
    drawPie:function(){
      var windowWidth = 320;
      try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
      } catch (e) {
        console.error('getSystemInfoSync failed!');
      }

      eChart = new wxCharts({
        animation: true,
        canvasId: 'Canvas',
        type: 'pie',
        series: [{
          name: '成交量1',
          data: 15,
        }, {
          name: '成交量2',
          data: 35,
        }, {
          name: '成交量3',
          data: 78,
        }, {
          name: '成交量4',
          data: 63,
        }, {
          name: '成交量2',
          data: 35,
        }, {
          name: '成交量3',
          data: 78,
        }, {
          name: '成交wer量4',
          data: 63,
        }, {
          name: '成交量2',
          data: 35,
        }, {
          name: '成交量3',
          data: 78,
        }, {
          name: '成交量erwe3',
          data: 78,
        }],
        width: windowWidth,
        height: 300,
        dataLabel: true,
      });
    },

    createSimulationData: function () {//产生横坐标数据
      var categories = [];
      var data = [];
      for (var i = 0; i < 10; i++) {
        categories.push('2016-' + (i + 1));
        data.push(Math.random() * (20 - 10) + 10);
      }
      // data[4] = null;
      return {
        categories: categories,
        data: data
      }
    },
    updateData: function () {//更新图表
      var simulationData = this.createSimulationData();
      var series = [{
        name: '成交量1',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }];
      eChart.updateData({
        categories: simulationData.categories,
        series: series
      });
    },
    drawLine1:function(){
      var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        
        var simulationData = this.createSimulationData();
        eChart = new wxCharts({
            canvasId: 'Canvas',
            type: 'line',
            categories: simulationData.categories,
            animation: true,
            background: '#f5f5f5',
            series: [{
                name: '成交量1',
                data: simulationData.data,
                format: function (val, name) {
                    return val.toFixed(2) + '万';
                }
            }, {
                name: '成交量2',
                data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                format: function (val, name) {
                    return val.toFixed(2) + '万';
                }
            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                title: '成交金额 (万元)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  datePickerBindchangeB: function (e) {
    this.setData({
      dateValueB: e.detail.value
    })
  },
  datePickerBindchangeE: function (e) {
    this.setData({
      dateValueE: e.detail.value
    })
  },

  //输入框事件，每输入一个字符，就会触发一次 
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //搜索，访问网络 
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数 
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数 
      callbackcount = that.data.callbackcount; //返回数据的个数 
    //访问网络 
    util.getSearchMusic(searchKeyword, searchPageNum, callbackcount, function (data) {
      console.log(data)
      //判断是否有数据，有则取数据 
      if (data.data.song.curnum != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
        that.data.isFromSearch ? searchList = data.data.song.list : searchList = that.data.searchSongList.concat(data.data.song.list)
        that.setData({
          searchSongList: searchList, //获取数据数组 
          zhida: data.data.zhida, //存放歌手属性的对象 
          searchLoading: true //把"上拉加载"的变量设为false，显示 
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏 
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示 
          searchLoading: false //把"上拉加载"的变量设为false，隐藏 
        });
      }
    })
  },
  //点击搜索按钮，触发事件 
  keywordSearch: function (e) {
    var index= this.data.index;
    if (index==0){
     this.drawPie();
   }else{
      this.drawLine1();
   }
    this.setData({
      searchPageNum: 1, //第一次加载，设置1 
      searchSongList: [], //放置返回数据的数组,设为空 
      isFromSearch: true, //第一次加载，设置true 
      searchLoading: true, //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    })
    this.fetchSearchList();

    
  },
  //滚动到底部触发事件 
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1 
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false 
      });
      that.fetchSearchList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var abstractcId = options.abstractcId;
    console.log(abstractcId)
    this.setData({
      abstractcId: abstractcId,
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
    queryThreeMonths(this);
    ptDistribution(this);
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