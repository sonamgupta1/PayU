appControllers.controller('profileCtrl', function($scope,$rootScope,$state,$stateParams,profileService,
                                                  SellerProfileService) {

    var access_token = window.localStorage['access_token'];
    $scope.seller_info = [];
    $scope.get_profile_info = function () {
        $rootScope.$broadcast('loading:show');
        profileService.get_profile(access_token).then(function(data){
            $scope.profile = data.data.data;
            $rootScope.$broadcast('loading:hide');
             if((($scope.profile.is_seller == '1') ||($scope.profile.is_seller == 1)) &&($scope.profile.user_id)){
                    $scope.seller_info = [];
                    SellerProfileService.getSellerInfo($scope.profile.user_id).then(function (data) {
                        $scope.p_info = data.data.data;
                        angular.forEach($scope.p_info, function(value, key){
                            if((value.isCompleted == "1") ||(value.isCompleted == "true") ||(value.isCompleted == true)){
                                $scope.seller_info.push(value);
                            }
                        });
                    });
             }
        });
    };

    $scope.get_profile_info();
});

