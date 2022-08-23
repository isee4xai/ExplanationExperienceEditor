b3e.editor.ExportManager = function(editor) {
    "use strict";

    function getBlockChildrenIds(block) {
        var conns = block._outConnections.slice(0);
        if (editor._settings.get('layout') === 'horizontal') {
            conns.sort(function(a, b) {
                return a._outBlock.y -
                    b._outBlock.y;
            });
        } else {
            conns.sort(function(a, b) {
                return a._outBlock.x -
                    b._outBlock.x;
            });
        }

        var nodes = [];
        for (var i = 0; i < conns.length; i++) {
            nodes.push(conns[i]._outBlock.id);
        }

        return nodes;
    }

    this.projectToData = function() {
        var project = editor.project.get();

        if (!project) return;

        var tree = project.trees.getSelected();

        var data = {
            version: b3e.VERSION,
            scope: 'project',
            selectedTree: (tree ? tree._id : null),
            trees: [],
            custom_nodes: this.nodesToData()
        };
        project.trees.each(function(tree) {

            var d = this.treeToData(tree, true);
            d.id = tree._id;
            data.trees.push(d);
        }, this);
        return data;
    };

    this.treeToData = function(tree, ignoreNodes) {
        var project = editor.project.get();
        if (!project) return;

        if (!tree) {
            tree = project.trees.getSelected();
        } else {
            tree = project.trees.get(tree);
            if (!tree) return;
        }

        var root = tree.blocks.getRoot();

        var first = getBlockChildrenIds(root);

        var data = {
            version: b3e.VERSION,
            scope: 'tree',
            id: tree._id,
            Instance: root.title,
            description: root.description,
            root: first[0] || null,
            properties: root.properties,
        };

        if (root.hasOwnProperty("ModelRoot")) {
            if (root.ModelRoot.hasOwnProperty("query")) {
                data.query = root.ModelRoot.query;
            }
            if (root.ModelRoot.hasOwnProperty("img")) {
                var reader = new FileReader();
                reader.readAsDataURL(root.ModelRoot.img);
                reader.onload = function() {
                    data.img = reader.result;
                };
                reader.onerror = function(error) {
                    console.log('Error: ', error);
                };

            }
            if (root.ModelRoot.hasOwnProperty("idModel")) {
                data.idModel = root.ModelRoot.idModel;
            }
            if (root.ModelRoot.hasOwnProperty("query_id")) {
                data.query_id = root.ModelRoot.query_id;
            }
        }

        if (!ignoreNodes) {
            data.custom_nodes = this.nodesToData();
        }

        data.nodes = {};
        data.display = {
            camera_x: tree.x,
            camera_y: tree.y,
            camera_z: tree.scaleX,
            x: root.x,
            y: root.y,
        };


        tree.blocks.each(function(block) {
            if (block.category !== 'root') {
                var d = {
                    id: block.id,
                    Concept: block.name,
                    Instance: block.title,
                    description: block.description,
                    properties: block.properties,
                    display: { x: block.x, y: block.y }
                };
                if (block.name === 'Explanation Method') {

                    if (block.hasOwnProperty("params")) {
                        if (Object.keys(block.params).length != 0) {
                            d.params = block.params;
                        }
                    }

                    if (block.Json != undefined) {
                        d.Json = block.Json;
                    }
                    if (block.Image != undefined) {
                        d.Image = block.Image;
                    }

                    if (block.propertyExpl != undefined) {
                        var ArrayNameProperties = Object.keys(block.propertyExpl);

                        for (var index = 0; index < ArrayNameProperties.length; index++) {
                            d[ArrayNameProperties[index]] = block.propertyExpl[ArrayNameProperties[index]];

                        }
                    }

                }
                if (block.name === 'Condition') {
                    d.DataType = block.DataType;
                    d.VariableName = block.VariableName;
                    delete d.description;
                }


                var children = getBlockChildrenIds(block);

                var propertieNext = ["Next"];
                var RouteOfObject;

                if (block.category === 'composite') {
                    children.forEach(element => {
                        if (!d.hasOwnProperty("firstChild")) {
                            d.firstChild = { Id: element, Next: null };
                            RouteOfObject = d.firstChild;
                        } else {
                            RouteOfObject[propertieNext] = { Id: element, Next: null };
                            RouteOfObject = RouteOfObject[propertieNext];
                        }
                    });
                } else if (block.category === 'decorator') {
                    children.forEach(element => {
                        if (!d.hasOwnProperty("firstChild")) {
                            d.firstChild = { Id: element, Next: null };
                            RouteOfObject = d.firstChild;
                        } else {
                            RouteOfObject[propertieNext] = { Id: element, Next: null };
                            RouteOfObject = RouteOfObject[propertieNext];
                        }
                    });
                }

                data.nodes[block.id] = d;
            }
        });
        return data;
    };

    this.nodesToData = function() {
        var project = editor.project.get();
        if (!project) return;

        var data = [];
        project.nodes.each(function(node) {
            if (!node.isDefault) {
                data.push({
                    version: b3e.VERSION,
                    scope: 'node',
                    Concept: node.name,
                    category: node.category,
                    title: node.title || node.Instance,
                    description: node.description,
                    properties: node.properties,
                });
            }
        });

        return data;
    };

    this.nodesToJavascript = function() {};

    this._applySettings = function(settings) {};
};