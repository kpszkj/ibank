app.controller('baseController', function($scope) {
	//分页控件配置
	$scope.pagination = {
		pageNum: 1,
		totalPages: 0,
		totalItems: 10,
		pageSize: 8,
	};
	$scope.setPage = function(page, total) {
		$scope.pageList = [];
		//更新当前页,总记录数,总页数
		$scope.pagination.pageNum = page;
		$scope.pagination.totalItems = total;
		$scope.pagination.totalPages = Math.ceil($scope.pagination.totalItems / $scope.pagination.pageSize);
		//总页数小于等于5
		if ($scope.pagination.totalPages <= 5) {
			for (var i = 1; i <= $scope.pagination.totalPages; i++) {
				$scope.pageList.push(i);
			}
		}
		//总页数大于5
		if ($scope.pagination.totalPages > 5) {

			if ($scope.pagination.pageNum <= 3) {
				for (var i = 1; i <= 5; i++) {
					$scope.pageList.push(i);
				}
				$scope.pageList.push("...");

			} else if ($scope.pagination.totalPages - $scope.pagination.pageNum <= 3) {
				$scope.pageList.push("...");
				for (var i = $scope.pagination.totalPages - 4; i <= $scope.pagination.totalPages; i++) {
					$scope.pageList.push(i);
				}

			} else {
				$scope.pageList.push("...");
				for (var i = $scope.pagination.pageNum - 2; i <= $scope.pagination.pageNum + 2; i++) {
					$scope.pageList.push(i);
				}
				$scope.pageList.push("...");

				$scope.$apply();
			}

		}
	}
	/*$scope.paginationConf = {
	    currentPage: 1,
	    totalItems: 10,
	    itemsPerPage: 10,
	    onChange: function () {
	        $scope.reloadList();//重新加载
	    }
	};*/
	//重新加载列表中的数据
	$scope.reloadList = function() {
		//切换页码
		$scope.search($scope.pagination.pageNum, $scope.pagination.itemsPerPage);
	}

	//判断对象是否为空
	isEmpty = function(obj) {
		if (null == obj || angular.equals(null, obj) || angular.equals({}, obj) || angular.equals([], obj) || obj == "" ||
			obj == '') {
			return true;
		} else {
			return false;
		}
	}

	$scope.isElip = function(obj) {
		if (angular.equals('...', obj)) {
			return true;
		} else {
			return false;
		}
	}

	$scope.equals = function(a, b) {
		if (angular.equals(a, b)) {
			return true;
		} else {
			return false;
		}
	}

	//定义一个方法信任视频地
	$scope.transUrl = function(url) {
		//$sce.trustAsResourceUrl方法把普通路径处理加工成一个angular环境可识别，并认为是安全的路径来使用
		var transUrl = $sce.trustAsResourceUrl(url);
		return transUrl;
	};

})
