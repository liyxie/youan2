<template>
  <!-- 添加合同对话框 -->
  <el-dialog v-model="visible" title="添加合同" width="800px" @close="close" destroy-on-close>
    <el-form>
      <el-form-item label="退回原因：" prop="reason">
        <el-input v-model="reason" autocomplete="off"/>
      </el-form-item>
<!--      <el-form-item label="是否需要采购：">-->
<!--        <el-select v-model="data.ifPurchase" autocomplete="off">-->
<!--          <el-option label="无需采购" value="0"></el-option>-->
<!--          <el-option label="需要采购" value="1"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
    </el-form>
 
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="define">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH, get} from "@/common";
import {useRouter} from "vue-router";

const router = useRouter(); // 获取路由器

const visible = ref(false); // 该页面的可见性

// 关闭
const close = () => {
  visible.value = false;
}

const rules = reactive({
  contractName: [
    {required: true, message: '请输入合同名', trigger: 'blur'}
  ],
})

const data = ref()
// 该对话框打开
const open = (contract) => {
  visible.value = true;
  data.value = contract
  console.log(data.value.ifPurchase)
  switch (data.value.ifPurchase){
    case "1": data.value.ifPurchase="0";break;
    case "0": data.value.ifPurchase="1";break;
  }
};

const reason = ref()

const emit = defineEmits(["ok"]);

const define = () => {
  data.value.reason = reason.value

  post("/contract/contract-reject", data.value).then(result => {
    if(result.message === "退回成功"){
      tip.success(result.message)
      visible.value = false
      router.push({ path: "/controller/index" });

    }else {
      tip.warning(result.message)
    }
  })
}
defineExpose({open});
</script>
<style scoped>
.avatar-uploader, .avatar-uploader .avatar{
  width: 100px;
  height: 100px;
  display: block;
}
</style>