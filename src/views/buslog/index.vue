<template>
  <!-- <h2>合同列表</h2>
  <el-divider></el-divider> -->
  <div>
    <el-form inline class="searchForm">
      <el-form-item label="具体操作:">
        <el-input v-model="params.busDescrip" style="width: 120px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作人:">
        <el-input v-model="params.operPerson" style="width: 120px;" clearable></el-input>
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
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane v-for="item in tabNames" :label="item" :name="item" :key="item"></el-tab-pane>
  </el-tabs>
  
  <!-- 表格 -->
  <el-table :data="buslogList" ref="multipleTableRef"
            style="width: 100%; margin-top: 10px;" table-layout="auto" border stripe>
    <el-table-column label="序号" type="index" width="60"></el-table-column>
    <el-table-column prop="busName" label="业务名称" width="90"/>
    <el-table-column prop="busDescrip" label="业务具体操作" width="130"/>
    <el-table-column prop="operPerson" label="操作人"/>
    <el-table-column prop="operTime" label="操作时间"/>
  </el-table>
  <!-- 分页 -->
  <el-pagination
      background
      :total="params.totalNum"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      v-model:page-size="params.pageSize"
      v-model:currentPage="params.pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px;"
      @size-change="changeSize"
      @current-change="changeCurrent"
  />
  
</template>
<script setup>
import {reactive, ref} from "vue";
import {export2excel, get, WAREHOUSE_CONTEXT_PATH, post} from "@/common";

const params = reactive({
  busDescrip: '',
  busName: '',
  operPerson:'',
  realName: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

const activeName = ref('登录管理')
const tabNames = ref([])

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
const buslogList = ref();

// 获取查询结果
const getList = () => {
  get("/buslog/all-buslog-name", params).then(result => {
    console.log(result.data)
    tabNames.value = result.data
    params.busName = activeName.value
    get("/buslog/buslog-list", params).then(result => {
      console.log(result)
      buslogList.value = result.data.resultList;
      params.totalNum = result.data.totalNum;
    });
  });

}
getList();

function search(){
  getList();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const sureSalary = (salary) => {
  salary.status = '1'
  post("/salary/salary-update", salary).then(result => {
    getSalaryList()
  });
}


// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getList();
}

const handleClick = () => {
  getList();
}


</script>

