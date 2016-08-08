
appControllers.controller('optionalCatCtrl', function ($scope,$stateParams, $timeout,  $state, $auth, $mdToast,$http,signUpService,
                                                 serverConfig,$rootScope,$location,$ionicHistory,googleToken,
                                                    $ionicViewSwitcher,$ionicModal,googleLogin,facebookLogin,
$cordovaOauth, $http) {
    
    $scope.redirection_to = function (){
        $state.go('app.cat_product_desc',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id});
    };

    $scope.login_page = function(){
       $state.go('app.login_cat',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id});
    };
    
    $scope.sign_up_page = function(){
        $state.go('app.signUp_cat',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id});
    };

    $scope.user = {};
    
    $scope.get_token = function(user){
        $auth.login(user)
            .then(function (response) {
                return;
                $scope.login_text = 'Sign In';
                $scope.disabled = false;
            })
            .catch(function (response) {
                console.log("response in fail",JSON.stringify(response));
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
                $scope.disabled = false;
            });
    };



        window.cordovaOauth = $cordovaOauth;
        window.http = $http;

    $scope.demo_fb = function()
    {
        $scope.facebookLogin(window.cordovaOauth, window.http);
    };

    $scope.facebookLogin = function($cordovaOauth, $http)
    {
        $cordovaOauth.facebook("1604761699851791", ["email", "public_profile"],
            {redirect_uri: "http://localhost/callback"}).then(function(result){
            $scope.displayData($http,result.access_token);

        },  function(error){
            // alert("Error: " + error);
        });
    };


    $scope.displayData = function($http, access_token)
    {
        $rootScope.$broadcast('loading:show');

        $http.get("https://graph.facebook.com/v2.2/me", {
            params: {
                access_token: access_token,
                fields: "email,id,name,age_range,gender,picture,location,verified",
                format: "json"
            }
        }).then(function(result) {
            var user = {
                id: result.data.id,
                email:result.data.email,
                access_token: access_token,
                name:result.data.name
            };
            facebookLogin.facebook_login(user).then(function(data){
                var user_2 = {
                    client_id: "client_1",
                    client_secret: "client_secret",
                    google_access_token: data.data.google_access_token,
                    google_id: data.data.google_id,
                    grant_type: "google"
                }
                if(data){
                    googleToken.google_token(user_2).then(function(data){
                        if(data.status == '200'){
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
                            $rootScope.$broadcast('logged_in', { message: 'login successfully' });
                            window.localStorage['access_token']=data.data.access_token;
                            $state.go('app.cat_product_desc',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id});
                            $rootScope.$broadcast('loading:hide');

                        }
                    })
                }
            })
        }, function(error) {
            // alert("Error: " + error);
            $rootScope.$broadcast('loading:hide');

        });
    };

    $scope.googleLogin = function() {
        $cordovaOauth.google("936213911318-1mnllojl5hqu2b4o17e47hpbk2e4s66c.apps.googleusercontent.com",
            ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            $rootScope.$broadcast('loading:show');

            var url = 'https://www.googleapis.com/plus/v1/people/me?access_token='+result.access_token;

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                success: function(userInfo) {
                    var user = {
                        id: userInfo.id,
                        email:userInfo.emails[0].value,
                        access_token: result.access_token,
                        name:userInfo.displayName
                    };
                    googleLogin.google_login(user).then(function(data){
                        var user_1 = {
                            client_id: "client_1",
                            client_secret: "client_secret",
                            google_access_token: data.data.google_access_token,
                            google_id: data.data.google_id,
                            grant_type: "google"
                        }
                        if(data){
                            googleToken.google_token(user_1).then(function(data){
                                profileService.get_profile(data.data.access_token).then(function(data){
                                    window.localStorage['profile_name'] = data.data.data.name;
                                    window.localStorage['profile_img'] = data.data.data.image;
                                })
                                if(data.status == '200'){
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
                                    $rootScope.$broadcast('logged_in', { message: 'login successfully' });
                                    window.localStorage['access_token']=data.data.access_token;
                                    $state.go('app.cat_product_desc',{'cat_id':$stateParams.cat_id,'sub_cat_id': $stateParams.sub_cat_id,'product_id':$stateParams.product_id});
                                }
                                $rootScope.$broadcast('loading:hide');
                            })
                        }
                    })
                },
                error: function(e) {
                    console.log('error');
                    $rootScope.$broadcast('loading:hide');


                }
            });


        }, function(error) {
            console.log(error);
        });
    };


    $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
            .then(function (response) {
                var user = {
                    google_id: response.data.google_id,
                    google_access_token: response.data.google_access_token,
                    grant_type: "google",
                    client_id: "client_1",
                    client_secret: "client_secret"
                };
                $scope.get_token(user);
            }).catch(function (response) {
            console.log("else",JSON.stringify(response));
        });
    };


  

    $scope.demo = function(provider){
        $auth.authenticate(provider).then(function (result) {
            $scope.get_token({
                google_id:result.data.google_id,
                google_access_token:result.data.google_access_token,
                grant_type:"google",
                client_id:"client_id",
                client_secret:"client_secret",
            });
        }).catch(function (e) {
            console.log(JSON.stringify(e));
        });
    };

});
