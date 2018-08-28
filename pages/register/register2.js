const app = getApp();

Page({
  data: {
    showTopTips: false,
    phone: '',
    password: '',
    pictures: ['../images/pic_160.png'],
    currentImg: '',
    label: '0/100',
    labelText: '',
    topTips: '填写有误，请检查',
    nick: '',
    radioItems: [{
        name: '男',
        value: '0'
      },
      {
        name: '女',
        value: '1',
        checked: true
      }
    ],
    sex: true,
    date: "2016-09-01",
    time: "12:01",

    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    countries: ["中国", "美国", "英国"],
    countryIndex: 0,

    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,

    isAgree: false
  },


  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  register: function() {
    wx.navigateTo({
      url: '../register/register2',
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  previewImg: function() {
    var _this = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // success
        console.log(res)
        _this.data.pictures = _this.data.pictures.concat(res.tempFilePaths)
        _this.data.pictures = _this.data.pictures.length <= 1 ? _this.data.pictures : _this.data.pictures.slice(0, 1)
        _this.setData({
          pictures: res.tempFilePaths,
          currentImg: res.tempFilePaths[0],
        })
        console.log(res.tempFilePaths[0]);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  // 登录 
  next: function() {
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
    const query = API.Query("_User");
    query.equalTo("username", "==", this.data.phone);
    query.find().then(res => {
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

  showTopTips: function() {
    var that = this;
    if (that.data.nick.length < 1) {
      this.setData({
        topTips: '昵称没有填写',
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 2000);
      return;
    }
    if (!that.data.isAgree) {
      this.setData({
        topTips: '条款没有勾选',
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 2000);
      return;
    }
    if (that.data.currentImg.length < 1) {
      this.setData({
        topTips: '头像没有上传',
        showTopTips: true
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 2000);
      return;
    }
    if (that.data.currentImg.length > 0) {
      var file = API.File(new Date().getMilliseconds() + '.jpg', that.data.currentImg);
      file.save().then(res => {
        console.log('图片错误')
        console.log(res)
        that.setData({
          currentImg: res[0].url,
        })
        this.registerAPI();
      })
    }
  },

  nickInput: function(e) {
    this.setData({
      nick: e.detail.value,
    })
  },

  registerAPI: function(e) {
    let params = {
      username: this.data.phone,
      nick: this.data.nick,
      password: this.data.password,
      email: this.data.phone,
      thumPhoto: this.data.currentImg,
      thumbPhoto: this.data.currentImg,
      photo: this.data.currentImg,
      phone: '',
      deviceType: app.globalData.platform + '_wx',
      qmd: this.data.labelText,
      sex: this.data.radioItems[0].checked ? false : true,
      birthday: this.data.date,
      flower: 0,
    }
    API.User.register(params).then(res => {
      console.log(res)
      wx.showToast({
        title: '注册成功~',
        duration: 1000
      })
      this.saveUserInfo(res.objectId, res.createdAt);
      app.globalData.userId = res.objectId;
      app.globalData.nick = this.data.nick;
      app.globalData.refreshIndex = true;
      setTimeout(function() {
        wx.switchTab({
          url: '../center/center',
        })
      }, 1000);

    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '注册失败~' + err.error,
        icon: 'none',
        duration: 1000
      })
    });

  },

  saveUserInfo: function(userId, createdAt) {
    wx.setStorage({
      key: 'userId',
      data: userId,
    })
    wx.setStorage({
      key: "nick",
      data: this.data.nick,
    })
    wx.setStorage({
      key: "qmd",
      data: this.data.labelText,
    })
    wx.setStorage({
      key: "flower",
      data: '0',
    })
    wx.setStorage({
      key: "username",
      data: this.data.phone,
    })
    wx.setStorage({
      key: "password",
      data: this.data.password,
    })
    wx.setStorage({
      key: "photo",
      data: this.data.currentImg,
    })
    wx.setStorage({
      key: "sex",
      data: this.data.sex,
    })
    wx.setStorage({
      key: "date",
      data: this.data.date,
    })
    wx.setStorage({
      key: "createdAt",
      data: createdAt,
    })
  },

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  labelInput: function(e) {
    if (e.detail.value.length > 100) {
      wx.showToast({
        title: '已经达到最大字符数',
        icon: 'none'
      })
    }
    this.setData({
      label: e.detail.value.length + '/100',
      labelText: e.detail.value,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      phone: options.name,
      password: options.password
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})