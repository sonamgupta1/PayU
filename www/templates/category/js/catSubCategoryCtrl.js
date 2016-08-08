appControllers.controller('catSubCategoryCtrl', function ($scope, $timeout,subCategoryListService, $ionicHistory,
                                                       $state, $stateParams,$rootScope) {

   
    subCategoryListService.getSubCategoryWithId($stateParams.cat_id).then(function(data){
        $scope.sub_catagery_list = data.data.data;
    });
    $scope.getPackagesForCat = function(category_id,id){
        $state.go('app.cat_package_list',{'cat_id':category_id,'sub_cat_id':id},{reload:true});
    };
    
    $scope.back_to_category_side = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.allCategory');
    };

}); 