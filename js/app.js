//var baseUrl = "http://192.168.0.110:8080/fhxy/";
var baseUrl = "http://101.201.149.195:1314/";
//Date

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

//Date


// 修改或添加键值(key-value)对数据到应用数据存储中
/*function setStorage(num) {
    plus.storage.setItem("test", num + '');
    plus.storage.setItem("time", new Date() + '');
}*/
// 获取存储的键值
/*function getStorage() {
    var test = plus.storage.getItem("test");
    //alert(plus.storage.getItem("test"));
    layer.msg(test);
    //alert(plus.storage.getLength());
}*/

/* 初始化 */
/*document.addEventListener('plusready', function () {
    //console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。")
    var time = new Date().format("yyyy-MM-dd hh:mm:ss");

    var time1 = stringToDate('2021-01-21 15:22:00')
    var time2 = stringToDate('2020-10-30 03:00:01')

    if (plus.navigator.hasNotchInScreen()) {
        plus.navigator.setFullscreen(false);
        plus.navigator.setStatusBarBackground("#D9579B");
    }
    //alert(time1 > new Date());
});*/

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
	ws.close('pop-out', 500, null);
	//ws.close();
}

//退出应用
function quit() {
	var quit = plus.storage.getItem("quitStatus");
	//console.log(quit);
	//console.log(quit == "1");
	//layer.msg(quit);
	if (quit == null || quit == "1") {
		//console.log(quit);
		layer.msg("再按一次返回退出");
		plus.storage.setItem("quitStatus", "2");
		setTimeout(function() {
			plus.storage.setItem("quitStatus", "1");
		}, 2000)
		return null;
	} else {
		plus.storage.setItem("quitStatus", "1");
		plus.runtime.quit();
	}

	return null;
}

function backRecord() {
	ws = plus.webview.currentWebview();
	var wvs = plus.webview.all();
	for (var i = 0; i < wvs.length; i++) {
		if (ws != wvs[i]) {
			wvs[i].close();
		}
	}
	openView('record.html');
	ws.close('pop-out', 500, null);
	//ws.close();
}

function backMe() {
	ws = plus.webview.currentWebview();
	var wvs = plus.webview.all();
	for (var i = 0; i < wvs.length; i++) {
		if (ws != wvs[i]) {
			wvs[i].close();
		}
	}
	openView('me.html');
	ws.close('pop-out', 500, null);
	//ws.close();
}


function backIndex() {
	ws = plus.webview.currentWebview();
	var wvs = plus.webview.all();
	for (var i = 0; i < wvs.length; i++) {
		if (ws != wvs[i]) {
			wvs[i].close();
		}
	}
	openView('index.html');
	ws.close('pop-out', 500, null);
	//ws.close();
}

function getToken() {
	var token = plus.storage.getItem("token");
	if (isEmpty(token)) {
		return null;
	} else {
		return token;
	}
}

function load() {
	$("#load").show();
	$("#main").hide();
}

function loadDetail() {
	$("#load").show();
}

function closeLoad() {
	$("#load").hide();
	$("#all").show();
	$("#main").show();
}



function createDownload(url) {
	$("#update").show();
	var dtask = plus.downloader.createDownload(url, {}, function(d,
		status) {
		// 下载完成
		if (status == 200) {
			/* var num = dtask.totalSize / 1024 / 1024;

			var num1 = parseFloat(num).toFixed(2)

			alert(num1); */
			layer.msg("下载完成" + d.filename + "即将安装！");
			setTimeout(function() {
				clearInterval(a);
				$("#update").hide();
				plus.runtime.install(d.filename);
			}, 1500)
		} else {
			console.log("Download failed: " + status);
		}
	});
	//dtask.addEventListener("statechanged", onStateChanged, false);
	dtask.start();
	var a = setInterval(function() {
		updateTask(dtask);
	}, 50)
	//alert(1)
}

function updateTask(task) {
	$("#dSize").text(parseFloat(task.downloadedSize / 1024 / 1024).toFixed(2) + "MB");
	$("#tSize").text(parseFloat(task.totalSize / 1024 / 1024).toFixed(2) + "MB");
	var num = 180 * task.downloadedSize / task.totalSize;
	//console.log(num);
	document.getElementById("width").style.width = num + "px";
}

function toHref(url) {
	plus.storage.setItem("quitStatus", "1");
	location.href = url;
}


function getValue() {
	if (plus.os.name == 'iOS') {
		var UIPasteboard = plus.ios.importClass("UIPasteboard");
		var generalPasteboard = UIPasteboard.generalPasteboard();
		var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
		// value就是粘贴板的值  
		return value;
	} else if (plus.os.name == 'Android') {
		var Context = plus.android.importClass("android.content.Context");
		var main = plus.android.runtimeMainActivity();
		var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
		var value = plus.android.invoke(clip, "getText");
		// value就是粘贴板的值  
		return value;
	}
}

function addContent() {
	var content = getValue();
	$("#info").val(content);
}

function delContent() {
	$("#info").val("");
}

function has_scrollbar() {
	const elem = document.getElementById("info");
	if (elem.clientHeight < elem.scrollHeight) {
		//alert("The element has a vertical scrollbar!");
		$("#infoTip").css("visibility", "visible");
	} else {
		//alert("The element doesn't have a vertical scrollbar.");
	}
}
