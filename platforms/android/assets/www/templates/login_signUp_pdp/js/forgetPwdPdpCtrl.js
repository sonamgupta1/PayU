appControllers.controller('ForgetPwdPdpCtrl', function ($scope, $timeout, $mdUtil,forgetPasswordService,
                                                     $state,$stateParams,$rootScope) {
  

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
    
    $scope.pdp_login = function(){
        $state.go('app.login_pdp',{'cat_id':$stateParams.cat_id,'product_id':$stateParams.product_id});

    };
    
}); 

