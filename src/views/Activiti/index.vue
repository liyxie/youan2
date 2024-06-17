<template>
  <div class="containerBox" style="position: relative;">

    <ul class="buttons">
      <li class="item download">
        <a class="btn" @click="exportBPMN" ref="exportbtn">导出</a>
      </li>
      <li class="item submit">
        <a class="btn" @click="deploy">
          部署
        </a>
      </li>
    </ul>

    <div id="container" style="width: calc(100vw - 750px); height: calc(100vh - 150px)">
    </div>
    <div id="js-properties-panel" class="panel"></div>
  </div>
</template>
<script setup>
import {onMounted, markRaw, ref} from 'vue';

// bpmn-js相关
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';

// bpmn-js-properties-panel相关

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

import propertiesPanelModule from 'bpmn-js-properties-panel'

import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'

import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import translate from '@/common/bpmn/translate'
import {post, tip} from "@/common";


var customTranslateModule = {
  translate: ['value', translate]
}


let exportbtn = ref(null)
let bpmnModeler = ref(null);
let container = ref(null);
let canvas = ref(null);

onMounted(() => {
  init();
})

function init(){
  console.log("初始化")
  const containerEl = document.getElementById('container');

  //可操作时候创建实例为BpmnModeler
  bpmnModeler = new BpmnModeler({
    container: containerEl,
    propertiesPanel: {
      parent: '#js-properties-panel'
    },
    additionalModules: [
      //右侧工具栏以及节点
      propertiesProviderModule,
      propertiesPanelModule,
      //汉化
      customTranslateModule
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptor
    }
  })

  bpmnModeler.createDiagram(() => {
    bpmnModeler.get('canvas').zoom('fit-viewport');
  });
}

//导出按钮事件
function exportBPMN() {
  //saveXML为bpmn提供的api，用于保存为xml,并导出，第一个参数格式保存，正常一样，第二个参数的err为错误值，xml为导出的xml字符串
  bpmnModeler.saveXML({ format: true }, function (err, xml) {
    //此函数转码xml并下载，详情请看以下setEncoded定义
    setEncoded(
        exportbtn.value,
        "diagram.xml",
        //判断是否报错，报错则为null三元表达式
        err ? null : xml
    );
  });
  //向父组件传方法，用于后面的dialog消失以及列表更新
  // emits("handleExportSuccess")
}
// 设置高亮颜色的class（nodeCodes为需要设置高亮的节点ID数组，colorClass为设置的类名，canvas为画布对象）类名详情请看style样式
function setNodeColor(nodeCodes, colorClass, canvas) {
  for (let i = 0; i < nodeCodes.length; i++) {
    if (nodeCodes[i] == null) {
      continue
    } else {
      canvas.addMarker(nodeCodes[i], colorClass);
    }
  }
}
// 转码xml并下载
// @param {object} link 按钮（需要是dom对象）
// @param {string} name 下载名称 （文件名）任取
// @param {string} data base64XML
/**
 *
 * @param link 按钮对象
 * @param name 下载的xml文件名称
 * @param data xml文件流
 */
function setEncoded(link, name, data) {
  var encodedData = encodeURIComponent(data);
  if (data) {
    link.href="data:application/bpmn20-xml;charset=UTF-8," + encodedData
    link.download=name
  }
}

/**
 * 部署xml文件
 */
function deploy() {
  console.log()
  //获取bpmn产生的xml文件
  bpmnModeler.saveXML().then(res => {
    //此处为存入数据库的接口，此处需要你们后端根据自己项目去提供接口，有关activity流
    const formData = new FormData()
    formData.append("file",res.xml)
    formData.append("fileName","test")
    post('/activati/xml-upload', formData).then(result => {
      console.log(result)
    });
  })
}


</script>
<style>
.containerBox {
  height: calc(100vh - 160px);
  margin-top: 30px;
}

.containerBox #container {
  height: calc(100vh - 160px);
  border: 1px solid rgb(121, 121, 121);
}

.bpp-properties-panel [type=text] {
  box-sizing: border-box;
}

.panel {
  width: 400px;
  position: absolute;
  top: 1px;
  right: 1px;
  height: 100%;
  overflow: auto;
}

/* 右下角logo */
.bjs-powered-by {
  display: none;
}
</style>
