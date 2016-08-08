appControllers.controller('addressCtrl', function ($scope, $timeout,$state,$mdToast, $mdUtil,GetUserAddressService,
                                                   profileService,$stateParams,$ionicPopup,
                                                   deleteUserAddressService,$rootScope,editUserAddressService) {
    
    var access_token = window.localStorage['access_token'];

    var user_id = window.localStorage['user_id'];

    $scope.address = {};


    profileService.get_profile(access_token).then(function (data) {
        window.localStorage['user_id']=data.data.data.user_id;
        if(data.data.data.user_id){
            var id = data.data.data.user_id;
            GetUserAddressService.user_address(id).then(function(data){
                $scope.user_address = data.data.data;
            });
            $scope.$on('addressListChanged', function (event, args) {
                $scope.message = args.message;
                GetUserAddressService.user_address(id).then(function(data){
                    $scope.user_address = data.data.data;
                });
            });
        }
    });

    $scope.default_address = function(address,id,default_value){
        $scope.address = address;
            $scope.address.is_default = default_value;

        editUserAddressService.edit_user_address($scope.address,id).then(function (data) {
            if (data.data.message == 'success') {
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 1000,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Delivery address changed!'
                        }
                    }
                });
                $rootScope.$broadcast('addressListChanged', {message: 'Change in address list'});
                $state.go('app.address', null, {reload: true});

            }
            else{
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 1000,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Something went wrong,please try again!'
                        }
                    }
                });
                $state.go('app.address', null, {reload: true});
            }
        })
    };

    $scope.skip = function(){
        $state.go('app.paymentOption');
    };
    
    $scope.address_info = function () {
        $state.go('app.address_fill');
    };
    
    $scope.edit_address = function(edit_id){
        $state.go('app.edit_address',{edit_id:edit_id});
    };

    $scope.payment_option = function(){
        $state.go('app.paymentOption');
    };

    $scope.delete_add = function (delete_id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure ?',
            template: 'You want to delete this address.'
        });
        confirmPopup.then(function(res) {
            if(res) {
                deleteUserAddressService.delete_user_address(delete_id).then(function(data){
                    if(data.data.message == 'success'){
                        $mdToast.show({
                            controller: 'toastController',
                            templateUrl: 'toast.html',
                            hideDelay: 800,
                            position: 'top',
                            locals: {
                                displayOption: {
                                    title: 'Address deleted successfully.'
                                }
                            }
                        });
                        $rootScope.$broadcast('addressListChanged', { message: 'Change in address list' });
                        $state.go('app.address', null, {reload:true});

                    }
                });
            } else {
                console.log('You are not sure');
            }
        });
    };
    
});


