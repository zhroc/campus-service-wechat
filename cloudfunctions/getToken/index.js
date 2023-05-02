// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const md5 = require('md5-node')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx99c98633b67ec5a0&secret=265f963b7d4385dcdc066d800d07a4bb&grant_type=authorization_code&js_code=' + event.code
  return await rp(url)
    .then(function (res) {
      result = eval("(" + res + ")")

      return {
        // openid: result.openid,
        token: md5(result.session_key),
      }
    })
    .catch(function (err) {
      return 'get session fail'
    });
}


