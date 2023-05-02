// pages/subscribeOrderInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: {
      subscribeTitle: ["预约地点", "详细地点", "预约时间", "结束时间", "申请缘由"],
      orderTitle: ["创建时间", "预约状态"],
      userTitle: ["用户姓名", "用户手机"],
      subscribeData: [],
      orderData:[],
      userData: []
    }
  },

  // 格式化订单数据
  sortData() {
    let p = new Promise(function (resolve, reject) {
      let pages = getCurrentPages().pop()
      let data = wx.getStorageSync('subscribeOrderInfo')
      let subscribeData = []
      let orderData = []
      let userData = []
      subscribeData.push(data.building)
      subscribeData.push(data.fulladdress)
      subscribeData.push(pages.timestamp2date(data.startdate))
      subscribeData.push(pages.timestamp2date(data.enddate))
      subscribeData.push(data.cause)
      orderData.push(pages.timestamp2date(data._createTime))
      orderData.push(pages.showStatus(data.status))
      userData.push(data.uname)
      userData.push(data.umob)
      pages.setData({
        subscribeData: subscribeData,
        orderData: orderData,
        userData: userData
      })
      resolve()
    })
    return p
  },

  // 时间戳转日期时间
  timestamp2date(timestamp) {
    let thedate = {
      strdate: '',
      strtime: ''
    }
    let year = new Date(timestamp).getFullYear()
    let month = new Date(timestamp).getMonth() + 1
    if(month < 10) {
      month = "0" + month
    }
    let date = new Date(timestamp).getDate()
    if(date < 10) {
      date = "0" + month
    }
    let hours = new Date(timestamp).getHours() < 10 ? '0' + new Date(timestamp).getHours() : new Date(timestamp).getHours()
    let minutes = new Date(timestamp).getMinutes() < 10 ? '0' + new Date(timestamp).getMinutes():new Date(timestamp).getMinutes()
    let strdate = year + "-" + month + "-" + date
    let strtime = hours + ":" + minutes
    thedate.strdate = strdate
    thedate.strtime = strtime
    return (strdate + " " + strtime)
    return thedate
  },

  // 显示预约状态
  showStatus(status) {
    // console.log(status)
    let strStatus
    if (status === 0) {
      strStatus = "审核中"
    }
    if (status === 1) {
      strStatus = "进行中"
    }
    if (status === 2) {
      strStatus = "已完成"
    }
    return strStatus
  },

  // 对订单进行审核
  updateStatus: function(e) {
    wx.showLoading({
      title: '操作中',
      mask: true,
    })
    let status = e.currentTarget.dataset.status
    this.cloudUpdateSubscribeOrder(status)
    .then(function(result) {
      // console.log(result.data)
      wx.hideLoading({
        complete: res=> {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },

  // 云函数更新预约状态
  cloudUpdateSubscribeOrder(status) {
    let p = new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'updateSubscribeOrder',
        data: {
          status: status,
          orderId: wx.getStorageSync('subscribeOrderInfo').id
        },
        success: res=> {
          let result = res.result
          console.log('订单状态更新成功')
          resolve(result)
        }
      })
    })
    return p
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.setData({
      userRole: wx.getStorageSync('identity')
    })
    // 格式化数据
    this.sortData()
    .then(function() {
      wx.hideLoading({})
    })
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
    wx.removeStorageSync('subscribeOrderinfo')
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