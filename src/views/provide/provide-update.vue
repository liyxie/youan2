
<template>
  <!-- 添加对话框 -->
  <el-dialog v-model="visible" title="添加" width="300px" @close="close" destroy-on-close>
    <el-form ref="provideUpdateForm" :model="provideUpdate" :rules="rules" label-position="top">
      <el-form-item label="材料名称：" prop="materialName">
        <el-input v-model="provideUpdate.materialName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="报价：" prop="quotation">
        <el-input v-model="provideUpdate.quotation" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="update">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH, get, put} from "@/common";
import { Plus } from '@element-plus/icons-vue'

const visible = ref(false); // 该页面的可见性



// 添加用户对象
const provideUpdate = reactive({
  materialName: '',
  quotation: '',
  inspectionResult:'',
  files:''
});

// 关闭
const close = () => {
  provideUpdate.materialName = '';
  provideUpdate.quotation = '';
  provideUpdate.inspectionResult = '';
  provideUpdate.files='';
  visible.value = false;
}

const rules = reactive({
  contractName: [
    {required: true, message: '请输入合同名', trigger: 'blur'}
  ],
  contractDesc: [
    {required: true, message: '请输入合同描述', trigger: 'blur'},
  ],
  contractState: [
    {required: true, message: '请选择合同状态', trigger: 'blur'},
  ]
})

// 该对话框打开
const open = (provide) => {
  for(let prop in provide){
    provideUpdate[prop] = provide[prop];
  }
  console.log(provideUpdate)
  visible.value = true;
};


const provideUpdateForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加用户提交
const update = () => {
  provideUpdateForm.value.validate(valid => {
    if (valid) {
      put('/inspect/inspect-update', provideUpdate).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}

defineExpose({open});
</script>
<style scoped>
.avatar-uploader, .avatar-uploader .avatar{
  width: 100px;
  height: 100px;
  display: block;
}

.mx-1 {
  width: 88px;
  height: 45px;
  line-height: 20px;
  font-size: 12px;
  margin-top: 10px;
  margin-left: 10px;
}
.avatar{
  float: left;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 95px;
  text-align: center;
}
</style>