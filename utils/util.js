function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function setOptions(data) {
  console.log('调用setOptions')
   var options = []
   var city = data.city
   var year = data.year
   var specialty = data.specialty
   var rank = data.rank
   var city_option = {
     text: '省份',
     type: 'radio',
     options: [],
   }

   var year_option = {
    text: '年份',
    type: 'radio',
    options: [],
   }

   var specialty_option = {
    text: '专业',
    type: 'custom',
    options: [],
  }

  var min_option = {
    text: '最低分',
    type: 'custom'
  }

  var min_option = {
    text: '分数',
    type: 'custom'
  }

  var aver_option = {
    text: 'aver',
    type: 'custom'
  }

  var max_option = {
    text: 'max',
    type: 'custom'
  }

  var rank_option = {
    text: '分段',
    type: 'custom'
  }

  for (let i = 0; i < city.length; i++) {
    let option = {
      text: city[i]  
    }
    city_option.options.push(option)
    } 

    for (let i = 0; i < year.length; i++) {
      let option = {
        text: year[i]  
      }
      year_option.options.push(option)
      } 

   for (let i = 0; i < specialty.length; i++) {
     let option = {
       text: specialty[i]  
     }
     specialty_option.options.push(option)
   }

  //  for (let i = 0; i < rank.length; i++) {
  //   let option = {
  //     text: rank[i]  
  //   }
  //   rank.options.push(option)
  // }

   
   options.push(year_option)
   options.push(city_option)
   options.push(specialty_option)
   options.push(min_option)
   options.push(rank_option)


   return options
}



function getSelectInfo(value, selectInfo, item) {
  console.log('调用getSelectInfo')
  // console.log(item)
  var years = item.year
  var citys = item.city
  var specialtys = item.specialty

  if (years.indexOf(value) != -1) {
    if (value == '年份') {
      delete selectInfo.year
      return selectInfo
    }
    selectInfo.year = value
  } else if (citys.indexOf(value) != -1){
    if (value == '省份') {
      delete selectInfo.city
      return selectInfo
    }
    selectInfo.city = value
  } else if (specialtys.indexOf(value) != -1){
    if (value == '专业') {
      delete selectInfo.specialty
      return selectInfo
    }
    selectInfo.specialty = value
  } else {
    console.log('匹配失败')
  }
  return selectInfo
}

// async function getData(key, searchInfo,searchField, dbName) {
//     wx.cloud.init({
//       env: 'wechat-0tped'
//     })
//     const db = wx.cloud.database()
//     switch (key) {
//       case 'default': {
//         const result = await db.collection(dbName).get()
//         return result.data
//       }
//       case 'info': {
//         const result = await db.collection(dbName).where(searchInfo).get()
//         return result.data
//       }
//       case 'field': {
//         const result = await db.collection(dbName).field(searchField).get()
//         return result.data
//       }
//       case 'all': {
//         const result = await db.collection(dbName).where(searchInfo).field(searchField).get()
//         return result.data
//       }
//     }
    
//   }
  
function patch(score_data, batch_data) {
  var year = score_data['year']
  var length = batch_data.length
  for (let i=0; i< length; i++) {
    if(batch_data[i]['year'] == 2020)
      var batch_now = batch_data[i]['batch_score']
    
    if(batch_data[i]['year'] == year) {
      // console.log(batch_data[i]['batch_'])
      var dmin = score_data['min'] - batch_data[i]['batch_score']
      var davg = parseInt(score_data['avg']) - batch_data[i]['batch_score']
      
    }
  }
  let tmp = {'dmin': dmin, 'davg': davg, 'batch_now': batch_now}
  return tmp
}

function judgeOdds(result, batch_data, score) {
  var dl = 0
  var da = 0
  var batch_now = result[0]['batch_now']
  var d = score - batch_now
  for(let i = 0; i < result.length; i ++) {
    dl = dl + result[i]['dmin']
    da = da + result[i]['davg']
  }
  var dl = dl / result.length
  var da = da / result.length
  
  if(d == dl)
    return 0.5
  else if(d >= da)
    return 1
  else if(d > dl){
    return (d - dl) / (da - dl) *0.5 + 0.5
  }
  else 
    return 0
  
}

function getOdds(searchInfo, batch_data, datas, score) {
  console.log('getOdds()')

  // let batch_data = getData('info', searchInfo, null, 'batch_score')
  // console.log(batch_data)
  // console.log(datas)
  var results = {}
  for(let i=0; i<datas.length; i++) {
    let data = datas[i]
    let patch_score = patch(data, batch_data, score)
    if (results[data['specialty']]==null){
      let tmp = []
      tmp.push(patch_score)
      results[data['specialty']] = tmp

    }
    else {
      let tmp = results[data['specialty']]
      tmp.push(patch_score)
      results[data['specialty']] = tmp
    }
    
  }
  // console.log(results)
  var judge_results = []
  var keys = Object.keys(results)
  for(let i=0; i < keys.length; i++) {
    let result = results[keys[i]]
    let judge = judgeOdds(result, batch_data, score)
    let t = {}
    t['specialty'] = keys[i]
    t['Odds'] = parseInt(judge * 100)
    judge_results.push(t)
  }
  judge_results = sort(judge_results)
  // console.log(judge_results)
  return judge_results
}

function sort(datas) {
  var arr = datas
  var len = arr.length;
  for (var i = 0; i < len - 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
          if (arr[j]['Odds'] < arr[j+1]['Odds']) {        // 相邻元素两两对比
              var temp = arr[j+1];        // 元素交换
              arr[j+1] = arr[j];
              arr[j] = temp;
          }
      }
  }
  return arr;
}


module.exports = {
  formatTime: formatTime,
  setOptions: setOptions,
  getSelectInfo: getSelectInfo,
  getOdds: getOdds,
  patch: patch,
  judgeOdds: judgeOdds,
  sort: sort,
}
