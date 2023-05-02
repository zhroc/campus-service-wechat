// app.js
App({
  //查询绑定状态 
  cloudInquiryBind() {
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name: 'inquiryBind',
        complete:res=>{
          var result = res.result
          // console.log(result)
          if (result.bind == 1) {
            if (result.status == 1) {
              resolve(result)
            }
            else {
              // 账号被封禁
              wx.showModal({
                title: '警告',
                content: '该账号已被管理员封禁！',
                confirmText: '退出程序',
                showCancel: false,
                complete: (res) => {
                  wx.exitMiniProgram({success: (res) => {}})
                }
              })
            }
          }
          // 账号未注册绑定
          else {
            wx.redirectTo({
              url: '/pages/login/index'
            })
          }
        }
      })
    })
    return p
  },

  // 调用微信登录接口
  wxLogin() {
    var p = new Promise(function(resolve, reject){
      wx.showLoading({
        title: '登陆中',
      })
      wx.login({
        success (res) {
          if (res.code) {
            resolve(res.code)
          }
        }
      }) 
    })
    return p
  },

  // 云函数获取token
  cloudGetToken(code){
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'getToken',
        data: {
          code: code,
        },
        complete:res=>{
          var result = res.result
          // console.log(result)
          wx.setStorageSync("token", result.token)
          resolve("获取token成功")
        }
      })
    })
    return p
  },

  // 登录的最后一步，将用户基本信息缓存在本地
  cloudGetUserInfo() {
    var p = new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        name: "getUserInfo",
        complete:res=> {
          var result = res.result
          console.log(result)
          wx.setStorageSync("identity", result.identity)
          wx.setStorageSync("username", result.username)
          wx.setStorageSync("userid", result.userid)
          wx.setStorageSync("usermob", result.usermob)
          wx.hideLoading()
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })          
          resolve("用户基本信息缓存成功")
        }
      }) 
    })
    return p
  },

  // 判断token是否存在
  existToken() {
    var p = new Promise(function(resolve, reject){
      if (wx.getStorageSync("token")) {
        // console.log("exist token")
        resolve("token存在")
      }
      else {
        reject("token不存在")
        // console.log("无token状态，准备登录")
        // getApp().userLogin()
      }
    })
    return p
  },

  // 调用微信接口检测登录是否过期
  wxCheckSession(){
    var p = new Promise(function(resolve, reject){
      wx.checkSession({
        success: (res) => {
          resolve("登录状态正常")
          // console.log("登录状态正常")
        },
        fail: (err) => {
          reject("登录状态失效，请重新登录")
        }
      })
    })
    return p
  },

  userLogin() {
    // 登录流程
    var p = new Promise(function(resolve, reject){
      getApp().cloudInquiryBind()
      .then(function(bindStatus){
        console.log(bindStatus)
        return getApp().wxLogin()
      })
      .then(function(code){
        console.log("获取code成功")
        return getApp().cloudGetToken(code)
      })
      .then(function(data){
        console.log(data)
        return getApp().cloudGetUserInfo()
      })
      .then(function(data){
        console.log(data)
        resolve(data)
      })
    })
    return p
  },

  keepSession() {
    // 检查并维持登录状态
    var p = new Promise(function(resolve, reject){
      getApp().existToken()
      .then(
        // 存在token则校验session是否过期
        function(data) {
          console.log(data)
          return getApp().wxCheckSession()
        },
        function(reason) {
          // token不存在则查询是否绑定微信
          // console.log("token不存在")
          reject("token不存在")
        }
      )
      .then(
        function(data) {
          // token存在且session未过期
          resolve(data)
          // console.log(data)
        },
        function(reason) {
          // token存在但session过期
          reject("token过期")
        }
      )
    })
    return p
  },

  onLaunch: function () {
    // 初始化云能力
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: '',
        traceUser: true,
      });
    }

    // 加载时检测用户状态并登录或保持
    // this.keepSession()

  },
});
