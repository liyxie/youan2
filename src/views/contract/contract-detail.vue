<template>
  <!-- 修改用户对话框 -->
  <el-dialog v-model="visible" title="合同详情" width="25%">
    <el-form :model="contractDetail" label-position="top">
      <el-form-item label="生产产品：" prop="productName">
        <el-input v-model="contractDetail.productName" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="生产数量：" prop="productNum">
        <el-input v-model="contractDetail.productNum" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="工期开始时间：" prop="startTime">
        <el-input v-model="contractDetail.startTime" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="工期结束时间：" prop="endTime">
        <el-input v-model="contractDetail.endTime" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="材料比例：">
        <el-tag
            v-for="tag in ratioDetails"
            :key="tag.name"
            class="mx-1"
        >
          <div>原材料: {{ tag.materialName }}</div>
          占比: {{ tag.ratio }}
        </el-tag>
      </el-form-item>
      <el-form-item label="原材料：">
        <el-select v-model="contractDetail.materialId" style="width: 120px;" clearable @change="handleSelectMaterial">
          <el-option v-for="material of ratioDetails" :label="material.materialName" :value="material.materialId"
                     :key="material.materialId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库数量："
                    :style="{ color: materialNum < needNum ? 'red' : 'black', fontWeight: materialNum < needNum ? 'bold' : 'normal' }">
        {{ materialNum }}
      </el-form-item>
      <el-form-item label="需要数量：">
        <el-input v-model="needNum" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="合同照片：">
        <div class="demo-image__preview">
          <el-image
              style="width: 100px; height: 100px"
              :src="imageList[0]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="imageList"
              :initial-index="4"
              fit="cover"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="close">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {get, put, tip, WAREHOUSE_CONTEXT_PATH} from "@/common";

// 该页面的可见性
const visible = ref(false);
// 合同详情
const contractDetail = reactive({});


// 图片回显路径
const imageUrl = ref('');

// 表格列表
const ratioDetails = ref({materialId: '', materialName: ''});

// 图片列表
const imageList = ref([])

// 该对话框打开并初始化
const open = (contractRow) => {
  for (let prop in contractRow) {
    contractDetail[prop] = contractRow[prop];
  }
  visible.value = true;

  // 查询该合同需要生产的产品的配料比
  get(`/product-material/ratio/${contractRow.productId}`).then(result => {
    ratioDetails.value = result.data;
  });

  imageList.value = []
  let resultList = []
  resultList = contractDetail.files.split(",");

  resultList.forEach(function (item) {
    imageList.value.push(WAREHOUSE_CONTEXT_PATH + '/contract/inline-image/' + item)
  });
};

// 关闭
const close = () => {
  visible.value = false
  imageList.value = []
}

// 生产所需要的量
const needNum = ref(0);
// 仓库还剩余的量
const materialNum = ref();
// 选择不同材料的时候计算出生产所需的用量和仓库所剩的用量
const handleSelectMaterial = () => {
  materialNum.value = ratioDetails.value.find(item => item.materialId === contractDetail.materialId).materialNum
  needNum.value = ratioDetails.value.find(item => item.materialId === contractDetail.materialId).ratio * contractDetail.productNum
}
defineExpose({open});
</script>
<style scoped>
.avatar-uploader, .avatar-uploader .avatar {
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

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>