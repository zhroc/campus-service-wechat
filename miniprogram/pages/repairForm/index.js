// pages/repairForm/index.js
var app = getApp();
var pages = getCurrentPages().pop();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildingArray: [],
    buildingIndex: 0,

    imageUrlArray: [],
    videoUrlArray: [],

    formData: {},
    rules: [
      {
        name: "address",
        rules: [
          {required: true,  message: "请填写详细地址"}, 
          {
            validator(rule, value) {
              if (value.length > 10) {
                return '详细地址必须为10个字以内的汉字'
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
      {
        name: "faultinfo",
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

  // 上传图片
  getImage: function() {
    const that = this 
    wx.chooseMedia({
      count: 1,    //上传数量限制
      mediaType: ['image'],   //上传类型 可以是image图片 也可以是video视频  mix是图片视频都选
      sizeType: ['compressed'],   //上传是否压缩 仅对图片有效 original原图 compressed压缩图
      sourceType: ['camera'],   //上传来源 图库album或者相机camera
      maxDuration: 10,  //拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。
      camera: 'back',    //仅在 sourceType 为 camera 时生效，使用前置或后置摄像头
      success(res) { 
        //console.log(res) 
        res.tempFiles.forEach(function(item){       //循环出结果  循环选中的图片和视频 
          console.log(item) 
          // console.log(item.tempFilePath)
          let imageUrlArray = that.data.imageUrlArray
          imageUrlArray.push(item.tempFilePath)
          that.setData({
            imageUrlArray: imageUrlArray
          })
        })
      }
    }) 
  },

  // 上传视频
  getVideo: function() {
    const that = this 
    wx.chooseMedia({
      count: 1,    //上传数量限制
      mediaType: ['video'],   //上传类型 可以是image图片 也可以是video视频  mix是图片视频都选
      sizeType: ['compressed'],   //上传是否压缩 仅对图片有效 original原图 compressed压缩图
      sourceType: ['camera'],   //上传来源 图库album或者相机camera
      maxDuration: 10,  //拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。
      camera: 'back',    //仅在 sourceType 为 camera 时生效，使用前置或后置摄像头
      success(res) { 
        //console.log(res) 
        res.tempFiles.forEach(function(item){       //循环出结果  循环选中的图片和视频 
          console.log(item) 
          // console.log(item.tempFilePath)
          // 在data中保存媒体地址，以便前端展示
          let videoUrlArray = that.data.videoUrlArray
          videoUrlArray.push(item.tempFilePath)
          that.setData({
            videoUrlArray: videoUrlArray
          })
        })
      }
    }) 
  },

  //预览图片
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let img_arr = this.data.imageUrlArray[index];
    // console.log(img_arr)
    wx.previewImage({
      current: [img_arr],
      urls: [img_arr],
      fail: (err) => {
        console.log('图片失败', err)
      },
      success: (res) => {
        console.log('图片成功', res)
      }
    })
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
      let imageLength = this.data.imageUrlArray.length
      let videoLength = this.data.videoUrlArray.length
      if (!valid || imageLength !== 2 || videoLength !== 1) {
        this.setData({
          error: errors ? errors[0].message : "请按要求上传故障图片与视频"
        })
      }
      // 验证成功
      else {
        let dataArray = {}
        dataArray["repairBuilding"]  = this.data.buildingArray[this.data.buildingIndex]
        dataArray["repairAddress"]  = this.data.formData.address
        dataArray["repairDescribe"] = this.data.formData.faultinfo
        dataArray["userMob"] = this.data.formData.mobile
        dataArray["userId"] = wx.getStorageSync('userid')
        dataArray["userName"] = wx.getStorageSync('username')
        let orderCode = this.orderCode()
        dataArray["orderCode"] = orderCode
        // console.log(dataArray)
        wx.showLoading({
          title: '正在上传',
          mask: true,
        })
        let rootfolder = "cloudbase-cms/repairorder/"
        this.uploadFile(rootfolder + orderCode + "/image1.jpg", this.data.imageUrlArray[0])
        .then(function(resolve) {
          var pages = getCurrentPages().pop()
          let imageUrlArray = pages.data.imageUrlArray
          imageUrlArray[0] = resolve
          pages.setData({
            imageUrlArray: imageUrlArray
          })
          return pages.uploadFile(rootfolder + orderCode + "/image2.jpg", pages.data.imageUrlArray[1])
        })
        .then(function(resolve) {
          var pages = getCurrentPages().pop()
          let imageUrlArray = pages.data.imageUrlArray
          imageUrlArray[1] = resolve
          pages.setData({
            imageUrlArray: imageUrlArray
          })
          return pages.uploadFile(rootfolder + orderCode + "/video1.mp4", pages.data.videoUrlArray[0])
        })
        .then(function(resolve) {
          var pages = getCurrentPages().pop()
          let videoUrlArray = pages.data.videoUrlArray
          videoUrlArray[0] = resolve
          pages.setData({
            videoUrlArray: videoUrlArray
          })
          console.log('media file upload success')
          dataArray["imageUrlArray"]  = pages.data.imageUrlArray
          dataArray["videoUrlArray"]  = pages.data.videoUrlArray
          const timestamp = new Date().getTime()
          dataArray["createTime"] = timestamp
          // console.log(dataArray)
          wx.hideLoading()
          return pages.cloudSubmitRepairOrder(dataArray)
        })
        .then(function(resolve) {
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

  // 上传文件到云存储
  uploadFile(cloudPath, filePath) {
    let p = new Promise(function(resolve, reject) {
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath,
        success: res => {
          console.log('[上传文件] 成功：', res.fileID)
          resolve(res.fileID)
        },
        fail: e => {
          console.log('[上传文件] 失败：', e)
          reject(e)
        }
      })
    })
    return p
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
    let currentDate = date.getFullYear() + "-" + month + "-" + strDate
            + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return currentDate
  },

  // 生成维修订单存入数据库
  cloudSubmitRepairOrder(dataArray) {
    let p = new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        name: 'submitRepairOrder',
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
      }
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
        console.log('设施报修区域获取成功')
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