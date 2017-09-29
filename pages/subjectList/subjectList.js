// subjectList.js
var util = require('../../utils/util.js')
var ajaxUrl = require('../../utils/url.js')
var pageArray = new Array();
var currentPage = 0;//默认显示第一页的数据
var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  that.setData({ list: list })
}

var viewAllTopicInfor = function (that) {
  for (var i = 1; i <= 3; i++) {
    pageArray.push(i);//未指定页数，则只读取前三页数据
  }
  wx.request({
    method: 'POST',
    url: ajaxUrl.ajaxUrl() + 'topic/viewAllTopicInfor',
    data: {
      "pageArray": pageArray,
      "recordPerPage": 20,
      "searchWord": "",
    },
    // dataType:'json',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': getApp().globalData.cookie
    },
    success: function (res) {
      //console.log(res);
      if (res.data.ret == true) {
        var my_data = res.data.data.pageData;
        if (getApp().globalData.subjectFirst != 0) {//不是第一次请求，会产生重复数据，需要去重
          var len = parseInt(getApp().globalData.subjectFirst) + 1;
          var start = my_data.length / len
          my_data = my_data.slice(0, start);
        }

        that.setData({
          info: my_data,
          list: my_data[currentPage].data,
          currentPage: currentPage
        })
        getApp().globalData.subjectFirst = getApp().globalData.subjectFirst + 1;
      }
    },
    fail: function (res) {
      console.log(res);
    }
  })

}
Page({
  data: {
    delBtnWidth: 200,//删除按钮宽度单位（rpx）  
    info: [],
    index: 0,
    list:[],
    currentPage:0,
    searchKeyword: '', //需要搜索的字符 
    searchSongList: [], //放置返回数据的数组 
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 1, // 设置加载的第几次，默认是第一次 
    callbackcount: 15,  //返回数据的个数 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    scrollTop: {
      scroll_top: 0,
      goTop_show: true
    }
  },
  scrollTopFun: function (e) {
    //console.log(e.detail);
    this.setData({
      'scrollTop.goTop_show': true
    });
    //console.log(this.data.scrollTop)
  },
  goTopFun: function (e) {
    var _top = this.data.scrollTop.scroll_top;//发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
    //console.log(this.data.scrollTop)
  },
  lastPage: function (e) {
    if (currentPage == 0) {
      wx.showToast({
        title: "当前为第一页",
        icon: 'success',
        duration: 1000,
        mask: true
      })

    } else {
      currentPage--;
      var my_data = this.data.info;
      this.setData({
        currentPage: currentPage,
        list: my_data[currentPage].data
      })
    }


  },
  nextPage: function (e) {
    var my_data = this.data.info;
    if (currentPage == my_data.length - 1) {
      wx.showToast({
        title: "当前为最后一页",
        icon: 'success',
        duration: 1000,
        mask: true
      })
    } else {
      currentPage++;
      var my_data = this.data.info;
      this.setData({
        currentPage: currentPage,
        list: my_data[currentPage].data
      })
    }

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
  //点击list表事件
  detailData: function (e) {
    //获取手指触摸的是哪一项  
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    var flag = false;
    //console.log(e.target.dataset.topicid)//当前点击的topicId
    for (var i = 0; i < list.length; i++) {
      //当前属于选中状态
      if (list[i].txtStyle == "left:-200px") {
        flag = true;
      }
    }
    if (!flag) {
      wx.navigateTo({
        url: '../addSubject/addSubject?topicId=' + e.target.dataset.topicid,
      })
    }
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
      //console.log(e.touches[0].clientX);
    }
  },
  touchM: function (e) {
    var that = this;
    initdata(that);
    //console.log(that.data.list);
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        //console.log(disX);
        if (disX >= this.data.delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          var length = this.data.delBtnWidth / 2;
          txtStyle = "left:-" + length + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var length = this.data.delBtnWidth / 2;
      var txtStyle = disX > this.data.delBtnWidth / 4 ? "left:-" + length + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });

    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    var editBtnWidth = this.getEleWidth(this.data.editBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth,
      editBtnWidth: editBtnWidth,
    });
  },
  //点击删除按钮事件  
  delItem: function (e) {
    var that = this
    var topicId = e.target.dataset.id;
    if (topicId!=undefined){
      wx.showModal({
        title: '提示',
        content: '是否删除主题？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              method: 'POST',
              url: ajaxUrl.ajaxUrl() + 'topic/delTopic',
              data: {
                "topicId": topicId,
              },
              // dataType:'json',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': getApp().globalData.cookie
              },
              success: function (res) {
                console.log(res);
                if (res.data.data) {
                  wx.showToast({
                    title: "删除主题成功",
                    icon: 'succes',
                    duration: 1000,
                    mask: true
                  })
                  //获取列表中要删除项的下标  
                  var index = e.currentTarget.dataset.index;
                  var list = that.data.list;
                  //移除列表中下标为index的项  
                  list.splice(index, 1);
                  //更新列表的状态  
                  that.setData({
                    list: list
                  });
                }
                else {
                  wx.showToast({
                    title: "删除主题失败",
                    icon: 'loading',
                    duration: 1000,
                    mask: true
                  })
                }
              },
              fail: function (res) {
                console.log(res);
              }
            })

          } else {
            initdata(that)
          }
        }
      })
    }


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
    // util.getSearchMusic(searchKeyword, searchPageNum, callbackcount, function (data) {
    //   console.log(data)
    //   //判断是否有数据，有则取数据 
    //   if (data.data.song.curnum != 0) {
    //     let searchList = [];
    //     //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
    //     that.data.isFromSearch ? searchList = data.data.song.list : searchList = that.data.searchSongList.concat(data.data.song.list)
    //     that.setData({
    //       searchSongList: searchList, //获取数据数组 
    //       zhida: data.data.zhida, //存放歌手属性的对象 
    //       searchLoading: true //把"上拉加载"的变量设为false，显示 
    //     });
    //     //没有数据了，把“没有数据”显示，把“上拉加载”隐藏 
    //   } else {
    //     that.setData({
    //       searchLoadingComplete: true, //把“没有数据”设为true，显示 
    //       searchLoading: false //把"上拉加载"的变量设为false，隐藏 
    //     });
    //   }
    // });
  },
  //点击搜索按钮，触发事件 
  keywordSearch: function (e) {
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
  addSubject:function(){
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    viewAllTopicInfor(this);
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