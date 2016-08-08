appControllers.controller('CategoryCtrl', function ($scope,CategoryService, $ionicHistory,$rootScope,
                                                    $state,$stateParams,$ionicSlideBoxDelegate) {
    
    CategoryService.getAll().then(function(data){
        $scope.categories = data.data.data;
        $ionicSlideBoxDelegate.update();
    });

    $scope.allSubcategory = function(id){
        $state.go('app.cat_sub_cat_list',{'cat_id':id});
    };
});
