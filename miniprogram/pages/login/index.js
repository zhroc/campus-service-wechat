

// pages/login/index.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['学生', '工作人员'],
    objectArray: [
      {
        id: 0,
        name: '学生',
      },
      {
        id: 1,
        name: '工作人员',
      },
    ]
  },
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
  },

  cloudwxBind(username, usernumber) {
    var p = new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        name:'wxBind',
        data: {
          name: username,
          number: usernumber,
        },
        complete:res=>{
          var result = res.result
          // console.log(result)
          if (result.code == 200) {
            resolve('绑定成功')
          }
          else {
            reject('绑定失败')
          }
        }
      })
    })
    return p
  },

  userBind(username, usernumber){
    wx.showLoading({
      title: '绑定中',
    })
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 5000)
    this.cloudwxBind(username, usernumber)
    .then(
      // 绑定成功的情况
      function(data){
        wx.hideLoading()
        wx.switchTab({  
          url: '/pages/tools/index',
        }) 
      },
      // 绑定失败的情况
      function(season){
        wx.hideLoading()
        wx.showToast({
          title: season,
          icon: 'error',
          duration: 2000
        })
      })
  },
  doLogin: function(e){
    var fromType = e.detail.value;
    // var identity =  fromType.identity;
    var username = fromType.username;
    var usernumber = fromType.usernumber;

    if(username != null && usernumber != null){ 
      // 名字校验
      var reg = /^[\u4e00-\u9fa5]{2,4}$/i; 
      if (reg.test(username)) {
        // 绑定微信
        // console.log(fromType)
        this.userBind(username, usernumber);
      }
      else {
        wx.showToast({ 
          icon:'error',
          title: '请规范填写信息', 
        })
      }
    }
    else {
      wx.showToast({ 
        icon:'error',
        title: '信息填写不完整', 
      })
    }
  },
  




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})