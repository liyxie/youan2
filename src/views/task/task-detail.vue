<template>
  <el-dialog v-model="visible" title="所有流程任务" width="25%">
    <el-timeline>
      <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :color="activity.color"
          :timestamp="activity.assignee"
      >
        {{ activity.taskName }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script setup>
import {ref} from "vue";
import { MoreFilled } from '@element-plus/icons-vue';

let activities = ref([]);


const visible = ref(false); // 该页面的可见性

const open = (task) => {
  activities.value = []
  visible.value = true;
  for(let i=0;i<task.allTask.length;i++){
    activities.value.push(task.allTask[i])
    if(activities.value[i].taskName === task.task){
      activities.value[i].color = "blue"
    }
  }
};

defineExpose({ open });

</script>

<style scoped>

</style>