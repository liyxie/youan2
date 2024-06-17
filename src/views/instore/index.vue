<template>
  <!-- 入库列表-->
  <div>
    <el-form inline class="searchForm">
      <el-form-item>
        <el-select v-model="params.storeId" style="width: 120px;" clearable>
          <el-option v-for="store of storeList" :label="store.storeName" :value="store.storeId" :key="store.storeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.productName" placeholder="材料名称" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-input type="date" v-model="params.startTime" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-input type="date" v-model="params.endTime" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getInstorePageList">
          <el-icon>
            <svg t="1646977561352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3057" width="200" height="200"><path d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704" p-id="3058"></path></svg>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <!-- 导出数据 -->
      <el-button type="warning" @click="export2Table">
        <el-icon>
          <svg t="1647313957290" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2289" width="200" height="200"><path d="M395.9 406H288.5c-2.8 0-5.7-0.7-8.1-2.4-18.4-13.1-18.2-34.3-6.4-46.3l217.6-220.9c11.1-11.2 29.2-11.4 40.4-0.3l0.3 0.3 217.7 221c11.1 11.3 10.9 29.4-0.4 40.4-5.3 5.2-12.5 8.2-19.9 8.2H628.1v215.7c0 7.9-6.4 14.3-14.3 14.3H410.2c-7.9 0-14.3-6.4-14.3-14.3V406zM283.3 652.4v87.5c0 7.9 6.4 14.3 14.3 14.3h428.8c7.9 0 14.3-6.4 14.3-14.3v-87.5c0-7.9 6.4-14.3 14.3-14.3h142.9c7.9 0 14.3 6.4 14.3 14.3V914c0 7.9-6.4 14.3-14.3 14.3H126.1c-7.9 0-14.3-6.4-14.3-14.3V652.4c0-7.9 6.4-14.3 14.3-14.3H269c7.9 0 14.3 6.4 14.3 14.3z" p-id="2290"></path></svg>
        </el-icon>
        &nbsp;导出数据
      </el-button>
      <el-button type="primary" @click="completeInStoreTask">入库完成</el-button>
    </div>
  </div>

  <!-- 表格 -->
  <el-table :data="instorePageList" style="width: 100%;margin-top: 10px;overflow-x: scroll;" id="elTable">
    <el-table-column prop="insId" label="入库单ID" fixed="left" width="100"/>
    <el-table-column prop="storeName" label="仓库名称" width="95"/>
    <el-table-column prop="materialName" label="材料名称"  width="130" />
    <el-table-column prop="inNum" label="公司数量"  width="95" />
    <el-table-column prop="relativeNum" label="对方数量"  width="80" />
    <el-table-column prop="price" label="单价"  width="95" />
    <el-table-column prop="priceSum" label="金额"  width="95" />
    <el-table-column prop="freight" label="运费单价"  width="95" />
    <el-table-column prop="freightSum" label="运费金额"  width="95" />
    <el-table-column prop="supplyName" label="供应商"  width="130" />
    <el-table-column prop="carNumber" label="车牌号"  width="95" />
    <el-table-column prop="contractId" label="所属合同" width="95"/>
    <el-table-column prop="remarks" label="备注" width="150" />  

    <el-table-column label="入库状态" >
      <template #default="props">
          <span :class="{red:props.row.isIn==0, green: props.row.isIn==1}">{{props.row.isIn==0?"未入库":"已入库"}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="200">
      <template #default="props">
        <el-button v-if="props.row.isIn==0" type="primary" title="修改" @click="openUpdateInstore(props.row)" :key="props.row.insId">修改</el-button>
        <el-button v-if="props.row.isIn==0" type="primary" title="确定入库" @click="confirmInstore(props.row)" :key="props.row.insId">确定入库</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    background
    :total="params.totalNum"
    :page-sizes="[5, 10, 15, 20, 25, 30]"
    v-model:page-size="params.pageSize"
    v-model:currentPage="params.pageNum"
    layout="total, sizes, prev, pager, next, jumper"
    style="margin-top: 20px;"
    @size-change="changeSize"
    @current-change="changeCurrent"
  />
  
  <instore-update ref="instoreUpdateRef" @ok="getInstorePageList"></instore-update>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {get, put, tip, export2excel, post, eltable2excel} from "@/common";
import {useRoute, useRouter} from 'vue-router'
import instoreUpdate from './instore-update.vue'
import ContractUpdate from "@/views/contract/contract-update.vue";
import Decimal from "decimal.js"
const route = useRoute(); // 获取路由信息

// 分页模糊查询数据
const params = reactive({
  storeId: '',
  productName: '',
  startTime: '',
  endTime: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const instorePageList = ref();

// 获取分页模糊查询结果
const getInstorePageList = () => {
  // 如果从添加入库单跳过来，会传参storeId
  if(route.query.contractId){
    params.contractId = parseInt(route.query.contractId);
  }
  // 后台获取查询结果
  get("/instore/instore-page-list", params).then(result => {
    instorePageList.value = result.data.resultList;
    instorePageList.value.forEach(function (item, index){
      if(item.freight == null){
        item.freightSum = 0
      }else{
        let freight = new Decimal(item.freight)
        let inNum = new Decimal(item.inNum)
        let sum = freight.times(inNum).toString();
        item.freightSum = sum
      }
    })
    
    params.totalNum = result.data.totalNum;
    
  });
}
getInstorePageList();

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/instore/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

// 导出数据
const export2Table = () => {
  eltable2excel("elTable")
}

// 确定入库
const confirmInstore = (instore) => {
  put('/instore/instore-confirm', instore).then(res => {
    tip.success(res.message);
    getInstorePageList();
  });
}

// 更新入库信息
const instoreUpdateRef = ref()
const openUpdateInstore = (instore) => {
  instoreUpdateRef.value.open(instore)
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getInstorePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getInstorePageList();
}

const router = useRouter(); // 获取路由器

// 完成入库任务
const completeInStoreTask = () => {
  if(route.query.contractId) {
    let flow = {}
    flow.contractId = route.query.contractId
    post("/activiti/complete-task", flow).then(result => {
      console.log(result)
      if(result.message === "完成任务"){
        tip.success(result.message)
        router.push({ path: "/controller/index" });
      }else {
        tip.warning(result.message)
      }
    })
  }else{
    tip.error("暂无合同需要入库")
  }
}
</script>

<style scoped>
.searchForm{
  margin-top: 20px;
  display: flex;
}
.red{
  color: red;
}
.green{
  color: green;
}
</style>