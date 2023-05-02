// pages/article/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footdata: [{
      title: "点赞",
      url: "/images/icon/unlike.png",
    },
    {
      title: "收藏",
      url: "/images/icon/unfavorites.png"
    }, 
    {
      title: "转发",
      url: "/images/icon/unshare.png"
    }]
  },

  parseRich(html) {
    var content = html.replace(/<img[^>]*>/gi, function(match, capture) {
      var match = match.replace(/(style="(.*?)")|(width="(.*?)")|(height="(.*?)")/ig,'width=100%');
      return match;
    });
    content = content.replace(/&quot;/g,'"');
    content = content.replace(/&amp;/g, '&');
    content = content.replace(/&lt;/g, '<');
    content = content.replace(/&gt;/g, '>');
    content = content.replace(/&nbsp;/g, ' ');
    content = content.replace(/<p/gi, '<p class="p_class" ');
    content = content.replace(/<span/gi, '<span class="span_class" ');
    content = content.replace(/<img/gi, '<img class="img_class" ');
    return content;
  },

  // 底部点击
  clickfoot(e) {
    // console.log('点击' + e.currentTarget.dataset.index)
    let url
    const index = e.currentTarget.dataset.index
    const thisPages = getCurrentPages().pop()
    // 定义删除数组中指定元素的原型函数
    Array.prototype.remove = function(val) { 
      var index = this.indexOf(val); 
      if (index > -1) { 
          this.splice(index, 1); 
      } 
    };
    // 点赞和收藏的操作
    if (index == 0 || index == 1) {
      if (index == 0) {
        url = "/images/icon/like.png"
        let templist = wx.getStorageSync('userlikefavoriteslist')
        // 进行点赞
        if (thisPages.data.footdata[index].url != url) {
          templist.likeidarr.push(thisPages.data.detail._id)
          // console.log("点赞成功")
        }
        // 取消点赞
        else {
          url = "/images/icon/unlike.png"
          templist.likeidarr.remove(thisPages.data.detail._id)
          // console.log("取消点赞")
        }
        // 同步更新缓存
        wx.setStorageSync('userlikefavoriteslist', templist)
        // 更新图标
        var parlist = {
          url : url,
          mutualtype: "like"
        }
      }
      else {
        url = "/images/icon/favorites.png"
        let templist = wx.getStorageSync('userlikefavoriteslist')
        // 进行收藏
        if (thisPages.data.footdata[index].url != url) {
          templist.collectidarr.push(thisPages.data.detail._id)
        }
        // 取消收藏
        else {
          url = "/images/icon/unfavorites.png"
          templist.collectidarr.remove(thisPages.data.detail._id)
        }
        // 同步更新缓存
        wx.setStorageSync('userlikefavoriteslist', templist)
        // 更新图标
        var parlist = {
          url : url,
          mutualtype: "collect"
        }
      }
      thisPages.cloudChangeLikeFavorites(parlist.mutualtype, thisPages.data.detail._id)
      .then(
        function(data) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          }) 
          // console.log(data)
          console.log('change ' + parlist.mutualtype + ' success')
          // console.log(wx.getStorageSync('userlikefavoriteslist'))
        }
      )
    }
    // 转发
    if (index == 2) {
      url = "/images/icon/share.png"
        if (thisPages.data.footdata[index].url == url) {
          url = "/images/icon/unshare.png"
        }
      var parlist = {
        url : url,
        mutualtype: "share"
      }
    }
    // 点亮图标
    const _url = "footdata[" + index + "].url"
    this.setData({
      [_url]: parlist.url,
    })
  },

  // 设置底部交互状态
  setUserLikeFavoritesStats() {
    // 设置默认状态
    // let likeStats = false
    // let favoritesStats = false
    let userlikefavoriteslist = wx.getStorageSync('userlikefavoriteslist')
    // console.log(userlikefavoriteslist)
    if (userlikefavoriteslist.likeidarr.indexOf(this.data.detail._id) != -1) {
      // likeStats = true
      const _url = "footdata[0].url"
      this.setData({
        [_url]: "/images/icon/like.png",
      })
    }
    if (userlikefavoriteslist.collectidarr.indexOf(this.data.detail._id) != -1) {
      // favoritesStats = true
      const _url = "footdata[1].url"
      this.setData({
        [_url]: "/images/icon/favorites.png",
      })
    }
    // console.log(likeStats, favoritesStats)
  },

  // 云函数提交点赞收藏状态
  cloudChangeLikeFavorites(mutualtype, articleid) {
    // console.log(mutualtype, articleid)
    var p = new Promise(function(resolve, reject){
      wx.cloud.callFunction({
        name:'changeLikeFavorites',
        data: {
          mutualtype: mutualtype,
          articleid: articleid
        },
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
    // 从本地读取文章
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let detail = wx.getStorageSync('articleInfo');
    console.log(detail);
    detail.content = this.parseRich(detail.content);
    // console.log(detail.content);
    this.setData({
      detail: detail,
    })

    // 设置文章底部点亮状态
    this.setUserLikeFavoritesStats()

    setTimeout(function() {
      wx.hideLoading({})
    }, 800)
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
    wx.removeStorageSync('articleInfo')
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