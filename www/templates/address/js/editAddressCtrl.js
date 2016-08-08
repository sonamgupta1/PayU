appControllers.controller('editAddressCtrl', function ($scope, $timeout,$state, $mdUtil,GetUserAddressService,
                                                      editUserAddressService,$rootScope,$stateParams,$mdToast) {

    var access_token = window.localStorage['access_token'];
    
    $scope.address = {};

    var user_id = window.localStorage['user_id'];

    $scope.skip = function(){
        $state.go('app.paymentOption');
    };
    $scope.back_to_address = function(){
        $state.go('app.address');
    };
    // $scope.num_str = parseInt(num_str, 10);

    GetUserAddressService.user_address(user_id).then(function(data){
        $scope.user_address = data.data.data;
        angular.forEach($scope.user_address , function (obj) {
           if(obj.id == $stateParams.edit_id){
               $scope.address = obj;
               if($scope.address.is_default == '0'){
                   $scope.address.is_default = false;
                   $scope.address.phone_number = parseInt($scope.address.phone_number);
               }
               else{
                   $scope.address.is_default = true;
                   $scope.address.phone_number = parseInt($scope.address.phone_number);

               }
           }

        });
    });
    
    $scope.edit_address = function(add_id){
        var id = add_id;
        if(($scope.address.name)&&($scope.address.street_address)&&($scope.address.landmark)&&($scope.address.city)&&
            ($scope.address.state)&& ($scope.address.pincode)&&($scope.address.phone_number)){
            if(($scope.address.phone_number.toString().length == 10) && ($scope.address.pincode.length == 6)){
                editUserAddressService.edit_user_address($scope.address,id).then(function (data) {
                    if(data.data.message == 'success'){
                        $mdToast.show({
                            controller: 'toastController',
                            templateUrl: 'toast.html',
                            hideDelay: 800,
                            position: 'top',
                            locals: {
                                displayOption: {
                                    title: 'Address edited successfully.'
                                }
                            }
                        });
                        $rootScope.$broadcast('addressListChanged', { message: 'Change in address list' });
                        $state.go('app.address', null, {reload:true});

                    }
                    else{
                        $mdToast.show({
                            controller: 'toastController',
                            templateUrl: 'toast.html',
                            hideDelay: 800,
                            position: 'top',
                            locals: {
                                displayOption: {
                                    title: 'Some error occurred'
                                }
                            }
                        });
                    }
                })
            }
            else{
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Pincode should have 6 characters at-least and mobile should have 10 digits!'
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

});




