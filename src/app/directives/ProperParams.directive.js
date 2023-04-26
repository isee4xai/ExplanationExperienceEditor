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
            // get the value of the `ng-model` attribute
            scope.ProperParams.heading = attrs.heading;
            scope.ProperParams._onChange = $parse(attrs.ngChange);

            var variable = attrs.ngModel;
            scope.$watch(variable, function (model) {
                //scope.ProperParams.model = model;
                scope.ProperParams.reset(model);
                //scope.ProperParams.GetModels(model);
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
        vm.handleImageChange = function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var base64 = event.target.result;
                vm.model.img = base64;
                delete vm.model.query;

                vm._onChange($scope);
                $scope.$apply(); // actualizar el scope
            };
            reader.readAsDataURL(file);
        }

        _activate();

        // BODY //
        function _activate() {

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
            /*
            if (vm.TypeQuerySelect != "Type Data") {
                var imagefile = "";
                var NameImage = "";
                var imagefileHtml = "";

                if (vm.TypeQuerySelect == 'File') {
                    imagefileHtml = document.querySelector('#btnSelecionar');
                    if (imagefileHtml != "") {
                        imagefile = imagefileHtml.files[0];
                        NameImage = imagefileHtml.files[0].name;
                    } else {
                        imagefile = vm.model.img;
                        NameImage = vm.model.img.name;
                    }

                }
                projectModel.PostModelId(vm.model.idModel, vm.QueryText, imagefile)
                    .then(function(x) {
                        if (x == "The query and image field are missing") {
                            notificationService.error(
                                'Error',
                                x
                            );
                        } else {
                            vm.IdQuery = x.substring(21, 31);
                            vm.model.query_id = vm.IdQuery;
                            notificationService.success(
                                "Get Id Query ",
                                vm.IdQuery
                            );
                            getQueryData(vm.IdQuery, vm.model.idModel, NameImage);
                        }

                    }, function() {
                        notificationService.error(
                            'Error'
                        );
                    });
            }*/
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