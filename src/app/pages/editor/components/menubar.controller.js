(function () {
    'use strict';

    angular
        .module('app')
        .controller('MenubarController', MenubarController);

    MenubarController.$inject = [
        '$scope',
        '$window',
        '$state',
        'dialogService',
        'projectModel',
        'notificationService',
        '$http',
        '$q',
        '$location'
    ];

    function MenubarController($scope,
        $window,
        $state,
        dialogService,
        projectModel,
        notificationService,
        $http,
        $q,
        $location) {
        var vm = this;
        vm.onNewTree = onNewTree;
        vm.onCloseProject = onCloseProject;
        vm.onSaveProject = onSaveProject;
        vm.onExportProjectJson = onExportProjectJson;
        vm.onExportTreeJson = onExportTreeJson;
        vm.onExportNodesJson = onExportNodesJson;
        vm.onImportProjectJson = onImportProjectJson;
        vm.onImportTreeJson = onImportTreeJson;
        vm.onImportNodesJson = onImportNodesJson;
        vm.onUndo = onUndo;
        vm.onRedo = onRedo;
        vm.onCopy = onCopy;
        vm.onCut = onCut;
        vm.onPaste = onPaste;
        vm.onDuplicate = onDuplicate;
        vm.onRemove = onRemove;
        vm.onRemoveAllConns = onRemoveAllConns;
        vm.onRemoveInConns = onRemoveInConns;
        vm.onRemoveOutConns = onRemoveOutConns;
        vm.onAutoOrganize = onAutoOrganize;
        vm.onZoomIn = onZoomIn;
        vm.onZoomOut = onZoomOut;
        vm.onSelectAll = onSelectAll;
        vm.onDeselectAll = onDeselectAll;
        vm.onInvertSelection = onInvertSelection;
        vm.RandomGenerate = RandomGenerate;
        vm.RandomGenerate10 = RandomGenerate10;
        vm.NotificationSuccess = NotificationSuccess;
        vm.addListPara = addListPara;
        vm.redirect = redirect;


        //random
        vm.Quetions = {
            "DEBUGGING": ["Is this the same outcome for similar instances?", "Is this instance a common occurrence?"],
            "TRANSPARENCY": [
                "What is the impact of feature X on the outcome?",
                "How does feature X impact the outcome?",
                "What are the necessary features that guarantee this outcome?",
                "Why does the AI system have given outcome A?",
                "Which feature contributed to the current outcome?",
                "How does the AI system respond to feature X?",
                "What is the goal of the AI system?",
                "What is the scope of the AI system capabilities?",
                "What features does the AI system consider?",
                "What are the important features for the AI system?",
                "What is the impact of feature X on the AI system?",
                "How much evidence has been considered to build the AI system?",
                "How much evidence has been considered in the current outcome?",
                "What are the possible outcomes of the AI system?",
                "What features are used by the AI system?"
            ],
            "PERFORMANCE": [
                "How confident is the AI system with the outcome?",
                "Which instances get a similar outcome?",
                "Which instances get outcome A?",
                "What are the results when others use the AI System?",
                "How accurate is the AI system?",
                "How reliable is the AI system?",
                "In what situations does the AI system make errors?",
                "What are the limitations of the AI system?",
                "In what situations is the AI system likely to be correct?"
            ],
            "COMPLIANCY": ["How well does the AI system capture the real-world?", "Why are instances A and B given different outcomes?"],
            "COMPREHENSIBILITY": [
                "How to improve the AI system performance?",
                "What does term X mean?",
                "What is the overall logic of the AI system?",
                "What kind of algorithm is used in the AI system?"
            ],
            "EFFECTIVENESS": [
                "What would be the outcome if features X is changed to value V?",
                "What other instances would get the same outcome?",
                "How does the AI system react if feature X is changed?",
                "What is the impact of the current outcome?"
            ],
            "ACTIONABILITY": [
                "What are the alternative scenarios available?",
                "What type of instances would get a different outcome?",
                "How can I change feature X to get the same outcome?",
                "How to get a different outcome?",
                "How to change the instance to get a different outcome?",
                "How to change the instance to get outcome {outcome}?",
                "Why does the AI system have given outcome A not B?",
                "Which features need changed to get a different outcome?"
            ]
        }
        vm.usedIndices = [];
        vm.applicability = null;
        vm.randomCategory = null;

        vm.NameNodes = ["Explanation Method", "User Question"];
        vm.NameType = ["/Images","/Tabular"]
        vm.NameCompositites = ["Sequence", "Priority"];
        vm.ArrayComposites = [];
        vm.ArrayCompositesNew = [];
        vm.models = [];
        vm.date = "version 12/03/24";
        vm.showHelp = showHelp;
        vm.showVideo = showVideo;
        vm.TreesExample = TreesExample;

        vm.ListaPara = {};


        vm.explanation = null;
        vm.evaluation = null;
        vm.url = window.location.href;
        vm.isEditor;

        vm.modeloUso="model";

        _create();
        _activate();
        $scope.$on('$destroy', _destroy);


        function _activate() {
            if (vm.models != []) {
                GetModels();
            }

            if (vm.evaluation == null && vm.explanation == null) {
                _getJsonProperties();
            }

            if (vm.url.includes("modelid")) {
                vm.isEditor = "modelid";
            } else if (vm.url.includes("id")) {
                vm.isEditor = "id";
            } else {
                vm.isEditor = "editor";
            }
        }


        function addListPara() {
            if (Object.keys(vm.ListaPara).length == 0) {
                vm.explanation.forEach(element => {
                    try {
                        getParams(element)
                            .then(function (x) {
                                var ArrayParams = [];
                                for (var property in x) {

                                    var jsonParmsDefin = {};
                                    var Type = "";
                                    switch (x[property].type) {

                                        case "float":
                                        case "number":
                                        case "int":
                                            Type = "number"
                                            break;
                                        case "string":
                                            if (x[property].range != null) {
                                                Type = "select"
                                            } else {
                                                Type = "text"
                                            }
                                            break;
                                        case "select":
                                            Type = "select"
                                            break;
                                        case "array":
                                            Type = "text"
                                            if (x[property].default == null) {
                                                x[property].default = "";
                                            }
                                            break;
                                        default:
                                            Type = "text"
                                            break;
                                    }

                                    jsonParmsDefin = {
                                        "key": property,
                                        "value": x[property].value || x[property].default || null,
                                        "default": x[property].default || null,
                                        "range": x[property].range || [null, null],
                                        "required": x[property].required || "false",
                                        "type": Type,
                                        "description": x[property].description || "",
                                        fixed: false
                                    };
                                    ArrayParams.push(jsonParmsDefin);

                                }
                                vm.ListaPara[element] = ArrayParams;
                            });
                    } catch (error) {
                        console.log(error);
                    }
                });
            }

        }

        function _shortcut_projectclose(f) {
            if (!$scope.$$phase) {
                $scope.$apply(function () { onCloseProject(); });
            } else {
                onCloseProject();
            }
            return false;
        }

        function _shortcut_projectsave(f) {
            if (!$scope.$$phase) {
                $scope.$apply(function () { onSaveProject(); });
            } else {
                onSaveProject();
            }
            return false;
        }

        function _create() {
            Mousetrap.bind('ctrl+q', _shortcut_projectclose);
            Mousetrap.bind('ctrl+s', _shortcut_projectsave);
            Mousetrap.bind('ctrl+z', onUndo);
            Mousetrap.bind('ctrl+shift+z', onRedo);
            Mousetrap.bind('ctrl+c', onCopy);
            Mousetrap.bind('ctrl+v', onPaste);
            Mousetrap.bind('ctrl+x', onCut);
            Mousetrap.bind('ctrl+d', onDuplicate);
            Mousetrap.bind('del', onRemove);
            Mousetrap.bind('a', onAutoOrganize);
            Mousetrap.bind('ctrl+a', onSelectAll);
            Mousetrap.bind('ctrl+shift+a', onDeselectAll);
            Mousetrap.bind('ctrl+i', onInvertSelection);
        }

        function _destroy() {
            Mousetrap.unbind('ctrl+q', _shortcut_projectclose);
            Mousetrap.unbind('ctrl+s', _shortcut_projectsave);
            Mousetrap.unbind('ctrl+z', onUndo);
            Mousetrap.unbind('ctrl+shift+z', onRedo);
            Mousetrap.unbind('ctrl+c', onCopy);
            Mousetrap.unbind('ctrl+v', onPaste);
            Mousetrap.unbind('ctrl+x', onCut);
            Mousetrap.unbind('ctrl+d', onDuplicate);
            Mousetrap.unbind('del', onRemove);
            Mousetrap.unbind('a', onAutoOrganize);
            Mousetrap.unbind('ctrl+a', onSelectAll);
            Mousetrap.unbind('ctrl+shift+a', onDeselectAll);
            Mousetrap.unbind('ctrl+i', onInvertSelection);
        }

        function _getProject() {
            return $window.editor.project.get();
        }

        function _getTree() {
            var project = $window.editor.project.get();
            return project.trees.getSelected();
        }

        function onExportProjectJson() {
            var url = $location.url();

            var index = url.indexOf("usecaseId=");
            if (index !== -1) {
                console.log(url.split("usecaseId=")[1]);

            } else {
                console.log("usecaseId no encontrado en la URL.");
            }

            switch (vm.isEditor) {
                case "modelid":
                    $state.go('idModel.export', { type: 'project', format: 'json', usecaseId: url.split("usecaseId=")[1] });
                    break;
                case "id":
                    $state.go('id.export', { type: 'project', format: 'json', usecaseId: url.split("usecaseId=")[1] });
                    break;
                case "editor":
                    $state.go('editor.export', { type: 'project', format: 'json', usecaseId: url.split("usecaseId=")[1] });
                    break;
                default:
                    break;
            }
            return false;
        }

        function onExportTreeJson() {
            switch (vm.isEditor) {
                case "modelid":
                    $state.go('idModel.export', { type: 'tree', format: 'json' });
                    break;
                case "id":
                    $state.go('id.export', { type: 'tree', format: 'json' });
                    break;
                case "editor":
                    $state.go('editor.export', { type: 'tree', format: 'json' });
                    break;
                default:
                    break;
            }
            return false;
        }

        function onExportNodesJson() {
            switch (vm.isEditor) {
                case "modelid":
                    $state.go('idModel.export', { type: 'nodes', format: 'json' });
                    break;
                case "id":
                    $state.go('id.export', { type: 'nodes', format: 'json' });
                    break;
                case "editor":
                    $state.go('editor.export', { type: 'nodes', format: 'json' });
                    break;
                default:
                    break;
            }
            return false;
        }

        function onImportProjectJson() {
            switch (vm.isEditor) {
                case "modelid":
                    $state.go('idModel.import', { type: 'project', format: 'json' });
                    break;
                case "id":
                    $state.go('id.import', { type: 'project', format: 'json' });
                    break;
                case "editor":
                    $state.go('editor.import', { type: 'project', format: 'json' });
                    break;
                default:
                    break;
            }
            return false;

        }

        function onImportTreeJson() {
            switch (vm.isEditor) {
                case "modelid":
                    $state.go('idModel.import', { type: 'tree', format: 'json' });
                    break;
                case "id":
                    $state.go('id.import', { type: 'tree', format: 'json' });
                    break;
                case "editor":
                    $state.go('editor.import', { type: 'tree', format: 'json' });
                    break;
                default:
                    break;
            }
            return false;
        }

        function onImportNodesJson() {
            switch (vm.isEditor) {
                case "modelid":
                    $state.go('idModel.import', { type: 'nodes', format: 'json' });
                    break;
                case "id":
                    $state.go('id.import', { type: 'nodes', format: 'json' });
                    break;
                case "editor":
                    $state.go('editor.import', { type: 'nodes', format: 'json' });
                    break;
                default:
                    break;
            }
            return false;
        }

        function onCloseProject() {
            function doClose() {
                projectModel.closeProject();
                $state.go('dash.projects');
            }

            if ($window.editor.isDirty()) {
                dialogService
                    .confirm(
                        'Leave without saving?',
                        'If you proceed you will lose all unsaved modifications.',
                        null)
                    .then(doClose);
            } else {
                doClose();
            }

            return false;
        }

        function onSaveProject() {
            projectModel
                .saveProject()
                .then(function (x) {
                    if (x != "Error \n Project couldn't be saved") {
                        notificationService.success(
                            x
                        );
                    } else {
                        notificationService.error(
                            x
                        );
                    }
                });
            return false;
        }

        function onNewTree() {
            var project = _getProject();
            project.trees.add();
            return false;
        }

        function onUndo() {
            var project = _getProject();
            project.history.undo();
            return false;
        }

        function onRedo() {
            var project = _getProject();
            project.history.redo();
            return false;
        }

        function onCopy() {
            var tree = _getTree();
            tree.edit.copy();
            return false;
        }

        function onCut() {
            var tree = _getTree();
            tree.edit.cut();
            return false;
        }

        function onPaste() {
            var tree = _getTree();
            tree.edit.paste();
            return false;
        }

        function onDuplicate() {
            var tree = _getTree();
            tree.edit.duplicate();
            return false;
        }

        function onRemove() {
            var tree = _getTree();
            tree.edit.remove();
            return false;
        }

        function onRemoveAllConns() {
            var tree = _getTree();
            tree.edit.removeConnections();
            return false;
        }

        function onRemoveInConns() {
            var tree = _getTree();
            tree.edit.removeInConnections();
            return false;
        }

        function onRemoveOutConns() {
            var tree = _getTree();
            tree.edit.removeOutConnections();
            return false;
        }

        function onAutoOrganize() {
            var tree = _getTree();
            tree.organize.organize();
            return false;
        }

        function onZoomIn() {
            var tree = _getTree();
            tree.view.zoomIn();
            return false;
        }

        function onZoomOut() {
            var tree = _getTree();
            tree.view.zoomOut();
            return false;
        }

        function onSelectAll() {
            var tree = _getTree();
            tree.selection.selectAll();
            return false;
        }

        function onDeselectAll() {
            var tree = _getTree();
            tree.selection.deselectAll();
            return false;
        }

        function onInvertSelection() {
            var tree = _getTree();
            tree.selection.invertSelection();
            return false;
        }

        function GetModels() {
           const IdModel = $location.search().usecaseId;

            if (IdModel) {
            
                projectModel.getModelsRootPrivate(IdModel)
                    .then(function (x) {
                        vm.models = x;
                    });
                projectModel.getApplicability(IdModel)
                    .then(function (x) {
                        vm.applicability = x
                    });
            } else {
                vm.models = {};
                vm.applicability = {};
            }

        }

        function GetIdModels() {
            var RandomNumber = getRndInteger(0, Object.keys(vm.models).length - 1);
            var resultado = Object.keys(vm.models)[RandomNumber];
            return resultado;
        }

        function RandomGenerate(DataInput, IndexSucces) {

            if (vm.modeloUso != DataInput.Model) {
                vm.modeloUso = DataInput.Model; 
                 projectModel.GetApplicabilityExplanation(DataInput.Model)
                .then(function (u) {
                    console.log(u);
                });
            }
                  //  vm.applicability = x;
                    var TypeExpaliner = getRndInteger(0, 1); ;
                
                    vm.usedIndices = [];
                    var categories = Object.keys(vm.Quetions);
                    vm.randomCategory = categories[Math.floor(Math.random() * categories.length)];

                    if (DataInput === undefined) {
                        DataInput = { MinSlibings: 0, MaxSlibings: 0 };
                    }

                    var MinSlibings = DataInput.MinSlibings;
                    var MaxSlibings = DataInput.MaxSlibings;
                    if (vm.Quetions[vm.randomCategory].length < MaxSlibings) {
                        MaxSlibings = vm.Quetions[vm.randomCategory].length;
                    }

                    //   var subtrees = DataInput.subtrees;
                    var depth = DataInput.depth;

                    if (MaxSlibings != "" && MinSlibings != "" && MinSlibings <= MaxSlibings) {
                        //Create a new project
                        var project = $window.editor.project.get();
                        project.trees.add();
                        var tree = project.trees.getSelected();
                        var point = tree.view.getLocalPoint(0, 0);
                        //Select the root and add a newly created composites
                        var blockRoot = tree.blocks.getAll();
                        blockRoot[0].idModel = GetIdModels();

                        var blockComposites = tree.blocks.add("Sequence", point.x, point.y);
                        tree.connections.add(blockRoot[0], blockComposites);
                        //we add in a array the Composites that did not finish their journey
                        vm.ArrayComposites.push(blockComposites);
                        for (var index = 0; index < depth; index++) {
                            //travel all the composites that are unfinished to continue them
                            vm.ArrayComposites.forEach(element => {

                                var NumBol = 0;
                                var NumeroAle = getRndInteger(MinSlibings, MaxSlibings);
                                if (index == 0) {
                                    for (var x = 0; x < NumeroAle; x++) {

                                        var BlockConditions = tree.blocks.add(vm.NameNodes[1], point.x, point.y);
                                        tree.connections.add(element, BlockConditions);

                                        BlockConditions = PropertieSelect(1);

                                        var s = tree.blocks.getSelected();
                                        tree.blocks.update(s[0], BlockConditions);

                                        var NumeroAle1;
                                        if ((depth - index) == 1) {
                                            NumeroAle1 = 0;
                                        } else {
                                            if ((x - NumeroAle) == 1 && NumBol == 0) {
                                                var NumeroAle1 = 1;
                                            } else {
                                                NumeroAle1 = getRndInteger(0, 1);
                                            }
                                        }

                                        if (NumeroAle1 == 1) {
                                            var SubBlockComposites = null;

                                            var y = getRndInteger(0, 1);
                                            SubBlockComposites = tree.blocks.add(vm.NameCompositites[y], point.x, point.y);
                                            tree.connections.add(element, SubBlockComposites);
                                            vm.ArrayCompositesNew.push(SubBlockComposites);

                                            blockComposites = SubBlockComposites;
                                        } else {
                                            var BlockConditions = tree.blocks.add(vm.NameNodes[0], point.x, point.y);
                                            tree.connections.add(element, BlockConditions);

                                            BlockConditions = PropertieSelect(0,TypeExpaliner);

                                            var s = tree.blocks.getSelected();
                                            tree.blocks.update(s[0], BlockConditions);
                                            NumBol++;
                                        }
                                    }
                                } else if (index == 1) {
                                    if (depth == 3) {
                                        var SubBlockComposites = null;

                                        var y = getRndInteger(0, 1);
                                        SubBlockComposites = tree.blocks.add(vm.NameCompositites[y], point.x, point.y);
                                        tree.connections.add(element, SubBlockComposites);
                                        vm.ArrayCompositesNew.push(SubBlockComposites);

                                        blockComposites = SubBlockComposites;
                                    }


                                    var BlockConditions = tree.blocks.add(vm.NameNodes[0], point.x, point.y);
                                    tree.connections.add(element, BlockConditions);

                                    BlockConditions = PropertieSelect(0,TypeExpaliner);

                                    var s = tree.blocks.getSelected();
                                    tree.blocks.update(s[0], BlockConditions);

                                } else {
                                    for (var x = 0; x < 2; x++) {
                                        var BlockConditions = tree.blocks.add(vm.NameNodes[0], point.x, point.y);
                                        tree.connections.add(element, BlockConditions);

                                        BlockConditions = PropertieSelect(0,TypeExpaliner);

                                        var s = tree.blocks.getSelected();
                                        tree.blocks.update(s[0], BlockConditions);
                                    }
                                }
                            });
                            //clean ArrayComposites and add the new composites created
                            vm.ArrayComposites = [];
                            vm.ArrayComposites = vm.ArrayCompositesNew;
                            vm.ArrayCompositesNew = [];
                        }
                        vm.ArrayCompositesNew = [];
                        vm.ArrayComposites = [];
                        onAutoOrganize();
                        NotificationSuccess(IndexSucces, DataInput.TreeNumber);
                        return true;
                    } else {
                        notificationService.error(
                            'Invalid Generate',
                            'Error in the maximum or minimum of slibings'
                        );
                        return false;
                    }
                
        }

        function NotificationSuccess(index, NumTree) {
            switch (index) {
                case 0:
                    notificationService.success(
                        'New ' + NumTree + ' Tree generate',
                        'A new tree was randomly generated in the project'
                    );
                    break;
                case undefined:
                    notificationService.success(
                        'New Tree generate',
                        'A new tree was randomly generated in the project'
                    );
                    break;
                default:

            }
        }

        function PropertieSelect(IndexNameNodeNodes,TypeExpaliner) {
            var BlockCondition;
            switch (vm.NameNodes[IndexNameNodeNodes]) {
                case "Explanation Method":
                    if (vm.explanation != null) {
                        console.log( vm.NameType[TypeExpaliner]);
                       // do {
                            var indexExplanation = getRndInteger(0, Object.keys(vm.explanation).length - 1);
                      /*      console.log(vm.applicability);
                            console.log(vm.explanation);
                            console.log( Object.keys(vm.explanation).length);
                            console.log(indexExplanation);
                            console.log(vm.applicability[vm.explanation[indexExplanation]]);
                        } while (vm.applicability[vm.explanation[indexExplanation]].flag == false);*/

                        do {
                            var indexExplanation = getRndInteger(0, Object.keys(vm.explanation).length - 1);
                        } while (!vm.explanation[indexExplanation].includes(vm.NameType[TypeExpaliner]));
                       
                        BlockCondition = PropertiesCreate(vm.explanation[indexExplanation], "Explanation Method");
                    } else {
                        BlockCondition = PropertiesCreate("Explanation Method", "Explanation Method");
                    }
                    return BlockCondition;
                case "User Question":
                    BlockCondition = PropertiesCreate(vm.NameNodes[IndexNameNodeNodes], "User Question");
                    return BlockCondition;
            }
        }

        function PropertiesCreate(DataJson, NameNode) {
            //define properties a method of evaluation or explanation
            var json = null;

            if (vm.ListaPara[DataJson] != null) {
                json = {};
                vm.ListaPara[DataJson].forEach(element => {
                    json[element.key] = tine.merge({}, element);
                });
            }

            switch (NameNode) {
                case "Explanation Method":
                    var BlockConditions = {
                        title: DataJson.value || DataJson,
                        /*
                        properties: {
                            "Popularity": 1
                            "Applicability": true
                        },*/
                        params: json,
                    };
                    break;
                case "User Question":
                    //Get Quetion intent 
                    var transparencyQuestions = vm.Quetions[vm.randomCategory];
                    //radnom Questions
                    var randomInt = getRandomIndex(transparencyQuestions);

                    var questionInsert = {
                        "Question": {
                            "key": "Question",
                            "value": transparencyQuestions[randomInt],
                        }
                    }

                    var BlockConditions = {
                        title: DataJson.value || DataJson,
                        params: questionInsert,
                    };
                    break;
                default:
                    break;
            }

            return BlockConditions;
        }

        function getRandomIndex(transparencyQuestions) {
            var randomIndex = Math.random() * ((transparencyQuestions.length - 1) - 0) + 0;
            var randomInt = Math.floor(randomIndex);
            // Verificar si el índice ya ha sido utilizado, si es así, intentar de nuevo
            while (vm.usedIndices.includes(randomInt)) {
                randomIndex = Math.random() * ((transparencyQuestions.length - 1) - 0) + 0;
                randomInt = Math.floor(randomIndex);
            }

            // Agregar el índice al array de utilizados
            vm.usedIndices.push(randomInt);

            return randomInt;
        }

        function getParams(Explanation) {

            return $q(function (resolve, reject) {
                try {
                    projectModel.getConditionsEvaluationEXP(Explanation)
                        .then(function (x) {
                            resolve(x.params);
                        });
                } catch (e) {
                    reject(e);
                }
            });
        }



        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        function _getJsonProperties() {
            //Get the properties of the explain method and the evaluate method
            projectModel.getExplainers()
                .then(function (x) {
                    vm.explanation = x;
                });
            projectModel.getConditionsEvaluationMethod()
                .then(function (x) {
                    vm.evaluation = x;
                });
        }

        function RandomGenerate10(Data) {

            var result;
            if (Data === undefined) {
                notificationService.error(
                    'Invalid Generate',
                    'Tree number cannot be empty'
                );
            } else if (Data.TreeNumber <= 1) {
                notificationService.error(
                    'Invalid Generate',
                    'Tree number must be greater than 1'
                );
            } else {
                for (var index = 0; index < Data.TreeNumber; index++) {
                    result = RandomGenerate(Data, index);
                }
                if (result == true) {
                    onSaveProject();
                }
            }
        }


        function showHelp() {
            var modalHelp = document.getElementById("helpModal");
            modalHelp.style.display = "block";
            var spanHelp = document.getElementById("closehelpButton");

            // When the user clicks on <span> (x), close the modal
            spanHelp.onclick = function () {
                modalHelp.style.display = "none";
            };
        }

        function showVideo() {
            var modalVideo = document.getElementById("videoModal");
            modalVideo.style.display = "block";
            var spanVideo = document.getElementById("closeVideoButton");
            var videoTag = document.getElementById("videoTutorial");

            // When the user clicks on <span> (x), close the modal
            spanVideo.onclick = function () {
                modalVideo.style.display = "none";
                videoTag.pause();
            };
        }

        function TreesExample() {
            window.open('http://localhost:8000/#/id/643fc364a3402ba28c44b14a', '_blank');
        }

        function redirect() {
            console.log("655646546546546546");
            var url = $location.url();

            var indexId = url.indexOf("/id/");
            var idParam;
            if (indexId !== -1) {
                idParam = url.substring(indexId + 4);
                var indexNextSlash = idParam.indexOf("/");
                if (indexNextSlash !== -1) {
                    idParam = idParam.substring(0, indexNextSlash);
                }
                $state.go('id.editnode');
            } else {
                $state.go('editor.editnode');
            }

        }
    }
})();