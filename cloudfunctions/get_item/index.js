// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'wechat-0tped'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {	
	const item = db.collection('item').get()

	return {
		data: item,
	}
	
}