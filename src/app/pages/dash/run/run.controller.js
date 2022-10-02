(function() {
    'use strict';

    angular
        .module('app')
        .controller('RunController', RunController);

    RunController.$inject = [
        '$state',
        '$stateParams',
        '$scope'
    ];

    function RunController($state,
        $stateParams,
        $scope) {

        var vm = this;
        vm.ExecutionsRunEditor = null;
        vm.aaa = "Sadas"

        _activate();

        function _activate() {
            $scope.params = $stateParams.data;
            vm.ExecutionsRunEditor = JSON.parse($scope.params);
        }

    }
})();