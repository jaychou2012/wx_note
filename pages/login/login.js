//获取应用实例
const app = getApp();

Page({
  data: {
    phone: '',
    password: '',
    user: {},
  },

  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  onShow: function() {

  },

  register: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    this.getOpenId();
    wx.showToast({
      title: '授权成功',
      icon: 'none',
      duration: 1000,
    })
    setTimeout(function() {
      wx.switchTab({
        url: '../center/center',
      })
    }, 1000);
  },

  getOpenId: function() {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: '',
        secret: '',
        js_code: app.globalData.code,
        grant_type: 'authorization_code',
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.errcode == 40163) {
          wx.showToast({
            title: '获取ID失败，稍后再试',
            icon: 'none'
          })
          return
        }
        that.queryUser(res.data.openid);
      },
      fail: function(e) {
        console.log('请求失败：' + e)
      }
    })
  },

  queryUser: function(openId) {
    const query = API.Query("_User");
    query.equalTo("username", "==", '8@qq.com');
    console.log("openId:" + openId);
    query.find().then(res => {
      console.log(res);
      if (res.length == 0) {
        wx.showToast({
          title: '可以注册',
          icon: 'success',
          duration: 1000
        })
        this.register();
      } else {
        wx.showToast({
          title: '已被注册',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },

  // login_wx: function() {
  //   wx.getSetting({
  //     success(res) {
  //       if (!res.authSetting['scope.userInfo']) {
  //         wx.authorize({
  //           scope: 'scope.userInfo',
  //           success() {
  //             console.log('授权成功')
  //             wx.getUserInfo({
  //               success: res => {
  //                 // 可以将 res 发送给后台解码出 unionId
  //                 this.globalData.userInfo = res.userInfo
  //                 // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //                 // 所以此处加入 callback 以防止这种情况
  //                 if (this.userInfoReadyCallback) {
  //                   this.userInfoReadyCallback(res)
  //                 }
  //                 console.log(res)
  //                 wx.showToast({
  //                   title: '授权成功' + res.userInfo,
  //                   icon: 'none',
  //                   duration: 1000,
  //                 })
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  // 登录 
  login: function() {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 这里修改成跳转的页面 
      this.loginAPI();
    }
  },
  loginAPI: function() {
    API.User.login(this.data.phone, this.data.password).then(res => {
      console.log(res),
        this.setData({
          user: res,
        })
      console.log(this.data.user)
      this.saveUserInfo();
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(function() {
        wx.switchTab({
          url: '../center/center',
        })
      }, 1000);
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '' + err.error,
        icon: 'none',
        duration: 1000
      })
    });
  },
  saveUserInfo: function() {
    app.globalData.user = this.data.user;
    wx.setStorage({
      key: 'userId',
      data: this.data.user.objectId,
    })
    wx.setStorage({
      key: "nick",
      data: this.data.user.nick,
    })
    wx.setStorage({
      key: "qmd",
      data: this.data.user.qmd,
    })
    wx.setStorage({
      key: "flower",
      data: this.data.user.flower,
    })
    wx.setStorage({
      key: "username",
      data: this.data.user.username,
    })
    wx.setStorage({
      key: "password",
      data: this.data.password,
    })
    wx.setStorage({
      key: "photo",
      data: this.data.user.photo,
    })
    wx.setStorage({
      key: "sex",
      data: this.data.user.sex,
    })
    wx.setStorage({
      key: "date",
      data: this.data.user.birthday,
    })
    wx.setStorage({
      key: "createdAt",
      data: this.data.user.createdAt,
    })
    app.globalData.userId = this.data.user.objectId;
    app.globalData.nick = this.data.user.nick;
    app.globalData.refreshIndex = true;
  },
})