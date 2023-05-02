// pages/myFavorites/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoritesArticleList: []
  },

  // 云函数获取文章
  cloudGetMyFavoritesArticle(articlesIdList){
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'getMyFavoritesArticle',
        data: {
          articlesIdList: articlesIdList
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

  // 查看文章详情
  gotodetail(e) {
    let info = e.currentTarget.dataset.info
    // console.log(info)
    wx.setStorageSync("articleInfo", info)
    wx.navigateTo({
      url: '/pages/article/index',
    })
  },

  // 请求加载页面数据
  loadPageData() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let articlesIdList = wx.getStorageSync('userlikefavoriteslist').collectidarr
    if (articlesIdList !== false) {
      this.cloudGetMyFavoritesArticle(articlesIdList)
      .then(
        function(data) {
          // console.log(data)
          let Pages = getCurrentPages().pop();
          Pages.setData ({
            favoritesArticleList: data
          })
          wx.hideLoading({})
        },
        function(reason) {
          wx.hideLoading({})
          console.log("获取收藏文章列表失败")
        }
      )
    }
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