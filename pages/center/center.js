//获取应用实例
const app = getApp()
var base64 = require("../images/base64");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick: '未登录',
    label: '点击去登录',
    flower: '小红花 0 朵',
    photo: '../images/pic_160.png',
    registerTime: '',
    userName: '',
    wx: '',
    lock: false,
    btn_visible: 'display:none',
    pictures: [],
  },

  loginout: function() {
    wx.clearStorage();
    this.setData({
      nick: '未登录',
      label: '点击去登录',
      flower: '小红花 0 朵',
      photo: '../images/pic_160.png',
      registerTime: '',
      userName: '',
      wx: '',
      lock: false,
      btn_visible: 'display:none',
      pictures: [],
    })
    app.globalData.userId = ''
    app.globalData.nick = ''
    app.globalData.refreshIndex = true;
  },

  login: function() {
    if (this.data.nick == '未登录' && this.data.label == '点击去登录') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      this.previewImage();
    }
  },

  previewImage: function(e) {
    var that = this
    wx.previewImage({
      //当前显示下表
      current: this.data.pictures[0],
      //数据源
      urls: this.data.pictures
    })
  },

  switchChange: function(e) {
    if (e.detail.value) {
      wx.navigateTo({
        url: '../lock/lock',
      })
    } else {
      wx.removeStorage({
        key: 'lock',
        success: function(res) {},
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    app.globalData.refreshIndex = false;
  },

  help: function() {
    wx.navigateTo({
      url: '../about/help',
    })
  },

  about: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'nick',
      success: function(res) {
        that.setData({
          nick: res.data,
          btn_visible: '',
        })
      },
      fail: function(e) {
        that.setData({
          btn_visible: 'display:none',
        })
      }
    })
    wx.getStorage({
      key: 'createdAt',
      success: function(res) {
        that.setData({
          registerTime: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'qmd',
      success: function(res) {
        that.setData({
          label: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'flower',
      success: function(res) {
        that.setData({
          flower: '小红花' + res.data + '朵',
        })
      }
    })
    wx.getStorage({
      key: 'photo',
      success: function(res) {
        that.setData({
          photo: res.data,
          pictures: that.data.pictures.concat(res.data),
        })
      }
    })
    wx.getStorage({
      key: 'username',
      success: function(res) {
        that.setData({
          userName: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'lock',
      success: function(res) {
        that.setData({
          lock: res.data.length == 4 ? true : false,
        })
      },
      fail: function(e) {
        that.setData({
          lock: false,
        })
      }
    })
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