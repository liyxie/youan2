import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// 开发环境的全局路径
// let baseUrl = "https://www.cpg2023.cn/warehouse" 
// let baseUrl = "http://localhost:9999/warehouse" 
let baseUrl = "https://youan.bobochang.work/warehouse"
let workflow="http://CentOS的IP:9090/emos-workflow"

// 请求接口路径
Vue.prototype.url = {
	getPhoneNumber: baseUrl + "/getPhoneNumber", // 获取手机号
	login: baseUrl + "/wx-login",  // 登录接口
	checkin: baseUrl + "/checkin/checkin", // 考勤签到
	checkinNoFace: baseUrl + "/checkin/checkin-noface", // 不用人脸签到
	createFaceModel: baseUrl + "/checkin/createFaceModel", // 创建人脸模型
	haveFace:baseUrl+"/checkin/haveFace", // 查看是否有人脸
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn", // 查询用户是否可以签到
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin", // 签到后返回的数据
	searchUserSummary: baseUrl + "/user/user-info", // 查询用户详细信息
	searchMonthCheckin: baseUrl + "/checkin/searchMonthCheckin", // 查询一个月内的考勤记录
}

// 封装ajax，参数有路径，请求类型，数据，匿名函数（后续处理）
Vue.prototype.ajax = function(url, method, data, fun) {
	uni.request({
		"url": url,
		"method": method,
		"header": {
			token: uni.getStorageSync("Token")
		},
		"data": data,
		success: function(resp) {
			if (resp.data.code == 502) {
				uni.navigateTo({
					url:"/pages/login/login"
				})
			} else if (resp.statusCode == 200 && resp.data.code == 200) {
				fun(resp)
			} else if (resp.statusCode == 200 && resp.data.code != 200){
				uni.showToast({
					icon: "none",
					title: resp.data.message
				})
			}
		},
	})
}