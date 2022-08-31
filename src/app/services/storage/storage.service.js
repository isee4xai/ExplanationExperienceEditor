angular
    .module('app')
    .factory('storageService', storageService);

storageService.$inject = ['$state', '$q', 'localStorageService', 'fileStorageService', '$http',
    'editorService', 'systemService'
];

function storageService($state, $q, localStorageService, fileStorageService, $http, editorService, systemService) {
    var storage = (fileStorageService.ok ? fileStorageService : localStorageService);

    var settingsPath = systemService.join(systemService.getDataPath(), 'settings.json');
    var SettingsAddres = load(settingsPath);

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
        loadExplanationExp: loadExplanationExp,
        loadModels: loadModels,
        PostModelIdLoadModel: PostModelIdLoadModel,
        loadExplainers: loadExplainers,
        GetQuery: GetQuery,
        PostExplainers: PostExplainers,
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
            $http.get(SettingsAddres.httpAddresProjectsPath + path).success(function(dataJson) {
                //update data on the server json if it already exists otherwise it is saved as a new json with a new id
                if (dataJson.length != 0) {
                    fetch(SettingsAddres.httpAddresProjects + '/' + dataJson[0].id, {
                            method: 'PATCH',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((response) => response.json());
                } else {
                    fetch(httpAddresProjects, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((response) => response.json());
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
                $http.get(SettingsAddres.httpAddresProjects + '/' + id).then(function(dataJson) {
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
     * @returns data on Evaluation method
     */
    function loadEvaluation() {
        return $q(function(resolve, reject) {
            try {
                $http.get(SettingsAddres.httpAddresEvaluation).success(function(data) {
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }


    function loadExplainers() {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.AddresExplainers;
        return $q(function(resolve, reject) {
            try {
                axios.get(server_url).then(function(response) {
                    resolve(response.data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }


    async function loadExplanationExp(method) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.httpAddresExplanations;
        //We set the method from which we want to take the params
        var method_url = method;

        return $q(function(resolve, reject) {
            try {
                axios.get(server_url + method_url).then(function(response) {
                    resolve(response.data);
                });
            } catch (e) {
                reject(e);
            }
        });
        /*
        return $q(function(resolve, reject) {
            try {
                axios.get(server_url + method_url).then(function(response) {
                    resolve(response.data.Params);
                });
            } catch (e) {
                reject(e);
            }
        });
        return $q(function(resolve, reject) {
            try {
                axios.get(server_url + method_url).then(function(response) {
                    resolve(response.data.params);
                });
            } catch (e) {
                reject(e);
            }
        });
        */
    }

    function loadModels() {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.AddresModels;
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+");
        console.log(SettingsAddres);
        console.log(server_url);
        return $q(function(resolve, reject) {
            try {
                axios.get(server_url).then(function(response) {
                    resolve(response.data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    function PostModelIdLoadModel(ModelId, Quey, Image) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.AddresQuery;

        var data = new FormData();
        data.append('id', ModelId);

        if (Quey != "") {
            data.append('query', Quey);
        }
        if (Image != "") {
            data.append("image", Image);
        }

        var config = {
            method: 'post',
            url: server_url,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: data
        };

        return $q(function(resolve, reject) {
            try {
                axios(config)
                    .then(function(response) {
                        if (response.status == 200) {
                            resolve(response.data);
                        } else {
                            reject(e);
                        }
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    function GetQuery(Id, QueyId, imagefile) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.AddresQuery;

        var url = server_url + "?query_id=" + QueyId + "&id=" + Id;

        return $q(function(resolve, reject) {
            try {
                if (imagefile == "") {
                    axios.get(url).then(function(response) {
                        resolve(response.data);
                    });
                } else {
                    axios.get(url, { responseType: "blob" })
                        .then(function(response) {
                            var reader = new window.FileReader();
                            reader.readAsDataURL(response.data);
                            var file = new File([response.data], imagefile, { type: "image/png" });
                            resolve(file);
                        });
                }

            } catch (e) {
                reject(e);
            }
        });
    }


    function PostExplainers(Model, Params, Instance) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.httpAddresExplanations + Instance;

        var data = new FormData();
        data.append('id', Model.idModel);

        if (Model.hasOwnProperty('query')) {
            data.append('instance', Model.query);
        }
        data.append('params', Params);

        if (Model.hasOwnProperty('img')) {
            data.append('image', Model.img);
        }
        data.append('url', "");

        var config = {
            method: 'post',
            url: server_url,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: data
        };

        return $q(function(resolve, reject) {
            try {
                axios(config)
                    .then(function(response) {
                        if (response.status == 200) {
                            resolve(response.data);
                        } else {
                            reject(e);
                        }
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