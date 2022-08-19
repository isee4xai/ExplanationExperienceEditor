(function() {
    'use strict';

    angular
        .module('app')
        .directive('b3KeyTable', keytable)
        .controller('KeyTableController', KeyTableController);

    keytable.$inject = ['$parse'];

    function keytable($parse) {
        var directive = {
            require: '^ngModel',
            restrict: 'EA',
            replace: true,
            bindToController: true,
            controller: 'KeyTableController',
            controllerAs: 'keytable',
            templateUrl: 'directives/keytable.html',
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            // get the value of the `ng-model` attribute
            scope.keytable.heading = attrs.heading;
            scope.keytable._onChange = $parse(attrs.ngChange);

            var variable = attrs.ngModel;
            scope.$watch(variable, function(model) {
                scope.keytable.reset(model);
            });
        }
    }

    KeyTableController.$inject = ['$scope'];

    function KeyTableController($scope) {
        // HEAD //
        var vm = this;
        vm._onChange = null;
        vm.model = $scope.keytable.model || $scope.model || null;
        vm.rows = [];
        vm.add = add;
        vm.ConditionProperties = ["equals", "not-equals", "less", "greater"];
        vm.Condition = false;
        vm.cond = "Ss";
        vm.remove = remove;
        vm.change = change;
        vm.reset = reset;
        vm.changeCondition = changeCondition;

        _activate();

        // BODY //
        function _activate() {
            vm.Condition = false;
            if (vm.model) {
                for (var key in vm.model.properties) {
                    add(key, vm.model.properties[key], false);
                }

                if (vm.model.DataType == "Datatype" || vm.model.DataType == "Integer" || vm.model.DataType == "Boolean") {
                    vm.Condition = true;

                    if (!vm.model.properties.hasOwnProperty(key)) {
                        vm.model.properties[""] = "";
                        add(" ", " ", false);
                    }
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

            delete vm.model.properties[keyDrop];
            if (vm._onChange) {
                vm._onChange($scope);
            }
        }

        function change() {
            for (var key in vm.model.properties) {
                if (vm.model.properties.hasOwnProperty(key)) {
                    delete vm.model.properties[key];
                }
            }
            for (var i = 0; i < vm.rows.length; i++) {
                var r = vm.rows[i];
                if (!r.key) continue;

                var value = r.value;
                if (!isNaN(value) && value !== '') {
                    value = parseFloat(value);
                }
                vm.model.properties[r.key] = value;


                if (vm._onChange) {
                    vm._onChange($scope);
                }
            }
        }

        function changeCondition(keyCond, actualkey) {
            vm.rows[0]["key"] = keyCond;
            delete vm.model.properties[actualkey];

            vm.model.properties[keyCond] = vm.rows[0]["value"];

            if (vm._onChange) {
                vm._onChange($scope);
            }
        }
    }

})();