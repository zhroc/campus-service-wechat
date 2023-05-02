// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  
  // 默认请求状态401
  var code = 401

  // 核对身份
  var res = await db.collection("user")
  .where({
    name: event.name,
    uid: event.number,
  })
  .get()

  if (res.data.length == 1) {
    var bindres = await db.collection('user')
    .where({
      name: event.name,
      uid: event.number,
    })
    .update({
      data: {
        openid: wxContext.OPENID
      },
    })
    if (bindres.stats.updated == 1) {
      code = 200
    }
  }

  return {
    code: code,
    // sql: sql,
    // insql: insql,
    // rows: rows,
    // checkRows: checkRows,
    // inRows: inRows,
    // openid: wxContext.OPENID,
  }
}