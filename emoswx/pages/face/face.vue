<template>
	<view>
		<view class="operate-container">
			<input v-model="inputValue" type="text" @confirm="haveFaceModel" />
			<button type="warn" class="btn" @tap="uploadFile" :disabled="!haveModel">上传</button>
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
			canCreateModel: false, // 判断是否有人脸模型
			photoPath: '',
			inputValue:'' // 输入的id
		};
	},
	onLoad: function() {
		qqmapsdk = new QQMapWX({
			key: 'SFZBZ-YWM3Z-YYAXA-TWWBE-BZCNE-5ZBEO'
		});
	},
	onShow: function() {
		let that = this;

	},
	methods: {
		// 上传人脸图像
		uploadFile: function() {
			let that = this;

			let address = '中国广东省广州市从化区广州软件学院';
			let country = '中国';
			let province = '广东省';
			let city = '广州市';
			let district = '从化区';

			if (address != '中国广东省广州市从化区广州软件学院') {
				setTimeout(function() {
					uni.showToast({
						title: '不在签到区域内',
						icon: 'none'
					});
				}, 1000);
			} else {
				wx.chooseImage({
					count: 1, // 只能选择一张图片
					success: function(res) {
						// 临时图片路径
						let tempFilePaths = res.tempFilePaths[0];
						that.photoPath = tempFilePaths;

						uni.uploadFile({
							url: that.url.createFaceModel,
							filePath: that.photoPath,
							name: 'photo',
							header: {
								token: uni.getStorageSync('token')
							},
							formData: {
								address: address,
								country: country,
								province: province,
								city: city,
								district: district
							},
							success: function(resp) {
								console.log(resp);
								if (resp.statusCode == 200) {
									uni.showToast({
										title: '人脸建模成功'
									});
								} else if (resp.statusCode == 500) {
									uni.showToast({
										title: resp.data,
										icon: 'none'
									});
								}
							}
						});
					}
				});
			}
		},

		haveFaceModel: function() {
			let that = this
			// 判断该用户是否有对应的人脸模型
			let id = parseInt(that.inputValue)
			let data = {
				userId:id
			}
			that.ajax(that.url.haveFace, 'POST', data, function(resp) {
				utils.logging('查询该用户是否有对应的人脸模型', resp);
				let msg = resp.data.msg;
				if (msg != '可以为该用户创建人脸模型') {
					setTimeout(function() {
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}, 1000);
				} else {
					that.canCreateModel = true
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('face.less');
</style>
