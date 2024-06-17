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
          <el-form-item label="合同文件：" prop="imgs">
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
          <el-form-item prop="contractName">
            <span>合同名称：</span>
            <el-input v-model="contractAdd.contractName" autocomplete="off" style="width: 180px"/>
          </el-form-item>
          <el-form-item prop="projectName">
            <span>工程名称：</span>
            <el-input v-model="contractAdd.projectName" autocomplete="off" style="width: 180px"/>
          </el-form-item>
          <el-form-item prop="workRegion">
            <span>工程地点：</span>
            <el-input v-model="contractAdd.workRegion" autocomplete="off" style="width: 180px"/>
          </el-form-item>
          <el-form-item prop="otherCustomer">
            <span>签订甲方：</span>
            <el-input v-model="contractAdd.otherCustomer" autocomplete="off" style="width: 180px"/>
          </el-form-item>
          <el-form-item prop="company">
            <span>签订乙方：</span>
            <el-input v-model="contractAdd.company" autocomplete="off" style="width: 180px"/>
          </el-form-item>
          <el-form-item prop="signingAddress">
            <span>签订地址：</span>
            <el-input v-model="contractAdd.signingAddress" autocomplete="off" style="width: 180px"/>
          </el-form-item>
          <el-form-item prop="signingDate">
            <span>签订日期：</span>
            <el-input v-model="contractAdd.signingDate" autocomplete="off" style="width: 180px"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="active>=2">
          <el-form-item>
            <el-table :data="tableList" style="width: 100%;" :show-header="false" highlight-current-row @current-change="handleCurrentChange" :span-method="objectSpanMethod" max-height="300">
              <!-- 动态生成表格列 -->
              <el-table-column v-for="(value, key) in tableHeader" :key="key" :prop="key" :label="value" />
            </el-table>
          </el-form-item>
          <el-form-item label="生产数量：" prop="quantity" @change="changeQuantity">
            <el-input v-model="product.quantity" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="使用原材料比例：" prop="productNum">
            <el-radio-group v-model="selectedRatio" class="ml-4" @change="ratioChanged">
              <el-radio label="1">系统默认比例</el-radio>
              <el-radio label="2">手动输入比例</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-for="item in ratioList">
            <span>原材料: {{item.materialName}}</span>
            <span>系统占比: {{item.ratio}}</span>
            <el-input v-model="item.newRatio" autocomplete="off" placeholder="可输入自定义比例" style="width: 30%;float:right"/>
            <span>在库数量: {{item.materialNum}}</span>
            <span style="width: 140px">合同所需数量: {{item.needNum}}</span>
          </el-form-item>
          <el-form-item v-if="showSureRatio">
            <el-button type="primary" @click="sureRatio">确认输入比例</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" @click="addContract">{{ submitContent }}</el-button>
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

const c = ref([{"footer":[{"words":"备注：1，以上所述数量为暂定数量，结算数量以甲方确认工程量为结算依据。","location":[{"x":289,"y":2635},{"x":2494,"y":2649},{"x":2494,"y":2719},{"x":289,"y":2705}]},{"words":"以上所述单价为含税价，开具13%的增值税发票。","location":[{"x":289,"y":2781},{"x":1667,"y":2790},{"x":1667,"y":2860},{"x":289,"y":2851}]}],"header":[],"table_location":[{"x":294,"y":629},{"x":2372,"y":629},{"x":2372,"y":2316},{"x":294,"y":2316}],"body":[{"col_start":0,"row_start":0,"words":"序号","col_end":1,"row_end":1,"cell_location":[{"x":309,"y":629},{"x":545,"y":631},{"x":544,"y":782},{"x":308,"y":781}]},{"col_start":1,"row_start":0,"words":"结构层","col_end":2,"row_end":1,"cell_location":[{"x":545,"y":631},{"x":878,"y":633},{"x":877,"y":784},{"x":544,"y":782}]},{"col_start":2,"row_start":0,"words":"规格","col_end":3,"row_end":1,"cell_location":[{"x":878,"y":633},{"x":1117,"y":635},{"x":1115,"y":786},{"x":877,"y":784}]},{"col_start":3,"row_start":0,"words":"单位","col_end":4,"row_end":1,"cell_location":[{"x":1117,"y":635},{"x":1353,"y":637},{"x":1352,"y":787},{"x":1115,"y":786}]},{"col_start":4,"row_start":0,"words":"暂定\n数量","col_end":5,"row_end":1,"cell_location":[{"x":1353,"y":637},{"x":1592,"y":639},{"x":1590,"y":789},{"x":1352,"y":787}]},{"col_start":5,"row_start":0,"words":"单价\n(元)","col_end":6,"row_end":1,"cell_location":[{"x":1592,"y":639},{"x":1842,"y":640},{"x":1840,"y":790},{"x":1590,"y":789}]},{"col_start":6,"row_start":0,"words":"总价（元）","col_end":7,"row_end":1,"cell_location":[{"x":1842,"y":640},{"x":2138,"y":643},{"x":2136,"y":792},{"x":1840,"y":790}]},{"col_start":7,"row_start":0,"words":"备注","col_end":8,"row_end":1,"cell_location":[{"x":2138,"y":643},{"x":2372,"y":644},{"x":2370,"y":794},{"x":2136,"y":792}]},{"col_start":0,"row_start":1,"words":"1","col_end":1,"row_end":2,"cell_location":[{"x":308,"y":781},{"x":544,"y":782},{"x":541,"y":1079},{"x":305,"y":1078}]},{"col_start":1,"row_start":1,"words":"细粒式\nAC-13沥青\n混凝土上面\n层","col_end":2,"row_end":2,"cell_location":[{"x":544,"y":782},{"x":877,"y":784},{"x":874,"y":1081},{"x":541,"y":1079}]},{"col_start":2,"row_start":1,"words":"厚度\n4cm","col_end":3,"row_end":2,"cell_location":[{"x":877,"y":784},{"x":1115,"y":786},{"x":1113,"y":1083},{"x":874,"y":1081}]},{"col_start":3,"row_start":1,"words":"M2","col_end":4,"row_end":3,"cell_location":[{"x":1115,"y":786},{"x":1352,"y":787},{"x":1345,"y":1453},{"x":1109,"y":1451}]},{"col_start":4,"row_start":1,"words":"525","col_end":5,"row_end":3,"cell_location":[{"x":1352,"y":787},{"x":1589,"y":789},{"x":1583,"y":1455},{"x":1345,"y":1453}]},{"col_start":5,"row_start":1,"words":"92.5","col_end":6,"row_end":3,"cell_location":[{"x":1589,"y":789},{"x":1839,"y":790},{"x":1831,"y":1457},{"x":1583,"y":1455}]},{"col_start":6,"row_start":1,"words":"48562.5","col_end":7,"row_end":3,"cell_location":[{"x":1839,"y":790},{"x":2136,"y":792},{"x":2129,"y":1459},{"x":1831,"y":1457}]},{"col_start":7,"row_start":1,"words":"此单价\n为含13%","col_end":8,"row_end":2,"cell_location":[{"x":2136,"y":792},{"x":2370,"y":794},{"x":2367,"y":1092},{"x":2133,"y":1090}]},{"col_start":0,"row_start":2,"words":"2","col_end":1,"row_end":3,"cell_location":[{"x":305,"y":1078},{"x":541,"y":1079},{"x":537,"y":1448},{"x":301,"y":1446}]},{"col_start":1,"row_start":2,"words":"乳化沥青粘\n层油\n(PC-3)、\n铣刨","col_end":2,"row_end":3,"cell_location":[{"x":541,"y":1079},{"x":874,"y":1081},{"x":870,"y":1450},{"x":537,"y":1448}]},{"col_start":2,"row_start":2,"words":"","col_end":3,"row_end":3,"cell_location":[{"x":874,"y":1081},{"x":1113,"y":1083},{"x":1109,"y":1452},{"x":870,"y":1450}]},{"col_start":7,"row_start":2,"words":"增值税\n专用发\n票价格","col_end":8,"row_end":3,"cell_location":[{"x":2133,"y":1090},{"x":2367,"y":1092},{"x":2363,"y":1461},{"x":2129,"y":1460}]},{"col_start":0,"row_start":3,"words":"3","col_end":1,"row_end":4,"cell_location":[{"x":301,"y":1446},{"x":537,"y":1448},{"x":534,"y":1781},{"x":298,"y":1779}]},{"col_start":1,"row_start":3,"words":"细粒式\nAC-13沥青\n混凝土上面\n层","col_end":2,"row_end":4,"cell_location":[{"x":537,"y":1448},{"x":870,"y":1450},{"x":867,"y":1783},{"x":534,"y":1781}]},{"col_start":2,"row_start":3,"words":"厚度\n3cm","col_end":3,"row_end":4,"cell_location":[{"x":870,"y":1450},{"x":1109,"y":1452},{"x":1106,"y":1784},{"x":867,"y":1783}]},{"col_start":3,"row_start":3,"words":"M2","col_end":4,"row_end":6,"cell_location":[{"x":1109,"y":1451},{"x":1345,"y":1453},{"x":1338,"y":2232},{"x":1102,"y":2231}]},{"col_start":4,"row_start":3,"words":"526","col_end":5,"row_end":5,"cell_location":[{"x":1345,"y":1453},{"x":1583,"y":1455},{"x":1575,"y":2157},{"x":1338,"y":2155}]},{"col_start":5,"row_start":3,"words":"全包","col_end":6,"row_end":5,"cell_location":[{"x":1583,"y":1455},{"x":1831,"y":1457},{"x":1824,"y":2158},{"x":1575,"y":2157}]},{"col_start":6,"row_start":3,"words":"59664","col_end":7,"row_end":5,"cell_location":[{"x":1831,"y":1457},{"x":2129,"y":1459},{"x":2122,"y":2160},{"x":1824,"y":2158}]},{"col_start":7,"row_start":3,"words":"此单价\n为含13%\n增值税\n专用发\n票价格","col_end":8,"row_end":5,"cell_location":[{"x":2129,"y":1459},{"x":2363,"y":1461},{"x":2356,"y":2162},{"x":2122,"y":2160}]},{"col_start":0,"row_start":4,"words":"4","col_end":1,"row_end":5,"cell_location":[{"x":298,"y":1779},{"x":534,"y":1781},{"x":531,"y":2150},{"x":295,"y":2148}]},{"col_start":1,"row_start":4,"words":"乳化沥青粘\n层油\n(PC-3\n铣","col_end":2,"row_end":5,"cell_location":[{"x":534,"y":1781},{"x":867,"y":1783},{"x":864,"y":2152},{"x":531,"y":2150}]},{"col_start":2,"row_start":4,"words":"","col_end":3,"row_end":5,"cell_location":[{"x":867,"y":1783},{"x":1106,"y":1784},{"x":1103,"y":2154},{"x":864,"y":2152}]},{"col_start":0,"row_start":5,"words":"","col_end":1,"row_end":6,"cell_location":[{"x":295,"y":2148},{"x":531,"y":2150},{"x":530,"y":2228},{"x":294,"y":2226}]},{"col_start":1,"row_start":5,"words":"","col_end":6,"row_end":6,"cell_location":[{"x":530,"y":2149},{"x":1824,"y":2158},{"x":1823,"y":2236},{"x":529,"y":2227}]},{"col_start":6,"row_start":5,"words":"","col_end":7,"row_end":6,"cell_location":[{"x":1824,"y":2159},{"x":2122,"y":2161},{"x":2121,"y":2238},{"x":1823,"y":2236}]},{"col_start":7,"row_start":5,"words":"","col_end":8,"row_end":6,"cell_location":[{"x":2122,"y":2161},{"x":2356,"y":2163},{"x":2355,"y":2240},{"x":2121,"y":2238}]},{"col_start":0,"row_start":6,"words":"","col_end":1,"row_end":7,"cell_location":[{"x":294,"y":2226},{"x":530,"y":2228},{"x":529,"y":2303},{"x":294,"y":2302}]},{"col_start":1,"row_start":6,"words":"合计（元）","col_end":6,"row_end":7,"cell_location":[{"x":529,"y":2227},{"x":1823,"y":2236},{"x":1821,"y":2312},{"x":529,"y":2303}]},{"col_start":6,"row_start":6,"words":"108226.5","col_end":7,"row_end":7,"cell_location":[{"x":1823,"y":2236},{"x":2121,"y":2238},{"x":2120,"y":2314},{"x":1822,"y":2312}]},{"col_start":7,"row_start":6,"words":"","col_end":8,"row_end":7,"cell_location":[{"x":2121,"y":2238},{"x":2355,"y":2240},{"x":2354,"y":2316},{"x":2120,"y":2314}]}]}])

const submitContent = ref("下一步")

// 读取到的表格数据
const tableList = ref([])
const tableHeader = ref({})
const tableCol = ref(0)

const active = ref(2)

const next = () => {
  console.log(active.value)
  active.value+=1
  if(active.value == 2){
    submitContent.value="确认"
  }
  // if (active.value++ > 2) active.value = 0
}

onMounted(hook => {
  // const test = "[{\"footer\":[{\"words\":\"2,结算工程数量以实际施工、双方实测数量为准；\",\"location\":[{\"x\":513,\"y\":3391},{\"x\":1978,\"y\":3405},{\"x\":1978,\"y\":3478},{\"x\":512,\"y\":3464}]},{\"words\":\"备注：1，上述单价为不含税；\",\"location\":[{\"x\":313,\"y\":3267},{\"x\":1159,\"y\":3274},{\"x\":1159,\"y\":3348},{\"x\":313,\"y\":3341}]}],\"header\":[{\"words\":\"施工所需人工、机械（含机械设备用油、机械工）以及其它必要的零星器\",\"location\":[{\"x\":327,\"y\":2080},{\"x\":2529,\"y\":2099},{\"x\":2528,\"y\":2172},{\"x\":326,\"y\":2153}]},{\"words\":\"要材料如沥青砼，乳化沥青油等材料由乙方提供，乙方所承包的单价包含\",\"location\":[{\"x\":329,\"y\":1960},{\"x\":2534,\"y\":1979},{\"x\":2533,\"y\":2052},{\"x\":329,\"y\":2032}]}],\"table_location\":[{\"x\":339,\"y\":2441},{\"x\":2500,\"y\":2441},{\"x\":2500,\"y\":3256},{\"x\":339,\"y\":3256}],\"body\":[{\"col_start\":0,\"row_start\":0,\"words\":\"序号\",\"col_end\":1,\"row_end\":1,\"cell_location\":[{\"x\":345,\"y\":2441},{\"x\":526,\"y\":2443},{\"x\":524,\"y\":2666},{\"x\":343,\"y\":2665}]},{\"col_start\":1,\"row_start\":0,\"words\":\"项目名称\",\"col_end\":2,\"row_end\":1,\"cell_location\":[{\"x\":526,\"y\":2443},{\"x\":1197,\"y\":2450},{\"x\":1195,\"y\":2673},{\"x\":524,\"y\":2666}]},{\"col_start\":2,\"row_start\":0,\"words\":\"规格\",\"col_end\":3,\"row_end\":1,\"cell_location\":[{\"x\":1197,\"y\":2450},{\"x\":1374,\"y\":2451},{\"x\":1372,\"y\":2675},{\"x\":1195,\"y\":2673}]},{\"col_start\":3,\"row_start\":0,\"words\":\"单位\",\"col_end\":4,\"row_end\":1,\"cell_location\":[{\"x\":1374,\"y\":2451},{\"x\":1574,\"y\":2454},{\"x\":1572,\"y\":2677},{\"x\":1372,\"y\":2675}]},{\"col_start\":4,\"row_start\":0,\"words\":\"综合单\\n价（元）\",\"col_end\":5,\"row_end\":1,\"cell_location\":[{\"x\":1574,\"y\":2454},{\"x\":1852,\"y\":2457},{\"x\":1850,\"y\":2679},{\"x\":1572,\"y\":2677}]},{\"col_start\":5,\"row_start\":0,\"words\":\"备注\",\"col_end\":6,\"row_end\":1,\"cell_location\":[{\"x\":1852,\"y\":2457},{\"x\":2500,\"y\":2463},{\"x\":2499,\"y\":2686},{\"x\":1850,\"y\":2679}]},{\"col_start\":0,\"row_start\":1,\"words\":\"1\",\"col_end\":1,\"row_end\":2,\"cell_location\":[{\"x\":343,\"y\":2665},{\"x\":524,\"y\":2666},{\"x\":522,\"y\":2861},{\"x\":342,\"y\":2860}]},{\"col_start\":1,\"row_start\":1,\"words\":\"厚4cm细粒式改性沥青\\nAC-13\",\"col_end\":2,\"row_end\":2,\"cell_location\":[{\"x\":524,\"y\":2666},{\"x\":1195,\"y\":2673},{\"x\":1193,\"y\":2868},{\"x\":522,\"y\":2861}]},{\"col_start\":2,\"row_start\":1,\"words\":\"\",\"col_end\":3,\"row_end\":2,\"cell_location\":[{\"x\":1195,\"y\":2673},{\"x\":1372,\"y\":2675},{\"x\":1371,\"y\":2869},{\"x\":1193,\"y\":2868}]},{\"col_start\":3,\"row_start\":1,\"words\":\"m2\",\"col_end\":4,\"row_end\":2,\"cell_location\":[{\"x\":1372,\"y\":2675},{\"x\":1572,\"y\":2677},{\"x\":1571,\"y\":2871},{\"x\":1371,\"y\":2869}]},{\"col_start\":4,\"row_start\":1,\"words\":\"55.00\",\"col_end\":5,\"row_end\":2,\"cell_location\":[{\"x\":1572,\"y\":2677},{\"x\":1850,\"y\":2679},{\"x\":1849,\"y\":2874},{\"x\":1571,\"y\":2871}]},{\"col_start\":5,\"row_start\":1,\"words\":\"采用SBS改性沥青，石料采\\n用反击破碎石（高标石）\",\"col_end\":6,\"row_end\":2,\"cell_location\":[{\"x\":1850,\"y\":2679},{\"x\":2499,\"y\":2686},{\"x\":2498,\"y\":2880},{\"x\":1849,\"y\":2874}]},{\"col_start\":0,\"row_start\":2,\"words\":\"2\",\"col_end\":1,\"row_end\":3,\"cell_location\":[{\"x\":342,\"y\":2860},{\"x\":522,\"y\":2861},{\"x\":521,\"y\":2986},{\"x\":341,\"y\":2984}]},{\"col_start\":1,\"row_start\":2,\"words\":\"沥青粘层油\",\"col_end\":2,\"row_end\":3,\"cell_location\":[{\"x\":522,\"y\":2861},{\"x\":1193,\"y\":2868},{\"x\":1192,\"y\":2992},{\"x\":521,\"y\":2986}]},{\"col_start\":2,\"row_start\":2,\"words\":\"\",\"col_end\":3,\"row_end\":3,\"cell_location\":[{\"x\":1193,\"y\":2868},{\"x\":1371,\"y\":2869},{\"x\":1369,\"y\":2994},{\"x\":1192,\"y\":2992}]},{\"col_start\":3,\"row_start\":2,\"words\":\"m2\",\"col_end\":4,\"row_end\":3,\"cell_location\":[{\"x\":1371,\"y\":2869},{\"x\":1571,\"y\":2871},{\"x\":1570,\"y\":2995},{\"x\":1369,\"y\":2994}]},{\"col_start\":4,\"row_start\":2,\"words\":\"2.50\",\"col_end\":5,\"row_end\":3,\"cell_location\":[{\"x\":1571,\"y\":2871},{\"x\":1849,\"y\":2874},{\"x\":1848,\"y\":2998},{\"x\":1570,\"y\":2995}]},{\"col_start\":5,\"row_start\":2,\"words\":\"采用PC-3沥青\",\"col_end\":6,\"row_end\":3,\"cell_location\":[{\"x\":1849,\"y\":2874},{\"x\":2498,\"y\":2880},{\"x\":2497,\"y\":3004},{\"x\":1848,\"y\":2998}]},{\"col_start\":0,\"row_start\":3,\"words\":\"3\",\"col_end\":1,\"row_end\":4,\"cell_location\":[{\"x\":341,\"y\":2984},{\"x\":521,\"y\":2986},{\"x\":520,\"y\":3111},{\"x\":340,\"y\":3110}]},{\"col_start\":1,\"row_start\":3,\"words\":\"旧路面铣刨\",\"col_end\":2,\"row_end\":4,\"cell_location\":[{\"x\":521,\"y\":2986},{\"x\":1192,\"y\":2992},{\"x\":1190,\"y\":3117},{\"x\":520,\"y\":3111}]},{\"col_start\":2,\"row_start\":3,\"words\":\"\",\"col_end\":3,\"row_end\":4,\"cell_location\":[{\"x\":1192,\"y\":2992},{\"x\":1369,\"y\":2994},{\"x\":1368,\"y\":3119},{\"x\":1190,\"y\":3117}]},{\"col_start\":3,\"row_start\":3,\"words\":\"m2\",\"col_end\":4,\"row_end\":4,\"cell_location\":[{\"x\":1369,\"y\":2994},{\"x\":1570,\"y\":2995},{\"x\":1569,\"y\":3121},{\"x\":1368,\"y\":3119}]},{\"col_start\":4,\"row_start\":3,\"words\":\"2.50\",\"col_end\":5,\"row_end\":4,\"cell_location\":[{\"x\":1570,\"y\":2995},{\"x\":1848,\"y\":2998},{\"x\":1847,\"y\":3124},{\"x\":1569,\"y\":3121}]},{\"col_start\":5,\"row_start\":3,\"words\":\"\",\"col_end\":6,\"row_end\":4,\"cell_location\":[{\"x\":1848,\"y\":2998},{\"x\":2497,\"y\":3004},{\"x\":2496,\"y\":3130},{\"x\":1847,\"y\":3124}]},{\"col_start\":0,\"row_start\":4,\"words\":\"\",\"col_end\":1,\"row_end\":5,\"cell_location\":[{\"x\":340,\"y\":3110},{\"x\":520,\"y\":3111},{\"x\":519,\"y\":3238},{\"x\":339,\"y\":3236}]},{\"col_start\":1,\"row_start\":4,\"words\":\"合计（元）\",\"col_end\":2,\"row_end\":5,\"cell_location\":[{\"x\":520,\"y\":3111},{\"x\":1190,\"y\":3117},{\"x\":1189,\"y\":3244},{\"x\":519,\"y\":3238}]},{\"col_start\":2,\"row_start\":4,\"words\":\"\",\"col_end\":3,\"row_end\":5,\"cell_location\":[{\"x\":1190,\"y\":3117},{\"x\":1368,\"y\":3119},{\"x\":1367,\"y\":3245},{\"x\":1189,\"y\":3244}]},{\"col_start\":3,\"row_start\":4,\"words\":\"m2\",\"col_end\":4,\"row_end\":5,\"cell_location\":[{\"x\":1368,\"y\":3119},{\"x\":1569,\"y\":3121},{\"x\":1568,\"y\":3247},{\"x\":1367,\"y\":3245}]},{\"col_start\":4,\"row_start\":4,\"words\":\"60.00\",\"col_end\":5,\"row_end\":5,\"cell_location\":[{\"x\":1569,\"y\":3121},{\"x\":1847,\"y\":3124},{\"x\":1846,\"y\":3250},{\"x\":1568,\"y\":3247}]},{\"col_start\":5,\"row_start\":4,\"words\":\"\",\"col_end\":6,\"row_end\":5,\"cell_location\":[{\"x\":1847,\"y\":3124},{\"x\":2496,\"y\":3130},{\"x\":2495,\"y\":3256},{\"x\":1846,\"y\":3250}]}]}]"
  // content2Table(test)
  content2Table(c.value)
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
  // console.log(active.value)
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
const content2Table = (json) =>{
  // let json = JSON.parse(text);
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
  // contractAdd.value.productNum = val.quantity
  product.value = val
  get(`/product-material/ratio-name/${productName}`, ).then(result => {
    ratioList.value = result.data
    for (let index in ratioList.value){
      ratioList.value[index].newRatio = ratioList.value[index].ratio
    }
  });
}

const contractAddForm = ref();

// 添加合同
const addContract = () => {
  console.log(active.value)
  if(active.value == 1){
    submitContent.value="确认"
  }
  if (active.value >= 2){
    console.log("请求")
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
        contractAdd.value.contractEginnerList = contractEginnerList
        contractAdd.value.ratioLists = ratioLists.value

        console.log(contractAdd.value)
        // post('/activiti/start-instance', contractAdd.value).then(result => {
        //   // tip.success(result.message);
        //   // visible.value = false; // 关闭对话框
        // });
      }
    });
  }
  active.value+=1

}

// 选择的比例
const selectedRatio = ref('1')
const ratioChanged = () => {
  showSureRatio.value = !showSureRatio.value
}
const showSureRatio = ref(false)
const sureRatio = () => {
  ratioLists.value.push(ratioList.value)
}

const objectSpanMethod = function ({ row, rowIndex, columnIndex }) {
  console.log(tableCol.value)
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
  console.log(product.value.quantity)
  for (let i in ratioList.value){
    console.log(ratioList.value[i].ratio * product.value.quantity)
    ratioList.value[i].needNum = ratioList.value[i].ratio * product.value.quantity
    ratioList.value[i].needNum = parseFloat(ratioList.value[i].needNum).toFixed(2).toString()
  }
}
 
const changeRatio = (ratio) => {
  ratio.needNum = ratio.newRatio * product.value.quantity
  ratio.needNum = parseFloat(ratio.needNum).toFixed(2).toString()
}
</script>

<style scoped>

</style>
<style scoped>

</style>