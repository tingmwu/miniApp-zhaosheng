const app = getApp();


var radarChart = null;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
	city: null,
	branch: null,
	picker: [],
	picker_item: ['理科', '文科'],
  textareaAValue: null,
  modalContent: null,
  searchInfo:{
    city:null,
    branch:null
  },
  batch_data:[],
  judgeOdds:{},
  options: [{
    text: '专业',
    type: 'custom'
  },
  {
    text: '录取概率(%)',
    type: 'sort'
  }
  ],
  titleShow: true
	// modalName:null, 
  },


  onLoad: function () {
    
    const that = this
    wx.cloud.init({
      env: 'wechat-0tped'
    })
    const db = wx.cloud.database()
    const util = require('../../utils/util')
    db.collection('item').get({
      success: function(res) {
		console.log(res.data[0].city.slice(1,-1))
		that.setData({
			picker: res.data[0].city.slice(1,-1),
		  })
      }
	})
  },

  PickerChange(e) {
	const that = this
    console.log(that.data.picker[e.detail.value]);
    that.setData({
      city: e.detail.value,
      searchInfo:{
        city: that.data.picker[e.detail.value],
        branch: that.data.searchInfo.branch
      }
    })
  },
  PickerItemChange(e) {
	const that = this
    console.log(that.data.picker_item[e.detail.value]);
    this.setData({
      branch: e.detail.value,
      searchInfo:{
        city: that.data.searchInfo.city,
        branch: that.data.picker_item[e.detail.value]
      }
    })
  },
  input(e) {
	console.log(e.detail.value)
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  showModal(content) {
    this.setData({
    modalName: 'Modal',
    modalContent: content,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  commit(e) {
	const that = this
	var util = require('../../utils/util')
	if(that.data.city == null) {
		console.log("请选择省份！")
		that.showModal("请选择省份！")
	}
	else if(that.data.branch == null) {
    console.log("请选择文理科！")
    that.showModal("请选择文理科！")
	}
	else if(that.data.textareaAValue == null) {
    console.log("请输入分数！")
    that.showModal("请输入分数！")
	}
	else {
    wx.cloud.callFunction({
      name: 'get_batch',
      data:{
        searchInfo: that.data.searchInfo},
      success: function(res) {
          
          console.log(res.result)
          that.setData({
            batch_data: res.result.data
          })
        
      },
      fail: console.error
    })

    wx.cloud.callFunction({
      name: 'get',
      data:{
        searchInfo: that.data.searchInfo},
      success: function(res) {
        console.log(util.getOdds(that.data.searchInfo, that.data.batch_data, res.result.data, that.data.textareaAValue))
        that.setData({
          judgeOdds: {
            contentItem: util.getOdds(that.data.searchInfo, that.data.batch_data, res.result.data, that.data.textareaAValue)
          },
          titleShow: false
        })
      },
      fail: console.error
    })

    console.log(that.data.judgeOdds)

  }
  

  },
  handleChange(e) {
    const that = this
    var util = require('../../utils/util')
    console.log(e);
    var sortOdds = util.sort(that.data.judgeOdds)
    console.log(sortOdds)
    that.setData({
      judgeOdds: {
        contentItem: util.sort(that.data.judgeOdds.contentItem)
      }
    })
    
  },
})