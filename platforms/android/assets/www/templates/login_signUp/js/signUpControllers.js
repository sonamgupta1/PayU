
appControllers.controller('signUpCtrl', function ($scope,$stateParams, $timeout, signUpService, $state, $auth,
                                                        $mdToast,$http, serverConfig,$rootScope,$location,$ionicHistory,
                                                        $ionicViewSwitcher) {
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
    };
    
    $scope.user = {};
    $scope.goto=function(path){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $location.path(path);
    };

    signUpData = function () {
        data = {
            "email": $scope.user.email,
            "mobile": $scope.user.mobile,
            "name": $scope.user.name,
            "password": $scope.user.password,
            "password_confirmation": $scope.user.password,
        }
        console.log("sonamaaaa",JSON.stringify(data))
    };


    $scope.signUp = function () {
        signUpData();
        if(($scope.user.name)&&($scope.user.email)&&($scope.user.mobile)&&($scope.user.password)){
            if(($scope.user.mobile.toString().length == 10) && ($scope.user.password.length >= 6)){
                var email =$scope.user.email;
                var pass = $scope.user.password;
                signUpService.signUp(data).then(function (data) {
                    $scope.credentials = data;
                    if($scope.credentials.status == 200){
                        var user_1 = {
                            "email": email,
                            "password": pass,
                            "grant_type": "password",
                            "client_id": "client_1",
                            "client_secret": "client_secret",
                            "username":email
                        }
                        $scope.get_token(user_1);
                    }
                });
            }
            else{
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Password should have 6 characters at-least and mobile should have 10 digits!'
                        }
                    }
                });
            }
        }
        else{
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Please, fill above required fields!'
                    }
                }
            });
        }

    };

    $scope.get_token = function(user){
        $auth.login(user)
            .then(function (response) {
                if(response.status == '200'){
                    window.localStorage['access_token']=response.data.access_token;
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $rootScope.$broadcast('logged_in', { message: 'login successfully' });
                    $state.go('app.home', null, {reload:true});
                }
            })
            .catch(function (response) {
                window.localStorage['access_token']=undefined;
                $auth.logout();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.home', null, {reload:true});
            });
    };

});
