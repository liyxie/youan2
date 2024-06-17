// 日志函数
function logging(message, result){
	var currentDate = new Date();
	var year = currentDate.getFullYear(); // 获取当前的年份
	var month = currentDate.getMonth() + 1; // 获取当前的月份（注意：月份是从0开始计算的，所以需要加1）
	var day = currentDate.getDate(); // 获取当前的日期
	var hours = currentDate.getHours(); // 获取当前的小时
	var minutes = currentDate.getMinutes(); // 获取当前的分钟
	var seconds = currentDate.getSeconds(); // 获取当前的秒
	
	// 格式化为"年-月-日 时:分:秒"的格式
	var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
	console.log(formattedDateTime,message,result)
}

// 时间格式转化函数
function format(currentDate){
	var year = currentDate.getFullYear(); // 获取当前的年份
	var month = currentDate.getMonth() + 1; // 获取当前的月份（注意：月份是从0开始计算的，所以需要加1）
	var day = currentDate.getDate(); // 获取当前的日期
	var hours = currentDate.getHours(); // 获取当前的小时
	var minutes = currentDate.getMinutes(); // 获取当前的分钟
	var seconds = currentDate.getSeconds(); // 获取当前的秒
	
	// 格式化为"年-月-日 时:分:秒"的格式
	var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
	return formattedDateTime;
}
	
// 检查权限函数
function checkPermission(user_permission,need_permission){
	var flag = false 
	flag = need_permission.some(function(value) {
	  return user_permission.includes(value);
	});
	return flag;
}

export default {
  logging,
  checkPermission,
  format
}