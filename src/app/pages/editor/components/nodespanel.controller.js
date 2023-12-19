(function () {
    'use strict';

    angular
        .module('app')
        .controller('NodespanelController', NodespanelController);

    NodespanelController.$inject = [
        '$scope',
        '$window',
        'dialogService',
        'notificationService'
    ];

    function NodespanelController($scope,
        $window,
        dialogService,
        notificationService) {

        // HEAD //
        var vm = this;
        vm.nodes = null;
        vm.newTree = newTree;
        vm.ViewProperties = ViewProperties;
        vm.select = select;
        vm.remove = remove;

        _create();
        _activate();
        $scope.$on('$destroy', _destroy);

        // BODY //
        function _activate() {
            vm.trees = [];
            vm.nodes = {
                action: [],
                condition: [],
                composite: [],
                decorator: [],
            };

 
            var p = $window.editor.project.get();

            p.nodes.each(function (node) {

                switch (node.name) {
                    case "User Question":
                    case "Failer":
                    case "Succeeder":
                        break;
                    default:
                        if (node.category === 'tree') return;

                        var list = vm.nodes[node.category];

                        if (!list) return;
                        list.push({
                            name: node.name,
                            title: _getTitle(node),
                            isDefault: node.isDefault
                        })
                        break;
                }

            });

            var selected = p.trees.getSelected();
            p.trees.each(function (tree) {
                var root = tree.blocks.getRoot();
                vm.trees.push({
                    'id': tree._id,
                    'name': root.title || 'A behavior tree',
                    'active': tree === selected,
                });
            });


        }

        function _event(e) {
            setTimeout(function () { $scope.$apply(function () { _activate(); }); }, 0);
        }


        function _create() {
            $window.editor.on('nodechanged', _event);
            $window.editor.on('noderemoved', _event);
            $window.editor.on('nodeadded', _event);
            $window.editor.on('treeadded', _event);
            $window.editor.on('blockchanged', _event);
            $window.editor.on('treeselected', _event);
            $window.editor.on('treeremoved', _event);
            $window.editor.on('treeimported', _event);
        }

        function _destroy() {
            $window.editor.off('nodechanged', _event);
            $window.editor.off('noderemoved', _event);
            $window.editor.off('nodeadded', _event);
            $window.editor.off('treeadded', _event);
            $window.editor.off('blockchanged', _event);
            $window.editor.off('treeselected', _event);
            $window.editor.off('treeremoved', _event);
            $window.editor.off('treeimported', _event);
        }

        function _getTitle(node) {
            var title = node.title || node.name;
            try {
                title = title.replace(/(<\w+>)/g, function (match, key) { return '@'; });
            } catch (error) {
                console.log(error);
            }
            return title;
        }

        function newTree() {
            var p = $window.editor.project.get();
            p.trees.add();
        }

        function ViewProperties() {
            var project = editor.project.get();
            var tree = project.trees.getSelected();

            var r = tree.blocks.getRoot();
            var i = tree.blocks.getIntends(r.title);

            tree.selection.deselectAll();
            tree.selection.select(i);
        }

        function select(id) {
            var p = $window.editor.project.get();
            p.trees.select(id);
        }

        function remove(id) {
            dialogService.
                confirm(
                    'Remove tree?',
                    'Are you sure you want to remove this tree?\n\nNote: all blocks using this tree will be removed.'
                ).then(function () {
                    var p = $window.editor.project.get();
                    p.trees.remove(id);
                    notificationService.success(
                        'Tree removed',
                        'The tree has been removed from this project.'
                    );
                });
        }
    }
})();