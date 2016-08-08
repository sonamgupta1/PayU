appControllers.controller('catSharedCtrl', function ($scope, $mdBottomSheet, $timeout,slug_url,image,
                                                                   $mdToast, $cordovaSocialSharing,name) {

    $scope.url = 'www.imzolo.com/package/'+slug_url;
    $scope.sharedFacebook = function () {
        $cordovaSocialSharing.shareViaFacebook(name,null,$scope.url).then(function(result) {
            console.log("result",JSON.stringify(result))
        }, function(err) {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Facebook app not found, please install app for share.'
                    }
                }
            });
            console.log("err",JSON.stringify(err))

        });
        $mdBottomSheet.hide();
    };


    $scope.sharedTwitter = function () {
        $cordovaSocialSharing.shareViaTwitter(name+' @Zolo_Official',image, $scope.url).then(function(result) {
            console.log("result",JSON.stringify(result))
        }, function(err) {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: 'Twitter app not found, please install app for share.'
                    }
                }
            });
            console.log("err",JSON.stringify(err))

            // An error occurred. Show a message to the user
        });
        $mdBottomSheet.hide();
    };
    $scope.sharedMail = function () {
        $cordovaSocialSharing.shareViaEmail(name, "Find this package on zolo "+ $scope.url, null,null,null,image);
        $mdBottomSheet.hide();
    };

    $scope.more = function(){
        $cordovaSocialSharing
            .share(name+' @Zolo_Official', "Find this package on zolo "+ $scope.url, image, $scope.url) // Share via native share sheet
            .then(function(result) {
                // Success!
                console.log("result",JSON.stringify(result))

            }, function(err) {
                console.log("err",JSON.stringify(err))

                // An error occured. Show a message to the user
            });

        $mdBottomSheet.hide();

    };

    $scope.sharedWhatsApp = function(){
        $cordovaSocialSharing
            .shareViaWhatsApp(name,image, $scope.url)
            .then(function(result) {
                // Success!
            }, function(err) {
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'WhatsApp app not found, please install app for share.'
                        }
                    }
                });
                // An error occurred. Show a message to the user
            });
    }
});
