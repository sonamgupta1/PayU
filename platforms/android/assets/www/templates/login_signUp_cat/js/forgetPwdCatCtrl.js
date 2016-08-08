appControllers.controller('ForgetPwdCatCtrl', function ($scope, $timeout, $mdUtil,forgetPasswordService,$rootScope,
                                                     $state,$stateParams) {
  

    $scope.user = {};

    forgetPasswordData = function () {
        data = {
            "email": $scope.user.email
        }
    };

    $scope.submit_forget_pwd = function(){
        forgetPasswordData();
        forgetPasswordService.forget_password(data).then(function(data){
        })
    };
    
    $scope.cat_login = function(){
        $state.go('app.login_cat',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id});

    };
    
}); 

