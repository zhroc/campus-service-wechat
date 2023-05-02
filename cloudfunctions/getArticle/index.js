// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  // 判断请求是否合法
  var res = await db.collection("user")
  .where({
    openid:  wxContext.OPENID,
  })
  .get()

  if (res.data.length == 1) {
    if (event.type == "hot") {
      var articlelist = await db.collection("article")
      .where({
        hot: true
      })
      .get()
    }
    else {
      // 获取全部文章
      var articlelist = await db.collection("article")
      .where({
      })
      .get()
    }
  }
  

  return {
    data: articlelist.data
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}