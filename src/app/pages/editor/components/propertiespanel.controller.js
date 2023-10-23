(function () {
    'use strict';

    angular
        .module('app')
        .controller('PropertiespanelController', PropertiespanelController);

    PropertiespanelController.$inject = [
        '$scope',
        '$window',
        '$location',
        'dialogService',
        'notificationService',
        'projectModel',
        'ProperParams',
        '$state',
        '$timeout',
        '$compile'
    ];

    function PropertiespanelController($scope,
        $window,
        $location,
        dialogService,
        notificationService,
        projectModel,
        ProperParams,
        $state,
        $timeout,
        $compile) {
        var vm = this;
        vm.original = null;
        vm.block = null;
        vm.update = update;
        vm.keydown = keydown;
        vm.CSVData = null;

        vm.UpdateProperties = UpdateProperties;
        vm.renameIntends = renameIntends;
        vm.change = change;
        vm.PopUpImg = PopUpImg;
        vm.PopUpHtml = PopUpHtml;
        vm.PopUpImgClose = PopUpImgClose;
        vm.GetInfoParam = GetInfoParam;
        vm.RunBt = RunBt;
        vm.LoadImagen = LoadImagen;
        vm.LoadHtmlCode = LoadHtmlCode;
        vm.loadModel = loadModel;
        //vm.helpClose = helpClose;
        //call Json
        vm.RunNew = RunNew;
        vm.isBase64Image = isBase64Image;
        vm.esJSONValido = esJSONValido;
        // substitute
        vm.FormSubstitute = FormSubstitute;
        vm.SubstituteNodes = SubstituteNodes;
        vm.SubstituteOneNode = SubstituteOneNode;
        vm.getChildExplanations = getChildExplanations
        vm.hasChildren = hasChildren;
        vm.toggleContent = toggleContent;
        vm.submitFormSub = submitFormSub;
        vm.CambiarOptionTree = CambiarOptionTree;
        vm.AllExplainerProperties = AllExplainerProperties;
        vm.updateNodeSub = updateNodeSub;
        vm.AllExplainerSubstitute = null;

        vm.explainerAccordionOpen = false
        vm.ExplainerConcurrentnessAccordionOpen = false
        vm.ExplainerScopeAccordionOpen = false
        vm.ComputationalComplexityAccordionOpen = false
        vm.ImplementationFrameworksAccordionOpen = false
        //vm.isAccordionEnabled = false;
        vm.isAccordionEnabled = false;

        vm.node = null;
        vm.explanation = null;
        vm.evaluation = null;
        vm.Explainers = null;
        vm.ExplainersSubstituteAll = null;
        vm.ExplainersSubstitute = [];

        vm.GetInfoParamSubstitute = GetInfoParamSubstitute;

        vm.TitleSelect = null;
        vm.TitleName = null;

        vm.AllProperties = [];

        vm.TypeOfData = ["Integer", "Boolean"];
        vm.DataType = "Datatype";
        vm.AllCondition = [];
        vm.SelectTypeOfData = SelectTypeOfData;

        vm.ArrayParams = [];
        vm.JsonParams = {};
        vm.IdModel = {};
        vm.jsonData = {};


        vm.datatooltipParam = "";
        vm.Json = {};

        vm.lastItem = 0;
        vm.Primero;
        vm.RunBtString = [];

        vm.idModelUrl = "";
        vm.SelectModel = SelectModel;
        vm.GetModels = GetModels;
        vm.GetModelsPublic = GetModelsPublic;
        vm.models = [];
        vm.keyModel = "";
        vm.IdQuery = "";

        var timeoutPromise = null;
        vm.startTimeout = startTimeout;
        vm.cancelTimeout = cancelTimeout;
        vm.dataSubstitute = "";

        vm.mostrarTexto = mostrarTexto;
        vm.LookDescriptionExplanation = LookDescriptionExplanation;

        vm.filterSubitemClick = filterSubitemClick;

        /*
    vm.ExplanationTypeSub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Feature_Influence_Explanation",
            "label": "Feature Influence Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Anchor_Explanation",
                    "label": "Anchor Explanation",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Influence_Explanation",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Contrasting_Feature_Importance_Explanation",
                    "label": "Contrasting Feature Importance Explanation",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Influence_Explanation",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Contribution_Distribution_Explanation",
                    "label": "Contribution Distribution Explanation",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Influence_Explanation",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Saliency_Map",
                    "label": "Saliency Map",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Influence_Explanation",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Sensitivity_Map",
                    "label": "Sensitivity Map",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Influence_Explanation",
                    "children": []
                }
            ]
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Neighbourhood_Explanation",
            "label": "Neighbourhood Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Prototype_Explanation",
            "label": "Prototype Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Semi-factual_Explanation",
            "label": "Semi-factual Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#CaseBasedExplanation",
            "label": "Case Based Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#ContextualExplanation",
            "label": "Contextual Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Introspective_Explanation",
                    "label": "Introspective Explanation",
                    "parent": "https://purl.org/heals/eo#ContextualExplanation",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Rationalisation_Explanation",
                    "label": "Rationalisation Explanation",
                    "parent": "https://purl.org/heals/eo#ContextualExplanation",
                    "children": []
                }
            ]
        },
        {
            "key": "https://purl.org/heals/eo#CounterfactualExplanation",
            "label": "Counterfactual Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#DataExplanation",
            "label": "Data Explanation",
            "parent": "https://purl.org/heals/eo#SafetyAndPerformanceExplanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#EverydayExplanation",
            "label": "Everyday Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "https://purl.org/heals/eo#ClinicalPearl",
                    "label": "Clinical Pearls",
                    "parent": "https://purl.org/heals/eo#EverydayExplanation",
                    "children": []
                }
            ]
        },
        {
            "key": "https://purl.org/heals/eo#ImpactExplanation",
            "label": "Impact Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "https://purl.org/heals/eo#FairnessExplanation",
                    "label": "Fairness Explanation",
                    "parent": "https://purl.org/heals/eo#SafetyAndPerformanceExplanation",
                    "children": []
                }
            ]
        },
        {
            "key": "https://purl.org/heals/eo#RationaleExplanation",
            "label": "Rationale Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "https://purl.org/heals/eo#TraceBasedExplanation",
                    "label": "Trace Based Explanation",
                    "parent": "https://purl.org/heals/eo#RationaleExplanation",
                    "children": []
                }
            ]
        },
        {
            "key": "https://purl.org/heals/eo#ResponsibilityExplanation",
            "label": "Responsibility Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#SafetyAndPerformanceExplanation",
            "label": "Safety and Performance Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "https://purl.org/heals/eo#DataExplanation",
                    "label": "Data Explanation",
                    "parent": "https://purl.org/heals/eo#SafetyAndPerformanceExplanation",
                    "children": []
                },
                {
                    "key": "https://purl.org/heals/eo#FairnessExplanation",
                    "label": "Fairness Explanation",
                    "parent": "https://purl.org/heals/eo#SafetyAndPerformanceExplanation",
                    "children": []
                }
            ]
        },
        {
            "key": "https://purl.org/heals/eo#SimulationBasedExplanation",
            "label": "Simulation Based Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#StatisticalExplanation",
            "label": "Statistical Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": []
        },
        {
            "key": "https://purl.org/heals/eo#scientificExplanation",
            "label": "Scientific Explanation",
            "parent": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
            "children": [
                {
                    "key": "https://purl.org/heals/eo#Evidence_Based_Explanation",
                    "label": "Evidence Based Explanation",
                    "parent": "https://purl.org/heals/eo#scientificExplanation",
                    "children": []
                },
                {
                    "key": "https://purl.org/heals/eo#Mechanistic_Explanation",
                    "label": "Mechanistic Explanation",
                    "parent": "https://purl.org/heals/eo#scientificExplanation",
                    "children": []
                }
            ]
        }

    ];
    vm.ExplainabilityTechniqueSub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Activation_Clusters",
            "label": "Activation Clusters",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Architecture_Modification",
            "label": "Architecture Modification",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Attention_Network",
                    "label": "Attention Network",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Architecture_Modification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Layer_Modification",
                    "label": "Layer Modification",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Architecture_Modification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Loss_Modification",
                    "label": "Loss Modification",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Architecture_Modification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Model_Combination",
                    "label": "Model Combination",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Architecture_Modification",
                    "children": []
                }
            ]
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Composite",
            "label": "Composite",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Data-driven",
            "label": "Data-driven",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Caption_Generation",
                    "label": "Caption Generation",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Data-driven",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#DisCERN",
                    "label": "DisCERN",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Data-driven",
                    "children": []
                }
            ]
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Feature_Relevance",
            "label": "Feature Relevance",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Game_Theory_Technique",
                    "label": "Game Theory Technique",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Relevance",
                    "children": [
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#SHAP",
                            "label": "SHAP",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Game_Theory_Technique",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Gradient-based_Technique",
                    "label": "Gradient-based Technique",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Relevance",
                    "children": [
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#Contrasting_Gradient_Technique",
                            "label": "Contrasting Gradient Technique",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Gradient-based_Technique",
                            "children": []
                        },
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#DeepLIFT",
                            "label": "DeepLIFT",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Gradient-based_Technique",
                            "children": []
                        },
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#GradCam_Technique",
                            "label": "GradCam Technique",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Gradient-based_Technique",
                            "children": []
                        },
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#Integrated_Gradient_Technique",
                            "label": "Integrated Gradient Technique",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Gradient-based_Technique",
                            "children": []
                        },
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#SmoothGrad_Technique",
                            "label": "SmoothGrad Technique",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Gradient-based_Technique",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Influence_Function",
                    "label": "Influence Function",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Relevance",
                    "children": [
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#ALE",
                            "label": "ALE",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Influence_Function",
                            "children": []
                        },
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#Individual_Condition_Expectation_Plot",
                            "label": "Individual Condition Expectation Plot",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Influence_Function",
                            "children": []
                        },
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#Partial_Dependence_Plot",
                            "label": "Partial Dependence Plot",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Influence_Function",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Saliency",
                    "label": "Saliency",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Feature_Relevance",
                    "children": [
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#Hidden-layer_Clustering",
                            "label": "Hidden-layer Clustering",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#Saliency",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Filter",
            "label": "Filter",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Knowledge_Extraction",
            "label": "Knowledge Extraction",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Optimisation_Based",
            "label": "Optimisation Based",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#DiCE",
                    "label": "DiCE",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Optimisation_Based",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Wachter",
                    "label": "Wachter",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Optimisation_Based",
                    "children": []
                }
            ]
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Probabilistic",
            "label": "Probabilistic",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": []
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
            "label": "Simplification",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplicationByWeightsDropout",
                    "label": "Simplication By Weights Dropout",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByDecisionTree",
                    "label": "Simplification By Decision Tree",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByForests",
                    "label": "Simplification By Forests",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByLinear_Proxy_Model",
                    "label": "Simplification By Linear Proxy Model",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": []
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByLinear_Regression",
                    "label": "Simplification By Linear Regression",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": [
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#LIME",
                            "label": "LIME",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByLinear_Regression",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByRule_Extraction",
                    "label": "Simplification By Rule Extraction",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": [
                        {
                            "key": "http://www.w3id.org/iSeeOnto/explainer#Anchor",
                            "label": "Anchor",
                            "parent": "http://www.w3id.org/iSeeOnto/explainer#SimplificationByRule_Extraction",
                            "children": []
                        }
                    ]
                },
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#SimplificationBykNN",
                    "label": "Simplification By kNN",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Simplification",
                    "children": []
                }
            ]
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Statistics",
            "label": "Statistics",
            "parent": "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique",
            "children": [
                {
                    "key": "http://www.w3id.org/iSeeOnto/explainer#Conditional_Plots",
                    "label": "Conditional Plots",
                    "parent": "http://www.w3id.org/iSeeOnto/explainer#Statistics",
                    "children": []
                }
            ]
        }
    ];
    vm.ExplainerConcurrentnessSub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#ante-hoc",
            "label": "Ante-hoc"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#post-hoc",
            "label": "Post-hoc"
        }
    ];
    vm.ExplanationScopeSub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#cohort",
            "label": "Cohort"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#global",
            "label": "Global"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#local",
            "label": "Local"
        }
    ];
    vm.ComputationalComplexitySub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Constant_time",
            "label": "Constant time"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Exponential_time",
            "label": "Exponential time"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Factorial_time",
            "label": "Factorial time"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Linearithmic_time",
            "label": "Linearithmic time"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Log-logarithmic_time",
            "label": "Log-logarithmic time"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Logarithmic_time",
            "label": "Logarithmic time"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Quadratic_time",
            "label": "Quadratic time"
        }
    ];
    vm.ImplementationFrameworkSub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Any",
            "label": "Any"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#LightGBM",
            "label": "LightGBM"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#PyTorch",
            "label": "PyTorch"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#Sklearn",
            "label": "Sklearn"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#TensorFlow1",
            "label": "TensorFlow 1"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#TensorFlow2",
            "label": "TensorFlow 2"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#XGBoost",
            "label": "XGBoost"
        }
    ];
    vm.PresentationformatSub = [
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#text",
            "label": "Text"
        },
        {
            "key": 'http://www.w3id.org/iSeeOnto/explainer#multivariate',
            "label": "multivariate"
        },
        {
            "key": "http://www.w3id.org/iSeeOnto/explainer#image",
            "label": "Image"
        }
    ];  */
        vm.ExplainersSub = [
            "/Images/Anchors",
            "/Images/GradCam",
            "/Images/IntegratedGradients",
            "/Images/LIME",
            "/Images/NearestNeighbours",
            "/Tabular/ALE",
            "/Tabular/Anchors",
            "/Tabular/ConfusionMatrix",
            "/Tabular/CumulativePrecision",
            "/Tabular/DeepSHAPGlobal",
            "/Tabular/DeepSHAPLocal",
            "/Tabular/DicePrivate",
            "/Tabular/DicePublic",
            "/Tabular/DisCERN",
            "/Tabular/IREX",
            "/Tabular/Importance",
            "/Tabular/KernelSHAPGlobal",
            "/Tabular/KernelSHAPLocal",
            "/Tabular/LiftCurve",
            "/Tabular/LIME",
            "/Tabular/NICE",
            "/Tabular/PrecisionGraph",
            "/Tabular/PR-AUC",
            "/Tabular/RegressionPredictedVsActual",
            "/Tabular/RegressionResiduals",
            "/Tabular/ROC-AUC",
            "/Tabular/SHAPDependence",
            "/Tabular/SHAPInteraction",
            "/Tabular/SHAPSummary",
            "/Tabular/SummaryMetrics",
            "/Tabular/TreeSHAPGlobal",
            "/Tabular/TreeSHAPLocal",
            "/Text/LIME",
            "/Text/NLPClassifier",
            "/Timeseries/CBRFox",
            "/Timeseries/iGenCBR",
            "/Misc/AIModelPerformance"
        ]


        vm.ExplanationTypeSub = null;
        vm.ExplainabilityTechniqueSub = null;
        vm.ExplainerConcurrentnessSub = null;
        vm.ExplanationScopeSub = null;
        vm.ComputationalComplexitySub = null;
        vm.ImplementationFrameworkSub = null;
        vm.PresentationformatSub = null;
        //  vm.ExplainersSub = null;


        vm.convertToObjects = function () {
            if (vm.ExplainersSub[0].hasOwnProperty("checked")) {
                return vm.ExplainersSub;
            } else {
                var objects = [];
                for (var i = 0; i < vm.ExplainersSub.length; i++) {
                    var item = vm.ExplainersSub[i];
                    var object = {
                        checked: false,
                        name: item
                    };
                    objects.push(object);
                }
                return objects;
            }
        };

        vm.hasChildren = function (item) {
            return item.children && item.children.length > 0;
        };

        vm.toggleItem = function (item, $event) {
            item.expanded = !item.expanded;
            if ($event) {
                $event.stopPropagation();
            }
        };


        vm.toggleItemSelection = function (listSub, item) {
            switch (listSub) {
                case 'Explanation Type':
                    if (item.children.length != []) {
                        //selecionamos todos los hijos del item selecionado 
                        vm.checkDescendants(item);
                    }
                    //comprobamos si tiene padre el item selecionado
                    var elementoEncontrado = vm.buscarPorKey(vm.ExplanationTypeSub, item.parent);

                    //primero comprobamos si el elemento selecionado es hijo del primer padre 
                    if (item.parent == "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation") {
                        //buscamos si existe el elemento selecionado para saber si borrarlo o añadirlo
                        var index = vm.ExplanationTypeSubSelect.findIndex(function (element) {
                            return element.key === item.key && element.label === item.label;
                        });

                        if (index == -1 && item.checked === true) {
                            //para elimiar dulicados
                            vm.ExplanationTypeSubSelect = vm.ExplanationTypeSubSelect.filter(function (element) {
                                return element.parent !== item.key;
                            });
                            // insertamos el elemento selecionado 
                            vm.ExplanationTypeSubSelect.push(item);
                        } else {
                            vm.ExplanationTypeSubSelect.splice(index, 1);
                        }
                    } else if (elementoEncontrado !== null) {
                        //comprobamos si el padre del elemento selecionado tiene todos sus hijos en true o false
                        var hasCheckedTrue = elementoEncontrado.children.some(function (obj) {
                            return obj.checked === false || !obj.hasOwnProperty('checked');
                        });
                        //true si algun hijo no esta checked(false)
                        if (hasCheckedTrue == true) {
                            var index3 = vm.ExplanationTypeSubSelect.findIndex(function (element) {
                                return element.key === elementoEncontrado.key;
                            });
                            if (index3 != -1) {
                                var foundItem = vm.ExplanationTypeSub.find(function (item) {
                                    return item.key === elementoEncontrado.key;
                                });
                                if (foundItem) {
                                    foundItem.checked = false;
                                }

                                vm.ExplanationTypeSubSelect.splice(index3, 1);

                                elementoEncontrado.children.forEach(element => {
                                    if (element.checked == true) {
                                        vm.ExplanationTypeSubSelect.push(element);
                                    }
                                });
                            } else {
                                var index2 = vm.ExplanationTypeSubSelect.findIndex(function (element) {
                                    return element.key === item.key;
                                });

                                if (index2 == -1) {
                                    vm.ExplanationTypeSubSelect.push(item);
                                } else {
                                    vm.ExplanationTypeSubSelect.splice(index2, 1);
                                }
                            }

                        } else {
                            var array = vm.ExplanationTypeSubSelect.filter(function (obj) {
                                return obj.parent !== elementoEncontrado.key;
                            });
                            array.push(elementoEncontrado);
                            elementoEncontrado.checked = true;
                            vm.ExplanationTypeSubSelect = array;
                        }
                    }
                    break;
                case 'Explainability Technique':

                    if (item.children.length != []) {
                        vm.checkDescendants(item);
                    }

                    var elementoEncontrado = vm.buscarPorKey(vm.ExplainabilityTechniqueSub, item.parent);

                    if (item.parent == "http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique") {
                        var index = vm.ExplainabilityTechniqueSubSelect.findIndex(function (element) {
                            return element.key === item.key && element.label === item.label;
                        });

                        if (index == -1 && item.checked === true) {
                            vm.ExplainabilityTechniqueSubSelect = vm.ExplainabilityTechniqueSubSelect.filter(function (element) {
                                return element.parent !== item.key;
                            });

                            vm.ExplainabilityTechniqueSubSelect.push(item);
                        } else {
                            vm.ExplainabilityTechniqueSubSelect.splice(index, 1);
                        }
                    } else if (elementoEncontrado !== null) {

                        var hasCheckedTrue = elementoEncontrado.children.some(function (obj) {
                            return obj.checked === false || !obj.hasOwnProperty('checked');
                        });

                        if (hasCheckedTrue == true) {
                            var index3 = vm.ExplainabilityTechniqueSubSelect.findIndex(function (element) {
                                return element.key === elementoEncontrado.key;
                            });

                            if (index3 != -1) {
                                var foundItem = vm.ExplanationTypeSub.find(function (item) {
                                    return item.key === elementoEncontrado.key;
                                });
                                if (foundItem) {
                                    foundItem.checked = false;
                                }
                                vm.ExplainabilityTechniqueSubSelect.splice(index3, 1);

                                elementoEncontrado.children.forEach(element => {
                                    if (element.checked == true) {
                                        vm.ExplainabilityTechniqueSubSelect.push(element);
                                    }
                                });
                            } else {
                                var index2 = vm.ExplainabilityTechniqueSubSelect.findIndex(function (element) {
                                    return element.key === item.key;
                                });

                                if (index2 == -1) {
                                    vm.ExplainabilityTechniqueSubSelect.push(item);
                                } else {
                                    vm.ExplainabilityTechniqueSubSelect.splice(index2, 1);
                                }
                            }
                        } else {
                            var array = vm.ExplainabilityTechniqueSubSelect.filter(function (obj) {
                                return obj.parent !== elementoEncontrado.key;
                            });
                            array.push(elementoEncontrado);
                            elementoEncontrado.checked = true;
                            vm.ExplainabilityTechniqueSubSelect = array;
                        }
                    }
                    break;
                case 'Explainer Concurrentnes':
                    var index = vm.ExplainerConcurrentnessSubSelect.findIndex(function (element) {
                        return element.key === item.key && element.label === item.label;
                    });

                    if (index == -1) {
                        vm.ExplainerConcurrentnessSubSelect.push(item);
                    } else {
                        vm.ExplainerConcurrentnessSubSelect.splice(index, 1);
                    }
                    break;
                case 'Explanation Scope':
                    var index = vm.ExplanationScopeSubSelect.findIndex(function (element) {
                        return element.key === item.key && element.label === item.label;
                    });

                    if (index == -1) {
                        vm.ExplanationScopeSubSelect.push(item);
                    } else {
                        vm.ExplanationScopeSubSelect.splice(index, 1);
                    }
                    break;
                case 'Computational Complexity':
                    var index = vm.ComputationalComplexitySubSelect.findIndex(function (element) {
                        return element.key === item.key && element.label === item.label;
                    });

                    if (index == -1) {
                        vm.ComputationalComplexitySubSelect.push(item);
                    } else {
                        vm.ComputationalComplexitySubSelect.splice(index, 1);
                    }
                    break;
                case 'Implementation Framework':
                    var index = vm.ImplementationFrameworkSubSelect.findIndex(function (element) {
                        return element.key === item.key && element.label === item.label;
                    });

                    if (index == -1) {
                        vm.ImplementationFrameworkSubSelect.push(item);
                    } else {
                        vm.ImplementationFrameworkSubSelect.splice(index, 1);
                    }

                    break;
                case 'Explainer':
                    var index = vm.ExplainersSubSelect.findIndex(function (element) {
                        return element === item;
                    });

                    if (index == -1) {
                        vm.ExplainersSubSelect.push(item);
                    } else {
                        vm.ExplainersSubSelect.splice(index, 1);
                    }

                    break;
                case 'Presentation format':
                    var index = vm.PresentationFormat.findIndex(function (element) {
                        return element.key === item.key && element.label === item.label;
                    });

                    if (index == -1) {
                        vm.PresentationFormat.push(item);
                    } else {
                        vm.PresentationFormat.splice(index, 1);
                    }
                    break;
            }
        };

        vm.checkDescendants = function (item) {
            if (item.children && item.children.length > 0) {
                for (var i = 0; i < item.children.length; i++) {
                    item.children[i].checked = item.checked;
                    this.checkDescendants(item.children[i]);
                }
            }
        };

        vm.verificarChecked = function (elemento) {
            for (var i = 0; i < elemento.children.length; i++) {
                if (!this.verificarChecked(elemento.children[i])) {
                    return false;
                }
            }
            return true;
        };

        vm.buscarPorKey = function (elementos, keyABuscar) {
            for (var i = 0; i < elementos.length; i++) {
                if (elementos[i].key === keyABuscar) {
                    return elementos[i];
                }

                if (elementos[i].children && elementos[i].children.length > 0) {
                    var elementoEncontrado = this.buscarPorKey(elementos[i].children, keyABuscar);
                    if (elementoEncontrado !== null) {
                        return elementoEncontrado;
                    }
                }
            }

            return null;
        };

        vm.toggle = function (item) {
            if (item.children.length > 0) {
                item.expanded = !item.expanded;
                if (item.expanded) {
                    item.collapsed = false;
                } else {
                    item.collapsed = true;
                }
            }
        };

        vm.closeForm = function () {
            var modalFormSub = document.getElementById("formSubstitute");
            modalFormSub.style.display = "none";
            //clean select items
            this.resetFormSub();
        }

        vm.resetFormSub = function () {

            var nonEmptySelections = [];
            if (vm.ExplanationTypeSubSelect.length > 0) {
                nonEmptySelections.push('ExplanationTypeSub');
            }
            if (vm.ExplainabilityTechniqueSubSelect.length > 0) {
                nonEmptySelections.push('ExplainabilityTechniqueSub');
            }
            if (vm.ExplainerConcurrentnessSubSelect.length > 0) {
                nonEmptySelections.push('ExplainerConcurrentnessSub');
            }
            if (vm.ComputationalComplexitySubSelect.length > 0) {
                nonEmptySelections.push('ComputationalComplexitySub');
            }
            if (vm.ImplementationFrameworkSubSelect.length > 0) {
                nonEmptySelections.push('ImplementationFrameworkSub');
            }
            if (vm.PresentationFormat.length > 0) {
                nonEmptySelections.push('PresentationformatSub');
            }
            if (vm.ExplanationScopeSubSelect.length > 0) {
                nonEmptySelections.push('ExplanationScopeSub');
            }
            if (vm.ExplainersSubSelect.length > 0) {
                nonEmptySelections.push('ExplainersSub');
            }

            if (nonEmptySelections.length > 0) {
                nonEmptySelections.forEach(function (variable) {
                    var self = this;
                    vm[variable].forEach(function (item) {
                        self.uncheckItemAndChildren(item);
                    }, this);
                }, this);
            } else {
                return null;
            }

            vm.ExplanationTypeSubSelect = []
            vm.ExplainabilityTechniqueSubSelect = [];
            vm.ExplainerConcurrentnessSubSelect = [];
            vm.ComputationalComplexitySubSelect = [];
            vm.ImplementationFrameworkSubSelect = [];
            vm.PresentationFormat = [];
            vm.ExplanationScopeSubSelect = [];
            vm.ExplainersSubSelect = [];
        }

        vm.uncheckItemAndChildren = function (item) {
            item.checked = false;

            if (item.children && item.children.length > 0) {
                var self = this;
                item.children.forEach(function (child) {
                    self.uncheckItemAndChildren(child);
                });
            }
        }

        vm.expandAdvancedPropertis = function () {
            var ButtonDeploy = document.getElementsByClassName("advanced-properties-button")[0];

            switch ($scope.divExpanded) {
                case true:
                    ButtonDeploy.innerText = "Advanced properties";
                    $scope.divExpanded = false;
                    break;
                case false:
                case undefined:
                    ButtonDeploy.innerText = "Hide advanced properties";
                    $scope.divExpanded = true;
                    break;
                default:
                    break;
            }
        }

        if (vm.models.length === 0) {
            GetModels();
            vm.modelsSelect = "Model";
            _create();
            _activate();

        } else {
            _create();
            _activate();
        }

        $scope.$on('$destroy', _destroy);

        function _activate() {
            var existDiv = document.getElementsByClassName("mi-divCanvasGeneral");
            if (existDiv.length > 0) {
                existDiv[0].remove();
            }
            vm.TitleSelect = null;
            vm.ArrayParams = [];

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var s = t.blocks.getSelected();

            if (s.length === 1) {
                vm.original = s[0];
                var ModelGet = {};

                if (vm.original.hasOwnProperty("ModelRoot")) {
                    ModelGet = {
                        idModel: vm.original.ModelRoot.idModel
                    };
                    if (vm.original.ModelRoot.img != undefined) {
                        ModelGet.img = vm.original.ModelRoot.img;
                    } else {
                        ModelGet.query = vm.original.ModelRoot.query;
                    }
                } else {
                    ModelGet = {
                        idModel: vm.original.idModel
                    };
                    if (vm.original.img != undefined) {
                        ModelGet.img = vm.original.img;
                    } else {
                        ModelGet.query = vm.original.query;
                    }
                }

                vm.block = {
                    title: vm.original.title,
                    description: vm.original.description,
                    properties: tine.merge({}, vm.original.properties),
                    propertyExpl: vm.original.propertyExpl,
                    DataType: vm.original.DataType,
                    VariableName: vm.original.VariableName,
                    params: tine.merge({}, vm.original.params),
                    ModelRoot: ModelGet,
                    Image: vm.original.Image,
                    Json: vm.original.Json
                };

                //  check if the property that is selected to define its values ​​in the properties component
                //  is the explain method and the evaluate method or intends
                switch (vm.original.name) {
                    case "Explanation Method":
                        /*
                        console.log(vm.original.title != "Explanation Method" && (vm.JsonParams === null || typeof vm.JsonParams === 'undefined' || Object.keys(vm.JsonParams).length === 0));
                        if (vm.original.title != "Explanation Method" && (vm.JsonParams === null || typeof vm.JsonParams === 'undefined' || Object.keys(vm.JsonParams).length === 0)) {
                            paramsExpValue(vm.original.title);
                        }
                       */

                        if (vm.block.params) {
                            CreateParams(vm.block.params);
                        }

                        if (vm.Explainers == null) {
                            _getArrayExplainers();
                            _getArrayExplainersSubstitute();
                        }
                        _SearchSubstituteExplainers();
                        if (vm.original.Json != undefined) {
                            LoadHtmlCode();

                        } else if (vm.original.Image != undefined) {
                            if (document.getElementById("ImgExpl") !== null) {
                                document.getElementById("ImgExpl").src = vm.original.Image;
                                const miDiv = document.getElementById('ButtonPlotly');
                                const miDivJson = document.getElementById('mi-div');
                                if (miDiv) {
                                    miDiv.remove();
                                }
                                miDivJson.innerHTML = null;
                            }

                        } else {
                            const miDiv = document.getElementById('mi-div');
                            if (miDiv !== null) {
                                miDiv.innerHTML = '';
                            }
                        }
                        vm.TitleName = vm.original.name;
                        t.blocks.update(vm.original, vm.block);

                        AddListAllProperties();
                        break;
                    case "Condition":
                        vm.TitleName = null;
                        vm.TitleSelect = null;
                        if (vm.block.DataType == undefined) {
                            vm.block.DataType = vm.DataType;
                        }
                        break;
                    case "Root":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = vm.node;
                        vm.IdModel = vm.block.ModelRoot;
                        break;
                    case "User Question":
                        vm.TitleName = vm.original.name;
                        vm.TitleSelect = null;
                        if (!vm.block.params.hasOwnProperty("Question")) {
                            vm.ArrayParams.push({ "key": "Question", "value": "", fixed: false });
                        } else {
                            if (vm.block.params.Question.hasOwnProperty("key")) {
                                vm.ArrayParams.push({ "key": "Question", "value": vm.block.params.Question.value, fixed: false });
                            } else {
                                for (var property in vm.block.params) {
                                    vm.ArrayParams.push({ "key": property, "value": vm.block.params[property], fixed: false });
                                }
                            }
                        }
                        break;
                    default:
                        vm.TitleName = null;
                        vm.TitleSelect = null;
                }

                if (vm.original.category == "composite" || vm.original.name == "Explanation Method") {
                    vm.ExplanationTypeSubSelect = []
                    vm.ExplainabilityTechniqueSubSelect = [];
                    vm.ExplainerConcurrentnessSubSelect = [];
                    vm.ComputationalComplexitySubSelect = [];
                    vm.ImplementationFrameworkSubSelect = [];
                    vm.PresentationFormat = [];
                    vm.ExplanationScopeSubSelect = [];
                    vm.ExplainersSubSelect = [];
                }
            } else {
                vm.original = false;
                vm.block = false;
            }

        }


        function loadModel() {
            setTimeout(() => {
                if (vm.original.ModelRoot == undefined) {
                    vm.modelsSelect = vm.models[vm.original.idModel];

                } else {
                    vm.modelsSelect = vm.models[vm.original.ModelRoot.idModel];
                }
                if (vm.modelsSelect == undefined) {
                    vm.modelsSelect = "Model";
                }
            }, 500);

        }

        function LoadImagen() {
            if (vm.original.Image != undefined) {
                document.getElementById("ImgExpl").src = vm.original.Image;
            }
        }

        function LoadHtmlCode() {

            if (vm.original.Json != undefined) {
                switch (vm.original.Json.type) {
                    case "dict":
                    case "text":
                        var ElementTextArea = document.getElementById('TextArea');
                        if (ElementTextArea) {
                            ElementTextArea.innerHTML = vm.block.Json.explanation;
                        }
                        var PotlyElement = document.getElementById('ButtonPlotly');
                        if (PotlyElement) {
                            PotlyElement.remove();
                        }
                        delete vm.block.Image;
                        break;
                    case "html":
                        var existsButton = document.getElementById('ButtonPlotly');
                        if (vm.original.Json.explanation.includes("Plotly.newPlot")) {
                            if (!existsButton) {
                                var miDiv = document.getElementById('mi-div');
                                if (miDiv) {
                                    var boton = document.createElement("button");
                                    boton.style.backgroundColor = '#0F4501';
                                    boton.innerHTML = "Visualize data";
                                    boton.setAttribute("class", "btn btn-success btn-xs pull-right ng-scope");
                                    boton.setAttribute("id", "ButtonPlotly");
                                    miDiv.innerHTML = "";
                                    miDiv.appendChild(boton);
                                }
                            }
                        } else {
                            if (existsButton) {
                                existsButton.remove();
                            }
                            const miDiv = document.getElementById('mi-div');
                            miDiv.innerHTML = vm.original.Json.explanation;
                        }
                        var ImageElement = document.getElementById('ImgExpl');
                        if (ImageElement) {
                            ImageElement.remove();
                        }
                        delete vm.block.Image;
                        break;
                    default:
                        break;
                }
            }
        }

        function GetModels() {
            //Id model
            var url = $location.url().slice(1);
            var urlSplit = url.split("/");

            if (url.includes("usecaseId=")) {
                vm.idModelUrl = url.split("usecaseId=")[1];

                projectModel.getModelsRootPrivate(vm.idModelUrl)
                    .then(function (x) {

                        switch (true) {
                            case Object.keys(x).length === 0:
                                notificationService.error(
                                    'Error Adding Models Private',
                                    'No Data Returned'
                                );
                                break;
                            case typeof x === 'string':
                                notificationService.error(
                                    'Error Adding Models Private',
                                    'Error in computer network communications'
                                );
                                break;
                            case Object.keys(x).length != 0 && typeof x != 'string':
                                vm.models = x;
                                // delete models test
                                var deleteModels = Object.keys(x).filter(key => x[key].includes('6'));
                                for (let index = 0; index < deleteModels.length; index++) {
                                    delete vm.models[deleteModels[index]];
                                }
                                notificationService.success(
                                    "Added Private Models"
                                );
                                break;
                        }
                    });
            }
        }

        function GetModelsPublic() {
            projectModel.getModelsRootPublic()
                .then(function (x) {
                    switch (true) {
                        case Object.keys(x).length === 0:
                            notificationService.error(
                                'Error Adding Models Public',
                                'No Data Returned'
                            );
                            break;
                        case typeof x === 'string':
                            notificationService.error(
                                'Error Adding Models Public',
                                'Error in computer network communications'
                            );
                            break;
                        case Object.keys(x).length != 0 && typeof x != 'string':
                            //set private model as first element and remove repeated
                            vm.models = Object.assign({}, vm.models, x);
                            // delete models test
                            var deleteModels = Object.keys(x).filter(key => x[key].includes('6'));
                            for (let index = 0; index < deleteModels.length; index++) {
                                delete vm.models[deleteModels[index]];
                            }

                            notificationService.success(
                                "Added Public Models"
                            );
                            break;
                    }
                });
        }

        function _getArrayExplainers() {
            //Get name Explainers
            projectModel.getExplainers()
                .then(function (x) {
                    vm.Explainers = x;
                });
        }

        function _getArrayExplainersSubstitute() {
            //Get Explainers Substitute
            projectModel.getExplainersSubstitute()
                .then(function (x) {
                    vm.ExplainersSubstituteAll = x;
                });
        }

        function _SearchSubstituteExplainers() {
            if (vm.ExplainersSubstituteAll == null) {
                projectModel.getExplainersSubstitute()
                    .then(function (x) {
                        var filtered = [];
                        vm.ExplainersSubstitute = [];
                        if (vm.block.title != "Explanation Method") {
                            vm.ExplainersSubstitute = Object.values(x)
                                .filter(obj => obj.explainer === vm.block.title)
                                .map(({ explainer, ...rest }) => rest)
                                .map(obj => Object.fromEntries(
                                    Object.entries(obj)
                                        .filter(([_, value]) => value !== "0.0" && value !== "1.0")
                                        .map(([key, value]) => [key, parseFloat(value).toFixed(2)])
                                        .sort((a, b) => b[1] - a[1])
                                ))[0];
                        }
                    });
            } else {
                var filtered = [];
                vm.ExplainersSubstitute = [];
                if (vm.ExplainersSubstituteAll && vm.block.title != "Explanation Method") {
                    vm.ExplainersSubstitute = Object.values(vm.ExplainersSubstituteAll)
                        .filter(obj => obj.explainer === vm.block.title)
                        .map(({ explainer, ...rest }) => rest)
                        .map(obj => Object.fromEntries(
                            Object.entries(obj)
                                .filter(([_, value]) => value !== "0.0" && value !== "1.0")
                                .map(([key, value]) => [key, parseFloat(value).toFixed(2)])
                                .sort((a, b) => b[1] - a[1])
                        ))[0];
                }
            }
        }

        async function FormSubstitute() {
            try {
                if (vm.ExplanationTypeSub == null) {
                    notificationService.load(
                        'Loading', 'Please wait while your request is being processed...'
                    );
                    await getExplainerDataForm();
                }
                var modalFormSub = document.getElementById("formSubstitute");
                modalFormSub.style.display = "block";
                vm.ExplainersSub = vm.convertToObjects();


            } catch (error) {
                console.log(error);
                notificationService.error(
                    'An error occurred. Please try again later.'
                );
            }
        }

        function getExplainerDataForm() {

            return new Promise((resolve, reject) => {
                projectModel.getExplainerFieldsFiltered((error, explainers) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(explainers);
                        vm.ExplanationTypeSub = explainers.Explanation.children;
                        vm.ExplainabilityTechniqueSub = explainers.ExplainabilityTechnique.children;
                        vm.ExplainerConcurrentnessSub = explainers.Concurrentness;
                        vm.ExplanationScopeSub = explainers.Scope;
                        vm.ComputationalComplexitySub = explainers.ComputationalComplexity;
                        vm.ImplementationFrameworkSub = explainers.Implementation_Framework;
                        vm.PresentationformatSub = explainers.DatasetType;
                        resolve();
                    }
                });
            });

        }

        async function submitFormSub(item) {

            notificationService.load(
                'Loading', 'Please wait while your request is being processed...'
            );
            var jsonDataNew = {
                "technique": [],
                "dataset_type": [],
                "explanation_type": [],
                "concurrentness": [],
                "portability": [],
                "scope": [],
                "target": [],
                "presentations": [],
                "computational_complexity": [],
                "ai_methods": [],
                "ai_tasks": [],
                "implementation": [],
                "Explainers": vm.block.title
            };

            if (vm.ExplanationTypeSubSelect.length > 0) {
                vm.ExplanationTypeSubSelect.forEach(function (item) {
                    if (item.children.length == 0) {
                        jsonDataNew.explanation_type.push(item.key);
                    } else {
                        item.children.forEach(function (element) {
                            jsonDataNew.explanation_type.push(element.key);
                        });
                    }

                });
            }
            if (vm.ExplainabilityTechniqueSubSelect.length > 0) {

                vm.ExplainabilityTechniqueSubSelect.forEach(function (item) {
                    if (item.children.length == 0) {
                        jsonDataNew.technique.push(item.key);
                    } else {
                        item.children.forEach(function (element) {
                            jsonDataNew.technique.push(element.key);
                        });
                    }

                });
            }
            if (vm.ExplainerConcurrentnessSubSelect.length > 0) {
                jsonDataNew.concurrentness = vm.ExplainerConcurrentnessSubSelect.map(function (item) {
                    return item.key;
                });
            }
            if (vm.ComputationalComplexitySubSelect.length > 0) {
                jsonDataNew.computational_complexity = vm.ComputationalComplexitySubSelect.map(function (item) {
                    return item.key;

                });
            }
            if (vm.ImplementationFrameworkSubSelect.length > 0) {
                jsonDataNew.implementation = vm.ImplementationFrameworkSubSelect.map(function (item) {
                    return item.key;
                });
            }
            if (vm.PresentationFormat.length > 0) {
                if (vm.PresentationFormat.length === 1) {
                    jsonDataNew.dataset_type = vm.PresentationFormat[0].key;
                } else {
                    jsonDataNew.dataset_type = vm.PresentationFormat.map(function (item) {
                        return item.key;
                    });
                }
            }
            if (vm.ExplanationScopeSubSelect.length > 0) {
                jsonDataNew.scope = vm.ExplanationScopeSubSelect.map(function (item) {
                    return item.key;

                });
            }

            this.closeForm();
            console.log(jsonDataNew);


            switch (vm.original.category) {
                case "action":
                    try {
                        if (vm.AllExplainerSubstitute == null) {
                            await AllExplainerProperties();
                        }

                        if (vm.CSVData == null) {
                            await getSimilarityValueExplainersEditor();
                        }

                        var my_explainers = [];
                        vm.AllExplainerSubstitute.forEach(function (e) {
                            if (e.dataset_type === jsonDataNew.dataset_type) {
                                if (compareListProperties(e, jsonDataNew)) {
                                    my_explainers.push(e.name);
                                }
                            }
                        });
                        console.log(my_explainers);
                        if (my_explainers.length > 0) {
                            SubstituteOneNode(my_explainers, vm.original, vm.block);
                        } else {
                            notificationService.error(
                                'No matches found'
                            );
                        }

                    } catch (error) {
                        notificationService.error(
                            'An error occurred. Please try again later.'
                        );
                    }

                    break;
                case "composite":
                    var OptionNodeSub = [
                        "Sequence",
                        "Priority",
                        "Supplement",
                        "Replacement"
                    ]
                    break;
                default:
                    break;
            }
        }

        function AllExplainerProperties() {

            return new Promise((resolve, reject) => {
                projectModel.getAllExplainerProperties((error, explainers) => {
                    if (error) {
                        reject(error);
                    } else {
                        vm.AllExplainerSubstitute = explainers;
                        resolve();
                    }
                });
            });

        }

        function getSimilarityValueExplainersEditor() {
            return new Promise((resolve, reject) => {
                projectModel.getSimilarityValueExplainers((error, similarity) => {
                    if (error) {
                        reject(error);
                    } else {
                        Papa.parse(similarity, {
                            header: true,
                            skipEmptyLines: true,
                            complete: function (results) {
                                vm.CSVData = {};
                                for (const row of results.data) {
                                    const explainer = row.explainer;
                                    delete row.explainer;
                                    vm.CSVData[explainer] = row;
                                }
                                resolve();
                            },
                            error: function (error) {
                                reject(error);
                            },
                        });
                    }
                });
            });
        }

        function compareListProperties(e1, e2) {
            var explainersEquals = false;
            if (
                (
                    critiqueIsInExplainer(e2.technique, e1.technique) &&
                    critiqueIsInExplainer(e2.explanation_type, e1.explanation_type) &&
                    critiqueIsInExplainer(e2.concurrentness, e1.concurrentness) &&
                    critiqueIsInExplainer(e2.portability, e1.portability) &&
                    critiqueIsInExplainer(e2.scope, e1.scope) &&
                    critiqueIsInExplainer(e2.target, e1.target) &&
                    critiqueIsInExplainer(e2.computational_complexity, e1.computational_complexity) &&
                    critiqueIsInExplainer(e2.presentations, e1.presentations) &&
                    critiqueIsInExplainer(e2.ai_methods, e1.ai_methods) &&
                    critiqueIsInExplainer(e2.ai_tasks, e1.ai_tasks) &&
                    critiqueIsInExplainer(e2.implementation, e1.implementation)) &&
                e1.name != e2.Explainers
            ) {
                explainersEquals = true;
            }

            return explainersEquals;
        }

        function critiqueIsInExplainer(critiques, properties_explainer) {
            if (critiques.length === 0 || critiques.includes('http://www.w3id.org/iSeeOnto/explainer#Any')) {
                return true;
            } else {
                for (var i = 0; i < critiques.length; i++) {
                    if (properties_explainer.includes(critiques[i])) {
                        return true;
                    }
                }
                return false;
            }
        }

        function SubstituteOneNode(OptionNodeSub, NodeSelect, block) {
            var NodeBlock = block;
            var nodeOriginal = vm.original;

            var existDiv = document.getElementsByClassName("mi-divCanvasGeneral");
            if (existDiv.length > 0) {
                existDiv[0].remove();
            }

            var padre = document.querySelector('.editor-page');
            var nuevoDiv = document.createElement('div');

            nuevoDiv.style.left = '0';
            nuevoDiv.style.right = '0';
            nuevoDiv.style.color = 'white';
            nuevoDiv.style.border = "solid";
            nuevoDiv.style.padding = '10px';
            nuevoDiv.style.zIndex = '10';
            nuevoDiv.style.border = "1px solid black";
            nuevoDiv.style.opacity = "0.9";
            nuevoDiv.style.marginRight = "250px";
            nuevoDiv.style.marginLeft = "250px";
            nuevoDiv.style.bottom = '0';
            nuevoDiv.style.position = 'fixed';
            nuevoDiv.className = "mi-divCanvasGeneral";
            padre.appendChild(nuevoDiv);

            var editorpricipal = $window.editor;

            var divbuttonsContainer = document.createElement('div');
            divbuttonsContainer.style.display = 'flex';
            divbuttonsContainer.style.overflowX = 'auto';
            nuevoDiv.appendChild(divbuttonsContainer);

            var OptionCount = (OptionNodeSub.length >= 5 ? 5 : OptionNodeSub.length) - 1;

            for (let i = 0; i <= OptionCount; i++) {
                var divbuttons = document.createElement('div');
                divbuttons.style.backgroundColor = "#454545";
                divbuttons.style.marginBottom = "2px";
                divbuttons.className = "mi-divButtons";
                divbuttons.style.display = 'flex';
                divbuttons.style.flexDirection = 'column';

                var buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.alignItems = 'center';

                var button = document.createElement('button');
                button.textContent = ' Substitute ' + (i + 1);
                button.style.backgroundColor = '#2f2f2f';
                button.style.border = "1px solid black";

                var buttonAddInfo = document.createElement('button');
                buttonAddInfo.insertAdjacentHTML('beforeend', '<i class="fa fa-info-circle"></i> ');
                buttonAddInfo.style.backgroundColor = '#5bc0de';
                buttonAddInfo.style.border = "none";
                buttonAddInfo.addEventListener('mouseenter', function () {
                    startTimeout(OptionNodeSub[i], 'substitute', function () {
                        var tooltip = document.querySelector(".mi-tooltip");
                        if (tooltip) {
                            tooltip.style.marginBottom = nuevoDiv.offsetHeight + 20 + "px";
                            tooltip.style.marginLeft = 300 + "px";
                        }
                    });
                });
                buttonAddInfo.addEventListener('mouseleave', function () {
                    cancelTimeout(OptionNodeSub[i], 'substitute');
                });

                var buttonAddPlus = document.createElement('button');
                buttonAddPlus.insertAdjacentHTML('beforeend', '<i class="fas fa-plus"></i> ');
                buttonAddPlus.style.backgroundColor = '#47A447';
                buttonAddPlus.style.border = "none";
                buttonAddPlus.addEventListener('click', function () {
                    UpdateProperties(OptionNodeSub[i], block, NodeSelect.id);
                    nuevoDiv.remove();
                });

                var similarityValue = null;
                if (vm.CSVData[block.title] && vm.CSVData[block.title][OptionNodeSub[i]]) {
                    similarityValue = parseFloat(vm.CSVData[block.title][OptionNodeSub[i]]);
                }
                var progressBarContainer = document.createElement('div');
                progressBarContainer.style.flexGrow = 1;
                progressBarContainer.style.position = 'relative';
                progressBarContainer.className = 'progress-bar-container';

                var progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.style.backgroundColor = '#1b6d85';
                progressBar.style.width = ((similarityValue * 100).toFixed(0)) + '% ';
                progressBar.style.height = " 26px";

                var progressText = document.createElement('div');
                progressText.style.position = 'absolute';
                progressText.style.left = '6%';
                progressText.style.top = '3%';

                var progressTextParagraph = document.createElement('p');
                progressTextParagraph.className = 'progress-bar-text';
                progressTextParagraph.textContent = ((similarityValue * 100).toFixed(0)) + '%  Similarity';

                progressText.appendChild(progressTextParagraph);
                progressBarContainer.appendChild(progressBar);
                progressBarContainer.appendChild(progressText);

                buttonContainer.appendChild(button);
                buttonContainer.appendChild(buttonAddInfo);
                buttonContainer.appendChild(buttonAddPlus);
                buttonContainer.appendChild(progressBarContainer);

                var DivCanvas = document.createElement('div');

                divbuttons.appendChild(buttonContainer);
                divbuttons.appendChild(DivCanvas);

                divbuttonsContainer.appendChild(divbuttons);

                var canvasPopup = editorpricipal.applySettingsFormatOnlyNode(DivCanvas, OptionNodeSub[i], vm.original.category);
                var canvasPopupAncho = canvasPopup.offsetWidth;

                divbuttons.style.width = canvasPopupAncho + 'px';
            }

            CreateButtonExit(nuevoDiv, padre, true);
            var close = document.getElementsByClassName("mi.close");
            close[0].style.height = close[0].offsetHeight + 15 + "px";

            notificationService.success(
                'Success', 'The operation was successful.'
            );
        }

        function obtenerDescendientes(arbol, nodoId) {

            const descendientes = [];

            function buscarDescendientes(nodoId) {
                const nodo = arbol[nodoId];
                if (!nodo) return;

                descendientes.push(nodo);
                var child = nodo.firstChild;
                if (child) {
                    do {
                        buscarDescendientes(child.Id);
                        child = child.Next;
                    } while (child != null);
                }
            }
            buscarDescendientes(nodoId);
            return descendientes;
        }


        function SubstituteNodes(NodeSelect) {
            notificationService.load(
                'Loading', 'Please wait while your request is being processed...'
            );
            projectModel.getProjecAllData()
                .then(function (x) {
                    var e = $window.editor.export;
                    var ProjectExpor = e.projectToData();

                    var a = ProjectExpor.trees[0];
                    var child = a.nodes[NodeSelect.id].firstChild;
                    var JsonDataSelect = {};
                    JsonDataSelect[NodeSelect.id] = a.nodes[NodeSelect.id];

                    const nodosDescendientes = obtenerDescendientes(a.nodes, NodeSelect.id);

                    ProjectExpor.trees[0].nodes = nodosDescendientes;
                    ProjectExpor.trees[0].root = NodeSelect.id;
                    x[0].data = ProjectExpor;
                    console.log(x[0]);

                    var existDiv = document.getElementsByClassName("mi-divCanvasGeneral");
                    if (existDiv.length > 0) {
                        existDiv[0].remove();
                    }

                    var padre = document.querySelector('.editor-page');
                    var divGeneral = document.createElement('div');

                    divGeneral.style.padding = '10px';
                    divGeneral.style.zIndex = '10';
                    divGeneral.style.borderRadius = "10px 0 0 10px";
                    divGeneral.style.marginRight = "250px";
                    divGeneral.style.marginLeft = "260px";
                    divGeneral.style.marginBottom = "20px";
                    divGeneral.style.bottom = '0';
                    divGeneral.style.position = 'absolute';
                    divGeneral.className = "mi-divCanvasGeneral";
                    padre.appendChild(divGeneral);

                    var divbuttons = document.createElement('div');
                    divbuttons.style.width = '100%';
                    divbuttons.style.marginRight = "auto";
                    divbuttons.className = "mi-divButtons";
                    divGeneral.appendChild(divbuttons);

                    CreateButtonExit(divGeneral, padre, true);

                    var dataGet = {
                        "version": "0.1.0",
                        "scope": "project",
                        "selectedTree": "33def3ec-31a8-47c1-856c-7fd724718df2",
                        "trees": [
                            {
                                "version": "0.1.0",
                                "scope": "tree",
                                "id": "33def3ec-31a8-47c1-856c-7fd724718df2",
                                "Instance": "Explanation Experience",
                                "description": "",
                                "root": "546f5cee-68b0-4b90-85be-786b9957d03a",
                                "query": "[ 0.79567475,  0.9502404 ,  1.1466679 ,  1.7491252 ,  2.4258016 ,\\n        2.6709641 ,  2.4624665 ,  2.0670781 ,  1.6233579 ,  1.088265  ,\\n        0.48325747,  0.02906767, -0.10205782, -0.04598573, -0.0671826 ,\\n       -0.19722394, -0.2485563 , -0.16774872, -0.14832422, -0.28560195,\\n       -0.40439817, -0.44400887, -0.57232183, -0.74243746, -0.76085833,\\n       -0.73913887, -0.79702819, -0.82658122, -0.86103224, -0.92441019,\\n       -0.92853065, -1.0558294 , -1.342795  , -1.4240432 , -1.3925323 ,\\n       -1.6146891 , -1.8213559 , -1.7714491 , -1.812784  , -2.0056145 ,\\n       -1.9994011 , -1.8152135 , -1.7312891 , -1.7231695 , -1.595469  ,\\n       -1.3787969 , -1.2431864 , -1.1277632 , -0.82712383, -0.43367487,\\n       -0.24352558, -0.24418688, -0.13786127,  0.12819149,  0.28449563,\\n        0.27788564,  0.34869189,  0.47325956,  0.46019376,  0.43604088,\\n        0.46587407,  0.36677829,  0.29225774,  0.45376562,  0.5617359 ,\\n        0.44966833,  0.36502024,  0.37485964,  0.38958319,  0.43390585,\\n        0.45581797,  0.40363272,  0.39960026,  0.49559394,  0.56183973,\\n        0.54000099,  0.5069879 ,  0.48365207,  0.46294595,  0.5407128 ,\\n        0.71064026,  0.7848302 ,  0.74619101,  0.73161313,  0.68733161,\\n        0.53590909,  0.43032121,  0.48710724,  0.57974138,  0.56283371,\\n        0.46409311,  0.40246792,  0.44930481,  0.55808223,  0.56857857,\\n        0.40117688]",
                                "idModel": "ECG200LSTM",
                                "nodes": {
                                    "546f5cee-68b0-4b90-85be-786b9957d03a": {
                                        "id": "546f5cee-68b0-4b90-85be-786b9957d03a",
                                        "Concept": "Priority",
                                        "Instance": "Priority",
                                        "description": "",
                                        "display": {
                                            "x": -60,
                                            "y": 84
                                        },
                                        "firstChild": {
                                            "Id": "5112868d-f790-4665-ab3e-18a36a857363",
                                            "Next": "None"
                                        }
                                    },
                                    "5112868d-f790-4665-ab3e-18a36a857363": {
                                        "id": "5112868d-f790-4665-ab3e-18a36a857363",
                                        "Concept": "Sequence",
                                        "Instance": "Sequence",
                                        "description": "",
                                        "properties": {

                                        },
                                        "display": {
                                            "x": -60,
                                            "y": 168
                                        },
                                        "firstChild": {
                                            "Id": "85b9b22e-1b0a-4a9b-81a9-83952d27271a",
                                            "Next": {
                                                "Id": "5829d6db-5011-4ad8-846a-ab8452c6be46",
                                                "Next": "None"
                                            }
                                        }
                                    },
                                    "85b9b22e-1b0a-4a9b-81a9-83952d27271a": {
                                        "id": "85b9b22e-1b0a-4a9b-81a9-83952d27271a",
                                        "Concept": "User Question",
                                        "Instance": "User Question",
                                        "description": "",
                                        "properties": {

                                        },
                                        "display": {
                                            "x": -192,
                                            "y": 324
                                        },
                                        "params": {
                                            "Question": {
                                                "key": "Question",
                                                "value": "What contributed to this income prediction?"
                                            }
                                        }
                                    },
                                    "5829d6db-5011-4ad8-846a-ab8452c6be46": {
                                        "id": "5829d6db-5011-4ad8-846a-ab8452c6be46",
                                        "Concept": "Explanation Method",
                                        "Instance": "/Tabular/LIME",
                                        "description": "",
                                        "properties": {

                                        },
                                        "display": {
                                            "x": 60,
                                            "y": 324
                                        },
                                        "params": {
                                            "output_classes": {
                                                "key": "output_classes",
                                                "value": "[ ]",
                                                "default": "[ ]",
                                                "range": [
                                                    "None",
                                                    "None"
                                                ],
                                                "required": "false",
                                                "description": "Array of integers representing the classes to be explained. Defaults to class 1.",
                                                "type": "text"
                                            },
                                            "top_classes": {
                                                "key": "top_classes",
                                                "value": 1,
                                                "default": 1,
                                                "range": [
                                                    "None",
                                                    "None"
                                                ],
                                                "required": "false",
                                                "description": "Integer representing the number of classes with the highest prediction probability to be explained. Overrides 'output_classes' if provided.",
                                                "type": "number"
                                            },
                                            "num_features": {
                                                "key": "num_features",
                                                "value": 10,
                                                "default": 10,
                                                "range": [
                                                    "None",
                                                    "None"
                                                ],
                                                "required": "false",
                                                "description": "Integer representing the maximum number of features to be included in the explanation.",
                                                "type": "number"
                                            },
                                            "png_width": {
                                                "key": "png_width",
                                                "value": 1000,
                                                "default": 1000,
                                                "range": [
                                                    "None",
                                                    "None"
                                                ],
                                                "required": "false",
                                                "description": "Width (in pixels) of the png image containing the explanation.",
                                                "type": "number"
                                            },
                                            "png_height": {
                                                "key": "png_height",
                                                "value": 400,
                                                "default": 400,
                                                "range": [
                                                    "None",
                                                    "None"
                                                ],
                                                "required": "false",
                                                "description": "Height (in pixels) of the png image containing the explanation.",
                                                "type": "number"
                                            }
                                        }
                                    }
                                },
                                "display": {
                                    "camera_x": 821.0999999642372,
                                    "camera_y": 332.69999998807907,
                                    "camera_z": 1,
                                    "x": -60,
                                    "y": 0
                                }
                            }
                        ],
                        "custom_nodes": [

                        ]
                    };
                    //console.log(dataGet.trees[0].nodes);

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

                    /*
                                        var a = {
                                            "OptionsSub": {
                                                "nodes1": dataGet.trees[0].nodes,
                                                "nodes2": {
                                                    "15ea4e43-aa05-4015-a839-e965bcbd62ec": {
                                                        "id": "15ea4e43-aa05-4015-a839-e965bcbd62ec",
                                                        "Concept": "Explanation Method",
                                                        "Instance": "/Tabular/ALE",
                                                        "description": "",
                                                        "display": {
                                                            "x": 96,
                                                            "y": 276
                                                        },
                                                        "params": {
                                                            "features_to_show": {
                                                                "key": "features_to_show",
                                                                "value": [
                                                                    "reduction_previous_period",
                                                                    "Media ¡_migrañas/mes_pretto",
                                                                    "Migrañas/mes_(3m)"
                                                                ],
                                                                "default": [
                                                                    "reduction_previous_period",
                                                                    "Media ¡_migrañas/mes_pretto",
                                                                    "Migrañas/mes_(3m)"
                                                                ],
                                                                "range": [
                                                                    "reduction_previous_period",
                                                                    "Media ¡_migrañas/mes_pretto",
                                                                    "Migrañas/mes_(3m)"
                                                                ],
                                                                "required": "false",
                                                                "description": "Array of strings representing the name of the features to be explained. Defaults to all features.",
                                                                "type": "checkbox"
                                                            }
                                                        },
                                                        "Json": {
                                                            "type": "html",
                                                            "explanation": " <!DOCTYPE html> <html lang='en'> <head> <title>explainerdashboard</title> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'> <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3' crossorigin='anonymous'> <script src='https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js' integrity='sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB' crossorigin='anonymous'></script> <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js' integrity='sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13' crossorigin='anonymous'></script> </head> <body>  <div class='container'>  <div class='card h-100' >   <div class='card-header'><h3 class='card-title'>PR AUC Plot for Class Positive</h3><h6 class='card-subtitle'>Trade-off between Precision and Recall</h6></div>   <div class='card-body'>     <div class='w-100'>      <div class='row' style='margin-top: 20px;'>      <div class='col'> <div>                        <script type='text/javascript'>window.PlotlyConfig = {MathJaxConfig: 'local'};</script>         <script charset='utf-8' src='https://cdn.plot.ly/plotly-2.20.0.min.js'></script>                <div id='ae7b1f13-90e5-4292-9c3f-3022205fa732' class='plotly-graph-div' style='height:100%; width:100%;'></div>            <script type='text/javascript'>                                    window.PLOTLYENV=window.PLOTLYENV || {};                                    if (document.getElementById('ae7b1f13-90e5-4292-9c3f-3022205fa732')) {                    Plotly.newPlot(                        'ae7b1f13-90e5-4292-9c3f-3022205fa732',                        [{'hoverinfo':'text','mode':'lines','name':'PR AUC CURVE','text':['threshold: 0.21 <br>precision: 0.50 <br>recall: 1.00','threshold: 0.25 <br>precision: 0.51 <br>recall: 1.00','threshold: 0.25 <br>precision: 0.49 <br>recall: 0.96','threshold: 0.27 <br>precision: 0.51 <br>recall: 0.96','threshold: 0.27 <br>precision: 0.52 <br>recall: 0.92','threshold: 0.30 <br>precision: 0.53 <br>recall: 0.92','threshold: 0.31 <br>precision: 0.54 <br>recall: 0.92','threshold: 0.33 <br>precision: 0.56 <br>recall: 0.92','threshold: 0.33 <br>precision: 0.56 <br>recall: 0.90','threshold: 0.33 <br>precision: 0.57 <br>recall: 0.90','threshold: 0.33 <br>precision: 0.56 <br>recall: 0.88','threshold: 0.34 <br>precision: 0.55 <br>recall: 0.82','threshold: 0.37 <br>precision: 0.55 <br>recall: 0.80','threshold: 0.38 <br>precision: 0.55 <br>recall: 0.76','threshold: 0.38 <br>precision: 0.54 <br>recall: 0.74','threshold: 0.39 <br>precision: 0.55 <br>recall: 0.74','threshold: 0.40 <br>precision: 0.55 <br>recall: 0.72','threshold: 0.40 <br>precision: 0.54 <br>recall: 0.70','threshold: 0.40 <br>precision: 0.53 <br>recall: 0.68','threshold: 0.41 <br>precision: 0.52 <br>recall: 0.66','threshold: 0.41 <br>precision: 0.51 <br>recall: 0.58','threshold: 0.43 <br>precision: 0.52 <br>recall: 0.56','threshold: 0.43 <br>precision: 0.53 <br>recall: 0.56','threshold: 0.46 <br>precision: 0.52 <br>recall: 0.54','threshold: 0.47 <br>precision: 0.51 <br>recall: 0.52','threshold: 0.48 <br>precision: 0.52 <br>recall: 0.52','threshold: 0.49 <br>precision: 0.52 <br>recall: 0.50','threshold: 0.49 <br>precision: 0.53 <br>recall: 0.50','threshold: 0.50 <br>precision: 0.52 <br>recall: 0.48','threshold: 0.50 <br>precision: 0.51 <br>recall: 0.44','threshold: 0.50 <br>precision: 0.50 <br>recall: 0.42','threshold: 0.50 <br>precision: 0.49 <br>recall: 0.40','threshold: 0.51 <br>precision: 0.46 <br>recall: 0.36','threshold: 0.52 <br>precision: 0.45 <br>recall: 0.28','threshold: 0.53 <br>precision: 0.41 <br>recall: 0.24','threshold: 0.54 <br>precision: 0.39 <br>recall: 0.22','threshold: 0.56 <br>precision: 0.41 <br>recall: 0.22','threshold: 0.58 <br>precision: 0.46 <br>recall: 0.22','threshold: 0.61 <br>precision: 0.43 <br>recall: 0.20','threshold: 0.63 <br>precision: 0.42 <br>recall: 0.16','threshold: 0.64 <br>precision: 0.33 <br>recall: 0.10','threshold: 0.67 <br>precision: 0.36 <br>recall: 0.10','threshold: 0.68 <br>precision: 0.31 <br>recall: 0.08','threshold: 0.69 <br>precision: 0.25 <br>recall: 0.06','threshold: 0.70 <br>precision: 0.30 <br>recall: 0.06','threshold: 0.70 <br>precision: 0.33 <br>recall: 0.06','threshold: 0.71 <br>precision: 0.38 <br>recall: 0.06','threshold: 0.77 <br>precision: 0.43 <br>recall: 0.06','threshold: 0.78 <br>precision: 0.33 <br>recall: 0.04','threshold: 0.79 <br>precision: 0.20 <br>recall: 0.02','threshold: 0.79 <br>precision: 0.25 <br>recall: 0.02','threshold: 0.81 <br>precision: 0.50 <br>recall: 0.02','threshold: 0.83 <br>precision: 1.00 <br>recall: 0.02'],'x':[0.5,0.5050505050505051,0.4948453608247423,0.5052631578947369,0.5227272727272727,0.5287356321839081,0.5411764705882353,0.5609756097560976,0.5625,0.569620253164557,0.5641025641025641,0.5540540540540541,0.547945205479452,0.5507246376811594,0.5441176470588235,0.5522388059701493,0.5454545454545454,0.5384615384615384,0.53125,0.5238095238095238,0.5087719298245614,0.5185185185185185,0.5283018867924528,0.5192307692307693,0.5098039215686274,0.52,0.5208333333333334,0.5319148936170213,0.5217391304347826,0.5116279069767442,0.5,0.4878048780487805,0.46153846153846156,0.45161290322580644,0.41379310344827586,0.39285714285714285,0.4074074074074074,0.4583333333333333,0.43478260869565216,0.42105263157894735,0.3333333333333333,0.35714285714285715,0.3076923076923077,0.25,0.3,0.3333333333333333,0.375,0.42857142857142855,0.3333333333333333,0.2,0.25,0.5,1.0,1.0],'y':[1.0,1.0,0.96,0.96,0.92,0.92,0.92,0.92,0.9,0.9,0.88,0.82,0.8,0.76,0.74,0.74,0.72,0.7,0.68,0.66,0.58,0.56,0.56,0.54,0.52,0.52,0.5,0.5,0.48,0.44,0.42,0.4,0.36,0.28,0.24,0.22,0.22,0.22,0.2,0.16,0.1,0.1,0.08,0.06,0.06,0.06,0.06,0.06,0.04,0.02,0.02,0.02,0.02,0.0],'type':'scatter'}],                        {'hovermode':'closest','plot_bgcolor':'#fff','title':{'text':'PR AUC CURVE'},'xaxis':{'constrain':'domain','range':[0,1],'title':{'text':'Precision'}},'yaxis':{'constrain':'domain','range':[0,1],'scaleanchor':'x','scaleratio':1,'title':{'text':'Recall'}},'template':{'data':{'scatter':[{'type':'scatter'}]}},'annotations':[{'align':'right','showarrow':false,'text':'pr-auc-score: 0.50','x':0.15,'xanchor':'left','y':0.4,'yanchor':'top'},{'align':'right','showarrow':false,'text':'cutoff: 0.50','x':0.15,'xanchor':'left','y':0.35,'yanchor':'top'},{'align':'right','showarrow':false,'text':'precision: 0.50','x':0.15,'xanchor':'left','y':0.3,'yanchor':'top'},{'align':'right','showarrow':false,'text':'recall: 0.42','x':0.15,'xanchor':'left','y':0.25,'yanchor':'top'}],'shapes':[{'line':{'color':'lightslategray','width':1},'type':'line','x0':0,'x1':1,'xref':'x','y0':0.42,'y1':0.42,'yref':'y'},{'line':{'color':'lightslategray','width':1},'type':'line','x0':0.5,'x1':0.5,'xref':'x','y0':0,'y1':1,'yref':'y'}],'margin':{'t':40,'b':40,'l':40,'r':40}},                        {'responsive': true}                    )                };                            </script>        </div> </div>          </div>           </div>   </div> </div>  </div>  </body>  <script type='text/javascript'> window.dispatchEvent(new Event('resize')); </script>          </html>     "
                                                        }
                                                    },
                                                    "a850c76b-395c-471b-85f8-62997123e4c1": {
                                                        "id": "a850c76b-395c-471b-85f8-62997123e4c1",
                                                        "Concept": "Priority",
                                                        "Instance": "Priority",
                                                        "description": "",
                                                        "display": {
                                                            "x": -24,
                                                            "y": 84
                                                        },
                                                        "firstChild": {
                                                            "Id": "15ea4e43-aa05-4015-a839-e965bcbd62ec",
                                                            "Next": null
                                                        }
                                                    }
                                                },
                                            }
                                        }
                    */
                    var editor1 = new b3e.editor.Editor();
                    editor1.scaleX = 1.5;
                    editor1.scaleY = 1.5;
                    editor1.project.create();
                    var p = editor1.project.get();

                    editor1.applySettingsFormat(editor1._game.canvas);

                    divGeneral.appendChild(editor1._game.canvas);

                    var TressOptions = editor1.import.treeAsDataSubti(a, p, a[0].trees[0].root);
                    TressOptions.shift();
                    var cont = 0;
                    var aaa;
                    TressOptions.forEach(element => {
                        var button = document.createElement('button');
                        button.textContent = 'Botón';
                        button.style.marginLeft = "5px";
                        button.textContent = 'option ' + (cont + 1);
                        button.style.backgroundColor = '#1b6d85';
                        button.style.border = "none";
                        button.addEventListener('click', function () {
                            aaa = CambiarOptionTree(element, editor1);
                        });
                        divbuttons.appendChild(button);
                        var buttonAdd = document.createElement('button');
                        //buttonAdd.textContent = '<i class="fa-sharp fa-solid fa-plus"></i>';
                        buttonAdd.insertAdjacentHTML('beforeend', '<i class="fas fa-plus"></i> ');
                        buttonAdd.style.backgroundColor = '#47A447';
                        buttonAdd.style.border = "none";
                        buttonAdd.addEventListener('click', function () {
                            updateNodeSub(element, NodeSelect, editor1, aaa, divGeneral);
                        });
                        divbuttons.appendChild(buttonAdd);
                        cont++;
                    });

                    $window.editor._initialize();

                    //zoom canvas from 1 to 1.75
                    var tSub = p.trees.getSelected();
                    tSub.view.zoom(1.75);

                    notificationService.success(
                        'Success', 'The operation was successful.'
                    );
                });

        }

        function CambiarOptionTree(treeId, editor1) {
            var p = editor1.project.get();

            p.trees.select(treeId.id);

            var t = p.trees.getSelected();
            var s = t.blocks.getAll();
            //zoom canvas from 1 to 1.75
            t.view.zoom(1.75);
            return s;
        }
        function updateNodeSub(TreeSub, nodeSelect, editor1, aaa, divGeneral) {
            if (aaa == undefined) {
                aaa = CambiarOptionTree(TreeSub, editor1)
            }

            var pSub = editor1.project.get();
            pSub.trees.select(TreeSub.id);

            var tSub = pSub.trees.getSelected();
            var sSub = tSub.blocks.getAll();
            tSub.selection.deselectAll();

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            //elimiar los hijos que se sustituye
            var BlockDelete = nodeSelect._outConnections;
            t.blocks.removeMutilple(BlockDelete, true);
            //pasarlos a canvas original 
            t.blocks.AddTreeBlockSub(sSub, nodeSelect, TreeSub);
            //Organize Canvas
            t.organize.organize();
            //delete div sub
            divGeneral.remove();
            //delete button close 
            var elementos = document.getElementsByClassName('mi.close');
            if (elementos.length != 0) {
                elementos[0].remove();
            }

            update();
        }

        // puede eliminarse 
        function getChildExplanations(DataAll, parentKey) {
            var children = [];
            for (var i = 0; i < DataAll.length; i++) {
                if (DataAll[i].key === parentKey) {
                    children = children.concat(DataAll[i].children);
                }
            }
            return children;
        }

        function hasChildren(item) {
            return item.children.length > 0;
        }

        function toggleContent() {
            var contentDiv = document.getElementById("DivCheckBox");
            if (contentDiv.style.display === "none") {
                contentDiv.style.display = "block";
            } else {
                contentDiv.style.display = "none";
            }
        }


        function SelectModel(data) {

            vm.modelsSelect = data;
            vm.block.ModelRoot.idModel = Object.keys(vm.models).find(key => vm.models[key] === data);

            projectModel.GetInstanceModelSelect(vm.block.ModelRoot.idModel)
                .then(function (x) {
                    //Tabular data
                    var miDirectiva = angular.element(document.querySelector('#b3-Proper-Params'));
                    miDirectiva.scope().ProperParams.InstanceModeldefault(x.instance, x.type);
                });
            update();
        }

        function removeBase64Header(base64String) {
            const comaIndex = base64String.indexOf(",");

            if (comaIndex <= 0) {
                return base64String;
            }

            const base64WithoutHeader = base64String.substring(comaIndex + 1);

            return base64WithoutHeader;
        }


        function RunNew(NodeId, block) {

            var jsonParam = {};

            var loaderDiv = document.querySelector('#loader');
            loaderDiv.style.display = 'block';

            for (var i = 0; i < vm.ArrayParams.length; i++) {
                // if ((vm.ArrayParams[i].value != "" && vm.ArrayParams[i].value !== null) && vm.ArrayParams[i].value !== "[ ]") {
                if (vm.ArrayParams[i].value !== null && vm.ArrayParams[i].value !== "[ ]") {
                    jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;
                }
            }

            var jsonObjectInstance = {
                id: vm.IdModel.idModel,
                params: jsonParam
            };

            if (vm.IdModel.hasOwnProperty('img')) {
                if (isBase64Image(vm.IdModel.img)) {
                    const base64SinEncabezado = removeBase64Header(vm.IdModel.img);
                    jsonObjectInstance.instance = base64SinEncabezado;
                    jsonObjectInstance.type = "image"
                }
            } else {
                if (esJSONValido(vm.IdModel.query)) {
                    jsonObjectInstance.instance = JSON.parse(vm.IdModel.query);
                } else {
                    jsonObjectInstance.instance = vm.IdModel.query;
                }
                jsonObjectInstance.type = "dict"
            }

            projectModel.RunNew(jsonObjectInstance, vm.original.title)
                .then(function (x) {
                    if (x.hasOwnProperty("type")) {
                        switch (x.type) {
                            case "image":
                                var img = new Image();
                                var base64 = x.explanation;
                                block.Image = "data:image/png;base64," + base64;
                                //Actualizar la imagen o cargar imagen
                                var imagen = document.querySelector('#ImgExpl');
                                if (imagen) {
                                    imagen.src = block.Image;
                                }
                                delete block.Json;
                                break;
                            case "html":
                                var existsButton = document.getElementById('ButtonPlotly');
                                if (x.explanation.includes("Plotly.newPlot")) {
                                    if (!existsButton) {
                                        var miDiv = document.getElementById('mi-div');
                                        var boton = document.createElement("button");
                                        boton.style.backgroundColor = '#0F4501';
                                        boton.innerHTML = "Visualize data";
                                        boton.setAttribute("class", "btn btn-success btn-xs pull-right ng-scope");
                                        boton.setAttribute("id", "ButtonPlotly");
                                        miDiv.innerHTML = "";
                                        miDiv.appendChild(boton);
                                    }

                                } else {
                                    if (existsButton) {
                                        existsButton.remove();
                                    }
                                    const miDiv = document.getElementById('mi-div');
                                    miDiv.innerHTML = x.explanation;
                                }

                                var ImageElement = document.getElementById('ImgExpl');
                                if (ImageElement) {
                                    ImageElement.remove();
                                }

                                block.Json = x;
                                delete block.Image;

                                break;
                            case "dict":
                            case "text":
                                block.Json = {
                                    explanation: JSON.stringify(x.explanation, null, 4),
                                    type: x.type
                                }
                                var ElementTextArea = document.getElementById('TextArea');
                                if (ElementTextArea) {
                                    ElementTextArea.innerHTML = block.Json.explanation;
                                }

                                delete block.Image;
                                break;

                            default:
                                break;
                                LoadHtmlCode();
                        }
                        notificationService.success(
                            "The explainer ran successfully"
                        );
                        loaderDiv.style.display = "none";
                        //update Explanation
                        var p = $window.editor.project.get();
                        var t = p.trees.getSelected();
                        var ExpBlock = t.blocks.get(NodeId);
                        t.blocks.update(ExpBlock, block);
                    } else {
                        loaderDiv.style.display = "none";
                        notificationService.error(
                            x
                        );
                    }
                });
        }

        function ejecutarScripts(Datos, IdDiv) {
            var miDiv = IdDiv;
            var temporal = document.createElement('div');

            // Insertamos el HTML en el elemento temporal
            temporal.innerHTML = Datos.explanation;
            // Compilamos el HTML utilizando el servicio $compile de AngularJS
            var contenidoCompilado = $compile(temporal)($scope);
            // Insertamos el contenido compilado en el DOM
            miDiv.appendChild(contenidoCompilado[0]);

            // Ejcutar Script de plov
            var scripts = miDiv.getElementsByTagName('script');
            var scriptArray = Array.from(scripts);

            scriptArray.forEach(function (script) {
                eval(script.innerHTML);
            });
        }

        function isBase64Image(str) {
            var validImageHeaders = [
                'data:image/jpeg;base64,',
                'data:image/png;base64,',
                'data:image/gif;base64,'
            ];

            for (const header of validImageHeaders) {
                if (str.startsWith(header)) {
                    return true;
                }
            }

            return false;
            /*
            if (str === '' || str.trim() === '') {
                return false;
            }
            try {
                return btoa(atob(str)) == str;
            } catch (err) {
                return false;
            }*/
        }

        function esJSONValido(cadena) {
            try {
                JSON.parse(cadena);
                return true;
            } catch (error) {
                return false;
            }
        }

        function _getJsonProperties() {
            //Get the properties of the evaluate method

            projectModel.getConditionsEvaluationMethod()
                .then(function (x) {
                    vm.evaluation = x;
                });
        }

        function renameIntends(CurrentName) {
            dialogService
                .prompt('Rename Intents', null, 'input', CurrentName)
                .then(function (name) {
                    // If no name provided, abort
                    if (!name) {
                        notificationService.error(
                            'Invalid rename',
                            'You must provide a name for the rename.'
                        );
                    } else {
                        vm.block.title = name;
                        update();
                    }
                });
        }


        function _event(e) {
            setTimeout(function () { $scope.$apply(function () { _activate(); }); }, 0);
        }

        function _create() {
            $window.editor.on('blockselected', _event);
            $window.editor.on('blockdeselected', _event);
            $window.editor.on('blockremoved', _event);
            $window.editor.on('treeselected', _event);
            $window.editor.on('nodechanged', _event);
        }

        function _destroy() {
            $window.editor.off('blockselected', _event);
            $window.editor.off('blockdeselected', _event);
            $window.editor.off('blockremoved', _event);
            $window.editor.off('treeselected', _event);
            $window.editor.off('nodechanged', _event);
        }

        function keydown(e) {
            if (e.ctrlKey && e.keyCode == 90) {
                e.preventDefault();
            }

            return false;
        }

        function AddListAllProperties() {
            //we buy if there is id and title
            var Exist = vm.AllProperties.findIndex(element => element.id == vm.original.id &&
                (vm.original.title == element.value ||
                    vm.original.title == "Evaluation Method" ||
                    vm.original.title == "Explanation Method"));

            //If it is not in AllPropertis we add it
            if (Exist == -1 && vm.hasOwnProperty("TitleSelect") && vm.TitleSelect != undefined) {
                vm.TitleSelect.forEach(element => {
                    var a = new Object({});
                    var propertiesExplanation = PropertiesExplanation(element);
                    //we check if the property we are adding already exists in the editor
                    if (vm.original.title == element.value) {
                        //we define the properties with the values of the properties of editor
                        a.value = vm.original.title;
                        a.properties = vm.original.properties;
                        a.description = vm.original.description;
                        a.propertyExpl = propertiesExplanation;
                    } else {

                        //we define the properties with the values of the properties of ServerJson
                        var json = {};
                        element.properties.forEach(element => {
                            json[element.key] = element.value;
                        });
                        a.value = element.value;
                        a.properties = tine.merge({}, json);
                        a.description = element.description;
                        a.propertyExpl = propertiesExplanation;
                    }
                    a.id = vm.original.id;
                    vm.AllProperties.push(a);
                });
            }
        }


        function PropertiesExplanation(option) {
            var propertiesExpl = {};
            var ArrayNameProperties = Object.keys(option);

            for (var index = 0; index < ArrayNameProperties.length; index++) {
                switch (ArrayNameProperties[index]) {
                    case "value":
                        break;
                    case "properties":
                        break;
                    case "description":
                        break;
                    case "id":
                        break;
                    case "$$hashKey":
                        break;
                    default:
                        if (Array.isArray(option[ArrayNameProperties[index]])) {
                            //   option[claves[index]]
                            propertiesExpl[ArrayNameProperties[index]] = option[ArrayNameProperties[index]];
                        } else {
                            propertiesExpl[ArrayNameProperties[index]] = option[ArrayNameProperties[index]];
                        }

                        break;
                }
            }

            return propertiesExpl;
        }

        async function UpdateProperties(option, block, nodeId) {
          
            if (option != block.title) {
                var Continue = true;
                if (vm.original.name == "Explanation Method") {
                    await paramsExp(option, block, nodeId)
                        .catch((error) => {
                            Continue = false;
                        });
                }
                if (Continue) {
                    if (vm.original.Json != undefined) {
                        vm.original.Json = undefined;
                        const miDiv = document.getElementById('mi-div');
                        if (miDiv !== null) {
                            miDiv.innerHTML = "";
                        }
                    } else if (vm.original.Image != undefined) {
                        vm.original.Image = undefined;
                        if (document.getElementById("ImgExpl") !== null) {
                            document.getElementById("ImgExpl").src = "";
                        }
                    }
                    //we check if any selected "Evaluation" or "Explanation" method is in AllPropertis
                    var selecionado = vm.AllProperties.find(element => element.value === option.value && element.id == vm.original.id);
                    //define the properties

                    if (selecionado != undefined) {
                        vm.block = {
                            title: selecionado.value,
                            properties: tine.merge({}, selecionado.properties) || null,
                            description: selecionado.description,
                            propertyExpl: selecionado.propertyExpl,
                        };
                    } else {
                        vm.block = {
                            title: option,
                            properties: tine.merge({}, vm.original.properties),
                            description: vm.original.description,
                        };
                    }

                    _SearchSubstituteExplainers();
                    cancelTimeout();
                    update();
                } 
            }

        }


        function change(block, nodeId) {

            switch (vm.original.name) {
                case "Explanation Method":
                    for (var keyParam in vm.block.params) {
                        if (vm.block.params.hasOwnProperty(keyParam)) {
                            if (keyParam == "key" || keyParam == "value") {
                                delete vm.block.params[keyParam];
                            }
                        }
                    }
                    var params = [];
                    for (var i = 0; i < vm.ArrayParams.length; i++) {
                        var r = vm.ArrayParams[i];

                        if (!r.key) continue;

                        switch (r.type) {
                            case "number":
                                if (((r.range[0] > r.value || r.range[1] < r.value) && (r.range[0] != null || r.range[1] != null)) || (r.value == null && r.required == "true")) {
                                    notificationService.error(
                                        'Invalid parametro',
                                        (r.required == "true" && r.value == null) ? 'empty field.' :
                                            (r.range[0] > r.value || r.range[1] < r.value) ? 'the field is not in the range minimum ' + r.range[0] + ' maximum ' + r.range[1] + '.' : ""

                                    );
                                    r.value = r.default;
                                }
                                break;
                            case "text":
                                if (r.value == null && r.required == "true") {
                                    notificationService.error(
                                        'Invalid parametro',
                                        'empty field.'
                                    );
                                }
                                if (r.default == "[ ]") {
                                    const myRegex = /^\[.*\]$/;
                                    const result = myRegex.test(r.value);
                                    if (!result) {
                                        r.value = r.default;
                                        notificationService.error(
                                            'Invalid parametro',
                                            'The parameter needs to be enclosed in square brackets [ ].'
                                        );
                                    }
                                }

                                break;
                            default:
                                break;
                        }
                        var jsonParam = {
                            key: r.key,
                            value: r.value,
                            default: r.default,
                            range: r.range,
                            required: r.required,
                            description: r.description,
                            type: r.type,
                        }
                        if (!vm.block.params) {
                            vm.block.params = {}; // si vm.block.params no está definido, se crea como un objeto vacío
                        }
                        vm.block.params[r.key] = jsonParam;
                    }
                    break;
                case "User Question":

                    var jsonParam = {
                        Question: vm.ArrayParams[0].value
                    };

                    vm.block.params = jsonParam;
                    break;

                default:
                    break;
            }
            update();
        }

        function PopUpImg(ImagenSrc) {
            var modal = document.getElementById("myModal");
            var modalImg = document.getElementById("modal-img");

            modal.style.display = "block";
            modalImg.src = ImagenSrc;
        }

        function PopUpHtml(HtmlCode) {
            var elementos = document.getElementsByClassName('mi.close');
            if (elementos.length != 0) {
                elementos[0].remove();
            }
            var padre = document.querySelector('.editor-page');

            var elementos = document.getElementsByClassName('mi-htmlCode');
            if (elementos.length == 0) {
                var nuevoDiv = document.createElement('div');
                nuevoDiv.style.position = 'fixed';
                nuevoDiv.style.bottom = '0';
                nuevoDiv.style.left = '0';
                nuevoDiv.style.right = '0';
                nuevoDiv.style.color = 'black';
                nuevoDiv.style.backgroundColor = '#F1F1EC';
                nuevoDiv.style.padding = '10px';
                nuevoDiv.style.zIndex = '10';
                nuevoDiv.style.marginRight = "250px";
                nuevoDiv.style.marginLeft = "250px";
                nuevoDiv.style.paddingTop = "40px"
                nuevoDiv.style.overflowX = "auto"
                nuevoDiv.style.overflowY = "auto"
                nuevoDiv.className = "mi-htmlCode";
                padre.appendChild(nuevoDiv);
                if (HtmlCode.type = "html") {
                    ejecutarScripts(HtmlCode, nuevoDiv);
                } else {
                    nuevoDiv.innerHTML = HtmlCode.explanation;
                }
                CreateButtonExit(nuevoDiv, padre, false);
            } else {

                if (HtmlCode.type = "html") {
                    elementos[0].innerHTML = "";
                    ejecutarScripts(HtmlCode, elementos[0]);
                    CreateButtonExit(elementos[0], padre, true);
                } else {
                    nuevoDiv.innerHTML = HtmlCode.explanation;
                    CreateButtonExit(nuevoDiv, padre, true);
                }
            }
        }

        function CreateButtonExit(nuevoDiv, padre, DeleteButton) {
            var divElement = document.createElement('div');
            divElement.style.position = 'fixed';

            divElement.style.left = '0';
            divElement.style.right = '0';
            divElement.style.width = '30px';
            divElement.style.height = '30px';
            divElement.style.paddingLeft = ' 4px';
            divElement.style.cursor = 'pointer';
            divElement.style.marginRight = "250px";
            divElement.style.marginLeft = "255px";
            divElement.style.zIndex = '90';
            divElement.style.bottom = (nuevoDiv.offsetHeight - 5) + 'px';
            divElement.className = "mi.close";
            //Insert icon 
            divElement.innerHTML = '<i class="fa fa-times-circle" aria-hidden="true" style="color: red; font-size: 30px;"></i>';

            nuevoDiv.appendChild(divElement);
            divElement.addEventListener('click', function () {
                divElement.remove();
                nuevoDiv.remove();
            });
        }

        function PopUpImgClose() {
            var modal = document.getElementById("myModal");
            var modal1 = document.getElementById("myModal1");
            var span = document.getElementsByClassName("close")[0];
            var span1 = document.getElementsByClassName("close")[1];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            };
            span1.onclick = function () {
                modal1.style.display = "none";
            };
        }


        function paramsExp(option, block, nodeId) {
            var IdModel = "";

            return new Promise((resolve, reject) => {
                for (var i = 0; i < vm.original.parent.children.length; i++) {
                    if (vm.original.parent.children[i].category === "root") {
                        if (!vm.original.parent.children[i].hasOwnProperty("ModelRoot")) {
                            IdModel = vm.original.parent.children[i].idModel
                        } else {
                            IdModel = vm.original.parent.children[i].ModelRoot.idModel;
                        }
                    }
                }

                projectModel.getConditionsEvaluationEXP(option, IdModel)
                    .then(function (x) {
                        console.log(x);
                        switch (true) {
                            case x.hasOwnProperty("params"):
                                // example of values Popularity and Applicability
                                vm.block.properties.Popularity = Math.floor(Math.random() * 3);
                                vm.block.properties.Applicability = Math.random() < 0.5;

                                CreateParams(x.params, block, nodeId);
                                resolve(); // Resuelve la promesa en caso de éxito
                                break;
                            case x == "Error in computer network communications":
                                vm.ArrayParams = [];
                                notificationService.error(
                                    'Error select Explanation Method',
                                    'Error in computer network communications [500]'
                                );
                                reject(new Error('Error in computer network communications [500]')); // Rechaza la promesa en caso de error
                                break;
                            default:
                                // example of values Popularity and Applicability
                                vm.block.properties.Popularity = Math.floor(Math.random() * 3);
                                vm.block.properties.Applicability = Math.random() < 0.5;

                                vm.ArrayParams = [];
                                //des block canvas
                                /*
                                var p1 = $window.editor._game.canvas;
                                p1.style.pointerEvents = 'auto';
                                */
                                update();
                                resolve(); // Resuelve la promesa en caso de éxito
                                break;
                        }
                    })
                    .catch((error) => {
                        reject(error); // Rechaza la promesa en caso de error en la llamada a 'projectModel.getConditionsEvaluationEXP'
                    });
            });
        }

        function CreateParams(params, block, nodeId) {
            vm.JsonParams = {};
            vm.ArrayParams = [];
            vm.JsonParams = params;

            for (var property in params) {
                var Type = "";
                switch (params[property].type) {

                    case "float":
                    case "number":
                    case "int":
                        Type = "number"
                        break;
                    case "string":
                        if (params[property].range != null) {
                            Type = "select"
                        } else {
                            Type = "text"
                        }
                        break;
                    case "select":
                        Type = "select"
                        break;
                    case "checkbox":
                        Type = "checkbox"
                        break;
                    case "array":
                        Type = "text"
                        if (params[property].default == null) {
                            params[property].default = "[ ]";
                        } else {
                            if (Array.isArray(params[property].default)) {
                                Type = "checkbox"
                            }
                        }
                        break;
                    default:
                        Type = "text"
                        break;
                }

                vm.ArrayParams.push({
                    "key": property,
                    "value": params[property].value || params[property].default || null,
                    "default": params[property].default || null,
                    "range": params[property].range || [null, null],
                    "required": params[property].required || "false",
                    "type": Type,
                    "description": params[property].description || "",
                    fixed: false
                });
            }
            //des block canvas
            /*
            var p1 = $window.editor._game.canvas;
            p1.style.pointerEvents = 'auto';
            */
            change(block, nodeId);
        }

        function paramsExpValue(option) {
            vm.JsonParams = {};
            projectModel.getConditionsEvaluationEXP(option)
                .then(function (x) {
                    vm.JsonParams = x.params;
                });
        }

        function filterSubitemClick(data, title, $event) {
            if ($event.target.checked) {
                vm.block.params[title].value.push(data);
            } else {
                var indice = vm.block.params[title].value.indexOf(data);
                if (indice !== -1) {
                    vm.block.params[title].value.splice(indice, 1);
                }
            }

        }

        function GetInfoParam(Param) {
            if (vm.block.params && vm.block.params.hasOwnProperty(Param)) {
                vm.datatooltipParam = vm.block.params[Param].description;
            } else {
                vm.datatooltipParam = ""
            }

        }

        function mostrarTexto(explainerTitle, option) {

            projectModel.GetDesciptionExplainer(explainerTitle)
                .then(function (x) {
                    CreateTooltip(x, option);
                });
        }

        function GetInfoParamSubstitute(NameExpl, option, callback) {
            var SubNameChange = [vm.block.title, NameExpl];

            projectModel.GetSimNL(SubNameChange)
                .then(function (x) {
                    CreateTooltip(x, option);
                    callback();
                });
        }

        function LookDescriptionExplanation(explainerTitle, option) {

            projectModel.GetDesciptionExplainer(explainerTitle)
                .then(function (x) {
                    CreateTooltip(x, option);
                });
        }

        function CreateTooltip(value, type) {
            var padre = document.querySelector('.editor-page');
            var nuevoDiv = document.createElement('div');

            nuevoDiv.innerHTML = value;
            nuevoDiv.style.left = '0';
            nuevoDiv.style.right = '0';
            nuevoDiv.style.color = 'while';
            nuevoDiv.style.backgroundColor = 'black';
            nuevoDiv.style.padding = '10px';
            nuevoDiv.style.zIndex = '90';
            nuevoDiv.style.borderRadius = "10px 0 0 10px";
            nuevoDiv.style.border = "1px solid black";
            nuevoDiv.style.opacity = "0.9";
            nuevoDiv.style.marginRight = "250px";
            nuevoDiv.style.marginLeft = "260px";
            nuevoDiv.style.marginBottom = "20px";

            switch (type) {
                case 'Explanation':
                    nuevoDiv.style.position = 'absolute';
                    nuevoDiv.style.top = '50px';
                    nuevoDiv.className = "mi-tooltip";
                    break;
                case 'substitute':
                    nuevoDiv.style.bottom = '0';
                    nuevoDiv.style.position = 'fixed';
                    nuevoDiv.className = "mi-tooltip";
                    break;
                case 'title':
                    nuevoDiv.style.borderRadius = "10px ";
                    nuevoDiv.style.top = '0';
                    nuevoDiv.style.position = 'absolute';
                    nuevoDiv.style.marginRight = "30px";
                    nuevoDiv.style.marginLeft = "60%";
                    nuevoDiv.style.marginTop = "40px";
                    nuevoDiv.className = "DesciptionExplainer";
                    break;
                default:
                    break;
            }
            padre.appendChild(nuevoDiv);

        }

        function startTimeout(key, option, callback) {
            var timeoutDuration = 1000;
            switch (option) {
                case 'Explanation':
                    timeoutDuration = 1000;
                    break;
                case 'substitute':
                    timeoutDuration = 1000;
                    break;
                case 'title':
                    timeoutDuration = 500;
                    break;
                default:
                    break;
            }

            vm.timeoutPromise = $timeout(function () {
                switch (option) {
                    case 'Explanation':
                        LookDescriptionExplanation(key, option);
                        break;
                    case 'substitute':
                        GetInfoParamSubstitute(key, option, callback);
                        break;
                    case 'title':
                        mostrarTexto(key, option);
                        break;
                    default:
                        break;
                }
            }, timeoutDuration);
        }

        function cancelTimeout(key) {
            if (vm.timeoutPromise) {
                $timeout.cancel(vm.timeoutPromise);
                vm.timeoutPromise = null;
            }

            if (key == vm.block.title) {
                var DivRemove = document.querySelector('.DesciptionExplainer');
            } else {
                var DivRemove = document.querySelector('.mi-tooltip');
            }

            if (DivRemove) {
                DivRemove.remove();
            }
        }

        function SelectTypeOfData(TypeData) {
            vm.block = {
                title: vm.original.title,
                properties: tine.merge({}, vm.original.properties),
                DataType: TypeData,
                VariableName: vm.original.VariableName,
            };
            update();
        }


        function update() {

            //update Explanation and Evaluation method properties
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();


            t.blocks.update(vm.original, vm.block);

            //we check if any selected "Evaluation" or "Explanation" method is in AllPropertis
            //returns the position in the AllPropertis
            /*var estaEnLaLista = vm.AllProperties.findIndex(element => element.id == vm.original.id && vm.original.title == element.value);
                        console.log(vm.AllProperties);
            
                        if (estaEnLaLista != -1) {
                            vm.AllProperties[estaEnLaLista].description = vm.block.description;
                            vm.AllProperties[estaEnLaLista].properties = vm.original.properties;
            }*/

        }

        async function RunBt() {

            vm.RunBtString.push("START RUN BT");
            vm.jsonData = projectModel.runBT();

            for (const identificador in vm.jsonData.nodes) {
                if (vm.jsonData.root == identificador) {
                    await runNode(vm.jsonData.nodes[identificador].id);
                }
            }

            var myJsonString = JSON.stringify(vm.RunBtString);
            var url = $state.href('dash.run', { data: myJsonString });

            vm.RunBtString = [];
            $window.open(url, '_blank');
        }

        async function runNode(id) {
            switch (vm.jsonData.nodes[id].Concept) {
                case "Sequence":
                case "Priority":
                    return await sequenceAndpriority(vm.jsonData.nodes[id]);
                case "Supplement":
                case "Replacement":
                case "Variant":
                case "Complement":
                    return await composite(vm.jsonData.nodes[id]);
                case "Repeater":
                    return await repeater(vm.jsonData.nodes[id]);
                case "RepeatUntilFailure":
                    return await repeatUntilFailure(vm.jsonData.nodes[id]);
                case "RepeatUntilSuccess":
                    return await repeatUntilSuccess(vm.jsonData.nodes[id]);
                case "Inverter":
                    return await inverter(vm.jsonData.nodes[id]);
                case "Limiter":
                    return await LimitXActivations(vm.jsonData.nodes[id]);
                default:
                    return await custom(vm.jsonData.nodes[id]);
                    break;
            }
        }

        async function custom(node) {
            var p = $window.editor.project.get();
            var type = p._nodes[node.Concept].category;
            switch (type) {
                case "composite":
                    return await composite(node);
                    break;
                case "conditions":

                    break;
                case "composite":

                    break;
                case "decorators":

                    break;
                default:
                    break;
            }

            return false;
        }

        async function ExecuteNodeActionConditions(NodeConcept, child) {
            switch (NodeConcept) {
                case "Explanation Method":
                    if (!(await explanationMethod(vm.jsonData.nodes[child.Id]))) {
                        vm.RunBtString.push("🔴 Error explanation node █ Id : " + vm.jsonData.nodes[child.Id].id + " Name : " + vm.jsonData.nodes[child.Id].Instance);
                    } else {
                        vm.RunBtString.push("🟢 End explanation node █ Id : " + vm.jsonData.nodes[child.Id].id + " Name : " + vm.jsonData.nodes[child.Id].Instance);
                    }
                    break;
                case "User Question":
                    return await UserQuestion(vm.jsonData.nodes[child.Id]);
                    break;
                case "Failer":
                    return await failer(vm.jsonData.nodes[child.Id]);
                    break;
                case "Succeeder":
                    return await succeeder(vm.jsonData.nodes[child.Id]);
                    break;
                case "Condition":
                    return await Condition(vm.jsonData.nodes[child.Id]);
                    break;
                default:
                    await runNode(vm.jsonData.nodes[child.Id].id);
                    break;
            }
        }
        //
        // composites
        //
        async function sequenceAndpriority(node) {
            vm.RunBtString.push("⏩ Running " + node.Concept + "  █ Id : " + node.id + " Name : " + node.Instance);
            var child = node.firstChild;
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();

            do {
                var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
                await ExecuteNodeActionConditions(ExpBlock.Concept, child);
                child = child.Next;
            } while (child != null);

            vm.RunBtString.push("🔚 End " + node.Concept + "  █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }


        async function composite(node) {
            vm.RunBtString.push("⏩ Running " + node.Concept + " node █ Id : " + node.id + " Name : " + node.Instance);
            var child = node.firstChild;
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();

            if (child.Next != null) {
                do {
                    var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
                    await ExecuteNodeActionConditions(ExpBlock.Concept, child);
                    child = child.Next;
                } while (child != null);
            } else {
                vm.RunBtString.push("🟡 Could not be executed, does not have two or more children node = Id : " + node.id + " Name : " + node.Instance);
            }
            vm.RunBtString.push("🔚 End " + node.Instance + "  █ Id : " + node.id);
            return true;
        }
        //
        // Condition
        //
        async function Condition(node) {
            vm.RunBtString.push("⏩ Running Condition node █ Id : " + node.id + " Name : " + node.Instance);
            vm.RunBtString.push("🟢 End Condition node █ Id : " + node.id + " Name : " + node.Instance);
            return false;
        }
        //
        // Actions
        //
        async function failer(node) {
            vm.RunBtString.push("⏩ Running Failer node █ Id : " + node.id + " Name : " + node.Instance);
            vm.RunBtString.push("🔴 End Failer node █ Id : " + node.id + " Name : " + node.Instance);
            return false;
        }

        async function succeeder(node) {
            vm.RunBtString.push("⏩ Running Succeeder node █ Id : " + node.id + " Name : " + node.Instance);
            vm.RunBtString.push("🟢 End succeeder node █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function UserQuestion(node) {
            vm.RunBtString.push("⏩ Running User Question node █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function explanationMethod(node) {
            vm.RunBtString.push("⏩ Running Explanation Method █ Id : " + node.id + " Name : " + node.Instance);

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var ExpBlock = t.blocks.get(node.id);

            var result = false;
            var jsonParam = {};

            CreateParams(ExpBlock.params);

            for (var i = 0; i < vm.ArrayParams.length; i++) {
                if (vm.ArrayParams[i].value !== null && vm.ArrayParams[i].value !== "[ ]") {
                    jsonParam[vm.ArrayParams[i].key] = vm.ArrayParams[i].value;
                }
            }

            var jsonObjectInstance = {
                id: vm.IdModel.idModel,
                params: jsonParam
            };

            if (isBase64Image(vm.IdModel.query)) {
                jsonObjectInstance.instance = vm.IdModel.query;
                jsonObjectInstance.type = "image"
            } else {
                if (esJSONValido(vm.IdModel.query)) {
                    jsonObjectInstance.instance = JSON.parse(vm.IdModel.query);
                } else {
                    jsonObjectInstance.instance = vm.IdModel.query;
                }
                jsonObjectInstance.type = "dict"
            }

            var ExpBlockEdit = [];

            await projectModel.RunNew(jsonObjectInstance, node.Instance)
                .then(function (x) {
                    switch (x.type) {
                        case "image":
                            var img = new Image();
                            var base64 = x.explanation;
                            ExpBlockEdit = {
                                Image: "data:image/png;base64," + base64
                            };

                            delete ExpBlock.Json;
                            delete ExpBlockEdit.Json;
                            break;
                        case "html":
                            var existsButton = document.getElementById('ButtonPlotly');

                            ExpBlockEdit.Json = {
                                explanation: x.explanation,
                                type: x.type
                            };
                            delete ExpBlock.Image;
                            delete ExpBlockEdit.Image;

                            break;
                        case "dict":
                        case "text":
                            ExpBlockEdit.Json = {
                                explanation: JSON.stringify(x.explanation, null, 4),
                                type: x.type
                            }
                            delete ExpBlock.Image;
                            delete ExpBlockEdit.Image;
                            break;
                        default:
                            break;
                            LoadHtmlCode();
                    }
                    if (x == "Error execute Explanation Method ") {
                        result = false;
                    } else {
                        t.blocks.update(ExpBlock, ExpBlockEdit);
                        result = true;
                    }

                }).catch(function (error) {
                    result = false;
                });
            return result;
        }
        //
        // Decorators
        //        
        async function repeater(node) {
            vm.RunBtString.push("⏩ Running Repeater █ Id : " + node.id + " Name : " + node.Instance);
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();

            for (var i = 0; i < node.properties.maxLoop; i++) {
                var child = node.firstChild;
                var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
                await ExecuteNodeActionConditions(ExpBlock.Concept, child);
            }

            vm.RunBtString.push("🔚 End " + node.Concept + "  █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function repeatUntilFailure(node) {
            vm.RunBtString.push("⏩ Running Repeat Until Failure || Id : " + node.id + " Name : " + node.Instance);

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();

            for (var i = 0; i < node.properties.maxLoop; i++) {
                var child = node.firstChild;
                var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
                if ((!(await ExecuteNodeActionConditions(ExpBlock.Concept, child)))) {
                    vm.RunBtString.push("🔚 End " + node.Concept + "  █ Id : " + node.id + " Name : " + node.Instance);
                    return false;
                }
            }
            vm.RunBtString.push("🔚 End " + node.Concept + "  █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function repeatUntilSuccess(node) {
            vm.RunBtString.push("⏩ Running Repeat Until Success █ Id : " + node.id + " Name : " + node.Instance);

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();

            for (var i = 0; i < node.properties.maxLoop; i++) {
                var child = node.firstChild;
                var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
                if (((await ExecuteNodeActionConditions(ExpBlock.Concept, child)))) {
                    vm.RunBtString.push("🔚 End " + node.Concept + " █ Id : " + node.id + " Name : " + node.Instance);
                    return false;
                }
            }
            vm.RunBtString.push("🔚 End " + node.Concept + "  █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function inverter(node) {
            vm.RunBtString.push("⏩ Running Inverter █ Id : " + node.id + " Name : " + node.Instance);
            var p = $window.editor.project.get();
            var t = p.trees.getSelected();
            var child = node.firstChild;
            var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
            await ExecuteNodeActionConditions(ExpBlock.Concept, child);
            vm.RunBtString.push("🔚 End " + node.Concept + " █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }

        async function LimitXActivations(node) {
            vm.RunBtString.push("⏩ Running Limiter █ Id : " + node.id + " Name : " + node.Instance);

            var p = $window.editor.project.get();
            var t = p.trees.getSelected();

            for (var i = 0; i < node.properties.maxLoop; i++) {
                var child = node.firstChild;
                var ExpBlock = t.blocks.get(vm.jsonData.nodes[child.Id]);
                await ExecuteNodeActionConditions(ExpBlock.Concept, child);
            }
            vm.RunBtString.push("🔚 End " + node.Concept + " █ Id : " + node.id + " Name : " + node.Instance);
            return true;
        }
    }
})();



