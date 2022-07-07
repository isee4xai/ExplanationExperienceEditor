(function() {
    'use strict';

    angular
        .module('app')
        .directive('b3KeyTableExpl', keytableExpl)
        .controller('KeyTableControllerExpl', KeyTableControllerExpl);

    keytableExpl.$inject = ['$parse'];

    function keytableExpl($parse) {
        var directive = {
            require: '^ngModel',
            restrict: 'EA',
            replace: true,
            bindToController: true,
            controller: 'KeyTableControllerExpl',
            controllerAs: 'keytableExpl',
            templateUrl: 'directives/keytableExpl.html',

            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            // get the value of the `ng-model` attribute
            scope.keytableExpl.heading = attrs.heading;
            scope.keytableExpl._onChange = $parse(attrs.ngChange);

            var variable = attrs.ngModel;
            scope.$watch(variable, function(model) {
                scope.keytableExpl.reset(model);
            });
        }
    }

    KeyTableControllerExpl.$inject = ['$scope'];

    function KeyTableControllerExpl($scope) {
        // HEAD //
        var vm = this;
        vm._onChange = null;
        vm.model = $scope.keytable.model || $scope.model || null;
        vm.rows = [];
        vm.add = add;
        vm.remove = remove;
        vm.change = change;
        vm.reset = reset;

        $scope.isArray = angular.isArray;
        _activate();

        // BODY //
        function _activate() {
            if (vm.model) {
                for (var key in vm.model) {
                    add(key, vm.model[key], false);
                }
            } else {
                vm.model = {};
            }
        }

        function reset(model) {
            vm.rows = [];
            vm.model = model;
            _activate();
        }

        function add(key, value, fixed) {
            vm.rows.push({ key: key, value: value, fixed: fixed === true });
        }

        function remove(i) {
            //Delete properties
            var keyDrop = vm.rows[i].key;
            vm.rows.splice(i, 1);

            delete vm.model[keyDrop];
            if (vm._onChange) {
                vm._onChange($scope);
            }
        }

        function change() {
            for (var key in vm.model) {
                if (vm.model.hasOwnProperty(key)) {
                    delete vm.model[key];
                }
            }
            for (var i = 0; i < vm.rows.length; i++) {
                var r = vm.rows[i];
                if (!r.key) continue;

                var value = r.value;
                if (!isNaN(value) && value !== '') {
                    value = parseFloat(value);
                }

                vm.model[r.key] = value;

                if (vm._onChange) {
                    vm._onChange($scope);
                }
            }
        }
    }

})();