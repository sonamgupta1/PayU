appControllers.controller('catFullDescriptionCtrl', function ($scope,productService, $state,$stateParams,$rootScope) {

    
   
    productService.getProductDescription($stateParams.product_id).then(function(data){
        $scope.package = data.data.data;
    });

    $scope.back_to_cat_pdp = function () {
        $state.go('app.cat_product_desc',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id})
    };
});

