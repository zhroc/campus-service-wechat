// pages/subscribeHistory/index.js
// pages/repairHistory/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['进行中', '审核中', '已完成'],
    currentTab: 0,
    doOrderList: [],
    auditingOrderList: [],
    completedOrderList: [],
  },

  //点击选中nav方法
  navbar: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  // 加载订单数据
  cloudGetSubscribeHistory() {
    let p = new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getSubscribeHistory',
        data: {
          uid: wx.getStorageSync('userid')
        },
        success: res=> {
          let result = res.result
          console.log('订单获取成功')
          resolve(result)
        }
      })
    })
    return p
  },

  // 前往订单详情页面
  goSubscribeOrderInfoPage: function(e) {
    // 将当前的订单信息存入storage
    let subscribeOrderInfo = e.currentTarget.dataset.info
    wx.setStorageSync('subscribeOrderInfo', subscribeOrderInfo)
    // 跳转页面
    wx.navigateTo({
      url: '/pages/subscribeOrderInfo/index'
    })
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
    let seconds = new Date(timestamp).getSeconds() < 10 ? '0' + new Date(timestamp).getSeconds():new Date(timestamp).getSeconds()
    let strdate = year + "-" + month + "-" + date
    let strtime = hours + ":" + minutes
    thedate.strdate = strdate
    thedate.strtime = strtime
    return (strdate + " " + strtime)
    return thedate
  },

  // 请求加载页面数据
  loadPageData() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.cloudGetSubscribeHistory()
    .then(function (result) {
      var pages = getCurrentPages().pop()
      // console.log(result)
      let mySubscribeList = result.data
      if (mySubscribeList.length !== 0) {
        let doOrderList = []
        let auditingOrderList = []
        let completedOrderList = []
        for (let i in mySubscribeList) {
          if (mySubscribeList[i].status == 1) {
            let showdate = pages.timestamp2date(mySubscribeList[i].startdate)
            mySubscribeList[i].showdate = showdate
            doOrderList.push(mySubscribeList[i])
          }
          if (mySubscribeList[i].status == 0) {
            let showdate = pages.timestamp2date(mySubscribeList[i].startdate)
            mySubscribeList[i].showdate = showdate
            auditingOrderList.push(mySubscribeList[i])
          }
          if (mySubscribeList[i].status == 2) {
            let showdate = pages.timestamp2date(mySubscribeList[i].startdate)
            mySubscribeList[i].showdate = showdate
            completedOrderList.push(mySubscribeList[i])
          }
        }
        pages.setData({
          doOrderList: doOrderList,
          auditingOrderList: auditingOrderList,
          completedOrderList: completedOrderList,
        })
        wx.hideLoading({})
      }
      else {
        // 未查询到有关该用户的订单
        wx.hideLoading({})

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
    this.loadPageData()
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