var util = require('../../utils/util.js')
var ajaxUrl = require('../../utils/url.js')
var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  that.setData({ list: list })
}
var pageArray = new Array();
var currentPage = 0;//默认显示第一页的数据
//获取周报内容
var getAbstractCategory = function (that) {
  wx.request({
    method: 'POST',
    url: ajaxUrl.ajaxUrl() + 'webpage/getAbstractCategory',
    data: {
      "abstractcUserId": getApp().globalData.userId,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': getApp().globalData.cookie
    },
    success: function (res) {
      //console.log(res);
      if (res.data.ret == true) {
        var abstractList = res.data.data.result;
        var arrayAbstract=[];
        for (var i = 0; i < abstractList.length;i++){
          arrayAbstract[i] = abstractList[i].abstractcName;
        }

        that.setData({
          abstractList: abstractList,
          arrayAbstract: arrayAbstract,
        })
      }
    },
    fail: function (res) {
      console.log(res);
    }
  })
}

//获取所有检索内容
var viewAllWebPage = function (that) {
  for(var i=1;i<=3;i++){
    pageArray.push(i);//未指定页数，则只读取前三页数据
  }
  
  wx.request({
    method: 'POST',
    url: ajaxUrl.ajaxUrl() + 'webpage/viewAllWebPage',
    data: {
      "pageArray": pageArray,
      "recordPerPage": 20,
      "searchWord": "",
      "topicId": -1,
    },
    // dataType:'json',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': getApp().globalData.cookie
    },
    success: function (res) {
      //console.log(res);
      if (res.data.ret == true){
          var my_data = res.data.data.pageData;
          if (that.data.first != 0) {//不是第一次请求，会产生重复数据，需要去重
            var len = parseInt(that.data.first) + 1;
            var start = my_data.length / len
            my_data = my_data.slice(0, start);
          }

          //添加情感属性
          for (var k = 0; k < my_data.length;k++){
            for (var i = 0; i < my_data[k].data.length; i++) {
              if (my_data[k].data[i].webSensibilities < 0) {
                my_data[k].data[i].webSenMessage = '负面';
              }
              else if (my_data[k].data[i].webSensibilities > 0) {
                my_data[k].data[i].webSenMessage = '正面';
              }
              else {
                my_data[k].data[i].webSenMessage = '中性';
              }
            }
          }
          
          

        that.setData({
          info: my_data,
          currentPage: currentPage,
          list: my_data[currentPage].data,
          first: parseInt(that.data.first) + 1
        })
          
      }
    },
    fail: function (res) {
      console.log(res);
    }
  })
}





Page({
  data: {
    editBtnWidth: 210,//收藏按钮宽度单位（rpx） 
    delBtnWidth: 210,//取消按钮宽度单位（rpx）  
    addBtnWidth: 210,//加入周报按钮宽度单位（rpx）
    array: ['情感', '正面', '中性', '负面'],
    info: [],
    list: [],
    index: 0,
    first:0,
    currentPage: 0,
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
    },
    arrayAbstract: [],
    abstractList:[],
    arrayAbstractNum: 0,
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
  //加入周报
  addWeekly: function (e) {
    //改变index值，通过setData()方法重绘界面
    //console.log(e)
    if (e.detail.value != undefined){
      this.setData({
        arrayAbstractNum: e.detail.value
      });
      var objAbstract = this.data.abstractList[e.detail.value];
      var abstractcId = this.data.abstractList[e.detail.value].abstractcId;
      var webId = e.target.dataset.abwebid;
      wx.request({
        method: 'POST',
        url: ajaxUrl.ajaxUrl() + 'webpage/insertAbstract',
        data: {
          "userId": getApp().globalData.userId,
          "abstractcId": abstractcId,
          "webId": webId,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': getApp().globalData.cookie
        },
        success: function (res) {
          //console.log(res);
          if (res.data.ret == true) {
            if(res.data.data.result == "success"){
              wx.showToast({
                title: res.data.data.info,
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            }
            else{
              wx.showToast({
                title: "添加失败",
                icon: 'loading',
                duration: 1000,
                mask: true
              })
            }
          }else{
            wx.showToast({
              title: res.data.data.info,
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
      //获取全局的data
      //console.log(data)
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
    });
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
  lastPage: function (e) {
    if (currentPage == 0){
      wx.showToast({
        title: "当前为第一页",
        icon: 'success',
        duration: 1000,
        mask: true
      })

    }else{
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
    if (currentPage == my_data.length - 1){
      wx.showToast({
        title: "当前为最后一页",
        icon: 'success',
        duration: 1000,
        mask: true
      })
    }else{
      currentPage++;
      var my_data = this.data.info;
      this.setData({
        currentPage: currentPage,
        list: my_data[currentPage].data
      })
    }

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
  //点击list表事件
  detailData: function (e) {
    //获取手指触摸的是哪一项  
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    var flag = false;
    //console.log(e.target.dataset.webid)当前点击的webId
    for (var i = 0; i < list.length; i++) {
      //当前属于选中状态
      if (list[i].txtStyle == "left:-200px") {
        flag = true;
      }
    }
    if (!flag) {
      wx.navigateTo({
        url: '../dataDetails/dataDetails?webId=' + e.target.dataset.webid,
      })
    }

     
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
    viewAllWebPage(this);
    getAbstractCategory(this);
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
    var that = this
    initdata(that)
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
          var length = this.data.delBtnWidth;
          txtStyle = "left:-" + length + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //console.log(txtStyle);
      //更新列表的状态  
      this.setData({
        list: list,
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
      var length = this.data.delBtnWidth;
      var txtStyle = disX > this.data.delBtnWidth / 4 ? "left:-" + length  + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list,
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
    var addBtnWidth = this.getEleWidth(this.data.addBtnWidth);
    
    this.setData({
      delBtnWidth: delBtnWidth,
      editBtnWidth: editBtnWidth,
      addBtnWidth: addBtnWidth
    });
  },
  
  delItem: function (e) {
    var that = this
    var webId = e.target.dataset.id;
    var isCollect = e.target.dataset.collect;
    if (isCollect == 0){
      //点击收藏按钮事件  
      wx.showModal({
        title: '提示',
        content: '是否收藏？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              method: 'POST',
              url: ajaxUrl.ajaxUrl() + 'webpage/hasCollect',
              data: {
                "webId": webId,
                "isCollect": 0
              },
              // dataType:'json',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': getApp().globalData.cookie
              },
              success: function (res) {
                //console.log(res);
                if (res.data.data){
                  wx.showToast({
                    title: res.data.data.info,
                    icon: 'succes',
                    duration: 1000,
                    mask: true
                  })
                  var my_data = that.data.list;
                  for (var i = 0; i < my_data.length; i++) {
                    if (my_data[i].webId == webId) {
                      my_data[i].webIsCollect = 1;
                    }
                  }
                  that.setData({
                    list: my_data,
                  });
                }
                else{
                  wx.showToast({
                    title: "收藏失败",
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

    else if (isCollect == 1){
      //点击取消收藏按钮事件  
      wx.showModal({
        title: '提示',
        content: '是否取消收藏？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              method: 'POST',
              url: ajaxUrl.ajaxUrl() + 'webpage/hasCollect',
              data: {
                "webId": webId,
                "isCollect": 1
              },
              // dataType:'json',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': getApp().globalData.cookie
              },
              success: function (res) {
                //console.log(res);
                if (res.data.data) {
                  wx.showToast({
                    title: res.data.data.info,
                    icon: 'succes',
                    duration: 1000,
                    mask: true
                  })
                  var my_data = that.data.list;
                  for (var i = 0; i < my_data.length; i++) {
                    if (my_data[i].webId == webId) {
                      my_data[i].webIsCollect = 0;
                    }
                  }
                  that.setData({
                    list: my_data,
                  });
                }
                else{
                  wx.showToast({
                    title: "取消收藏失败",
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


  
  editItem: function (e) {
    var that = this


  },
})