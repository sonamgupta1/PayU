appControllers.controller('MenuCtrl', function($scope,$ionicPopup,$mdToast,$state,$stateParams,profileService,$ionicHistory,
                                               $ionicSideMenuDelegate,subCategoryService,bannerService,$rootScope,
                                               $ionicSlideBoxDelegate,$auth) {
    $scope.title = 'Zolo';

    $scope.$on('title_in', function (event, args) {
        $scope.title = '';
    });
    $scope.$on('title_out', function (event, args) {
        $scope.title = 'Zolo';
    });
    $scope.profile_name = window.localStorage['profile_name'];
    $scope.profile_img = window.localStorage['profile_img'];

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
        if($ionicSideMenuDelegate.isOpenLeft() == true){
            $rootScope.$broadcast('title_out', { message: 'title changed!' });
        }
        else if($ionicSideMenuDelegate.isOpenLeft() == false){
            $rootScope.$broadcast('title_in', { message: 'title changed!' });
        }
    };

    bannerService.get_banner().then(function(response){
        $scope.banner = response.data.data;
        $ionicSlideBoxDelegate.update();
    });

    $scope.open_search = function () {
       $state.go('app.search_page');
    };
    
    $scope.access_token = window.localStorage['access_token'];

    $scope.login_value = true;

    $rootScope.$on('logged_in', function (event, args) {
        $scope.login_value = false;
            profileService.get_profile($scope.access_token).then(function(data){

                window.localStorage['profile_name'] = data.data.data.name;
                window.localStorage['profile_img'] = data.data.data.image;
                $scope.profile_name = window.localStorage['profile_name'];
                $scope.profile_img = window.localStorage['profile_img'];
            })
    });

    if($scope.access_token) {
        $scope.login_value = false;
    }

    $scope.$on('logout', function (event, args) {
        $scope.message = args.message;
        $scope.login_value = true;

    });
    

    $scope.login_options = function(){
        window.localStorage['pro_id']= '';
        window.localStorage['cat_id'] = '';
        $state.go('app.optional_index');
    };

    $scope.logOut = function(){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure ?',
            template: 'You want to Logged out.'
        });
        confirmPopup.then(function(res) {
            if(res) {
                window.localStorage['access_token'] ='';
                window.localStorage['pro_id'] ='';
                window.localStorage['orp_page'] = '';
                window.localStorage['search_text'] = '';
                window.localStorage['sub_cat_id'] = '';
                window.localStorage['home_id'] = '';
                window.localStorage['satellizer_access_token'] = '';
                window.localStorage['profile_name'] = '';
                window.localStorage['profile_img'] = '';
                window.localStorage['booking_id'] = '';
                window.localStorage['product_id'] = '';
                $auth.logout();

                // $window.location.reload();
                $rootScope.$broadcast('logout', {message: 'log out'});
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.home');
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Logged out successfully.'
                        }
                    }
                });
            }
            else {
                console.log('You are not sure');
            }
        });
    };

    $scope.wish_list = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.wishlist', null, {reload:true});
    };

    subCategoryService.getSubCategory().then(function(data){
        $scope.category_n_sub_catagery_list = data.data.data;
        $ionicSlideBoxDelegate.update();
    });

    $scope.allSubcategory = function(id){
        $state.go('app.subCategory',{'cat_id':id});
    };
    $scope.getPackages = function(id){
        $state.go('app.package_list',{'sub_cat_id':id});
    };
    $scope.my_profile = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.profile');
    };
});

