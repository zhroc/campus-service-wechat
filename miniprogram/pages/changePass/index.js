// pages/changePass/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    userid:  '',
    usermob: '',
  },

  // 点击提交表单事件
  changePass: function(e) {
    let fromType = e.detail.value
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '修改后需要重新登录',
      title: '温馨提示',
      success: (res) => {
        if (res.confirm) {
          let pages = getCurrentPages().pop()
        pages.verifyFormData(fromType)
        .then(function(resolve) {
          let dataArray = resolve
          return pages.cloudUpdateUserInfo(dataArray)
        })
        .then(function(resolve) {
          console.log(resolve)
          if (resolve) {
            wx.clearStorage()
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              //跳转到首页，强制重启
              wx.reLaunch({
                url: '/pages/tools/index',
              })
            }, 2000);
          }
          else {
            wx.showToast({
              title: '修改失败',
              icon: 'error',
              duration: 2000
            })
          }
        })
        }
        else if (res.cancel) {
          console.log('取消修改个人信息')
        }
      }
    })
  },

  // 校验数据
  verifyFormData(fromType) {
    var p = new Promise(function(resolve, reject){
    // console.log(fromType)
    let pages = getCurrentPages().pop()
    let fromuserid = fromType.userid
    let fromoldmob = fromType.oldnumber
    let fromnewmob = fromType.newnumber
    if (fromuserid == pages.data.userid && fromoldmob == pages.data.usermob) {
      let dataArray = {}
      dataArray.userid = fromuserid
      dataArray.oldmob = fromoldmob
      dataArray.newmob = fromnewmob
      resolve(dataArray)
    }
    else {
      wx.showToast({
        title: '信息输入有误',
        icon: 'error',
        duration: 2000
      })
    }
  })
  return p
  },

  // 云函数修改用户手机号
  cloudUpdateUserInfo(dataArray) {
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'updateUserInfo',
        data: {
          userid: dataArray.userid,
          oldmob: parseInt(dataArray.oldmob),
          newmob: parseInt(dataArray.newmob)
        },
        success:res=>{
          var result = res.result
          // console.log(result)
          resolve(result.data)
        }
      })
    })
    return p
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      username: wx.getStorageSync('username'),
      userid:  wx.getStorageSync('userid'),
      usermob: wx.getStorageSync('usermob'),
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