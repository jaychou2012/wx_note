//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    srollHeight: 200,
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    srollHeight: 300,
    objectId: '',
    pictures: [],
    title1: '',
    title2: '',
    title3: '',
    content: '',
    images: '',
    styleVisible: 'height: 180px;',
  },
  onLoad: function(options) {
    app.globalData.refreshIndex = false;
    this.setData({
      objectId: options.id,
    })
  },
  onShow: function() {
    wx.showNavigationBarLoading();
    var that = this;
    const query = API.Query('Riji');
    query.get(this.data.objectId).then(res => {
      console.log(res)
      wx.hideNavigationBarLoading()
      this.setData({
        title1: res.time,
        content: res.content,
        title2: res.updatedAt,
        styleVisible: res.hasImg ? 'height: 180px;' : 'height: 180px;display:none',
        pictures: this.data.pictures.concat(res.img),
        images: res.img,
      })
      console.log(this.data.pictures[0])
    }).catch(err => {
      console.log(err)
    })
  },

  viewImage: function() {
    var that = this
    wx.previewImage({
      //当前显示下表
      current: that.data.images,
      //数据源
      urls: that.data.images
    })
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
})