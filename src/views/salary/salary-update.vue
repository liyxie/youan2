<template>
  <el-dialog v-model="visible" title="修改" width="400px" @close="close" destroy-on-close>
    <el-form ref="salaryUpdateRef" :model="salaryUpdate" label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="计薪天数：" prop="monthDays">
          <el-input v-model="salaryUpdate.monthDays" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="实出勤天数：" prop="checkinDays">
          <el-input v-model="salaryUpdate.checkinDays" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="其他工资：" prop="otherSalary">
          <el-input v-model="salaryUpdate.otherSalary" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="加班工资：" prop="overtimeSalary">
          <el-input v-model="salaryUpdate.overtimeSalary" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="其他扣款：" prop="withhold">
          <el-input v-model="salaryUpdate.withhold" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="实发工资：" prop="netSalary">
          <el-input v-model="salaryUpdate.netSalary" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="salaryUpdate.remark" />
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateSalary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// 该页面的可见性
import {reactive, ref} from "vue";
import {get, post, tip} from "@/common";

const visible = ref(false);

const salaryUpdateRef = ref();

const value2 = ref('')

// 添加材料对象
const salaryUpdate = reactive({
  otherSalary: '',
  overtimeSalary: '',
  withhold: '',
  netSalary: '',
  remark:''
});

const emit = defineEmits(["ok"]);

const updateSalary = () => {
  console.log(salaryUpdate)
  post("/salary/salary-update", salaryUpdate).then(result => {
    emit('ok');
    tip.success(result.message);
    visible.value = false; // 关闭对话框
  });
} 


const open = (salary) => {
  visible.value = true;

  for(let prop in salary){
    salaryUpdate[prop] = salary[prop];
  }
};

defineExpose({ open });

</script>

<style scoped>

</style>