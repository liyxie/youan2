<template>
  <el-dialog v-model="visible" title="供应商介绍" width="25%">
    {{ detail }}
  </el-dialog>
</template>

<script setup>
import {ref} from "vue";
import { MoreFilled } from '@element-plus/icons-vue';

let detail = ref([]);


const visible = ref(false); // 该页面的可见性

const open = (supply) => {
  console.log(supply)
  visible.value = true;

  detail.value = supply.supplyIntroduce

};

const supplyDetailRef = ref();

defineExpose({ open });

</script>

<style scoped>

</style>