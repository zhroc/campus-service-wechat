// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  const mutualtype = event.mutualtype
  const _ = db.command

  // 判断是否点赞或收藏
  var mutualstats = await db.collection("article")
  .where({
    _id:  event.articleid,
    [mutualtype]: wxContext.OPENID
  })
  .get()

  if (mutualstats.data.length == 0) {
    // 点赞或收藏
    var res = await db.collection("article")
    .where({
      _id:  event.articleid,
    })
    .update({
      data: {
        [mutualtype]: _.push(wxContext.OPENID)
      }
    })
  }
  if (mutualstats.data.length == 1) {
    // 取消点赞或收藏
    var res = await db.collection("article")
    .where({
      _id:  event.articleid,
    })
    .update({
      data: {
        [mutualtype]: _.pull(wxContext.OPENID)
      }
    })
  }

  if (res.stats.updated == 1) {
    var result = res
  }

  return {
    data: result
    // data: mutualstats
  }
}