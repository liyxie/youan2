<template>
  <!-- <h2>合同列表</h2>
  <el-divider></el-divider> -->
  <div>
    <el-form inline class="searchForm">
      <el-form-item label="员工名:">
        <el-input v-model="params.userName" style="width: 120px;" clearable></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-date-picker
            v-model="params.date"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            size="large"
        />
      </el-form-item>
      <el-form-item style="margin-left: 30px;">
        <el-button type="primary" @click="search" style="margin-left: 10px;">
          <el-icon>
            <svg t="1646977561352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="3057" width="200" height="200">
              <path
                  d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704"
                  p-id="3058"></path>
            </svg>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 表格 -->
  <el-table :data="attendanceList" ref="multipleTableRef" @selection-change="handleSelectionChange"
            style="width: 100%; margin-top: 10px;" table-layout="auto" size="large" border stripe>
    <el-table-column prop="userId" label="员工编号"/>
    <el-table-column prop="realName" label="员工姓名"/>
    <el-table-column prop="attendanceDays" label="考勤天数"/>

    <el-table-column label="操作" fixed="right" width="240">
      <template #default="props">
        <el-link type="primary" @click.prevent="openAttendanceDetail(props.row)" style="margin-right: 8px">详情
        </el-link>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
      background
      :total="params.totalNum"
      :page-sizes="[5, 10, 15]"
      v-model:page-size="params.pageSize"
      v-model:currentPage="params.pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px;"
      @size-change="changeSize"
      @current-change="changeCurrent"
  />
  <!-- 考勤详细记录框 -->
  <attendance-detail ref="attendanceDetailRef" @ok="getAttendanceList"></attendance-detail>
</template>
<script setup>
import {reactive, ref} from "vue";
import {export2excel, get, WAREHOUSE_CONTEXT_PATH, post} from "@/common";

const params = reactive({
  attendanceName: '',
  attendanceDesc: '',
  attendanceState: '',
  associatedArea: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

const value2 = ref('')

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]


// 表格数据
const attendanceList = ref();

// 获取查询结果
const getAttendanceList = () => {
  // if(params.hasOwnProperty("date")){
  //   params.startDate = formatDate(params.date[0])
  //   params.endDate = formatDate(params.date[1])
  // }
  // console.log(params)
  get("/checkin/checkin-page-list", params).then(result => {
    console.log(result)
    attendanceList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getAttendanceList();

function search(){
  const data = Object.assign({}, params);

  console.log(data)
  if(data.hasOwnProperty("date")){
    data.startDate = formatDate(data.date[0])
    data.endDate = formatDate(data.date[1])
    delete data.date
  }
  get("/checkin/checkin-page-list", data).then(result => {
    console.log(result)
    attendanceList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getAttendanceList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getAttendanceList();
}


import AttendanceDetail from "@/views/Attendance/attendance-detail.vue";

const attendanceDetailRef = ref();
//
const openAttendanceDetail = (attendance) => {
  attendanceDetailRef.value.open(attendance);
}

</script>

