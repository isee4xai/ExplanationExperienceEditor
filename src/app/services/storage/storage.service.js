angular
    .module('app')
    .factory('storageService', storageService);

storageService.$inject = ['$state', '$q', 'localStorageService', 'fileStorageService', '$http', 'editorService'];

function storageService($state, $q, localStorageService, fileStorageService, $http) {
    var storage = (fileStorageService.ok ? fileStorageService : localStorageService);

    var service = {
        save: save,
        saveJson: saveJson,
        saveAsync: saveAsync,
        load: load,
        loadProjectId: loadProjectId,
        loadAsync: loadAsync,
        remove: remove,
        removeAsync: removeAsync,
        loadEvaluation: loadEvaluation,
        loadExplanation: loadExplanation,
    };
    return service;

    function save(path, data) {
        storage.save(path, data);
    }

    function saveJson(path, data) {

        if (localStorage.getItem(path) != null) {
            //get date now
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            data.date = dateTime;
            //save project in json server 
            $http.get(httpAddresProjectsPath + path).success(function(dataJson) {
                //update data on the server json if it already exists otherwise it is saved as a new json with a new id
                if (dataJson.length != 0) {
                    fetch(httpAddresProjects + '/' + dataJson[0].id, {
                            method: 'PATCH',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((response) => response.json())
                        .then((json) => console.log(json));
                } else {
                    fetch(httpAddresProjects, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((response) => response.json())
                        .then((json) => console.log(json));
                }
            });
        }

    }

    function saveAsync(path, data) {
        return $q(function(resolve, reject) {
            try {
                storage.save(path, data);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    function load(path) {
        return storage.load(path);
    }

    function loadProjectId(id) {
        return $q(function(resolve, reject) {
            try {
                var data;
                $http.get(httpAddresProjects + '/' + id).then(function(dataJson) {
                    storage.save(dataJson.data.path, dataJson.data);
                    data = storage.load(dataJson.data.path);
                    resolve(dataJson.data);
                }, function(err) {
                    // your error function
                    if (err.status == 404) {
                        $state.go('id.error');
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
    /**
     * get data from json server
     * @returns data on Explanation method
     */
    function loadExplanation() {
        return $q(function(resolve, reject) {
            try {
                $http.get(httpAddresExplanation).success(function(data) {
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
    /**
     * get data from json server
     * @returns data on Evaluation method
     */
    function loadEvaluation() {
        return $q(function(resolve, reject) {
            try {
                $http.get(httpAddresEvaluation).success(function(data) {
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    function loadAsync(path) {
        return $q(function(resolve, reject) {
            try {
                var data = storage.load(path);
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }

    function remove(path) {
        storage.remove(path);
    }

    function removeAsync(path) {
        return $q(function(resolve, reject) {
            try {
                storage.remove(path);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

}