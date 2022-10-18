var filterApp = angular.module('filterApp', []);

filterApp.controller('filterAppCtrl', ['$scope', '$http',
    function($scope, $http) {
        // Source for ng-repeat="entry in entries"
        // Read all data from json file and pase it to the scope
        $http.get('https://api-dev.isee4xai.com/api/trees/').then(function(data) {
            $scope.entries = data.data;
            $scope.NumberProjects = Object.keys(data.data).length;
        });

        // Checkbox check and uncheck method
        $scope.check = function(id) {
            window.location.href = "/projects/" + id;
        };

        $scope.setTableLimit = function(limit) {
            $scope.Loadrows.forEach(element => {
                if (element.numero == limit.numero) {
                    element.nombre = "Loaded " + limit.nombre;
                } else {
                    element.nombre = element.numero + " row";
                }
            });
            $scope.Loadrowsss = limit.numero;
        };

        // Setting different filter limit for number or other types
        $scope.getFilterLength = function(filterText) {
            if (parseInt(filterText) == filterText) {
                $scope.filterLength = 1;
            } else
                $scope.filterLength = 3;
        }

        // Set initial values
        $scope.limitLoads = 10;
        $scope.itemCount = 0;
        $scope.mainCheckboxVal = "";
        $scope.filterLength = 3;
        $scope.entries = [];
        //$scope.Loadrows = [20, 100, 250, 500, 1000];
        $scope.Loadrows = [{ 'numero': 10, 'nombre': '10 row' }, { 'numero': 20, 'nombre': '20 row' }, { 'numero': 50, 'nombre': '50 row' }];
        $scope.NumberProjects = 0;
        $scope.Loadrowsss = 10;
    }


]);