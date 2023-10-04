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
        'storageService'
    ];

    function ImportController($scope,
        $window,
        $state,
        $stateParams,
        dialogService,
        notificationService,
        storageService) {
        var vm = this;
        vm.type = null;
        vm.format = null;
        vm.open = open;
        vm.loadFromFile = loadFromFile;
        vm.data = '';
        vm.loadArchive = loadArchive;
 
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
            var i = $window.editor.import;
            try { 
                var data = JSON.parse(vm.data);
                if (vm.type === 'project' && vm.format === 'json') {
                    i.projectAsData(data);
                } else if (vm.type === 'tree' && vm.format === 'json') {
                    i.treeAsData(data);
                } else if (vm.type === 'nodes' && vm.format === 'json') {
                    i.nodesAsData(data);
                }
            } catch (e) {
                notificationService.error(
                    'Invalid data',
                    'The provided data is invalid.'
                );
            }

            $state.go('editor');
        }
    }

})();