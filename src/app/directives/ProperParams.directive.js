(function () {
    'use strict';

    angular
        .module('app')
        .directive('b3ProperParams', ProperParams)
        .controller('ProperParamsController', ProperParamsController)
        .factory('ProperParams', ProperParams);

    ProperParams.$inject = ['$parse'];

    function ProperParams($parse) {
        var directive = {
            require: '^ngModel',
            restrict: 'EA',
            replace: true,
            bindToController: true,
            controller: 'KeyTableController', 
            controllerAs: 'ProperParams',
            templateUrl: 'directives/ProperParams.html',
            link: link
        };
        return directive;



        function link(scope, element, attrs) {
            scope.ProperParams.heading = attrs.heading;
            scope.ProperParams._onChange = $parse(attrs.ngChange);

            var variable = attrs.ngModel;
            scope.$watch(variable, function (model) {

                scope.ProperParams.reset(model);

                scope.ProperParams.Imprimir(model);
            });
            element.on('change', function (event) {
                if (event.target.files && event.target.files[0]) {
                    scope.ProperParams.handleImageChange(event.target.files[0]);
                }

            });
        }

    }

    ProperParamsController.$inject = ['$scope', 'projectModel', 'notificationService'];

    function ProperParamsController($scope, projectModel, notificationService,) {
        // HEAD //
        var vm = this;
        vm._onChange = null;
        vm.model = $scope.ProperParams.model || $scope.model || null;
        vm.TypeQuery = ["Tabular", "File"];
        vm.TypeQuerySelect;
        vm.QueryText;
        vm.SelectTypeData = SelectTypeData;
        vm.Save = Save;
        vm.getQueryData = getQueryData;
        vm.modelsSelect = "Model";
        vm.keyModel = "";
        vm.IdQuery = "";
        vm.reset = reset;
        vm.Imprimir = Imprimir;
        vm.changeQueryText = changeQueryText;
        vm.InstanceModeldefault = InstanceModeldefault;
        vm.toggleImageDisplay = toggleImageDisplay;
        vm.handleImageChange = function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var base64 = event.target.result;
                vm.model.img = base64;
                delete vm.model.query;
                toggleImageDisplay(base64);
                vm._onChange($scope);
                $scope.$apply(); 
            };
            reader.readAsDataURL(file);
        }

        _activate();

        // BODY //
        function _activate() {
            
        }

        function InstanceModeldefault(Instance, type) {
            if (Instance) {
                switch (type) {
                    case "dict":
                        const cadena = JSON.stringify(Instance, null, 4);
                        vm.TypeQuerySelect = 'Tabular';
                        vm.QueryText = cadena;
                        delete vm.model.img;
                        vm.model.query = cadena;
                        toggleImageDisplay("");
                        break;
                    case "image":
                        vm.QueryText = "";
                        vm.TypeQuerySelect = 'File';
                        delete vm.model.query;
                        vm.model.img = Instance;
                        toggleImageDisplay(Instance);

                        break;
                    default:
                        break;
                }
            } else {
                vm.TypeQuerySelect = "Type Data";
                vm.QueryText = "";
                delete vm.model.query;
                delete vm.model.img;
                toggleImageDisplay("");
            }
            vm._onChange($scope);
        }

        function toggleImageDisplay(imaegn64) {
            if (imaegn64) {
                var imagenDiv = document.getElementById("ImageInstance");
                var imagen = new Image();

                if (imaegn64.startsWith("data:image")) {
                    imagen.src = imaegn64;
                } else {
                    imagen.src = "data:image/png;base64," + imaegn64;
                }
                
                imagenDiv.innerHTML = "";
                imagen.style.maxWidth = "100%";
                imagen.style.maxHeight = "100%";
                imagenDiv.appendChild(imagen);
            } else {
                var imagenDiv = document.getElementById("ImageInstance");
                imagenDiv.innerHTML = "";
            }
        }

        function changeQueryText() {
            vm.model.query = vm.QueryText;
            vm._onChange($scope);
        }

        function Imprimir(model) {

            if (model && vm.TypeQuerySelect === undefined) {
                if (model.hasOwnProperty('query') && model.query != undefined) {
                    vm.TypeQuerySelect = 'Tabular';
                    delete vm.model.img;
                    vm.QueryText = model.query || "";
                } else if (model.query_id === undefined && (model.query === undefined && model.img === undefined)) {
                    vm.TypeQuerySelect = "Type Data";
                } else {
                    vm.TypeQuerySelect = 'File';
                    delete vm.model.query;
                    vm.QueryText = model.img || "";
                    toggleImageDisplay(model.img);
                }
            }
        }

        function reset(model) {
            vm.model = model;
        }

        function SelectModel(data) {

            vm.modelsSelect = data;
            vm.model.idModel = Object.keys(vm.models).find(key => vm.models[key] === data);
            if (vm._onChange) {
                vm._onChange($scope);
            }
        }


        function SelectTypeData(data) {
            switch (data) {
                case "Tabular":
                    delete vm.model.img;
                    toggleImageDisplay("");
                    vm.model.query = "";
                    vm.QueryText = "";
                    break;
                case "File":
                    delete vm.model.query;
                    vm.model.img = "";
                    break;
                default:
                    break;
            }
            vm.TypeQuerySelect = data;
            vm._onChange($scope);
        }

        function Save() {
            projectModel.UpdateJsonQuey(vm.model.query, vm.model.img)
                .then(function (x) {
                    if (x == "Save Tabular" || x == "Save File") {
                        notificationService.success(
                            x
                        );
                    } else {
                        notificationService.error(
                            x
                        );
                    }

                });
        }


        function getQueryData(QueryId, ModelId, imagefile) {

            projectModel.getQueryImgTab(ModelId, QueryId, imagefile)
                .then(function (x) {
                    if (x.hasOwnProperty('query')) {
                        delete vm.model.img;
                        vm.model.query = x.query;
                    } else {
                        delete vm.model.Query;
                        vm.model.img = x;
                    }
                    notificationService.success(
                        "Get Model Query "
                    );

                    if (vm._onChange) {
                        vm._onChange($scope);
                    }
                }, function () {
                    notificationService.error(
                        'Error'
                    );
                });

        }
    }

})();