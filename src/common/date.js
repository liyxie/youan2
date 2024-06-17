// 格式化Date
export const dateFormat = function(date, fmt){
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      console.log(ret)
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}

// 将日期格式转为xxxx年xx月xx日
export const dateTransform = function (dateString){
    const date = new Date(dateString)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，加 1，并使用padStart方法
    const day = date.getDate().toString().padStart(2, '0'); // 使用padStart方法


    return year+"年"+month+"月"+day+"日"
}

// 获取日期的月和日
export const getDay = function (dateString){
    const date = new Date(dateString)
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，加 1，并使用padStart方法
    const day = date.getDate().toString().padStart(2, '0'); // 使用padStart方法
    return month+"月"+day+"日"
}