// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  
  // 默认状态
  var bind = 1

  // 解绑微信
  var unbindres = await db.collection('user')
    .where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        openid: ''
      },
    })
    if (unbindres.stats.updated == 1) {
      bind = 0
    }

  return {
    bind: bind,
    // sql: sql,
    // insql: insql,
    // rows: rows,
    // checkRows: checkRows,
    // inRows: inRows,
    // openid: wxContext.OPENID,
  }
}