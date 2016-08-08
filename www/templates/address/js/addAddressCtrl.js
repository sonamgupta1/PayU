appControllers.controller('addAddressCtrl', function ($scope, $timeout,$state, $mdUtil,GetUserAddressService
    ,addUserAddressService,$mdToast,$rootScope) {

    var access_token = window.localStorage['access_token'];
    $scope.user = {};

    $scope.user.default = false;
    
    var user_id = window.localStorage['user_id'];

    $scope.skip = function(){
        $state.go('app.paymentOption');
    };

    $scope.back_to_address = function(){
        $state.go('app.address');
    };
    
    addAddressData = function () {
        data = {
            "name": $scope.user.name,
            "street_address": $scope.user.address,
            "pincode": $scope.user.pincode,
            "landmark": $scope.user.landmark,
            "city": $scope.user.city,
            "state": $scope.user.state,
            "phone_number": $scope.user.mobile,
            "is_default": $scope.user.default,
        }
    };
    

    $scope.save_address = function(){
        addAddressData();
        if(($scope.user.name)&&($scope.user.address)&&($scope.user.pincode)&&($scope.user.landmark)&&($scope.user.city)&&
            ( $scope.user.state)&&($scope.user.mobile)){
            if(($scope.user.mobile.toString().length == 10) && ($scope.user.pincode.length == 6)){
                addUserAddressService.add_user_address(data,user_id).then(function(data){
                    if(data.data.message=='success'){
                        $mdToast.show({
                            controller: 'toastController',
                            templateUrl: 'toast.html',
                            hideDelay: 800,
                            position: 'top',
                            locals: {
                                displayOption: {
                                    title: 'Address added successfully!'
                                }
                            }
                        });
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



