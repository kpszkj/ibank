/* 
Date 
 */
//时间格式化    时间-->字符串
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
//时间格式化    字符串-->时间
function stringToDate(str) {
	var tempStrs = str.split(" ");
	var dateStrs = tempStrs[0].split("-");
	var year = parseInt(dateStrs[0], 10);
	var month = parseInt(dateStrs[1], 10) - 1;
	var day = parseInt(dateStrs[2], 10);
	var timeStrs = tempStrs[1].split(":");
	var hour = parseInt(timeStrs[0], 10);
	var minute = parseInt(timeStrs[1], 10);
	var second = parseInt(timeStrs[2], 10);
	var date = new Date(year, month, day, hour, minute, second);
	return date;
}



// 修改或添加键值(key-value)对数据到应用数据存储中
function setStorage(num) {
	plus.storage.setItem("test", num + '');
	plus.storage.setItem("time", new Date() + '');

}

// 获取存储的键值
function getStorage() {
	var test = plus.storage.getItem("test")
	//alert(plus.storage.getItem("test"));
	layer.msg(test);
	//alert(plus.storage.getLength());
}

/* 初始化 */
document.addEventListener('plusready', function() {
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。")
	var time = new Date().format("yyyy-MM-dd hh:mm:ss");

	var time1 = stringToDate('2021-01-21 15:22:00')
	var time2 = stringToDate('2020-10-30 03:00:01')

	if (plus.navigator.hasNotchInScreen()) {
		plus.navigator.setFullscreen(false);
		plus.navigator.setStatusBarBackground("#D9579B");
	}
	//alert(time1 > new Date());
});


/* app基本配置 */

// 配置数据访问基本路径
// var baseUrl = "http://bacim.kpszkj.cn/";
// var baseUrl = "http://localhost:8080/cim/";
// var baseUrl = "http://192.168.0.110:8080/cim/";
// var baseUrl = "http://app.fqxwhy.cn/";
//var baseUrl = "http://bacim.kpszkj.cn/";

// 配置当前文化馆标识
//var cid = 2;
//配置

/* app基本配置结束 */

/* 配置webview */

var wv;

function initWebView() {
	wv = plus.webview;
}

//打开新页面
function openView(url, type) {
	var nwv = createWithoutTitle(url, {
		backButtonAutoControl: 'true',
	});
	if (nwv != null) {
		nwv.show(type, 500, null);
	}
}

//返回上一级页面
function back() {
	ws = plus.webview.currentWebview();
	//ws.close('pop-out', 500, null);
	ws.close();
}

// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady() {
	initWebView();
	if (plus.navigator.hasNotchInScreen()) {
		plus.navigator.setFullscreen(false);
		plus.navigator.setStatusBarBackground("#c4aa82");
	}
	ws = plus.webview.currentWebview();
	setTimeout(ws.show(), 500); //延迟创建子窗口避免影响窗口动画
	//监听返回键
	plus.key.addEventListener('backbutton', function() {
		back();
	}, false);
}

// 判断扩展API是否准备，否则监听plusready事件
function initPlus() {
	//取消浏览器的所有事件，使得active的样式在手机上正常生效
	document.addEventListener('touchstart', function() {
		return false;
	}, true);
	// 禁止选择
	document.oncontextmenu = function() {
		return false;
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
}

/* 配置webview结束 */

