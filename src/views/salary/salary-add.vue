<template>
  <el-dialog v-model="visible" title="生成工资单" width="400px" @close="close" destroy-on-close>
    <el-form ref="salaryAddRef" :model="ratioAdd" label-position="right" label-width="100px">
      <el-date-picker
          v-model="value2"
          type="month"
          placeholder="选择月份"
      />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addSalary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// 该页面的可见性
import {reactive, ref} from "vue";
import {get, post, tip} from "@/common";

const visible = ref(false);

const salaryAddRef = ref();

const value2 = ref('')

// 添加材料对象
const ratioAdd = reactive({
  productName: '',
  productId: '',
  ratio: '',
  materialId: '',
});

const emit = defineEmits(["ok"]);


const addSalary = () => {
  let da = {}
  da.startDate = formatDate(value2.value)
  post("/salary/salary-add", da).then(result => {
    emit('ok');
    tip.success(result.message);
    visible.value = false; // 关闭对话框
  });
}


function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const open = () => {
  visible.value = true;
};

defineExpose({ open });

</script>

<style scoped>

</style>