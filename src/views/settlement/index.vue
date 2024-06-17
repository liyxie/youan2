<template>
<!--  按合同结算-->
  <el-form inline class="searchForm" v-if="showSearchForm">
    <el-form-item label="所属合同：" prop="contractId">
      <el-select placeholder="请选择合同" v-model="params.contractId" clearable >
        <el-option v-for="contract of contractList" :label="contract.contractName" :value="contract.contractId" :key="contract.contractId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectList">
        <el-icon>
          <svg t="1646977561352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3057" width="200" height="200"><path d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704" p-id="3058"></path></svg>
        </el-icon>
        &nbsp;查&nbsp;&nbsp;询
      </el-button>
    </el-form-item>
  </el-form>
  
  <el-button type="primary" @click="completeSettlementTask" v-if="showTask">结算完成</el-button>


  <!-- 出库单表格 -->
  <el-table :data="outstorePageList" style="width: 100%;margin-top: 10px;" height="250px" border stripe :span-method="outstoreSpanMethod">
    <el-table-column prop="outsId" label="出库单ID" width="130"/>
    <el-table-column prop="contractName" label="所属合同" width="155"/>
    <el-table-column prop="workRegion" label="工区名称" width="155"/>
    <el-table-column prop="productName" label="产品名称" width="155"/>
    <el-table-column prop="outNum" label="公司数量" width="155"/>
    <el-table-column prop="unitName" label="单位" width="155"/>
    <el-table-column prop="salePrice" label="单价" width="155"/>
    <el-table-column prop="salePriceSum" label="金额/元" width="155"/>
    <el-table-column prop="remarks" label="备注" width="155"/>
    <el-table-column prop="outStoreSum" label="总金额/元" width="155" fixed="right"/>
  </el-table>
    
  <el-divider></el-divider>


  <!-- 入库单表格 -->
  <el-table :data="instorePageList" style="width: 100%;margin-top: 10px;" height="250px" border stripe :span-method="instoreSpanMethod">
    <el-table-column prop="insId" label="入库单ID" width="130"/>
    <el-table-column prop="contractName" label="所属合同" width="155"/>
    <el-table-column prop="supplyName" label="供应商" width="155"/>
    <el-table-column prop="materialName" label="材料名称" width="155"/>
    <el-table-column prop="inNum" label="公司数量" width="155"/>
    <el-table-column prop="unitName" label="单位" width="155"/>
    <el-table-column prop="price" label="单价" width="155"/>
    <el-table-column prop="priceSum" label="金额/元" width="155"/>
    <el-table-column prop="remarks" label="备注" width="155"/>
    <el-table-column prop="inStoreSum" label="总金额/元" width="155" fixed="right"/>
<!--    <el-table-column prop="inStoreSum" label="入库总金额" width="120" :summary="sumColumn">-->
<!--      <template slot-scope="{ $index }">{{ sumColumn($index) }}</template>-->
<!--    </el-table-column>-->
  </el-table>
<!--  <div>-->
<!--    <span>入库总金额：{{inStoreSum}}</span>-->
<!--  </div>-->

  <!--  &lt;!&ndash; 分页 &ndash;&gt;-->
<!--  <el-pagination-->
<!--      background-->
<!--      :total="params.totalNum"-->
<!--      :page-sizes="[5, 10, 15, 20, 25, 30]"-->
<!--      v-model:page-size="params.pageSize"-->
<!--      v-model:currentPage="params.pageNum"-->
<!--      layout="total, sizes, prev, pager, next, jumper"-->
<!--      style="margin-top: 20px;"-->
<!--      @size-change="changeSize"-->
<!--      @current-change="changeCurrent"-->
<!--  />-->


</template>

<script setup>
import {nextTick, onMounted, reactive, ref} from 'vue';
import {get, put, tip, export2excel, post} from "@/common";
import {useRoute, useRouter} from 'vue-router'
import { Search, Edit, Check, Message, Star, Delete } from '@element-plus/icons-vue'
import {selectedOption} from "bpmn-js-properties-panel/lib/Utils";
import {Decimal} from "decimal.js"

const route = useRoute(); // 获取路由信息

// 分页模糊查询数据
const params = reactive({
  contractId: '',
  productName: '',
  startTime: '',
  endTime: '',
  isOut: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})


// 页面初始化
onMounted(() => {
  if (route.query.contractId){
    params.contractId = route.query.contractId
    showTask.value = true
    showSearchForm.value = false
  }
  getOutstorePageList()
  getInstorePageList()
});

const outStoreSum = ref(0);
// 出库单的表格数据
const outstorePageList = ref();
const getOutstorePageList = () => {
  outStoreSum.value = 0
  // 后台获取查询结果
  get("/outstore/outstore-page-list", params).then(result => {
    outstorePageList.value = result.data.resultList;
    outstorePageList.value.forEach(function (item, index){
      // let money = new Decimal
      let money = new Decimal(item.salePriceSum)
      let sum = new Decimal(outStoreSum.value)
      sum = sum.plus(money)
      outStoreSum.value = sum.toString()
    })
    outstorePageList.value.forEach(function (item, index){
      item.outStoreSum = outStoreSum.value
    })
  });
}

const inStoreSum = ref(0);
// 入库单据
const instorePageList = ref()
// 入库单的表格数据
const getInstorePageList = () => {
  inStoreSum.value = 0

  // 后台获取查询结果
  get("/instore/instore-page-list", params).then(result => {
    instorePageList.value = result.data.resultList;
    instorePageList.value.forEach(function (item, index){
      let money = new Decimal(item.priceSum)
      let sum = new Decimal(inStoreSum.value)
      sum = sum.plus(money) 
      inStoreSum.value = sum.toString()
    })
    instorePageList.value.forEach(function (item, index){
      item.inStoreSum = inStoreSum.value
    })
  });
}

// 获取所有合同
const contractList = ref();
const getContractList= () => {
  get("/contract/contract-all").then(result => {
    contractList.value = result.data;
  });
}
getContractList()

// 结算完成的可见性
const showTask = ref(false)
const showSearchForm = ref(true)

const selectList = () =>{
  getOutstorePageList()
  getInstorePageList()
}

const router = useRouter(); // 获取路由器

// 完成结算任务
const completeSettlementTask = () => {
  if(route.query.contractId) {
    let flow = {}
    flow.contractId = route.query.contractId
    post("/summary/complete-task", flow).then(result => {
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

const sumColumn = (index) =>{
  console.log(inStoreSum.value)
  return inStoreSum.value;
}

const outstoreSpanMethod = function ({ row, rowIndex, columnIndex }) {
  if (columnIndex === 9 ) {
    // 当列索引为 1（supplyName 列）或 2（totalAmount 列）时
    if (
        rowIndex > 0 &&
        row.outStoreSum === outstorePageList.value[rowIndex - 1].outStoreSum
    ) {
      // 当前行的 supplyName 和 totalAmount 与上一行相同
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      // 当前行的 supplyName 和 totalAmount 与上一行不同，需要合并
      let rowspan = 1;
      for (let i = rowIndex + 1; i < outstorePageList.value.length; i++) {
        if (
            row.outStoreSum === outstorePageList.value[i].outStoreSum 
        ) {
          rowspan++;
        } else {
          break;
        }   
      }
      return {
        rowspan,
        colspan: 1,
      };
    }
  }
};

const instoreSpanMethod = function ({ row, rowIndex, columnIndex }) {
  if (columnIndex === 9 ) {
    // 当列索引为 1（supplyName 列）或 2（totalAmount 列）时
    if (
        rowIndex > 0 &&
        row.inStoreSum === instorePageList.value[rowIndex - 1].inStoreSum
    ) {
      // 当前行的 supplyName 和 totalAmount 与上一行相同
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      // 当前行的 supplyName 和 totalAmount 与上一行不同，需要合并
      let rowspan = 1;
      for (let i = rowIndex + 1; i < instorePageList.value.length; i++) {
        if (
            row.inStoreSum === instorePageList.value[i].inStoreSum
        ) {
          rowspan++;
        } else {
          break;
        }
      }
      return {
        rowspan,
        colspan: 1,
      };
    }
  }
};
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