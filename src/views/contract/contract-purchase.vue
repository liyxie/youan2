<template>
  <div>
    <el-form ref="contractAddForm" :model="contractAdd" :rules="rules" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同名：" prop="contractName">
            <el-input v-model="contractAdd.contractName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="关联工区：" prop="workRegion">
            <el-input v-model="contractAdd.workRegion" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="合同客户：">
            <el-select v-model="contractAdd.customerId" style="width: 80%;" clearable @change="handleSelectChangeCustomer">
              <el-option v-for="customer of customerList" :label="customer.customerName" :value="customer.customerId" :key="customer.customerId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="其他客户：" v-if="showOtherCustomer">
            <el-input v-model="contractAdd.otherCustomer" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="合同工期">
            <el-date-picker
                v-model="contractAdd.date"
                type="daterange"
                unlink-panels
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
            />
          </el-form-item>
          <el-form-item label="合同附件：" prop="imgs">
            <el-upload
                class="avatar-uploader"
                :action="WAREHOUSE_CONTEXT_PATH + '/contract/img-upload'"
                :multiple="true"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload"
            >
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="10" style="margin-left: 30px">
          <el-form-item label="原材料：">
            <el-select v-model="contractAdd.materialId" style="width: 120px;" clearable @change="handleSelectMaterial">
              <el-option v-for="material of materialList" :label="material.materialName" :value="material.materialId" :key="material.materialId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位：">
            <el-input v-model="unit" autocomplete="off" disabled/>
          </el-form-item>
          <el-form-item label="仓库数量：">
            <el-input v-model="materialNum" autocomplete="off" disabled/>
          </el-form-item>
          <el-form-item label="采购数量：">
            <el-input v-model="needNum" autocomplete="off" @input="handleInput"/>
          </el-form-item>
          <el-form-item label="采购数量：">
<!--            <el-input v-model="needNum" autocomplete="off"/>-->
            <el-tag
                v-for="tag in showNeedMaterialNumList"
                :key="tag.name"
                class="mx-1"
                closable
                @close="handleClose(tag)"
            >
             {{tag.name}} {{ tag.num }}
            </el-tag>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addContract">确认</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH, get} from "@/common";
import { Plus } from '@element-plus/icons-vue'
import {List} from "echarts";

// 接收父组件传递的 prop
const props = defineProps({
  ifPurchase: String,
  customer: List,
  products: List
});


const visible = ref(false); // 该页面的可见性

// 添加用户对象
const contractAdd = reactive({
  contractName: '',
  contractDesc: '',
  contractState: '',
  workRegion: '',
  customerId:'',
  otherCustomer: '',
  productId:'',
  materialId: '',
  productNum: '',
  ifPurchase:'',
  files:''
});

const contractRadio = ref('1')

// 关闭
const close = () => {
  contractAdd.contractName = '';
  contractAdd.contractDesc = '';
  contractAdd.contractState = '';
  contractAdd.workRegion = '';
  contractAdd.productNum = '';
  contractAdd.customerId = '';
  contractAdd.otherCustomer='';
  visible.value = false;
  showRatio.value = false;
  contractAdd.productId = "";
  imageList.value = [];
}

const rules = reactive({
  // contractName: [
  //   {required: true, message: '请输入合同名', trigger: 'blur'}
  // ],
  // contractDesc: [
  //   {required: true, message: '请输入合同描述', trigger: 'blur'},
  // ],
  // contractState: [
  //   {required: true, message: '请选择合同状态', trigger: 'blur'},
  // ]
})

// 该对话框打开
const open = () => {
  visible.value = true;
};

const showMaterial = ref(true)

const contractAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加用户提交
const addContract = () => {
  contractAddForm.value.validate(valid => {
    if (valid) {
      // contractAdd.materialId = ""
      // contractAdd.materialNum = ""
      // console.log(showNeedMaterialNumList.value[0])
      // for (let i=0;i<showNeedMaterialNumList.value.length;i++){
      //   if(i==0){
      //     contractAdd.materialId += showNeedMaterialNumList.value[i].ids
      //     contractAdd.materialNum += showNeedMaterialNumList.value[i].num
      //   }else{
      //     contractAdd.materialId += ','+ showNeedMaterialNumList.value[i].ids
      //     contractAdd.materialNum += ','+ showNeedMaterialNumList.value[i].num
      //   }
      // }
      contractAdd.materials = JSON.stringify(showNeedMaterialNumList.value)
      contractAdd.startTime = formatDate(contractAdd.date[0])
      contractAdd.endTime = formatDate(contractAdd.date[1])
      contractAdd.ifPurchase = "2"
      delete contractAdd.date
      post('/activiti/start-instance', contractAdd).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
} 

// 日期格式化函数
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// 获得所有产品
const productList = ref();
const getProductList= () => {
  productList.value = props.products
}
getProductList();

// 填写其他客户的可见性
const showOtherCustomer = ref(false)
// 获得所有客户
const customerList = ref();
const getCustomerList= () => {
  customerList.value = props.customer
}
getCustomerList();
// 客户选择发生变化
const handleSelectChangeCustomer = () => {
  showOtherCustomer.value = false
  if(contractAdd.customerId==-1){
    showOtherCustomer.value = true
  }
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
    if (contractAdd.files == null || contractAdd.files == ""){
      contractAdd.files += uploadFile.response.message
    }else{
      contractAdd.files += "," + uploadFile.response.message
    }
  }
}

// 上传之前做简单验证
const beforeAvatarUpload = (rawFile) => {
  // if (rawFile.type !== 'image/jpg'
  //     && rawFile.type !== 'image/jpeg'
  //     && rawFile.type !== 'image/png'
  //     && rawFile.type !== 'image/gif'
  //     && rawFile.type !== 'image/svg'
  //     && rawFile.type !== 'image/webp'
  // ) {
  //   tip.error('只能上传图片格式!');
  //   return false
  // } else if (rawFile.size / 1024 / 1024 > 5) {
  //   tip.error('上传文件不能大于5MB!');
  //   return false
  // }
  return true;
}

// 查询所有原材料列表
const materialList= ref({materialId:'',materialName:''});
const getMaterialList = () => {
  get(`/material/material-list`).then(result => {
    materialList.value = result.data;
  });
}
getMaterialList()
// 改变材料时，算出生产所需要的材料用量以及仓库剩余的材料数量
const needNum = ref(0);
const materialNum = ref();
const unit = ref();
const showNeedMaterialNumList = ref([])
const handleSelectMaterial = () => {
  needNum.value = 0
  materialNum.value = materialList.value.find(item => item.materialId === contractAdd.materialId).materialNum
  unit.value = materialList.value.find(item => item.materialId === contractAdd.materialId).unitName
  let materialName = materialList.value.find(item => item.materialId === contractAdd.materialId).materialName
  let needs = {}
  needs.id = contractAdd.materialId
  needs.name = materialName
  needs.num = needNum.value
  showNeedMaterialNumList.value.push(needs)
}

function handleInput(newValue) {
  const element = showNeedMaterialNumList.value.find(item => item.id === contractAdd.materialId);
  if (element){
    element.num = parseFloat(newValue)
  }
}

const handleClose = (tag) => {
  showNeedMaterialNumList.value.splice(showNeedMaterialNumList.value.indexOf(tag), 1)
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