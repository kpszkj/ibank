//控制层
app.controller('buserController', function($scope, $controller, buserService) {

	$controller('baseController', {
		$scope: $scope
	}); //继承

	$scope.loginUser = {};

	// 扩展API加载完毕，现在可以正常调用扩展API
	function plusReady() {
		if (plus.navigator.hasNotchInScreen()) {
			plus.navigator.setFullscreen(false);
			plus.navigator.setStatusBarBackground("#D9579B");
		}
		ws = plus.webview.currentWebview();
		setTimeout(ws.show(), 500); //延迟创建子窗口避免影响窗口动画
		//监听返回键
		plus.key.addEventListener('backbutton', function() {
			back();
		}, false);

		//判断本地登录
		var token = getToken();
		if (token == null) {
			closeLoad();
		} else {
			//openView('index.html', 'zoom-out');
			location.href = 'index.html';
		}

	}

	// 判断扩展API是否准备，否则监听plusready事件
	$scope.init = function() {
		load();
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

	//读取列表数据绑定到表单中
	$scope.login = function() {
		loadDetail();
		buserService.login($scope.loginUser).success(
			function(rs) {
				if (rs.success) {
					plus.storage.setItem('token', rs.message);
					layer.msg('登陆成功');
					//openView('index.html', 'zoom-out');
					setTimeout(function() {
						location.href = 'index.html';
					}, 1500);
				} else {
					layer.msg(rs.message);
				}
				closeLoad();
			}
		);
	}

});
