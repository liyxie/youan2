<template>
  <!-- <h2>合同列表</h2>
  <el-divider></el-divider> -->
  <div>
    <el-form inline class="searchForm">
      <el-form-item label="合同名:">
        <el-input v-model="params.contractName" placeholder="合同名" style="width: 120px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="合同状态:" style="margin-left: 20px;">
        <el-select v-model="params.contractState" placeholder="合同状态" style="width: 120px;" clearable>
          <el-option label="未审核" value="0"></el-option>
          <el-option label="待结算" value="1"></el-option>
          <el-option label="结算中" value="2"></el-option>
          <el-option label="已结算" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型:" style="margin-left: 20px;">
        <el-select v-model="params.ifPurchase" placeholder="合同状态" style="width: 120px;" clearable>
          <el-option label="未审核" value="0"></el-option>
          <el-option label="待结算" value="1"></el-option>
          <el-option label="结算中" value="2"></el-option>
          <el-option label="工程合同" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 30px;">
        <el-button type="primary" @click="getContractList" style="margin-left: 10px;">
          <el-icon>
            <svg t="1646977561352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="3057" width="200" height="200">
              <path
                  d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704"
                  p-id="3058"></path>
            </svg>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-button type="primary" @click="openContractAdd()">
        <el-icon>
          <svg t="1646977404025" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="2197" width="200" height="200">
            <path
                d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z"
                p-id="2198"></path>
          </svg>
        </el-icon>
        &nbsp;添加合同
      </el-button>

      <el-button type="warning" @click="export2Table">
        <el-icon>
          <svg t="1647313957290" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="2289" width="200" height="200">
            <path
                d="M395.9 406H288.5c-2.8 0-5.7-0.7-8.1-2.4-18.4-13.1-18.2-34.3-6.4-46.3l217.6-220.9c11.1-11.2 29.2-11.4 40.4-0.3l0.3 0.3 217.7 221c11.1 11.3 10.9 29.4-0.4 40.4-5.3 5.2-12.5 8.2-19.9 8.2H628.1v215.7c0 7.9-6.4 14.3-14.3 14.3H410.2c-7.9 0-14.3-6.4-14.3-14.3V406zM283.3 652.4v87.5c0 7.9 6.4 14.3 14.3 14.3h428.8c7.9 0 14.3-6.4 14.3-14.3v-87.5c0-7.9 6.4-14.3 14.3-14.3h142.9c7.9 0 14.3 6.4 14.3 14.3V914c0 7.9-6.4 14.3-14.3 14.3H126.1c-7.9 0-14.3-6.4-14.3-14.3V652.4c0-7.9 6.4-14.3 14.3-14.3H269c7.9 0 14.3 6.4 14.3 14.3z"
                p-id="2290"></path>
          </svg>
        </el-icon>
        &nbsp;导出数据
      </el-button>
    </div>
  </div>
  
  <div>
    <!-- 表格 -->
    <el-table :data="contractList" ref="multipleTableRef" @selection-change="handleSelectionChange"
              style="width: 100%; margin-top: 10px;" border stripe id="elTable">
      <el-table-column prop="contractId" label="合同ID"/>
      <el-table-column prop="contractName" label="合同名" width="120"/>
      <el-table-column prop="productName" label="产品名称" width="120" v-if="!showEngineering"/>
      <el-table-column prop="productNum" label="生产数量" width="120"/>
      <el-table-column prop="startTime" label="工期开始时间" width="120" v-if="!showEngineering"/>
      <el-table-column prop="endTime" label="工期结束时间" width="120" v-if="!showEngineering"/>
      <el-table-column prop="workRegion" label="关联工区" width="120"/>
      <el-table-column prop="custom" label="合同客户" width="120"/>
      <el-table-column prop="signingAddress" label="签订地区" width="120" v-if="showEngineering"/>
      <el-table-column prop="signingDate" label="签订时间" width="120" v-if="showEngineering"/>

      <el-table-column label="合同状态" width="120">
        <template #default="props"> 
        <span :class="{red:props.row.contractState ==='0' || props.row.contractState ==='1'}">
          {{
            props.row.contractState === '0' ? '未审核'
                : props.row.contractState === '1' ? '被驳回'
                    : props.row.contractState === '2' ? '待结算'
                        : props.row.contractState === '3' ? '结算中'
                            : props.row.contractState === '4' ? '已结算'
                                : '其他'
          }}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="是否需要采购" width="120">
        <template #default="props">
        <span :class="{red:props.row.ifPurchase=='1'}">{{
            props.row.ifPurchase == "2" ? "需要采购" : "无需采购"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100"/>
      <el-table-column label="操作" fixed="right" width="240">
        <template #default="props">
          <!--        v-if="props.row.contractState ===   '0' || props.row.contractState === '1'"-->
          <el-link type="primary"
                   v-if="props.row.contractState === '0' && props.row.contractId != ''"
                   @click.prevent="openContractUpdate(props.row)" style="margin-right: 8px">修改
          </el-link>
          <el-link type="primary" @click="openContractDetail(props.row)" style="margin-right: 8px">查看合同详情</el-link>
          <el-link type="primary" @click="downloadFiles(props.row)" style="margin-right: 8px">下载附件</el-link>
          <el-link type="primary" @click="agree(props.row)"
                   v-if="props.row.contractState === '0' && props.row.contractId != '' && role=='supper_manage'"
                   style="margin-right: 8px">通过
          </el-link>
          <el-link type="primary" @click="reject(props.row.contractId,props.row.ifPurchase)"
                   v-if="props.row.contractState === '0' && props.row.contractId != ''  && showExamine==true && role=='supper_manage'"
                   style="margin-right: 8px">退回
          </el-link>
          <el-link type="primary" v-if="props.row.contractState === '1'" @click.prevent="completeTask(props.row)"
                   style="margin-right: 8px">
            再次提交审核
          </el-link>
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
    
<!--    <engineering v-if="showEngineering" :paramsData="params"></engineering>-->
  </div>


  <!-- 添加合同对话框 -->
  <contract-add ref="contractAddRef" @ok="getContractList"></contract-add>

  <!-- 修改合同对话框 -->
  <contract-update ref="contractUpdateRef" @ok="getContractList"></contract-update>

  <!-- 查看合同详细信息 -->
  <contract-detail ref="contractDetailRef"></contract-detail>

  <!--  合同驳回原因-->
  <contract-reason ref="contractReasonRef"></contract-reason>
</template>

<script setup>
import {reactive, ref} from "vue";
import {export2excel, get, WAREHOUSE_CONTEXT_PATH, post, tip, eltable2excel} from "@/common";

// 分页参数
const params = reactive({
  contractName: '',
  contractDesc: '',
  contractState: '',
  ifPurchase: '',
  associatedArea: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})
const multipleTableRef = ref();

// 图片回显路径
const imageUrl = ref('');

// 获取路由器
const router = useRouter();
// 获取路由信息
const route = useRoute();

// 表格数据
const contractList = ref();

// 审核可见性
const showExamine = ref(true)

// 工程合同的显示状态
const showEngineering = ref(false)

const role = ref("")

// 获取查询结果
const getContractList = () => {
  // 这里的区分合同id存不存在是因为需要从任务界面跳转过来能够直接看到目前任务绑定的合同
  if (route.query.contractId) {
    params.contractId = parseInt(route.query.contractId)
    getAll();
  } else {
    getAll();
  }
  if(params.ifPurchase == "3" ){
    showEngineering.value = true
  }
  role.value = localStorage.getItem("userRole")
}
const getAll = () =>{
  get("/contract/contract-list", params).then(result => {
    contractList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
    contractList.value.forEach(function(item,index){
      if(item.customerId == null){
        item.custom = item.otherCustomer
      }else{
        item.custom = item.customerName
      }
    })
  });
}

getContractList();


// 复选框的操作
const multipleSelection = ref([]);

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}

// 添加合同
import ContractAdd from "./contract-add.vue";

const contractAddRef = ref();
const openContractAdd = () => {
  contractAddRef.value.open();
};

// 修改合同
import ContractUpdate from "./contract-update.vue";

const contractUpdateRef = ref();
const openContractUpdate = (contract) => {
  contractUpdateRef.value.open(contract);
}

// 查看合同详情
import ContractDetail from "@/views/contract/contract-detail.vue";
import {useRoute, useRouter} from "vue-router";
const contractDetailRef = ref();
const openContractDetail = (contract) => {
  let contractRow = contractList.value.find(item => item.contractId === contract.contractId)
  contractDetailRef.value.open(contractRow,);
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getContractList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getContractList();
}

// 导出数据
const export2Table = () => {
  eltable2excel("elTable")
}

// 下载合同附件
const downloadFiles = (contract) => {
  // 构建带参数的 URL
  const url = WAREHOUSE_CONTEXT_PATH+`/contract/download-images/`+contract.contractId;

  fetch(url)
      .then((response) => {
        // 将二进制数据转换成 blob
        return response.blob();
      })
      .then((blob) => {
        // 创建一个用于下载的 URL
        const downloadUrl = window.URL.createObjectURL(new Blob([blob]));

        // 创建一个隐藏的 <a> 元素
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '附件.zip');

        // 将 <a> 元素添加到页面上以触发下载
        document.body.appendChild(link);
        link.click();

        // 清理 URL 和 <a> 元素
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

// 通过合同审核
const agree = (contract) => {
  let flow = {}
  flow.contractId = contract.contractId
  console.log(flow)
  post("/contract/contract-agree", flow).then(result => {
    console.log(result)
    if (result.message === "完成任务") {
      tip.success(result.message)
      router.push({ path: "/controller/index" });
    } else {
      tip.warning(result.message)
    }
    getContractList()
  })
}

// 合同驳回
import ContractReason from './contract-reason.vue'
const contractReasonRef = ref()
const reject = (contractId, ifPurchase) => {
  let data = {
    contractId: contractId,
    ifPurchase: ifPurchase
  }
  contractReasonRef.value.open(data);
  getContractList()
}

// 再次提交审核
const completeTask = (contract) => {
  let flow = {}
  flow.contractId = contract.contractId
  flow.ifPurchase = contract.ifPurchase
  console.log(flow)
  post("/contract/contract-again", flow).then(result => {
    console.log(result)
    if (result.message === "启动流程成功") {
      tip.success("再次提交审核成功")
      router.push({ path: "/controller/index" });

    } else {
      tip.warning(result.message)
    }
    getContractList()
  })
}



import engineering from "./engineering/index.vue"
const engineeringRef = ref()
const openEngineering = () => {
  console.log("打开工程合同")
}

const inlineFile = ref(WAREHOUSE_CONTEXT_PATH + '/contract/inline-image/');
</script>

