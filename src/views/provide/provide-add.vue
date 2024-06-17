<template>
  <!-- 添加对话框 -->
  <el-dialog v-model="visible" title="添加" width="800px" @close="close" destroy-on-close>
    <el-form ref="provideAddForm" :model="provideAdd" :rules="rules" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item label="材料名称：" prop="materialName">
            <el-input v-model="provideAdd.materialName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="报价：" prop="quotation">
            <el-input v-model="provideAdd.quotation" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="材料照片：" prop="imgs">
            <el-upload
                class="avatar-uploader"
                :action="WAREHOUSE_CONTEXT_PATH + '/inspect/img-upload'"
                :multiple="true"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload"
            >
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH, get} from "@/common";
import { Plus } from '@element-plus/icons-vue'

const visible = ref(false); // 该页面的可见性



// 添加用户对象
const provideAdd = reactive({
  materialName: '',
  quotation: '',
  inspectionResult:'',
  files:''
});

// 关闭
const close = () => {
  provideAdd.materialName = '';
  provideAdd.quotation = '';
  provideAdd.inspectionResult = '';
  provideAdd.files='';
  imageList.value = [];
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
const open = () => {
  visible.value = true;
};


const provideAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加用户提交
const add = () => {
  provideAddForm.value.validate(valid => {
    if (valid) {
      post('/inspect/inspect-add', provideAdd).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}

// 图片回显路径
const imageUrls = ref([]);
let imageList = ref([])
// 添加文件时的回显
const handleAvatarChange = (uploadFile) => {
  const reader = new FileReader();
  // 从上传组件中获取数据
  const image = uploadFile.raw;
  reader.readAsDataURL(image);
  // 读取文件的回调函数
  reader.onload = () => {
    // 将转化的url赋值给文件
    imageUrls.value.push(reader.result);
  };
  if(uploadFile.response != null){
    if (provideAdd.files == null || provideAdd.files == ""){
      provideAdd.files += uploadFile.response.message
    }else{
      provideAdd.files += "," + uploadFile.response.message
    }
  }
}

// 上传之前做简单验证
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpg'
      && rawFile.type !== 'image/jpeg'
      && rawFile.type !== 'image/png'
      && rawFile.type !== 'image/gif'
      && rawFile.type !== 'image/svg'
      && rawFile.type !== 'image/webp'
  ) {
    tip.error('只能上传图片格式!');
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    tip.error('上传文件不能大于5MB!');
    return false
  }
  return true;
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