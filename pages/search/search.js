//获取应用实例
const app = getApp()

Page({
  data: {
    srollHeight: 300,
    inputShowed: true,
    inputVal: "",
    isHideLoadMore: false,
    pageCount: 60,
    page: 0,
    listData: [],
  },
  toRead: function(e) {
    var id = e.currentTarget.dataset.objectid;
    wx.navigateTo({
      url: '../read/read?id=' + id,
    })
  },

  onPullDownRefresh: function() {
    this.setData({
      page: 0,
    })
    this.getList(true);
  },

  onReachBottom: function() {
    this.setData({
      isHideLoadMore: false,
    })
    this.getList(false);
  },

  getList: function(refresh) {
    var that = this;
    const query = app.globalData.Bmob.Query("Riji");
    query.equalTo("id", "==", app.globalData.userId);
    query.equalTo("open", "!=", true);
    query.equalTo("visible", "==", true);
    query.order("-updatedAt");
    query.equalTo("content", "==", {
      "$regex": "" + this.data.inputVal + ".*"
    });
    query.limit(this.data.pageCount);
    query.skip(this.data.pageCount * this.data.page);
    query.find().then(res => {
      console.log(res)
      wx.hideNavigationBarLoading();
      if (refresh) {
        wx.stopPullDownRefresh() //停止下拉刷新
        for (var i = 0; i < res.length; i++) {
          res[i]['index'] = (i + 1);
        }
      } else {
        this.setData({
          isHideLoadMore: true,
        })
        for (var i = 0; i < res.length; i++) {
          res[i]['index'] = (this.data.listData.length + i + 1);
        }
      }
      if (res.length == 0) {
        wx.showToast({
          title: '没有更多数据啦~',
          icon: 'none'
        })
        return
      }
      if (refresh) {
        this.setData({
          listData: res,
        });
      } else {
        this.setData({
          listData: this.data.listData.concat(res),
        })
      }
      that.data.page++;
    });
  },

  onShow: function() {
    app.globalData.refreshIndex = false;
    var that = this;
    // wx.getSystemInfo({
    //   success: function(res) {
    //     console.info(res.windowHeight);
    //     let height = res.windowHeight;
    //     wx.createSelectorQuery().selectAll('.input-container').boundingClientRect(function(rects) {
    //       rects.forEach(function(rect) {
    //         that.setData({
    //           srollHeight: res.windowHeight // - rect.bottom
    //         });
    //       })
    //     }).exec();
    //   }
    // });
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '搜索日记'
    })
  },

  search: function() {
    if (app.globalData.userId.length < 1) {
      wx.showToast({
        title: '请登录~',
        icon: 'none'
      })
      return
    }
    wx.showNavigationBarLoading();
    this.onPullDownRefresh();
  },
})