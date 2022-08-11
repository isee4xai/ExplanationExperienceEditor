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
        'projectModel'
    ];

    function PropertiespanelController($scope,
        $window,
        dialogService,
        notificationService,
        projectModel) {
        var vm = this;
        vm.original = null;
        vm.block = null;
        vm.update = update;
        vm.keydown = keydown;

        vm.UpdateProperties = UpdateProperties;
        vm.renameIntends = renameIntends;
        vm.change = change;
        vm.Run = Run;

        vm.node = null;
        vm.explanation = null;
        vm.evaluation = null;
        vm.Explainers = null;

        vm.TitleSelect = null;
        vm.TitleName = null;

        vm.AllProperties = [];

        vm.TypeOfData = ["Integer", "Boolean"];
        vm.DataType = "Datatype";
        vm.AllCondition = [];
        vm.SelectTypeOfData = SelectTypeOfData;

        vm.ArrayParams = [];
        vm.JsonParams = {};
        vm.TypeDataExp = "";
        vm.IdModel = {
            query_id: "",
            id: ""
        }

        _create();
        _activate();

        $scope.$on('$destroy', _destroy);


        function _activate() {
            vm.TitleSelect = null;

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var s = t.blocks.getSelected();

            if (s.length === 1) {
                vm.original = s[0];
                vm.block = {
                    title: vm.original.title,
                    description: vm.original.description,
                    properties: tine.merge({}, vm.original.properties),
                    propertyExpl: vm.original.propertyExpl,
                    DataType: vm.original.DataType,
                    VariableName: vm.original.VariableName,
                };

                if (vm.evaluation == null && vm.explanation == null) {
                    _getJsonProperties();
                }

                //  check if the property that is selected to define its values ​​in the properties component
                //  is the explain method and the evaluate method or intends
                switch (vm.original.name) {
                    case "Explanation Method":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = vm.explanation;
                        _getArrayExplainers();
                        AddListAllProperties();
                        break;
                    case "Evaluation Method":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = vm.evaluation;
                        AddListAllProperties();
                        break;
                    case "Condition":
                        vm.TitleName = null;
                        vm.TitleSelect = null;
                        if (vm.block.DataType == undefined) {
                            vm.block.DataType = vm.DataType;
                        }
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

        function _getArrayExplainers() {
            //Get name Explainers
            projectModel.getExplainers()
                .then(function(x) {
                    vm.Explainers = x;
                });

        }

        function Run() {
            console.log(vm.IdModel);

            var jsonParam = {};
            for (var i = 0; i < vm.ArrayParams.length; i++) {
                if (vm.ArrayParams[i].value != "") {
                    jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;
                }
            }

            var params = JSON.stringify(jsonParam);
            console.log(params);

            projectModel.PostExplainerLibraries(vm.IdModel, params, vm.original.title)
                .then(function(x) {
                    console.log(x);
                });

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

        function AddListAllProperties() {
            //we buy if there is id and title
            var Exist = vm.AllProperties.findIndex(element => element.id == vm.original.id &&
                (vm.original.title == element.value ||
                    vm.original.title == "Evaluation Method" ||
                    vm.original.title == "Explanation Method"));

            //If it is not in AllPropertis we add it
            if (Exist == -1) {
                vm.TitleSelect.forEach(element => {
                    var a = new Object();
                    var propertiesExplanation = PropertiesExplanation(element);
                    //we check if the property we are adding already exists in the editor
                    if (vm.original.title == element.value) {
                        //we define the properties with the values of the properties of editor
                        a.value = vm.original.title;
                        a.properties = vm.original.properties;
                        a.description = vm.original.description;
                        a.propertyExpl = propertiesExplanation;
                    } else {

                        //we define the properties with the values of the properties of ServerJson
                        var json = {};
                        element.properties.forEach(element => {
                            json[element.key] = element.value;
                        });
                        a.value = element.value;
                        a.properties = tine.merge({}, json);
                        a.description = element.description;
                        a.propertyExpl = propertiesExplanation;
                    }
                    a.id = vm.original.id;
                    vm.AllProperties.push(a);
                });
            }
        }

        function PropertiesExplanation(option) {
            var propertiesExpl = {};
            let ArrayNameProperties = Object.keys(option);

            for (let index = 0; index < ArrayNameProperties.length; index++) {
                switch (ArrayNameProperties[index]) {
                    case "value":
                        break;
                    case "properties":
                        break;
                    case "description":
                        break;
                    case "id":
                        break;
                    case "$$hashKey":
                        break;
                    default:
                        if (Array.isArray(option[ArrayNameProperties[index]])) {
                            //   option[claves[index]]
                            propertiesExpl[ArrayNameProperties[index]] = option[ArrayNameProperties[index]];
                        } else {
                            propertiesExpl[ArrayNameProperties[index]] = option[ArrayNameProperties[index]];
                        }

                        break;
                }
            }

            return propertiesExpl;
        }

        function UpdateProperties(option) {

            // quitar 
            var a = option.substring(1);
            const myArray = a.split("/");
            vm.TypeDataExp = myArray[0];
            vm.ArrayParams = [];
            vm.ArrayParams = paramsExp(option);

            // vm.JsonParams = paramsExp(option);



            //we check if any selected "Evaluation" or "Explanation" method is in AllPropertis
            var selecionado = vm.AllProperties.find(element => element.value === option.value && element.id == vm.original.id);
            //define the properties

            if (selecionado != undefined) {
                vm.block = {
                    title: selecionado.value,
                    properties: tine.merge({}, selecionado.properties),
                    description: selecionado.description,
                    propertyExpl: selecionado.propertyExpl
                };
            } else {
                vm.block = {
                    title: option,
                    properties: tine.merge({}, vm.original.properties),
                    description: vm.original.description
                };
            }

            update();
        }


        function change() {
            console.log(vm.ArrayParams);
            /*
            for (var i = 0; i < vm.ArrayParams.length; i++) {
                var r = vm.ArrayParams[i];
                console.log(r);
            }*/
        }


        function paramsExp(option) {
            var JsonParams = {}
            var ArrayParamsGet = [];
            projectModel.getConditionsEvaluationEXP(option)
                .then(function(x) {
                    for (const property in x) {
                        // ArrayParamsGet.push(property);

                        ArrayParamsGet.push({ "key": property, "value": "" });
                        //console.log(`${property}: ${x[property]}`);
                        // JsonParams[property] = "";
                    }
                });
            return ArrayParamsGet;

        }


        function SelectTypeOfData(TypeData) {
            vm.block = {
                title: vm.original.title,
                properties: tine.merge({}, vm.original.properties),
                DataType: TypeData,
                VariableName: vm.original.VariableName,
            };
            update();
        }


        function update() {
            //update Explanation and Evaluation method properties
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            t.blocks.update(vm.original, vm.block);

            //we check if any selected "Evaluation" or "Explanation" method is in AllPropertis
            //returns the position in the AllPropertis
            var estaEnLaLista = vm.AllProperties.findIndex(element => element.id == vm.original.id && vm.original.title == element.value);

            if (estaEnLaLista != -1) {
                vm.AllProperties[estaEnLaLista].description = vm.block.description;
                vm.AllProperties[estaEnLaLista].properties = vm.original.properties;
            };
        }

    }
})();