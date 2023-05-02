// pages/newslist/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 云函数获取文章
  cloudGetArticle(){
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'getArticle',
        data: {
          type: "all"
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.cloudGetArticle()
    .then(
      function(data) {
        // console.log(data)
        let thisPages = getCurrentPages().pop();
        thisPages.setData ({
          allArticleList: data
        })
        wx.hideLoading({})
        console.log("获取所有校园资讯列表成功")
      },
      function(reason) {
        wx.hideLoading({})
        console.log("获取所有校园资讯列表失败")
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