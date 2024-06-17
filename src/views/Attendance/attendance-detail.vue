<template>
  <!-- 查看员工考勤详细信息框 -->
  <el-dialog v-model="visible" title="当前员工考勤信息" width="80%">
    <el-form ref="attendanceDetilRef" :model="attendanceDetil" :rules="rules" label-position="top">
      <el-form-item label="员工姓名：" prop="realName">
        <el-input v-model="attendanceDetil.realName" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="考勤总天数：" prop="attendanceDays">
        <el-input v-model="attendanceDetil.attendanceDays" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="缺勤天数：" prop="absenceDays">
        <el-input v-model="attendanceDetil.absenceDays" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item>
        <el-calendar style="--el-calendar-cell-width: 100%">
          <template #dateCell="{ data }">
            <span :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(2).join('-') }}
            </span>
            <br/>
            <span v-for="item in currentDate.filter(item => item.date === data.day)">{{ item.status }}<br/>
            <el-tag v-if="item.status !== '缺勤' & item.status !== '节假日' & item.status !== ''"
                    type="info">上班：{{ item.workTime }}</el-tag><br/>
              <el-tag v-if="item.status !== '缺勤' & item.status !== '节假日' & item.status !== ''"
              >地址：{{ item.workAddr }}</el-tag><br/>
            <el-tag v-if="item.status !== '缺勤' & item.status !== '节假日' & item.status !== ''"
                    type="danger">下班：{{ item.offTime }}</el-tag><br/>
              <el-tag v-if="item.status !== '缺勤' & item.status !== '节假日' & item.status !== ''"
              >地址：{{ item.offAddr }}</el-tag><br/>
            <el-tag v-if="item.status !== '缺勤' & item.status !== '节假日' & item.status !== ''"
                    type="warning">设备：{{ item.brand }}</el-tag><br/>
            </span>
          </template>
        </el-calendar>
      </el-form-item>
      <el-form-item label="今月缺勤日期：" prop="absenceMonthDays">
        <el-input v-model="attendanceDetil.absenceMonthDays" autocomplete="off" type="textarea"
                  disabled
                  :rows="3"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" @click="updateContract">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {get} from "@/common";

const visible = ref(false); // 该页面的可见性
// 查看考勤对象
const attendanceDetil = reactive({
  userId: 0,
  userName: '',
  attendanceDays: '',
  absenceDays: 0,
  absenceMonthDays: '',

});

const currentDate = ref([])
// 该对话框打开并初始化
const open = (attendance) => {
  attendanceDetil.absenceDays = 0
  for (let prop in attendance) {
    console.log(attendance[prop])
    attendanceDetil[prop] = attendance[prop];
  }
  let data = {"userId": attendance.userId}
  get("/checkin/check-date", data).then(result => {
    let dateList = ""
    currentDate.value = result.data
    console.log(result.data)
    for (let p in result.data) {
      if (result.data[p].status == "缺勤") {
        console.log(result.data[p].date)
        dateList += result.data[p].date + "，"
        attendanceDetil.absenceDays += 1
      }
    }
    console.log(dateList.slice(0, -1))
    attendanceDetil["absenceMonthDays"] = dateList.slice(0, -1)
  });

  visible.value = true;
};

const attendanceDetilRef = ref();

defineExpose({open});

function formatDate(dateStr) {
  if (dateStr !== '') {
    const date = new Date(dateStr);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${hour}:${minute}:${second}`;
  }
  return '';
}
</script>
<style scoped>

.is-selected {
  color: #1989fa;
}


</style>