<template>
  <!-- 修改产品对话框 -->
  <el-dialog v-model="visible" title="修改产品" width="500px" @close="close" destroy-on-close>
    <el-form ref="ratioUpdateRef" :model="ratioUpdate" :rules="rules" label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="产品：" prop="productId">
          <el-select placeholder="请选择产品" v-model="ratioUpdate.productId" clearable>
            <el-option v-for="product of products" :label="product.productName" :value="product.productId" :key="product.productId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="材料：" prop="productId">
          <el-select placeholder="请选择材料" v-model="ratioUpdate.materialId" clearable>
            <el-option v-for="material of materials" :label="material.materialName" :value="material.materialId" :key="material.materialId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="占比：" prop="ratio">
          <el-input v-model="ratioUpdate.ratio" />
        </el-form-item>
      </el-row>
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
import { ref, reactive } from 'vue'
import { put, tip, WAREHOUSE_CONTEXT_PATH } from "@/common"

// 该页面的可见性
const visible = ref(false);
// 图片回显路径
const imageUrl = ref('');

// 修改材料对象
const ratioUpdate = reactive({
  productName: '',
  productId: '',
  ratio: '',
  materialId: '',
});

// 表单验证规则
const rules = reactive({
  productName: [
    { required: true, message: '请输入材料名称', trigger: 'blur' }
  ],
  storeId: [
    { required: true, message: '请选择仓库', trigger: 'blur' }
  ],
  productNum: [
    { required: true, message: '请输入材料编号', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请选择单位', trigger: 'blur' }
  ],
  salePrice: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
})

// 关闭
const close = () => {
  visible.value = false;
}

// 所有仓库
const products = ref();
// 所有单位
const materials = ref();

// 树形结构数据对应实体类属性
const defaultProps = {
  children: 'childGoodsCategory',
  label: 'typeName',
}

// 该对话框打开，进行数据初始化
const open = (ratio, productList, materialList) => {
  visible.value = true;

  for(let prop in ratio){
    ratioUpdate[prop] = ratio[prop];
  }
  
  products.value = productList.value;
  materials.value = materialList.value;
};

const ratioUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加材料提交
const update = () => {
  ratioUpdateRef.value.validate(valid => {
    if(valid){
      console.log(ratioUpdate)
      put('/product-material/update', ratioUpdate).then(result => {
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