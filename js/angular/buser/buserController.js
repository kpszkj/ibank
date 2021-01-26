//控制层
app.controller('buserController', function($scope, $controller, buserService) {

	$controller('baseController', {
		$scope: $scope
	}); //继承

	$scope.entity = {};
	$scope.cEntity = {};

	// 扩展API加载完毕，现在可以正常调用扩展API
	function plusReady() {
		loadDetail();
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
		$scope.initData();
	}

	// 判断扩展API是否准备，否则监听plusready事件
	$scope.init = function() {
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

	$scope.initData = function() {
		$scope.entity.token = plus.storage.getItem("token");
		buserService.findOneByToken($scope.entity.token).success(function(rs) {
			$scope.entity = rs;
			plus.storage.setItem("name", $scope.entity.nickname);
			buserService.findOne($scope.entity.cphone).success(function(rs2) {
				$scope.cEntity = rs2;
				plus.storage.setItem("cname", $scope.cEntity.nickname);
			})
		})
		closeLoad();
	}

	//读取列表数据绑定到表单中
	$scope.logout = function() {
		loadDetail();
		plus.storage.removeItem("token");
		layer.msg('退出成功');
		closeLoad();
		setTimeout(function() {
			location.href = 'init.html';
		}, 1500);
	}

	//读取列表数据绑定到表单中
	$scope.findAll = function() {
		buserService.findAll().success(
			function(response) {
				$scope.list = response;
			}
		);
	}

	//分页
	$scope.findPage = function(page, rows) {
		buserService.findPage(page, rows).success(
			function(response) {
				$scope.list = response.rows;
				$scope.paginationConf.totalItems = response.total; //更新总记录数
			}
		);
	}

	//查询实体
	$scope.findOne = function(id) {
		buserService.findOne(id).success(
			function(response) {
				$scope.entity = response;
			}
		);
	}

	//保存
	$scope.save = function() {
		var serviceObject; //服务层对象
		if ($scope.entity.id != null) { //如果有ID
			serviceObject = buserService.update($scope.entity); //修改
		} else {
			serviceObject = buserService.add($scope.entity); //增加
		}
		serviceObject.success(
			function(response) {
				if (response.success) {
					//重新查询
					$scope.reloadList(); //重新加载
				} else {
					alert(response.message);
				}
			}
		);
	}

	$scope.searchEntity = {}; //定义搜索对象

	//搜索
	$scope.search = function(page, rows) {
		buserService.search(page, rows, $scope.searchEntity).success(
			function(response) {
				$scope.list = response.rows;
				$scope.paginationConf.totalItems = response.total; //更新总记录数
			}
		);
	}

});
