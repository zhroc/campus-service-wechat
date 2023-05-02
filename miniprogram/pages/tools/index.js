// pages/tools/index.js
var app = getApp();
var pages = getCurrentPages().pop();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部轮播图
    topImgs: [{
        url: "cloud://carousel/3.jpg"
      },{
        url: "cloud://carousel/2.jpg"
      }, {
        url: "cloud://carousel/1.jpg"
      }
    ],
    tabs: [{
      icon: "/images/icon/tab1.png",
      name: '场地预约',
      path: "/pages/subscribeForm/index"
    },
    {
      icon: "/images/icon/tab2.png",
      name: '设施报修',
      path: "/pages/repairForm/index"
    },
    {
      icon: "/images/icon/tab3.png",
      name: '校园资讯',
      path: "/pages/newsList/index"
    },
    {
      icon: "/images/icon/tab4.png",
      name: '通知管理',
      path: "wx.openSetting"
    }]
  },

  dianjilunbo(e) {
    console.log(e.currentTarget.dataset.item, "点击了轮播....")
    // var index = e.currentTarget.dataset.item
    // if (index == 0) {
    //   wx.navigateTo({
    //     url: '/pages/repairForm/index',
    //   })
    // } else if (index == 1) {
    //   wx.navigateTo({
    //     url: '/pages/repairForm/index',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/repairForm/index',
    //   })
    // }
  },

  initData: function() {
    this.setData({
      userInfo: {
        userName: wx.getStorageSync('username'),
        userId: wx.getStorageSync('userid'),
        userIdentity: wx.getStorageSync('identity'),
      }
    })
  },

  goTab(e) {
    let path = e.currentTarget.dataset.path;
    if (path == "wx.openSetting") {
      wx.openSetting({
        success (res) {
          console.log("进入通知设置")
        }
      })
    }
    else {
      wx.navigateTo({
        url: path,
      })
    }
  },

  gotodetail(e) {
    let info = e.currentTarget.dataset.info
    // console.log(info)
    wx.setStorageSync("articleInfo", info)
    wx.navigateTo({
      url: '/pages/article/index',
    })
  },

  // 云函数获取文章
  cloudGetArticle(){
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'getArticle',
        data: {
          type: "hot"
        },
        complete:res=>{
          var result = res.result
          // console.log(result)
          resolve(result.data)
        }
      })
    })
    return p
  },

  // 云函数获取用户点赞和收藏列表
  cloudGetUserLikeFavorites() {
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'getUserLikeFavorites',
        complete:res=>{
          let result = res.result
          // console.log(result)
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
    app.keepSession()
    .then(
      function(data){
        console.log(data)
        // 页面初始化数据
        var thisPages = getCurrentPages().pop();
        thisPages.initData()
      },
      function(reason) {
        // token不存在
        console.log(reason)
        app.userLogin()
        .then(function(data) {
          // 页面初始化数据
          var thisPages = getCurrentPages().pop();
          thisPages.initData()
        })
      }
    )
    // 此处有bug 获取文章列表不应该在此处 但是问题不大 如要修改 请对本页js进行重构
    // 获取文章列表
    var thisPages = getCurrentPages().pop();
    thisPages.cloudGetArticle()
    .then(
      function(data){
        var thisPages = getCurrentPages().pop();
        thisPages.setData({
          articleHotList: data
        })
        console.log('文章获取成功');
        // 获取用户点赞和收藏列表
        thisPages.cloudGetUserLikeFavorites()
        .then(
          function(data) {
            // console.log(data)
            wx.setStorageSync("userlikefavoriteslist", data.data)
            console.log('点赞收藏列表获取成功');
          },
          function(reason) {
            console.log('点赞收藏列表获取失败');
          }
        )
      },
      function(reason) {
        console.log('文章获取失败');
      }
    )
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