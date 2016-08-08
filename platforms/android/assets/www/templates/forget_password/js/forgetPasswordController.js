/**
 * Created by sonam on 29/4/16.
 */
appControllers.controller('ForgetPasswordCtrl', function ($scope, $timeout, $mdUtil,forgetPasswordService,
                                                    $mdSidenav, $log, $ionicHistory, $state,$rootScope) {

    
    $scope.toggleLeft = buildToggler('right');

    // buildToggler is for create menu toggle.
    // Parameter :
    // navID = id of navigation bar.
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID).toggle();
        }, 0);
        return debounceFn;
    };// End buildToggler.

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go
    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    };

    $scope.user = {};

    forgetPasswordData = function () {
        data = {
            "email": $scope.user.email
        }
    };

    $scope.submit_forget_pwd = function(){
        forgetPasswordData();
        forgetPasswordService.forget_password(data).then(function(data){
            console.log("dddddddddddddddd",JSON.stringify(data));
        })
    };
    
}); 

