//index.js
//获取应用实例
const app = getApp()
var time = require('../../utils/util.js');
var Bmob = require('../../utils/Bmob-1.6.3.min.js');
Bmob.initialize("", "");

Page({
  data: {
    srollHeight: 200,
    height: '',
    isNew: false,
    focus: false,
    pictures: ['../../res/imgs/icon_img.png'],
    images: '',
    content: '',
  },

  gotoShow: function() {
    var _this = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // success
        console.log(res)
        _this.data.pictures = _this.data.pictures.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        _this.data.pictures = _this.data.pictures.length <= 1 ? _this.data.pictures : _this.data.pictures.slice(0, 1)
        _this.setData({
          pictures: res.tempFilePaths
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  previewImage: function(e) {
    var that = this,
      pictures = this.data.pictures;
    wx.previewImage({
      //当前显示下表
      current: pictures[0],
      //数据源
      urls: pictures
    })
  },

  backPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  inputText: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  onSubmit: function() {
    var that = this;
    if (that.data.content.length < 1) {
      wx.showToast({
        title: '内容为空~',
        icon: 'none'
      })
      return;
    }
    wx.showNavigationBarLoading();
    if (that.data.pictures[0] != '../../res/imgs/icon_img.png') {
      var file = Bmob.File(new Date().getMilliseconds + '.jpg', that.data.pictures[0]);
      file.save().then(res => {
        that.setData({
          images: res[0].url,
        })
        console.log(res)
        this.send(true);
      })
      return;
    }
    this.send(false);
  },

  send: function(hasImage) {
    var dateString = time.formatTimeMonth(new Date(), 'Y/M/D h:m:s');
    const query = Bmob.Query('Riji');
    query.set("zans", 0)
    query.set("name", "")
    query.set("month", dateString)
    query.set("rijiPri", true)
    query.set("author", app.globalData.nick)
    query.set("content", this.data.content)
    query.set("visible", true)
    query.set("open", false)
    query.set("xq", 'kaixin')
    query.set("collect", false)
    query.set("count", '' + this.data.content.length)
    query.set("from", 'xiaochengxu')
    query.set("hasImg", hasImage)
    query.set("id", '' + app.globalData.userId)
    query.set("img", hasImage ? this.data.images : '')
    query.set("theme", 'mr')
    query.set("time", dateString)
    query.save().then(res => {
      console.log(res)
      wx.hideNavigationBarLoading();
      wx.showToast({
        title: '日迹发表成功~',
      })
      setTimeout(function() {
        wx.switchTab({
          url: '../index/index'
        })
      }, 1000);
    }).catch(err => {
      console.log(err)
    })
  },

  onShow: function() {
    app.globalData.refreshIndex = true;
    var that = this;
    let id = "#textareawrap";
    let query = wx.createSelectorQuery();
    query.select(id).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        height: res[0].height + "px"
      });
    });
  }
})