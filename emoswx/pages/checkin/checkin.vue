<template>
	<view>
		<camera device-position="front" flash="off" class="camera" @error="error" v-if="showCamera"></camera>
		<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
		<view class="operate-container">
			<button type="primary" class="btn" @tap="clickBtn" :disabled="canCheckin">{{ btnText }}</button>
			<button type="warn" class="btn" @click="testBtn">测试</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/utils.js';

var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
var qqmapsdk;
export default {
	data() {
		return {
			canCheckin: true, // 判断是否可以考勤
			photoPath: '',
			btnText: '拍照',
			showCamera: true,
			showImage: false
		};
	},
	onLoad: function() {
		let that = this;
		// 判断当前时间是否可以考勤
		that.ajax(that.url.validCanCheckIn, 'GET', null, function(resp) {
			utils.logging('查看是否可以考勤', resp);
			console.log(resp.data.data)
			let msg = resp.data.data.status;
			if (msg != '可以考勤') {
				that.canCheckin = false;
				setTimeout(function() {
					uni.showToast({
						title: msg,
						icon: 'none'
					});
				}, 1000);
			} else {
				that.canCheckin = true;
				setTimeout(function() {
					uni.showToast({
						title: msg
					});
				}, 1000);
			}
		});
	},
	methods: {
		// 点击拍照函数
		clickBtn: function() {
			let that = this;
			if (that.btnText == '拍照') {
				// 创建微信小程序的拍照上下文
				let ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: function(resp) {
						console.log(resp.tempImagePath);
						that.photoPath = resp.tempImagePath;
						that.showCamera = false;
						that.showImage = true;
						that.btnText = '签到';
					}
				});
			} else {
				uni.showLoading({
					title: '签到中请稍后'
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 30000);

				uni.uploadFile({
					url: that.url.checkin,
					filePath: that.photoPath,
					name: 'photo',
					header: {
						Token: uni.getStorageSync('Token')
					},
					success: function(resp) {
						let result = JSON.parse(resp.data)
						if (resp.statusCode == 200){
							switch(result.code){
								case(500):{
									uni.showToast({
										title: result.message,
										icon: 'none'
									});
								};break;
								case(200):{
									uni.showToast({
										title: '签到成功',
										complete: function() {
											uni.navigateTo({
												url: '../checkin_result/checkin_result'
											});
										}
									});
								};break;
							}
						}else{
							uni.showToast({
								title: "系统错误！",
								icon: 'none'
							});
						}
					}
				});
			}
		},

		// 重拍函数
		// afresh: function() {
		// 	let that = this;
		// 	that.showCamera = true;
		// 	that.showImage = false;
		// 	that.btnText = '拍照';
		// }
		
		testBtn: function() {
			var that = this
			console.log(that.url.checkin)
			
			uni.chooseMedia({
				  count: 1,
				  mediaType: ['image','video'],
				  sourceType: ['album', 'camera'],
				  maxDuration: 30,
				  camera: 'back',
			  success: function (res) {
			    // 返回选定照片的本地文件路径列表，tempFilePaths可以作为img标签的src属性显示图片
				uni.uploadFile({
					url: that.url.checkin,
					filePath: res.tempFiles[0].tempFilePath,
					name: 'photo',
					header: {
						Token: uni.getStorageSync('Token')
					},
					success: function(resp) {
						console.log(resp);
						let result = JSON.parse(resp.data)
						console.log(result)
						if (resp.statusCode == 200){
							switch(result.code){
								case(500):{
									uni.showToast({
										title: result.message,
										icon: 'none'
									});
								};break;
								case(200):{
									uni.showToast({
										title: '签到成功',
										complete: function() {
											uni.navigateTo({
												url: '../checkin_result/checkin_result'
											});
										}
									});
								};break;
							}
						}else{
							uni.showToast({
								title: "系统错误！",
								icon: 'none'
							});
						}
					}
				});
			  }
			});
		}

	}
};
</script>

<style lang="less">
@import url('checkin.less');
</style>
