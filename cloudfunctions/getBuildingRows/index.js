// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  let buildingRows
  let result = await db.collection("area")
      .get()

  if (result.errMsg === "collection.get:ok") {
    buildingRows = result.data
  }

  return {
    buildingRows: buildingRows
  }
}