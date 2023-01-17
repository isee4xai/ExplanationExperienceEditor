/**
 * Default settings of the editor.
 *
 * @constant {Object} DEFAULT_SETTINGS
 * @memberOf b3e
 */

(function() {
    "use strict";

    var DEFAULT_SETTINGS = {
        // CAMERA
        zoom_initial: 1.0,
        zoom_min: 0.25,
        zoom_max: 2.0,
        zoom_step: 0.25,

        // EDITOR
        snap_x: 12,
        snap_y: 12,
        snap_offset_x: 0,
        snap_offset_y: 0,
        layout: 'vertical', // vertical
        max_history: 100,

        // COLORS
        background_color: '#f0f2f5',
        selection_color: '#FFFFFF',
        block_border_color: '#6D6D6D',
        block_symbol_color: '#333333',
        anchor_background_color: '#EFEFEF',

        connection_color: '#6D6D6D',
        root_color: '#FFFFFF',
        decorator_color: '#FFFFFF',
        composite_color: '#FFFFFF',
        tree_color: '#FFFFFF',
        action_color: '#94ccfc',
        condition_color: '#ff894f',

        // CONNECTION
        connection_width: 2,

        // ANCHOR
        anchor_border_width: 2,
        anchor_radius: 7,
        anchor_offset_x: 4,
        anchor_offset_y: 0,

        // BLOCK
        block_border_width: 2,
        block_root_width: 40,
        block_root_height: 40,
        block_tree_width: 160,
        block_tree_height: 40,
        block_composite_width: 40,
        block_composite_height: 40,
        block_decorator_width: 60,
        block_decorator_height: 60,
        block_action_width: 160,
        block_action_height: 40,
        block_condition_width: 160,
        block_condition_height: 40,

        //ADDRESS
        httpAddresModels: "https://modelhub-dev.isee4xai.com/",
        httpAddresExplanations: "https://explainers-dev.isee4xai.com/",
        httpAddresEvaluationsAndProject: "https://api-dev.isee4xai.com/api/trees/",

        /*
        httpAddresEvaluation: httpAddresEvaluationsAndProject + "Evaluation",
        httpAddresProjects: httpAddresEvaluationsAndProject + "Projects",
        httpAddresProjectsPath: httpAddresEvaluationsAndProject + "Projects?path=",

        //ADDRESS - Explanation
        AddresExplainers: httpAddresExplanations + "Explainers",

        //ADDRESS - Models
        AddresModels: httpAddresModels + "model_list",
        AddresQuery: httpAddresModels + "query"
        */
    };

    //ADDRESS - Evaluations And Project
    DEFAULT_SETTINGS.httpAddresEvaluation = DEFAULT_SETTINGS.httpAddresEvaluationsAndProject + "Evaluation";
    DEFAULT_SETTINGS.httpAddresProjects = DEFAULT_SETTINGS.httpAddresEvaluationsAndProject + "Projects";
    DEFAULT_SETTINGS.httpAddresProjectsPath = DEFAULT_SETTINGS.httpAddresEvaluationsAndProject + "Projects?path=";

    //ADDRESS - Explanation
    DEFAULT_SETTINGS.AddresExplainers = DEFAULT_SETTINGS.httpAddresExplanations + "Explainers";

    //ADDRESS - Models
    DEFAULT_SETTINGS.AddresModels = DEFAULT_SETTINGS.httpAddresModels + "model_list";
    DEFAULT_SETTINGS.AddresQuery = DEFAULT_SETTINGS.httpAddresModels + "query";

    b3e.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
})();
