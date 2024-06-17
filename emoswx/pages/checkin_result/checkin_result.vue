<template>
  <view class="page">

    <!-- 个人信息部分 start -->
    <view class="summary-container">
      <view class="user-info">
        <view class="info">
          <text class="username">当前用户：{{ userName }}</text>
        </view>
      </view>
      <view class="date">签到时间：{{ checkinTime }}</view>
    </view>

    <!-- 个人信息部分 end -->

    <!-- 当天的签到信息部分 start -->
    <view class="result-container">
      <view class="left">
        <image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
        <image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
        <view class="line"></view>
      </view>
      <view class="right">
        <view class="row">
          <text class="start">上班（时间 {{ attendanceTime }}）</text>
        </view>
        <view class="row">
          <text class="checkin-result green other" v-if="status=='正常'">{{ status }}</text>
          <text class="checkin-result yellow other" v-if="status=='迟到'">{{ status }}</text>
        </view>
        <view class="row">
          <text class="end">下班（时间 {{ closingTime }}）</text>
        </view>
        <view class="row">
          <text class="checkin-result green other" v-if="status=='正常'">{{ status }}</text>
          <text class="checkin-result yellow other" v-if="status=='早退'">{{ status }}</text>
        </view>
      </view>
    </view>
    <!-- 当天的签到信息部分 end -->

  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "",  // 名字
      photo: "",  // 照片
      deptName: "",  // 部门名字
      address: "",
      status: "",
      risk: "",
      checkinTime: "",
      date: "",  // 签到日期
      attendanceTime: "",
      closingTime: "",
      checkinDays: 0,
      weekCheckin: [],
      userName: ""
    }
  },
  onShow: function () {
    let that = this
    that.ajax(that.url.searchTodayCheckin, "GET", null, function (resp) {
      console.log(resp)
      let result = resp.data.data
      that.userName = result.user_name
      that.attendanceTime = result.attendanceTime
      that.closingTime = result.closingTime
      // that.status = result.status
      that.checkinTime = result.checkinDateTime
      that.weekCheckin = result.weekCheckin
      that.checkinDays = result.checkinDays
    })
  },
  methods: {}
}
</script>

<style lang="less">
@import url("checkin_result.less");
</style>
