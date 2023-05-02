// pages/repairOrderInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: {
      repairTitle: ["报修地址", "详细地点", "故障描述"],
      orderTitle: ["报修时间", "报修状态", "用户姓名", "用户手机"],
      repairData: [],
      orderData:[],
    }
  },

  // 格式化订单数据
  sortData() {
    let p = new Promise(function (resolve, reject) {
      let pages = getCurrentPages().pop()
      let data = wx.getStorageSync('repairOrderInfo')
      let repairData = []
      let mediumData = []
      let orderData = []
      repairData.push(data.building)
      repairData.push(data.fulladdress)
      repairData.push(data.describe)
      mediumData.push(data.image)
      mediumData.push(data.video)
      orderData.push(pages.timestamp2date(data._createTime))
      orderData.push(pages.showStatus(data.status))
      orderData.push(data.uname)
      orderData.push(data.umob)
      pages.setData({
        repairData: repairData,
        mediumData: mediumData,
        orderData: orderData
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

  // 显示维修状态
  showStatus(status) {
    // console.log(status)
    let strStatus
    if (status === 0) {
      strStatus = "进行中"
    }
    if (status === 1) {
      strStatus = "已完成"
    }
    return strStatus
  },

  //预览图片
  previewImg(e) {
    let url = e.currentTarget.dataset.src
    console.log(url)
    wx.previewImage({
      current: [url],
      urls: [url],
      fail: (err) => {
        console.log('图片失败', err);
      },
      success: (res) => {
        console.log('图片成功', res);
      }
    })
  },

  // 更新订单信息
  updateRepairOrder: function() {
    wx.showModal({
      title: '注意！',
      content: '请确认维修已完成后操作',
      confirmText: '确认完成',
      cancelText: '我再看看',
      success: (res) => {
        if (res.confirm) {
          // 确认完成
          let pages = getCurrentPages().pop()
          let orderId = wx.getStorageSync('repairOrderInfo').id
          pages.cloudUpdateRepairOrder(orderId)
          .then(function(resolve) {
            wx.showToast({
              title: '确认成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              //返回上一界面
              wx.navigateBack({
                delta: 1
              })
            }, 2000);
          })
        } else if (res.cancel) {
          // 取消确认 大家就当无事发生
        }
      }
    })
  },

  // 云函数更新报修订单状态
  cloudUpdateRepairOrder(orderId) {
    let p = new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'updateRepairOrder',
        data: {
          orderId: orderId,
          orderStatus: 1
        },
        success: res=> {
          let result = res.result
          console.log(result.data)
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
    wx.removeStorageSync('repairOrderInfo')
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