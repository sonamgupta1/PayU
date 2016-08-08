appControllers.controller('paymentFailCtrl', function ($scope,$location,generateNewTransactionService,$stateParams,
                                                       $ionicHistory, $state,$rootScope) {
    var booking_id = $stateParams.b_id;
    var transaction_id = $stateParams.t_id;

    var cat_id = window.localStorage['cat_id'];
    var product_id = window.localStorage['product_id'];
    $scope.search_text =  window.localStorage['search_text'];
    $scope.sub_cat_id = window.localStorage['sub_cat_id'];
    $scope.home_id = window.localStorage['home_id'];
    

    if($scope.home_id != '' && $scope.home_id !="undefined"){
        $scope.flag_1 = 'true';
        $scope.flag_2 = 'false';
        $scope.flag_3 = 'false';
        window.localStorage['home_id']= "undefined";
    }
    else if($scope.search_text != "" && $scope.search_text !="undefined"){
        window.localStorage['search_text_b'] = $scope.search_text;
        $scope.flag_2 = 'true';
        $scope.flag_1 = 'false';
        $scope.flag_3 = 'false';
        window.localStorage['search_text'] = "undefined";
    }
    else if($scope.sub_cat_id != "" && $scope.sub_cat_id !="undefined"){
        window.localStorage['sub_cat_id_b'] = $scope.sub_cat_id;
        $scope.flag_3 = 'true';
        $scope.flag_1 = 'false';
        $scope.flag_2 = 'false';
        window.localStorage['sub_cat_id'] = "undefined";
    }

    $scope.try_again = function(){
        generateNewTransactionService.transaction_generate(transaction_id).then(function(data){
            var t_id = data.data.data;
            window.localStorage['id'] = t_id ;
            $state.go('app.orp',{'cat_id':cat_id,'product_id':product_id});
        })
    };

    $scope.try_again_search = function(){
        console.log("search text",$scope.search_text)
        generateNewTransactionService.transaction_generate(transaction_id).then(function(data){
            var t_id = data.data.data;
            window.localStorage['id'] = t_id ;

            $state.go('app.orp_search',{'search_text':window.localStorage['search_text_b'],'cat_id':cat_id,'product_id':product_id});
        })
    };

    $scope.try_again_cat = function(){
        generateNewTransactionService.transaction_generate(transaction_id).then(function(data){
            var t_id = data.data.data;
            window.localStorage['id'] = t_id ;
            $state.go('app.orp_cat',{'cat_id':cat_id,'sub_cat_id':window.localStorage['sub_cat_id_b'],'product_id':product_id});
        })

    };
});


