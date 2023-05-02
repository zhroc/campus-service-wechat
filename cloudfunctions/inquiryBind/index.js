// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  // 默认设置为未绑定微信的状态
  var bind = 0 
  var status = 0
  
  var res = await db.collection("user")
  .where({
    openid:  wxContext.OPENID,
  })
  .get()

  if (res.data.length == 1) {
    bind = 1
    if (res.data[0].status == 1) {
      status = 1
    }
  }

  return {
    bind: bind,
    status: status,
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}