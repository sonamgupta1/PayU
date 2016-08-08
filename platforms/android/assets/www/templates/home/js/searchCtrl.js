appControllers.controller('searchController', function ($scope, $ionicHistory, $state,$stateParams,$rootScope) {
    $scope.filterText = '';

    $scope.text_1 = window.localStorage['text_1'];
    $scope.text_2 = window.localStorage['text_2'];
    $scope.text_3 = window.localStorage['text_3'];

    $rootScope.$on('text', function (event, args) {
        $scope.text_1 = window.localStorage['text_1'];
        $scope.text_2 = window.localStorage['text_2'];
        $scope.text_3 = window.localStorage['text_3'];
    });

    $scope.special_packages = ['Wedding photography','Pre wedding shoot','Jaimala setup', 'Bridal makeup', 'Wedding makeup','Bridal mehandi','DJ & live performance','Wedding choreography','Wedding decor','Catering','Cakes'];

   $scope.search_package = function (text) {
    if(text){
        $state.go('app.search_info',{'search_text':text});
    }
   };

    $scope.clear_text_1 = function () {
        window.localStorage['text_1'] = '';
        $rootScope.$broadcast('text', { message: 'text changed' });

    };
    $scope.clear_text_2 = function () {
        window.localStorage['text_2'] = '';
        $rootScope.$broadcast('text', { message: 'text changed' });

    };
    $scope.clear_text_3 = function () {
        window.localStorage['text_3'] = '';
        $rootScope.$broadcast('text', { message: 'text changed' });

    };



    $scope.search_result = function(text){
        if(text){
            if( window.localStorage['text_1'] == '' || window.localStorage['text_1'] == undefined){
                window.localStorage['text_1']=text;
                window.localStorage['count'] = 1;
                console.log("inside if");
            }
           else if(window.localStorage['text_1'] &&
                ((window.localStorage['text_2'] == '' || window.localStorage['text_2'] == undefined))){
                window.localStorage['text_2']=text;
                window.localStorage['count'] = 2;
                console.log("inside if 2");
            }
           else if(window.localStorage['text_1'] && window.localStorage['text_2'] &&
                (window.localStorage['text_3'] == '' || window.localStorage['text_3'] == undefined)){
                window.localStorage['text_3']=text;
                window.localStorage['count'] = 3;
                console.log("inside if 3");
           }
            else if(window.localStorage['text_1'] && window.localStorage['text_2'] && window.localStorage['text_3'] && window.localStorage['count'] == 3){
                window.localStorage['text_1']=text;
                window.localStorage['count'] = 2;
                console.log("inside if 4");
            }
            else if(window.localStorage['text_1'] && window.localStorage['text_2'] && window.localStorage['text_3'] && window.localStorage['count'] == 2){
                window.localStorage['text_2']=text;
                window.localStorage['count'] = 1;
                console.log("inside if 5");
            }
            else if(window.localStorage['text_1'] && window.localStorage['text_2'] && window.localStorage['text_3'] && window.localStorage['count'] == 1){
                window.localStorage['text_3']=text;
                window.localStorage['count'] = 0;
                console.log("inside if 6");
            }
            else if(window.localStorage['text_1'] && window.localStorage['text_2'] && window.localStorage['text_3'] && window.localStorage['count'] == 0){
                window.localStorage['text_1']=text;
                window.localStorage['count'] = 1;
                console.log("inside if 7");
            }
            $state.go('app.search_info',{'search_text':text});
        }
    };
    $scope.back_to_home = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.home');
    };

});