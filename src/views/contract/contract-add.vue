<template>
  <!-- 添加合同对话框 -->
  <el-dialog v-model="visible" title="添加合同" width="800px" @close="close" destroy-on-close>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="销售合同" name="sale">
        <contract-sale :customer="customerList" :products="productList" :if-purchase='"0"' @ok="close"></contract-sale>
      </el-tab-pane>
      <el-tab-pane label="采购合同" name="purchase">
        <contract-purchase :customer="customerList" :if-purchase='"2"' @ok="close"></contract-purchase>
      </el-tab-pane>
      <el-tab-pane label="销售并采购" name="saleAndPurchase">
        <contract-sale :customer="customerList" :products="productList" :if-purchase='"2"' @ok="close"></contract-sale>
      </el-tab-pane>
      <el-tab-pane label="工程合同" name="engineering">
        <contract-engineering :customer="customerList" :if-purchase='"3"' @ok="close"></contract-engineering>
      </el-tab-pane>
    </el-tabs>  
  </el-dialog>
</template>
  
<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH, get} from "@/common";
import contractSale from './contract-sale.vue'
import contractPurchase from './contract-purchase.vue'
import contractEngineering from './engineering/add.vue'

const visible = ref(false); // 该页面的可见性

const activeName = ref('purchase')

// 关闭
const close = () => {
  visible.value = false;
}

// 该对话框打开
const open = () => {
  visible.value = true;
};

// 获得所有客户
const customerList = ref();
const getCustomerList= () => {
  get("/customer/customer-list").then(result => {
    customerList.value = result.data;
    customerList.value.push({"customerId":-1,"customerName":"其他"})
  });
}

const productList = ref();
const getProductList= () => {
  get("/product-material/product-list").then(result => {
    productList.value = result.data;
  });
}
getProductList();
getCustomerList();

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