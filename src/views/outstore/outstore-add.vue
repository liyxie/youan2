<template>
  <!-- 添加出库单对话框 -->
  <el-dialog v-model="visible" title="添加出库单" width="400px" @close="close" destroy-on-close>
    <el-form ref="outstoreAddForm" :model="outstoreAdd" :rules="rules" label-position="top" label-width="120px">
      <el-form-item label="产品：" prop="storeId">
        <el-select placeholder="请选择产品" v-model="outstoreAdd.productId" clearable @change="changeProduct">
          <el-option v-for="product of productList" :label="product.productName" :value="product.productId" :key="product.productId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库：" prop="storeId">
        <el-select placeholder="请选择仓库" v-model="outstoreAdd.storeId" clearable>
          <el-option v-for="store of storeList" :label="store.storeName" :value="store.storeId" :key="store.storeId"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="所属合同：" prop="contractId">-->
<!--        <el-select placeholder="请选择合同" v-model="outstoreAdd.contractId" clearable @change="handleSelectContractChange">-->
<!--          <el-option v-for="contract of contractList" :label="contract.contractName" :value="contract.contractId" :key="contract.contractId"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="关联工区：" prop="workRegion">
        <el-input v-model="outstoreAdd.workRegion" disabled/>
      </el-form-item>
      <el-form-item label="合同生产数量：" prop="custom">
        <el-input v-model="outstoreAdd.productNum" disabled/>
        
      </el-form-item>
      <el-form-item label="客户：" prop="custom">
        <el-input v-model="outstoreAdd.custom" v-if="outstoreAdd.custom != null" disabled/>
        <el-input v-model="outstoreAdd.otherCustomer" v-if="outstoreAdd.custom == null" disabled/>
      </el-form-item>
      <el-form-item label="出库数量：" prop="outNum">
        <el-input v-model="outstoreAdd.outNum" />
      </el-form-item>
      <el-form-item label="车牌号：" prop="carNumber">
        <el-input v-model="outstoreAdd.carNumber" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addOutstore">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { post, tip, get } from "@/common"
import {useRoute} from "vue-router";

// 该页面的可见性
const visible = ref(false);

// 添加出库单对象
const outstoreAdd = ref({
  productId: '',
  storeId: '',
  storeName: '',
  productInvent: '',
  outNum: '',
  carNumber:'',
  contractId:'',
  contractName:'',
  workRegion:'',
  salePrice:'',
  custom: '',
  salePriceSum:'',
});

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/material/store-list").then(result => {
    storeList.value = result.data;
  });
}

// 获取所有产品
const productList = ref();
const getProductList = (id) => {
  let da = {}
  da.contractId = id
  get("/product/product-list-id",da).then(result => {
    productList.value = result.data;
  });
}

// 获取所有合同
const contractList = ref();
const getContractList= (id) => {
  let da = {}
  da.contractId = id
  get("/contract/contract-id",da).then(result => {
    console.log(result)
    outstoreAdd.value = result.data
  }); 
}

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
  outstoreAdd.outNum = '';
  outstoreAdd.salePrice = '';
  outstoreAdd.custom = '';
  outstoreAdd.carNumber='';

  visible.value = false;
}
 
const route = useRoute(); // 获取路由信息

// 该对话框打开，进行数据初始化
const open = (contractId) => {
  // if(route.query.contractId){
  //   outstoreAdd.contractId = route.query.contractId
  //   outstoreAdd.workRegion = contractList.value.find(item => item.contractId === outstoreAdd.contractId).workRegion
  // }
  visible.value = true;
  getStoreList();
  getProductList(contractId);
  getContractList(contractId)

};

const outstoreAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 出库单提交
const addOutstore = () => {
  outstoreAddForm.value.validate((valid) => {
    if(valid){
      console.log(outstoreAdd)
      post('/outstore/outstore-add', outstoreAdd.value).then(result => {
        emit('ok', outstoreAdd.value.storeId);  
        tip.success(result.message);
      });
      visible.value = false; // 关闭对话框
    }
  });
}

// 选择不同的合同对应不同的工区
const handleSelectContractChange = () =>{
  outstoreAdd.workRegion = contractList.value.find(item => item.contractId === outstoreAdd.contractId).workRegion
  outstoreAdd.productId = contractList.value.find(item => item.contractId === outstoreAdd.contractId).productId
  console.log(contractList.value)
}

const changeProduct = () => {
  let id = productList.value.find(item => item.productId === outstoreAdd.value.productId).id
  console.log(id)
  let da = {}
  da.id = id
  get("/contract/contract-eginner-productNum",da).then(res => {
    console.log(res.data[0].quantity)
    outstoreAdd.value.productNum = res.data[0].quantity
  })
}
defineExpose({ open });
</script>

<style>


</style>  