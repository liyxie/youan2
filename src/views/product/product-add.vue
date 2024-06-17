<template>
  <!-- 添加产品对话框 -->
  <el-dialog v-model="visible" title="添加材料" width="400px" @close="close" destroy-on-close>
    <el-form ref="productAddRef" :model="productAdd" :rules="rules" label-position="right" label-width="100px">
      <el-row>
          <el-form-item label="名称及规格：" prop="productName">
            <el-input v-model="productAdd.productName" />
          </el-form-item>
      </el-row>
      <el-row>
          <el-form-item label="仓库：" prop="storeId">
            <el-select placeholder="请选择仓库" v-model="productAdd.storeId" clearable>
              <el-option v-for="store of stores" :label="store.storeName" :value="store.storeId" :key="store.storeId"></el-option>
            </el-select>
          </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="单位：" prop="unitId">
          <el-select placeholder="请选择单位" v-model="productAdd.unitId" clearable>
            <el-option v-for="unit of units" :label="unit.unitName" :value="unit.unitId" :key="unit.unitId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="销售单价：" prop="salePrice">
          <el-input v-model="productAdd.salePrice"/>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addProduct">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { post, tip, WAREHOUSE_CONTEXT_PATH } from "@/common"
import { Plus } from '@element-plus/icons-vue'

// 该页面的可见性
const visible = ref(false);
// 图片回显路径
const imageUrl = ref('');


// 添加产品对象
const productAdd = reactive({
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
  for(let prop in productAdd){
    productAdd[prop] = '';
  }
  
  visible.value = false;
}

// 所有仓库
const stores = ref();
// 所有单位
const units = ref();

// 该对话框打开，进行数据初始化
const open = (storeList, unitList) => {
  visible.value = true;
  stores.value = storeList.value;
  units.value = unitList.value;
};

const productAddRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加产品
const addProduct = () => {
  productAddRef.value.validate(valid => {
    if(valid){
      post('/product/product-add', productAdd).then(result => {
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