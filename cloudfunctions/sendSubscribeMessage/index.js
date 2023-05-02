// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      // touser: cloud.getWXContext().OPENID,
      touser: 'oCzUn5NSsq6W-xCqnIbAIZ0Hewl4',
      templateId: '1HxovmtvKTBFsCpEmDjEkiDE7xfs2Yx406aaIT8WRqQ',
      page: 'pages/repairHistory/index',
      // 开发过程必须将跳转小程序类型设置为开发版
      miniprogramState: 'developer',
      data: {
        character_string10: {
          value: '202012121025146845'
        },
        time1: {
          value: '2022年8月15日 15:21'
        },
        thing2: {
          value: '学生宿舍3栋床架报修'
        },
        phrase14: {
          value: '待分配'
        },
        thing3: {
          value: '刘师傅'
        }
      }
    })
    return result.errCode
  }
  catch (err) {
    return err
  }

  // return {
  //   event,
  // }
}