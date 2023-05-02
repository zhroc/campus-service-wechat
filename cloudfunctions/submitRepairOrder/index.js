// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  let code = 400
  // 判断请求是否合法
  var res = await db.collection("user")
  .where({
    openid:  wxContext.OPENID,
  })
  .get()

  if (res.data.length == 1) {
    var addresult = await db.collection("repairorder")
      .add({
        data: {
          id: event.orderCode,
          uid: event.userId,
          uname: event.userName,
          umob: event.userMob,
          building: event.repairBuilding,
          fulladdress: event.repairAddress,
          describe: event.repairDescribe,
          image: event.imageUrlArray,
          video: event.videoUrlArray,
          _createTime: event.createTime,
          status: 0
        }
      })
  }

  if (addresult.errMsg === "collection.add:ok") {
    code = 200
  }

  return {
    code: code
  }
}