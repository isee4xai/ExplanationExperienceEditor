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
    };
    return service;

    function save(path, data) {
        storage.save(path, data);
    }

    function getProjecAllDataService(path) {
        return $q(function (resolve, reject) {
            try {
                if (localStorage.getItem(path) != null) {
                    $http.get(SettingsAddres.httpAddresProjectsPath + path).success(function (dataJson) {
                        resolve(dataJson)
                    });
                }
            } catch (e) {
                reject(e);
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

    async function GetSubstituteExplainerService(Criteria, TitleExplan,usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/substituteExplainer";

        var headers = {
            "Content-Type": "application/json",
            "x-access-token": "token"
        };

        var data = {
            "criteria": Criteria,
            "explainer": TitleExplan
        }

        return $q(function (resolve, reject) {
            /*   try {
                   axios.post(server_url, data, { headers: headers }).then(function (response) {
                       resolve(response.data);
                   }, function (err) {
                       resolve("Error in computer network communications");
                   });
               } catch (e) {
                   reject(e);
               }
           */
            var datosFalsos = [
                {
                    "explainer": "/Images/LIME",
                    "explanation": "desciption",
                    "similarity": 0.5267

                },
                {
                    "explainer": "/Images/Anchors",
                    "explanation": "desciption",
                    "similarity": 0.8267

                },
                {
                    "explainer": "/Images/GradCam",
                    "explanation": "desciption",
                    "similarity": 0.3267

                }
            ]
            resolve(datosFalsos);
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
        // Implementa la lógica para obtener el token
        return 'mi_token';
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


    async function PostSubstituteSubtreeService(data,usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/substituteSubtree";
        var headers = {
            "Content-Type": "application/json",
            "x-access-token": "token"
        };
        return $q(function (resolve, reject) {
            /*
            try {
                axios.post(server_url, data, { headers: headers }).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
                });
            } catch (e) {
                reject(e);
            }*/
            var a = [{
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'What contributed to this income prediction?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/LIME',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            },
            {
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'How can patient X reduce cancer risk?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/DisCERN',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            },
            {
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'What features contributed to predicting mortality Y for patient X?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/DeepSHAPLocal',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            },
            {
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'What features contributed to predicting mortality?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/DeepSHAPGlobal',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            }];

            resolve(a);
        });
    }

    async function SustituteSubTreeReuseService(data,usecaseId) {
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/substituteSubtree";
        var headers = {
            "Content-Type": "application/json",
            "x-access-token": "token"
        };
        return $q(function (resolve, reject) {
            /*
            try {
                axios.post(server_url, data, { headers: headers }).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
                });
            } catch (e) {
                reject(e);
            }*/
            var a = [{
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'What contributed to this income prediction?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/LIME',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            },
            {
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'How can patient X reduce cancer risk?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/DisCERN',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            },
            {
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'What features contributed to predicting mortality Y for patient X?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/DeepSHAPLocal',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            },
            {
                'version': '0.1.0',
                'scope': 'project',
                'selectedTree': '33def3ec-31a8-47c1-856c-7fd724718df2',
                'trees': [{
                    'version': '0.1.0',
                    'scope': 'tree',
                    'id': '33def3ec-31a8-47c1-856c-7fd724718df2',
                    'Instance': 'Explanation Experience',
                    'description': '',
                    'root': '546f5cee-68b0-4b90-85be-786b9957d03a',
                    'query': '[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]',
                    'idModel': 'ECG200LSTM',
                    'nodes': {
                        '546f5cee-68b0-4b90-85be-786b9957d03a': {
                            'id': '546f5cee-68b0-4b90-85be-786b9957d03a',
                            'Concept': 'Priority',
                            'Instance': 'Priority',
                            'description': '',
                            'display': { 'x': -60, 'y': 84 },
                            'firstChild': {
                                'Id': '5112868d-f790-4665-ab3e-18a36a857363',
                                'Next': null
                            }
                        },
                        '5112868d-f790-4665-ab3e-18a36a857363': {
                            'id': '5112868d-f790-4665-ab3e-18a36a857363',
                            'Concept': 'Sequence',
                            'Instance': 'Sequence',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -60, 'y': 168 },
                            'firstChild': {
                                'Id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                                'Next': { 'Id': '5829d6db-5011-4ad8-846a-ab8452c6be46', 'Next': null }
                            }
                        },
                        '85b9b22e-1b0a-4a9b-81a9-83952d27271a': {
                            'id': '85b9b22e-1b0a-4a9b-81a9-83952d27271a',
                            'Concept': 'User Question',
                            'Instance': 'User Question',
                            'description': '',
                            'properties': {},
                            'display': { 'x': -192, 'y': 324 },
                            'params': {
                                'Question': {
                                    'key': 'Question',
                                    'value': 'What features contributed to predicting mortality?'
                                }
                            }
                        },
                        '5829d6db-5011-4ad8-846a-ab8452c6be46': {
                            'id': '5829d6db-5011-4ad8-846a-ab8452c6be46',
                            'Concept': 'Explanation Method',
                            'Instance': '/Tabular/DeepSHAPGlobal',
                            'description': '',
                            'properties': {},
                            'display': { 'x': 60, 'y': 324 },
                            'params': {
                                'output_classes': {
                                    'key': 'output_classes',
                                    'value': '[ ]',
                                    'default': '[ ]',
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Array of integers representing the classes to be explained. Defaults to class 1.',
                                    'type': 'text'
                                },
                                'top_classes': {
                                    'key': 'top_classes',
                                    'value': 1,
                                    'default': 1,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                    'type': 'number'
                                },
                                'num_features': {
                                    'key': 'num_features',
                                    'value': 10,
                                    'default': 10,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Integer representing the maximum number of features to be included in the explanation.',
                                    'type': 'number'
                                },
                                'png_width': {
                                    'key': 'png_width',
                                    'value': 1000,
                                    'default': 1000,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Width (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                },
                                'png_height': {
                                    'key': 'png_height',
                                    'value': 400,
                                    'default': 400,
                                    'range': [null, null],
                                    'required': 'false',
                                    'description': 'Height (in pixels) of the png image containing the explanation.',
                                    'type': 'number'
                                }
                            }
                        }
                    },
                    'display': {
                        'camera_x': 821.0999999642372,
                        'camera_y': 332.69999998807907,
                        'camera_z': 1,
                        'x': -60,
                        'y': 0
                    }
                }],
                'custom_nodes': []
            }];

            resolve(a);
        });
    }


    async function GetApplicabilityExplanationService(usecaseId) {
        
        var server_url = "https://api-dev.isee4xai.com/api/cbr/" + usecaseId + "/applicability";
        var headers = {
            "Content-Type": "application/json",
            "x-access-token": "token"
        };
        return $q(function (resolve, reject) {
           /* 
           try {
                axios.post(server_url, { headers: headers }).then(function (response) {
                    resolve(response.data);
                }, function (err) {
                    resolve("Error in computer network communications");
                });
            } catch (e) {
                reject(e);
            }
            */
            var datos = {
                "/Tabular/LIME": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/LIME only supports Multivariate tabular data."
                },
                "/Images/Anchors": {
                    "flag": true,
                    "message": ""
                },
                "/Images/LIME": {
                    "flag": true,
                    "message": ""
                },
                "/Tabular/ALE": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/ALE only supports Multivariate tabular data."
                },
                "/Tabular/Anchors": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/Anchors only supports Multivariate tabular data."
                },
                "/Tabular/DicePrivate": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/DicePrivate only supports Multivariate tabular data."
                },
                "/Tabular/DicePublic": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/DicePublic only supports Multivariate tabular data."
                },
                "/Tabular/DisCERN": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/DisCERN only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/DisCERN only supports Sklearn implementations."
                },
                "/Tabular/Importance": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/Importance only supports Multivariate tabular data."
                },
                "/Tabular/DeepSHAPGlobal": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/DeepSHAPGlobal only supports Multivariate tabular data."
                },
                "/Tabular/DeepSHAPLocal": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/DeepSHAPLocal only supports Multivariate tabular data."
                },
                "/Tabular/KernelSHAPLocal": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/KernelSHAPLocal only supports Multivariate tabular data."
                },
                "/Tabular/KernelSHAPGlobal": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/KernelSHAPGlobal only supports Multivariate tabular data."
                },
                "/Tabular/TreeSHAPGlobal": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/TreeSHAPGlobal only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/TreeSHAPGlobal only supports LightGBM, Sklearn and XGBoost implementations.\n- AI Method Mismatch: The model is a Convolutional Neural Network and Recurrent Neural Network but /Tabular/TreeSHAPGlobal only supports Ensemble Method."
                },
                "/Tabular/TreeSHAPLocal": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/TreeSHAPLocal only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/TreeSHAPLocal only supports LightGBM, Sklearn and XGBoost implementations.\n- AI Method Mismatch: The model is a Convolutional Neural Network and Recurrent Neural Network but /Tabular/TreeSHAPLocal only supports Ensemble Method."
                },
                "/Tabular/NICE": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/NICE only supports Multivariate tabular data."
                },
                "/Text/LIME": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Text/LIME only supports Text data."
                },
                "/Images/IntegratedGradients": {
                    "flag": true,
                    "message": ""
                },
                "/Tabular/IREX": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/IREX only supports Multivariate tabular data."
                },
                "/Text/NLPClassifier": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Text/NLPClassifier only supports Text data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Text/NLPClassifier only supports Sklearn implementations."
                },
                "/Timeseries/CBRFox": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/CBRFox only supports Multivariate time series data.\n- AI Task Mismatch: /Timeseries/CBRFox does not support Binary Classification tasks."
                },
                "/Images/GradCam": {
                    "flag": true,
                    "message": ""
                },
                "/Images/NearestNeighbours": {
                    "flag": true,
                    "message": ""
                },
                "/Misc/AIModelPerformance": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Misc/AIModelPerformance only supports Multivariate tabular data."
                },
                "/Tabular/PertCF": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/PertCF only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/PertCF only supports Sklearn implementations."
                },
                "/Timeseries/iGenCBR": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/iGenCBR only supports Multivariate time series data.\n- AI Task Mismatch: /Timeseries/iGenCBR does not support Binary Classification tasks."
                },
                "/Timeseries/LEFTIST": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/LEFTIST only supports Univariate time series data."
                },
                "/Images/SSIMNearestNeighbours": {
                    "flag": true,
                    "message": ""
                },
                "/Images/SSIMCounterfactuals": {
                    "flag": true,
                    "message": ""
                },
                "/Tabular/ROC-AUC": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/ROC-AUC only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/ROC-AUC only supports Sklearn implementations."
                },
                "/Tabular/PR-AUC": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/PR-AUC only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/PR-AUC only supports Sklearn implementations."
                },
                "/Tabular/SHAPSummary": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/SHAPSummary only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/SHAPSummary only supports LightGBM, Sklearn and XGBoost implementations."
                },
                "/Tabular/PDP": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/PDP only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/PDP only supports Sklearn implementations."
                },
                "/Tabular/SHAPDependence": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/SHAPDependence only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/SHAPDependence only supports LightGBM, Sklearn and XGBoost implementations."
                },
                "/Tabular/SHAPInteraction": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/SHAPInteraction only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/SHAPInteraction only supports LightGBM, Sklearn and XGBoost implementations."
                },
                "/Timeseries/LIMESegment": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/LIMESegment only supports Univariate time series data."
                },
                "/Timeseries/NEVES": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/NEVES only supports Univariate time series data."
                },
                "/Timeseries/NearestNeighbours": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/NearestNeighbours only supports Univariate time series data."
                },
                "/Timeseries/NativeGuides": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/NativeGuides only supports Univariate time series data."
                },
                "/Images/ClassificationReport": {
                    "flag": true,
                    "message": ""
                },
                "/Images/ConfusionMatrix": {
                    "flag": true,
                    "message": ""
                },
                "/Tabular/LiftCurve": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/LiftCurve only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/LiftCurve only supports Sklearn implementations."
                },
                "/Tabular/PrecisionGraph": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/PrecisionGraph only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/PrecisionGraph only supports Sklearn implementations."
                },
                "/Tabular/CumulativePrecision": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/CumulativePrecision only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/CumulativePrecision only supports Sklearn implementations."
                },
                "/Tabular/RegressionPredictedVsActual": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/RegressionPredictedVsActual only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/RegressionPredictedVsActual only supports Sklearn implementations.\n- AI Task Mismatch: /Tabular/RegressionPredictedVsActual does not support Binary Classification tasks."
                },
                "/Tabular/RegressionResiduals": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/RegressionResiduals only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/RegressionResiduals only supports Sklearn implementations.\n- AI Task Mismatch: /Tabular/RegressionResiduals does not support Binary Classification tasks."
                },
                "/Tabular/ConfusionMatrix": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/ConfusionMatrix only supports Univariate time series data."
                },
                "/Tabular/SummaryMetrics": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/SummaryMetrics only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/SummaryMetrics only supports Sklearn implementations."
                },
                "/Tabular/ICE": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Tabular/ICE only supports Multivariate tabular data.\n- Implementation Mismatch: This is a TensorFlow 1 model but /Tabular/ICE only supports Sklearn implementations."
                },
                "/Timeseries/SummaryMetrics": {
                    "flag": false,
                    "message": "\n- Dataset Type Mismatch: The model uses Image data but /Timeseries/SummaryMetrics only supports Univariate time series data."
                }
            };
            resolve(datos);
        });
        
        
    }

}

