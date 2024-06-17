<template>
<!--  &lt;!&ndash; 入库列表&ndash;&gt;-->
<!--  <el-card class="box-card " style="width: 98%;height: 30px;">-->
<!--  </el-card>-->

  <!-- 任务列表 -->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>当前任务</span>
        <el-button class="button" @click="openTaskList" text>查看任务列表</el-button>
      </div>
    </template>
    <!-- 表格 -->
    <el-table :data="flowPageList" style="width: 100%;" table-layout="auto" size="large" border stripe>
      <el-table-column prop="contractName" label="所属合同名称" sortable />
      <el-table-column prop="task" label="当前任务" sortable />
      <el-table-column prop="assignee" label="当前负责人" sortable />
      <el-table-column label="当前流程所有任务">
        <template #default="props">
          <el-link type="primary" @click.prevent="openTaskDetail(props.row)" style="margin-right: 8px">查看详情</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-card class="box-card inventory">
    <span>库存清单</span>

    <div v-for="item in materialList" style="margin-top: 10px">
      <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="item.percentage"
          :status="item.status"
      >
        <span style="color: #100C2A">{{ item.materialName }} : {{ item.materialNum }}</span>
      </el-progress>
    </div>
  </el-card>
  <el-drawer
      v-model="showTask"
      title="当前执行中的流程"
      direction="rtl"
      size="80%"
  >
    <task ref="taskListRef"></task>
  </el-drawer>
  
  <task-detail ref="taskDetailRef"></task-detail>

</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import {get, put, tip, export2excel, post} from "@/common";
import { useRoute } from 'vue-router'
import TaskDetail from "@/views/task/task-detail.vue";
import task from "@/views/task/index.vue"


const route = useRoute(); // 获取路由信息

const flowPageList = ref([]); // 当前进行中的任务列表

// 所有材料
const materialList = ref();
// 获取所有仓库
const getMaterialList= () => {
  get("/material/material-list").then(result => {
    materialList.value = result.data;
    for(let i in materialList.value){
      materialList.value[i].percentage = (materialList.value[i].materialNum/10000) * 100
      if (materialList.value[i].percentage>=50){
        materialList.value[i].status = "success"
      }else if(materialList.value[i].percentage>=20 && materialList.value[i].percentage<50){
        materialList.value[i].status = "warning"
      }else{
        materialList.value[i].status = "exception"
      }
    }
    materialList.value.sort((a, b) => a.percentage - b.percentage);
  });
}

const formatProgressText=(percentage) =>{
  if (percentage === 100) {
    return 'Full';
  } else {
    return `${percentage} %`; // 自定义文本显示格式
  }
}

// 初始化函数
onMounted(() =>{
  showTask.value = false

  get("/activiti/activiti-page-list", {}).then(result => {
    let data = result.data.filter(obj => {
      return Object.keys(obj).length > 0;
    });
    data.forEach(function (item){
      if(item.flag !== "已结束"){
        flowPageList.value.push(item)
      }
    })
  })

  getMaterialList();

  console.log(localStorage.getItem("userRole"))
})

// 任务列表可见性
const showTask = ref(true)

// 任务列表
const taskDetailRef = ref();
const openTaskDetail = (task) =>{
  taskDetailRef.value.open(task);
}
const taskListRef = ref();
const openTaskList = () =>{
  showTask.value = true
  taskListRef.value.open('1');
}


</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 890px;
  float: left;
  height: 550px;
}
.inventory{
  width: 280px;
  height: 550px;
  margin-left: 40px;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>