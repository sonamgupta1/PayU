appControllers.controller('paymentSuccessCtrl', function ($scope,orderDetailService,$stateParams, $state,$stateParams) {

    var booking_id = $stateParams.b_id;

    
    orderDetailService.get_order_detail(booking_id).then(function(data){
        $scope.order_detail_id = data.data.data.id;
        // $scope.total_price = $scope.order_detail.deal_price;
        // angular.forEach($scope.order_detail.bookingPackagesAddons.data, function (value, key) {
        //     $scope.total_price = parseInt($scope.total_price) + parseInt(value.amount);
        // });
    })
    $scope.order_detail = function(id){
        $state.go('app.order_detail',{order_id:id})
    };
});



