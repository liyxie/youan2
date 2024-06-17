<template>
  <!-- 材料列表 -->
  <div>
    <el-form class="searchForm">
      <el-form-item>
        <el-select v-model="params.storeId" style="width: 120px;" clearable>
          <el-option v-for="store of storeList" :label="store.storeName" :value="store.storeId" :key="store.storeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-input v-model="params.materialName" placeholder="材料名称" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-button type="primary" @click="getCommodityPageList">
          <el-icon>
            <svg t="1646977561352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3057" width="200" height="200"><path d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704" p-id="3058"></path></svg>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="openCommodityAdd()">
        <el-icon>
          <svg t="1646977404025" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2197" width="200" height="200"><path d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z" p-id="2198"></path></svg>
        </el-icon>
        &nbsp;添加材料
      </el-button>
      <!-- 导出数据 -->
      <el-button type="warning" @click="export2Table">
        <el-icon>
          <svg t="1647313957290" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2289" width="200" height="200"><path d="M395.9 406H288.5c-2.8 0-5.7-0.7-8.1-2.4-18.4-13.1-18.2-34.3-6.4-46.3l217.6-220.9c11.1-11.2 29.2-11.4 40.4-0.3l0.3 0.3 217.7 221c11.1 11.3 10.9 29.4-0.4 40.4-5.3 5.2-12.5 8.2-19.9 8.2H628.1v215.7c0 7.9-6.4 14.3-14.3 14.3H410.2c-7.9 0-14.3-6.4-14.3-14.3V406zM283.3 652.4v87.5c0 7.9 6.4 14.3 14.3 14.3h428.8c7.9 0 14.3-6.4 14.3-14.3v-87.5c0-7.9 6.4-14.3 14.3-14.3h142.9c7.9 0 14.3 6.4 14.3 14.3V914c0 7.9-6.4 14.3-14.3 14.3H126.1c-7.9 0-14.3-6.4-14.3-14.3V652.4c0-7.9 6.4-14.3 14.3-14.3H269c7.9 0 14.3 6.4 14.3 14.3z" p-id="2290"></path></svg>
        </el-icon>
        &nbsp;导出数据
      </el-button>
      <el-button type="primary" @click="completePurchaseTask" v-if="showPurchase">采购计划创建完成</el-button>
<!--      <el-select placeholder="批量操作" style="width: 110px;margin-left: 12px; position: relative; top: 2px;">-->
<!--        <el-option @click="deleteCommodityList">-->
<!--          <span style="float: left;">-->
<!--            <el-icon><delete /></el-icon>-->
<!--          </span>-->
<!--          <span style="padding-left: 6px; position: relative; top: -2px;">删除</span>-->
<!--        </el-option>-->
<!--      </el-select>-->
    </div>
  </div>

  <!-- 表格 -->
  <el-table ref="multipleTableRef" :data="commodityPageList" @selection-change="handleSelectionChange" style="width: 100%; margin-top: 10px;" table-layout="auto" size="large" border stripe id="elTable">
    <el-table-column type="selection" width="55" />
<!--    <el-table-column label="材料图片">-->
<!--      <template #default="props">-->
<!--          <el-image style="width: 60px; height: 60px" :src="WAREHOUSE_CONTEXT_PATH + props.row.imgs" fit="fill" />-->
<!--      </template>-->
<!--    </el-table-column>-->
    <el-table-column prop="materialName" label="材料名称及规格" sortable />
    <el-table-column prop="storeName" label="仓库名称" sortable />
    <el-table-column prop="materialNum" label="材料在库数量" sortable />
    <el-table-column prop="unitName" label="单位" sortable />
    <el-table-column prop="createTime" label="创建日期" sortable />
    <el-table-column label="操作" fixed="right" width="240">
      <template #default="props">
        <el-link type="primary" @click.prevent="openCommodityUpdate(props.row)">修改</el-link>
        <el-link type="primary" @click.prevent="deleteCommodity(props.row.materialId)">删除</el-link>
        <el-link type="primary" @click.prevent="openPurchaseAdd(props.row)" v-if="showPurchase">采购</el-link>
        <el-link type="primary" v-if="props.row.upDownState==0" @click.prevent="openOutstoreAdd(props.row)">出库</el-link>
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

  <!-- 添加材料对话框 -->
  <commodity-add ref="commodityAddRef" @ok="getCommodityPageList"></commodity-add>
  
  <!-- 修改材料对话框 -->
  <commodity-update ref="commodityUpdateRef" @ok="getCommodityPageList"></commodity-update>

  <!-- 添加采购单对话框 -->
  <purchase-add ref="purchaseAddRef" @ok="toPurchaseList"></purchase-add>

  <!-- 添加出库单对话框 -->
  <outstore-add ref="outstoreAddRef" @ok="toOutstoreList"></outstore-add>

</template>

<script setup>
import { reactive, ref } from 'vue';
import {get, put, del, tip, export2excel, WAREHOUSE_CONTEXT_PATH, post, eltable2excel} from "@/common";
import {useRoute, useRouter} from "vue-router";
import { Search, Edit, Check, Message, Star, Delete } from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  materialName: '',
  storeId: '',
  unitId: '',
  pageSize: 8,
  pageNum: 1,
  totalNum: 0,
  materialId:''
})
    
// 控制采购和采购任务创建完成的可见性
const showPurchase=ref(false)

// 表格数据
const commodityPageList = ref();

const isPurchase = ref(false);

// 获取路由信息
const route = useRoute(); 
// 获取分页模糊查询结果
const getCommodityPageList = () => {
  showPurchase.value = false
  if(route.query.contractId){
    params.contractId = parseInt(route.query.contractId);
    showPurchase.value = true
    get("/material/material-page-list-contractId", params).then(result => {
      commodityPageList.value = result.data.resultList;
      params.totalNum = result.data.totalNum;
    });
  }else{
    console.log(params.contractId)
    get("/material/material-page-list", params).then(result => {
      console.log(result)
      commodityPageList.value = result.data.resultList;
      params.totalNum = result.data.totalNum;
    });
  }
}
getCommodityPageList();

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/material/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

// 所有单位
const unitList = ref();
// 获取所有单位
const getUnitList = () => {
  get("/material/unit-list").then(result => {
    unitList.value = result.data;
  });
}
getUnitList();

// 复选框的操作
const multipleTableRef = ref();
const multipleSelection = ref([]);
// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach((row) => {
//       multipleTableRef.value.toggleRowSelection(row, undefined)
//     })
//   } else {
//     multipleTableRef.value.clearSelection()
//   }
// }
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}

// 导出数据
const export2Table = () => {
  eltable2excel("elTable")
}

// 完成采购任务
const completePurchaseTask = () => {
  if(route.query.contractId) {
    let flow = {}
    flow.contractId = route.query.contractId
    post("/activiti/complete-task", flow).then(result => {
      console.log(result)
      if(result.message == "完成任务"){
        tip.success(result.message)
        router.push({ path: "/controller/index" });
      }else {
        tip.warning(result.message)
      }
    })
  }else{
    tip.error("暂无合同需要采购")
  }
}

// 跳向添加材料
import CommodityAdd from "./commodity-add.vue";
const commodityAddRef = ref();
const openCommodityAdd = () => {
  commodityAddRef.value.open(storeList, unitList);
};


// 跳向修改材料
import CommodityUpdate from "./commodity-update.vue";
const commodityUpdateRef = ref();
const openCommodityUpdate = (commodity) => {
  commodityUpdateRef.value.open(commodity, storeList, unitList);
};

// 跳向修改采购单
import PurchaseAdd from "../../purchase/purchase-add.vue";
const purchaseAddRef = ref();
const openPurchaseAdd = (commodity) => {
  let cId
  if(route.query.contractId){
    cId = parseInt(route.query.contractId)
  }
  purchaseAddRef.value.open(commodity, cId);

};

// 跳向添加出库单
import OutstoreAdd from "../../outstore/outstore-add.vue";
const outstoreAddRef = ref();
const openOutstoreAdd = (commodity) => {
  outstoreAddRef.value.open(commodity);
};

// 跳转到采购单列表页面
const toPurchaseList = (storeId) => {
  // 通过路由导航到采购单列表页面
  router.push({ path: "/purchase/index", query: {"storeId": storeId } });
}

// 跳转到出库单列表页面
const toOutstoreList = (storeId) => {
  // 通过路由导航到出库单列表页面
  router.push({ path: "/outstore/index", query: {"storeId": storeId } });
}

// 删除单个材料
const deleteCommodity = (materialId) => {
  del(`/material/material-delete/${materialId}`, null, { title: "提示", message: "您确定删除该材料吗？" }).then(result => {
    tip.success(result.message);
    // 重新查询
    getCommodityPageList();
  });
}

// 批量删除
const deleteCommodityList = () => {
  if(multipleSelection.value.length){
    // 取出所有选中的id
    const productIds = multipleSelection.value.reduce((prev, cur) =>{
      prev.push(cur.productId);
      return prev;
    }, []);

    del(`/product/product-list-delete`, productIds, { title: "提示", message: "您确定删除选中材料吗？" }).then(result => {
      tip.success(result.message);
      // 重新查询
      getCommodityPageList();
    });
  }else{
    tip.error("请选择需要删除的行！");
  }
}





// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getCommodityPageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getCommodityPageList();
}
</script>

<style scoped>
.searchForm{
  margin-top: 20px;
  display: flex;
}
.el-link {
  margin-right: 8px;
}
</style>