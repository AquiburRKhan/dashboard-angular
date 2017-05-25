(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.withdrawals')
        .controller('WithdrawalsCtrl', WithdrawalsCtrl);

    /** @ngInject */
    function WithdrawalsCtrl($rootScope,$scope,$http,API,cookieManagement,toastr,errorToasts,errorHandler,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.withdrawalData = {
            user: null,
            amount: null,
            reference: "",
            confirm_on_create: true,
            metadata: "",
            currency: null
        };
        $scope.onGoingTransaction = false;
        $scope.showAdvancedOption = false;
        $scope.showView = 'createWithdrawal';

        if($state.params.email){
          $scope.withdrawalData.user = $state.params.email;
        }

        $rootScope.$watch('selectedCurrency',function(){
            if($rootScope.selectedCurrency && $rootScope.selectedCurrency.code) {
                $scope.withdrawalData.currency = $rootScope.selectedCurrency.code;
            }
        });

        $scope.goToView = function(view){
          $scope.showView = view;
        };

        $scope.displayAdvancedOption = function () {
            $scope.showAdvancedOption = true;
        };

        $scope.toggleWithdrawalView = function(view) {
            $scope.showAdvancedOption = false;
            $scope.withdrawalData = {
                user: null,
                amount: null,
                reference: "",
                confirm_on_create: true,
                metadata: "",
                currency: $rootScope.selectedCurrency.code
            };

            if(view == 'withdrawal'){
                $scope.goToView('createWithdrawal');
            } else{
                $scope.goToView('pendingWithdrawal');
            }
        };

        $scope.createWithdrawal = function () {
            $scope.onGoingTransaction = true;
            $http.post(API + '/admin/transactions/withdraw/',$scope.withdrawalData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.onGoingTransaction = false;
                if (res.status === 201) {
                    toastr.success('You have successfully withdrawn the money!');
                    $scope.goToView('completeWithdrawal');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                if(error.status == 403){
                    errorHandler.handle403();
                    return
                }
                errorToasts.evaluateErrors(error.data);
            });
        }

    }
})();
