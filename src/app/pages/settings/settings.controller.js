(function() {
    'use strict';

    angular
        .module('app')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        'notificationService',
        'settingsModel',
        'dialogService',
    ];

    function SettingsController(notificationService,
        settingsModel,
        dialogService) {

        // HEADER //
        var vm = this;
        vm.settings = {};
        vm.httpAddresModels;
        vm.httpAddresExplanations;
        vm.httpAddresEvaluationsAndProject;

        vm.saveSettings = saveSettings;
        vm.resetSettings = resetSettings;


        _activate();

        // BODY //
        function _activate() {

            settingsModel
                .getSettings()
                .then(function(settings) {
                    vm.settings = settings;
                    vm.httpAddresModels = settings.httpAddresModels;
                    vm.httpAddresExplanations = settings.httpAddresExplanations;
                    vm.httpAddresEvaluationsAndProject = settings.httpAddresEvaluationsAndProject;
                });
        }

        function saveSettings() {

            if (vm.httpAddresEvaluationsAndProject != vm.settings.httpAddresEvaluationsAndProject ||
                vm.httpAddresExplanations != vm.settings.httpAddresExplanations ||
                vm.httpAddresModels != vm.settings.httpAddresModels) {

                vm.settings.httpAddresEvaluation = vm.settings.httpAddresEvaluationsAndProject + "Evaluation";
                vm.settings.httpAddresProjects = vm.settings.httpAddresEvaluationsAndProject + "Projects";
                vm.settings.httpAddresProjectsPath = vm.settings.httpAddresEvaluationsAndProject + "Projects?path=";
                vm.settings.AddresExplainers = vm.settings.httpAddresExplanations + "Explainers";
                vm.settings.AddresModels = vm.settings.httpAddresModels + "model_list";
                vm.settings.AddresQuery = vm.settings.httpAddresModels + "query";
            }

            settingsModel
                .saveSettings(vm.settings)
                .then(function() {
                    notificationService.success(
                        'Settings saved',
                        'The editor settings has been updated.'
                    );
                    _activate();
                });
        }

        function resetSettings() {
            dialogService.confirm(
                'Reset Settings?',
                'Are you sure you want to reset to the default settings?'
            ).then(function() {
                settingsModel
                    .resetSettings()
                    .then(function() {
                        notificationService.success(
                            'Settings reseted',
                            'The editor settings has been updated to default values.'
                        );
                        _activate();
                    });
            });
        }
    }
})();