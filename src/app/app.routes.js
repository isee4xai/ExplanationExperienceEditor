angular.module('app')

.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
        //id
            .state('id', {
                url: "/id",
                templateUrl: 'pages/editor/editor.html',
                controller: 'EditorController',
                controllerAs: 'editor',
            }).state('id.id', {
                url: "/:id",
                templateUrl: 'pages/editor/editor.html',
                controller: 'EditorController',
                controllerAs: 'editor',
            }).state('view.id', {
                url: "/view/:id",
                templateUrl: 'pages/editor/editor-ro.html',
                controller: 'EditorController',
                controllerAs: 'editor',
            })
            .state('id.editnode', {
                url: "/node/:name",
                templateUrl: 'pages/id/modals/editnode.html',
                controller: 'EditNodeController',
                controllerAs: 'editnode',
            })
            .state('id.export', {
                url: "/export/:type/:format",
                templateUrl: 'pages/editor/modals/export.html',
                controller: 'ExportController',
                controllerAs: 'export',
            })
            .state('id.import', {
                url: "/import/:type/:format",
                templateUrl: 'pages/editor/modals/import.html',
                controller: 'ImportController',
                controllerAs: 'import',
            })
            .state('id.error', {
                url: "/error",
                templateUrl: 'pages/error/error.html',
                controller: 'ErrorController',
                controllerAs: 'error',
            })

        // Dash
        .state('dash', {
                url: '/dash',
                abstract: true,
                templateUrl: 'pages/dash/dash.html',
                controller: 'DashController',
                controllerAs: 'dash',
            })
            .state('dash.run', {
                url: '/run/:data',
                templateUrl: 'pages/dash/run/run.html',
                controller: 'RunController',
                controllerAs: 'run',
            })
            .state('dash.projects', {
                url: "/projects",
                templateUrl: 'pages/projects/projects.html',
                controller: 'ProjectsController',
                controllerAs: 'projects',
            })
            .state('dash.settings', {
                url: "/settings",
                templateUrl: 'pages/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'settings',
            })

        // Editor
        .state('editor', {
                url: "/editor",
                templateUrl: 'pages/editor/editor.html',
                controller: 'EditorController',
                controllerAs: 'editor',
            })
            .state('editor.editnode', {
                url: "/node/:name",
                templateUrl: 'pages/editor/modals/editnode.html',
                controller: 'EditNodeController',
                controllerAs: 'editnode',
            })
            .state('editor.export', {
                url: "/export/:type/:format",
                templateUrl: 'pages/editor/modals/export.html',
                controller: 'ExportController',
                controllerAs: 'export',
            })
            .state('editor.import', {
                url: "/import/:type/:format",
                templateUrl: 'pages/editor/modals/import.html',
                controller: 'ImportController',
                controllerAs: 'import',
            })

        .state('view', {
                url: "/view",
                templateUrl: 'pages/editor/editor-ro.html',
                controller: 'EditorController',
                controllerAs: 'editor',
            })
        .state("404", {
            url: "/:other",
            templateUrl: 'pages/error/error.html',
            controller: 'ErrorController',
        });

        $urlRouterProvider.otherwise('/dash/projects');


    }
]);