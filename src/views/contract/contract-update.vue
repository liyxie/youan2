<template>
  <!-- 修改用户对话框 -->
  <el-dialog v-model="visible" title="修改用户信息" width="800px">
    <el-form ref="contractUpdateRef" :model="contractUpdate" :rules="rules" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同名：" prop="contractName">
            <el-input v-model="contractUpdate.contractName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="关联工区：" prop="workRegion">
            <el-input v-model="contractUpdate.workRegion" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="合同客户：">
            <el-select v-model="contractUpdate.customerId" style="width: 80%;" clearable @change="handleSelectChangeCustomer">
              <el-option v-for="customer of customerList" :label="customer.customerName" :value="customer.customerId" :key="customer.customerId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="其他客户：" v-if="showOtherCustomer">
            <el-input v-model="contractUpdate.otherCustomer" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="合同工期">
            <el-date-picker
                v-model="contractUpdate.date"
                type="daterange"
                unlink-panels
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
            />
          </el-form-item>
          <el-form-item label="合同照片：" prop="imgs">
            <el-upload
                class="avatar-uploader"
                :action="WAREHOUSE_CONTEXT_PATH + '/contract/img-upload'"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="10" style="margin-left: 30px">
          <el-form-item label="生产数量：" style="width: 80%;">
            <el-input v-model="contractUpdate.productNum" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="生产产品：">
            <el-select v-model="contractUpdate.productId" style="width: 80%;" clearable @change="handleSelectChange">
              <el-option v-for="product of productList" :label="product.productName" :value="product.productId" :key="product.productId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="材料比例：" v-if="showRatio" style="width: 80%;">
            <el-tag
                v-for="tag in ratioDetails"
                :key="tag.name"
                class="mx-1"
            >
              {{ tag.materialName }} : {{ tag.ratio }}
            </el-tag>
          </el-form-item>
          <el-form-item label="原材料：">
            <el-select v-model="contractUpdate.materialId" style="width: 120px;" clearable @change="handleSelectMaterial">
              <el-option v-for="material of ratioDetails" :label="material.materialName" :value="material.materialId" :key="material.materialId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库数量：" >
            <el-input v-model="materialNum" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="需要数量：">
            <el-input v-model="needNum" autocomplete="off"/>
          </el-form-item>
<!--          <el-form-item label="是否需要采购：">-->
<!--            <el-select v-model="contractUpdate.ifPurchase" autocomplete="off">-->
<!--              <el-option label="无需采购" value="0"></el-option>-->
<!--              <el-option label="需要采购" value="1"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateContract">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { put, tip, WAREHOUSE_CONTEXT_PATH, get } from "@/common";
import { Plus } from '@element-plus/icons-vue'

const visible = ref(false); // 该页面的可见性
// 修改合同对象
const contractUpdate = reactive({
  contractName: '',
  contractDesc: '',
  contractState: '',
  workRegion: '',
  productId:'',
  materialId: '',
  productNum: '',
  customerId:'',
  otherCustomer:'',
  ifPurchase:''
});



// 图片回显路径
const imageUrl = ref('');

// 所有客户
const customerList = ref();

// 该对话框打开并初始化
const open = (contract) => {
  for(let prop in contract){
    contractUpdate[prop] = contract[prop];
  }
  get(`/product-material/ratio/${contractUpdate.productId}`).then(result => {
    ratioDetails.value = result.data;
  });
  get("/customer/customer-list").then(result => {
    customerList.value = result.data;
    customerList.value.push({"customerId":-1,"customerName":"其他"})
  });
  console.log(contractUpdate.customerId)
  if(contractUpdate.customerId == '' || contractUpdate.customerId == null){
    showOtherCustomer.value = true
    contractUpdate.customerId=-1
  }
  visible.value = true;
};

// 填写其他客户的可见性
const showOtherCustomer = ref(false)
// 选择客户时
const handleSelectChangeCustomer = () => {
  showOtherCustomer.value = false
  if(contractUpdate.customerId==-1){
    showOtherCustomer.value = true
  }
}

const contractUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 修改用户提交
const updateContract = () => {
  contractUpdateRef.value.validate(valid => {
    if(valid){
      if (contractUpdate.customerId == -1){
        contractUpdate.customerId = ''
      }
      console.log(contractUpdate.otherCustomer)
      put('/contract/updateContract', contractUpdate).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}

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
    contractUpdate.files = image.name;
  };
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

// 配料比列表
const ratioDetails= ref({materialId:'',materialName:''});

// 选择合同所需的产品并查询到相应的配料比
const handleSelectChange = () => {
  let productId = contractUpdate.productId
  get(`/product-material/ratio/${productId}`).then(result => {
    ratioDetails.value = result.data;
  });
}

// 获得所有产品
const productList = ref();
const getProductList= () => {
  get("/product-material/product-list").then(result => {
    productList.value = result.data;
  });
}
getProductList();

// 改变材料时，算出生产所需要的材料用量以及仓库剩余的材料数量
const needNum = ref(0);
const materialNum = ref();
const handleSelectMaterial = () => {
  materialNum.value = ratioDetails.value.find(item => item.materialId === contractUpdate.materialId).materialNum
  needNum.value = ratioDetails.value.find(item => item.materialId === contractUpdate.materialId).ratio * contractUpdate.productNum
  console.log(contractUpdate.productNum)
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