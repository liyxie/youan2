<template>
	<view>
		<view class="checkin-top">
			<view style="font-size 24px; font-weight: 400;" :style="{ color: status === '当前可以考勤' ? '#6a9335' : 'red' }">
				{{ status }}
			</view>
			<view style="font-size: 24px;">
				广州佑安土木工程有限公司
			</view>
		</view>
		<view class="checkin-container" @tap="checkin">
			<view class="content">
				<view style="font-size: 22px;font-weight: 400;font-family: cursive;">上班</view>
				<view style="font-size: 22px;font-weight: 400;font-family: cursive;">打卡</view>
				<view style="font-size: 22px;font-weight: 400;font-family: cursive;color: red;">{{ currentTime }}</view>
			</view>
		</view>
		<view v-if="status=='今天已上班打卡'"class="content" style="font-size: 22px;font-weight: 400;font-family: cursive;">你是第{{ ranking_work }}个完成打卡上班</view>
		<view class="checkin-container" @tap="checkin">
			<view class="content">
				<view style="font-size: 22px;font-weight: 400;font-family: cursive;">下班</view>
				<view style="font-size: 22px;font-weight: 400;font-family: cursive;">打卡</view>
				<view style="font-size: 22px;font-weight: 400;font-family: cursive; color: red;">{{ currentTime }}</view>
			</view>
		</view>
		<view v-if="status=='今天已下班打卡'" class="content" style="font-size: 22px;font-weight: 400;font-family: cursive;">你是第{{ ranking_off }}个完成打卡下班</view>
		<!-- <view style="font-size: 12px;">当前所在位置：广东省广州市天河区</view> -->
		<view class="checkin-schedule">
			<view style="font-size: 24px;font-weight: 800;font-family: cursive;">打卡范围：00:00 - 23:59</view>
			<view style="font-size: 24px;font-weight: 800;font-family: cursive; color: red;">请记得下班打卡</view<>
		</view>
		<!-- 		<view style="width: 40px;height: 40px;background-color: red;" @tap="getlocation">
          123
        </view> -->
	</view>
</template>

<script>
	import utils from '@/utils/utils.js';

	var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
	var	amapFile = require('../../lib/amap-wx.130.js');
	var qqmapsdk;
	var brand;
	export default {
		data() {
			return {
				canCheckin: true, // 判断是否可以考勤
				showCamera: true,
				showImage: false,
				status:'',
				currentTime:'',
				brand:'',
				ranking_work: '',
				ranking_off:'',
			};
		},
		onShow: function() {
			let that = this;
			that.updateClock()
			that.getDeviceInfo()
			// 判断当前时间是否可以考勤
			that.ajax(that.url.validCanCheckIn, 'GET', null, function(resp) {
				utils.logging('查看是否可以考勤', resp);
				let data = resp.data.data;
				that.status = data.status;
				that.ranking_work = data.rankingWork;
				that.ranking_off = data.rankingOff;
				console.log(that.status)

				if (data.status != '当前可以考勤' && data.status != '今天已上班打卡') {
					that.canCheckin = false;
					setTimeout(function() {
						uni.showToast({
							title: data.status,
							icon: 'none'
						});
					}, 500);
				} else {
					setTimeout(function() {
						uni.showToast({
							title: data.status
						});
					}, 500);
				}
			});
		},
		methods: {
			getDeviceInfo: function(){
				wx.getSystemInfo({
					success: function(res){
						brand = res.brand;
						console.log(brand)
					},
					fail:function(err){
						console.log(err)
					}
				})
			},
			// 时钟
			updateClock: function() {
				const that = this; // 保存页面引用以便后续使用

				// 更新时间并在页面上显示
				function update() {
					const now = new Date();
					const hours = now.getHours().toString().padStart(2, '0');
					const minutes = now.getMinutes().toString().padStart(2, '0');
					const seconds = now.getSeconds().toString().padStart(2, '0');

					const timeString = `${hours}:${minutes}:${seconds}`;

					that.currentTime = timeString

				}

				update(); // 立即显示时间

				// 每秒更新一次时间
				setInterval(() => {
					update();
				}, 1000);
			},
			
			checkin: function() {
				const that = this;
				

				if (that.status != "今天已下班打卡") {
					    uni.getLocation({
							type: 'gcj02', // 返回可以用于uni.openLocation的坐标
							isHighAccuracy: true,
							altitude:true,
							success: function (res) {
					        console.log('Latitude: ' + res.latitude + ', Longitude: ' + res.longitude);
					        // 可以将 res.longitude 和 res.latitude 用于地图展示等
							const myAmapFun = new amapFile.AMapWX({
								key: 'e72d98c1eb004028c9bef97abe5bbd82',
							});
							myAmapFun.getRegeo({
								location: `${res.longitude},${res.latitude}`,
								success(data){
									const geographicLocation = this.location;
									const address = data[0].regeocodeData.formatted_address;
									console.log('所在位置：',address)
									that.address = address;
									that.geographicLocation = geographicLocation;
									that.toCheckin(address);
								},
								fail(){
									console.log('逆地理编码失败');
								}
							})
					        /* wx.request({
					          url: 'https://restapi.amap.com/v3/geocode/regeo/',
					          method: 'GET',
					          data: {
					            // location: `${res.latitude},${res.longitude}`,
								location: '116.310003,39.991957',
					            // key: 'SFZBZ-YWM3Z-YYAXA-TWWBE-BZCNE-5ZBEO',
								key: 'e72d98c1eb004028c9bef97abe5bbd82',
					          },
					          success: (res) => {
					            console.log(res)
					            // that.toCheckin(res.data.result.address);
					          }
					        }) */
					      },
					      fail: function (error) {
					        console.error('Location acquisition failed: ' + JSON.stringify(error));
					      },
					      complete: function () {
					        console.log('getLocation operation is complete');
					      }
					    });
				}else {
					setTimeout(function() {
						uni.showToast({
							title: that.status,
							complete:setTimeout(function(){
								uni.navigateBack({
									url:'../index/index'
								});
							},500),
						});
					}, 500);
				}
			},

			// 签到具体方法
			toCheckin: function(address) {
				const that = this;
				let data = {}
				data.address = address
				data.brand = brand
				console.log(data)
				that.ajax(that.url.checkinNoFace, 'POST', data, function(resp) {
					let result = resp.data
					console.log(result)
					if (resp.statusCode === 200) {
						switch (result.code) {
							case (500): {
								uni.showToast({
									title: result.message,
									icon: 'none'
								});
							};
							break;
							case (200): {
								let res = result.data.identification
								if(res == 1){
									uni.showToast({
										title:'上班打卡成功',
										complete:()=>{
											uni.navigateBack({
												url:'../index/index'
											});
										}
									});
								}else{
									uni.showToast({
										title: '下班打卡成功',
										complete: () => {
											uni.navigateTo({
												// url: '../checkin_result/checkin_result'
												url: '../my_checkin/my_checkin'
											});
										}
									});
								}
							};
							break;
						}
					} else {
						uni.showToast({
							title: "系统错误！",
							icon: 'none'
						});
					}
				})
			}
		}
	};
</script>

<style lang="less">
	@import url('checkin_noface.less');
</style>