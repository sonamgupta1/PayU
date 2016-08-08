appControllers.controller('fullDescriptionSearchCtrl', function ($scope,productService,
                                                          $state,$stateParams,$rootScope) {
    
    productService.getProductDescription($stateParams.product_id).then(function(data){
        $scope.package = data.data.data;
    });
    $scope.back_to_search_pdp = function () {
        $state.go('app.search_pdp',{'search_text': $stateParams.search_text,'cat_id': $stateParams.cat_id,'product_id':$stateParams.product_id})
    };
});

