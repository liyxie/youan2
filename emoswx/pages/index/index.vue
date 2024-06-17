<template>
	<view class="page">
		<view class="nav-container">
			<view class="nav-row">
				<view class="nav" @tap="toPage('打卡签到','../checkin_noface/checkin_noface')">
					<image  src="../../static/nav-1.png" class="icon"></image>
					<text class="name">打卡</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components:{},
		data() {
			return {
			}
		},
		methods: {
			toPage:function(name,url){
				let that = this
				that.ajax(that.url.searchTodayCheckin,"GET",null,function(resp){
					console.log(resp)
					let result = resp.data.data.identification
					let flag=true
					if(result != 2){
						uni.navigateTo({
							url:url
						});
					}else{
						uni.showToast({
							title:'已完成今日打卡',
							icon:'error'
						})
					}
				})
				
			},
		}
	}
</script>

<style lang="less">
	@import url("index.less");
</style>
