appControllers.controller('oderDetailCtrl', function ($scope, $timeout, $mdUtil,orderDetailService,$rootScope,
                                                       $stateParams,$stateParams,$state,$ionicHistory) {

    
    
    orderDetailService.get_order_detail($stateParams.order_id).then(function(data){
        $scope.order_detail = data.data.data;

        $scope.total_price = $scope.order_detail.deal_price;
        angular.forEach($scope.order_detail.bookingPackagesAddons.data, function (value, key) {
            $scope.total_price = parseInt($scope.total_price) + parseInt(value.amount);
        });
    });

    $scope.order_list = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.order_list');
    }
});


