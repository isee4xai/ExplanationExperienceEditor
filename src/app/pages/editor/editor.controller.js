angular
    .module('app')
    .controller('EditorController', EditorController);

EditorController.$inject = [
    '$state',
    '$location',
    'projectModel',
];

function EditorController($state, $location, projectModel) {
    var url = $location.url().slice(1);
    var Id = url.slice(3);
    const regex = /^id=[0-9]*$/;
    const onlyNumbers = regex.test(Id);

    _activate();

    function _activate() {
        //if we pass an id to the editor we open the project
        if (url == "editor" || url == "") {} else if (Id == "" || onlyNumbers) {
            $state.go('id.error');
        } else {
            projectModel
                .openProjectId(Id)
                .then(function(x) {
                    if (x == null) {
                        $state.go('id.error');
                    }
                });
        }

    }

}