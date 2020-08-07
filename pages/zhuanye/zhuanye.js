// pages/test/test.js
Page({
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    tableInfo: {},
    selectInfo:{},
    options: [],
    
  },
  handleChange(e) {
    const that = this
    var util = require('../../utils/util')
    // console.log(e.detail);
    console.log(e.detail.text, e.detail.item.text)
    that.setData({
      selectInfo: util.getSelectInfo(e.detail.item.text, that.data.selectInfo, that.data.item)     
    })
    console.log(that.data.selectInfo)
    wx.cloud.callFunction({
      name: 'get',
      data:{
        searchInfo: that.data.selectInfo
      },
      success: function(res) {
        that.setData({
          tableInfo:{
            // title:["年份","省份","专业","最低分","平均分", "最高分"],
            contentItem: res.result.data
          }
        })
        // console.log(res.result.data)
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    wx.cloud.init({
      env: 'wechat-0tped'
    })
    const db = wx.cloud.database()
    const util = require("../../utils/util")
    db.collection('item').get({
      success: function(res) {
        that.setData({
          item: res.data[0],
          options: util.setOptions(res.data[0])
        })
      }
    })
    // console.log(that.data.item)

    
    wx.cloud.callFunction({
      name: 'get',
      data:{
        searchInfo: {
          city: '陕西',
          year: 2019, 
        }},
      success: function(res) {
        that.setData({
          tableInfo:{
            // title:["年份","省份","专业","最低分","平均分", "最高分"],
            contentItem: res.result.data
          }
        })
        // console.log(res.result.data)
      },
      fail: console.error
    })
    
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})