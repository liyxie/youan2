<template>
  <!-- 修改产品对话框 -->
  <el-dialog v-model="visible" title="修改产品" width="500px" @close="close" destroy-on-close>
    <el-form ref="productUpdateRef" :model="productUpdate" :rules="rules" label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="名称及规格：" prop="productName">
          <el-input v-model="productUpdate.productName" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="仓库：" prop="storeId">
          <el-select placeholder="请选择仓库" v-model="productUpdate.storeId" clearable>
            <el-option v-for="store of stores" :label="store.storeName" :value="store.storeId" :key="store.storeId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="单位：" prop="unitId">
          <el-select placeholder="请选择单位" v-model="productUpdate.unitId" clearable>
            <el-option v-for="unit of units" :label="unit.unitName" :value="unit.unitId" :key="unit.unitId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="销售单价：" prop="salePrice">
          <el-input v-model="productUpdate.salePrice"/>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateProduct">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { put, tip, WAREHOUSE_CONTEXT_PATH } from "@/common"

// 该页面的可见性
const visible = ref(false);
// 图片回显路径
const imageUrl = ref('');

// 添加文件时的回显
const handleAvatarChange = (uploadFile) => {
  const reader = new FileReader();
  // 从上传组件中获取数据
  const image = uploadFile.raw;
  reader.readAsDataURL(image);
  // 读取文件的回调函数
  reader.onload = () => {
      // 将转化的url赋值给文件
      imageUrl.value = reader.result;
      productUpdate.imgs = image.name;
  };
}

// 修改产品对象
const productUpdate = reactive({
  productName: '',
  storeId: '',
  productNum: '',
  unitId: '',
  salePrice: '',
});

// 表单验证规则
const rules = reactive({
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  storeId: [
    { required: true, message: '请选择仓库', trigger: 'blur' }
  ],
  unitId: [
    { required: true, message: '请选择单位', trigger: 'blur' }
  ],
  salePrice: [
    { required: true, message: '请输入产品单价', trigger: 'blur' }
  ],
})

// 关闭
const close = () => {
  visible.value = false;
}

// 所有仓库
const stores = ref();
// 所有单位
const units = ref();

// 该对话框打开，进行数据初始化
const open = (product, storeList, unitList) => {
  visible.value = true;

  for(let prop in product){
    productUpdate[prop] = product[prop];
  }
  
  console.log(productUpdate)
  
  stores.value = storeList.value;
  units.value = unitList.value;
};

const productUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 更新产品
const updateProduct = () => {
  productUpdateRef.value.validate(valid => {
    if(valid){
      put('/product/product-update', productUpdate).then(result => {
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

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>