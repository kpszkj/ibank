//控制层
app.controller('recordController', function($scope, $controller, recordService) {

	$controller('baseController', {
		$scope: $scope
	}); //继承

	$scope.entity = {};

	// 扩展API加载完毕，现在可以正常调用扩展API
	function plusReady() {
		load();
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
		var id = plus.storage.getItem("recordId");
		$scope.findOne(id);
		plus.storage.removeItem("recordId");
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
			buserService.findOne($scope.entity.cphone).success(function(rs2) {
				$scope.cEntity = rs2;
			})
		})
		closeLoad();
	}

	//读取列表数据绑定到表单中
	$scope.findAll = function() {
		recordService.findAll().success(
			function(response) {
				$scope.list = response;
			}
		);
	}

	//分页
	$scope.findPage = function(page, rows) {
		recordService.findPage(page, rows).success(
			function(response) {
				$scope.list = response.rows;
				$scope.paginationConf.totalItems = response.total; //更新总记录数
			}
		);
	}

	//查询实体
	$scope.findOne = function(id) {
		var token = plus.storage.getItem("token");
		recordService.findOne(id,token).success(
			function(response) {
				$scope.entity = response;
			}
		);
	}

	//保存
	$scope.save = function() {
		var serviceObject; //服务层对象
		if ($scope.entity.id != null) { //如果有ID
			serviceObject = recordService.update($scope.entity); //修改
		} else {
			serviceObject = recordService.add($scope.entity); //增加
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


	//批量删除
	$scope.dele = function() {
		//获取选中的复选框
		recordService.dele($scope.selectIds).success(
			function(response) {
				if (response.success) {
					$scope.reloadList(); //刷新列表
					$scope.selectIds = [];
				}
			}
		);
	}

	$scope.searchEntity = {}; //定义搜索对象

	//搜索
	$scope.search = function(page) {
		$scope.searchEntity.token1 = plus.storage.getItem("token");
		$scope.name = plus.storage.getItem("name");
		$scope.cname = plus.storage.getItem("cname");
		recordService.search(page, $scope.pagination.pageSize, $scope.searchEntity).success(
			function(rs) {
				$scope.list = rs.entityList;
				$scope.pagination.totalItems = rs.total; //更新总记录数
				closeLoad();
			}
		);
	}

});
