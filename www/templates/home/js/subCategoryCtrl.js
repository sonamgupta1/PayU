appControllers.controller('subCategoryCtrl', function ($scope, $timeout,subCategoryListService,$ionicSlideBoxDelegate, $ionicHistory,
                                                       $state, $stateParams,$rootScope) {

    
    
    subCategoryListService.getSubCategoryWithId($stateParams.cat_id).then(function(data){
        $scope.sub_catagery_list = data.data.data;
        $ionicSlideBoxDelegate.update();
    });

    $scope.getPackages = function(id){
        $state.go('app.package_list',{'sub_cat_id':id});
    };

    $scope.back_to_home = function(){
        $state.go('app.home');
    }

}); 