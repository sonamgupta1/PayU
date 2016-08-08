appControllers.controller('paymentCtrl', function ($sce,$scope,$state,$cordovaInAppBrowser,$rootScope,$ionicModal,shaService,
                                                   OrderReviewService,paymentService,$ionicHistory) {


    var id =  window.localStorage['id'];
    var booking_id = window.localStorage['booking_id'];
    $scope.token = window.localStorage['access_token'];
    $scope.disable_value = true;
    $scope.payment = {};
    var iabRef = null;
    var shss = '';
    var orp_data ='';
    var invoice_id = 'ZOLO-PBA-'+booking_id;

    OrderReviewService.booking_info_orp(booking_id,id).then(function(data){
        orp_data = data.data.data;
    });

    $scope.choice={
        val:1
    };
    // $scope.choice={
    //     val:-1
    // };
    shaService.get_sha(id).then(function(response){
        shss = response.data.data;
        if(shss){
            $scope.disable_value = false;
        }
    });

    $ionicModal.fromTemplateUrl('templates/home/html/refundPolicyModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.refund_Policy_open = function () {
        $scope.modal.show();
    };
    $scope.refund_Policy_close = function () {
        $scope.modal.hide();
    };


    $scope.payment_option_list = function (val) {
        $scope.value = val;
        // $scope.makePay()
    };
    
    $scope.pay_by_payU = function(){
        onDeviceReadyTest();
    };

    // $scope.makePay=function(val){
    //     console.log("val",val);
    //     switch(val){
    //         case 1:{$scope.pay_by_payU(host_ip);
    //             break;}
    //     //
    //         // case 2:{$scope.priceltoh();break;}
    //         // case 3:{$scope.newfirst();break;}
    //     }
    // }

    $scope.makePay=function(val){
        val = 1;
        console.log("val",val);
        switch(val){
            case 1:{$scope.pay_by_payU();
                break;}
            //
            // case 2:{$scope.priceltoh();break;}
            // case 3:{$scope.newfirst();break;}
        }
    }

    function iabLoadStart(event) {
        console.log("inside load start",event.url);
         // if (event.url.match("https://payu.herokuapp.com/success")) {
         //  iabRef.close();
         // }
        // var url = event.url;
        // if(url.startsWith("https://test.payu.in/cancel")){
        //     console.log("matched");
        // }
    }




    function iabLoadStop(event) {
        $rootScope.$broadcast('loading:show');

        if (event.url.match("https://payu.herokuapp.com/success")) {
            iabRef.executeScript({
                code: "document.body.innerHTML"
            }, function(values) {
                console.log("values",JSON.stringify(values))
                //incase values[0] contains result string
                var a = getValue(values[0], 'mihpayid');
                var b = getValue(values[0], 'status');
                var c = getValue(values[0], 'unmappedstatus');
                if(c=='failed'){
                    console.log("inside fail");
                    // $state.go('app.payment_fail');
                    paymentService.payment_info_send(values).then(function (response) {
                        if(response.status == 200){
                            console.log("inside if")
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.payment_fail',{'t_id':id,'b_id':booking_id});
                            $rootScope.$broadcast('loading:hide');

                        }
                    })
                }
                else if(c == 'userCancelled'){
                    paymentService.payment_info_send(values).then(function (response) {
                        if(response.status == 200){
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.payment_fail',{'t_id':id,'b_id':booking_id});
                            $rootScope.$broadcast('loading:hide');

                        }
                    })
                }
                else if(c == 'captured'){
                    paymentService.payment_info_send(values).then(function (response) {
                        if(response.status == 200){
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.payment_success',{'b_id':booking_id});
                            $rootScope.$broadcast('loading:hide');
                        }
                    })
                }
            });
            iabRef.close();
        }
       else if (event.url.match("https://payu.herokuapp.com/failure")) {
            iabRef.executeScript({
                code: "document.body.innerHTML"
            }, function(values) {
                //incase values[0] contains result string
                var a = getValue(values[0], 'mihpayid');
                var b = getValue(values[0], 'status');
                var c = getValue(values[0], 'unmappedstatus');
                if(c=='failed'){
                    paymentService.payment_info_send(values).then(function (response) {
                        if(response.status == 200){
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.payment_fail',{'t_id':id,'b_id':booking_id});
                            $rootScope.$broadcast('loading:hide');

                        }
                    })
                }
                else if(c == 'userCancelled'){
                    paymentService.payment_info_send(values).then(function (response) {
                        if(response.status == 200){
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.payment_fail',{'t_id':id,'b_id':booking_id});
                            $rootScope.$broadcast('loading:hide');
                        }
                    })
                }
            });
            iabRef.close();
        }
    }

//get values from inner HTML page i.e success page or failure page values
    function getValue(source, key) {
        var pattern = key + '=(\\w+)(&amp;)?';
        var expr = new RegExp(pattern);
        var result = source.match(expr);
        return result[1];
    }


//load error event
    function iabLoadError(event) {
        alert(event.type + ' - ' + event.message);
    }
//close event
    function iabClose(event) {
        iabRef.removeEventListener('loadstart', iabLoadStart);
        iabRef.removeEventListener('loadstop', iabLoadStop);
        iabRef.removeEventListener('loaderror', iabLoadError);
        iabRef.removeEventListener('exit', iabClose);
    }
// device APIs are available
//
    function onDeviceReadyTest() {
        iabRef = window.open('templates/payment/html/payU.html?trans_id='+id+'&invoice_id='+invoice_id+'&sha_value='+shss+'&amount='+orp_data.total_price+'&buyer_name='+orp_data.buyer_name+'&email='+orp_data.buyer_email+'&mobile='+orp_data.buyer_mobile, '_blank', 'location=no');
        iabRef.addEventListener('loadstart', iabLoadStart);
        iabRef.addEventListener('loadstop', iabLoadStop);
        iabRef.addEventListener('loaderror', iabLoadError);
        iabRef.addEventListener('exit', iabClose);
    }

});

