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
        loadExplainersSubstitute: loadExplainersSubstitute, 
        GetQuery: GetQuery,
        PostExplainers: PostExplainers,
        PostExplainerNew:PostExplainerNew
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
                        .then((response) => response.json() );
                } else {
                    fetch(SettingsAddres.httpAddresProjects, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((response) =>  response.json() );
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

    function loadExplainersSubstitute() {
        //We set the server URL, make sure it's the one in your machine.
        var datos = [
            {
                "explainer": "/Images/Anchors",
                "/Images/Anchors": "1.0",
                "/Images/Counterfactuals": "0.928225806451613",
                "/Images/GradCam": "0.7710573476702511",
                "/Images/IntegratedGradients": "0.728046594982079",
                "/Images/LIME": "0.9296594982078855",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Images/Counterfactuals",
                "/Images/Anchors": "0.928225806451613",
                "/Images/Counterfactuals": "1.0",
                "/Images/GradCam": "0.6728494623655915",
                "/Images/IntegratedGradients": "0.678225806451613",
                "/Images/LIME": "0.928225806451613",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Images/GradCam",
                "/Images/Anchors": "0.7710573476702511",
                "/Images/Counterfactuals": "0.6728494623655915",
                "/Images/GradCam": "1.0",
                "/Images/IntegratedGradients": "0.7078853046594984",
                "/Images/LIME": "0.7710573476702511",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Images/IntegratedGradients",
                "/Images/Anchors": "0.728046594982079",
                "/Images/Counterfactuals": "0.678225806451613",
                "/Images/GradCam": "0.7078853046594984",
                "/Images/IntegratedGradients": "1.0",
                "/Images/LIME": "0.728046594982079",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Images/LIME",
                "/Images/Anchors": "0.9296594982078855",
                "/Images/Counterfactuals": "0.928225806451613",
                "/Images/GradCam": "0.7710573476702511",
                "/Images/IntegratedGradients": "0.728046594982079",
                "/Images/LIME": "1.0",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/ALE",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "1.0",
                "/Tabular/Anchors": "0.6043906810035843",
                "/Tabular/DeepSHAPGlobal": "0.742383512544803",
                "/Tabular/DeepSHAPLocal": "0.5595878136200718",
                "/Tabular/DicePrivate": "0.5969086021505378",
                "/Tabular/DicePublic": "0.5969086021505378",
                "/Tabular/DisCERN": "0.6076612903225809",
                "/Tabular/IREX": "0.7614247311827957",
                "/Tabular/Importance": "0.7584005376344087",
                "/Tabular/KernelSHAPGlobal": "0.8499103942652331",
                "/Tabular/KernelSHAPLocal": "0.6671146953405018",
                "/Tabular/LIME": "0.6219384707287934",
                "/Tabular/NICE": "0.6076612903225809",
                "/Tabular/TreeSHAPGlobal": "0.7418234767025091",
                "/Tabular/TreeSHAPLocal": "0.5590277777777779",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/Anchors",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.6043906810035843",
                "/Tabular/Anchors": "1.0",
                "/Tabular/DeepSHAPGlobal": "0.4476926523297492",
                "/Tabular/DeepSHAPLocal": "0.6304883512544804",
                "/Tabular/DicePrivate": "0.874462365591398",
                "/Tabular/DicePublic": "0.874462365591398",
                "/Tabular/DisCERN": "0.863709677419355",
                "/Tabular/IREX": "0.5808691756272403",
                "/Tabular/Importance": "0.6787634408602152",
                "/Tabular/KernelSHAPGlobal": "0.5444668458781363",
                "/Tabular/KernelSHAPLocal": "0.7272625448028676",
                "/Tabular/LIME": "0.7344552718040623",
                "/Tabular/NICE": "0.863709677419355",
                "/Tabular/TreeSHAPGlobal": "0.4471326164874552",
                "/Tabular/TreeSHAPLocal": "0.6299283154121865",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/DeepSHAPGlobal",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.742383512544803",
                "/Tabular/Anchors": "0.4476926523297492",
                "/Tabular/DeepSHAPGlobal": "1.0",
                "/Tabular/DeepSHAPLocal": "0.7449596774193549",
                "/Tabular/DicePrivate": "0.4402105734767026",
                "/Tabular/DicePublic": "0.39182347670250905",
                "/Tabular/DisCERN": "0.3326836917562725",
                "/Tabular/IREX": "0.7911066308243728",
                "/Tabular/Importance": "0.641465053763441",
                "/Tabular/KernelSHAPGlobal": "0.7495519713261649",
                "/Tabular/KernelSHAPLocal": "0.5667562724014338",
                "/Tabular/LIME": "0.5251642771804063",
                "/Tabular/NICE": "0.42945788530465956",
                "/Tabular/TreeSHAPGlobal": "0.7712595828355238",
                "/Tabular/TreeSHAPLocal": "0.5884638839107925",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/DeepSHAPLocal",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.5595878136200718",
                "/Tabular/Anchors": "0.6304883512544804",
                "/Tabular/DeepSHAPGlobal": "0.7449596774193549",
                "/Tabular/DeepSHAPLocal": "1.0",
                "/Tabular/DicePrivate": "0.6230062724014338",
                "/Tabular/DicePublic": "0.5746191756272402",
                "/Tabular/DisCERN": "0.5154793906810037",
                "/Tabular/IREX": "0.6083109318996417",
                "/Tabular/Importance": "0.67372311827957",
                "/Tabular/KernelSHAPGlobal": "0.5667562724014338",
                "/Tabular/KernelSHAPLocal": "0.7495519713261649",
                "/Tabular/LIME": "0.7079599761051375",
                "/Tabular/NICE": "0.6122535842293908",
                "/Tabular/TreeSHAPGlobal": "0.5884638839107925",
                "/Tabular/TreeSHAPLocal": "0.7712595828355238",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/DicePrivate",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.5969086021505378",
                "/Tabular/Anchors": "0.874462365591398",
                "/Tabular/DeepSHAPGlobal": "0.4402105734767026",
                "/Tabular/DeepSHAPLocal": "0.6230062724014338",
                "/Tabular/DicePrivate": "1.0",
                "/Tabular/DicePublic": "0.9045698924731184",
                "/Tabular/DisCERN": "0.8346774193548389",
                "/Tabular/IREX": "0.5733870967741936",
                "/Tabular/Importance": "0.6691308243727601",
                "/Tabular/KernelSHAPGlobal": "0.5369847670250897",
                "/Tabular/KernelSHAPLocal": "0.7197804659498209",
                "/Tabular/LIME": "0.7391203703703705",
                "/Tabular/NICE": "0.9314516129032259",
                "/Tabular/TreeSHAPGlobal": "0.3428763440860216",
                "/Tabular/TreeSHAPLocal": "0.5256720430107528",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/DicePublic",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.5969086021505378",
                "/Tabular/Anchors": "0.874462365591398",
                "/Tabular/DeepSHAPGlobal": "0.39182347670250905",
                "/Tabular/DeepSHAPLocal": "0.5746191756272402",
                "/Tabular/DicePrivate": "0.9045698924731184",
                "/Tabular/DicePublic": "1.0",
                "/Tabular/DisCERN": "0.8588709677419356",
                "/Tabular/IREX": "0.5733870967741936",
                "/Tabular/Importance": "0.6691308243727601",
                "/Tabular/KernelSHAPGlobal": "0.5369847670250897",
                "/Tabular/KernelSHAPLocal": "0.7197804659498209",
                "/Tabular/LIME": "0.7391203703703705",
                "/Tabular/NICE": "0.9314516129032259",
                "/Tabular/TreeSHAPGlobal": "0.3590053763440861",
                "/Tabular/TreeSHAPLocal": "0.5418010752688173",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/DisCERN",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.6076612903225809",
                "/Tabular/Anchors": "0.863709677419355",
                "/Tabular/DeepSHAPGlobal": "0.3326836917562725",
                "/Tabular/DeepSHAPLocal": "0.5154793906810037",
                "/Tabular/DicePrivate": "0.8346774193548389",
                "/Tabular/DicePublic": "0.8588709677419356",
                "/Tabular/DisCERN": "1.0",
                "/Tabular/IREX": "0.5841397849462368",
                "/Tabular/Importance": "0.6583781362007171",
                "/Tabular/KernelSHAPGlobal": "0.5369847670250897",
                "/Tabular/KernelSHAPLocal": "0.7197804659498209",
                "/Tabular/LIME": "0.7283676821983275",
                "/Tabular/NICE": "0.9422043010752689",
                "/Tabular/TreeSHAPGlobal": "0.3643817204301076",
                "/Tabular/TreeSHAPLocal": "0.5471774193548388",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/IREX",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.7614247311827957",
                "/Tabular/Anchors": "0.5808691756272403",
                "/Tabular/DeepSHAPGlobal": "0.7911066308243728",
                "/Tabular/DeepSHAPLocal": "0.6083109318996417",
                "/Tabular/DicePrivate": "0.5733870967741936",
                "/Tabular/DicePublic": "0.5733870967741936",
                "/Tabular/DisCERN": "0.5841397849462368",
                "/Tabular/IREX": "1.0",
                "/Tabular/Importance": "0.5920698924731184",
                "/Tabular/KernelSHAPGlobal": "0.6835797491039427",
                "/Tabular/KernelSHAPLocal": "0.5007840501792116",
                "/Tabular/LIME": "0.45560782556750307",
                "/Tabular/NICE": "0.5841397849462368",
                "/Tabular/TreeSHAPGlobal": "0.790546594982079",
                "/Tabular/TreeSHAPLocal": "0.6077508960573478",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/Importance",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.7584005376344087",
                "/Tabular/Anchors": "0.6787634408602152",
                "/Tabular/DeepSHAPGlobal": "0.641465053763441",
                "/Tabular/DeepSHAPLocal": "0.67372311827957",
                "/Tabular/DicePrivate": "0.6691308243727601",
                "/Tabular/DicePublic": "0.6691308243727601",
                "/Tabular/DisCERN": "0.6583781362007171",
                "/Tabular/IREX": "0.5920698924731184",
                "/Tabular/Importance": "1.0",
                "/Tabular/KernelSHAPGlobal": "0.7584005376344087",
                "/Tabular/KernelSHAPLocal": "0.7906586021505377",
                "/Tabular/LIME": "0.7358870967741936",
                "/Tabular/NICE": "0.6583781362007171",
                "/Tabular/TreeSHAPGlobal": "0.641465053763441",
                "/Tabular/TreeSHAPLocal": "0.67372311827957",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/KernelSHAPGlobal",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.8499103942652331",
                "/Tabular/Anchors": "0.5444668458781363",
                "/Tabular/DeepSHAPGlobal": "0.7495519713261649",
                "/Tabular/DeepSHAPLocal": "0.5667562724014338",
                "/Tabular/DicePrivate": "0.5369847670250897",
                "/Tabular/DicePublic": "0.5369847670250897",
                "/Tabular/DisCERN": "0.5369847670250897",
                "/Tabular/IREX": "0.6835797491039427",
                "/Tabular/Importance": "0.7584005376344087",
                "/Tabular/KernelSHAPGlobal": "1.0",
                "/Tabular/KernelSHAPLocal": "0.7449596774193549",
                "/Tabular/LIME": "0.6219384707287934",
                "/Tabular/NICE": "0.5369847670250897",
                "/Tabular/TreeSHAPGlobal": "0.7497542064914378",
                "/Tabular/TreeSHAPLocal": "0.5669585075667065",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/KernelSHAPLocal",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.6671146953405018",
                "/Tabular/Anchors": "0.7272625448028676",
                "/Tabular/DeepSHAPGlobal": "0.5667562724014338",
                "/Tabular/DeepSHAPLocal": "0.7495519713261649",
                "/Tabular/DicePrivate": "0.7197804659498209",
                "/Tabular/DicePublic": "0.7197804659498209",
                "/Tabular/DisCERN": "0.7197804659498209",
                "/Tabular/IREX": "0.5007840501792116",
                "/Tabular/Importance": "0.7906586021505377",
                "/Tabular/KernelSHAPGlobal": "0.7449596774193549",
                "/Tabular/KernelSHAPLocal": "1.0",
                "/Tabular/LIME": "0.8047341696535246",
                "/Tabular/NICE": "0.7197804659498209",
                "/Tabular/TreeSHAPGlobal": "0.5669585075667065",
                "/Tabular/TreeSHAPLocal": "0.7497542064914378",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/LIME",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.6219384707287934",
                "/Tabular/Anchors": "0.7344552718040623",
                "/Tabular/DeepSHAPGlobal": "0.5251642771804063",
                "/Tabular/DeepSHAPLocal": "0.7079599761051375",
                "/Tabular/DicePrivate": "0.7391203703703705",
                "/Tabular/DicePublic": "0.7391203703703705",
                "/Tabular/DisCERN": "0.7283676821983275",
                "/Tabular/IREX": "0.45560782556750307",
                "/Tabular/Importance": "0.7358870967741936",
                "/Tabular/KernelSHAPGlobal": "0.6219384707287934",
                "/Tabular/KernelSHAPLocal": "0.8047341696535246",
                "/Tabular/LIME": "1.0",
                "/Tabular/NICE": "0.7283676821983275",
                "/Tabular/TreeSHAPGlobal": "0.522187311803141",
                "/Tabular/TreeSHAPLocal": "0.7049830107278723",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/NICE",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.6076612903225809",
                "/Tabular/Anchors": "0.863709677419355",
                "/Tabular/DeepSHAPGlobal": "0.42945788530465956",
                "/Tabular/DeepSHAPLocal": "0.6122535842293908",
                "/Tabular/DicePrivate": "0.9314516129032259",
                "/Tabular/DicePublic": "0.9314516129032259",
                "/Tabular/DisCERN": "0.9422043010752689",
                "/Tabular/IREX": "0.5841397849462368",
                "/Tabular/Importance": "0.6583781362007171",
                "/Tabular/KernelSHAPGlobal": "0.5369847670250897",
                "/Tabular/KernelSHAPLocal": "0.7197804659498209",
                "/Tabular/LIME": "0.7283676821983275",
                "/Tabular/NICE": "1.0",
                "/Tabular/TreeSHAPGlobal": "0.42889784946236564",
                "/Tabular/TreeSHAPLocal": "0.6116935483870969",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/TreeSHAPGlobal",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.7418234767025091",
                "/Tabular/Anchors": "0.4471326164874552",
                "/Tabular/DeepSHAPGlobal": "0.7712595828355238",
                "/Tabular/DeepSHAPLocal": "0.5884638839107925",
                "/Tabular/DicePrivate": "0.3428763440860216",
                "/Tabular/DicePublic": "0.3590053763440861",
                "/Tabular/DisCERN": "0.3643817204301076",
                "/Tabular/IREX": "0.790546594982079",
                "/Tabular/Importance": "0.641465053763441",
                "/Tabular/KernelSHAPGlobal": "0.7497542064914378",
                "/Tabular/KernelSHAPLocal": "0.5669585075667065",
                "/Tabular/LIME": "0.522187311803141",
                "/Tabular/NICE": "0.42889784946236564",
                "/Tabular/TreeSHAPGlobal": "1.0",
                "/Tabular/TreeSHAPLocal": "0.7668010752688172",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Tabular/TreeSHAPLocal",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.5590277777777779",
                "/Tabular/Anchors": "0.6299283154121865",
                "/Tabular/DeepSHAPGlobal": "0.5884638839107925",
                "/Tabular/DeepSHAPLocal": "0.7712595828355238",
                "/Tabular/DicePrivate": "0.5256720430107528",
                "/Tabular/DicePublic": "0.5418010752688173",
                "/Tabular/DisCERN": "0.5471774193548388",
                "/Tabular/IREX": "0.6077508960573478",
                "/Tabular/Importance": "0.67372311827957",
                "/Tabular/KernelSHAPGlobal": "0.5669585075667065",
                "/Tabular/KernelSHAPLocal": "0.7497542064914378",
                "/Tabular/LIME": "0.7049830107278723",
                "/Tabular/NICE": "0.6116935483870969",
                "/Tabular/TreeSHAPGlobal": "0.7668010752688172",
                "/Tabular/TreeSHAPLocal": "1.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Text/LIME",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "1.0",
                "/Text/NLPClassifier": "0.662696012544803",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Text/NLPClassifier",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.662696012544803",
                "/Text/NLPClassifier": "1.0",
                "/Timeseries/CBRFox": "0.0"
            },
            {
                "explainer": "/Timeseries/CBRFox",
                "/Images/Anchors": "0.0",
                "/Images/Counterfactuals": "0.0",
                "/Images/GradCam": "0.0",
                "/Images/IntegratedGradients": "0.0",
                "/Images/LIME": "0.0",
                "/Tabular/ALE": "0.0",
                "/Tabular/Anchors": "0.0",
                "/Tabular/DeepSHAPGlobal": "0.0",
                "/Tabular/DeepSHAPLocal": "0.0",
                "/Tabular/DicePrivate": "0.0",
                "/Tabular/DicePublic": "0.0",
                "/Tabular/DisCERN": "0.0",
                "/Tabular/IREX": "0.0",
                "/Tabular/Importance": "0.0",
                "/Tabular/KernelSHAPGlobal": "0.0",
                "/Tabular/KernelSHAPLocal": "0.0",
                "/Tabular/LIME": "0.0",
                "/Tabular/NICE": "0.0",
                "/Tabular/TreeSHAPGlobal": "0.0",
                "/Tabular/TreeSHAPLocal": "0.0",
                "/Text/LIME": "0.0",
                "/Text/NLPClassifier": "0.0",
                "/Timeseries/CBRFox": "1.0"
            }
        ]
        return datos;
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
    }

    async function loadModels() {
        //We set the server URL, make sure it's the one in your machine.
        var server_url = SettingsAddres.AddresModels;

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

    function PostExplainerNew(Json,ExplainerSelect) {
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

        return $q(function(resolve, reject) {
            try {
                axios(config)
                    .then(function(response) {
                        console.log(response);
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

