appControllers.controller('packagesCtrl', function ($scope, packagesService, $ionicModal,
                                                    MaxPriceService, $ionicHistory, $state,
                                                    $stateParams, algolia,$rootScope) {
    
    $scope.price_list = true;
    $scope.sorting_value = false;
    $scope.sort_by = false;
    $scope.price_range = [];
    $scope.sorting_type = 'price';
    $scope.choice={
        val:-1
    };
    $scope.home_button = false;

    $scope.disable_value = function () {
        $scope.disable_loadMore = false;
    };
    $scope.active_index='candybrush_packages';

    $scope.change_index=function(index){
        $scope.active_index=index;
    };
    $scope.get_index=function(){
        return $scope.active_index;
    };
    var stringFilter = '';
    var client = algolia.Client('ORMLLAUN2V', '48e614067141870003ebf7c9a1ba4b59');

    var index = client.initIndex('candybrush_packages');

    $scope.filter = {price: false};

    packagesService.getPackagesList($stateParams.sub_cat_id).then(function (data) {
        $scope.packages_list = data.data.data;
    });


    $scope.go_home = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.home');
    };
   $scope.back_to_home = function(){
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $state.go('app.home');
   };
    $scope.productDescription = function (id) {
        $state.go('app.product_desc', {'cat_id':$stateParams.sub_cat_id,'product_id': id})
    };

    $scope.filter_clear = function(stringFilter,load_option){

        // $scope.filter.price = '';
        $scope.disable_value();
        $scope.filter.price = 'blank';
        $scope.choice.val = '';
        if(stringFilter == undefined){
            stringFilter = '';
        }
        $scope.active_index='candybrush_packages';

        if(load_option == false ||load_option == undefined){
            $rootScope.$broadcast('loading:show');
            if(stringFilter==''){
                stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
            }else {
                stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
            }
            gFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';
            var index = client.initIndex('candybrush_packages');
            index.search(
                "", {
                    hitsPerPage: 10,
                    facets: '*',
                    filters: gFilter,
                    maxValuesPerFacet: 10
                }).then(
                function(content){
                    $scope.packages = content.hits;
                    $scope.total_page=content.nbPages;
                    $scope.current_page=content.page;
                    $scope.modal.hide();
                    $rootScope.$broadcast('loading:hide');


                }
            ).catch(function (error) {
                console.log("error",JSON.stringify(error));
                $scope.modal.hide();
                $rootScope.$broadcast('loading:hide');


            });
        }
        else{
            $rootScope.$broadcast('loading:show');
            if($scope.current_page <= $scope.total_page){
                if(stringFilter==''){
                    stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
                }else {
                    stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
                }
                stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';
                var index = client.initIndex('candybrush_packages');
                index.search(
                    "", {
                        hitsPerPage: 10,
                        facets: '*',
                        filters: stringFilter,
                        maxValuesPerFacet: 10,
                        page:++$scope.current_page
                    }).then(
                    function(content){
                        if(content.hits.length == 0){
                            $scope.disable_loadMore = true;
                        }
                        angular.forEach(content.hits,function(obj){
                            $scope.packages.push(obj);
                        });
                        $scope.modal.hide();
                        $rootScope.$broadcast('loading:hide');


                    }
                ).catch(function (error) {
                    console.log("error",error);
                    $scope.modal.hide();
                    $rootScope.$broadcast('loading:hide');

                });
            }
            return;
        }
    };

    $ionicModal.fromTemplateUrl('templates/home/html/search_package_short_modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openSortAndFilterModal = function () {
        $scope.modal.show();
    };
    $scope.closeSortAndFilterModal = function () {
        $scope.modal.hide();
    };

    $scope.price_list_option = function () {
        $scope.sorting_type = 'price';
        $scope.sort_by = false;
        $scope.price_list = true;
        $scope.sorting_value = false;
    };
    $scope.sorting_option = function () {
        $scope.sorting_type = 'sort';
        $scope.sort_by = true;
        $scope.price_list = false;
        $scope.sorting_value = true;

    };

    MaxPriceService.getMaxPrice().then(function (data) {
        $scope.max_price = data.data.data;
        $scope.range = {};
        $scope.range.from = 0;
        $scope.range.to = parseInt($scope.max_price);
        $scope.RangeOptions = {
            floor: 0,
            ceil: $scope.max_price,
            step: 500
        };
    });
    $scope.makefilters = function () {
        var my_maximum = Math.max.apply(null, $scope.price_range);
        var my_minimum = Math.min.apply(null, $scope.price_range);
        stringFilter = "deal_price : " + my_minimum + " TO " + my_maximum;
    };

    $scope.back_to_search = function(){
      var  new_Filter='(isCompleted:true' + ' OR ' + 'isCompleted:1)' + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';

        $scope.filter_clear(new_Filter,false);
    };

    $scope.search_packages = function(stringFilter,load_option){
        if(load_option == false){
            $scope.home_button = true;
            $rootScope.$broadcast('loading:show');
            if(stringFilter==''){
                stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
            }else {
                stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
            }
            gFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';


            var index = client.initIndex($scope.get_index());
            index.search(
                "", {
                    hitsPerPage: 10,
                    facets: '*',
                    filters: gFilter,
                    maxValuesPerFacet: 10
                }).then(
                function(content){
                    $scope.packages = content.hits;
                    $scope.total_page=content.nbPages;
                    $scope.current_page=content.page;
                    $rootScope.$broadcast('loading:hide');

                }
            ).catch(function (error) {
                console.log("error",JSON.stringify(error));
                $rootScope.$broadcast('loading:hide');

            });
        }
        else{
            $rootScope.$broadcast('loading:show');
            if($scope.current_page <= $scope.total_page){

                console.log(" load",stringFilter)

                if(stringFilter==''){
                    stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
                }
                else {
                    stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
                }
                stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';

                console.log("after load",stringFilter)

                var index = client.initIndex($scope.get_index());
                index.search(
                    "", {
                        hitsPerPage: 10,
                        facets: '*',
                        filters: stringFilter,
                        maxValuesPerFacet: 10,
                        page:++$scope.current_page
                    }).then(
                    function(content){
                        if(content.hits.length == 0){
                            $scope.disable_loadMore = true;
                        }
                        angular.forEach(content.hits,function(obj){
                            $scope.packages.push(obj);
                        });
                        $rootScope.$broadcast('loading:hide');
                    }
                ).catch(function (error) {
                    console.log("error",error);
                    $rootScope.$broadcast('loading:hide');

                });
            }
            return;

        }

    };
     $scope.search_packages(stringFilter,false);
    
    $scope.filter_apply = function (filter) {
        $scope.disable_value();
        $scope.home_button = false;

        $rootScope.$broadcast('loading:show');
        var client = algolia.Client('ORMLLAUN2V', '48e614067141870003ebf7c9a1ba4b59');

        var index = client.initIndex($scope.get_index());
        if(stringFilter==''){
            stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
        }else {
            stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
        }
        stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';
        // stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';
        index.search(
            "", {
                hitsPerPage: 10,
                facets: '*',
                filters: stringFilter,
                maxValuesPerFacet: 10
            }).then(
            function(content){
                $scope.packages = content.hits;
                $scope.closeSortAndFilterModal();
                $rootScope.$broadcast('loading:hide');

            }
        ).catch(function (error) {
            console.log("error",error);
            $rootScope.$broadcast('loading:hide');

        });
    };

    $scope.load_more = function(){
        // if(!($scope.filter.price)){
        if($scope.filter.price == 'blank'){
            stringFilter = '';
            $scope.filter_clear(stringFilter,true);
        }
        else{
            $scope.search_packages(stringFilter,true);
        }
    };


    $scope.pricehtol = function (filter) {
        $rootScope.$broadcast('loading:show');
        $scope.disable_value();
        $scope.home_button = false;



        var client = algolia.Client('ORMLLAUN2V', '48e614067141870003ebf7c9a1ba4b59');

        var index = client.initIndex('deal_price_desc');


        if(stringFilter==''){
            stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
        }else {
            stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
        }
        stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';

        index.search(
            "", {
                hitsPerPage: 10,
                facets: '*',
                filters: stringFilter,
                maxValuesPerFacet: 10
            }).then(
            function(content){
                $scope.packages = content.hits;
                $scope.current_page=content.page;
                $scope.closeSortAndFilterModal();
                $rootScope.$broadcast('loading:hide');
            }
        ).catch(function (error) {
            console.log("error",error);
            $rootScope.$broadcast('loading:hide');

        });

    };
    $scope.priceltoh = function (filter) {
        $rootScope.$broadcast('loading:show');
        $scope.home_button = false;

        $scope.disable_value();

        var client = algolia.Client('ORMLLAUN2V', '48e614067141870003ebf7c9a1ba4b59');

        var index = client.initIndex('deal_price_asc');

        if(stringFilter==''){
            stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
        }else {
            stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
        }
        stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';
        index.search(
            "", {
                hitsPerPage: 10,
                facets: '*',
                filters: stringFilter,
                maxValuesPerFacet: 10
            }).then(
            function(content){
                $scope.packages = content.hits;
                $scope.current_page=content.page;
                $scope.closeSortAndFilterModal();
                $rootScope.$broadcast('loading:hide');
            }
        ).catch(function (error) {
            console.log("error",error);
            $rootScope.$broadcast('loading:hide');

        });

    };
    $scope.newfirst = function (filter) {
        $rootScope.$broadcast('loading:show');
        $scope.disable_value();
        $scope.home_button = false;


        var client = algolia.Client('ORMLLAUN2V', '48e614067141870003ebf7c9a1ba4b59');
        var index = client.initIndex('new_packages_first');

        if(stringFilter==''){
            stringFilter='(isCompleted:true'+' OR '+'isCompleted:1)';
        }else {
            stringFilter = stringFilter + ' AND ' + '(isCompleted:true' + ' OR ' + 'isCompleted:1)';
        }
        stringFilter=stringFilter + ' AND ' + '(category_id:'+$stateParams.sub_cat_id + ' OR ' + 'subcategory_id:'+$stateParams.sub_cat_id+')';
        index.search(
            "", {
                hitsPerPage: 10,
                facets: '*',
                filters: stringFilter,
                maxValuesPerFacet: 10
            }).then(
            function(content){
                $scope.packages = content.hits;
                $scope.current_page=content.page;
                $scope.closeSortAndFilterModal();
                $rootScope.$broadcast('loading:hide');
            }
        ).catch(function (error) {
            console.log("error",error);
            $rootScope.$broadcast('loading:show');

        });

    };

    $scope.addPrice = function (initial, final) {
     
        switch($scope.filter.price){
            case '1':{
                $scope.price_range = [];
                $scope.price_range.push(0, 1000);
                break;
            }
            case '2':{
                $scope.price_range = [];
                $scope.price_range.push(1001, 10000);
                break;
            }
            case '3':{
                $scope.price_range = [];
                $scope.price_range.push(10001, 50000);break;
            }
            case '4':{
                $scope.price_range = [];
                $scope.price_range.push(50001, 100000);break;
            }
            case '5':{
                $scope.price_range = [];
                $scope.price_range.push(100001, $scope.max_price);break;
            }
        }
        $scope.makefilters();
    };
    $scope.makeSort=function(val){
        $scope.choice.val = val;
    };
    $scope.sort_apply = function(val){
        switch(val){
            case 1:{$scope.pricehtol();$scope.change_index("deal_price_desc");break;}
            case 2:{$scope.priceltoh();$scope.change_index("deal_price_asc");break;}
            case 3:{$scope.newfirst();$scope.change_index("new_packages_first");break;}
        }
    };

    // $scope.sort_clear = function(){
    //     $scope.choice.val = '';
    // };
});
