<template>
  <!-- 修改用户对话框 -->
  <el-dialog v-model="visible" title="修改用户信息" width="25%">
    <el-form ref="instoreUpdateRef" :model="instoreUpdate" label-position="top">
      <el-form-item label="对方数量：" prop="relativeNum">
        <el-input v-model="instoreUpdate.relativeNum"/>
      </el-form-item>
      <el-form-item label="运费单价：" prop="freight">
        <el-input v-model="instoreUpdate.freight" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="车牌号：" prop="carNumber">
        <el-input v-model="instoreUpdate.carNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input v-model="instoreUpdate.remarks" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInstore">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { put, tip, WAREHOUSE_CONTEXT_PATH } from "@/common";
import { Plus } from '@element-plus/icons-vue'

const visible = ref(false); // 该页面的可见性
// 修改合同对象
const instoreUpdate = reactive({
  relativeNum:'',
  freight:'', // 运费单价
  carNumber:'',
  remarks:'',
  insId:''
});


// 图片回显路径
const imageUrl = ref('');

// 该对话框打开并初始化
const open = (instore) => {
  console.log(instore)
  instoreUpdate.insId = instore.insId
  instoreUpdate.relativeNum = instore.relativeNum
  instoreUpdate.freight = instore.freight
  instoreUpdate.remarks = instore.remarks
  instoreUpdate.carNumber = instore.carNumber

  visible.value = true;
};

const instoreUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 修改用户提交
const updateInstore = () => {
  instoreUpdateRef.value.validate(valid => {
    if(valid){
      console.log(instoreUpdate)
      put('/instore/instore-update', instoreUpdate).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}

defineExpose({ open });
</script>
<style scoped>
.avatar-uploader, .avatar-uploader .avatar{
  width: 100px;
  height: 100px;
  display: block;
}
</style>