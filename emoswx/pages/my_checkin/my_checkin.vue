<template>
  <view>
    <view class="calendar-container">
      <uni-calendar :insert="true" :lunar="false" :selected="list"
                    @monthSwitch="changeMonth" @confirm="changeMonth"></uni-calendar>
    </view>
  </view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';

export default {
  components: {
    uniCalendar,
  },
  data() {
    return {
      list: [],
      sum_1: 0,
      sum_2: 0,
      sum_3: 0,
      sum: 0,
    }
  },
  onShow: function () {
    let that = this
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    that.searchCheckin(that, year, month)
  },
  methods: {
    searchCheckin: function (ref, year, month) {
      let that = ref
      that.sum_1 = 0
      that.sum_2 = 0
      that.sum_3 = 0
      that.sum = 0
      that.list.length = 0

      // 查询本月考勤情况的方法
      that.ajax(that.url.searchMonthCheckin, "GET", {year: year, month: month}, function (resp) {
        console.log(resp)
        let result = resp.data.data
        for (let one of result.list) {
          if (one.status != null && one.status != "") {
            let color = ""
            if (one.status == "正常") {
              color = "green"
            } else if (one.status == "未下班") {
              color = "grey"
            } else if (one.status == "缺勤") {
              color = "red"
            }
            that.list.push({
              date: one.date,
			  info: one.status,
              color: color
            })
          }
        }
      })
    },
    changeMonth: function (e) {
      let that = this
      let year = e.year
      let month = e.month
      that.searchCheckin(that, year, month)
    }
  }
}
</script>

<style lang="less">
@import url('my_checkin.less');
</style>
