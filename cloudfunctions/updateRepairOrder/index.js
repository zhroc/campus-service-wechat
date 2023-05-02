// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  
  // 默认结果
  let result

  // 核对身份
  let res = await db.collection("user")
  .where({
    openid:  wxContext.OPENID,
  })
  .get()

  if (res.data.length == 1) {
    let updateres = await db.collection('repairorder')
    .where({
      id: event.orderId
    })
    .update({
      data: {
        status: 1
      },
    })
    if (updateres.stats.updated == 1) {
      result = updateres
    }
  }

  return {
    data: result
  }
}