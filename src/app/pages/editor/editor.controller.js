angular
    .module('app')
    .controller('EditorController', EditorController);

EditorController.$inject = [
    '$state',
    '$location',
    'projectModel',
    'dialogService',
    'systemService'

];

function EditorController($state, $location, projectModel, dialogService, systemService) {


    //get id from url
    var url = $location.url().slice(1);
    urlSplit = url.split("/");
    console.log(url);
    var cmd = urlSplit[0];
    console.log(cmd);
    var Id = ""
    if(urlSplit.length>1)
        Id = urlSplit[1];
    console.log(Id);

    _activate();


    function _activate() {
        if (typeof url === 'undefined'){
            $state.go('dash.projects');
        }
        //if we pass an id to the editor we open the project
        if (cmd == "editor" || cmd=="view" || cmd == "") {
            /*
            projectModel
                .getRecentProjects()
                .then(function(recents) {
                    if (recents.length == 0) {
                        isDesktop = systemService.isDesktop;
                        dialogService
                            .prompt('New project', null, 'input', 'Project name')
                            .then(function(name) {
                                // If no name provided, abort
                                if (!name) {
                                    notificationService.error(
                                        'Invalid name',
                                        'You must provide a name for the project.'
                                    );
                                    return;
                                }
                                // If desktop, open file dialog
                                if (isDesktop) {
                                    var placeholder = name.replace(/\s+/g, "_").toLowerCase();
                                    dialogService
                                        .saveAs(placeholder, ['.b3', '.json'])
                                        .then(function(path) {
                                            _newProject(path, name);
                                        });
                                } else {
                                    var path = 'b3projects-' + b3.createUUID();
                                    _newProject(path, name);
                                }
                                location.reload();
                            });
                    }
                });*/

        } else if (Id == "") {
            $state.go('id.error');
        } else {
            console.log("opening project: "+ Id);
            projectModel
                .openProjectId(Id)
                .then(function(x) {
                    // send you to the error page if the call to the service does not return data
                    if (x == null) {
                        $state.go('id.error');
                    }

                });
            projectModel
                .getRecentProjects()
                .then(function(recents) {
                    if (recents.length == 0) {
                        location.reload();
                    }
                });
        }

    }

    function _newProject(path, name) {
        projectModel
            .newProject(path, name)
            .then(function() {
                $state.go('editor');
            });
    }

}
