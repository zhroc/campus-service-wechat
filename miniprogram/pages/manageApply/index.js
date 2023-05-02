// pages/manageApply/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['预约审核', '报修管理'],
    currentTab: 0,
    auditSubscribeList: [],
    repairOrderList: [],
  },

  //点击选中nav方法
  navbar: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  // 云函数获取所有待审核的预约订单
  cloudGetAuditOrder() {
    let p = new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getAuditOrder',
        success: res=> {
          let result = res.result
          resolve(result)
        }
      })
    })
    return p
  },

  // 云函数获取所有人的报修订单
  cloudGetAllRepairOrder() {
    let p = new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getAllRepairOrder',
        success: res=> {
          let result = res.result
          resolve(result)
        }
      })
    })
    return p
  },

  // 前往预约订单详情页面
  goSubscribeOrderInfoPage: function(e) {
    // 将当前的订单信息存入storage
    let subscribeOrderInfo = e.currentTarget.dataset.info
    wx.setStorageSync('subscribeOrderInfo', subscribeOrderInfo)
    // 跳转页面
    wx.navigateTo({
      url: '/pages/subscribeOrderInfo/index'
    })
  },

  // 前往维修订单详情页面
  goRepairOrderInfoPage: function(e) {
    // 将当前的订单信息存入storage
    let repairOrderInfo = e.currentTarget.dataset.info
    wx.setStorageSync('repairOrderInfo', repairOrderInfo)
    // 跳转页面
    wx.navigateTo({
      url: '/pages/repairOrderInfo/index'
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

    //监听页面加载函数
    pageLoad() {
      let pages = getCurrentPages().pop()
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      pages.cloudGetAuditOrder()
      .then(function(result) {
        // console.log(result)
        let auditOrderList = result.data
        if (auditOrderList.length !== 0) {
          for (const i in auditOrderList) {
            let showdate = pages.timestamp2date(auditOrderList[i].startdate)
            auditOrderList[i].showdate = showdate
            pages.setData({
              auditOrderList: auditOrderList,
            })
          }
        }

        // 加载所有报修订单数据列表
        return pages.cloudGetAllRepairOrder()
        .then(function(result) {
          // console.log(result)
          let repairOrderList = result.data
          if (repairOrderList.length !== 0) {
            for (const i in repairOrderList) {
              let showdate = pages.timestamp2date(repairOrderList[i]._createTime)
              repairOrderList[i].showdate = showdate
              pages.setData({
                repairOrderList: repairOrderList,
              })
              wx.hideLoading({
                success: res=> {
                  console.log('所有数据获取成功')
                }
              })
            }
          }
        })
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.pageLoad()
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
    this.pageLoad()
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