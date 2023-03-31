(function () {
    'use strict';

    angular
        .module('app')
        .controller('PropertiespanelController', PropertiespanelController);

    PropertiespanelController.$inject = [
        '$scope',
        '$window',
        'dialogService',
        'notificationService',
        'projectModel',
        'ProperParams',
        '$state'
    ];

    function PropertiespanelController($scope,
        $window,
        dialogService,
        notificationService,
        projectModel,
        ProperParams,
        $state) {
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
        vm.PopUpHtml = PopUpHtml;
        vm.PopUpImgClose = PopUpImgClose;
        vm.GetInfoParam = GetInfoParam;
        vm.RunBt = RunBt;
        vm.LoadImagen = LoadImagen;
        vm.LoadHtmlCode = LoadHtmlCode;
        vm.loadModel = loadModel;
        //vm.helpClose = helpClose;
        //call Json
        vm.RunNew = RunNew;
        vm.isBase64Image = isBase64Image;
        vm.esJSONValido = esJSONValido;

        vm.node = null;
        vm.explanation = null;
        vm.evaluation = null;
        vm.Explainers = null;
        vm.ExplainersSubstituteAll = null;
        vm.ExplainersSubstitute = [];

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
        vm.Json = {};

        vm.lastItem = 0;
        vm.Primero;
        vm.RunBtString = [];

        vm.SelectModel = SelectModel;
        vm.GetModels = GetModels;
        vm.models = [];
        vm.keyModel = "";
        vm.IdQuery = "";


        if (vm.models.length === 0) {
            GetModels();
            vm.modelsSelect = "Model";
            _create();
            _activate();

        } else {
            _create();
            _activate();
        }

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
                        idModel: vm.original.ModelRoot.idModel
                    };
                    if (vm.original.ModelRoot.img != undefined) {
                        ModelGet.img = vm.original.ModelRoot.img;
                    } else {
                        ModelGet.query = vm.original.ModelRoot.query;
                    }
                } else {
                    ModelGet = {
                        idModel: vm.original.idModel
                    };
                    if (vm.original.img != undefined) {
                        /* var file = new File([(vm.original.img)], "ImgModel.png", { type: "image/png" });
                         ModelGet.img = file;*/
                        ModelGet.img = vm.original.img;
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

                //  check if the property that is selected to define its values ​​in the properties component
                //  is the explain method and the evaluate method or intends
                switch (vm.original.name) {
                    case "Explanation Method":
                        vm.TitleName = vm.original.name;
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
                            _getArrayExplainersSubstitute();
                        }

                        _SearchSubstituteExplainers();
                        
                        if (vm.original.Json != undefined) {
                            const miDiv = document.getElementById('mi-div');
                            if (miDiv !== null) {
                                miDiv.innerHTML = vm.original.Json;
                            }
                        } else if (vm.original.Image != undefined) {
                            if (document.getElementById("ImgExpl") !== null) {
                                document.getElementById("ImgExpl").src = vm.original.Image;
                                const miDiv = document.getElementById('mi-div');
                                miDiv.innerHTML = null;
                            }

                        } else {
                            const miDiv = document.getElementById('mi-div');
                            if (miDiv !== null) {
                                miDiv.innerHTML = '';
                            }
                        }

                        t.blocks.update(vm.original, vm.block);

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
                        break;
                    case "User Question":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = null;

                        if (!vm.block.params.hasOwnProperty("Question")) {
                            vm.ArrayParams.push({ "key": "Question", "value": "", fixed: false });
                        } else {
                            for (var property in vm.block.params) {
                                vm.ArrayParams.push({ "key": property, "value": vm.block.params[property], fixed: false });
                            }
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

        function loadModel() {
            setTimeout(() => {
                if (vm.original.ModelRoot == undefined) {
                    vm.modelsSelect = vm.models[vm.original.idModel];

                } else {
                    vm.modelsSelect = vm.models[vm.original.ModelRoot.idModel];
                }
                if (vm.modelsSelect == undefined) {
                    vm.modelsSelect = "Model";
                }
            }, 500);


        }

        function LoadImagen() {
            if (vm.original.Image != undefined) {
                document.getElementById("ImgExpl").src = vm.original.Image;
            }
        }

        function LoadHtmlCode() {
            if (vm.original.Json != undefined) {

                const miDiv = document.getElementById('mi-div');
                miDiv.innerHTML = vm.original.Json;
            }
        }

        function GetModels() {
            projectModel.getModelsRoot()
                .then(function (x) {
                    if (vm.models.length == 0) {
                        vm.models = x;
                        var deleteModels = Object.keys(x).filter(key => x[key].includes('63'));
                        for (let index = 0; index < deleteModels.length; index++) {
                            delete vm.models[deleteModels[index]];
                        }
                    }
                });
        }

        function _getArrayExplainers() {
            //Get name Explainers
            projectModel.getExplainers()
                .then(function (x) {
                    vm.Explainers = x;
                });
        }

        function _getArrayExplainersSubstitute() {
            //Get Explainers Substitute
            projectModel.getExplainersSubstitute()
                .then(function (x) {
                    vm.ExplainersSubstituteAll = x;
                });
        }

        function _SearchSubstituteExplainers() {
            var filtered = [];
            vm.ExplainersSubstitute = [];
            if (vm.ExplainersSubstituteAll && vm.block.title != "Explanation Method") {
                vm.ExplainersSubstitute = Object.values(vm.ExplainersSubstituteAll)
                    .filter(obj => obj.explainer === vm.block.title)
                    .map(({ explainer, ...rest }) => rest)
                    .map(obj => Object.fromEntries(
                        Object.entries(obj)
                            .filter(([_, value]) => value !== "0.0" && value !== "1.0")
                            .sort((a, b) => b[1] - a[1])
                    ))[0];
            }
            console.log("aaa");
        }

        function SelectModel(data) {
            vm.modelsSelect = data;
            vm.block.ModelRoot.idModel = Object.keys(vm.models).find(key => vm.models[key] === data);
            update();
        }


        function RunNew() {
            var jsonParam = {};
            for (var i = 0; i < vm.ArrayParams.length; i++) {
                if (vm.ArrayParams[i].value != "") {
                    jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;
                }
            }

            var jsonObjectInstance = {
                id: vm.IdModel.idModel,
                params: jsonParam
            };

            if (isBase64Image(vm.IdModel.query)) {
                jsonObjectInstance.instance = vm.IdModel.query;
                jsonObjectInstance.type = "image"
            } else {
                if (esJSONValido(vm.IdModel.query)) {
                    jsonObjectInstance.instance = JSON.parse(vm.IdModel.query);
                } else {
                    jsonObjectInstance.instance = vm.IdModel.query;
                }
                jsonObjectInstance.type = "dict"
            }

            projectModel.RunNew(jsonObjectInstance, vm.original.title)
                .then(function (x) {
                    console.log(x);
                    if (x.type == "image") {
                        var img = new Image();
                        var base64 = x.explanation;
                        vm.block.Image = "data:image/png;base64," + base64;
                        delete vm.block.Json;
                    } else if (x.type == "html") {
                        const miDiv = document.getElementById('mi-div');
                        miDiv.innerHTML = x.explanation;
                        vm.block.Json = x.explanation;
                        delete vm.block.Image;
                        LoadHtmlCode();
                    }
                    update();
                });


        }

        function isBase64Image(str) {
            if (str === '' || str.trim() === '') {
                return false;
            }
            try {
                return btoa(atob(str)) == str;
            } catch (err) {
                return false;
            }
        }

        function esJSONValido(cadena) {
            try {
                JSON.parse(cadena);
                return true;
            } catch (error) {
                return false;
            }
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
                .then(function (x) {
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
                }, function () {
                    document.getElementById("loader").style.display = "none";
                    notificationService.error(
                        'Run not completed '
                    );
                });

        }

        function _getJsonProperties() {
            //Get the properties of the evaluate method

            projectModel.getConditionsEvaluationMethod()
                .then(function (x) {
                    vm.evaluation = x;
                });
        }

        function renameIntends(CurrentName) {
            dialogService
                .prompt('Rename Intents', null, 'input', CurrentName)
                .then(function (name) {
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
            setTimeout(function () { $scope.$apply(function () { _activate(); }); }, 0);
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

            if (vm.original.Json != undefined) {
                vm.original.Json = undefined;
                const miDiv = document.getElementById('mi-div');
                if (miDiv !== null) {
                    miDiv.innerHTML = "";
                }
            } else if (vm.original.Image != undefined) {
                vm.original.Image = undefined;
                if (document.getElementById("ImgExpl") !== null) {
                    document.getElementById("ImgExpl").src = "";
                }
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
            
            _SearchSubstituteExplainers();

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

        function PopUpHtml(HtmlCode) {
            /*
            // Seleccionar el elemento padre
            var padre = document.querySelector('.editor-page');

            // Crear un nuevo elemento div
            var nuevoDiv = document.createElement('div');

            // Agregar contenido al nuevo elemento div
            nuevoDiv.innerHTML = 'Este es un nuevo div';

            // Añadir el nuevo elemento al DOM
            padre.appendChild(nuevoDiv);
            */


        }

        function PopUpImgClose() {
            var modal = document.getElementById("myModal");
            var modal1 = document.getElementById("myModal1");
            var span = document.getElementsByClassName("close")[0];
            var span1 = document.getElementsByClassName("close")[1];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            };
            span1.onclick = function () {
                modal1.style.display = "none";
            };
        }


        function paramsExp(option) {
            projectModel.getConditionsEvaluationEXP(option)
                .then(function (x) {
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
                .then(function (x) {
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

            for (const identificador in vm.jsonData.nodes) {
                console.log();
                runNode(vm.jsonData.nodes[identificador].id);
            }
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
                case "Repeater":
                    return await repeater(vm.jsonData.nodes[id]);
                case "RepeatUntilFailure":
                    return await repeatUntilFailure(vm.jsonData.nodes[id]);
                case "RepeatUntilSuccess":
                    return await repeatUntilSuccess(vm.jsonData.nodes[id]);
                case "Inverter":
                    return await inverter(vm.jsonData.nodes[id]);
                case "Condition":
                    return await Condition(vm.jsonData.nodes[id]);
                default:
                    break;
            }
        }

        async function sequence(node) {
            vm.RunBtString.push("Running sequence node = Id : " + node.id + " Name : " + node.Instance);
            vm.lastItem++;

            if (vm.lastItem == 1) {
                vm.Primero = node.id;
            }

            let child = node.firstChild;
            do {
                if (!(await runNode(child.Id))) {
                    return false;
                }
                vm.RunBtString.push("End execution node = Id : " + vm.jsonData.nodes[child.Id].id + " Name : " + vm.jsonData.nodes[child.Id].Concept);
                child = child.Next;

            } while (child != null);
            if (vm.Primero == node.id) {
                vm.RunBtString.push("End execution node = Id : " + node.id + " Name : " + node.Concept);
                vm.RunBtString.push("End of editor execution");
                var myJsonString = JSON.stringify(vm.RunBtString);
                var url = $state.href('dash.run', { data: myJsonString });

                vm.RunBtString = [];
                $window.open(url, '_blank');
            }
            return true;
        }

        async function priority(node) {
            vm.RunBtString.push("Running priority node = Id : " + node.id + " Name : " + node.Instance);

            let child = node.firstChild;
            vm.lastItem++;

            if (vm.lastItem == 1) {
                vm.Primero = node.id;
            }

            do {
                if (await runNode(child.Id)) {
                    vm.RunBtString.push("End execution node = Id : " + vm.jsonData.nodes[child.Id].id + " Name : " + vm.jsonData.nodes[child.Id].Concept);
                    return true;
                }
                child = child.Next;
            } while (child != null);
            vm.RunBtString.push("End execution node = Id : " + node.id + " Name : " + node.Concept);
            if (vm.Primero == node.id) {
                vm.RunBtString.push("End of editor execution");
                var myJsonString = JSON.stringify(vm.RunBtString);
                var url = $state.href('dash.run', { data: myJsonString });

                $window.open(url, '_blank');
            }
            return false;
        }

        async function Condition(node) {
            vm.RunBtString.push("Running Condition node || Id : " + node.id + " Name : " + node.Instance);
            return false;
        }

        async function failer(node) {
            vm.RunBtString.push("Running Failer node || Id : " + node.id + " Name : " + node.Instance);
            return false;
        }

        async function succeeder(node) {
            vm.RunBtString.push("Running Succeeder node || Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function explanationMethod(node) {
            vm.RunBtString.push("Running Explanation Method || Id : " + node.id + " Name : " + node.Instance);

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var ExpBlock = t.blocks.get(node.id);

            var jsonParam = {};
            for (var i = 0; i < vm.ArrayParams.length; i++) {
                if (vm.ArrayParams[i].value != "") {
                    jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;
                }
            }


            var jsonObjectInstance = {
                id: vm.IdModel.idModel,
                params: jsonParam
            };

            if (isBase64Image(vm.IdModel.query)) {
                jsonObjectInstance.instance = vm.IdModel.query;
                jsonObjectInstance.type = "image"
            } else {
                if (esJSONValido(vm.IdModel.query)) {
                    jsonObjectInstance.instance = JSON.parse(vm.IdModel.query);
                } else {
                    jsonObjectInstance.instance = vm.IdModel.query;
                }
                jsonObjectInstance.type = "dict"
            }

            var ExpBlockEdit = [];

            projectModel.RunNew(jsonObjectInstance, node.Instance)
                .then(function (x) {
                    if (x.type == "image") {
                        var img = new Image();
                        var base64 = x.explanation;

                        ExpBlockEdit = {
                            Image: "data:image/png;base64," + base64
                        };

                        delete ExpBlock.Json;
                        delete ExpBlockEdit.Json;

                    } else if (x.type == "html") {

                        ExpBlockEdit = {
                            Json: x.explanation
                        };
                        delete ExpBlock.Image;
                        delete ExpBlockEdit.Image;
                    }
                    t.blocks.update(ExpBlock, ExpBlockEdit);
                    //update();
                    return true;
                }).catch(function (error) {
                    return false;
                });
            return false;
        }

        async function repeater(node) {
            vm.RunBtString.push("Running Repeater || Id : " + node.id + " Name : " + node.Instance);
            for (var i = 0; i < node.properties.maxLoop; i++) {
                if (!(await runNode(node.firstChild.Id))) {
                    return false;
                }
            }
            return true;
        }

        async function repeatUntilFailure(node) {
            vm.RunBtString.push("Running Repeat Until Failure || Id : " + node.id + " Name : " + node.Instance);
            while (await runNode(node.firstChild.Id));
            return true;
        }

        async function repeatUntilSuccess(node) {
            vm.RunBtString.push("Running Repeat Until Success || Id : " + node.id + " Name : " + node.Instance);
            while (!(await runNode(node.firstChild.Id)));
            return true;
        }

        async function inverter(node) {
            vm.RunBtString.push("Running Inverter || Id : " + node.id + " Name : " + node.Instance);
            return !(await runNode(node.firstChild.Id));
        }

        //function helpClose() {
        //var modal = document.getElementById("helpModal");
        //var span = document.getElementById("closehelpButton");

        // When the user clicks on <span> (x), close the modal
        //span.onclick = function() {
        //    modal.style.display = "none";
        //};
        //}

    }
})();



