<template>
  <div>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="第一步" description="上传合同附件" />
      <el-step title="第二步" description="检查合同信息" />
      <el-step title="第三步" description="选择材料比例" />
    </el-steps>
    <el-form ref="contractAddForm" :model="contractAdd" label-position="top" style="width: 100%;">
      <el-row>
        <el-col v-show="active===0">
          <el-form-item label="点击上传合同文件" prop="imgs" style="width: 130px;margin: auto;margin-top: 30px">
            <el-upload
                class="avatar-uploader"
                :action="WAREHOUSE_CONTEXT_PATH + '/file/upload-contract-annex'"
                :multiple="true"
                :on-change="handleAvatarChange"
                :on-success="(response, file, fileList) =>
      handleAvatarSuccess(response, file, fileList, 0)"
                :before-upload="beforeAvatarUpload"
            >
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="active===1">
          <el-form-item label="合同名称：" prop="contractName">
            <el-input v-model="contractAdd.contractName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="工程名称："  prop="projectName">
            <el-input v-model="contractAdd.projectName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="工程地点：" prop="workRegion">
            <el-input v-model="contractAdd.workRegion" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="签订甲方：" prop="otherCustomer">
            <el-input v-model="contractAdd.otherCustomer" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="签订乙方：" prop="company">
            <el-input v-model="contractAdd.company" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="签订地址：" prop="signingAddress">
            <el-input v-model="contractAdd.signingAddress" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="签订日期：" prop="signingDate">
            <el-input v-model="contractAdd.signingDate" autocomplete="off"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="active>=2">
          <el-form-item>
            <el-table :data="tableList" style="width: 100%;" :show-header="false" highlight-current-row @current-change="handleCurrentChange" :span-method="objectSpanMethod" max-height="300">
              <!-- 动态生成表格列 -->
              <el-table-column v-for="(value, key) in tableHeader" :key="key" :prop="key" :label="value" />
            </el-table>
          </el-form-item>
          <el-form-item label="生产数量：" prop="productNum">
            <el-input v-model="product.quantity" autocomplete="off" @change="changeQuantity"/>
          </el-form-item>
          <el-form-item label="使用原材料比例：" prop="productNum">
            <el-radio-group v-model="selectedRatio" class="ml-4" @change="ratioChanged">
              <el-radio label="1">系统默认比例</el-radio>
              <el-radio label="2">手动输入比例</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-for="item in ratioList" style="width: 100%">
            <span style="width: 100px;margin-left: 10px">原材料: {{item.materialName}}</span>
            <span style="width: 120px">系统占比: {{item.ratio}}</span>
            <el-input v-model="item.newRatio" autocomplete="off" placeholder="可输入自定义比例" style="width: 100px;float:right" v-if="showSureRatio" @change="changeRatio(item)"/>
            <span style="width: 130px;margin-left: 10px">在库数量: {{item.materialNum}}</span>
            <span style="width: 140px">合同所需数量: {{item.needNum}}</span>
          </el-form-item>
          <el-form-item v-if="showSureRatio">
            <el-button type="primary" @click="sureRatio">确认输入比例</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="addContract" v-show="active>=1">{{ submitContent }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {get, post, tip, WAREHOUSE_CONTEXT_PATH} from "@/common";
import {Plus} from "@element-plus/icons-vue";

const contractAdd = ref({contractName:"",projectName:""
  ,workRegion:"",otherCustomer:""
  ,company:"",signingAddress:"",signingDate:""
  ,productNum:"",ifPurchase:"3"});

const submitContent = ref("下一步")

// 读取到的表格数据
const tableList = ref([])
const tableHeader = ref({})
const tableCol = ref(0)

const active = ref(0) 

onMounted(hook => {
  // const test = "[{\"footer\":[{\"words\":\"2,结算工程数量以实际施工、双方实测数量为准；\",\"location\":[{\"x\":513,\"y\":3391},{\"x\":1978,\"y\":3405},{\"x\":1978,\"y\":3478},{\"x\":512,\"y\":3464}]},{\"words\":\"备注：1，上述单价为不含税；\",\"location\":[{\"x\":313,\"y\":3267},{\"x\":1159,\"y\":3274},{\"x\":1159,\"y\":3348},{\"x\":313,\"y\":3341}]}],\"header\":[{\"words\":\"施工所需人工、机械（含机械设备用油、机械工）以及其它必要的零星器\",\"location\":[{\"x\":327,\"y\":2080},{\"x\":2529,\"y\":2099},{\"x\":2528,\"y\":2172},{\"x\":326,\"y\":2153}]},{\"words\":\"要材料如沥青砼，乳化沥青油等材料由乙方提供，乙方所承包的单价包含\",\"location\":[{\"x\":329,\"y\":1960},{\"x\":2534,\"y\":1979},{\"x\":2533,\"y\":2052},{\"x\":329,\"y\":2032}]}],\"table_location\":[{\"x\":339,\"y\":2441},{\"x\":2500,\"y\":2441},{\"x\":2500,\"y\":3256},{\"x\":339,\"y\":3256}],\"body\":[{\"col_start\":0,\"row_start\":0,\"words\":\"序号\",\"col_end\":1,\"row_end\":1,\"cell_location\":[{\"x\":345,\"y\":2441},{\"x\":526,\"y\":2443},{\"x\":524,\"y\":2666},{\"x\":343,\"y\":2665}]},{\"col_start\":1,\"row_start\":0,\"words\":\"项目名称\",\"col_end\":2,\"row_end\":1,\"cell_location\":[{\"x\":526,\"y\":2443},{\"x\":1197,\"y\":2450},{\"x\":1195,\"y\":2673},{\"x\":524,\"y\":2666}]},{\"col_start\":2,\"row_start\":0,\"words\":\"规格\",\"col_end\":3,\"row_end\":1,\"cell_location\":[{\"x\":1197,\"y\":2450},{\"x\":1374,\"y\":2451},{\"x\":1372,\"y\":2675},{\"x\":1195,\"y\":2673}]},{\"col_start\":3,\"row_start\":0,\"words\":\"单位\",\"col_end\":4,\"row_end\":1,\"cell_location\":[{\"x\":1374,\"y\":2451},{\"x\":1574,\"y\":2454},{\"x\":1572,\"y\":2677},{\"x\":1372,\"y\":2675}]},{\"col_start\":4,\"row_start\":0,\"words\":\"综合单\\n价（元）\",\"col_end\":5,\"row_end\":1,\"cell_location\":[{\"x\":1574,\"y\":2454},{\"x\":1852,\"y\":2457},{\"x\":1850,\"y\":2679},{\"x\":1572,\"y\":2677}]},{\"col_start\":5,\"row_start\":0,\"words\":\"备注\",\"col_end\":6,\"row_end\":1,\"cell_location\":[{\"x\":1852,\"y\":2457},{\"x\":2500,\"y\":2463},{\"x\":2499,\"y\":2686},{\"x\":1850,\"y\":2679}]},{\"col_start\":0,\"row_start\":1,\"words\":\"1\",\"col_end\":1,\"row_end\":2,\"cell_location\":[{\"x\":343,\"y\":2665},{\"x\":524,\"y\":2666},{\"x\":522,\"y\":2861},{\"x\":342,\"y\":2860}]},{\"col_start\":1,\"row_start\":1,\"words\":\"厚4cm细粒式改性沥青\\nAC-13\",\"col_end\":2,\"row_end\":2,\"cell_location\":[{\"x\":524,\"y\":2666},{\"x\":1195,\"y\":2673},{\"x\":1193,\"y\":2868},{\"x\":522,\"y\":2861}]},{\"col_start\":2,\"row_start\":1,\"words\":\"\",\"col_end\":3,\"row_end\":2,\"cell_location\":[{\"x\":1195,\"y\":2673},{\"x\":1372,\"y\":2675},{\"x\":1371,\"y\":2869},{\"x\":1193,\"y\":2868}]},{\"col_start\":3,\"row_start\":1,\"words\":\"m2\",\"col_end\":4,\"row_end\":2,\"cell_location\":[{\"x\":1372,\"y\":2675},{\"x\":1572,\"y\":2677},{\"x\":1571,\"y\":2871},{\"x\":1371,\"y\":2869}]},{\"col_start\":4,\"row_start\":1,\"words\":\"55.00\",\"col_end\":5,\"row_end\":2,\"cell_location\":[{\"x\":1572,\"y\":2677},{\"x\":1850,\"y\":2679},{\"x\":1849,\"y\":2874},{\"x\":1571,\"y\":2871}]},{\"col_start\":5,\"row_start\":1,\"words\":\"采用SBS改性沥青，石料采\\n用反击破碎石（高标石）\",\"col_end\":6,\"row_end\":2,\"cell_location\":[{\"x\":1850,\"y\":2679},{\"x\":2499,\"y\":2686},{\"x\":2498,\"y\":2880},{\"x\":1849,\"y\":2874}]},{\"col_start\":0,\"row_start\":2,\"words\":\"2\",\"col_end\":1,\"row_end\":3,\"cell_location\":[{\"x\":342,\"y\":2860},{\"x\":522,\"y\":2861},{\"x\":521,\"y\":2986},{\"x\":341,\"y\":2984}]},{\"col_start\":1,\"row_start\":2,\"words\":\"沥青粘层油\",\"col_end\":2,\"row_end\":3,\"cell_location\":[{\"x\":522,\"y\":2861},{\"x\":1193,\"y\":2868},{\"x\":1192,\"y\":2992},{\"x\":521,\"y\":2986}]},{\"col_start\":2,\"row_start\":2,\"words\":\"\",\"col_end\":3,\"row_end\":3,\"cell_location\":[{\"x\":1193,\"y\":2868},{\"x\":1371,\"y\":2869},{\"x\":1369,\"y\":2994},{\"x\":1192,\"y\":2992}]},{\"col_start\":3,\"row_start\":2,\"words\":\"m2\",\"col_end\":4,\"row_end\":3,\"cell_location\":[{\"x\":1371,\"y\":2869},{\"x\":1571,\"y\":2871},{\"x\":1570,\"y\":2995},{\"x\":1369,\"y\":2994}]},{\"col_start\":4,\"row_start\":2,\"words\":\"2.50\",\"col_end\":5,\"row_end\":3,\"cell_location\":[{\"x\":1571,\"y\":2871},{\"x\":1849,\"y\":2874},{\"x\":1848,\"y\":2998},{\"x\":1570,\"y\":2995}]},{\"col_start\":5,\"row_start\":2,\"words\":\"采用PC-3沥青\",\"col_end\":6,\"row_end\":3,\"cell_location\":[{\"x\":1849,\"y\":2874},{\"x\":2498,\"y\":2880},{\"x\":2497,\"y\":3004},{\"x\":1848,\"y\":2998}]},{\"col_start\":0,\"row_start\":3,\"words\":\"3\",\"col_end\":1,\"row_end\":4,\"cell_location\":[{\"x\":341,\"y\":2984},{\"x\":521,\"y\":2986},{\"x\":520,\"y\":3111},{\"x\":340,\"y\":3110}]},{\"col_start\":1,\"row_start\":3,\"words\":\"旧路面铣刨\",\"col_end\":2,\"row_end\":4,\"cell_location\":[{\"x\":521,\"y\":2986},{\"x\":1192,\"y\":2992},{\"x\":1190,\"y\":3117},{\"x\":520,\"y\":3111}]},{\"col_start\":2,\"row_start\":3,\"words\":\"\",\"col_end\":3,\"row_end\":4,\"cell_location\":[{\"x\":1192,\"y\":2992},{\"x\":1369,\"y\":2994},{\"x\":1368,\"y\":3119},{\"x\":1190,\"y\":3117}]},{\"col_start\":3,\"row_start\":3,\"words\":\"m2\",\"col_end\":4,\"row_end\":4,\"cell_location\":[{\"x\":1369,\"y\":2994},{\"x\":1570,\"y\":2995},{\"x\":1569,\"y\":3121},{\"x\":1368,\"y\":3119}]},{\"col_start\":4,\"row_start\":3,\"words\":\"2.50\",\"col_end\":5,\"row_end\":4,\"cell_location\":[{\"x\":1570,\"y\":2995},{\"x\":1848,\"y\":2998},{\"x\":1847,\"y\":3124},{\"x\":1569,\"y\":3121}]},{\"col_start\":5,\"row_start\":3,\"words\":\"\",\"col_end\":6,\"row_end\":4,\"cell_location\":[{\"x\":1848,\"y\":2998},{\"x\":2497,\"y\":3004},{\"x\":2496,\"y\":3130},{\"x\":1847,\"y\":3124}]},{\"col_start\":0,\"row_start\":4,\"words\":\"\",\"col_end\":1,\"row_end\":5,\"cell_location\":[{\"x\":340,\"y\":3110},{\"x\":520,\"y\":3111},{\"x\":519,\"y\":3238},{\"x\":339,\"y\":3236}]},{\"col_start\":1,\"row_start\":4,\"words\":\"合计（元）\",\"col_end\":2,\"row_end\":5,\"cell_location\":[{\"x\":520,\"y\":3111},{\"x\":1190,\"y\":3117},{\"x\":1189,\"y\":3244},{\"x\":519,\"y\":3238}]},{\"col_start\":2,\"row_start\":4,\"words\":\"\",\"col_end\":3,\"row_end\":5,\"cell_location\":[{\"x\":1190,\"y\":3117},{\"x\":1368,\"y\":3119},{\"x\":1367,\"y\":3245},{\"x\":1189,\"y\":3244}]},{\"col_start\":3,\"row_start\":4,\"words\":\"m2\",\"col_end\":4,\"row_end\":5,\"cell_location\":[{\"x\":1368,\"y\":3119},{\"x\":1569,\"y\":3121},{\"x\":1568,\"y\":3247},{\"x\":1367,\"y\":3245}]},{\"col_start\":4,\"row_start\":4,\"words\":\"60.00\",\"col_end\":5,\"row_end\":5,\"cell_location\":[{\"x\":1569,\"y\":3121},{\"x\":1847,\"y\":3124},{\"x\":1846,\"y\":3250},{\"x\":1568,\"y\":3247}]},{\"col_start\":5,\"row_start\":4,\"words\":\"\",\"col_end\":6,\"row_end\":5,\"cell_location\":[{\"x\":1847,\"y\":3124},{\"x\":2496,\"y\":3130},{\"x\":2495,\"y\":3256},{\"x\":1846,\"y\":3250}]}]}]"
  // content2Table(test)
})

// 图片回显路径
const imageUrls = ref([]);
let imageList = ref([])
// 添加文件时的回显
const handleAvatarChange = (uploadFile) => {
  const reader = new FileReader();
  // 从上传组件中获取数据
  const image = uploadFile.raw;
  reader.readAsDataURL(image);
  // 读取文件的回调函数
  reader.onload = () => {
    // 将转化的url赋值给文件
    imageUrls.value.push(reader.result);
  };


  if(uploadFile.response != null){
    if (contractAdd.files == null || contractAdd.files == ""){
      contractAdd.files += uploadFile.response.path
    }else{
      contractAdd.files += "," + uploadFile.response.path
    }
  }
}

// 上传之前做简单验证
const beforeAvatarUpload = (rawFile) => {
  // if (rawFile.type !== 'image/jpg'
  //     && rawFile.type !== 'image/jpeg'
  //     && rawFile.type !== 'image/png'
  //     && rawFile.type !== 'image/gif'
  //     && rawFile.type !== 'image/svg'
  //     && rawFile.type !== 'image/webp'
  // ) {
  //   tip.error('只能上传图片格式!');
  //   return false 
  // } else if (rawFile.size / 1024 / 1024 > 5) {
  //   tip.error('上传文件不能大于5MB!');
  //   return false
  // }
  return true;
}

// 上传附件成功后的返回
const handleAvatarSuccess = (res, file, fileList, index) => {
  content2List(res.data.textList)
  content2Table(res.data.tableList)
  active.value +=1
}

// 接收的合同数据
const content2List = (textList) => {
  let json = JSON.parse(textList)
  let content = [];
  content.push(json[0].words)
  for (let i=0;i<json.length;i++){
    let colonIndex = json[i].words.indexOf("：");

    if (colonIndex !== -1) { // 如果找到冒号
      // 获取冒号后面的字符串，并去除空格
      let extractedText = json[i].words.substring(colonIndex + 1).trim();
      content.push(extractedText)
    }
  }
  let j = 0

  for(let i in contractAdd.value){
    contractAdd.value[i] = content[j]
    j++;
  }
}

// 接收的表格数据
const content2Table = (text) =>{
  let json = JSON.parse(text);
  let col = 1; // 合同的表格一行的列数
  for(let i =1;i<json[0].body.length;i++){
    if(json[0].body[i].col_end==1){
      break;
    }
    col++;
  }

  tableCol.value = col

  let tableContent = {}
  if (col<=6){
    tableContent = {id:'',productName:'',specs:'',unit:'',price:'',remarks:''}
    notMergedTable(tableContent,json,col)
  }else{
    tableContent = {id:'',productName:'',specs:'',unit:'',quantity:'',price:'',total:"",remarks:''}
    mergedTable(tableContent, json[0].body, col)
  }

  tableHeader.value = tableContent
}

// 需要处理合并单元格
const mergedTable = (tableContent,json,col) => {

  let contentList = []
  // 遍历数据，补全缺失列
  for (let i = 0; i < json.length-1; i++) {
    let prevCol = json[i + 1]; // 下一列数据
    let currentCol = json[i]; // 当前列数据
    let prevColEnd = prevCol.col_end; // 下一列位置
    let currentColStart = currentCol.col_end; // 当前列位置
    let row = json[i].row_start // 当前行位置
    // 计算缺失的列数
    let missingCols = currentColStart - prevColEnd; // 与下一列的差值

    if (missingCols!=-1 && missingCols!=7)
    {
      contentList.push(currentCol.words)
      if(prevCol.row_start == row+1){
        for (let i=1;i<=col-currentColStart;i++){
          let fillCol = currentColStart+i
          if (json.find(item => item.col_end === fillCol && item.row_start === row-1) != null){
            contentList.push(json.find(item => item.col_end === fillCol && item.row_start === row-1).words)
          }
        }
      }else{
        for (let i=1;i<prevColEnd-currentColStart;i++){
          let fillCol = currentColStart+i // 需要补充的列
          if (json.find(item => item.col_end === fillCol && item.row_start === row-1) != null){
            contentList.push(json.find(item => item.col_end === fillCol && item.row_start === row-1).words)
          }
        }
      }

    }else{
      contentList.push(currentCol.words)
    }
  }
  const keys = Object.keys(tableContent);

  for(let i =0;i<parseInt(contentList.length/col);i++){
    for (let index=0;index<col;index++){
      tableContent[keys[index]] = contentList[i*col+index]
    }
    if (tableContent.id != null && tableContent.id != ""){
      tableList.value.push(Object.assign({}, tableContent))
    }else{
      continue
    }
  }
}

// 不需要处理合并单元格
const notMergedTable = (tableContent,json,col) => {
  const keys = Object.keys(tableContent);

  for(let i =0;i<json[0].body.length/col;i++){
    for (let index=0;index<col;index++){
      tableContent[keys[index]] = json[0].body[i*col+index].words
    }
    tableList.value.push(Object.assign({}, tableContent))
  }
}

// 比例列表
const ratioList = ref([])
const ratioLists = ref([]) // 自定义的比例列表
const product = ref({})

// 选中的行内容，用于查询该产品的原材料和比例
const handleCurrentChange = (val) => {
  let productName = val.productName.replace(/\n/g, '')
  product.value = val

  get(`/product-material/ratio-name/${productName}`, ).then(result => {
    ratioList.value = result.data
    for (let index in ratioList.value){
      ratioList.value[index].newRatio = ratioList.value[index].ratio
      ratioList.value[index].needNum = ratioList.value[index].ratio * product.value.quantity
      ratioList.value[index].needNum = parseFloat(ratioList.value[index].needNum).toFixed(2).toString()
    }
  });
}

const contractAddForm = ref();

// 添加合同
const addContract = () => {
  if(active.value == 1){
    submitContent.value="确认"
  }
  if (active.value >= 2){
    contractAddForm.value.validate(valid => {
      if (valid) {
        let contractEginnerList = []
        // 舍弃头和尾
        for (let i in tableList.value){
          if (tableList.value[i].productName == "合计(元)" || tableList.value[i].productName == "项目名称"){
            continue;
          }else{
            contractEginnerList.push(tableList.value[i])
          }
        }
        contractAdd.value.ifPurchase = "3"
        contractAdd.value.contractEginnerList = contractEginnerList
        contractAdd.value.ratioLists = ratioLists.value
        console.log(contractAdd.value)

        post('/activiti/start-instance', contractAdd.value).then(result => {
          tip.success(result.message);
          visible.value = false; // 关闭对话框
        });
      }
    });
  }
  active.value+=1

}

// 选择的比例
const selectedRatio = ref('1')
const showSureRatio = ref(false)
const ratioChanged = () => {
  showSureRatio.value = !showSureRatio.value
  if (showSureRatio.value==false){
    for (let index in ratioList.value){
      ratioList.value[index].newRatio = ratioList.value[index].ratio
      ratioList.value[index].needNum = ratioList.value[index].ratio * product.value.quantity
      console.log(ratioList.value[index].ratio * product.value.quantity)
      ratioList.value[index].needNum = parseFloat(ratioList.value[index].needNum).toFixed(2).toString()
    }
  }
}

const sureRatio = () => {
  ratioLists.value.push(ratioList.value)
}

const objectSpanMethod = function ({ row, rowIndex, columnIndex }) {
  if (tableCol.value>=8){
    if (columnIndex === 4 || columnIndex === 5 || columnIndex === 6) {
      // 当列索引为 1（supplyName 列）或 2（totalAmount 列）时
      if (
          rowIndex > 0 &&
          row.quantity === tableList.value[rowIndex - 1].quantity &&
          row.price === tableList.value[rowIndex - 1].price &&
          row.total === tableList.value[rowIndex - 1].total
      ) {
        // 当前行的 supplyName 和 totalAmount 与上一行相同
        return {
          rowspan: 0,
          colspan: 0,
        };
      } else {
        // 当前行的 supplyName 和 totalAmount 与上一行不同，需要合并
        let rowspan = 1;
        for (let i = rowIndex + 1; i < tableList.value.length; i++) {
          if (
              row.quantity === tableList.value[i].quantity &&
              row.price === tableList.value[i].price &&
              row.total === tableList.value[i].total
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
  }
};

const changeQuantity = () => {
  for (let i in ratioList.value){
    ratioList.value[i].needNum = ratioList.value[i].ratio * product.value.quantity
    ratioList.value[i].needNum = parseFloat(ratioList.value[i].needNum).toFixed(2).toString()
  }
}

const changeRatio = (ratio) => {
  console.log("改变")
  ratio.needNum = ratio.newRatio * product.value.quantity
  ratio.needNum = parseFloat(ratio.needNum).toFixed(2).toString()
}
</script>

<style scoped>
.avatar-uploader-icon {
  margin: auto;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 95px;
  text-align: center;
}
</style>