appControllers.controller('oderListCtrl', function ($scope,orderListService, $ionicHistory,$stateParams,$rootScope,
                                                    $state,$stateParams) {
var access_token = window.localStorage['access_token'];

    if(access_token && access_token != 'undefined'){
        orderListService.get_order(access_token).then(function(data){
            $scope.order_list = data.data.data;
        });
    }
    $scope.order_detail = function(order_id){
        $state.go('app.order_detail',{order_id:order_id})
    };
    
    $scope.go_home = function(){
        console.log('dsh order');
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.home');
    };
});


