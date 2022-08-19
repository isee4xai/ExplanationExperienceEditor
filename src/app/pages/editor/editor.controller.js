angular
    .module('app')
    .controller('EditorController', EditorController);

EditorController.$inject = [
    '$state',
    '$location',
    'projectModel',
];

function EditorController($state, $location, projectModel) {
    //get id from url
    var url = $location.url().slice(1);
    var Id = url.slice(3);
    //regular expression to accept only numbers
    var regex = /^id=[0-9]*$/;
    var onlyNumbers = regex.test(Id);

    _activate();

    function _activate() {
        //if we pass an id to the editor we open the project
        if (url == "editor" || url == "") {} else if (Id == "" || onlyNumbers) {
            $state.go('id.error');
        } else {
            projectModel
                .openProjectId(Id)
                .then(function(x) {
                    // send you to the error page if the call to the service does not return data
                    if (x == null) {
                        $state.go('id.error');
                    }
                });
        }

    }

}