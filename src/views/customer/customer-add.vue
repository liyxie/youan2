<template>
  <!-- 添加仓库对话框 -->
  <el-dialog v-model="visible" title="添加供应商" width="400px" @close="close" destroy-on-close>
    <el-form ref="customerAddRef" :model="customerAdd" :rules="rules" label-position="top">
      <el-form-item label="名称：" prop="customerName">
        <el-input v-model="customerAdd.customerName" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="customerAdd.address" />
      </el-form-item>
      <el-form-item label="联系人：" prop="concat">
        <el-input v-model="customerAdd.concat" />
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="customerAdd.phone" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addSupply">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { get, post, tip, WAREHOUSE_CONTEXT_PATH } from "@/common"
import { Plus } from '@element-plus/icons-vue'

// 该页面的可见性
const visible = ref(false);

// 添加仓库对象
const customerAdd = reactive({
  customerName: '',
  address: '',
  concat: '',
  phone: '',
});

// 验证仓库编号的唯一性
const validateSupplyNum = async(rule, supplyNum, callback) => {
  if (supplyNum === '') return callback(new Error('请输入供应商编号！'));
  const res = await get(`/supply/supply-num-check?supplyNum=${supplyNum}`);
  if(!res.data) return callback(new Error('供应商编号已存在！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  supplyName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }
  ],
  supplyNum: [
    { validator: validateSupplyNum, trigger: 'blur' }
  ]
})

// 关闭
const close = () => {
  for(let prop in customerAdd){
    customerAdd[prop] = '';
  }
  
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = () => {
  visible.value = true;
};

const customerAddRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加材料提交
const addSupply = () => {
  customerAddRef.value.validate(valid => {
    if(valid){
      post('/customer/customer-add', customerAdd).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}

// 获得所有产品
const userList = ref();
const getUserList= () => {
  get("/user/user-all").then(result => {
    userList.value = result.data;
  });
}
getUserList();

defineExpose({ open });
</script>

<style scoped>

</style>