(function () {
    'use strict';

    angular
        .module('app')
        .controller('ExportController', ExportController);

    ExportController.$inject = [
        '$scope',
        '$document',
        '$window',
        '$stateParams',
        'dialogService',
        'notificationService',
        'storageService',
        '$window',
        '$location',
        '$state'
    ];

    function ExportController($scope,
        $document,
        $window,
        $stateParams,
        dialogService,
        notificationService,
        storageService,
        window,
        $location,
        $state) {
        var vm = this;
        vm.type = null;
        vm.format = null;
        vm.compact = '';
        vm.pretty = '';
        vm.result = null;
        vm.data = null;
        vm.dataDefault = null;
        vm.datawithoutImg = null;
        vm.toggleSwitch = false;
        vm.hideCompact = false;
        vm.showCompact = showCompact;
        vm.showPretty = showPretty;
        vm.select = select;
        vm.save = save;
        vm.saveJson = saveJson;
        vm.redirect = redirect;
        //switch
        vm.includeImage = true;
        vm.switchText = 'Include image';
        vm.toggleImage = toggleImage;

        _active();

        function _active() {
            vm.type = $stateParams.type;
            vm.format = $stateParams.format;

            var e = $window.editor.export;

            if (vm.type === 'project' && vm.format === 'json') {
                vm.dataDefault = e.projectToData();
                _createJson(vm.dataDefault, "project");
            } else if (vm.type === 'tree' && vm.format === 'json') {
                vm.dataDefault = e.treeToData();
                _createJson(vm.dataDefault, "tree");
            } else if (vm.type === 'nodes' && vm.format === 'json') {
                vm.dataDefault = e.nodesToData();
                _createJson(vm.dataDefault, "nodes");
            }
        }

        function _createJson(data, type, RemoveImage) {
            if (RemoveImage) {
                if (vm.datawithoutImg == null) {
                    switch (type) {
                        case "project":
                            if (data.trees[0].img) {
                                delete data.trees[0].img;
                            }
                            data.trees.forEach(tree => {
                                Object.values(tree.nodes).forEach(node => {
                                    delete node.Image;
                                });
                            });
                            break;
                        case "tree":
                            if (data.img) {
                                delete data.img;
                            }
                            Object.values(data.nodes).forEach(node => {
                                delete node.Image;
                            });

                            break;
                        case "nodes":
                            break;
                        default:
                            break;
                    }
                    vm.datawithoutImg = data;
                }else{
                    data = vm.datawithoutImg ;
                }

            }

            vm.data = data;
            vm.compact = JSON.stringify(data);
            vm.pretty = JSON.stringify(data, null, 2);
            vm.result = vm.pretty;
        }

        function select() {
            var range = $document[0].createRange();
            range.selectNodeContents($document[0].getElementById('export-result'));
            var sel = $window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function redirect() {
            var url = $location.url();

            var indexId = url.indexOf("/id/");
            var idParam;
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

        function save() {
            dialogService
                .saveAs(null, ['.b3', '.json'])
                .then(function (path) {
                    storageService
                        .saveAsync(path, vm.pretty)
                        .then(function () {
                            notificationService.success(
                                'File saved',
                                'The file has been saved successfully.'
                            );
                        });
                });
        }

        function saveJson() {
            var blob = new Blob([vm.result], { type: 'application/json' });
            var downloadLink = $window.document.createElement('a');
            downloadLink.href = $window.URL.createObjectURL(blob);
            downloadLink.download = 'archivo.json';

            $window.document.body.appendChild(downloadLink);
            downloadLink.click();

            $window.document.body.removeChild(downloadLink);
        }

        function showCompact() {
            vm.result = vm.compact;
        }

        function showPretty() {
            vm.result = vm.pretty;
        }

        function toggleImage() {
            const datos = angular.copy(vm.dataDefault);
            if (vm.includeImage) {
                vm.switchText = 'Include image';
                _createJson(datos, vm.type, false);
            } else {
                vm.switchText = 'Remove image';
                _createJson(datos, vm.type, true);
            }
        }
    }


})();