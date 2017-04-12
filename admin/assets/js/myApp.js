var app = angular.module('myApp', ['ngRoute'],function($provide){
	$provide.factory('globalVar',function(){
		return [{
			'isChoose': false,
			'systemName': '系统名称',
			'systemId': 100
		},{
			'isChoose': false,
			'systemName': '操作群',
			'operateId': 1001
		}]
	})
});

app.config(['$routeProvider','$compileProvider', function($routeProvider,$compileProvider) {
	$routeProvider

		.when('/temp1', {
			templateUrl: 'template/template_index.html',
			controller: 'Ctrl1'
		})
		.when('/temp2', {
			templateUrl: 'template/template2.html'
		})
		.when('/temp3', {
			templateUrl: 'template/template2.html'
		})
		.when('/temp31', {
			templateUrl: 'template/template31.html'
		})
		.when('/temp32', {
			templateUrl: 'template/template31.html'
		})
		.when('/temp33', {
			templateUrl: 'template/template31.html'
		})
		.when('/temp5', {
			templateUrl: 'template/template4.html'
		})
		.otherwise({
			redirectTo: '/temp1'
		});
}]);
app.run(function($rootScope){
	$rootScope.tab = 1;//default
});
app.controller('Ctrl1', ['$scope', function($scope) {
	
}]);
app.controller('sideBarCtrl', ['$scope', '$http','$timeout','globalVar','$location', function($scope, $http, $timeout, globalVar,$location) {
	$http.get('json/listName.json').success(function (data) {
        $scope.listName = data;
   });
	$scope.tabList = [];
	var idList = [];
	$scope.showListChage = function (id) {
		$scope.listName[id-100].isShow = !$scope.listName[id-100].isShow;
		angular.forEach($scope.tabList, function (value,index) {
			value.active = "";
			if(idList.indexOf(value.id) == -1){
				idList.push(value.id);
			}

		});
		if(idList.indexOf($scope.listName[id-100].id) == -1){
			$scope.tabList.push({
				"id": $scope.listName[id-100].id,
				"name": $scope.listName[id-100].name,
				"active": "am-active",
				"Url": $scope.listName[id-100].Url
			});
		}else{
			angular.forEach($scope.tabList, function (value) {
				if(value.id == id)
					value.active = "am-active";
			})
		}
		globalVar[0].systemId = id;
		console.log(idList);
	};
	$scope.tabChangeActive = function(id){
		globalVar[0].systemId = id;
		angular.forEach($scope.tabList,function(value){
			value.active = "";
			if(value.id == id){
				value.active = "am-active";
			}
		})
	}
	$scope.tabDelete = function (id) {
		angular.forEach($scope.tabList, function(data,index){
			if(data.id == id){
				$scope.tabList.splice(index,1);
				idList.splice(index,1);
			}
		});
		var length = $scope.tabList.length;
		if(length > 0){
			$scope.tabList[length-1].active = "am-active";
			globalVar[0].systemId = $scope.tabList[length-1].id;
			var LocationUrl = $scope.tabList[length-1].Url;
			LocationUrl = LocationUrl.substring(1,LocationUrl.length);
			LocationUrl = '/' + LocationUrl;
			$location.url(LocationUrl);
		}
	}
	$scope.operateChage = function(id){
		globalVar[1].operateId = id;
	}
}]);
app.controller('serverStatusCtrl',['$scope','$http','globalVar', function ($scope,$http,globalVar) {
	$scope.Url = 'json/serverStatus' + globalVar[0].systemId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.serverStatusData = data;
	});
}])
app.controller('systemStatusCtrl',['$scope','$http','globalVar', function ($scope,$http,globalVar) {
	$scope.Url = 'json/systemStatus' + globalVar[0].systemId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.systemStatusCtrlData = data;
	});
}]);
app.controller('totalStatusCtrl',['$scope','$http','globalVar', function ($scope,$http,globalVar) {
	$scope.Url = 'json/totalStatus' + globalVar[0].systemId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.totalStatusCtrlData = data;
	});
}])
app.controller('userStatusCtrl',['$scope','$http','globalVar', function ($scope,$http,globalVar) {
	$scope.Url = 'json/userStatus' + globalVar[0].systemId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.userStatus = data;
	});
}])
app.controller('clientStatusCtrl',['$scope','$http','globalVar', function ($scope,$http,globalVar) {
	$scope.Url = 'json/clientStatus' + globalVar[0].systemId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.clientStatus = data;
	});
}])
app.controller('subSystemCtrl',['$scope','$http','globalVar', function ($scope,$http,globalVar) {
	$scope.Url = 'json/subSystem' + globalVar[1].operateId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.subSystem = data;
	});
}])
app.controller('warningCtrl', ['$scope','$http','globalVar',function($scope,$http,globalVar){
	$scope.isRadioClick = false;
	$scope.tagSele = {
		statusNum: '',
		handleNum: ''
	};
	$scope.Url = 'json/warningStatus' + globalVar[0].systemId + '.json';
	$http.get($scope.Url).success(function (data) {
		$scope.warningData = data;
	});
	$scope.outData = [];
	$scope.ischeck = function(){
		$scope.isRadioClick = true;
		$scope.outData = [];
		angular.forEach($scope.warningData,function(o,index,array){
			if(($scope.tagSele.statusNum == o.statusNum && $scope.tagSele.handleNum == o.handleNum)){
				$scope.outData.push(o);
				$scope.outData.push(array[index+1]);
			}else if($scope.tagSele.statusNum == o.statusNum && $scope.tagSele.handleNum == ''){
				$scope.outData.push(o);
				$scope.outData.push(array[index+1]);
			}else if($scope.tagSele.statusNum == '' && $scope.tagSele.handleNum == o.handleNum){
				$scope.outData.push(o);
				$scope.outData.push(array[index+1]);
			}
		})
		console.log($scope.outData);
	};
	$scope.clearRadio = function(){
		$scope.isRadioClick = false;
		$scope.tagSele.statusNum = '';
		$scope.tagSele.handleNum = '';
	}
	$scope.showDetail = function(data){
		angular.forEach($scope.warningData,function(o){
			if(data.id == o.secId && data.name){
				o.isDetailShow = !o.isDetailShow;
			}
		})
	}
}]);
app.filter('filterStatus',function(){
	//return function (obj) {
	//	var newObj = [];
	//	angular.forEach(obj,function(o){
	//		if(o.id == 7){
	//			newObj.push(o);
	//		}
	//	});
	//	return newObj;
	//}
});
app.directive('echart', [function() {
	return {
		restrict: 'AE',
		scope: {
			echart: '='
		},
		link: link
	};

	function link(scope, element, attr) {
		var myChart = echarts.init(element[0]);
		// 指定图表的配置项和数据
		var defaultOption = {
			title: {
				text: '内存使用率',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			series: [{
				name: '内存使用',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 1000,
					name: '已使用内存(MB)'
				}, {
					value: 3100,
					name: '剩余内存(MB)'
				}],
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(defaultOption);

		// 双向传值
		// scope.$watch('echart', function(n, o) {
		//  if (n === o || !n) return;
		//  myChart.setOption(n);
		// });

		//当浏览器窗口发生变化的时候调用div的resize方法
		window.addEventListener('resize', chartResize);

		scope.$on('$destory', function() {
			window.removeEventListener('resize', chartResize);
		})

		function chartResize() {
			myChart.resize();
		}
	}
}]);
app.directive('echart2', [function() {
	return {
		restrict: 'AE',
		scope: {
			echart: '='
		},
		link: link
	};

	function link(scope, element, attr) {
		var myChart = echarts.init(element[0]);
		// 指定图表的配置项和数据
		var defaultOption = {
			title: {
				text: '内存使用率',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			series: [{
				name: '内存使用',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 2000,
					name: '已使用内存(MB)'
				}, {
					value: 3100,
					name: '剩余内存(MB)'
				}],
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(defaultOption);

		// 双向传值
		// scope.$watch('echart', function(n, o) {
		//  if (n === o || !n) return;
		//  myChart.setOption(n);
		// });

		//当浏览器窗口发生变化的时候调用div的resize方法
		window.addEventListener('resize', chartResize);

		scope.$on('$destory', function() {
			window.removeEventListener('resize', chartResize);
		})

		function chartResize() {
			myChart.resize();
		}
	}
}]);