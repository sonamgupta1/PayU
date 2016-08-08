appControllers.controller('mainWalkthroughCtrl',function($scope,$location,$ionicViewSwitcher,$ionicHistory,$state){
    $scope.navigateTo = function (stateName,objectData) {
        if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });

            //Next view animate will display in back direction
            $ionicViewSwitcher.nextDirection('back');

            $state.go(stateName, {
                isAnimated: objectData,
            });
        }
    }; // End of navigateTo.

    $scope.getStarted=function(){
        $scope.navigateTo('app.home',true);
        window.localStorage['SkipIntro']= 'true';

    };
});
