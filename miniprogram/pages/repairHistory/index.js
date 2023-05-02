// pages/repairHistory/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['进行中', '已完成'],
    currentTab: 0,
    doOrderList: [],
    completedOrderList: [],
  },

  //点击选中nav方法
  navbar: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  // 加载订单数据
  cloudGetRepairHistory() {
    let p = new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getRepairHistory',
        data: {
          uid: wx.getStorageSync('userid')
        },
        success: res=> {
          let result = res.result
          resolve(result)
        }
      })
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
    let seconds = new Date(timestamp).getSeconds() < 10 ? '0' + new Date(timestamp).getSeconds():new Date(timestamp).getSeconds()
    let strdate = year + "-" + month + "-" + date
    let strtime = hours + ":" + minutes
    thedate.strdate = strdate
    thedate.strtime = strtime
    return (strdate + " " + strtime)
    return thedate
  },

  // 前往订单详情页面
  goRepairOrderInfoPage: function(e) {
    // 将当前的订单信息存入storage
    let repairOrderInfo = e.currentTarget.dataset.info
    wx.setStorageSync('repairOrderInfo', repairOrderInfo)
    // 跳转页面
    wx.navigateTo({
      url: '/pages/repairOrderInfo/index'
    })
  },

  // 加载页面数据
  loadPageData() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.cloudGetRepairHistory()
    .then(function (result) {
      // console.log(result)
      let pages = getCurrentPages().pop()
      let myRepairList = result.data
      if (myRepairList.length !== 0) {
        let doOrderList = []
        let completedOrderList = []
        for (const i in myRepairList) {
          if (myRepairList[i].status === 0) {
            let showdate = pages.timestamp2date(myRepairList[i]._createTime)
            myRepairList[i].showdate = showdate
            doOrderList.push(myRepairList[i])
          }
          if (myRepairList[i].status === 1) {
            let showdate = pages.timestamp2date(myRepairList[i]._createTime)
            myRepairList[i].showdate = showdate
            completedOrderList.push(myRepairList[i])
          }
        }
        pages.setData({
          doOrderList: doOrderList,
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