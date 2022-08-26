/**
 * Default settings of the editor.
 *
 * @constant {Object} DEFAULT_ADDRESS
 * @memberOf b3e
 */

(function() {
    "use strict";

    var DEFAULT_ADDRESS = {
        // CAMERA
        httpAddres: "http://localhost:3000/",
        httpAddresExplanation: httpAddres + "Explanation",
        httpAddresEvaluation: httpAddres + "Evaluation",
        httpAddresProjects: httpAddres + "Projects",
        httpAddresProjectsPath: httpAddres + "Projects?path=",
        AddresExplanation: "http://192.168.1.145:5000/",
        AddresModels: "http://192.168.1.145:4000/model_list",
        AddresExplainerLibraries: "http://192.168.1.145:5000/",
        AddresExplainerLibrariesGetIngJason: "http://192.168.1.145:5000",
        AddresExplainers: "http://192.168.1.145:5000/Explainers",
        AddresQuery: "http://192.168.1.145:4000/query",
    };

    b3e.DEFAULT_ADDRESS = DEFAULT_ADDRESS;
})();