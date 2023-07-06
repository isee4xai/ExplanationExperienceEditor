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
        vm.getChildExplanations = getChildExplanations
        vm.hasChildren = hasChildren;
        vm.toggleContent = toggleContent;
        vm.submitFormSub = submitFormSub;
        vm.CambiarOptionTree = CambiarOptionTree;
        vm.updateNodeSub = updateNodeSub;

        vm.explainerAccordionOpen = false
        vm.ExplainerConcurrentnessAccordionOpen = false
        vm.ExplainerScopeAccordionOpen = false
        vm.ComputationalComplexityAccordionOpen = false
        vm.ImplementationFrameworksAccordionOpen = false

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
                "key": "http://semanticscience.org/resource/SIO_000009",
                "label": "social entity",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://semanticscience.org/resource/SIO_000010",
                        "label": "social structure",
                        "parent": "http://semanticscience.org/resource/SIO_000009",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000620",
                                "label": "collective",
                                "parent": "http://semanticscience.org/resource/SIO_000010",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000012",
                                        "label": "organization",
                                        "parent": "http://semanticscience.org/resource/SIO_000620",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000285",
                                                "label": "academic organization",
                                                "parent": "http://semanticscience.org/resource/SIO_000012",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000290",
                                                        "label": "university",
                                                        "parent": "http://semanticscience.org/resource/SIO_000285",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000686",
                                                        "label": "academic department",
                                                        "parent": "http://semanticscience.org/resource/SIO_000285",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000619",
                                                "label": "regulatory authority",
                                                "parent": "http://semanticscience.org/resource/SIO_000012",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_010383",
                                                        "label": "drug regulatory authority",
                                                        "parent": "http://semanticscience.org/resource/SIO_000619",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000688",
                                                "label": "institute",
                                                "parent": "http://semanticscience.org/resource/SIO_000012",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000693",
                                                "label": "corporation",
                                                "parent": "http://semanticscience.org/resource/SIO_000012",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000403",
                                        "label": "study group",
                                        "parent": "http://semanticscience.org/resource/SIO_000620",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001068",
                                                "label": "control group",
                                                "parent": "http://semanticscience.org/resource/SIO_000403",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001069",
                                                "label": "intervention group",
                                                "parent": "http://semanticscience.org/resource/SIO_000403",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001061",
                                        "label": "population",
                                        "parent": "http://semanticscience.org/resource/SIO_000620",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001062",
                                                "label": "human population",
                                                "parent": "http://semanticscience.org/resource/SIO_001061",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001016",
                                                        "label": "ethnic group",
                                                        "parent": "http://semanticscience.org/resource/SIO_001062",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001063",
                                        "label": "family",
                                        "parent": "http://semanticscience.org/resource/SIO_000620",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001064",
                                        "label": "community",
                                        "parent": "http://semanticscience.org/resource/SIO_000620",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000287",
                        "label": "social relation",
                        "parent": "http://semanticscience.org/resource/SIO_000009",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000173",
                                "label": "affiliation",
                                "parent": "http://semanticscience.org/resource/SIO_000287",
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "key": "http://semanticscience.org/resource/SIO_000075",
                "label": "mathematical entity",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://semanticscience.org/resource/SIO_000094",
                        "label": "algorithm",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000127",
                                "label": "workflow",
                                "parent": "http://semanticscience.org/resource/SIO_000094",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000130",
                        "label": "pattern",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000131",
                                "label": "sequence motif",
                                "parent": "http://semanticscience.org/resource/SIO_000130",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001197",
                                "label": "structural motif",
                                "parent": "http://semanticscience.org/resource/SIO_000130",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_010531",
                                "label": "sequence profile",
                                "parent": "http://semanticscience.org/resource/SIO_000130",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000238",
                        "label": "logical operator",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000220",
                                "label": "implies (->)",
                                "parent": "http://semanticscience.org/resource/SIO_000238",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000239",
                                "label": "conjunction (and)",
                                "parent": "http://semanticscience.org/resource/SIO_000238",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000280",
                                "label": "disjunction (or)",
                                "parent": "http://semanticscience.org/resource/SIO_000238",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000282",
                                        "label": "exclusive disjunction (xor)",
                                        "parent": "http://semanticscience.org/resource/SIO_000280",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000281",
                                "label": "negation (not)",
                                "parent": "http://semanticscience.org/resource/SIO_000238",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000289",
                        "label": "set",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000138",
                                "label": "class",
                                "parent": "http://semanticscience.org/resource/SIO_000289",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000150",
                                "label": "list",
                                "parent": "http://semanticscience.org/resource/SIO_000289",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000464",
                                        "label": "data series",
                                        "parent": "http://semanticscience.org/resource/SIO_000150",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001116",
                                        "label": "union",
                                        "parent": "http://semanticscience.org/resource/SIO_000150",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001117",
                                        "label": "intersection",
                                        "parent": "http://semanticscience.org/resource/SIO_000150",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001118",
                                        "label": "sequence",
                                        "parent": "http://semanticscience.org/resource/SIO_000150",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001316",
                                        "label": "ordered list",
                                        "parent": "http://semanticscience.org/resource/SIO_000150",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001315",
                                                "label": "author list",
                                                "parent": "http://semanticscience.org/resource/SIO_001316",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000616",
                                "label": "collection",
                                "parent": "http://semanticscience.org/resource/SIO_000289",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000295",
                                        "label": "collection of documents",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000158",
                                                "label": "book series",
                                                "parent": "http://semanticscience.org/resource/SIO_000295",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000162",
                                                "label": "periodical",
                                                "parent": "http://semanticscience.org/resource/SIO_000295",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000121",
                                                        "label": "magazine",
                                                        "parent": "http://semanticscience.org/resource/SIO_000162",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000160",
                                                        "label": "journal",
                                                        "parent": "http://semanticscience.org/resource/SIO_000162",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000163",
                                                        "label": "newspaper",
                                                        "parent": "http://semanticscience.org/resource/SIO_000162",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000296",
                                                "label": "website",
                                                "parent": "http://semanticscience.org/resource/SIO_000295",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000546",
                                        "label": "collection of points",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001241",
                                        "label": "catalog",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001380",
                                        "label": "protein family",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001382",
                                        "label": "unigene cluster",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001419",
                                        "label": "a collection of replicates",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001421",
                                        "label": "a collection of duplicates",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_010066",
                                        "label": "sequence alignment",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_010067",
                                                "label": "multiple sequence alignment",
                                                "parent": "http://semanticscience.org/resource/SIO_010066",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_010068",
                                                "label": "pairwise sequence alignment",
                                                "parent": "http://semanticscience.org/resource/SIO_010066",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_011131",
                                        "label": "collection of 3d molecular structure models",
                                        "parent": "http://semanticscience.org/resource/SIO_000616",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000617",
                                "label": "empty set",
                                "parent": "http://semanticscience.org/resource/SIO_000289",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001246",
                                "label": "interval",
                                "parent": "http://semanticscience.org/resource/SIO_000289",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001251",
                                        "label": "left open interval",
                                        "parent": "http://semanticscience.org/resource/SIO_001246",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001248",
                                                "label": "open interval",
                                                "parent": "http://semanticscience.org/resource/SIO_001252",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001252",
                                        "label": "right open interval",
                                        "parent": "http://semanticscience.org/resource/SIO_001246",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001248",
                                                "label": "open interval",
                                                "parent": "http://semanticscience.org/resource/SIO_001252",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001253",
                                        "label": "right closed interval",
                                        "parent": "http://semanticscience.org/resource/SIO_001246",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001249",
                                                "label": "closed interval",
                                                "parent": "http://semanticscience.org/resource/SIO_001254",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001254",
                                        "label": "left closed interval",
                                        "parent": "http://semanticscience.org/resource/SIO_001246",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001249",
                                                "label": "closed interval",
                                                "parent": "http://semanticscience.org/resource/SIO_001254",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000367",
                        "label": "variable",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000920",
                                "label": "independent variable",
                                "parent": "http://semanticscience.org/resource/SIO_000367",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000144",
                                        "label": "parameter",
                                        "parent": "http://semanticscience.org/resource/SIO_000920",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000952",
                                                "label": "default parameter",
                                                "parent": "http://semanticscience.org/resource/SIO_000144",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000921",
                                "label": "dependent variable",
                                "parent": "http://semanticscience.org/resource/SIO_000367",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001070",
                                "label": "control variable",
                                "parent": "http://semanticscience.org/resource/SIO_000367",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000368",
                        "label": "equation",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000566",
                                "label": "movement equation",
                                "parent": "http://semanticscience.org/resource/SIO_000368",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000565",
                                        "label": "diffusion equation",
                                        "parent": "http://semanticscience.org/resource/SIO_000566",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000569",
                                "label": "differential equation",
                                "parent": "http://semanticscience.org/resource/SIO_000368",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000567",
                                        "label": "ordinary differential equation",
                                        "parent": "http://semanticscience.org/resource/SIO_000569",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000568",
                                        "label": "partial differential equation",
                                        "parent": "http://semanticscience.org/resource/SIO_000569",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000897",
                        "label": "association",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000898",
                                "label": "statistical association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000923",
                                        "label": "correlation",
                                        "parent": "http://semanticscience.org/resource/SIO_000898",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000983",
                                "label": "gene-disease association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001120",
                                        "label": "therapeutic gene-disease association",
                                        "parent": "http://semanticscience.org/resource/SIO_000983",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001121",
                                        "label": "gene-disease biomarker association",
                                        "parent": "http://semanticscience.org/resource/SIO_000983",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001123",
                                                "label": "gene-disease association linked with altered gene expression",
                                                "parent": "http://semanticscience.org/resource/SIO_001121",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001124",
                                                "label": "gene-disease association linked with post-translational modification",
                                                "parent": "http://semanticscience.org/resource/SIO_001121",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001350",
                                                "label": "gene-disease association linked with genomic alterations",
                                                "parent": "http://semanticscience.org/resource/SIO_001121",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001122",
                                                        "label": "gene-disease association linked with genetic variation",
                                                        "parent": "http://semanticscience.org/resource/SIO_001350",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001119",
                                                                "label": "gene-disease association linked with causal mutation",
                                                                "parent": "http://semanticscience.org/resource/SIO_001122",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001344",
                                                                        "label": "gene-disease association linked with germline causal mutation",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001119",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001345",
                                                                        "label": "gene-disease association linked with somatic causal mutation",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001119",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001342",
                                                                "label": "gene-disease association linked with modifying mutation",
                                                                "parent": "http://semanticscience.org/resource/SIO_001122",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001346",
                                                                        "label": "gene-disease association linked with somatic modifying mutation",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001342",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001347",
                                                                        "label": "gene-disease association linked with germline modifying mutation",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001342",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001343",
                                                                "label": "gene-disease association linked with susceptibility mutation",
                                                                "parent": "http://semanticscience.org/resource/SIO_001122",
                                                                "children": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001348",
                                                        "label": "fusion gene-disease association",
                                                        "parent": "http://semanticscience.org/resource/SIO_001350",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001349",
                                                        "label": "gene-disease association linked with chromosomal rearrangement",
                                                        "parent": "http://semanticscience.org/resource/SIO_001350",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000993",
                                "label": "chemical-disease association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001171",
                                "label": "database cross-reference",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001172",
                                        "label": "exact cross-reference",
                                        "parent": "http://semanticscience.org/resource/SIO_001171",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001250",
                                "label": "chemical-pathway association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001257",
                                "label": "chemical-gene association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001257",
                                "label": "chemical-gene association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001337",
                                "label": "epimer association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001435",
                                "label": "chemical-chemical association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001436",
                                "label": "disease-disease association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001437",
                                "label": "gene-gene association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001438",
                                "label": "protein-protein association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001439",
                                "label": "protein-disease association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001440",
                                "label": "chemical-protein association",
                                "parent": "http://semanticscience.org/resource/SIO_000897",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000944",
                        "label": "interval",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000177",
                                "label": "page range",
                                "parent": "http://semanticscience.org/resource/SIO_000944",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001258",
                        "label": "set item",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_001259",
                                "label": "collection item",
                                "parent": "http://semanticscience.org/resource/SIO_001258",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001418",
                                        "label": "replicate",
                                        "parent": "http://semanticscience.org/resource/SIO_001259",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001420",
                                        "label": "duplicate",
                                        "parent": "http://semanticscience.org/resource/SIO_001259",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001260",
                                "label": "list item",
                                "parent": "http://semanticscience.org/resource/SIO_001258",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001261",
                                        "label": "ordered list item",
                                        "parent": "http://semanticscience.org/resource/SIO_001260",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001429",
                        "label": "tensor",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_001431",
                                "label": "scalar",
                                "parent": "http://semanticscience.org/resource/SIO_001429",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000366",
                                        "label": "number",
                                        "parent": "http://semanticscience.org/resource/SIO_001431",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000070",
                                                "label": "measurement value",
                                                "parent": "http://semanticscience.org/resource/SIO_000366",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000052",
                                                        "label": "quantity",
                                                        "parent": "http://semanticscience.org/resource/SIO_000070",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000074",
                                                                "label": "unit of measurement",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000257",
                                                                "label": "dimensionless quantity",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000638",
                                                                        "label": "probability measure",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000257",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000765",
                                                                                "label": "probability value",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000638",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001021",
                                                                                "label": "expected value",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000638",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001245",
                                                                                "label": "standard score",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000638",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000794",
                                                                        "label": "count",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000257",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000178",
                                                                                "label": "page total",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000308",
                                                                                "label": "edition number",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000309",
                                                                                "label": "volume number",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000787",
                                                                                "label": "page number",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001115",
                                                                                "label": "member count",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001160",
                                                                                "label": "number of objects produced",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001161",
                                                                                "label": "number of objects consumed",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001162",
                                                                                "label": "difference in number of objects produced",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001163",
                                                                                        "label": "increase in number of objects produced",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001162",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001164",
                                                                                        "label": "decrease in number of objects produced",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001162",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001328",
                                                                                "label": "copy number variation",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_010061",
                                                                                "label": "generation number",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000794",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001018",
                                                                        "label": "ratio",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000257",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001074",
                                                                                "label": "t-statistic",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001078",
                                                                                "label": "differential gene expression ratio",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001081",
                                                                                        "label": "t-statistic based increased differential gene expression",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001078",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001082",
                                                                                        "label": "t-statistic based decreased differential gene expression",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001078",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001184",
                                                                                "label": "slope",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001351",
                                                                                "label": "DisGeNET disease specificity",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001352",
                                                                                "label": "DisGeNET Pleiotropy Index",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001355",
                                                                                "label": "specific gravity",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001408",
                                                                                "label": "aspect ratio",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001413",
                                                                                "label": "percentage",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001018",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001089",
                                                                        "label": "pH",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000257",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001414",
                                                                        "label": "quantile",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000257",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001415",
                                                                                "label": "percentile",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001414",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000258",
                                                                "label": "dimensional quantity",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000037",
                                                                        "label": "spatial quantity",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000038",
                                                                                "label": "1D extent quantity",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000037",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000039",
                                                                                        "label": "depth",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000038",
                                                                                        "children": [
                                                                                            {
                                                                                                "key": "http://semanticscience.org/resource/SIO_000043",
                                                                                                "label": "thickness",
                                                                                                "parent": "http://semanticscience.org/resource/SIO_000039",
                                                                                                "children": []
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000040",
                                                                                        "label": "height",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000038",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000041",
                                                                                        "label": "length",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000038",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000042",
                                                                                        "label": "width",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000038",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000044",
                                                                                "label": "2D extent quantity",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000037",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000045",
                                                                                        "label": "area",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000044",
                                                                                        "children": [
                                                                                            {
                                                                                                "key": "http://semanticscience.org/resource/SIO_001407",
                                                                                                "label": "surface area",
                                                                                                "parent": "http://semanticscience.org/resource/SIO_000045",
                                                                                                "children": []
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000046",
                                                                                        "label": "length of perimeter",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000044",
                                                                                        "children": [
                                                                                            {
                                                                                                "key": "http://semanticscience.org/resource/SIO_000047",
                                                                                                "label": "circumference",
                                                                                                "parent": "http://semanticscience.org/resource/SIO_000046",
                                                                                                "children": []
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000048",
                                                                                "label": "3D extent quantity",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000037",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000049",
                                                                                        "label": "volume",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000048",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001088",
                                                                                        "label": "concentration",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000048",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001406",
                                                                                        "label": "density",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000048",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000279",
                                                                                "label": "mass",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000037",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000391",
                                                                        "label": "time measurement",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000417",
                                                                                "label": "time interval",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000391",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000428",
                                                                                        "label": "year",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000429",
                                                                                        "label": "month",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000430",
                                                                                        "label": "day",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000431",
                                                                                        "label": "century",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000432",
                                                                                        "label": "millennium",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000433",
                                                                                        "label": "hour",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000434",
                                                                                        "label": "minute",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000435",
                                                                                        "label": "second",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001354",
                                                                                        "label": "week",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000417",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000418",
                                                                                "label": "time instant",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000391",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000031",
                                                                                        "label": "start date",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000418",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000032",
                                                                                        "label": "end date",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000418",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000669",
                                                                                        "label": "start time",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000418",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_000670",
                                                                                        "label": "end time",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000418",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001083",
                                                                                        "label": "date of database submission",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000418",
                                                                                        "children": []
                                                                                    },
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001314",
                                                                                        "label": "date of issue",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_000418",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001013",
                                                                        "label": "age",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001019",
                                                                        "label": "dose",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001020",
                                                                                "label": "effective dose",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001019",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001077",
                                                                        "label": "gene expression value",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001327",
                                                                        "label": "protein expression value",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001365",
                                                                        "label": "rate of change",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000258",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001367",
                                                                                "label": "frequency",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001365",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001368",
                                                                                "label": "speed",
                                                                                "parent": "http://semanticscience.org/resource/SIO_001365",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001369",
                                                                                        "label": "velocity",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001368",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000769",
                                                                "label": "uncertainty value",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000770",
                                                                "label": "standard deviation",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001108",
                                                                "label": "centrality measure",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001109",
                                                                        "label": "mean",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001108",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001110",
                                                                        "label": "median",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001108",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001111",
                                                                        "label": "mode",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001108",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001112",
                                                                "label": "sum",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001113",
                                                                "label": "minimal value",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001114",
                                                                "label": "maximal value",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001243",
                                                                "label": "likelihood",
                                                                "parent": "http://semanticscience.org/resource/SIO_000052",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001244",
                                                                        "label": "log likelihood",
                                                                        "parent": "http://semanticscience.org/resource/SIO_001243",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000056",
                                                        "label": "position",
                                                        "parent": "http://semanticscience.org/resource/SIO_000070",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000013",
                                                                "label": "geographic position",
                                                                "parent": "http://semanticscience.org/resource/SIO_000056",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000318",
                                                                        "label": "longitude",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000013",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000319",
                                                                        "label": "latitude",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000013",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000767",
                                                                        "label": "postal code",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000013",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000057",
                                                                "label": "orientation",
                                                                "parent": "http://semanticscience.org/resource/SIO_000056",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000071",
                                                                "label": "coordinate",
                                                                "parent": "http://semanticscience.org/resource/SIO_000056",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000072",
                                                                        "label": "cartesian coordinate",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000071",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000333",
                                                                                "label": "3D cartesian coordinate",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000072",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000400",
                                                                                "label": "x cartesian coordinate",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000072",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000401",
                                                                                "label": "y cartesian coordinate",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000072",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000402",
                                                                                "label": "z cartesian coordinate",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000072",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000073",
                                                                        "label": "polar coordinate",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000071",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000438",
                                                                "label": "altitude",
                                                                "parent": "http://semanticscience.org/resource/SIO_000056",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000439",
                                                                "label": "center of mass",
                                                                "parent": "http://semanticscience.org/resource/SIO_000056",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000788",
                                                                "label": "linear position",
                                                                "parent": "http://semanticscience.org/resource/SIO_000056",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000613",
                                                                        "label": "ordinal position",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000788",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000305",
                                                                                "label": "process number",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000613",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001056",
                                                                                "label": "character position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000613",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000789",
                                                                        "label": "sequence element position",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000788",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000791",
                                                                                "label": "sequence start position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000943",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000792",
                                                                                "label": "sequence end position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000953",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000943",
                                                                        "label": "start position",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000788",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000791",
                                                                                "label": "sequence start position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000943",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001071",
                                                                                "label": "text span start position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000943",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001057",
                                                                                        "label": "word start position",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001071",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000953",
                                                                        "label": "end position",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000788",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000792",
                                                                                "label": "sequence end position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000953",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001072",
                                                                                "label": "text span end position",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000953",
                                                                                "children": [
                                                                                    {
                                                                                        "key": "http://semanticscience.org/resource/SIO_001058",
                                                                                        "label": "word end position",
                                                                                        "parent": "http://semanticscience.org/resource/SIO_001072",
                                                                                        "children": []
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001443",
                                                "label": "complex number",
                                                "parent": "http://semanticscience.org/resource/SIO_000366",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001441",
                                                        "label": "imaginary number",
                                                        "parent": "http://semanticscience.org/resource/SIO_001443",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001442",
                                                        "label": "real number",
                                                        "parent": "http://semanticscience.org/resource/SIO_001443",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001434",
                                "label": "rank nonzero tensor",
                                "parent": "http://semanticscience.org/resource/SIO_001429",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001430",
                                        "label": "vector",
                                        "parent": "http://semanticscience.org/resource/SIO_001434",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001433",
                                        "label": "matrix",
                                        "parent": "http://semanticscience.org/resource/SIO_001434",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001432",
                        "label": "vector space",
                        "parent": "http://semanticscience.org/resource/SIO_000075",
                        "children": []
                    }
                ]
            },
            {
                "key": "http://semanticscience.org/resource/SIO_000078",
                "label": "language entity",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://semanticscience.org/resource/SIO_000079",
                        "label": "visual language entity",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000104",
                        "label": "language",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000980",
                                "label": "sign language",
                                "parent": "http://semanticscience.org/resource/SIO_000104",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000981",
                                "label": "verbal language",
                                "parent": "http://semanticscience.org/resource/SIO_000104",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000982",
                                "label": "written language",
                                "parent": "http://semanticscience.org/resource/SIO_000104",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000108",
                        "label": "character",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000114",
                        "label": "word",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000136",
                        "label": "description",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000090",
                                "label": "specification",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000091",
                                        "label": "action specification",
                                        "parent": "http://semanticscience.org/resource/SIO_000090",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000076",
                                                "label": "plan",
                                                "parent": "http://semanticscience.org/resource/SIO_000091",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001042",
                                                "label": "recipe",
                                                "parent": "http://semanticscience.org/resource/SIO_000091",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001043",
                                                "label": "experimental protocol",
                                                "parent": "http://semanticscience.org/resource/SIO_000091",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000964",
                                                        "label": "standard operating procedure",
                                                        "parent": "http://semanticscience.org/resource/SIO_001043",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001041",
                                                        "label": "study design",
                                                        "parent": "http://semanticscience.org/resource/SIO_001043",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001107",
                                                "label": "pathway",
                                                "parent": "http://semanticscience.org/resource/SIO_000091",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_010526",
                                                        "label": "chemical reaction pathway",
                                                        "parent": "http://semanticscience.org/resource/SIO_001107",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_010525",
                                                                "label": "biochemical pathway",
                                                                "parent": "http://semanticscience.org/resource/SIO_010526",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_010532",
                                                                        "label": "metabolic pathway",
                                                                        "parent": "http://semanticscience.org/resource/SIO_010525",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001255",
                                                                                "label": "pharmacokinetic pathway",
                                                                                "parent": "http://semanticscience.org/resource/SIO_010532",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_010533",
                                                                        "label": "regulatory pathway",
                                                                        "parent": "http://semanticscience.org/resource/SIO_010525",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_001256",
                                                                                "label": "pharmacodynamic pathway",
                                                                                "parent": "http://semanticscience.org/resource/SIO_010533",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_010527",
                                                                "label": "chemical synthesis pathway",
                                                                "parent": "http://semanticscience.org/resource/SIO_010526",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_010528",
                                                                "label": "chemical degradation pathway",
                                                                "parent": "http://semanticscience.org/resource/SIO_010526",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000315",
                                        "label": "functional specification",
                                        "parent": "http://semanticscience.org/resource/SIO_000090",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000316",
                                                "label": "design specification",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000141",
                                                        "label": "criterion",
                                                        "parent": "http://semanticscience.org/resource/SIO_000316",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000142",
                                                                "label": "inclusion criterion",
                                                                "parent": "http://semanticscience.org/resource/SIO_000141",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000143",
                                                                "label": "exclusion criterion",
                                                                "parent": "http://semanticscience.org/resource/SIO_000141",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000317",
                                                "label": "spatial specification",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000320",
                                                        "label": "coordinate system",
                                                        "parent": "http://semanticscience.org/resource/SIO_000317",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000321",
                                                                "label": "cartesian coordinate system",
                                                                "parent": "http://semanticscience.org/resource/SIO_000320",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000327",
                                                                "label": "polar coordinate system",
                                                                "parent": "http://semanticscience.org/resource/SIO_000320",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000329",
                                                                "label": "cylindrical coordinate system",
                                                                "parent": "http://semanticscience.org/resource/SIO_000320",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000330",
                                                                "label": "spherical coordinate system",
                                                                "parent": "http://semanticscience.org/resource/SIO_000320",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000600",
                                                "label": "structure",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000625",
                                                        "label": "chemical structure",
                                                        "parent": "http://semanticscience.org/resource/SIO_000600",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000626",
                                                                "label": "molecular structure",
                                                                "parent": "http://semanticscience.org/resource/SIO_000625",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001100",
                                                                        "label": "crystal structure",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000626",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001099",
                                                                "label": "electronic structure",
                                                                "parent": "http://semanticscience.org/resource/SIO_000625",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000621",
                                                "label": "formal specification",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001080",
                                                        "label": "vocabulary",
                                                        "parent": "http://semanticscience.org/resource/SIO_000621",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001396",
                                                                "label": "terminology",
                                                                "parent": "http://semanticscience.org/resource/SIO_001080",
                                                                "children": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001391",
                                                        "label": "ontology",
                                                        "parent": "http://semanticscience.org/resource/SIO_000621",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000705",
                                                "label": "design",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000912",
                                                "label": "measurement scale",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000913",
                                                        "label": "nomimal scale",
                                                        "parent": "http://semanticscience.org/resource/SIO_000912",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000914",
                                                        "label": "binary scale",
                                                        "parent": "http://semanticscience.org/resource/SIO_000912",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000915",
                                                        "label": "numeric scale",
                                                        "parent": "http://semanticscience.org/resource/SIO_000912",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000916",
                                                                "label": "decimal scale",
                                                                "parent": "http://semanticscience.org/resource/SIO_000915",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000917",
                                                                "label": "integer scale",
                                                                "parent": "http://semanticscience.org/resource/SIO_000915",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001079",
                                                "label": "genotype",
                                                "parent": "http://semanticscience.org/resource/SIO_000315",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001080",
                                                "label": "vocabulary",
                                                "parent": "http://semanticscience.org/resource/SIO_000621",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001396",
                                                        "label": "terminology",
                                                        "parent": "http://semanticscience.org/resource/SIO_001080",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000618",
                                        "label": "standard",
                                        "parent": "http://semanticscience.org/resource/SIO_000090",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001385",
                                        "label": "notation",
                                        "parent": "http://semanticscience.org/resource/SIO_000090",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001386",
                                                "label": "chemical notation",
                                                "parent": "http://semanticscience.org/resource/SIO_001385",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001387",
                                                        "label": "InCHI notation",
                                                        "parent": "http://semanticscience.org/resource/SIO_001386",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001388",
                                                "label": "sequence variation notation",
                                                "parent": "http://semanticscience.org/resource/SIO_001385",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001389",
                                                        "label": "hgvs notation",
                                                        "parent": "http://semanticscience.org/resource/SIO_001388",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000135",
                                "label": "definition",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000256",
                                "label": "proposition",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000259",
                                        "label": "argument",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000263",
                                                "label": "deductive argument",
                                                "parent": "http://semanticscience.org/resource/SIO_000259",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000264",
                                                "label": "inductive argument",
                                                "parent": "http://semanticscience.org/resource/SIO_000259",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000266",
                                                "label": "valid argument",
                                                "parent": "http://semanticscience.org/resource/SIO_000259",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000265",
                                                        "label": "sound argument",
                                                        "parent": "http://semanticscience.org/resource/SIO_000266",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000267",
                                                "label": "invalid argument",
                                                "parent": "http://semanticscience.org/resource/SIO_000259",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000261",
                                        "label": "premise",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000262",
                                        "label": "conclusion",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001331",
                                                "label": "diagnosis",
                                                "parent": "http://semanticscience.org/resource/SIO_000262",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000284",
                                        "label": "hypothesis",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000337",
                                        "label": "objective",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": [
                                            {
                                                "key": "http://www.w3id.org/iSeeOnto/aimodel#AITaskGoal",
                                                "label": "AI Task Goal",
                                                "parent": "http://semanticscience.org/resource/SIO_000337",
                                                "children": []
                                            },
                                            {
                                                "key": "https://purl.org/heals/eo#ExplanationGoal",
                                                "label": "Explanation Goal",
                                                "parent": "http://semanticscience.org/resource/SIO_000337",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000360",
                                        "label": "belief",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001004",
                                                "label": "opinion",
                                                "parent": "http://semanticscience.org/resource/SIO_000360",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001003",
                                                        "label": "diagnostic opinion",
                                                        "parent": "http://semanticscience.org/resource/SIO_001004",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001065",
                                                        "label": "speculation",
                                                        "parent": "http://semanticscience.org/resource/SIO_001004",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000585",
                                        "label": "idea",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000683",
                                        "label": "justification",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001053",
                                                "label": "reason",
                                                "parent": "http://semanticscience.org/resource/SIO_000683",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000359",
                                                        "label": "purpose",
                                                        "parent": "http://semanticscience.org/resource/SIO_001053",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001025",
                                        "label": "prognosis",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001167",
                                        "label": "comment",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001183",
                                        "label": "statement",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001384",
                                                "label": "statement of consequence",
                                                "parent": "http://semanticscience.org/resource/SIO_001183",
                                                "children": [
                                                    {
                                                        "key": "https://purl.org/heals/eo#StatementOfBias",
                                                        "label": "statement of bias",
                                                        "parent": "http://semanticscience.org/resource/SIO_001384",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001394",
                                        "label": "evidence",
                                        "parent": "http://semanticscience.org/resource/SIO_000256",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000785",
                                "label": "answer",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001017",
                                "label": "syndrome",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001166",
                                "label": "annotation",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001196",
                                "label": "history",
                                "parent": "http://semanticscience.org/resource/SIO_000136",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_010053",
                                        "label": "evolutionary lineage",
                                        "parent": "http://semanticscience.org/resource/SIO_001196",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_010060",
                                        "label": "family history",
                                        "parent": "http://semanticscience.org/resource/SIO_001196",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_010673",
                                        "label": "medical history",
                                        "parent": "http://semanticscience.org/resource/SIO_001196",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000275",
                        "label": "term",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000133",
                                "label": "descriptor",
                                "parent": "http://semanticscience.org/resource/SIO_000275",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000147",
                                        "label": "keyword",
                                        "parent": "http://semanticscience.org/resource/SIO_000133",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000179",
                                "label": "label",
                                "parent": "http://semanticscience.org/resource/SIO_000275",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000115",
                                        "label": "identifier",
                                        "parent": "http://semanticscience.org/resource/SIO_000179",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000328",
                                                "label": "positional identifier",
                                                "parent": "http://semanticscience.org/resource/SIO_000115",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000172",
                                                        "label": "address",
                                                        "parent": "http://semanticscience.org/resource/SIO_000328",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000766",
                                                        "label": "street name",
                                                        "parent": "http://semanticscience.org/resource/SIO_000328",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000768",
                                                        "label": "apartment number",
                                                        "parent": "http://semanticscience.org/resource/SIO_000328",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000653",
                                                "label": "version label",
                                                "parent": "http://semanticscience.org/resource/SIO_000115",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000186",
                                                        "label": "document version",
                                                        "parent": "http://semanticscience.org/resource/SIO_000653",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000654",
                                                        "label": "software version label",
                                                        "parent": "http://semanticscience.org/resource/SIO_000653",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001030",
                                                                "label": "major version number",
                                                                "parent": "http://semanticscience.org/resource/SIO_000654",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001031",
                                                                "label": "minor version number",
                                                                "parent": "http://semanticscience.org/resource/SIO_000654",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001032",
                                                                "label": "revision number",
                                                                "parent": "http://semanticscience.org/resource/SIO_000654",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000675",
                                                "label": "unique identifier",
                                                "parent": "http://semanticscience.org/resource/SIO_000115",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000730",
                                                "label": "physical entity identifier",
                                                "parent": "http://semanticscience.org/resource/SIO_000115",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000728",
                                                        "label": "chemical identifier",
                                                        "parent": "http://semanticscience.org/resource/SIO_000730",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000732",
                                                                "label": "molecular identifier",
                                                                "parent": "http://semanticscience.org/resource/SIO_000728",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_001075",
                                                                        "label": "microarray probe set identifier",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000732",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_010031",
                                                                        "label": "PDB chain identifier",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000732",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000731",
                                                "label": "informational entity identifier",
                                                "parent": "http://semanticscience.org/resource/SIO_000115",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000729",
                                                        "label": "record identifier",
                                                        "parent": "http://semanticscience.org/resource/SIO_000731",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_010032",
                                                                "label": "PDB record identifier",
                                                                "parent": "http://semanticscience.org/resource/SIO_000729",
                                                                "children": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000811",
                                                        "label": "URL",
                                                        "parent": "http://semanticscience.org/resource/SIO_000731",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001185",
                                                        "label": "software process identifier",
                                                        "parent": "http://semanticscience.org/resource/SIO_000731",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001319",
                                                        "label": "telephone number",
                                                        "parent": "http://semanticscience.org/resource/SIO_000731",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001320",
                                                                "label": "cellular phone number",
                                                                "parent": "http://semanticscience.org/resource/SIO_001319",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001321",
                                                                "label": "fax number",
                                                                "parent": "http://semanticscience.org/resource/SIO_001319",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001324",
                                                                "label": "work phone number",
                                                                "parent": "http://semanticscience.org/resource/SIO_001319",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_001325",
                                                                "label": "home phone number",
                                                                "parent": "http://semanticscience.org/resource/SIO_001319",
                                                                "children": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001322",
                                                        "label": "IP number",
                                                        "parent": "http://semanticscience.org/resource/SIO_000731",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001323",
                                                        "label": "email address",
                                                        "parent": "http://semanticscience.org/resource/SIO_000731",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000116",
                                        "label": "name",
                                        "parent": "http://semanticscience.org/resource/SIO_000179",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000077",
                                                "label": "generic name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000117",
                                                "label": "preferred name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000118",
                                                "label": "common name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000119",
                                                "label": "brand name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000120",
                                                "label": "scientific name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001383",
                                                        "label": "gene symbol",
                                                        "parent": "http://semanticscience.org/resource/SIO_000120",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000181",
                                                "label": "first name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000182",
                                                "label": "last name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000183",
                                                "label": "personal name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000184",
                                                        "label": "legal name",
                                                        "parent": "http://semanticscience.org/resource/SIO_000183",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001317",
                                                "label": "middle name",
                                                "parent": "http://semanticscience.org/resource/SIO_000116",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001318",
                                                        "label": "middle initial",
                                                        "parent": "http://semanticscience.org/resource/SIO_001317",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000180",
                                        "label": "language label",
                                        "parent": "http://semanticscience.org/resource/SIO_000179",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000185",
                                        "label": "title",
                                        "parent": "http://semanticscience.org/resource/SIO_000179",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000175",
                                                "label": "document title",
                                                "parent": "http://semanticscience.org/resource/SIO_000185",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000469",
                                                "label": "graph title",
                                                "parent": "http://semanticscience.org/resource/SIO_000185",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000470",
                                                "label": "primary title",
                                                "parent": "http://semanticscience.org/resource/SIO_000185",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000473",
                                                        "label": "primary graph title",
                                                        "parent": "http://semanticscience.org/resource/SIO_000470",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000474",
                                                        "label": "secondary graph title",
                                                        "parent": "http://semanticscience.org/resource/SIO_000470",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000471",
                                                "label": "secondary title",
                                                "parent": "http://semanticscience.org/resource/SIO_000185",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000237",
                                        "label": "namespace label",
                                        "parent": "http://semanticscience.org/resource/SIO_000179",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000942",
                                        "label": "numeric label",
                                        "parent": "http://semanticscience.org/resource/SIO_000179",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000326",
                                "label": "concept",
                                "parent": "http://semanticscience.org/resource/SIO_000275",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000137",
                                        "label": "category",
                                        "parent": "http://semanticscience.org/resource/SIO_000326",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000342",
                                "label": "term variant",
                                "parent": "http://semanticscience.org/resource/SIO_000275",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000122",
                                        "label": "synonym",
                                        "parent": "http://semanticscience.org/resource/SIO_000342",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000123",
                                        "label": "antonym",
                                        "parent": "http://semanticscience.org/resource/SIO_000342",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000124",
                                        "label": "hypernym",
                                        "parent": "http://semanticscience.org/resource/SIO_000342",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000125",
                                        "label": "hyponym",
                                        "parent": "http://semanticscience.org/resource/SIO_000342",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000126",
                                        "label": "homonym",
                                        "parent": "http://semanticscience.org/resource/SIO_000342",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000483",
                        "label": "phrase",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000113",
                                "label": "sentence",
                                "parent": "http://semanticscience.org/resource/SIO_000483",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000085",
                                        "label": "question",
                                        "parent": "http://semanticscience.org/resource/SIO_000113",
                                        "children": [
                                            {
                                                "key": "http://www.w3id.org/iSeeOnto/user#UserQuestion",
                                                "label": "User Question",
                                                "parent": "http://semanticscience.org/resource/SIO_000085",
                                                "children": [
                                                    {
                                                        "key": "http://www.w3id.org/iSeeOnto/user#HowQuestion",
                                                        "label": "How Question",
                                                        "parent": "http://www.w3id.org/iSeeOnto/user#UserQuestion",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://www.w3id.org/iSeeOnto/user#WhatQuestion",
                                                        "label": "What Question",
                                                        "parent": "http://www.w3id.org/iSeeOnto/user#UserQuestion",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://www.w3id.org/iSeeOnto/user#WhenQuestion",
                                                        "label": "When Question",
                                                        "parent": "http://www.w3id.org/iSeeOnto/user#UserQuestion",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://www.w3id.org/iSeeOnto/user#Where_Question",
                                                        "label": "Where Question",
                                                        "parent": "http://www.w3id.org/iSeeOnto/user#UserQuestion",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://www.w3id.org/iSeeOnto/user#WhyQuestion",
                                                        "label": "Why Question",
                                                        "parent": "http://www.w3id.org/iSeeOnto/user#UserQuestion",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000493",
                                        "label": "clause",
                                        "parent": "http://semanticscience.org/resource/SIO_000113",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000651",
                        "label": "textual entity",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000110",
                                "label": "paragraph",
                                "parent": "http://semanticscience.org/resource/SIO_000651",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000148",
                                "label": "document",
                                "parent": "http://semanticscience.org/resource/SIO_000651",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000087",
                                        "label": "publication",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000106",
                                                "label": "book",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000156",
                                                        "label": "book volume",
                                                        "parent": "http://semanticscience.org/resource/SIO_000106",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000157",
                                                        "label": "conference proceedings",
                                                        "parent": "http://semanticscience.org/resource/SIO_000106",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000109",
                                                "label": "novel",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000154",
                                                "label": "article",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001029",
                                                        "label": "peer reviewed article",
                                                        "parent": "http://semanticscience.org/resource/SIO_000154",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000155",
                                                "label": "blog",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000159",
                                                "label": "edited publication",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001169",
                                                        "label": "issue",
                                                        "parent": "http://semanticscience.org/resource/SIO_000159",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000161",
                                                "label": "manual",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000164",
                                                "label": "technical report",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000165",
                                                "label": "thesis document",
                                                "parent": "http://semanticscience.org/resource/SIO_000087",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000166",
                                                        "label": "honor's thesis",
                                                        "parent": "http://semanticscience.org/resource/SIO_000165",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000167",
                                                        "label": "master's thesis",
                                                        "parent": "http://semanticscience.org/resource/SIO_000165",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000168",
                                                        "label": "phd thesis",
                                                        "parent": "http://semanticscience.org/resource/SIO_000165",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000088",
                                        "label": "record",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000771",
                                                "label": "versioned record",
                                                "parent": "http://semanticscience.org/resource/SIO_000088",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001027",
                                                "label": "medical health record",
                                                "parent": "http://semanticscience.org/resource/SIO_000088",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000129",
                                        "label": "ontology document",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000331",
                                                "label": "OWL ontology",
                                                "parent": "http://semanticscience.org/resource/SIO_000129",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000622",
                                                "label": "RDFS ontology",
                                                "parent": "http://semanticscience.org/resource/SIO_000129",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000623",
                                                "label": "OBO ontology",
                                                "parent": "http://semanticscience.org/resource/SIO_000129",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000151",
                                        "label": "manuscript",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000152",
                                        "label": "note",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000169",
                                        "label": "booklet",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000170",
                                        "label": "diary",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000302",
                                        "label": "web page",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000304",
                                        "label": "email",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000306",
                                        "label": "letter",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001026",
                                        "label": "report",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001028",
                                                "label": "medical report",
                                                "parent": "http://semanticscience.org/resource/SIO_001026",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001373",
                                        "label": "legal document",
                                        "parent": "http://semanticscience.org/resource/SIO_000148",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000153",
                                                "label": "patent",
                                                "parent": "http://semanticscience.org/resource/SIO_001373",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001371",
                                                "label": "statute",
                                                "parent": "http://semanticscience.org/resource/SIO_001373",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001372",
                                                "label": "legislation",
                                                "parent": "http://semanticscience.org/resource/SIO_001373",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001374",
                                                "label": "brief",
                                                "parent": "http://semanticscience.org/resource/SIO_001373",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001376",
                                                "label": "bill",
                                                "parent": "http://semanticscience.org/resource/SIO_001373",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000171",
                                "label": "document component",
                                "parent": "http://semanticscience.org/resource/SIO_000651",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000111",
                                        "label": "document section",
                                        "parent": "http://semanticscience.org/resource/SIO_000171",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000107",
                                                "label": "chapter",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000188",
                                                "label": "abstract section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000189",
                                                "label": "acknowledgements section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000190",
                                                "label": "author contribution section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000191",
                                                "label": "author section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000192",
                                                "label": "bibliography section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000193",
                                                "label": "copyright section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000194",
                                                "label": "correspondence section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000195",
                                                "label": "discussion section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000196",
                                                "label": "introduction section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000197",
                                                "label": "materials and methods section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000198",
                                                "label": "materials section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000199",
                                                "label": "methods section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000200",
                                                "label": "results section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000201",
                                                "label": "table of contents",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001375",
                                                "label": "book section",
                                                "parent": "http://semanticscience.org/resource/SIO_000111",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000174",
                                        "label": "citation",
                                        "parent": "http://semanticscience.org/resource/SIO_000171",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000176",
                                        "label": "reference",
                                        "parent": "http://semanticscience.org/resource/SIO_000171",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000298",
                                "label": "excerpt",
                                "parent": "http://semanticscience.org/resource/SIO_000651",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000299",
                                        "label": "quote",
                                        "parent": "http://semanticscience.org/resource/SIO_000298",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001073",
                                "label": "text span",
                                "parent": "http://semanticscience.org/resource/SIO_000651",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000786",
                        "label": "verbal language entity",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000977",
                                "label": "syllable",
                                "parent": "http://semanticscience.org/resource/SIO_000786",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000978",
                                "label": "consonant",
                                "parent": "http://semanticscience.org/resource/SIO_000786",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000979",
                                "label": "vowel",
                                "parent": "http://semanticscience.org/resource/SIO_000786",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001040",
                        "label": "morpheme",
                        "parent": "http://semanticscience.org/resource/SIO_000078",
                        "children": []
                    }
                ]
            },
            {
                "key": "http://semanticscience.org/resource/SIO_000506",
                "label": "geometric entity",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://semanticscience.org/resource/SIO_000502",
                        "label": "polyhedral skeleton",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000503",
                        "label": "polygonal face",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000504",
                        "label": "polyhedral surface",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000505",
                        "label": "polygon",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000517",
                                "label": "quadrilateral",
                                "parent": "http://semanticscience.org/resource/SIO_000505",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000518",
                                        "label": "rectangle",
                                        "parent": "http://semanticscience.org/resource/SIO_000517",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000519",
                                                "label": "bar",
                                                "parent": "http://semanticscience.org/resource/SIO_000518",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000520",
                                "label": "triangle",
                                "parent": "http://semanticscience.org/resource/SIO_000505",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000507",
                        "label": "point",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000437",
                                "label": "2D cartesian point",
                                "parent": "http://semanticscience.org/resource/SIO_000507",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000440",
                                "label": "3D cartesian point",
                                "parent": "http://semanticscience.org/resource/SIO_000507",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000441",
                                "label": "1D cartesian point",
                                "parent": "http://semanticscience.org/resource/SIO_000507",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000465",
                                "label": "data point",
                                "parent": "http://semanticscience.org/resource/SIO_000507",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000741",
                                        "label": "stationary point",
                                        "parent": "http://semanticscience.org/resource/SIO_000465",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000742",
                                                "label": "local maximum stationary point",
                                                "parent": "http://semanticscience.org/resource/SIO_000741",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000466",
                                                        "label": "global maximal stationary point",
                                                        "parent": "http://semanticscience.org/resource/SIO_000742",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000743",
                                                "label": "local minimum stationary point",
                                                "parent": "http://semanticscience.org/resource/SIO_000741",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000467",
                                                        "label": "global minimal stationary point",
                                                        "parent": "http://semanticscience.org/resource/SIO_000743",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000532",
                                "label": "terminal point",
                                "parent": "http://semanticscience.org/resource/SIO_000507",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000508",
                                        "label": "endpoint",
                                        "parent": "http://semanticscience.org/resource/SIO_000532",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000509",
                                        "label": "start point",
                                        "parent": "http://semanticscience.org/resource/SIO_000532",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001335",
                                "label": "node",
                                "parent": "http://semanticscience.org/resource/SIO_000507",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000500",
                                        "label": "polygon vertex",
                                        "parent": "http://semanticscience.org/resource/SIO_001335",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000545",
                        "label": "polyline",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000546",
                        "label": "collection of points",
                        "parent": "http://semanticscience.org/resource/SIO_000616",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000608",
                        "label": "curve",
                        "parent": "http://semanticscience.org/resource/SIO_000506",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000511",
                                "label": "line",
                                "parent": "http://semanticscience.org/resource/SIO_000608",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000512",
                                        "label": "line segment",
                                        "parent": "http://semanticscience.org/resource/SIO_000511",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000501",
                                                "label": "polygon edge",
                                                "parent": "http://semanticscience.org/resource/SIO_000512",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000513",
                                                "label": "tick mark",
                                                "parent": "http://semanticscience.org/resource/SIO_000512",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000514",
                                                        "label": "major tick mark",
                                                        "parent": "http://semanticscience.org/resource/SIO_000513",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000515",
                                                        "label": "minor tick mark",
                                                        "parent": "http://semanticscience.org/resource/SIO_000513",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000521",
                                                "label": "directed line segment",
                                                "parent": "http://semanticscience.org/resource/SIO_000512",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000450",
                                                        "label": "axis",
                                                        "parent": "http://semanticscience.org/resource/SIO_000521",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000455",
                                                                "label": "category axis",
                                                                "parent": "http://semanticscience.org/resource/SIO_000450",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000456",
                                                                        "label": "primary category axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000455",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000457",
                                                                        "label": "secondary category axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000455",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000458",
                                                                "label": "value axis",
                                                                "parent": "http://semanticscience.org/resource/SIO_000450",
                                                                "children": [
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000451",
                                                                        "label": "Cartesian coordinate axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000458",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000452",
                                                                                "label": "x-axis",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000451",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000453",
                                                                                "label": "y-axis",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000451",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000454",
                                                                                "label": "z-axis",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000451",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000459",
                                                                        "label": "left value axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000458",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000460",
                                                                        "label": "right value axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000458",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000461",
                                                                        "label": "scaled value axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000458",
                                                                        "children": [
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000462",
                                                                                "label": "linear value axis",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000461",
                                                                                "children": []
                                                                            },
                                                                            {
                                                                                "key": "http://semanticscience.org/resource/SIO_000463",
                                                                                "label": "logarithmic value axis",
                                                                                "parent": "http://semanticscience.org/resource/SIO_000461",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000902",
                                                                        "label": "top value axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000458",
                                                                        "children": []
                                                                    },
                                                                    {
                                                                        "key": "http://semanticscience.org/resource/SIO_000903",
                                                                        "label": "bottom value axis",
                                                                        "parent": "http://semanticscience.org/resource/SIO_000458",
                                                                        "children": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000522",
                                                        "label": "arrowed line segment",
                                                        "parent": "http://semanticscience.org/resource/SIO_000521",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000523",
                                                                "label": "single arrowed line segment",
                                                                "parent": "http://semanticscience.org/resource/SIO_000522",
                                                                "children": []
                                                            },
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000524",
                                                                "label": "double arrowed line segment",
                                                                "parent": "http://semanticscience.org/resource/SIO_000522",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000516",
                                        "label": "ray",
                                        "parent": "http://semanticscience.org/resource/SIO_000511",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000540",
                                                "label": "vector line",
                                                "parent": "http://semanticscience.org/resource/SIO_000516",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000533",
                                                        "label": "surface normal",
                                                        "parent": "http://semanticscience.org/resource/SIO_000540",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000541",
                                                        "label": "vertex normal",
                                                        "parent": "http://semanticscience.org/resource/SIO_000540",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000534",
                                        "label": "positionally oriented line",
                                        "parent": "http://semanticscience.org/resource/SIO_000511",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000525",
                                                "label": "horizontal line",
                                                "parent": "http://semanticscience.org/resource/SIO_000534",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000526",
                                                "label": "vertical line",
                                                "parent": "http://semanticscience.org/resource/SIO_000534",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000535",
                                        "label": "statistical graph line",
                                        "parent": "http://semanticscience.org/resource/SIO_000511",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000527",
                                                "label": "trend line",
                                                "parent": "http://semanticscience.org/resource/SIO_000535",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000528",
                                                        "label": "increasing line",
                                                        "parent": "http://semanticscience.org/resource/SIO_000527",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000529",
                                                        "label": "decreasing line",
                                                        "parent": "http://semanticscience.org/resource/SIO_000527",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000530",
                                                        "label": "plateau line",
                                                        "parent": "http://semanticscience.org/resource/SIO_000527",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000531",
                                                "label": "drop line",
                                                "parent": "http://semanticscience.org/resource/SIO_000535",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000539",
                                        "label": "infinite line",
                                        "parent": "http://semanticscience.org/resource/SIO_000511",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001334",
                                        "label": "edge",
                                        "parent": "http://semanticscience.org/resource/SIO_000511",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000740",
                                "label": "curve segment",
                                "parent": "http://semanticscience.org/resource/SIO_000608",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001333",
                                "label": "arc",
                                "parent": "http://semanticscience.org/resource/SIO_000608",
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "key": "http://semanticscience.org/resource/SIO_000602",
                "label": "computational entity",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://linkedu.eu/dedalo/explanationPattern.owl#Explanation",
                        "label": "Explanation",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
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
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000067",
                        "label": "namespace",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000069",
                        "label": "data item",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000089",
                                "label": "dataset",
                                "parent": "http://semanticscience.org/resource/SIO_000069",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_001377",
                                        "label": "versioned dataset",
                                        "parent": "http://semanticscience.org/resource/SIO_000089",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000472",
                                "label": "scientific data",
                                "parent": "http://semanticscience.org/resource/SIO_000069",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_010019",
                                        "label": "biological data",
                                        "parent": "http://semanticscience.org/resource/SIO_000472",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_010028",
                                                "label": "genetic data",
                                                "parent": "http://semanticscience.org/resource/SIO_010019",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_010065",
                                                "label": "bioinformatic data",
                                                "parent": "http://semanticscience.org/resource/SIO_010019",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_010298",
                                                "label": "medical data",
                                                "parent": "http://semanticscience.org/resource/SIO_010019",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_011123",
                                        "label": "chemical data",
                                        "parent": "http://semanticscience.org/resource/SIO_000472",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001330",
                                "label": "metadata",
                                "parent": "http://semanticscience.org/resource/SIO_000069",
                                "children": []
                            },
                            {
                                "key": "https://purl.org/heals/eo#object_record",
                                "label": "Object Record",
                                "parent": "http://semanticscience.org/resource/SIO_000069",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000097",
                        "label": "software entity",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000098",
                                "label": "software method",
                                "parent": "http://semanticscience.org/resource/SIO_000097",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000099",
                                "label": "software module",
                                "parent": "http://semanticscience.org/resource/SIO_000097",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000100",
                                "label": "software library",
                                "parent": "http://semanticscience.org/resource/SIO_000097",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000101",
                                "label": "software application",
                                "parent": "http://semanticscience.org/resource/SIO_000097",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000102",
                                        "label": "software interpreter",
                                        "parent": "http://semanticscience.org/resource/SIO_000101",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000140",
                                        "label": "web service",
                                        "parent": "http://semanticscience.org/resource/SIO_000101",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001189",
                                                "label": "semantic web service",
                                                "parent": "http://semanticscience.org/resource/SIO_000140",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_001188",
                                                        "label": "SADI semantic web service",
                                                        "parent": "http://semanticscience.org/resource/SIO_001189",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001190",
                                                "label": "REST web service",
                                                "parent": "http://semanticscience.org/resource/SIO_000140",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001191",
                                                "label": "SOAP web service",
                                                "parent": "http://semanticscience.org/resource/SIO_000140",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000103",
                                "label": "software script",
                                "parent": "http://semanticscience.org/resource/SIO_000097",
                                "children": []
                            },
                            {
                                "key": "https://purl.org/heals/eo#Reasoning_Mode",
                                "label": "Reasoning Mode",
                                "parent": "http://semanticscience.org/resource/SIO_000097",
                                "children": []
                            },
                            {
                                "key": "https://purl.org/heals/eo#SystemTrace",
                                "label": "System Trace",
                                "parent": "https://purl.org/heals/eo#LocalExplanation",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000750",
                        "label": "database",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000752",
                        "label": "row",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_001187",
                                "label": "database row",
                                "parent": "http://semanticscience.org/resource/SIO_000752",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000753",
                        "label": "column",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000757",
                                "label": "database column",
                                "parent": "http://semanticscience.org/resource/SIO_000753",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000754",
                        "label": "database table",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000755",
                        "label": "cell (informational)",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000759",
                                "label": "unique cell",
                                "parent": "http://semanticscience.org/resource/SIO_000755",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000760",
                                "label": "referencing cell",
                                "parent": "http://semanticscience.org/resource/SIO_000755",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000761",
                                "label": "referent cell",
                                "parent": "http://semanticscience.org/resource/SIO_000755",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000756",
                        "label": "database entry",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000762",
                        "label": "database key",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000763",
                                "label": "primary database key",
                                "parent": "http://semanticscience.org/resource/SIO_000762",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000764",
                                "label": "foreign database key",
                                "parent": "http://semanticscience.org/resource/SIO_000762",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001165",
                        "label": "user account",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001300",
                        "label": "ovopub",
                        "parent": "http://semanticscience.org/resource/SIO_000602",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_001301",
                                "label": "collection ovopub",
                                "parent": "http://semanticscience.org/resource/SIO_001300",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_001302",
                                "label": "assertion ovopub",
                                "parent": "http://semanticscience.org/resource/SIO_001300",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "https://purl.org/heals/eo#SystemRecommendation",
                        "label": "System Recommendation",
                        "parent": "http://www.w3id.org/iSeeOnto/user#UserQuestionTarget",
                        "children": [
                            {
                                "key": "http://www.w3id.org/iSeeOnto/aimodel#ClassificationRecommendation",
                                "label": "Classification Recommendation",
                                "parent": "https://purl.org/heals/eo#SystemRecommendation",
                                "children": []
                            },
                            {
                                "key": "http://www.w3id.org/iSeeOnto/aimodel#RegressionRecommendation",
                                "label": "Regression Recommendation",
                                "parent": "https://purl.org/heals/eo#SystemRecommendation",
                                "children": []
                            },
                            {
                                "key": "https://purl.org/heals/eo#ModelExplanationOutputs",
                                "label": "Model Explanation Output",
                                "parent": "https://purl.org/heals/eo#SystemRecommendation",
                                "children": [
                                    {
                                        "key": "https://purl.org/heals/eo#GlobalExplanationOutput",
                                        "label": "Global Explanation",
                                        "parent": "https://purl.org/heals/eo#ModelExplanationOutputs",
                                        "children": []
                                    },
                                    {
                                        "key": "https://purl.org/heals/eo#InteractiveExplanation",
                                        "label": "Interactive Explanation",
                                        "parent": "https://purl.org/heals/eo#ModelExplanationOutputs",
                                        "children": []
                                    },
                                    {
                                        "key": "https://purl.org/heals/eo#LocalExplanation",
                                        "label": "Local Explanation",
                                        "parent": "https://purl.org/heals/eo#ModelExplanationOutputs",
                                        "children": [
                                            {
                                                "key": "https://purl.org/heals/eo#SystemTrace",
                                                "label": "System Trace",
                                                "parent": "https://purl.org/heals/eo#LocalExplanation",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "https://purl.org/heals/eo#StaticExplanation",
                                        "label": "Static Explanation",
                                        "parent": "https://purl.org/heals/eo#ModelExplanationOutputs",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "key": "http://semanticscience.org/resource/SIO_000612",
                "label": "representation",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://semanticscience.org/resource/SIO_000105",
                        "label": "symbol",
                        "parent": "http://semanticscience.org/resource/SIO_000612",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000510",
                        "label": "model",
                        "parent": "http://semanticscience.org/resource/SIO_000612",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000647",
                                "label": "process model",
                                "parent": "http://semanticscience.org/resource/SIO_000510",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000648",
                                "label": "object model",
                                "parent": "http://semanticscience.org/resource/SIO_000510",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "https://purl.org/heals/eo#ExplanationModality",
                        "label": "Explanation Modality",
                        "parent": "http://semanticscience.org/resource/SIO_000612",
                        "children": [
                            {
                                "key": "http://www.w3id.org/iSeeOnto/explainer#AudioModality",
                                "label": "Audio Modality",
                                "parent": "https://purl.org/heals/eo#ExplanationModality",
                                "children": []
                            },
                            {
                                "key": "http://www.w3id.org/iSeeOnto/explainer#VisualModality",
                                "label": "Visual Modality",
                                "parent": "https://purl.org/heals/eo#ExplanationModality",
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "key": "http://semanticscience.org/resource/SIO_001194",
                "label": "media",
                "parent": "http://semanticscience.org/resource/SIO_000015",
                "children": [
                    {
                        "key": "http://semanticscience.org/resource/SIO_000080",
                        "label": "figure",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000081",
                                "label": "image",
                                "parent": "http://semanticscience.org/resource/SIO_000080",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000082",
                                        "label": "photograph",
                                        "parent": "http://semanticscience.org/resource/SIO_000081",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000301",
                                                "label": "geographic image",
                                                "parent": "http://semanticscience.org/resource/SIO_000082",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000419",
                                "label": "table",
                                "parent": "http://semanticscience.org/resource/SIO_000080",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000904",
                                "label": "chart",
                                "parent": "http://semanticscience.org/resource/SIO_000080",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000083",
                                        "label": "statistical graph",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000423",
                                                "label": "scatterplot",
                                                "parent": "http://semanticscience.org/resource/SIO_000083",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000442",
                                                "label": "line graph",
                                                "parent": "http://semanticscience.org/resource/SIO_000083",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000443",
                                                "label": "bar graph",
                                                "parent": "http://semanticscience.org/resource/SIO_000083",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000444",
                                                        "label": "horizontal bar graph",
                                                        "parent": "http://semanticscience.org/resource/SIO_000443",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000445",
                                                        "label": "vertical bar graph",
                                                        "parent": "http://semanticscience.org/resource/SIO_000443",
                                                        "children": []
                                                    },
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000446",
                                                        "label": "stacked bar graph",
                                                        "parent": "http://semanticscience.org/resource/SIO_000443",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000447",
                                                "label": "line-bar graph",
                                                "parent": "http://semanticscience.org/resource/SIO_000083",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000909",
                                                        "label": "boxplot",
                                                        "parent": "http://semanticscience.org/resource/SIO_000447",
                                                        "children": []
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000934",
                                                "label": "stack graph",
                                                "parent": "http://semanticscience.org/resource/SIO_000083",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000908",
                                                        "label": "streamgraph",
                                                        "parent": "http://semanticscience.org/resource/SIO_000934",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000906",
                                        "label": "map",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000907",
                                        "label": "heatmap",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000910",
                                                "label": "geographic heatmap",
                                                "parent": "http://semanticscience.org/resource/SIO_000907",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000911",
                                        "label": "histogram",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000932",
                                                "label": "block histogram",
                                                "parent": "http://semanticscience.org/resource/SIO_000911",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000922",
                                        "label": "Gantt chart",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000930",
                                        "label": "matrix chart",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000931",
                                        "label": "network diagram",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_001332",
                                                "label": "directed acyclic graph",
                                                "parent": "http://semanticscience.org/resource/SIO_000931",
                                                "children": [
                                                    {
                                                        "key": "http://semanticscience.org/resource/SIO_000945",
                                                        "label": "tree diagram",
                                                        "parent": "http://semanticscience.org/resource/SIO_001332",
                                                        "children": [
                                                            {
                                                                "key": "http://semanticscience.org/resource/SIO_000948",
                                                                "label": "dendrogram",
                                                                "parent": "http://semanticscience.org/resource/SIO_000945",
                                                                "children": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000933",
                                        "label": "bubble chart",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000937",
                                        "label": "textual chart",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000936",
                                                "label": "word tree",
                                                "parent": "http://semanticscience.org/resource/SIO_000937",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000938",
                                                "label": "tag cloud",
                                                "parent": "http://semanticscience.org/resource/SIO_000937",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000939",
                                                "label": "phrase net diagram",
                                                "parent": "http://semanticscience.org/resource/SIO_000937",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000940",
                                        "label": "mereological chart",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": [
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000929",
                                                "label": "pie chart",
                                                "parent": "http://semanticscience.org/resource/SIO_000940",
                                                "children": []
                                            },
                                            {
                                                "key": "http://semanticscience.org/resource/SIO_000935",
                                                "label": "treemap",
                                                "parent": "http://semanticscience.org/resource/SIO_000940",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000946",
                                        "label": "flowchart",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": []
                                    },
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_000947",
                                        "label": "venn diagram",
                                        "parent": "http://semanticscience.org/resource/SIO_000904",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000297",
                        "label": "movie",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000396",
                        "label": "file",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_011120",
                                "label": "molecular structure file",
                                "parent": "http://semanticscience.org/resource/SIO_000396",
                                "children": [
                                    {
                                        "key": "http://semanticscience.org/resource/SIO_011130",
                                        "label": "PDB file",
                                        "parent": "http://semanticscience.org/resource/SIO_011120",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000448",
                        "label": "figure part",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": [
                            {
                                "key": "http://semanticscience.org/resource/SIO_000449",
                                "label": "plot",
                                "parent": "http://semanticscience.org/resource/SIO_000448",
                                "children": []
                            },
                            {
                                "key": "http://semanticscience.org/resource/SIO_000468",
                                "label": "legend",
                                "parent": "http://semanticscience.org/resource/SIO_000448",
                                "children": []
                            }
                        ]
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_000924",
                        "label": "television program",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001168",
                        "label": "audio recording",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001170",
                        "label": "slideshow",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": []
                    },
                    {
                        "key": "http://semanticscience.org/resource/SIO_001370",
                        "label": "slide",
                        "parent": "http://semanticscience.org/resource/SIO_001194",
                        "children": []
                    }
                ]
            }
        ];

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

        vm.hasChildren = function (item) {
            return item.children && item.children.length > 0;
        };

        vm.toggleItem = function (item, $event) {
            item.expanded = !item.expanded;
            if ($event) {
                $event.stopPropagation();
            }

        };

        vm.toggleItemSelection = function (item) {
            vm.checkDescendants(item);

            if (item.checked) {
                var elementoEncontrado = vm.buscarPorKey(vm.PresentationformatSub, item.parent);

                if (elementoEncontrado !== null || item.parent == "http://semanticscience.org/resource/SIO_000015") {
                    if (elementoEncontrado !== null) {
                        vm.checkedList.push(elementoEncontrado);
                    } else {
                        vm.checkedList.push(item);
                    }
                } else {
                    console.log("Elemento no encontrado");
                }

                var todosSonTrue = vm.verificarChecked(vm.PresentationformatSub[0]);

                if (todosSonTrue) {
                    console.log("Todos los elementos y subelementos son true");
                } else {
                    console.log("Al menos un elemento o subelemento no es true");
                }
            } else {

            }
            /*
            if (item.checked) {
                // Agregar el elemento a vm.checkedList
                vm.checkedList.push(item);
                console.log(vm.checkedList);
                // Verificar si todos los hijos están seleccionados
                var allChildrenSelected = item.children && item.children.every(function (child) {
                    return child.checked;
                });
                console.log(allChildrenSelected);
                if (allChildrenSelected) {
                    // Si todos los hijos están seleccionados, eliminar los hijos de vm.checkedList
                    vm.checkedList = vm.checkedList.filter(function (checkedItem) {
                        return !item.children.includes(checkedItem);
                    });
                }
            } else {
                // Eliminar el elemento de vm.checkedList
                var index = vm.checkedList.indexOf(item);
                if (index !== -1) {
                    vm.checkedList.splice(index, 1);
                }

                // Verificar si todos los hijos están deseleccionados
                var allChildrenUnchecked = item.children && item.children.every(function (child) {
                    return !child.checked;
                });

                if (allChildrenUnchecked) {
                    // Si todos los hijos están deseleccionados, eliminar el elemento padre de vm.checkedList
                    vm.checkedList = vm.checkedList.filter(function (checkedItem) {
                        return checkedItem !== item;
                    });
                }
            }*/


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
            if (!elemento.checked) {
                return false;
            }

            for (var i = 0; i < elemento.children.length; i++) {
                console.log(elemento.children[i]);
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
        vm.toggleSelect = function (listSub, item) {
            switch (listSub) {
                case 'Explanation Type':
                    if (item != vm.ExplanationTypeSubSelect) {
                        vm.ExplanationTypeSubSelect = item;
                    } else {
                        vm.ExplanationTypeSubSelect = '';
                    }
                    break;
                case 'Explainability Technique':
                    if (item != vm.ExplainabilityTechniqueSubSelect) {
                        vm.ExplainabilityTechniqueSubSelect = item;
                    } else {
                        vm.ExplainabilityTechniqueSubSelect = '';
                    }
                    break;
                case 'Explainer Concurrentness':
                    if (item != vm.ExplainerConcurrentnessSubSelect) {
                        vm.ExplainerConcurrentnessSubSelect = item;
                    } else {
                        vm.ExplainerConcurrentnessSubSelect = '';
                    }
                    vm.ExplainerConcurrentnessAccordionOpen = !vm.ExplainerConcurrentnessAccordionOpen;
                    break;
                case 'Explanation Scope':
                    if (item != vm.ExplanationScopeSubSelect) {
                        vm.ExplanationScopeSubSelect = item;
                    } else {
                        vm.ExplanationScopeSubSelect = '';
                    }
                    vm.ExplainerScopeAccordionOpen = !vm.ExplainerScopeAccordionOpen;
                    break;
                case 'Computational Complexity':
                    if (item != vm.ComputationalComplexitySubSelect) {
                        vm.ComputationalComplexitySubSelect = item;
                    } else {
                        vm.ComputationalComplexitySubSelect = '';
                    }
                    vm.ComputationalComplexityAccordionOpen = !vm.ComputationalComplexityAccordionOpen;
                    break;
                case 'Implementation Framework':
                    if (item != vm.ImplementationFrameworkSubSelect) {
                        vm.ImplementationFrameworkSubSelect = item;
                    } else {
                        vm.ImplementationFrameworkSubSelect = '';
                    }
                    vm.ImplementationFrameworksAccordionOpen = !vm.ImplementationFrameworksAccordionOpen;
                    break;
                case 'Explainer':
                    if (item != vm.ExplainersSubSelect) {
                        vm.ExplainersSubSelect = item;
                    } else {
                        vm.ExplainersSubSelect = '';
                    }
                    vm.explainerAccordionOpen = !vm.explainerAccordionOpen;
                    break;
                default:
                    break;
            }
        };

        vm.closeForm=function () {
            var modalFormSub = document.getElementById("formSubstitute");
            modalFormSub.style.display = "none";
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
                        vm.ExplanationTypeSubSelect = []
                        vm.ExplainabilityTechniqueSubSelect = [];
                        vm.ExplainerConcurrentnessSubSelect = [];
                        vm.ComputationalComplexitySubSelect = [];
                        vm.ImplementationFrameworkSubSelect = [];
                        vm.checkedList = [];
                        vm.ExplanationScopeSubSelect = []

                        vm.TitleName = vm.original.name;
                        if (vm.original.title != "Explanation Method" && Object.keys(vm.JsonParams).length == 0) {
                            paramsExpValue(vm.original.title);
                        }

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
                if (vm.original.category == 'composite') {
                    vm.ExplanationTypeSubSelect = []
                    vm.ExplainabilityTechniqueSubSelect = [];
                    vm.ExplainerConcurrentnessSubSelect = [];
                    vm.ComputationalComplexitySubSelect = [];
                    vm.ImplementationFrameworkSubSelect = [];
                    vm.ExplanationScopeSubSelect = [];
                    vm.checkedList = [];
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
            vm.idModelUrl = urlSplit[3];

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

        function FormSubstitute() {
            var modalFormSub = document.getElementById("formSubstitute");
            modalFormSub.style.display = "block";
        }

        function submitFormSub(item) {

        }

        function SubstituteNodes(NodeSelect) {
          
            var existDiv = document.getElementsByClassName("mi-divCanvasGeneral");
            if (existDiv.length > 0) {
                existDiv[0].remove();
            }

            var padre = document.querySelector('.editor-page');
            var divGeneral = document.createElement('div');
            divGeneral.style.left = '0';
            divGeneral.style.right = '0';
            divGeneral.style.backgroundColor = 'black';
            divGeneral.style.padding = '10px';
            divGeneral.style.zIndex = '90';
            divGeneral.style.opacity = "1";
            divGeneral.style.marginRight = "250px";
            divGeneral.style.marginLeft = "250px";
            divGeneral.style.bottom = '0';
            divGeneral.style.position = 'fixed';
            divGeneral.style.height = '500px';
            divGeneral.className = "mi-divCanvasGeneral";
            padre.appendChild(divGeneral);

            var canvas = document.createElement('div');
            canvas.style.backgroundColor = 'red';
            canvas.style.width = '100%';
            canvas.style.position = 'fixed';
            canvas.className = "mi-divCanvas";


            var divbuttons = document.createElement('div');
            divbuttons.style.width = '100%';
            divbuttons.style.marginRight = "auto";
            divbuttons.className = "mi-divButtons";

            divGeneral.appendChild(canvas);

            divGeneral.appendChild(divbuttons);

            CreateButtonExit(divGeneral, padre, true);


            /*
            var a = {
                "nodes": {
                    "b79d53a4-7145-4ee8-9bfc-b07a32f4c4ad": {
                        "id": "b79d53a4-7145-4ee8-9bfc-b07a32f4c4ad",
                        "Concept": "Sequence",
                        "Instance": "Sequence",
                        "description": "",
                        "display": {
                            "x": -24,
                            "y": 108
                        },
                        "firstChild": {
                            "Id": "3edf4484-b927-4289-aac6-47fc52740a33",
                            "Next": {
                                "Id": "bc77db9f-259e-49e7-8698-06da9c2917fb",
                                "Next": null
                            }
                        }
                    },
                    "3edf4484-b927-4289-aac6-47fc52740a33": {
                        "id": "3edf4484-b927-4289-aac6-47fc52740a33",
                        "Concept": "Explanation Method",
                        "Instance": "/Images/Anchors",
                        "description": "",
                        "display": {
                            "x": -96,
                            "y": 252
                        },
                        "params": {
                            "threshold": {
                                "key": "threshold",
                                "value": 0.95,
                                "default": 0.95,
                                "range": [
                                    0,
                                    1
                                ],
                                "required": "false",
                                "description": "The minimum level of precision required for the anchors. Default is 0.95",
                                "type": "number"
                            },
                            "segmentation_fn": {
                                "key": "segmentation_fn",
                                "value": "slic",
                                "default": "slic",
                                "range": [
                                    "slic",
                                    "quickshift",
                                    "felzenszwalb"
                                ],
                                "required": "false",
                                "description": "A string with an image segmentation algorithm from the following:'quickshift', 'slic', or 'felzenszwalb'.",
                                "type": "select"
                            },
                            "png_width": {
                                "key": "png_width",
                                "value": 400,
                                "default": 400,
                                "range": [
                                    null,
                                    null
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
                                    null,
                                    null
                                ],
                                "required": "false",
                                "description": "Height (in pixels) of the png image containing the explanation.",
                                "type": "number"
                            }
                        }
                    },
                    "bc77db9f-259e-49e7-8698-06da9c2917fb": {
                        "id": "bc77db9f-259e-49e7-8698-06da9c2917fb",
                        "Concept": "Explanation Method",
                        "Instance": "/Tabular/IREX",
                        "description": "",
                        "display": {
                            "x": 96,
                            "y": 252
                        },
                        "params": {
                            "expected_answers": {
                                "key": "expected_answers",
                                "value": "[ ]",
                                "default": "[ ]",
                                "range": [
                                    null,
                                    null
                                ],
                                "required": true,
                                "description": "Array containing the expected answers (according to experts) to the questions of a questionnaire that supossedly contribute to the target class.",
                                "type": "text"
                            },
                            "threshold": {
                                "key": "threshold",
                                "value": 0.01,
                                "default": 0.01,
                                "range": [
                                    0,
                                    1
                                ],
                                "required": "false",
                                "description": "A float between 0 and 1 for the threshold that will be used to determine anomalous variables. If a feature seems to be contradictory but its absolute ALE value is below this threshold, it will not be considered anomalous. Defaults to 0.01.",
                                "type": "number"
                            },
                            "classes_to_show": {
                                "key": "classes_to_show",
                                "value": "[ ]",
                                "default": "[ ]",
                                "range": [
                                    null,
                                    null
                                ],
                                "required": "false",
                                "description": "Array of string representing the names of the classes to be explained. Defaults to all classes.",
                                "type": "text"
                            }
                        }
                    },
                }
            }*/

            var a = {
                "OptionsSub": {
                    "nodes1": {
                        "b79d53a4-7145-4ee8-9bfc-b07a32f4c4ad": {
                            "id": "b79d53a4-7145-4ee8-9bfc-b07a32f4c4ad",
                            "Concept": "Sequence",
                            "Instance": "Sequence",
                            "description": "",
                            "display": {
                                "x": -24,
                                "y": 108
                            },
                            "firstChild": {
                                "Id": "3edf4484-b927-4289-aac6-47fc52740a33",
                                "Next": {
                                    "Id": "bc77db9f-259e-49e7-8698-06da9c2917fb",
                                    "Next": null
                                }
                            }
                        },
                        "3edf4484-b927-4289-aac6-47fc52740a33": {
                            "id": "3edf4484-b927-4289-aac6-47fc52740a33",
                            "Concept": "Explanation Method",
                            "Instance": "/Images/Anchors",
                            "description": "",
                            "display": {
                                "x": -96,
                                "y": 252
                            },
                            "params": {
                                "threshold": {
                                    "key": "threshold",
                                    "value": 0.95,
                                    "default": 0.95,
                                    "range": [
                                        0,
                                        1
                                    ],
                                    "required": "false",
                                    "description": "The minimum level of precision required for the anchors. Default is 0.95",
                                    "type": "number"
                                },
                                "segmentation_fn": {
                                    "key": "segmentation_fn",
                                    "value": "slic",
                                    "default": "slic",
                                    "range": [
                                        "slic",
                                        "quickshift",
                                        "felzenszwalb"
                                    ],
                                    "required": "false",
                                    "description": "A string with an image segmentation algorithm from the following:'quickshift', 'slic', or 'felzenszwalb'.",
                                    "type": "select"
                                },
                                "png_width": {
                                    "key": "png_width",
                                    "value": 400,
                                    "default": 400,
                                    "range": [
                                        null,
                                        null
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
                                        null,
                                        null
                                    ],
                                    "required": "false",
                                    "description": "Height (in pixels) of the png image containing the explanation.",
                                    "type": "number"
                                }
                            }
                        },
                        "bc77db9f-259e-49e7-8698-06da9c2917fb": {
                            "id": "bc77db9f-259e-49e7-8698-06da9c2917fb",
                            "Concept": "Explanation Method",
                            "Instance": "/Tabular/IREX",
                            "description": "",
                            "display": {
                                "x": 96,
                                "y": 252
                            },
                            "params": {
                                "expected_answers": {
                                    "key": "expected_answers",
                                    "value": "[ ]",
                                    "default": "[ ]",
                                    "range": [
                                        null,
                                        null
                                    ],
                                    "required": true,
                                    "description": "Array containing the expected answers (according to experts) to the questions of a questionnaire that supossedly contribute to the target class.",
                                    "type": "text"
                                },
                                "threshold": {
                                    "key": "threshold",
                                    "value": 0.21,
                                    "default": 0.01,
                                    "range": [
                                        0,
                                        1
                                    ],
                                    "required": "false",
                                    "description": "A float between 0 and 1 for the threshold that will be used to determine anomalous variables. If a feature seems to be contradictory but its absolute ALE value is below this threshold, it will not be considered anomalous. Defaults to 0.01.",
                                    "type": "number"
                                },
                                "classes_to_show": {
                                    "key": "classes_to_show",
                                    "value": "[ ]",
                                    "default": "[ ]",
                                    "range": [
                                        null,
                                        null
                                    ],
                                    "required": "false",
                                    "description": "Array of string representing the names of the classes to be explained. Defaults to all classes.",
                                    "type": "text"
                                }
                            }
                        },
                    },
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
            

            var editor1 = new b3e.editor.Editor();
            editor1.project.create();
            editor1.applySettingsFormat(canvas);
            var p = editor1.project.get();


            divGeneral.appendChild(editor1._game.canvas);

            var TressOptions = editor1.import.treeAsDataSubti(a, p);
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

        }

        function CambiarOptionTree(treeId, editor1) {
            var p = editor1.project.get();

            p.trees.select(treeId.id);

            var t = p.trees.getSelected();
            var s = t.blocks.getAll();

            return s;
        }
        function updateNodeSub(TreeSub, nodeSelect, editor1, aaa, divGeneral) {
            if (aaa == undefined) {
                aaa =  CambiarOptionTree(TreeSub,editor1)
            }
            var pSub = editor1.project.get();
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
            if (str === '' || str.trim() === '') {
                return false;
            }
            try {
                return btoa(atob(str)) == str;
            } catch (err) {
                return false;
            }
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

        function UpdateProperties(option) {
            if (vm.original.name == "Explanation Method") {
                paramsExp(option);
            }

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
                    properties: tine.merge({}, selecionado.properties),
                    description: selecionado.description,
                    propertyExpl: selecionado.propertyExpl
                };
            } else {
                vm.block = {
                    title: option,
                    properties: tine.merge({}, vm.original.properties),
                    description: vm.original.description
                };
            }

            _SearchSubstituteExplainers();
            cancelTimeout();
            update();
        }


        function change() {
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
            divElement.style.borderRadius = '50%';
            divElement.style.cursor = 'pointer';
            divElement.style.marginRight = "250px";
            divElement.style.marginLeft = "255px";
            divElement.style.zIndex = '90';
            divElement.style.bottom = (nuevoDiv.offsetHeight - 5) + 'px';
            divElement.className = "mi.close";
            //Insert icon 
            divElement.innerHTML = '<i class="fa fa-times" aria-hidden="true" style="color: red; font-size: 30px;"></i>';

            padre.appendChild(divElement);
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


        function paramsExp(option) {
            var IdModel = "";

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
                    CreateParams(x.params);
                });
        }

        function CreateParams(params) {
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
            change();
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

        function GetInfoParamSubstitute(NameExpl, option) {
            var SubNameChange = [vm.block.title, NameExpl];

            projectModel.GetSimNL(SubNameChange)
                .then(function (x) {
                    CreateTooltip(x, option);
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

        function startTimeout(key, option) {
            switch (option) {
                case 'Explanation':
                    vm.timeoutPromise = $timeout(function () {
                        LookDescriptionExplanation(key, option);
                    }, 1000);
                    break;
                case 'substitute':
                    vm.timeoutPromise = $timeout(function () {
                        GetInfoParamSubstitute(key, option);
                    }, 1000);
                    break;
                case 'title':
                    vm.timeoutPromise = $timeout(function () {
                        mostrarTexto(key, option);
                    }, 500);
                    break;
                default:
                    break;
            }
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
            var estaEnLaLista = vm.AllProperties.findIndex(element => element.id == vm.original.id && vm.original.title == element.value);

            if (estaEnLaLista != -1) {
                vm.AllProperties[estaEnLaLista].description = vm.block.description;
                vm.AllProperties[estaEnLaLista].properties = vm.original.properties;
            }
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



