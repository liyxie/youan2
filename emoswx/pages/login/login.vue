<template>
	<view>
		<image src="../../static/logo-1.png" class="logo" mode="widthFix"></image>
		<!-- <input class="uni-input" v-model="userCode" focus placeholder="请输入账号" />
		<input class="uni-input" v-model="userPwd" password type="text" placeholder="请输入密码" /> -->

		<!-- <button class="login-btn" open-type="getUserInfo" @tap="login()">登陆系统</button> -->
		<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">登陆打卡</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userCode:"",
				userPwd:""
			}
		},
		
		methods: {
			onGetPhoneNumber(e) {
				  console.log(e)
				  let data = {}
				  let that = this
				  data.code = e.detail.code
				  data.grant_type = 'client_credential'
				  data.appid = 'wx85419626edd58f69'
				  data.secret = 'a67db825f0d7b40455cab34fff273e27'
				  that.ajax(that.url.getPhoneNumber,"GET",data,function(resp){
					  console.log(resp)
				  })
			},
			/* login:function(){
				let that=this
				console.log(that.userCode)
				console.log(that.userPwd)
				let data = {}
				data.userCode = that.userCode
				data.userPwd = that.userPwd
				
				that.ajax(that.url.login,"POST",data,function(resp){
					uni.setStorageSync("Token", resp.data.data)
					//跳转到登陆页面
					uni.switchTab({
						url:"../index/index"
					})
				})		
			}, */
			getPhoneNumber:function(){
				let that = this
				let data = {}
				data.grant_type = 'client_credential'
				data.appid = 'wx85419626edd58f69'
				data.secret = 'a67db825f0d7b40455cab34fff273e27'
				that.ajax('https://api.weixin.qq.com/cgi-bin/token',"GET",data,function(resp){
					let newData = {}
					newData.access_token = resp.access_token
					newData.code = code
					that.ajax('https://api.weixin.qq.com/wxa/business/getuserphonenumber','POST',data,function(resp){
							console.log(resp.phone_info.phoneNumber)
						})
					})
				}
				
			},
		}
</script>

<style lang="less">
	@import url("login.less");
	
</style>
