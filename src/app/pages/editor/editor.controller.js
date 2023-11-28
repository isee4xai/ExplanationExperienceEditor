angular
    .module('app')
    .controller('EditorController', EditorController);

EditorController.$inject = [
    '$state',
    '$window',
    '$location',
    'projectModel',
    'dialogService',
    'systemService'
];

function EditorController($state, $window, $location, projectModel, dialogService, systemService) {
 
    //get id from url
    var url = $location.url().slice(1);
    urlSplit = url.split("/");
    var cmd = urlSplit[0];
    var Id = "";
    var Type = "";
    if (urlSplit.length > 1) {
        Id = urlSplit[1];
        Type = urlSplit[0];

        if (Id.includes("?")) {
            Id = Id.split("?")[0];
        }
    }

    _activate();


    function _activate() {
        if (typeof url === 'undefined') {
            $state.go('dash.projects');
        }

        switch (Type) {

            case "editor":
            case "view":
            case "":
                break;
            case "id":
            case "vid":

                if (Id == "") {
                    $state.go('id.error');
                } else {
                    projectModel
                        .getRecentProjects()
                        .then(function (recents) {
                            const resultado = recents.find(elemento => elemento.id === Id);
/*
                            console.log(recents);
                            console.log(resultado);
                            console.log(Id);
*/
                            if (recents != undefined && resultado != undefined) {
                                recents.forEach(element => {
                                    if (element.isOpen == true && element.id != Id) {
                                        element.isOpen = false ;
                                    }else if( element.id == Id){
                                        element.isOpen = true ;
                                    }
                                }); 
                            }
                           
                            if (resultado == undefined) {
                                projectModel
                                    .openProjectId(Id)
                                    .then(function (x) {
                                        // send you to the error page if the call to the service does not return data

                                        console.log(x);
                                        if (x == null) {
                                            $state.go('id.error');
                                        } else {
                                            if (Type == "vid") {
                                                var project = $window.editor.project.get();
                                                var tree = project.trees.getSelected();
                                                tree.organize.organize();
                                            } else {
                                                //   location.reload();
                                            }
                                        }
                                    });

                            }
                        });
                }
                break;
            default:
                break;
        }
        

    }

    function _newProject(path, name) {
        projectModel
            .newProject(path, name)
            .then(function () {
                $state.go('editor');
            });
    }

}
