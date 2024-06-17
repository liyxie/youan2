<template>
  <!--  结算汇总-->

  <!-- 入库列表-->
  <div>
    <el-form inline class="searchForm">
      <el-form-item>
        <el-input v-model="params.workRegion" placeholder="项目名称" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item label="选择月份:">
        <el-input type="month" v-model="params.startTime" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getSummaryPageList">
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
    </div>
  </div>

  <!-- 表格 -->
  <el-table :data="summaryPageList" style="width: 100%;margin-top: 10px;overflow-x: scroll;" :span-method="objectSpanMethod" id="elTable" show-summary :summary-method="getSummaries">
    <el-table-column label="序号" type="index" width="60"></el-table-column>
    <el-table-column prop="workRegion" label="项目名称" width="170"/>
    <el-table-column prop="productName" label="费用名称" width="170"/>
    <el-table-column prop="outNum" label="数量"  width="95" />
    <el-table-column prop="unitName" label="单位"  width="80" />
    <el-table-column prop="salePrice" label="单价"  width="80" />
    <el-table-column prop="money" label="金额/元"  width="95" />
    <el-table-column prop="totalAmount" label="结算金额/元"  width="170" />
    <el-table-column prop="remarks" label="备注"/>
  </el-table>
  <div>
    <span>{{selectTime}}  项目施工沥青总结算收入：{{moneySum}}</span>
  </div>
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

</template>

<script setup>
import {reactive, ref} from 'vue';
import {export2excel, get, eltable2excel} from "@/common";
import {useRoute} from 'vue-router';
import {dateTransform, getDay} from "@/common/date";
import Decimal from "decimal.js";

const route = useRoute(); // 获取路由信息

// 分页模糊查询数据
const params = reactive({
  startTime:'',
  pageSize: 8,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const summaryPageList = ref([]);

const selectTime = ref('')
const moneySum = ref(0)

// 获得所有供应商
const supplyList = ref();
const getSupplyList= () => {
  get(`/supply/supply-list`).then(result => {
    supplyList.value = result.data;
  });
}

// 获取分页模糊查询结果
const getSummaryPageList = () => {
  selectTime.value = ''
  if (params.startTime != '' && params.startTime!=null){
    selectTime.value = params.startTime.replace('-',"年")+"月止"
    params.startTime = params.startTime+"-01"
  }
  moneySum.value = 0
  // 后台获取查询结果
  get("/outstore/outstore-summary-page-list", params).then(result => {
    params.totalNum = result.data.totalNum;
    summaryPageList.value = result.data.resultList
    summaryPageList.value.forEach(function (item) {
      console.log(item.money)
      item.remarks = dateTransform(item.earliestCreateTime) +'-'+ getDay(item.latestCreateTime) + "出料施工" +item.total + "车"
      let money = new Decimal(item.money)
      let sum = new Decimal(moneySum.value)
      sum = sum.plus(money)
      moneySum.value = sum.toString()      
    })
    params.startTime = ''
  });
  getSupplyList()
}
getSummaryPageList();




// 导出数据
const export2Table = () => {
  // eltable2excel("elTable")
  console.log(params)
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getSummaryPageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getSummaryPageList();
}

// 数据行单元格的合并
const objectSpanMethod = function ({ row, rowIndex, columnIndex }) {
  if (columnIndex === 1 || columnIndex === 7 || columnIndex === 5) {
    // 当列索引为 1（supplyName 列）或 2（totalAmount 列）时
    if (
        rowIndex > 0 &&
        row.supplyName === summaryPageList.value[rowIndex - 1].supplyName &&
        row.totalAmount === summaryPageList.value[rowIndex - 1].totalAmount &&
        row.salePrice === summaryPageList.value[rowIndex - 1].salePrice
    ) {
      // 当前行的 supplyName 和 totalAmount 与上一行相同
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      // 当前行的 supplyName 和 totalAmount 与上一行不同，需要合并
      let rowspan = 1;
      for (let i = rowIndex + 1; i < summaryPageList.value.length; i++) {
        if (
            row.supplyName === summaryPageList.value[i].supplyName &&
            row.totalAmount === summaryPageList.value[i].totalAmount &&
            row.salePrice === summaryPageList.value[i].salePrice
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

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];

  columns.forEach((column, index) => {
    if (column.property === 'totalAmount') {
      const values = data.map((item) => Number(item[column.property]));
      if (!values.every((value) => Number.isNaN(value))) {
        const sum = moneySum.value;
        sums[index] = `总金额: ${sum} 元`; // Assuming the values are currency, rounding to 2 decimal places
      } else {
        sums[index] = 'N/A';
      }
    } else {
      sums[index] = '';
    }
  });

  return sums;
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
/* 自定义单元格内容居中 */
.el-table th, .el-table td {
  text-align: center;
}
</style>