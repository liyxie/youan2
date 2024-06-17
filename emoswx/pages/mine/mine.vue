<template>
	<view class="page">
		<!-- 个人信息部分 start -->
		<view class="user-info">
			<view class="summary">
				<view>
					<text class="title">用户名称</text>
					<text class="value">{{realName}}</text>
				</view>
			</view>
		</view>
		<!-- 个人信息部分 end -->
		
		<!-- 用户信息栏目 start -->
		<uni-list>
			<uni-list-item title="我的考勤" link to="/pages/my_checkin/my_checkin"></uni-list-item>
		</uni-list>
		<!-- 用户信息栏目 end -->
		
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import utils from '@/utils/utils.js';
	export default {
		components:{
			uniList,
			uniListItem
		},
		data() {
			return {
				userId:"",
				realName:"",
				photo:""
			}
		},
		onShow:function(){
			console.log("123")
			let that=this
			// 查询用户的概要信息
			that.ajax(that.url.searchUserSummary,"GET",null,function(resp){
				let result =resp.data.data
				that.userId=result.userId
				that.realName=result.realName
				utils.logging('用户的概要信息为：',result)
			})
		},
		methods: {
			// 检查权限判断是否显示对应的菜单
			checkPermission:function(need_permission){
				var user_permission = uni.getStorageSync("permission")
				return utils.checkPermission(user_permission,need_permission)
			}
		}
	}
</script>

<style lang="less">
	@import url("mine.less");
</style>
