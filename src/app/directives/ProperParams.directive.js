(function() {
    'use strict';

    angular
        .module('app')
        .directive('b3ProperParams', ProperParams)
        .controller('ProperParamsController', ProperParamsController);

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
            scope.$watch(variable, function(model) {
                //scope.ProperParams.model = model;
                scope.ProperParams.reset(model);
                //    scope.ProperParams.GetModels(model);
                scope.ProperParams.Imprimir(model);
            });



        }

    }

    ProperParamsController.$inject = ['$scope', 'projectModel', 'notificationService'];

    function ProperParamsController($scope, projectModel, notificationService) {
        // HEAD //
        var vm = this;
        vm._onChange = null;
        vm.model = $scope.ProperParams.model || $scope.model || null;
        vm.rows = [];
        vm.TypeQuery = ["Tabular", "File"];
        vm.TypeQuerySelect = "Type Data";
        vm.QueryText = "";
        vm.SelectTypeData = SelectTypeData;
        vm.Save = Save;
        vm.SelectModel = SelectModel;
        vm.GetModels = GetModels;
        vm.getQueryData = getQueryData;
        vm.models = [];
        vm.modelsSelect = "Model";
        vm.keyModel = "";
        vm.IdQuery = "";
        vm.reset = reset;
        vm.Imprimir = Imprimir;

        _activate();

        // BODY //
        function _activate() {
            //get all models
            GetModels();

        }

        function Imprimir(model) {
            if (model) {
                if (model.hasOwnProperty('query') && model.query != undefined) {
                    vm.TypeQuerySelect = 'Tabular';
                    vm.QueryText = model.query;
                } else if (model.hasOwnProperty('img') && model.img != undefined) {
                    vm.TypeQuerySelect = 'File';
                    vm.QueryText = model.img;
                }
                _activate();
            }
        }


        function reset(model) {
            vm.rows = [];
            vm.model = model;
            _activate();
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
                    break;
                case "File":
                    delete vm.model.query;
                    vm.model.img = "";
                    break;
                default:
                    break;
            }
            vm.TypeQuerySelect = data;

            /* if (vm._onChange) {
                 vm._onChange($scope);
             }*/
        }

        function Save() {
            // vm.model.id = vm.keyModel;
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
            }
        }



        function getQueryData(QueryId, ModelId, imagefile) {

            projectModel.getQueryImgTab(ModelId, QueryId, imagefile)
                .then(function(x) {
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
                }, function() {
                    notificationService.error(
                        'Error'
                    );
                });

        }



        function GetModels() {
            projectModel.getModelsRoot()
                .then(function(x) {
                    vm.models = x;
                    if (vm.model.hasOwnProperty('idModel') && vm.model.idModel != undefined) {

                        vm.modelsSelect = vm.models[vm.model.idModel];
                    }
                });
        }
    }

})();