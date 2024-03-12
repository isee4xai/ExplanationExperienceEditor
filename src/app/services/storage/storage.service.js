angular
    .module('app')
    .factory('storageService', storageService);

storageService.$inject = ['$state', '$q', 'localStorageService', 'fileStorageService', '$http', '$cookies',
    'editorService', 'systemService'
];

function storageService($state, $q, localStorageService, fileStorageService, $http, $cookies, editorService, systemService) {
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
        getToken: getToken,
        loadEvaluation: loadEvaluation,
        loadExplanationExp: loadExplanationExp,
        loadModelsPublic: loadModelsPublic,
        loadModelsPrivate: loadModelsPrivate,
        PostModelIdLoadModel: PostModelIdLoadModel,
        loadExplainers: loadExplainers,
        loadExplainersSubstitute: loadExplainersSubstitute,
        GetQuery: GetQuery,
        PostExplainers: PostExplainers,
        PostExplainerNew: PostExplainerNew,
        GetSimNLStorage: GetSimNLStorage,
        GetDesciptionExplainerStorage: GetDesciptionExplainerStorage,
        UpdateJsonQueyStorage: UpdateJsonQueyStorage,
        GetInstanceModelSelectStorage: GetInstanceModelSelectStorage,
        GetSubstituteExplainerService: GetSubstituteExplainerService,
        getProjecAllDataService: getProjecAllDataService,
        getExplainerFieldsFilteredService: getExplainerFieldsFilteredService,
        PostSubstituteSubtreeService: PostSubstituteSubtreeService,
        GetApplicabilityExplanationService: GetApplicabilityExplanationService,
        SustituteSubTreeReuseService: SustituteSubTreeReuseService,
        GetExplainersListFormService: GetExplainersListFormService
    };
    return service;

    function save(path, data) {
        storage.save(path, data);
    }

    function getProjecAllDataService(path) {

        return $q(function (resolve, reject) {

            var Project = localStorageService.load(path);

            if (Project) {
                resolve(Project);
            } else {
                reject(new Error("Algo salió mal"));
            }
        });
    }

    function saveJson(path, data) {
        return $q(function (resolve, reject) {
            try {
                if (localStorage.getItem(path) != null) {
                    //get date now
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date + ' ' + time;
                    data.date = dateTime;
                    //save project in json server 
                    $http.get(SettingsAddres.httpAddresProjectsPath + path).success(function (dataJson) {
                        //update data on the server json if it already exists otherwise it is saved as a new json with a new id

                        if (dataJson.length != 0) {
                            fetch(SettingsAddres.httpAddresProjects + '/' + dataJson[0].id, {
                                method: 'PATCH',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                                .then((response) => {
                                    response.json(),
                                        resolve("Project saved \n The project has been saved")
                                })
                                .catch((error) => {
                                    resolve("Error \n Project couldn't be saved");
                                });
                        } else {
                            fetch(SettingsAddres.httpAddresProjectsPath + path, {
                                method: 'POST',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                                .then((response) => {
                                    response.json(),
                                        resolve("Project saved \n The project has been saved")
                                })
                                .catch((error) => {
                                    resolve("Error \n Project couldn't be saved");
                                });
                        }
                    });
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    function UpdateJsonQueyStorage(path, dataQuey, Img64) {

        return $q(function (resolve, reject) {
            try {
                if (localStorage.getItem(path) != null) {
                    //save project in json server 
                    var queryType = "";
                    $http.get(SettingsAddres.httpAddresProjectsPath + path).success(function (dataJson) {

                        if (dataJson[0] != undefined) {
                            if (Img64 == null) {
                                dataJson[0]['data']['trees'][0]['query'] = dataQuey;
                                delete dataJson[0]['data']['trees'][0]['img'];
                                queryType = "Tabular";

                            }
                            if (dataQuey == null) {
                                dataJson[0]['data']['trees'][0]['img'] = Img64;
                                delete dataJson[0]['data']['trees'][0]['query'];
                                queryType = "File";
                            }

                            fetch(SettingsAddres.httpAddresProjects + '/' + dataJson[0].id, {
                                method: 'PATCH',
                                body: JSON.stringify(dataJson[0]),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                                .then((response) =>
                                    localStorageService.update(path, dataJson[0],
                                        resolve("Save " + queryType)))
                                .catch((error) => {
                                    resolve("The image is too large. The server cannot process images of this size");
                                });
                        } else {
                            resolve("To save the query, you need to first save the project that contains it");
                        }
                    });

                }
            } catch (e) {
                reject(e);
            }
        });

    }

    function saveAsync(path, data) {
        return $q(function (resolve, reject) {
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
        return $q(function (resolve, reject) {
            try {
                var data;

                console.log(SettingsAddres.httpAddresProjects + '/' + id);

                $http.get(SettingsAddres.httpAddresProjects + '/' + id).then(function (dataJson) {
                    storage.save(dataJson.data.path, dataJson.data);
                    data = storage.load(dataJson.data.path);
                    resolve(dataJson.data);
                }, function (err) {
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
        return $q(function (resolve, reject) {
            try {
                $http.get(SettingsAddres.httpAddresEvaluation).success(function (data) {
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
        return $q(function (resolve, reject) {
            try {
                axios.get(server_url).then(function (response) {
                    resolve(response.data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    //Sub

    async function loadExplainersSubstitute() {
        var UrlCSV = "https://api-onto-dev.isee4xai.com/api/reuse/ReuseSupport";
        var datos = [];

        return $q(function (resolve, reject) {
            try {
                axios.get(UrlCSV).then(function (response) {
                    resolve(response.data.similarities);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    async function GetSubstituteExplainerService(data, usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/substituteExplainer";

        return $q(function (resolve, reject) {
            try {
                var token = $cookies.get('auth');
                axios.post(server_url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        resolve(response.data);
                    })
                    .catch(function (err) {
                        console.log(err);
                        resolve('Error in computer network communications');
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    async function getExplainerFieldsFilteredService(callback) {

        var Url = "https://api-onto-dev.isee4xai.com/api/reuse/ExplainerFieldsFiltered";

        axios.get(Url).then((response) => {
            if (response.status !== 200) {
                callback('Failed to fetch Explainer Properties', null);
                return;
            }
            callback(null, response.data);
        })
            .catch((error) => {
                callback(error.message, null);
            });


    }

    function getToken() {
        /*
        var Cookie = $cookies.get('auth');

        if (favoriteCookie1) {
            if (favoriteCookie1.expires instanceof Date) {
                var currentDate = new Date();
                if (currentDate > favoriteCookie1.expires) {
                  return "CookieExpire";
                } 
            } 
        } else {
             return "NoExistCookie";
        }

        return Cookie;
        */


        return $q(function (resolve, reject) {
         //   var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmMyZjIwYmNmNzZkNzU1ZGNhOTU0ZWMiLCJjb21wYW55SWQiOiI2MmMyZjIwYmNmNzZkNzU1ZGNhOTU0ZWEiLCJpYXQiOjE2OTkyNzIxNTcsImV4cCI6MTY5OTM1ODU1N30.f-8i1c0jPZ45haQEqjzP7STpTWS-9oa4Pj91XKrPqXs";
            var Cookie = $cookies.get('auth');
            resolve(Cookie);
        });
    }


    async function GetSimNLStorage(SubNameChange) {

        var server_url = SettingsAddres.httpAddresExplanations + "NLPExplainerComparison";

        var datos = {
            "explainers": SubNameChange
        }

        var config = {
            method: 'post',
            url: server_url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: datos
        };


        return $q(function (resolve, reject) {
            try {
                axios(config)
                    .then(function (response) {
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



    async function loadExplanationExp(method, IdModel) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.httpAddresExplanations;
        //We set the method from which we want to take the params

        if (IdModel == "" || IdModel == undefined) {
            var method_url = method;
        } else {
            var method_url = method + "/" + IdModel;
        }

        return $q(function (resolve, reject) {
            try {
                axios.get(server_url + method_url).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
                });

            } catch (e) {
                reject(e);
            }
        });
    }

    async function loadModelsPrivate(idModelUrl) {
        //cambiar cuando me pasen la url
        var server_url = SettingsAddres.httpAddresModels + "/alias/" + idModelUrl;

        return $q(function (resolve, reject) {
            try {
                axios.get(server_url).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    async function loadModelsPublic() {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.AddresModels;
        return $q(function (resolve, reject) {
            try {
                axios.get(server_url).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
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

        return $q(function (resolve, reject) {
            try {
                axios(config)
                    .then(function (response) {
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

    async function GetInstanceModelSelectStorage(ModelId) {

        if (!ModelId) {
            return Promise.reject(new Error("ModelId is not defined"));
        }
        
        var server_url = SettingsAddres.AddresInstanceModels + ModelId + '/0';
        return $q(function (resolve, reject) {
            try {
                axios.get(server_url)
                    .then(function (response) {
                        resolve(response.data);
                    }).catch(function (error) {
                        resolve(error);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }


    function PostExplainerNew(Json, ExplainerSelect) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.httpAddresExplanations + ExplainerSelect;

        var config = {
            method: 'post',
            url: server_url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: Json
        };

        return $q(function (resolve, reject) {
            try {
                axios(config)
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch((error) => {
                        resolve("Error execute Explanation Method ");
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

        return $q(function (resolve, reject) {
            try {
                if (imagefile == "") {
                    axios.get(url).then(function (response) {
                        resolve(response.data);
                    });
                } else {
                    axios.get(url, { responseType: "blob" })
                        .then(function (response) {
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

    function GetDesciptionExplainerStorage(explainerTitle) {

        var server_url = SettingsAddres.httpAddresExplanations + explainerTitle;

        return $q(function (resolve, reject) {
            try {
                axios.get(server_url).then(function (response) {
                    resolve(response.data._method_description);
                });
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

        return $q(function (resolve, reject) {
            try {
                axios(config)
                    .then(function (response) {
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
        return $q(function (resolve, reject) {
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
        return $q(function (resolve, reject) {
            try {
                storage.remove(path);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }


    async function PostSubstituteSubtreeService(data, usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/substituteSubtree";

        return $q(function (resolve, reject) {
            try {
                var token = $cookies.get('auth');
                axios.post(server_url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        resolve(response.data);
                    })
                    .catch(function (err) {
                        console.log(err);
                        resolve('Error in computer network communications');
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    async function SustituteSubTreeReuseService(data, usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/substituteSubtree";

        return $q(function (resolve, reject) {
            try {
                var token = $cookies.get('auth');
                axios.post(server_url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        resolve(response.data);
                    })
                    .catch(function (err) {
                        console.log(err);
                        resolve('Error in computer network communications');
                    });
            } catch (e) {
                reject(e);
            }

        });

    }

    async function GetExplainersListFormService() {
        var server_url = "https://api-onto-dev.isee4xai.com/api/explainers/list";

        return $q(function (resolve, reject) {
            try {
                axios.get(server_url).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    async function GetApplicabilityExplanationService(usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/applicability";

        return $q(function (resolve, reject) {
            try {
                var token = $cookies.get('auth');
                axios.post(server_url, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        resolve(response.data);
                    })
                    .catch(function (err) {
                        console.log(err);
                        resolve('Error in computer network communications');
                    });
            } catch (e) {
                reject(e);
            }

        });
    }

}

