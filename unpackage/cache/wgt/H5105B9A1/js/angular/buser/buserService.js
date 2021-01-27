//服务层
app.service('buserService', function($http) {

	//登录
	this.login = function(entity) {
		return $http.post(baseUrl + 'buser/login.do', entity);
	}
	//根据token查询实体
	this.findOneByToken = function(token) {
		return $http.get(baseUrl + 'buser/findOneByToken.do?token=' + token);
	}
	//读取列表数据绑定到表单中
	this.findAll = function() {
		return $http.get('buser/findAll.do');
	}
	//分页
	this.findPage = function(page, rows) {
		return $http.get('buser/findPage.do?page=' + page + '&rows=' + rows);
	}
	//查询实体
	this.findOne = function(id) {
		return $http.get(baseUrl + 'buser/findOne.do?phone=' + id);
	}
	//增加
	this.add = function(entity) {
		return $http.post('buser/add.do', entity);
	}
	//修改
	this.update = function(entity) {
		return $http.post(baseUrl + 'buser/update.do', entity);
	}
	//删除
	this.dele = function(ids) {
		return $http.get('buser/delete.do?ids=' + ids);
	}
	//搜索
	this.search = function(page, rows, searchEntity) {
		return $http.post('buser/search.do?page=' + page + "&rows=" + rows, searchEntity);
	}
});
