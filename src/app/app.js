angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'templates',
    'ngCookies'
])
    .run(['$rootScope', '$window', '$state',
        function Execute($rootScope, $window, $state) {
            $rootScope.isDesktop = !!$window.process && !!$window.require;
            $rootScope.go = function (state, params) {
                $state.go(state, params);
            };
        }
    ])

    .run(['$state', '$window', 'dialogService', '$animate', '$location', '$document', '$timeout', 'settingsModel', 'projectModel', 'editorService', 'notificationService',
        async function Execute($state,
            $window,
            dialogService,
            $animate,
            $location,
            $document,
            $timeout,
            settingsModel,
            projectModel,
            editorService,
            notificationService) {


            // reset path
            /*
            we hide the redirection to the urlRouterProvider route
            $location.path('/');
            */

            // add drop to canvas
            angular.element($window.editor._game.canvas).attr('b3-drop-node', true);

            // initialize editor 
            settingsModel.getSettings();

            //initialize nodes and trees when opening the app
            editorService.newProject();

            try {
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
           
                        if (projects.length > 0) {

                            var url = $location.url().slice(1);
                            urlSplit = url.split("/");
                            var Id = "";
                            var elementoEncontrado;
                            if (urlSplit.length > 1) {
                                Id = urlSplit[1];
                                if (Id.includes("?")) {
                                    Id = Id.split("?")[0];
                                }
                            }

                            if (Id != "") {
                                elementoEncontrado = projects.find(elemento => elemento.id === Id);
                            } else {
                                elementoEncontrado = projects.find(elemento => elemento.isOpen === true);
                            }

                            const y = await GetApplicability();
                          
                            projectModel
                                .openProject(elementoEncontrado.path, y)
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
            } catch (error) {
                console.error('Error while fetching applicability:', error);
                // Handle error as needed
            }


            async function GetApplicability() {
                const usecaseId = $location.search().usecaseId;
                try {
                    const applicability = await projectModel.GetApplicabilityExplanation(usecaseId);
                    if (applicability === "Error in computer network communications") {
                        notificationService.warning(
                            'Applicability Not Found',
                            'Without applicability, many functions may not work properly. Please log in to the cockpit to obtain it.'
                        );
                        return null;
                    }
                    return applicability;
                } catch (error) {
                    console.error('Error while getting applicability explanation:', error);
                    throw error;
                }
            }
        }
    ]);

