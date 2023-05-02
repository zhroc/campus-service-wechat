// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  
  // 默认结果
  let result

  // 核对身份并尝试修改信息
  let updateres = await db.collection("user")
  .where({
    openid:  wxContext.OPENID,
    uid: event.userid,
    mob: event.oldmob
  })
  .update({
    data: {
      mob: event.newmob
    },
  })
    
  if (updateres.stats.updated == 1) {
    result = updateres
  }

  return {
    data: result
  }
}