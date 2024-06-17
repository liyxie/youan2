<template>
  <!-- 采购详情对话框 -->
  <el-dialog v-model="visible" title="采购详情" width="800px" @close="close">
    <el-form ref="contractAddForm" :model="purchaseDetail" :rules="rules" label-position="top">
      <el-form-item label="采购员：" prop="buyName" >
        <el-input v-model="purchaseDetail.buyName" autocomplete="off" disabled/>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="原材料：" style="width: 150px">
            <el-select v-model="purchaseDetail.materialId" clearable @change="handleSelectMaterial">
              <el-option v-for="material of purchaseList" :label="material.materialName" :value="material.materialId" :key="material.materialId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所选供应商：" style="width: 150px" >
            <el-input v-model="supplyNameByPurchase" autocomplete="off" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="供应商信息：">
            <el-table :data="supplyList" style="width: 100%">
              <el-table-column prop="supplyName" label="供应商名称" />
              <el-table-column prop="concat" label="联系人"  />
              <el-table-column prop="phone" label="电话" />
              <el-table-column prop="quotation" label="报价" />
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-col :span="12">
          <el-select v-model="selectedOption" placeholder="请选择默认选项" @change="handleSelectChange">
            <el-option label="采购通过" value="agree"></el-option>
            <el-option label="采购退回" value="reject"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input v-model="reason" autocomplete="off" v-if="showReason" placeholder="驳回理由"/>

        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH, get} from "@/common";
import { Plus } from '@element-plus/icons-vue'

const visible = ref(false); // 该页面的可见性

// 关闭
const close = () => {
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


const purchaseDetail = reactive({
  buyName:'',
  productName:'',
  materialId:'',
  buyId:'',
  contractId:''
});

const purchaseList = ref({})

// 该对话框打开
const open = (task) => {
  visible.value = true;
  let contractId = task
  get(`/purchase/purchase-in-list/${contractId}`).then(result => {
    console.log(result.data)
    purchaseDetail["buyName"] = result.data[0].buyName
    purchaseDetail["buyId"] = result.data[0].purchaseList[0].buyId
    purchaseDetail["contractId"] = contractId
    purchaseList.value = result.data[0].purchaseList
  });
};

const supplyNameByPurchase = ref();

// 改变材料时获取到该材料所有能提供的供应商信息以及采购员所选择的供应商信息
const handleSelectMaterial = () => {
  supplyNameByPurchase.value = purchaseList.value.find(item => item.materialId === purchaseDetail.materialId).supplyName
  getSupplyList(purchaseDetail.materialId)
}

// 获得所有供应商
const supplyList = ref();
const getSupplyList= (materialId) => {
  get(`/supply/supply-list/${materialId}`).then(result => {
    supplyList.value = result.data;
    console.log(supplyList)
  });
}

const contractAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);

// 审核状态
const selectedOption = ref("agree")
const reason = ref("") // 驳回理由
const showReason = ref(false)

const handleSelectChange = () => {
  if(selectedOption.value == "agree"){
    showReason.value = false
  }else{
    showReason.value = true
  }
}

// 提交审核
const submit = () => {
  let data = {}
  data.buyId = purchaseDetail.buyId
  data.contractId = purchaseDetail.contractId
  if(selectedOption.value == "agree"){
    post(`/purchase/purchase-agree`, data).then(result => {
      if(result.message === "完成任务"){
        emit('ok');
        tip.success(result.message)
        visible.value=false
      }else {
        tip.warning(result.message)
      }
    });
  }else{
    data.reason = reason.value
    console.log(data)
    post(`/purchase/purchase-reject`, data).then(result => {
      if(result.message === "执行成功"){
        emit('ok');
        tip.success(result.message)
        visible.value=false
      }else {
        tip.warning(result.message)
      }
    });

  }
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
  width: 90px;
  height: 52px;
  line-height: 20px;
  font-size: 14px;
  margin-left: 10px;
}
</style>