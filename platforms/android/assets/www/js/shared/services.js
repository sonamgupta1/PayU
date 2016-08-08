angular.module('starter').factory('CategoryService', function($http,$rootScope,$q,serverConfig){
    return {
        getAll : function() {
            $rootScope.$broadcast('loading:show');

            var deffer = $q.defer();
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/category'
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');

            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');

            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('packagesService', function($http,$rootScope,$q,serverConfig){
    return {
        getPackagesList:function(sub_category_id){
            $rootScope.$broadcast('loading:show');

            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/category/"+sub_category_id+"?include=Packages"
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');

            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');

            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('MaxPriceService', function($http,$rootScope,$q,serverConfig){
    return {
        getMaxPrice : function() {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/maxPrice'
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("data in error",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('AssignmentService', function($http,$rootScope,$q,serverConfig){
    return {
        getCategoryPackages:function(id){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/category/"+id+"?include=Packages"
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');

            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');

            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('SellerProfileService', function($http,$rootScope,$q,serverConfig){
    return {
        getSellerInfo:function(id){
            $rootScope.$broadcast('loading:show');

            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/user/"+id+"/packages?include=category"
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');

            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');

            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('subCategoryService', function($http,$rootScope,$q,serverConfig){
    return {
        getSubCategory:function(){
            $rootScope.$broadcast('loading:show');

            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/category?include=subCategory"
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('subCategoryListService', function($http,$rootScope,$q,serverConfig){
    return {
        getSubCategoryWithId:function(category_id){
            $rootScope.$broadcast('loading:show');

            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/category/"+category_id+"?include=subCategory"
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');

            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
                
            });
            return deffer.promise;
        }
    }
});
angular.module('starter').factory('productService', function($http,$q,$rootScope,serverConfig){
    return {
        getProductDescription:function(product_id,u_id){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/package/"+product_id+"?user_id="+u_id
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('signUpService', function($http,$state,$rootScope,$q,$mdToast,serverConfig){
    return {
        signUp: function (data) {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/signup",
                data: data
            }).
            success(function(data, status, headers, config) {
                if(data.status_code == '200'){
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: data.message
                            }
                        }
                    });
                }
              else if(data.status_code == '422'){
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: data.message
                            }
                        }
                    });
                }
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: data.message[0]
                        }
                    }
                });
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('payByPayU', function($http,$q,$rootScope,serverConfig){
    return {
        get_payment_ifo:function(id){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/mpayBookingAmount/"+id
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});



angular.module('starter').factory('forgetPasswordService', function($http,$state, $rootScope,$q,$mdToast,serverConfig){
    return {
        forget_password: function (data) {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/users/forgotPassword",
                data: data
            }).
            success(function(data, status, headers, config) {
                
                if(data.status_code == '200'){
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: data.message
                            }
                        }
                    });
                }
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: data.message
                        }
                    }
                });
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    };
});

angular.module('starter').factory('googleLogin', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        google_login: function (data) {
            // $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/auth/m_google",
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                // $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("status",status)
                // $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});
angular.module('starter').factory('facebookLogin', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        facebook_login: function (data) {
            // $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/auth/m_facebook",
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                // $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("status",status)
                // $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('googleToken', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        google_token: function (data) {
            // $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"oauth/access_token",
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                // $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("status",status)

            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('profileService', function($http,$q,$rootScope,serverConfig){
    return {
        get_profile:function(access_token){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+'api/myProfile?access_token='+access_token
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('bannerService', function($http,$q,$rootScope,serverConfig){
    return {
        get_banner:function(){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+'api/banner'
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('wishListService', function($http,$q,$rootScope,serverConfig){
    return {
        get_wish_list:function(access_token){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/getWishlist?access_token="+access_token
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('removeWishListService', function($http,$q,$rootScope,serverConfig){
    return {
        remove_wish_list:function(p_id,access_token){
            var headers = { 'Authorization':"Bearer "+ access_token };
            var package = {
                "package_id":p_id
            }
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"PUT",
                headers:headers,
                // url:serverConfig.address+"api/removeWishPackage?access_token="+access_token,
                url:serverConfig.address+"api/removeWishPackage",
                data: package,

            }).success(function(data, status, headers, config) {
                console.log("data",JSON.stringify(config))
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("error",status)
                console.log("error config",JSON.stringify(config))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('orderListService', function($http,$q,$rootScope,serverConfig){
    return {
        get_order:function(access_token){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/myPurchases?access_token="+access_token
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});





angular.module('starter').factory('bookingService', function($http,$state,$rootScope,$q,$mdToast,serverConfig){
    return {
        OrpInfo: function (data) {
            data.access_token = window.localStorage['access_token'];
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/booking",
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                if(status == 500){
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: 'Please Login'
                            }
                        }
                    });
                }
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('OrderReviewService', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        booking_info_orp: function (booking_id,id) {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "GET",
                url: serverConfig.address+"api/booking/"+booking_id+"?access_token="+window.localStorage['access_token']
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("data in error",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
               
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('GetUserAddressService', function($http,$state,$rootScope,$q,$mdToast,serverConfig){
    return {
        user_address: function (user_id) {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "GET",
                url: serverConfig.address+"api/userAddress?user_id="+user_id+"&access_token="+window.localStorage['access_token']
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {

                console.log("data in error",JSON.stringify(config))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('addUserAddressService', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        add_user_address: function (data,user_id) {
            $rootScope.$broadcast('loading:show');
            var headers = { 'Authorization':"Bearer "+ window.localStorage['access_token'] };
            var deffer = $q.defer();
            return $http({
                method: "POST",
                headers:headers,
                url: serverConfig.address+"api/userAddress?user_id="+user_id,
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("dddd",JSON.stringify(config))
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('editUserAddressService', function($http,$state,$rootScope,$q,$mdToast,serverConfig){
    return {
        edit_user_address: function (data,id) {
            var headers = { 'Authorization':"Bearer "+ window.localStorage['access_token'] };

            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "PUT",
                headers:headers,
                url: serverConfig.address+"api/userAddress/"+id,
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("error config",JSON.stringify(config))
                console.log("error data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('deleteUserAddressService', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        delete_user_address: function (id) {
            var headers = { 'Authorization':"Bearer "+ window.localStorage['access_token'] };
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "DELETE",
                headers:headers,
                url: serverConfig.address+"api/userAddress/"+id
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("error",JSON.stringify(config))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('addWishList', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        add_to_wish_list: function (data) {
            data.access_token = window.localStorage['access_token'];
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/wishPackage",
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
            if(status == 500){
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Please Login'
                        }
                    }
                });
            }
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('ContactService', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        contact: function (data) {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/contact",
                data: data
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("status",status);
                $rootScope.$broadcast('loading:hide');


            });
            return deffer.promise;
        }
    }
});






angular.module('starter').factory('generateNewTransactionService', function($http,$rootScope,$state,$q,$mdToast,serverConfig){
    return {
        transaction_generate: function (trans_id) {
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method: "POST",
                url: serverConfig.address+"api/createNewTransaction/"+trans_id
            }).
            success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("status",status);
                console.log("config",JSON.stringify(config));
                console.log("data",JSON.stringify(data));
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});







angular.module('starter').factory('orderDetailService', function($http,$q,$rootScope,serverConfig){
    return {
        get_order_detail:function(id){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/booking/"+id
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});


angular.module('starter').factory('shaService', function($http,$q,$rootScope,serverConfig){
    return {
        get_sha:function(t_id){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"get",
                url:serverConfig.address+"api/getSha/"+t_id
            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                console.log("error",status)
                console.log("config",JSON.stringify(config))
                console.log("data",JSON.stringify(data))
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});

angular.module('starter').factory('paymentService', function($http,$q,$rootScope,serverConfig){
    return {
        payment_info_send:function(data){
            $rootScope.$broadcast('loading:show');
            var deffer = $q.defer();
            return $http({
                method:"PUT",
                url:serverConfig.address+"api/updateTheBookingStatusMobile",
                data: {data:data},

            }).success(function(data, status, headers, config) {
                deffer.resolve(data);
                $rootScope.$broadcast('loading:hide');
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('loading:hide');
            });
            return deffer.promise;
        }
    }
});
