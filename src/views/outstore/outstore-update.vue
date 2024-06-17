<template>
  <!-- 添加出库单对话框 -->
  <el-dialog v-model="visible" title="添加出库单" width="400px" @close="close" destroy-on-close>
    <el-form ref="outstoreAddForm" :model="outstoreUpdate" :rules="rules" label-position="top" label-width="120px">
      <el-form-item label="产品：" prop="storeId">
        <el-select placeholder="请选择产品" v-model="outstoreUpdate.productId" clearable>
          <el-option v-for="product of productList" :label="product.productName" :value="product.productId" :key="product.productId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库：" prop="storeId">
        <el-select placeholder="请选择仓库" v-model="outstoreUpdate.storeId" clearable>
          <el-option v-for="store of storeList" :label="store.storeName" :value="store.storeId" :key="store.storeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属合同：" prop="storeId">
        <el-select placeholder="请选择合同" v-model="outstoreUpdate.contractId" clearable @change="handleSelectContractChange">
          <el-option v-for="contract of contractList" :label="contract.contractName" :value="contract.contractId" :key="contract.contractId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联工区：" prop="workRegion">
        <el-input v-model="outstoreUpdate.workRegion" />
      </el-form-item>
      <el-form-item label="客户：" prop="custom">
        <el-input v-model="outstoreUpdate.custom" />
      </el-form-item>
      <el-form-item label="出库数量：" prop="outNum">
        <el-input v-model="outstoreUpdate.outNum" />
      </el-form-item>
      <el-form-item label="车牌号：" prop="carNumber">
        <el-input v-model="outstoreUpdate.carNumber" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateOutstore">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { post, tip, get } from "@/common"

// 该页面的可见性
const visible = ref(false);

// 添加出库单对象
const outstoreUpdate = reactive({
  productId: '',
  storeId: '',
  storeName: '',
  productInvent: '',
  outNum: '',
  carNumber:'',
  contractId:'',
  workRegion:'',
  salePrice:'',
  custom: '',
  salePriceSum:''
});

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/material/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

// 获取所有产品
const productList = ref();
const getProductList = () => {
  get("/product/product-list").then(result => {
    productList.value = result.data;
  });
}
getProductList();

// 获取所有合同
const contractList = ref();
const getContractList= () => {
  get("/contract/contract-all").then(result => {
    contractList.value = result.data;
  });
}
getContractList();

// 出库数量不能大于库存
const validateOutNum = (rule, outNum, callback) => {
  if (outNum === '') return callback(new Error('请输入出库数量！'));
  // 库存
  // const productInvent = parseInt(outstoreAdd.productInvent);
  if(parseInt(outNum)<=0) return callback(new Error('出库数量必须大于0！'));
  // if(parseInt(outNum)>productInvent) return callback(new Error('出库数量不能大于库存！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  outNum: [
    { validator: validateOutNum, trigger: 'blur' }
  ]
})

// 关闭
const close = () => {
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (outstore) => {
  visible.value = true;
  for(let prop in outstore){
    outstoreUpdate[prop] = outstore[prop];
  }
  console.log(outstore)
};

const outstoreAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 出库单提交
const updateOutstore = () => {
  outstoreAddForm.value.validate((valid) => {
    if(valid){
      console.log(outstoreUpdate)
      post('/outstore/outstore-update', outstoreUpdate).then(result => {
        emit('ok');
        tip.success(result.message);
      });
      visible.value = false; // 关闭对话框
    }
  });
}

// 选择不同的合同对应不同的工区
const handleSelectContractChange = () =>{
  outstoreAdd.workRegion = contractList.value.find(item => item.contractId === outstoreAdd.contractId).workRegion
  console.log(contractList.value)
}

defineExpose({ open });
</script>

<style>


</style>