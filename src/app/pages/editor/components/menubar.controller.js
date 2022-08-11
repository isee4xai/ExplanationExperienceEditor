(function() {
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
        '$http'
    ];

    function MenubarController($scope,
        $window,
        $state,
        dialogService,
        projectModel,
        notificationService,
        $http) {
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
        vm.NameNodes = ["Explanation Method", "Evaluation Method"];
        vm.NameCompositites = ["Sequence", "Priority"];
        vm.ArrayComposites = [];
        vm.ArrayCompositesNew = [];
        vm.date = "version 08/11/22";


        vm.explanation = null;
        vm.evaluation = null;

        _create();
        _activate();
        $scope.$on('$destroy', _destroy);

        function _activate() {
            if (vm.evaluation == null && vm.explanation == null) {
                _getJsonProperties();
            }
        }

        function _shortcut_projectclose(f) {
            if (!$scope.$$phase) {
                $scope.$apply(function() { onCloseProject(); });
            } else {
                onCloseProject();
            }
            return false;
        }

        function _shortcut_projectsave(f) {
            if (!$scope.$$phase) {
                $scope.$apply(function() { onSaveProject(); });
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
            $state.go('editor.export', { type: 'project', format: 'json' });
            return false;
        }

        function onExportTreeJson() {
            $state.go('editor.export', { type: 'tree', format: 'json' });
            return false;
        }

        function onExportNodesJson() {
            $state.go('editor.export', { type: 'nodes', format: 'json' });
            return false;
        }

        function onImportProjectJson() {
            $state.go('editor.import', { type: 'project', format: 'json' });
            return false;
        }

        function onImportTreeJson() {
            $state.go('editor.import', { type: 'tree', format: 'json' });
            return false;
        }

        function onImportNodesJson() {
            $state.go('editor.import', { type: 'nodes', format: 'json' });
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
                .then(function() {
                    notificationService.success(
                        'Project saved',
                        'The project has been saved'
                    );
                }, function() {
                    notificationService.error(
                        'Error',
                        'Project couldn\'t be saved'
                    );
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

        function RandomGenerate(DataInput, IndexSucces) {

            if (DataInput === undefined) {
                DataInput = { MinSlibings: 0, MaxSlibings: 0 }
            }

            var MinSlibings = DataInput.MinSlibings;
            var MaxSlibings = DataInput.MaxSlibings;
            var subtrees = DataInput.subtrees;
            var depth = DataInput.depth;

            if (MaxSlibings != "" && MinSlibings != "" && MinSlibings < MaxSlibings) {
                //Create a new project
                var project = $window.editor.project.get();
                project.trees.add();
                var tree = project.trees.getSelected();
                var point = tree.view.getLocalPoint(0, 0);
                //Select the root and add a newly created composites
                var blockRoot = tree.blocks.getAll();
                var blockComposites = tree.blocks.add("Sequence", point.x, point.y);
                tree.connections.add(blockRoot[0], blockComposites);
                //we add in a array the Composites that did not finish their journey
                vm.ArrayComposites.push(blockComposites);
                for (let index = 0; index < depth; index++) {
                    //travel all the composites that are unfinished to continue them
                    vm.ArrayComposites.forEach(element => {

                        var NumeroAle = getRndInteger(MinSlibings, MaxSlibings);
                        for (let x = 0; x < NumeroAle; x++) {
                            var p = getRndInteger(0, 1);
                            //create a method evaluation or explanation
                            // make sure they always have an explainer

                            var BlockConditions = tree.blocks.add(vm.NameNodes[p], point.x, point.y);
                            tree.connections.add(element, BlockConditions);
                            //define properties a method of evaluation or explanation
                            BlockConditions = PropertieSelect(p);


                            var s = tree.blocks.getSelected();
                            tree.blocks.update(s[0], BlockConditions);
                        }
                        if ((depth - index) != 1) {
                            var NumeroAle1 = getRndInteger(1, subtrees);
                            var SubBlockComposites = null;
                            for (let x = 0; x < NumeroAle1; x++) {
                                var y = getRndInteger(0, 1);
                                //create a Compositites
                                SubBlockComposites = tree.blocks.add(vm.NameCompositites[y], point.x, point.y);
                                tree.connections.add(element, SubBlockComposites);
                                vm.ArrayCompositesNew.push(SubBlockComposites);
                            }
                            blockComposites = SubBlockComposites;
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

        function PropertieSelect(IndexNameNodeNodes) {
            var BlockCondition;
            switch (vm.NameNodes[IndexNameNodeNodes]) {
                case "Explanation Method":
                    var indexExplanation = getRndInteger(0, vm.explanation.length - 1);
                    BlockCondition = PropertiesCreate(vm.explanation[indexExplanation], "Explanation Method");
                    break;
                case "Evaluation Method":
                    var indexEvaluation = getRndInteger(0, vm.evaluation.length - 1);
                    BlockCondition = PropertiesCreate(vm.evaluation[indexEvaluation], "Evaluation Method");
                    break;
            }
            return BlockCondition;
        }


        function PropertiesCreate(DataJson, NameNode) {
            //define properties a method of evaluation or explanation
            var json = null;
            if (DataJson.properties != null) {
                json = {};
                DataJson.properties.forEach(element => {
                    json[element.key] = element.value;
                });
            }
            var BlockConditions = {
                title: DataJson.value,
                properties: tine.merge({}, json),
                description: DataJson.description
            };

            if (NameNode == "Explanation Method") {
                var propertiesExpl = {};
                let ArrayNameProperties = Object.keys(DataJson);

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
                        case "Concept":
                            break;
                        case "Instance":
                            break;
                        case "display":
                            break;
                        default:
                            if (Array.isArray(DataJson[ArrayNameProperties[index]])) {

                                propertiesExpl[ArrayNameProperties[index]] = DataJson[ArrayNameProperties[index]];
                            } else {
                                propertiesExpl[ArrayNameProperties[index]] = DataJson[ArrayNameProperties[index]];
                            }

                            break;
                    }
                }
                BlockConditions.propertyExpl = tine.merge({}, BlockConditions.propertyExpl, propertiesExpl);

            }
            return BlockConditions;
        }

        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
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
                for (let index = 0; index < Data.TreeNumber; index++) {
                    result = RandomGenerate(Data, index);
                }
                if (result == true) {
                    onSaveProject();
                }
            }
        }
    }
})();