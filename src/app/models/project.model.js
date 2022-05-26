(function() {
    'use strict';

    angular
        .module('app')
        .factory('projectModel', projectModel);

    projectModel.$inject = [
        '$q',
        '$rootScope',
        '$window',
        'storageService',
        'systemService',
        'localStorageService',
        'editorService'
    ];

    function projectModel($q,
        $rootScope,
        $window,
        storageService,
        systemService,
        localStorageService,
        editorService) {

        // HEAD //
        var recentPath = systemService.join(systemService.getDataPath(), 'recents.json');
        var recentCache = null;
        var currentProject = null;

        var service = {
            getRecentProjects: getRecentProjects,
            newProject: newProject,
            getProject: getProject,
            saveProject: saveProject,
            openProject: openProject,
            openProjectId: openProjectId,
            closeProject: closeProject,
            removeProject: removeProject,
            getConditionsEvaluationMethod: getConditionsEvaluationMethod,
            getConditionsExplanationMethod: getConditionsExplanationMethod,
        };
        return service;

        // BODY //
        function _saveRecentProjects() {
            storageService.save(recentPath, recentCache);
        }

        function _updateRecentProjects(project) {

            if (project) {
                for (var i = recentCache.length - 1; i >= 0; i--) {
                    if (recentCache[i].path === project.path) {
                        recentCache.splice(i, 1);
                    } else {
                        recentCache[i].isOpen = false;
                    }
                }
                var data = {
                    name: project.name,
                    description: project.description,
                    path: project.path,
                    isOpen: true,
                };

                recentCache.splice(0, 0, data);
            } else {
                for (var j = 0; j < recentCache.length; j++) {
                    recentCache[j].isOpen = false;
                }
            }
            _saveRecentProjects();
        }

        function _setProject(project) {
            // Set current open project to the localStorage, so the app can open it
            //   during intialization
            currentProject = project;
            _updateRecentProjects(project);
            $rootScope.$broadcast('dash-projectchanged');
        }

        function getRecentProjects() {
            return $q(function(resolve, reject) {
                if (!recentCache) {
                    var data;

                    try {
                        data = storageService.load(recentPath);
                    } catch (e) {}

                    if (!data) {
                        data = [];
                    }

                    recentCache = data;
                }
                resolve(recentCache);
            });
        }

        function newProject(path, name) {
            return $q(function(resolve, reject) {
                var project = {
                    name: name,
                    description: '',
                    data: [],
                    path: path
                };

                editorService.newProject();
                project.data = editorService.exportProject();
                saveProject(project)
                    .then(function() {
                        _setProject(project);
                        resolve();
                    });
            });
        }

        function getProject() {
            return currentProject;
        }

        function saveProject(project) {
            project = project || currentProject;
            project.data = editorService.exportProject();
            // view project
            return $q(function(resolve, reject) {
                $window.editor.clearDirty();
                //save 
                storageService.saveJson(project.path, project);
                storageService.save(project.path, project);
                _updateRecentProjects(project);
                resolve();
            });
        }

        function openProject(path) {
            return $q(function(resolve, reject) {
                try {
                    var project = storageService.load(path);
                    editorService.openProject(project.data);
                    _setProject(project);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }

        function openProjectId(id) {
            return $q(function(resolve, reject) {
                try {
                    storageService
                        .loadProjectId(id)
                        .then(function(json) {

                            editorService.openProject(json.data);
                            _setProject(json);
                            resolve(json.data);
                        });
                } catch (e) {
                    reject(e);
                }
            });
        }

        function closeProject() {
            return $q(function(resolve, reject) {
                $window.editor.clearDirty();
                editorService.closeProject();
                _setProject(null);
                resolve();
            });
        }

        function removeProject(path) {
            return $q(function(resolve, reject) {
                for (var i = 0; i < recentCache.length; i++) {
                    if (recentCache[i].path === path) {
                        recentCache.splice(i, 1);
                        break;
                    }
                }

                _saveRecentProjects();
                resolve();
            });
        }

        function getConditionsEvaluationMethod() {
            return $q(function(resolve, reject) {
                try {
                    var data = storageService.loadEvaluation();
                    resolve(data);
                } catch (e) {

                    reject(e);
                }
            });
        }

        function getConditionsExplanationMethod() {
            return $q(function(resolve, reject) {
                try {
                    var data = storageService.loadExplanation();
                    resolve(data);
                } catch (e) {

                    reject(e);
                }
            });
        }
    }
})();