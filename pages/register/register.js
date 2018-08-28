const app = getApp();

Page({
  data: {
    phone: '',
    password: '',
  },


  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  register: function(e) {
    var name = this.data.phone;
    var pwd = this.data.password;
    console.log(name + '  ' + pwd);
    wx.redirectTo({
      url: '../register/register2?name=' + name + '&password=' + pwd,
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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