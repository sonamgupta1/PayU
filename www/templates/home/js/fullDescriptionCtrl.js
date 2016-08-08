appControllers.controller('fullDescriptionCtrl', function ($scope,productService,$rootScope,
                                                          $state,$stateParams) {
   
    productService.getProductDescription($stateParams.product_id).then(function(data){
        $scope.package = data.data.data;
    });
    
    $scope.back_to_pdp = function(){
        $state.go('app.product_desc', {'cat_id':$stateParams.cat_id,'product_id': $stateParams.product_id})
    };
});

