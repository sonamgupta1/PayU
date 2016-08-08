angular.module('starter', ['ionic','ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'ngMaterial',
    'ngMessages', 'ngCordova','satellizer','algoliasearch','ngSanitize'])
    .run(function ($ionicPlatform, $rootScope, $ionicHistory, $state,profileService,
                   $cordovaSplashscreen, $mdDialog, $mdBottomSheet,$ionicPopup) {

        function hideActionControl() {
            //For android if user tap hardware back button, Action and Dialog should be hide.
            $mdBottomSheet.cancel();
            $mdDialog.cancel();
        };

        $ionicPlatform.ready(function () {
            ionic.Platform.isFullScreen = true;
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            setTimeout(function () {
                $cordovaSplashscreen.hide();
            }, 500);

            if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                            title: "Internet Disconnected",
                            content: "The internet is disconnected on your device."
                        })
                        .then(function(result) {
                            if(!result) {
                                ionic.Platform.exitApp();
                            }
                        });
                }
            }
            

            //Checking if view is changing it will go to this function.
            $rootScope.$on('$ionicView.beforeEnter', function () {
                //hide Action Control for android back button.
                hideActionControl();
                // Add custom style ti view.
                // $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
            });

        });
    })
    .config(
        function ($authProvider, serverConfig) {
            $authProvider.httpInterceptor = function() { return true; },
                $authProvider.tokenName = 'access_token';
            $authProvider.google({
                url: serverConfig.address + 'api/auth/google',
                // clientId: '982638547625-ui0lp1pteh6moug1sgct1ag0ub0aen7g.apps.googleusercontent.com',
                clientId: '936213911318-1mnllojl5hqu2b4o17e47hpbk2e4s66c.apps.googleusercontent.com',
                clientSecret: '3_FHOlRYTrJffGBhGAMr59b_',
                redirectUri: 'http://'+location.hostname+'/'
                // redirectUri: 'http://localhost/'
            });
            $authProvider.facebook({
                url: serverConfig.address + 'api/auth/facebook',
                clientId: '953913041345816',
                clientSecret: 'e9652fa4cea1dca0a1d6658adaa0ab36',
                redirectUri: 'http://'+location.hostname+'/'
            });
            $authProvider.loginUrl = serverConfig.address + 'oauth/access_token';
        })

    .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdColorPalette) {
        // Use for change ionic spinner to android pattern.
        $ionicConfigProvider.spinner.icon("android");
        $ionicConfigProvider.views.swipeBackEnabled(false);

        $ionicConfigProvider.backButton.previousTitleText(false).text('');

        $mdThemingProvider
            .theme('default')
            .primaryPalette('deep-purple')
            .accentPalette('pink');

        appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

        $stateProvider
            .state('get_started',{
                url: "/mainWalkthrough",
                templateUrl: "templates/MainWalkthrough/html/mainWalkthrough.html",
                controller: 'mainWalkthroughCtrl'
            })
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu/html/index.html",
                controller: 'MenuCtrl'
            })

              .state('app.home', {
                url: "/home",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/index.html",
                        controller: "MenuCtrl"
                    }
                }
            })
            .state('app.subCategory', {
                url: "/subCategory/:cat_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/subCategory.html",
                        controller: "subCategoryCtrl"
                    }
                },
                resolve: {
                    cat_id: function($stateParams) {
                    }
                }
            })
            .state('app.orp', {
                url: "/orp/:cat_id/:product_id",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/orp.html",
                        controller: "orderReviewCtrl"
                    }
                }
            })
            .state('app.search_info', {
                url: "/search_info/:search_text",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search/html/index.html",
                        controller: "searchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })
            .state('app.search_pdp', {
                url: "/search_pdp/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search/html/search_pdp.html",
                        controller: "searchPdpCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })

            .state('app.orp_search', {
                url: "/orp_search/:search_text/:cat_id/:product_id",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/search/html/orp_search.html",
                        controller: "orderReviewSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })


            .state('app.seller_profile_search', {
                url: "/seller_profile_search/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search/html/seller_profile_search.html",
                        controller: "sellerProfileSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })

            .state('app.full_description_search', {
                url: "/full_description_search/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search/html/full_description_search.html",
                        controller: "fullDescriptionSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })
            
            

            .state('app.optional_login_search', {
                url: "/optional_login_search/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_search/html/optional.html",
                        controller: "optionalSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })
            .state('app.login_search', {
                url: "/login_search/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_search/html/login.html",
                        controller: "LoginSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })
            .state('app.signUp_search', {
                url: "/signUp_search/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_search/html/signUp.html",
                        controller: "signUpSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })
            

            .state('app.forget_pwd_search', {
                url: "/forget_pwd_search/:search_text/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_search/html/forget_pwd_search.html",
                        controller: "ForgetPwdSearchCtrl"
                    }
                },
                resolve: {
                    search_text: function($stateParams) {
                    }
                }
            })

            .state('app.package_list', {
                url: "/package_list/:sub_cat_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/packages.html",
                        controller: "packagesCtrl"
                    }
                },
                resolve: {
                    sub_cat_id: function($stateParams) {
                    }
                }
            })
            .state('app.paymentOption', {
                url: "/paymentOption",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/payment_option.html",
                        controller: "paymentCtrl"
                    }
                }
            })
           
           .state('app.allCategory', {
                url: "/allCategory",
                views: {
                    'menuContent': {
                         templateUrl: "templates/category/html/index.html",
                        controller: "CategoryCtrl"
                    }
                }
            })
            .state('app.cat_sub_cat_list', {
                url: "/cat_sub_cat_list/:cat_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/category/html/cat_sub_cat.html",
                        controller: "catSubCategoryCtrl"
                    }
                },
                resolve: {
                    cat_id: function($stateParams) {
                    }
                }
            })


            .state('app.cat_package_list', {
                url: "/cat_package_list/:cat_id/:sub_cat_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/category/html/cat_packages_list.html",
                        controller: "catPackagesCtrl"
                    }
                },
                resolve: {
                    sub_cat_id: function($stateParams) {
                    }
                }
            })
            .state('app.cat_product_desc', {
                url: "/cat_product_desc/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/category/html/cat_product_description.html",
                        controller: "catProductDescriptionCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.orp_cat', {
                url: "/orp_cat/:cat_id/:sub_cat_id/:product_id",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/category/html/orp_cat.html",
                        controller: "orderReviewCatCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.cat_seller_profile', {
                url: "/cat_seller_profile/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/category/html/cat_seller_profile.html",
                        controller: "catSellerProfileCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.cat_full_description', {
                url: "/cat_full_description/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/category/html/cat_full_description.html",
                        controller: "catFullDescriptionCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })

            .state('app.optional_cat', {
                url: "/optional_cat/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_cat/html/optional.html",
                        controller: "optionalCatCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.login_cat', {
                url: "/login_cat/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_cat/html/login.html",
                        controller: "LoginCatCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.signUp_cat', {
                url: "/signUp_cat/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_cat/html/signUp.html",
                        controller: "signUpCatCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.forget_pwd_cat', {
                url: "/forget_pwd_cat/:cat_id/:sub_cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_cat/html/forget_pwd_cat.html",
                        controller: "ForgetPwdCatCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })

            .state('app.about_us', {
                url: "/aboutUs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about_us/html/index.html"
                    }
                }
            })
            .state('app.address', {
                url: "/address",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/address/html/index.html",
                        controller:'addressCtrl'
                    }
                }
            })

            .state('app.address_fill', {
                url: "/address_fill",
                views: {
                    'menuContent': {
                        templateUrl: "templates/address/html/address_fill.html",
                        controller:'addAddressCtrl'
                    }
                }
            })

            .state('app.edit_address', {
                url: "/edit_address/:edit_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/address/html/edit_address.html",
                        controller:'editAddressCtrl'
                    },

                    resolve: {
                        edit_id: function($stateParams) {
                        }
                    }
                }
            })


            .state('app.contact_us', {
                url: "/contactUs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/contact_us/html/index.html",
                        controller:'contactCtrl'
                    }
                }
            })
            .state('app.term_n_con', {
                url: "/term_n_con",
                views: {
                    'menuContent': {
                        templateUrl: "templates/tNc/html/index.html",
                        controller:"moreCtrl"
                    }
                }
            })
            .state('app.refund_policy', {
                url: "/refund_policy",
                views: {
                    'menuContent': {
                        templateUrl: "templates/refundsPolicy/html/index.html",
                        controller:"moreCtrl"
                    }
                }
            })
            .state('app.cancellationPolicy', {
                url: "/cancellationPolicy",
                views: {
                    'menuContent': {
                        templateUrl: "templates/cancellationPolicy/html/index.html",
                        controller:"moreCtrl"
                    }
                }
            })
            .state('app.privacy_policy', {
                url: "/privacy_policy",
                views: {
                    'menuContent': {
                        templateUrl: "templates/PrivacyPolicy/html/index.html",
                        controller:"moreCtrl"
                    }
                }
            })
            .state('app.optional_index', {
                url: "/optional_index",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp/html/optional.html",
                        controller:"optionalCtrl"
                    }
                }
            })
            .state('app.login_index', {
                url: "/login_index",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp/html/login.html",
                        controller:"optionalLoginCtrl"
                    }
                }
            })
            .state('app.signUp_index', {
                url: "/signUp_index",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp/html/signUp.html",
                        controller:"signUpCtrl"
                    }
                }
            })
            .state('app.optional_index_pdp', {
                url: "/optional_index_pdp/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_pdp/html/optional.html",
                        controller:"optionalPdpCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.login_pdp', {
                url: "/login_pdp/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_pdp/html/login.html",
                        controller:"LoginPdpCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.signUpPdp', {
                url: "/signUpPdp/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_pdp/html/signUp.html",
                        controller:"signUpPdpCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.forgetPwdPdp', {
                url: "/forgetPwdPdp/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login_signUp_pdp/html/forgetPwdPdp.html",
                        controller:"ForgetPwdPdpCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.forget_password', {
                url: "/forget_password",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forget_password/html/index.html",
                        controller: "ForgetPasswordCtrl"
                    }
                }
            })
            .state('app.product_desc', {
                url: "/product_desc/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/pdp.html",
                        controller: "productDescriptionCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })

            .state('app.payment_success', {
                url: "/payment_success/:b_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/payment_success.html",
                        controller:'paymentSuccessCtrl'
                    }
                },
                resolve: {
                    b_id: function($stateParams) {
                    }
                }
            })

            .state('app.payment_fail', {
                url: "/payment_fail/:t_id/:b_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/payment_fail.html",
                        controller:'paymentFailCtrl'
                        
                    }
                },
                resolve: {
                    t_id: function($stateParams) {
                    }
                }
            })
            .state('app.order_list', {
                url: "/order_list",
                views: {
                    'menuContent': {
                        templateUrl: "templates/order/html/index.html",
                        controller:'oderListCtrl'
                    }
                }
            })
            .state('app.profile', {
                url: "/profile",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile/html/index.html",
                        controller:'profileCtrl'
                    }
                }
            })
            .state('app.more', {
                url: "/more",
                views: {
                    'menuContent': {
                        templateUrl: "templates/more/html/index.html",
                        controller:'moreCtrl'
                    }
                }
            })
            .state('app.order_detail', {
                url: "/order_detail/:order_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/order/html/detail.html",
                        controller:'oderDetailCtrl'
                    },
                    resolve: {
                        order_id: function($stateParams) {
                        }
                    }
                }
            })
            
            .state('app.full_description', {
                url: "/full_description/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/full_description.html",
                        controller:"fullDescriptionCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })
            .state('app.seller_profile', {
                url: "/seller_profile/:cat_id/:product_id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/seller_profile.html",
                        controller:"sellerProfileCtrl"
                    }
                },
                resolve: {
                    product_id: function($stateParams) {
                    }
                }
            })

            .state('app.wishlist', {
                url: "/wishlist",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/wishlist/html/index.html",
                        controller:'wishListCtrl'
                    }
                }
            })
            .state('app.search_page', {
                url: "/search_page",
                cache:false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/search.html",
                        controller:'searchController'
                    }
                }
            })
        if(window.localStorage['SkipIntro']== 'true'){
            $urlRouterProvider.otherwise("app/home");
        }else{
            $urlRouterProvider.otherwise("/mainWalkthrough");
        }
    })

.constant("serverConfig", {
    "address": "http://54.169.76.224/"
})

.run(function($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: '<div class="ui-progress-circular"><ion-spinner ng-if="!isAndroid" class="progress-circular">' +
        '</ion-spinner><md-progress-circular ng-if="isAndroid" md-mode="indeterminate"></md-progress-circular>' +
        '</div>'})
    });

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide()
    })
})


 .run(function($ionicPlatform, $ionicPopup,$state,$rootScope,$ionicHistory) {

     $ionicPlatform.registerBackButtonAction(function (event) {
         // if (($state.current.name == "app.home") ||($state.current.name == "app.search_pdp")||
         //     ($state.current.name == "app.cat_product_desc")||($state.current.name == "app.product_desc"))
         //
         if ($state.current.name == "app.home"){
             $ionicPopup.confirm({
                title: 'Zolo',
                template: 'Are you sure, you want to exit?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
             // navigator.app.exitApp();
             //<-- remove this line to disable the exit
         }
         else if(($state.current.name == "app.search_pdp") &&((window.localStorage['access_token']) && (window.localStorage['access_token']) != 'undefined')){
             $state.go('app.search_info', {'search_text':window.localStorage['search_text']});
         }
         else if((($state.current.name == "app.search_info") || ($state.current.name == "app.allCategory") ||
             ($state.current.name == "app.package_list") ||($state.current.name =="app.subCategory") ||
             ($state.current.name == "app.about_us") ||($state.current.name =="app.more") ||
             ($state.current.name =="app.contact_us") || ($state.current.name =="app.optional_index"))) {
             $ionicHistory.nextViewOptions({
                 disableBack: true
             });
             $state.go('app.home');
         }
         else if((($state.current.name == "app.profile") || ($state.current.name == "app.wishlist")) &&
             (window.localStorage['access_token']) && (window.localStorage['access_token']) != 'undefined'){
             $ionicHistory.nextViewOptions({
                 disableBack: true
             });
             $state.go('app.home');
         }
        else if(($state.current.name == "app.product_desc") && ((window.localStorage['access_token'])
             && (window.localStorage['access_token']) != 'undefined')){
             $state.go('app.package_list', {'sub_cat_id': window.localStorage['sub_cat_id']});

         }
         else if(($state.current.name == "app.cat_product_desc") &&
             ((window.localStorage['access_token']) && (window.localStorage['access_token']) != 'undefined')){
             $state.go('app.cat_package_list', {'cat_id': window.localStorage['cat_id'],'sub_cat_id':window.localStorage['sub_cat_id']});
         }
         else if(($state.current.name == "app.cat_package_list") &&
             ((window.localStorage['access_token']) && (window.localStorage['access_token']) != 'undefined')){
             $state.go('app.cat_sub_cat_list',{'cat_id':window.localStorage['cat_id']});
         }
         else if(($state.current.name == "app.cat_sub_cat_list") &&
             ((window.localStorage['access_token']) && (window.localStorage['access_token']) != 'undefined')){
             $ionicHistory.nextViewOptions({
                 disableBack: true
             });
             $state.go('app.allCategory');
         }
         else {
             navigator.app.backHistory();
         }
     }, 100);
 });

