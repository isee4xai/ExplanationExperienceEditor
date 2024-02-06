(function () {
    'use strict';

    angular
        .module('app')
        .controller('ImportController', ImportController);

    ImportController.$inject = [
        '$scope',
        '$window',
        '$state',
        '$stateParams',
        'dialogService',
        'notificationService',
        'storageService',
        '$location',
        'projectModel'
    ];

    function ImportController($scope,
        $window,
        $state,
        $stateParams,
        dialogService,
        notificationService,
        storageService,
        $location,
        projectModel
        ) {
        var vm = this;
        vm.type = null;
        vm.format = null;
        vm.open = open;
        vm.loadFromFile = loadFromFile;
        vm.data = '';
        vm.loadArchive = loadArchive;
        vm.redirect = redirect;
 
        _active();

        function _active() {
            vm.type = $stateParams.type;
            vm.format = $stateParams.format;
        }

        function loadFromFile() {
            dialogService
                .openFile(false, ['.b3', '.json'])
                .then(function (path) {
                    storageService
                        .loadAsync(path)
                        .then(function (data) {
                            vm.data = JSON.stringify(data, null, 2);
                        });
                });
        }

        function redirect() {
            var url = $location.url();
    
            var indexId = url.indexOf("/id/");
            var idParam ;
            if (indexId !== -1) {
                 idParam = url.substring(indexId + 4);
                var indexNextSlash = idParam.indexOf("/");
                if (indexNextSlash !== -1) {
                    idParam = idParam.substring(0, indexNextSlash);
                }
                $state.go('id', { vid: idParam, usercase: url.split("usecaseId=")[1] });
            } else {
                $state.go('editor');
            }
            
        }

        function loadArchive() {
            var inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.accept = '.b3,.json';

            inputElement.addEventListener('change', function (event) {
                var file = event.target.files[0];

                if (file) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var content = e.target.result;  
                        $scope.$apply(function () {
                            vm.data = content;
                        });
                    };
                    reader.readAsText(file);
                }
            });
            inputElement.click();
        }

        function open() {
            const i = $window.editor.import; 
            try { 
                const ListApplicability = projectModel.getApplicability();
                var data = JSON.parse(vm.data);

                if (vm.type === 'project' && vm.format === 'json') {
                    const e = $window.editor.export;
                    // If a tree with the same ID is found, generate a new ID for the selected tree and update the ID of the first tree
                    const treeWithId = e.projectToData().trees.find(tree => tree.id === data.trees[0].id);
                    if (treeWithId) {
                        const idNew = b3.createUUID();
                        data.selectedTree = idNew;
                        data.trees[0].id = idNew;
                    }

                    if (data.hasOwnProperty("selectedTree")) {
                        i.projectAsData(data,null,ListApplicability);
                    }else{
                        notifyInvalidData();
                    }
                } else if (vm.type === 'tree' && vm.format === 'json') {
                    if (data.hasOwnProperty("root")) {
                        i.treeAsData(data,null,ListApplicability);
                    }else{
                        notifyInvalidData(); 
                    }
                   
                } else if (vm.type === 'nodes' && vm.format === 'json') {
                    i.nodesAsData(data);
                }

            } catch (e) {
                notifyInvalidData();
            }

            redirect();
        }

        function notifyInvalidData() {
            notificationService.error(
                'Invalid data',
                'The provided data is invalid.'
            );
        }
    }

})();