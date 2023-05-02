// pages/me/index.js
var app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

    /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    pagelist: [{
      name: '我的收藏',
      path: "/pages/myFavorites/index"
    },
    {
      name: '预约记录',
      path: "/pages/subscribeHistory/index"
    },
    {
      name: '报修记录',
      path: "/pages/repairHistory/index"
    }]
  },
  
  // 更换头像点击事件
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    wx.setStorageSync("useravatarUrl", avatarUrl)
  },

  // 推送设置点击事件
  goPushSettingPage: function() {
    wx.requestSubscribeMessage({
      tmplIds: [
        'gUmeDvkc5BL1MMWcRlUYr4Hc3miLEfpuchdNY_1IpaY',
        'kSSmNcNyArBowKmUv_y0tBZfeHweatCOy_5w5i_IElc'
      ],
      success: res => { console.log(res) },
      fail: e => { console.log(e) },
      complete: res => {
        if (res.errCode == 20004) {
          wx.showModal({
            title: '提示',
            content: '您关闭了订阅消息主开关，无法进行订阅',
            confirm: '去开启',
            success: res => {
              if (res.confirm) {
                console.log('确认框-用户点击 确认')
                wx.openSetting({
                  withSubscriptions: true,
                  success: res => {
                    console.log(res.subscriptionsSetting)
                  }
                })
              }
              else if (res.cancel) {
                console.log('确认框-用户点击 取消')
              }
            }
          })
        }
      }
    })
  },
  
  // 进入指定页面
  gotoPage: function(e) {
    let path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path
    })
  },

  // 解绑功能云函数
  cloudUnBind() {
    // 用Promise处理异步
    // cloudUnBind
    var p = new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        name: 'unBind',
        complete:res=> {
          var result = res.result
          console.log(result)
          if (result.bind == 0){
            resolve('解绑成功')
          }
          else {
            reject('解绑失败')
          }
        }
      })
    })
    return p
  },

  // 解绑点击事件
  unBind: function() {
    wx.showModal({
      title: '注意！',
      content: '解绑后需要重新验证账号密码方能再次登录，请谨慎解绑！',
      confirmText: '继续解绑',
      cancelText: '暂不解绑',
      success: (res) => {
        if (res.confirm) {
          // 确认解绑
          this.cloudUnBind()
          .then(
            function(data) {
              console.log(data)
              wx.clearStorage()
              wx.showToast({
                title: '解绑成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                //跳转到首页，强制重启
                wx.reLaunch({
                  url: '/pages/login/index',
                })
            }, 2000);
            },
            function(reason) {
              console.log(reason)
            }
          )
        } else if (res.cancel) {
          // 取消解绑 大家就当无事发生
        }
      }
    })
  },

  // 退出登录点击事件
  logOut: function() {
    wx.showLoading({
      title: '正在退出',
      duration: 2000,
    })
    wx.clearStorage()
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '您已成功退出登录！',
      confirmText: '重新登录',
      cancelText: '退出程序',
      success (res) {
        if (res.confirm) {
          //跳转到首页，强制重启
          wx.reLaunch({
            url: '/pages/tools/index',
          })
        } else if (res.cancel) {
          wx.exitMiniProgram({success: (res) => {}})
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: {
        userName: wx.getStorageSync('username'),
        userId: wx.getStorageSync('userid'),
        userIdentity: wx.getStorageSync('identity'),
        avatarUrl: wx.getStorageSync('useravatarUrl')
      }
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