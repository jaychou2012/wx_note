//app.js

App({

  onShow: function() {

  },
  onHide: function() {

  },
  onLaunch: function() {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code;
      }
    })

    wx.getStorage({
      key: 'userId',
      success: function(res) {
        that.globalData.userId = res.data;
      },
    })
    wx.getStorage({
      key: 'nick',
      success: function(res) {
        that.globalData.nick = res.data;
      },
    })
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.platform = res.platform;
        that.globalData.windowHeight = res.windowHeight;
      }
    })
  },
  globalData: {
    userInfo: null,
    code: '',
    userId: '',
    nick: '',
    platform: '',
    refreshIndex: true,
    lock: false,
    lockCount: 0,
    windowHeight: 0,
    user: {},
  }
})