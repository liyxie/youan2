<template>
  <!-- 供应商关联材料页面 -->
  <div>
    <el-form inline class="searchForm">
      <el-form-item>
        <el-input v-model="params.materialName" placeholder="材料名称" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.concat" placeholder="联系人" style="width: 120px;"  clearable></el-input>
      </el-form-item>
      <el-form-item label="检验状态:" style="margin-left: 20px;">
        <el-select v-model="params.inspectionResult" placeholder="检验状态" style="width: 120px;" clearable>
          <el-option label="未审核" value="0"></el-option>
          <el-option label="未通过" value="1"></el-option>
          <el-option label="已通过" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProvidePageList">
          <el-icon>
            <svg t="1646977561352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3057" width="200" height="200"><path d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704" p-id="3058"></path></svg>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="openProvideAdd()">
        <el-icon>
          <svg t="1646977404025" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2197" width="200" height="200"><path d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z" p-id="2198"></path></svg>
        </el-icon>
        &nbsp;添加
      </el-button>
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
  <el-table :data="providePageList" style="width: 100%; margin-top: 10px;" table-layout="auto" size="large" border stripe>
    <el-table-column type="index" width="50" />
    <el-table-column prop="materialName" label="材料名称" sortable />
    <el-table-column prop="supplyName" label="供应商名称" sortable />
    <el-table-column prop="quotation" label="报价" sortable />
    <el-table-column label="审核状态" width="120">
      <template #default="props">
        <span :class="{red:props.row.inspectionResult ==='0' || props.row.inspectionResult ==='1'}">
          {{
            props.row.inspectionResult === '0' ? '未审核'
                : props.row.inspectionResult === '1' ? '审核未通过'
                    : props.row.inspectionResult === '2' ? '审核通过'
                      : '其他'
          }}
        </span>
      </template>
    </el-table-column>    
    <el-table-column label="相关附件">
      <template #default="props">
        <el-link type="primary" @click.prevent="openProvideDateil(props.row)" style="margin-right: 8px">查看详情</el-link>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="props">
        <el-button type="primary" title="修改" :icon="Edit" circle @click="openProvideUpdate(props.row)" />
        <el-button type="danger" title="删除" :icon="Delete" circle @click="deleteProvid(props.row.id)" />
        <el-link type="primary" @click="again(props.row.id)"
                 v-if="props.row.inspectionResult == '1'"
                 style="margin-right: 8px">再次提交审核
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

  <provide-add ref="provideAddRef" @ok="getProvidePageList"></provide-add>

  <provide-update ref="provideUpdateRef" @ok="getProvidePageList"></provide-update>

  <provide-detail ref="provideDetailRef"></provide-detail>

</template>

<script setup>
import { reactive, ref } from 'vue';
import {get, put, del, tip, export2excel, WAREHOUSE_CONTEXT_PATH, post} from "@/common";
import { useRouter } from "vue-router";
import { Search, Edit, Check, Message, Star, Delete } from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  materialName: '',
  inspectionResult: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const providePageList = ref();

// 获取分页模糊查询结果
const getProvidePageList = () => {
  console.log(params)
  get("/inspect/inspect-page-list", params).then(result => {
    providePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getProvidePageList();

// 导出数据
const export2Table = () => {
  get("/supply/exportTable", params).then(result => {
    // 要导出的数据
    const storeList = result.data;
    const columns = [
      {"title": "供应商ID", "key": "supplyId"},
      {"title": "供应商编号", "key": "supplyNum"},
      {"title": "供应商名称", "key": "supplyName"},
      {"title": "地址", "key": "address"},
      {"title": "联系人", "key": "concat"},
      {"title": "电话", "key": "phone"},
      {"title": "供应商介绍", "key": "supplyIntroduce"},
    ];
    export2excel(columns, storeList, "供应商信息表");
  });
}

// 添加
import ProvideAdd from "./provide-add.vue";
const provideAddRef = ref();
const openProvideAdd = () => {
  provideAddRef.value.open();
};

// 修改
import ProvideUpdate from "./provide-update.vue";
const provideUpdateRef = ref();
const openProvideUpdate = (provide) => {
  provideUpdateRef.value.open(provide);
};


// 删除供应商
const deleteProvid = (id) => {
  console.log(id)
  del(`/inspect/inspect-delete/${id}`, null, { title: "提示", message: "您确定删除该材料吗？" }).then(result => {
    tip.success(result.message);
    // 重新查询
    getProvidePageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getProvidePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getProvidePageList();
}

const again = (id) => {
  console.log(id)
  let data = {
    id: id
  }
  post("/inspect/inspect-again", data).then(result => {
    if(result.message === "提交成功"){
      tip.success(result.message)
      getProvidePageList()
    }else {
      tip.warning(result.message)
    }
  })
}

import ProvideDetail from "../provide/provide-detail.vue";
const provideDetailRef = ref();
const openProvideDateil = (provide) => {
  provideDetailRef.value.open(provide);
};

// 下载合同照片
const downloadFiles = (provide) => {
  // 构建带参数的 URL
  const url = WAREHOUSE_CONTEXT_PATH+`/inspect/download-images/`+provide.id;

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
        link.setAttribute('download', 'images.zip');

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