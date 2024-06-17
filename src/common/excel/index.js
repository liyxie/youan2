/**
 * 封装请求组件
 * author: bobochang
 */
import {eltable_to_excel, export_json_to_excel} from './Export2Excel'

const $export2excel = function(columns, list, fileName){
  let tHeader = []
  let filterVal = []
  columns.forEach(item =>{
      tHeader.push(item.title)
      filterVal.push(item.key)
  })
  const data = list.map(v => filterVal.map(j => v[j]))
  export_json_to_excel(tHeader, data, fileName);
}
 
const $eltable2excel = function(id, fileName){
    eltable_to_excel(id, fileName)
}
export const export2excel = $export2excel;
export const eltable2excel = $eltable2excel;

export default {
   install(app) {
     app.config.globalProperties.$export = $export2excel;
   },
   export2excel: $export2excel, 
    eltable2excel: $eltable2excel
 };