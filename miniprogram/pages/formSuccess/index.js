// pages/formSuccess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 弹窗授权推送设置
  subscribeMessage: function () {
    wx.requestSubscribeMessage({
      tmplIds: ['gUmeDvkc5BL1MMWcRlUYr4Hc3miLEfpuchdNY_1IpaY'],
      success: res => {
        console.log(res)
        wx.switchTab({
          url: '/pages/tools/index'
        })
      },
      fail: e => {
        console.log(e)
      }
    })
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