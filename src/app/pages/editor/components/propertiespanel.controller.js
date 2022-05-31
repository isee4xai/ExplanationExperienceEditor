(function() {
    'use strict';

    angular
        .module('app')
        .controller('PropertiespanelController', PropertiespanelController);

    PropertiespanelController.$inject = [
        '$scope',
        '$window',
        'dialogService',
        'notificationService',
        '$http',
        'projectModel'
    ];

    function PropertiespanelController($scope,
        $window,
        dialogService,
        notificationService,
        $http,
        projectModel) {
        var vm = this;
        vm.original = null;
        vm.block = null;
        vm.update = update;
        vm.keydown = keydown;

        vm.UpdateProperties = UpdateProperties;
        vm.renameIntends = renameIntends;

        vm.node = null;
        vm.explanation = null;
        vm.evaluation = null;

        vm.TitleSelect = null;
        vm.TitleName = null;

        _create();
        _activate();

        $scope.$on('$destroy', _destroy);


        function _activate() {
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var s = t.blocks.getSelected();

            if (vm.evaluation == null && vm.explanation == null) {
                _getJsonProperties();
            }

            if (s.length === 1) {
                vm.original = s[0];

                vm.block = {
                    title: vm.original.title,
                    description: vm.original.description,
                    properties: tine.merge({}, vm.original.properties)
                };
                //  check if the property that is selected to define its values ​​in the properties component
                //  is the explain method and the evaluate method or intends
                switch (vm.original.name) {
                    case "Explanation Method":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = vm.explanation;
                        break;
                    case "Evaluation Method":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = vm.evaluation;
                        break;
                    case "Root":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = vm.node;
                        break;
                    default:
                        vm.TitleName = null;
                        vm.TitleSelect = null;
                }
            } else {
                vm.original = false;
                vm.block = false;
            }

        }

        function _getJsonProperties() {
            //Get the properties of the explain method and the evaluate method
            projectModel.getConditionsExplanationMethod()
                .then(function(x) {
                    vm.explanation = x;
                });
            projectModel.getConditionsEvaluationMethod()
                .then(function(x) {
                    vm.evaluation = x;
                });
        }

        function renameIntends(CurrentName) {
            dialogService
                .prompt('Rename Intends', null, 'input', CurrentName)
                .then(function(name) {
                    // If no name provided, abort
                    if (!name) {
                        notificationService.error(
                            'Invalid rename',
                            'You must provide a name for the rename.'
                        );
                    } else {
                        vm.block.title = name;
                        update();
                    }
                });
        }

        function UpdateProperties(option) {
            //update Explanation and Evaluation method properties

            var json = {};
            //we verify if the selected data have properties
            if (!option.hasOwnProperty('properties')) {
                vm.block = {
                    title: option.value,
                    properties: null,
                    description: option.description
                };
            } else {
                update();
                option.properties.forEach(element => {
                    json[element.key] = element.value;
                });
                vm.block = {
                    title: option.value,
                    properties: tine.merge({}, json),
                    description: option.description
                };

                update();
            }

        }

        function _event(e) {
            setTimeout(function() { $scope.$apply(function() { _activate(); }); }, 0);
        }

        function _create() {
            $window.editor.on('blockselected', _event);
            $window.editor.on('blockdeselected', _event);
            $window.editor.on('blockremoved', _event);
            $window.editor.on('treeselected', _event);
            $window.editor.on('nodechanged', _event);
        }

        function _destroy() {
            $window.editor.off('blockselected', _event);
            $window.editor.off('blockdeselected', _event);
            $window.editor.off('blockremoved', _event);
            $window.editor.off('treeselected', _event);
            $window.editor.off('nodechanged', _event);
        }

        function keydown(e) {
            if (e.ctrlKey && e.keyCode == 90) {
                e.preventDefault();
            }

            return false;
        }

        function update() {
            //update Explanation and Evaluation method properties
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            t.blocks.update(vm.original, vm.block);

            // verify that we have data from the Explanation and Evaluation method
            if (vm.TitleSelect == null) {

            } else if (vm.TitleSelect.length != null) {
                for (let index = 0; index < vm.TitleSelect.length; index++) {
                    //verify that the option selected in the properties title is in that data
                    if (vm.TitleSelect[index].value == vm.block.title) {
                        //we verify that the selected data have properties
                        if (vm.TitleSelect[index].properties != null) {
                            var json = {};
                            var ArrayPropertie = [];
                            // extract the properties keys and value in objects
                            var PropertiesValue = Object.values(vm.block.properties);
                            var Propertieskey = Object.keys(vm.block.properties);
                            //loop through all the properties and insert them into an array
                            for (let index = 0; index < PropertiesValue.length; index++) {
                                var JsonPropertie = {
                                    key: Propertieskey[index],
                                    value: PropertiesValue[index],
                                };
                                ArrayPropertie.push(JsonPropertie);
                                json[Propertieskey[index]] = PropertiesValue[index];
                            }
                            //We assign it to the selected property
                            vm.TitleSelect[index].properties = ArrayPropertie;
                        } else {
                            //  vm.block.properties = null;
                            t.blocks.update(vm.original, vm.block);
                        }
                        //we define the description of the property
                        vm.TitleSelect[index].description = vm.block.description;
                    }

                }
            }

        }

    }
})();