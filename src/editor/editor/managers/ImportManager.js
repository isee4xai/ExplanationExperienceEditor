b3e.editor.ImportManager = function(editor) {
    "use strict";

    this.projectAsData = function(data) {
        var project = editor.project.get();
        if (!project) return;

        if (data.custom_nodes) this.nodesAsData(data.custom_nodes);
        if (data.trees) this.treesAsData(data.trees);
        if (data.selectedTree) {
            project.trees.select(data.selectedTree);
        }
        editor.trigger('projectimported');
    };

    this.treeAsData = function(data) {
        var project = editor.project.get();
        if (!project) return;

        var tree = project.trees.add(data.id);
        var root = tree.blocks.getRoot();
        var first = null;

        // Tree data
        var display = data.display || {};
        tree.x = display.camera_x || 0;
        tree.y = display.camera_y || 0;
        tree.scaleX = display.camera_z || 1;
        tree.scaleY = display.camera_z || 1;
        var treeNode = project.nodes.get(tree._id);
        treeNode.title = data.Instance || data.title;

        root.title = data.Instance || data.title;
        root.description = data.description;
        root.properties = data.properties;
        root.params = data.params;
        root.Image = data.Image;
        root.Json = data.Json;
        root.idModel = data.idModel;
        root.query = data.query;
        root.query_id = data.query_id;
        root.img = data.img;
        root.propertyExpl = data.Instance;
        root.DataType = data.DataType;
        root.VariableName = data.VariableName;
        root.x = display.x || 0;
        root.y = display.y || 0;

        // Custom nodes
        if (data.custom_nodes) this.nodesAsData(data.custom_nodes);

        var id, spec;

        // Add blocks
        for (id in data.nodes) {

            spec = data.nodes[id];
            var block = null;
            display = spec.display || {};

            block = tree.blocks.add(spec.Concept || spec.name, spec.display.x, spec.display.y);
            block.id = spec.id;
            block.title = spec.Instance || spec.title;
            block.description = spec.description;
            block.properties = tine.merge({}, block.properties, spec.properties);
            block.params = tine.merge({}, block.params, spec.params);
            block.idModel = spec.idModel;
            block.query = spec.query;
            block.query_id = spec.query_id;
            block.img = spec.img;
            block.Image = spec.Image;
            block.Json = spec.Json;

            //
            var propertiesExpl = {};
            let ArrayNameProperties = Object.keys(spec);

            for (let index = 0; index < ArrayNameProperties.length; index++) {
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
                    case "Concept":
                        break;
                    case "Instance":
                        break;
                    case "display":
                        break;
                    case "params":
                        break;
                    case "Image":
                        break;
                    default:
                        if (Array.isArray(spec[ArrayNameProperties[index]])) {

                            propertiesExpl[ArrayNameProperties[index]] = spec[ArrayNameProperties[index]];
                        } else {
                            propertiesExpl[ArrayNameProperties[index]] = spec[ArrayNameProperties[index]];
                        }

                        break;
                }
            }
            block.propertyExpl = tine.merge({}, block.propertyExpl, propertiesExpl);
            block.DataType = spec.DataType;
            block.VariableName = spec.VariableName;

            block._redraw();

            if (spec.id === data.root) {
                first = block;
            }
        }

        // Add connections
        for (id in data.nodes) {
            spec = data.nodes[id];
            var inBlock = tree.blocks.get(id);

            var children = null;
            if (inBlock.category === 'composite' && spec.firstChild) {
                children = spec.firstChild;
            } else if (spec.firstChild && (inBlock.category == 'decorator' ||
                    inBlock.category == 'root')) {
                children = spec.firstChild;
            }


            if (children) {
                var propertieNext = ["Next"];
                var IdProper = ["Id"];

                var RouteOfObject = children["Next"];
                var RouteOfObjectId = children["Id"];


                while (RouteOfObject != null) {

                    var outBlock = tree.blocks.get(RouteOfObjectId);
                    tree.connections.add(inBlock, outBlock);

                    RouteOfObjectId = RouteOfObject[IdProper];
                    RouteOfObject = RouteOfObject[propertieNext];

                }
                var outBlock = tree.blocks.get(RouteOfObjectId);
                tree.connections.add(inBlock, outBlock);
            }


            var children = null;
            if (inBlock.category === 'composite' && spec.children) {
                children = spec.children;
            } else if (spec.child && (inBlock.category == 'decorator' ||
                    inBlock.category == 'root')) {
                children = [spec.child];
            }

            if (children) {
                for (var i = 0; i < children.length; i++) {
                    var outBlock = tree.blocks.get(children[i]);
                    tree.connections.add(inBlock, outBlock);
                }
            }

        }

        // Finish
        if (first) {
            tree.connections.add(root, first);
        }

        if (!data.display) {
            tree.organize.organize(true);
        }

        tree.selection.deselectAll();
        tree.selection.select(root);
        project.history.clear();

        editor.trigger('treeimported');
    };

    this.treesAsData = function(data) {
        for (var i = 0; i < data.length; i++) {
            this.treeAsData(data[i]);
        }
    };

    this.nodesAsData = function(data) {
        var project = editor.project.get();
        if (!project) return;

        for (var i = 0; i < data.length; i++) {
            var template = data[i];
            project.nodes.add(template);
        }
        editor.trigger('nodeimported');
    };
    this._applySettings = function(settings) {};
};