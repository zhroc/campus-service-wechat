// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  const _ = db.command

  // 查找用户点赞的文章
  var likelist = await db.collection("article")
  .where({
    like: _.all([wxContext.OPENID])
  })
  .get()

  // 查找用户收藏的文章
  var collectlist = await db.collection("article")
  .where({
    collect: _.all([wxContext.OPENID])
  })
  .get()

  var userlikefavoriteslist = {
    likeidarr: [],
    collectidarr: []
  }
  var likeidarr = []
  var collectidarr = []
  for (const item of likelist.data) {
    likeidarr.push(item._id)
  }
  for (const item of collectlist.data) {
    collectidarr.push(item._id)
  }

  // 将获取的数据存入json对象中
  userlikefavoriteslist.likeidarr = likeidarr
  userlikefavoriteslist.collectidarr = collectidarr

  return {
    // data: result
    data: userlikefavoriteslist
  }
}