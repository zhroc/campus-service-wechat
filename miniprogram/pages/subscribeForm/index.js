// pages/subscribeForm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildingArray: [],
    buildingIndex: 0,
    startDate: '',
    endDate: '',
    useDate: '',
    TimeArray: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    startTimeIndex: 0,
    endTimeIndex: 0,
    formData: {},
    rules: [
      {
        name: "address",
        rules: [
          {required: true,  message: "请填写详细地址"}, 
          {
            validator(rule, value) {
              if (value.length > 10) {
                return '详细地址必须为10个字以内'
              }
              return ''
            }
          }
        ]
      },
      {
        name: "siteusage",
        rules: [
          {required: true, message: "请填写故障描述"}, 
          {
            validator(rule, value) {
              // 只能输入汉字或字母或数字或这三种组合
              let re = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g
              if (re.test(value) || value.length > 100) {
                return '只能输入汉字或字母或数字'
              }
              return ''
            }
          }
        ]
      },
      {
        name: "mobile",
        rules: [
          {required: true, message: "请填写手机号"}, 
          {mobile: true, message: "手机号格式错误"}
        ]
      },
    ],
  },

  // 云函数获取报修区域列表
  cloudGetBuildingRows() {
    var p = new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        name: 'getBuildingRows',
        success: res=>{
          let result = res.result
          resolve(result)
        }
      })
    })
    return p
  },

  // 区域选择后确定--触发
  buildingChange: function(e){
    // let pages = getCurrentPages().pop();
    let buildingIndex = e.detail.value
    this.setData({
      buildingIndex: buildingIndex
    })
    // console.log(pages.data.buildingArray[buildingIndex]);
  },

  // 选择开始日期
  dateChange(e) {
    console.log('选择开始日期，携带值为', e.detail.value)
    this.setData({
      useDate: e.detail.value
    })
  },

  // 选择开始时间
  startTimeChange(e) {
    console.log('选择开始时间，携带值为', e.detail.value)
    this.setData({
      startTimeIndex: e.detail.value
    })
  },

  // 选择结束时间
  endTimeChange(e) {
    console.log('选择结束时间，携带值为', e.detail.value)
    this.setData({
      endTimeIndex: e.detail.value
    })
  },

  // 获取格式为yyyy-MM-dd HH:mm:ss的当前时间
  getFormatDate() {
    let date = new Date()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = "0" + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate
    }
    let enddate = new Date(date)
    enddate.setDate(date.getDate() + 7)
    let emonth = enddate.getMonth() + 1
    let estrDate = enddate.getDate()
    if (emonth >= 1 && emonth <= 9) {
        emonth = "0" + emonth
    }
    if (estrDate >= 0 && estrDate <= 9) {
        estrDate = "0" + estrDate
    }
    let currentDate = {
      startdate: date.getFullYear() + "-" + month + "-" + strDate,
      enddate: enddate.getFullYear() + "-" + emonth + "-" + estrDate,
      time: date.getHours() + ":" + date.getMinutes()
    }
    return currentDate
  },

  // 每一项失去焦点后的操作（认为该项填完）
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  
  // 提交表单
  submitForm: function() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors ? errors : 'no errors')
      if (!valid) {
        this.setData({
          error: errors ? errors[0].message : 'unkown errors'
        })
      }
      // 验证成功
      else {
        let dataArray = {}
        // console.log(this.data.buildingArray[this.data.buildingIndex])
        dataArray["subscribeBuilding"] = this.data.buildingArray[this.data.buildingIndex]
        dataArray["subscribeAddress"] = this.data.formData.address
        dataArray["userMob"] = this.data.formData.mobile
        dataArray["siteUsage"] = this.data.formData.siteusage
        dataArray["userId"] = wx.getStorageSync('userid')
        dataArray["userName"] = wx.getStorageSync('username')
        let startTimeStr = this.data.startDate + ' ' + this.data.TimeArray[this.data.startTimeIndex] + ':00'
        let startTimeStamp = Date.parse(new Date(startTimeStr))
        // console.log(startTimeStamp)
        let endTimeStr = this.data.startDate + ' ' + this.data.TimeArray[this.data.endTimeIndex] + ':00'
        let endTimeStamp = Date.parse(new Date(endTimeStr))
        dataArray["subscribeStartTime"] = startTimeStamp
        dataArray["subscribeEndTime"] = endTimeStamp
        const timestamp = new Date().getTime()
        dataArray["createTime"] = timestamp
        let orderCode = this.orderCode()
        dataArray["orderCode"] = orderCode
        // console.log(dataArray)
        wx.showLoading({
          title: '正在上传',
          mask: true,
        })
        this.cloudSubmitSubscribeOrder(dataArray)
        .then(function(resolve) {
          wx.hideLoading()
          // 跳转到表单提交成功页面
          // 跳转后进行弹窗推送授权
          wx.redirectTo({
            url: '/pages/formSuccess/index'
          })
        })
      }
    })
  },

  // 根据时间戳生成订单号
  orderCode() {
    let orderCode = ''
    for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
    {
      orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
    // console.log(orderCode)
    return orderCode;
  },

  // 生成预约记录存入数据库
  cloudSubmitSubscribeOrder(dataArray) {
    let p = new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        name: 'submitSubscribeOrder',
        data: dataArray,
        success: res => {
          let result = res.result
          if (result.code == 200) {
            console.log('表单提交成功')
            resolve()
          }
          else {
            console.log('云函数未能返回正确结果：', result)
            // reject()
          }
        },
        fail: e => {
          console.log('表单提交失败 原因：', e)
          // reject()
        }
      })
    })
    return p
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)

    // 同步用户信息
    this.setData({
      userInfo: {
        userName: wx.getStorageSync('username'),
        userIdentity: wx.getStorageSync('identity'),
        userMob: wx.getStorageSync('usermob'),
      },
      startDate: this.getFormatDate().startdate,
      endDate: this.getFormatDate().enddate,
      useDate: this.getFormatDate().startdate,
    })

    // 加载报修区域数据
    this.cloudGetBuildingRows()
    .then(
      function(result) {
        // console.log(result)
        let buildingRows = []
        for (const item of result.buildingRows) {
          // console.log(item)
          buildingRows.push(item.building)
        }
        // console.log(buildingRows)
        // 将报修区域列表数据存入Data
        let thisPages = getCurrentPages().pop()
        thisPages.setData({
          buildingArray: buildingRows,
        })
        console.log('预约区域获取成功')
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})