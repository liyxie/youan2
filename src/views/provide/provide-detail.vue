<template>
  <!-- 修改用户对话框 -->
  <el-dialog v-model="visible" title="合同详情" width="25%">
    <el-form :model="provideDetail" label-position="top">
      <el-form-item label="合同照片：">
        <div class="demo-image__preview">
          <el-image
              style="width: 100px; height: 100px"
              :src="imageList[0]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="imageList"
              :initial-index="4"
              fit="cover"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="close">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {get, put, tip, WAREHOUSE_CONTEXT_PATH} from "@/common";

// 该页面的可见性
const visible = ref(false);
// 合同详情
const provideDetail = reactive({});


// 图片回显路径
const imageUrl = ref('');

// 表格列表
const ratioDetails= ref({materialId:'',materialName:''});

// 图片列表
const imageList = ref([])

// 该对话框打开并初始化
const open = (provide) => {
  console.log(provide)
  for(let prop in provide){
    provideDetail[prop] = provide[prop];
  }
  visible.value = true;
  
  imageList.value = []
  let resultList = []
  resultList = provideDetail.files.split(",");

  resultList.forEach(function(item) {
    imageList.value.push(WAREHOUSE_CONTEXT_PATH + '/inspect/inline-image/' + item)
  });
};

// 关闭
const close = () =>{
  visible.value = false
  imageList.value = []
}
defineExpose({ open });
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
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>