angular
    .module('app')
    .factory('storageService', storageService);

storageService.$inject = ['$state', '$q', 'localStorageService', 'fileStorageService', '$http'];

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


    function loadExplainers() {
        //We set the server URL, make sure it's the one in your machine.
        let server_url = AddresExplainers;
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


    function loadExplanationExp(method) {
        //We set the server URL, make sure it's the one in your machine.
        let server_url = AddresExplanation;

        //We set the method from which we want to take the params
        let method_url = method;


        return $q(function(resolve, reject) {
            try {
                axios.get(server_url + method_url).then(function(response) {
                    resolve(response.data.params);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    function loadModels() {
        //We set the server URL, make sure it's the one in your machine.
        let server_url = AddresModels;
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
        let server_url = AddresQuery;

        var data = new FormData();
        data.append('id', ModelId);

        if (Quey != "") {
            data.append('query', Quey);
        }
        if (Image != "") {
            data.append("image", Image.files[0]);
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
                        resolve(response.data);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    function GetQuery(Id, QueyId) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = AddresQuery;

        var url = server_url + "?query_id=" + QueyId + "&id=" + Id;

        console.log(url);

        return $q(function(resolve, reject) {
            try {
                axios.get(url, { responseType: "blob" })
                    .then(function(response) {

                        var reader = new window.FileReader();
                        reader.readAsDataURL(response.data);
                        reader.onload = function() {
                            var imageDataUrl = reader.result;
                            console.log(imageDataUrl);
                            var newStr = imageDataUrl.slice(23)
                            console.log(newStr);


                            resolve(imageDataUrl);
                            // imageElement.setAttribute("src", imageDataUrl);

                        }
                    });
            } catch (e) {
                reject(e);
            }
        });

        /*
        return $q(function(resolve, reject) {
            try {
                axios.get(url).then(function(response) {
                    console.log(response.status);
                    if (response.data.hasOwnProperty('query')) {
                        resolve(response.data);
                    } else {
                        console.log(JSON.stringify(response.data));

                        resolve(response.data);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });*/

    }


    function PostExplainers(Model, Params, Instance) {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = AddresExplainerLibrariesGetIngJason + Instance;

        console.log(Model);
        // var instanceCounterfactuals = 
        //var paramss = "[0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1,1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0,1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0,0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1]"

        var data = new FormData();
        data.append('id', Model.id);

        if (Model.hasOwnProperty('Query')) {
            data.append('instance', Model.Query);
        }
        data.append('params', Params);

        if (Model.hasOwnProperty('Img')) {
            data.append('image', Model.Img);
        }
        data.append('url', "");

        console.log(Model.id + "--" + Model.Query + "---" + Params);

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
                        console.log(response);
                        resolve(response.data);
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