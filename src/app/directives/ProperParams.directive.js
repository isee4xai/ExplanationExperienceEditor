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
                scope.ProperParams.model = model;
                // scope.ProperParams.reset(model);
            });

        }

    }

    ProperParamsController.$inject = ['$scope', 'dialogService', 'projectModel'];

    function ProperParamsController($scope, dialogService, projectModel) {
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
        vm.models = {};
        vm.modelsSelect = "Model";
        vm.keyModel = "";
        vm.IdQuery = "";

        _activate();

        // BODY //
        function _activate() {
            //get all models
            GetModels();

        }

        $scope.imageChange = (e) => {
            var FileInput = document.getElementById("labelSelecionar");
            if (e.length > 0) {
                FileInput.innerHTML = 'Loaded';
                FileInput.style.backgroundColor = "rgb(102,178,255)";
            } else {
                FileInput.innerHTML = 'Load File';
                FileInput.style.backgroundColor = "rgb(44,62,80)";
            }
        }




        function SelectModel(data) {
            vm.modelsSelect = data;
            vm.keyModel = Object.keys(vm.models).find(key => vm.models[key] === data);
            console.log(vm.keyModel);
        }

        function SelectTypeData(data) {
            switch (data) {
                case "Tabular":

                    break;
                case "File":
                    vm.QueryText = "";
                    break;
                default:
                    break;
            }
            vm.TypeQuerySelect = data;
        }

        function Save() {
            vm.model.id = vm.keyModel;
            if (vm.TypeQuerySelect != "Type Data") {
                var imagefile = "";
                if (vm.TypeQuerySelect == 'File') {
                    imagefile = document.querySelector('#btnSelecionar');
                    console.log(imagefile.files);
                    console.log(imagefile.files[0]);
                }
                projectModel.PostModelId(vm.keyModel, vm.QueryText, imagefile)
                    .then(function(x) {
                        vm.IdQuery = x.substring(21, 31);
                        //   console.log(vm.IdModel);
                        vm.model.query_id = vm.IdQuery;
                        getQueryData(vm.IdQuery, vm.keyModel);
                    });
            }
        }

        function getQueryData(QueryId, ModelId) {

            console.log(QueryId + "//" + ModelId);

            projectModel.getQueryImgTab(ModelId, QueryId)
                .then(function(x) {
                    if (x.hasOwnProperty('query')) {
                        vm.model.Query = x.query;
                    } else {
                        var elemento = document.getElementById("ddd");

                        var image = new Image();
                        image.src = x;
                        image.style.visibility = 'hidden';
                        elemento.appendChild(image);

                        console.log(image.src);

                        const img = x;
                        var input = document.createElement("input");
                        input.id = "InputImagen";
                        input.value = img;

                        var imagefile = document.querySelector('#InputImagen');
                        console.log(img);
                        console.log(imagefile.files);
                        console.log(imagefile.files[0]);

                        vm.model.Img = imagefile.files[0];
                    }
                });
        }



        function GetModels() {
            projectModel.getModelsRoot()
                .then(function(x) {
                    vm.models = x;
                });
        }


    }

})();