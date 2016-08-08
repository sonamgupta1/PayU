appControllers.controller('optionalLoginCtrl', function ($scope,$stateParams, $timeout,  $state, $auth, $mdToast,$http,signUpService,
                                                    serverConfig,$rootScope,$location,$ionicHistory,
                                                         $ionicViewSwitcher,$ionicModal) {

    $scope.user = {};

    $scope.goto=function(path){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $location.path(path);
    };
    $scope.login = function () {
        $rootScope.$broadcast('loading:show');

        if ($scope.user.email == undefined || $scope.user.email == '') {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Please Enter Email'
                    }
                }
            });
            $rootScope.$broadcast('loading:hide');
            return;
        }
        if ($scope.user.password == undefined || $scope.user.password == '') {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Please Enter Password'
                    }
                }
            });
            $rootScope.$broadcast('loading:hide');
            return;
        }
        if ($scope.user.email != undefined) {
            if ($scope.user.email.indexOf("@") == -1 || $scope.user.email.indexOf(".") == -1) {
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Please Enter a valid Email'
                        }
                    }
                });
                $rootScope.$broadcast('loading:hide');
                return;
            }
        }
        $scope.user.username = $scope.user.email;
        $scope.user.grant_type = "password";
        $scope.user.client_id = "client_1";
        $scope.user.client_secret = "client_secret";
        $scope.login_text = 'Please Wait...';
        $scope.disabled = true;
        $scope.get_token($scope.user);
    };
    $scope.get_token = function(user){
        $auth.login(user)
            .then(function (response) {
                if(response.status == '200'){
                    // $scope.$broadcast('logout', {message: 'log out'});
                    $rootScope.$broadcast('loading:hide');
                    window.localStorage['access_token']=response.data.access_token;
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: 'Logged in successfully.'
                            }
                        }
                    });
                    $scope.user.email = '';
                    $scope.user.password = '';
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
                $rootScope.$broadcast('loading:hide');
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Invalid Credentials'
                        }
                    }
                });
            });
    };
    $scope.forget_pwd = function(){
        $state.go('app.forget_password');
    }
});
