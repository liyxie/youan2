<template>
  <!-- 添加采购单对话框 -->
  <el-dialog v-model="visible" title="添加采购单" width="600px" @close="close" destroy-on-close>
    <el-form ref="purchaseAddForm" :model="purchaseAdd" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="材料：" prop="materialName">
        <span>{{ purchaseAdd.materialName }}</span>
      </el-form-item>
      <el-form-item label="仓库：" prop="storeName">
        <span>{{ purchaseAdd.storeName }}</span>
      </el-form-item>
      <el-form-item label="合同所需量：" prop="needNum">
        <el-input v-model="needNum" disabled/>
      </el-form-item>
      <el-form-item label="预计采购量：" prop="buyNum">
        <el-input v-model="purchaseAdd.buyNum" />
      </el-form-item>
      <el-form-item label="采购人：" prop="buyUser">
        <el-input v-model="purchaseAdd.buyUser" />
      </el-form-item>
      <el-form-item label="采购人电话：" prop="phone">
        <el-input v-model="purchaseAdd.phone" />
      </el-form-item>
      <el-form-item label="供应商：">
        <el-select v-model="purchaseAdd.supplyId" clearable @change="handleSelectSupplyChange">
          <el-option v-for="supply of supplyList" :label="supply.supplyName" :value="supply.supplyId" :key="supply.supplyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人：" prop="storeName">
        <span>{{ supplyConcat }}</span>
      </el-form-item> 
      <el-form-item label="联系方式：" prop="storeName">
        <span>{{ supplyPhone }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addPurchase">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { post, tip, get } from "@/common"

// 该页面的可见性
const visible = ref(false);

// 添加采购单对象
const purchaseAdd = reactive({
  materialId: '',
  materialName: '',
  storeId: '',
  storeName: '',
  supplyId: '',
  supplyName: '',
  buyNum: '',
  buyUser: '',
  phone: ''
});

// 验证采购人电话格式，必须为11位纯数字
const validatePhone = (rule, phone, callback) => {
  if (phone === '') return callback(new Error('请输入采购人电话！'));
  if(!/^\d{11}$/.test(phone)) return callback(new Error('电话号码必须为11位的数字！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  buyNum: [
    { required: true, message: '请输入采购数量', trigger: 'blur' },
    { min: 1, max: 7, message: '采购数量不能多于7位数', trigger: 'blur' }
  ],
  buyUser: [
    { required: true, message: '请输入采购人', trigger: 'blur' }
  ],
   // phone: [
   //  { validator: validatePhone, trigger: 'blur' }
  // ]
})

// 关闭
const close = () => {
  for(let prop in purchaseAdd){
    purchaseAdd[prop] = '';
  }
  supplyConcat.value = ''
  supplyPhone.value = ''
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (commodity, contractId) => {
  visible.value = true;
  for(let prop in commodity){
    purchaseAdd[prop] = commodity[prop];
  }
  console.log(purchaseAdd.needNum)
  purchaseAdd['contractId']=contractId
  getSupplyList(purchaseAdd.materialId)
  if(purchaseAdd.needNum == null){
    getNeedMaterialNum(purchaseAdd.materialId, purchaseAdd.contractId)
  }else{
    needNum.value = purchaseAdd.needNum;
  }
};

const purchaseAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加采购单提交
const addPurchase = () => {
  purchaseAddForm.value.validate((valid) => {
    if(valid){
      console.log(purchaseAdd)
      post('/purchase/purchase-add', purchaseAdd).then(result => {
        // emit('ok', purchaseAdd.storeId);
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}


// 获得所有供应商信息
const supplyList = ref();
const getSupplyList= (materialId) => {
  get(`/supply/supply-list/${materialId}`).then(result => {
    supplyList.value = result.data;
  });
}

// 获取该合同需要该材料的数量
const needNum = ref();
const getNeedMaterialNum= (materialId, contractId) => {
  let data={}
  data.materialId = materialId
  data.contractId = contractId
    get(`/contract/material-num`, data).then(result => {
      if (result.data.materialNum != null){
        needNum.value = result.data.materialNum;
      }
  });
}

defineExpose({ open });

// 供应商的联系人和手机号
const supplyConcat = ref()
const supplyPhone = ref()
// 选择不同供应商时显示该供应商的信息
const handleSelectSupplyChange = () => {
  supplyConcat.value = supplyList.value.find(item => item.supplyId === purchaseAdd.supplyId).concat
  supplyPhone.value = supplyList.value.find(item => item.supplyId === purchaseAdd.supplyId).phone
}
</script>

<style>


</style>