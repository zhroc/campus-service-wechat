// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const wxContext = cloud.getWXContext()

  // 判断请求是否合法
  var res = await db.collection("user")
  .where({
    openid:  wxContext.OPENID,
  })
  .get()

  if (res.data.length == 1) {
      // 获取用户收藏文章
      var favoritesArticleList = await db.collection("article")
      .where({
        _id: _.in(event.articlesIdList)
      })
      .get()
  }
  

  return {
    data: favoritesArticleList.data
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}