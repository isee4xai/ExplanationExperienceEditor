angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'templates'
])
    .run(['$rootScope', '$window', '$state',
        function Execute($rootScope, $window, $state) {
            $rootScope.isDesktop = !!$window.process && !!$window.require;
            $rootScope.go = function (state, params) {
                $state.go(state, params);
            };
        }
    ])

    .run(['$state', '$window', 'dialogService', '$animate', '$location', '$document', '$timeout', 'settingsModel', 'projectModel', 'editorService',
        function Execute($state,
            $window,
            dialogService,
            $animate,
            $location,
            $document,
            $timeout,
            settingsModel,
            projectModel,
            editorService) {


            // reset path
            /*
            we hide the redirection to the urlRouterProvider route
            $location.path('/');
            */

            // add drop to canvas
            angular
                .element($window.editor._game.canvas)
                .attr('b3-drop-node', true);

            // initialize editor
            settingsModel.getSettings();

            //initialize nodes and trees when opening the app
            editorService.newProject();

            projectModel
                .getRecentProjects()
                .then(async function (projects) {
                    function closePreload() {
                        $timeout(function () {
                            var element = angular.element(document.getElementById('page-preload'));
                            $animate.addClass(element, 'preload-fade')
                                .then(function () {
                                    element.remove();
                                });
                        }, 500);
                    }
                    function _newProject(path, name) {
                        projectModel
                            .newProject(path, name)
                            .then(function () {
                                $state.go('editor');
                            });
                    }

                    if (projects.length > 0 && projects[0].isOpen) {
                        projectModel
                            .openProject(projects[0].path)
                            .then(function () {
                                closePreload();
                            });

                    } else {
                        var nameProject = "Project 1";
                        projectModel
                            .getRecentProjects()
                            .then(function (recents) {
                                if (recents.length == 0) {
                                    var path = 'b3projects-' + b3.createUUID();
                                    _newProject(path, nameProject);

                                    projectModel
                                        .openProject(path)
                                        .then(function () {
                                            closePreload();
                                            location.reload();
                                        });
                                }
                            });
                    }
                });
        }
    ]);