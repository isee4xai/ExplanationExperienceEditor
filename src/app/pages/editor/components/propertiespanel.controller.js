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
        vm.PopUpImg = PopUpImg;
        vm.PopUpImgClose = PopUpImgClose;
        vm.GetInfoParam = GetInfoParam;
        vm.RunBt = RunBt;

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
        vm.IdModel = {};
        vm.jsonData = {};


        vm.datatooltipParam = "";
        vm.Imagen = "";
        vm.Json = {};

        var root;
        var modelid;
        var exp_instance;

        _create();
        _activate();

        $scope.$on('$destroy', _destroy);


        function _activate() {
            vm.TitleSelect = null;
            vm.ArrayParams = [];

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var s = t.blocks.getSelected();

            if (s.length === 1) {
                vm.original = s[0];
                var ModelGet = {};

                if (vm.original.hasOwnProperty("ModelRoot")) {
                    ModelGet = {
                        idModel: vm.original.ModelRoot.idModel,
                        query_id: vm.original.ModelRoot.query_id
                    };

                    if (vm.original.ModelRoot.img != undefined) {
                        ModelGet.img = vm.original.ModelRoot.img;
                    } else {
                        ModelGet.query = vm.original.ModelRoot.query;
                    }
                } else {
                    ModelGet = {
                        idModel: vm.original.idModel,
                        query_id: vm.original.query_id
                    };
                    if (vm.original.img != undefined) {
                        var file = new File([(vm.original.img)], "ImgModel.png", { type: "image/png" });
                        ModelGet.img = file;
                    } else {
                        ModelGet.query = vm.original.query;
                    }
                }


                vm.block = {
                    title: vm.original.title,
                    description: vm.original.description,
                    properties: tine.merge({}, vm.original.properties),
                    propertyExpl: vm.original.propertyExpl,
                    DataType: vm.original.DataType,
                    VariableName: vm.original.VariableName,
                    params: tine.merge({}, vm.original.params),
                    ModelRoot: ModelGet,
                    Image: vm.original.Image,
                    Json: vm.original.Json
                };

                if (vm.evaluation == null) {
                    _getJsonProperties();
                }

                //  check if the property that is selected to define its values ​​in the properties component
                //  is the explain method and the evaluate method or intends
                switch (vm.original.name) {
                    case "Explanation Method":
                        vm.TitleName = vm.original.name;
                        // vm.TitleSelect = vm.explanation;
                        if (vm.original.title != "Explanation Method" && Object.keys(vm.JsonParams).length == 0) {
                            paramsExpValue(vm.original.title);
                        }

                        if (vm.block.params) {
                            for (var property in vm.block.params) {
                                vm.ArrayParams.push({ "key": property, "value": vm.block.params[property], fixed: false });
                            }
                        }
                        if (vm.Explainers == null) {
                            _getArrayExplainers();
                        }

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
                        vm.IdModel = vm.block.ModelRoot;
                        if (vm.original.ModelRoot == undefined) {
                            update();
                        }
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

            var button = document.querySelector("#ButtonRun");
            button.disabled = true;

            var jsonParam = {};
            for (var i = 0; i < vm.ArrayParams.length; i++) {
                if (vm.ArrayParams[i].value != "") {
                    jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;
                }
            }

            var params = JSON.stringify(jsonParam);

            document.getElementById("loader").style.display = "block";

            projectModel.PostExplainerLibraries(vm.IdModel, params, vm.original.title)
                .then(function(x) {
                    document.getElementById("loader").style.display = "none";
                    if (x.hasOwnProperty('plot_png')) {
                        vm.block.Image = x.plot_png;
                        delete vm.block.Json;
                        delete vm.original.Json;
                    } else {
                        vm.block.Json = JSON.stringify(x);
                        delete vm.block.Image;
                        delete vm.original.Image;
                    }
                    notificationService.success(
                        "Run completed"
                    );
                    button.disabled = false;
                    update();
                }, function() {
                    document.getElementById("loader").style.display = "none";
                    notificationService.error(
                        'Run not completed '
                    );
                });

        }

        function _getJsonProperties() {
            //Get the properties of the evaluate method

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
            if (Exist == -1 && vm.hasOwnProperty("TitleSelect") && vm.TitleSelect != undefined) {
                vm.TitleSelect.forEach(element => {
                    var a = new Object({});
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
            var ArrayNameProperties = Object.keys(option);

            for (var index = 0; index < ArrayNameProperties.length; index++) {
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
            if (vm.original.name == "Explanation Method") {
                paramsExp(option);

            }


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
            for (var keyParam in vm.block.params) {
                if (vm.block.params.hasOwnProperty(keyParam)) {
                    delete vm.block.params[keyParam];
                }
            }
            var jsonParam = {};
            for (var i = 0; i < vm.ArrayParams.length; i++) {
                var r = vm.ArrayParams[i];
                if (!r.key) continue;

                var key = r.key;

                jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;

            }
            vm.block.params = jsonParam;
            update();
        }

        function PopUpImg(ImagenSrc) {
            var modal = document.getElementById("myModal");
            var modalImg = document.getElementById("modal-img");

            modal.style.display = "block";
            modalImg.src = ImagenSrc;
        }

        function PopUpImgClose() {
            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            };
        }


        function paramsExp(option) {
            projectModel.getConditionsEvaluationEXP(option)
                .then(function(x) {
                    vm.JsonParams = {};
                    vm.ArrayParams = [];
                    vm.JsonParams = x.params;
                    for (var property in x.params) {
                        vm.ArrayParams.push({ "key": property, "value": "", fixed: false });
                    }
                    change();
                });
        }

        function paramsExpValue(option) {
            vm.JsonParams = {};
            projectModel.getConditionsEvaluationEXP(option)
                .then(function(x) {
                    vm.JsonParams = x.params;
                });
        }


        function GetInfoParam(Param) {
            vm.datatooltipParam = vm.JsonParams[Param];
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
            }
        }

        function RunBt() {
            vm.jsonData = projectModel.runBT();
            root = vm.jsonData.root;
            modelid = vm.jsonData.idModel;
            exp_instance = vm.jsonData.query;

            runNode(root);
        }

        async function runNode(id) {

            switch (vm.jsonData.nodes[id].Concept) {
                case "Sequence":
                    return await sequence(vm.jsonData.nodes[id]);
                case "Priority":
                    return await priority(vm.jsonData.nodes[id]);
                case "Failer":
                    return await failer(vm.jsonData.nodes[id]);
                case "Succeeder":
                    return await succeeder(vm.jsonData.nodes[id]);
                case "Explanation Method":
                    return await explanationMethod(vm.jsonData.nodes[id]);
                case "Evaluation Method":
                    return await evaluationMethod(vm.jsonData.nodes[id]);
                case "Repeater":
                    return await repeater(vm.jsonData.nodes[id]);
                case "RepeatUntilFailure":
                    return await repeatUntilFailure(vm.jsonData.nodes[id]);
                case "RepeatUntilSuccess":
                    return await repeatUntilSuccess(vm.jsonData.nodes[id]);
                case "Inverter":
                    return await inverter(vm.jsonData.nodes[id]);
                default:
                    break;
            }
        }

        async function sequence(node) {
            let child = node.firstChild;
            do {
                if (!(await runNode(child.Id))) {
                    return false;
                }
                child = child.Next;
            } while (child != null);
            return true;
        }

        async function priority(node) {
            let child = node.firstChild;
            do {
                if (await runNode(child.Id)) {
                    return true;
                }
                child = child.Next;
            } while (child != null);
            return false;
        }

        async function failer(node) {
            return false;
        }

        async function succeeder(node) {
            return true;
        }

        async function explanationMethod(node) {
            // await post_request(node);
            var Model = {
                idModel: modelid,
                query: exp_instance
            }

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var ExpBlock = t.blocks.get(node.id);


            return projectModel.PostExplainerLibraries(Model, JSON.stringify(node.params), node.Instance)
                .then(function(response) {

                    var ExpBlockEdit = {
                        Json: JSON.stringify(response)
                    };
                    t.blocks.update(ExpBlock, ExpBlockEdit);
                    return true;
                })
                .catch(function(error) {
                    return false;
                });
        }

        async function evaluationMethod(node) {
            //Lanzar ventada de desea continuar o no, si dice que no devuelve False, en caso contrario true
            //The return value should depend on the return value of the evaluation method
            return dialogService
                .continueBt('Continue execution of the editor?', null)
                .then(function(name) {
                    if (name !== false) {
                        return true;
                    } else {
                        return false;
                    }
                });
        }

        async function repeater(node) {
            for (var i = 0; i < node.properties.maxLoop; i++) {
                if (!(await runNode(node.firstChild.Id))) {
                    return false;
                }
            }
            return true;
        }

        async function repeatUntilFailure(node) {
            while (await runNode(node.firstChild.Id));
            return true;
        }

        async function repeatUntilSuccess(node) {
            while (!(await runNode(node.firstChild.Id)));
            return true;
        }

        async function inverter(node) {
            return !(await runNode(node.firstChild.Id));
        }

    }
})();