//控制层
app.controller('recordController', function($scope, $controller, recordService) {

	$controller('baseController', {
		$scope: $scope
	}); //继承

	$scope.entity = {};
	$scope.cEntity = {};
	$scope.recordEntity = {
		"score": 20
	};

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
		document.addEventListener("resume", function() {
			//从后台切换到前台
			$scope.search(1, 10);
		}, false);
		document.addEventListener("foreground", function(e) {
			//应用切换到前台运行
			layer.msg(1);
		}, false);
		document.addEventListener("plusscrollbottom", function() {
			//页面滚动到底部
			if ($scope.list.length == $scope.pagination.totalItems) {
				layer.msg("已经到底了！");
			} else {
				$scope.searchMore();
			}
		}, false);
		$scope.search(1, 10);
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

	$scope.initAdd = function() {
		closeLoad();
	}


	$scope.toDetail = function(id) {
		plus.storage.setItem("recordId", id + '');
		openView('recordDetail.html', 'pop-in');
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
		recordService.findOne(id, token).success(
			function(response) {
				$scope.entity = response;
			}
		);
	}

	$scope.setScore = function(score) {
		$scope.recordEntity.score = score;
	}

	//保存
	$scope.saveAdd = function() {
		loadDetail();
		var serviceObject; //服务层对象
		var token = plus.storage.getItem("token");
		$scope.recordEntity.token1 = token;
		$scope.recordEntity.type = 1;
		if ($scope.recordEntity.id != null) { //如果有ID
			serviceObject = recordService.update($scope.recordEntity); //修改
		} else {
			serviceObject = recordService.add($scope.recordEntity); //增加
		}
		serviceObject.success(
			function(response) {
				closeLoad();
				if (response.success) {
					//重新查询
					//$scope.reloadList();
					layer.msg(response.message);
					setTimeout(function() {
						backIndex();
					}, 1000)
					//重新加载
				} else {
					layer.msg(response.message);
				}
			}
		);
	}

	//保存2
	$scope.saveDelete = function() {
		loadDetail();
		var serviceObject; //服务层对象
		var token = plus.storage.getItem("token");
		$scope.recordEntity.token1 = token;
		$scope.recordEntity.type = 0;
		if ($scope.recordEntity.id != null) { //如果有ID
			serviceObject = recordService.update($scope.recordEntity); //修改
		} else {
			serviceObject = recordService.add($scope.recordEntity); //增加
		}
		serviceObject.success(
			function(response) {
				closeLoad();
				if (response.success) {
					//重新查询
					//$scope.reloadList();
					layer.msg(response.message);
					setTimeout(function() {
						backIndex();
					}, 1000)
					//重新加载
				} else {
					layer.msg(response.message);
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
				$scope.setPage(page, $scope.pagination.totalItems);
				closeLoad();
			}
		);
	}

	$scope.moreList = [];
	//搜索更多
	$scope.searchMore = function() {

		loadDetail();
		$scope.pagination.pageNum++;

		$scope.searchEntity.token1 = plus.storage.getItem("token");
		$scope.name = plus.storage.getItem("name");
		$scope.cname = plus.storage.getItem("cname");
		recordService.search($scope.pagination.pageNum, $scope.pagination.pageSize, $scope.searchEntity).success(
			function(rs) {
				$scope.pagination.totalItems = rs.total; //更新总记录数
				$scope.moreList = rs.entityList;
				//日期转换
				for (var i = 0; i < $scope.moreList.length; i++) {
					$scope.list.push($scope.moreList[i]);
				}
				/*for (var i = 0; i < $scope.list.length; i++) {
				    //替换caFk
				    for (var j = 0; j < $scope.caList.length; j++) {
				        if ($scope.list[i].caFk == $scope.caList[j].id) {
				            //alert(1)
				            $scope.list[i].caFk = $scope.caList[j].name;
				        }
				        //$scope.list[i].caFk=$scope.list[i].caFk.replace($scope.caList[j].id,$scope.caList[j].name);
				    }
				}*/
				//$scope.$apply();
				closeLoad();
			}
		);
	}

});
