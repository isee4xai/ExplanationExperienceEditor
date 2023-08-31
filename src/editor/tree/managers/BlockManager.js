b3e.tree.BlockManager = function (editor, project, tree) {
    "use strict";

    var BlocksDelet = [];

    this._move = function (block, x, y) {
        block.x = x;
        block.y = y;
        block._redraw();

        // redraw connections linked to the entity
        if (block._inConnection) {
            block._inConnection._redraw();
        }
        for (var j = 0; j < block._outConnections.length; j++) {
            block._outConnections[j]._redraw();
        }
    };

    this.addSub = function (block) {
        var _old = [this, this.remove, [block]];
        var _new = [this, this.add, block];
        project.history._add(new b3e.Command(_old, _new));
    }

    /**
     * Add multiple block.
     * nodeSubRoot : node that you wanted to replace, contains a block
     */
    this.AddTreeBlockSub = function (sSub, nodelSubSelect, nodeSubRoot) {
        sSub.forEach(element => {
            switch (element.category) {
                case "composite":
                case "decorator":
                    if (element.id == nodeSubRoot.id) {
                        var outBlock = this.get(element._outConnections);
                        if (outBlock.length) {
                            outBlock.forEach(elementConection => {
                                this.ConectionBlockSub(elementConection._outBlock, nodelSubSelect);
                            });
                        }
                    }
                    break;
                default:
                    break;
            }
        });
    }

    this.ConectionBlockSub = function (element, block) {
        switch (element.category) {
            case "composite":
            case "decorator":
                this.addCompositeOrDecorators(element, block);
                break;
            case "action":
            case "condition":
                this.addActionsOrConditions(element, block);
                break;
            default:
                break;
        }
    }

    this.addCompositeOrDecorators = function (element, blockFather) {
        var block = new b3e.Block(element);
        block._applySettings(editor._settings);
        block.x = element.x || 0;
        block.y = element.y || 0;
        block._snap();
        tree._blocks.addChild(block);

        editor.trigger('blockadded', block);

        var _old = [this, this.remove, [block]];
        var _new = [this, this.add, [block, block.x, block.y]];
        project.history._add(new b3e.Command(_old, _new));

        tree.connections.add(blockFather, block);

        var outBlock = this.get(element._outConnections);
        if (outBlock.length) {
            outBlock.forEach(elementConection => {
                this.ConectionBlockSub(elementConection._outBlock, block);
            });
        }

    }

    this.addActionsOrConditions = function (element, blockFather) {
        var blockNew = new b3e.Block(element);
        var block = blockNew.node;
        block._applySettings(editor._settings);
        block.x = element.x || 0;
        block.y = element.y || 0;
        block._snap();
        tree._blocks.addChild(block);

        editor.trigger('blockadded', block);

        var _old = [this, this.remove, [block]];
        var _new = [this, this.add, [block, block.x, block.y]];
        project.history._add(new b3e.Command(_old, _new));

        tree.connections.add(blockFather, block);
    }


    /**
     * Add a block.
     */
    this.add = function (name, x, y) {
        // If name is a block
        var block;
        if (name instanceof b3e.Block) {
            block = name;
            block._snap();
            tree._blocks.addChild(block);
            editor.trigger('blockadded', block);
        }
        // Otherwise
        else {
            x = x || 0;
            y = y || 0;

            var node = name;
            if (typeof name === 'string') {
                node = project.nodes.get(name);
            }

            block = new b3e.Block(node);
            block._applySettings(editor._settings);
            block.x = x;
            block.y = y;
            block._snap();
            tree._blocks.addChild(block);

            tree.selection.deselectAll();
            tree.selection.select(block);

            editor.trigger('blockadded', block);
        }
        var _old = [this, this.remove, [block]];
        var _new = [this, this.add, [block, block.x, block.y]];
        project.history._add(new b3e.Command(_old, _new));

        return block;
    };

    this.get = function (block) {
        if (typeof block === 'string') {
            var blocks = tree._blocks.children;
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].id === block) {
                    return blocks[i];
                }
            }
            return undefined;
        }

        return block;
    };
    this.getUnderPoint = function (x, y) {
        if (!x || !y) {
            var point = tree.view.getLocalPoint();
            x = point.x;
            y = point.y;
        }

        // Get block under the mouse
        var blocks = this.getAll();
        for (var i = blocks.length - 1; i >= 0; i--) {
            var block = blocks[i];

            if (block._hitTest(x, y)) return block;
        }
    };

    this.getIntends = function (x) {
        var blocks = this.getAll();
        for (var i = 0; i <= blocks.length - 1; i++) {
            var block = blocks[i];
            if (blocks[i].title == x) {
                return blocks[i];
            }
            return block;
        }
    };

    this.getSelected = function () {
        return tree._selectedBlocks.slice();
    };
    this.getAll = function () {
        return tree._blocks.children;
    };
    this.getRoot = function () {
        return tree._root;
    };
    this.update = function (block, template, merge) {
        var mustSave = !!template;
        var _oldValues = {
            name: block.name,
            title: block.title,
            description: block.description,
            properties: block.properties,
            propertyExpl: block.propertyExpl,
            DataType: block.DataType,
            VariableName: block.VariableName,
            params: block.params,
            idModel: block.idModel,
            query: block.query,
            query_id: block.query_id,
            img: block.img,
            Image: block.Image,
            Json: block.Json,
            available: block.available,
            color: block.color
        };

        template = template || {};

        var node = block.node;
        if (node.hasOwnProperty("node")) {
            console.log(node.node);
            node= node.node
        }

        if (typeof template.name !== 'undefined') {
            block.name = template.name;
        } else {
            block.name = node.name || block.name;
        }
        if (typeof template.title !== 'undefined') {
            block.title = template.title;
        } else {
            block.title = node.title || block.title;
        }
        if (typeof template.description !== 'undefined') {
            block.description = template.description;
        } else {
            block.description = node.description || block.description;
        }
        if (typeof template.properties !== 'undefined') {
            block.properties = tine.merge({}, node.properties, template.properties);
        } else {
            block.properties = tine.merge({}, node.properties, block.properties);
        }
        if (typeof template.propertyExpl !== 'undefined') {
            block.propertyExpl = tine.merge({}, node.propertyExpl, template.propertyExpl);
        } else {
            block.propertyExpl = tine.merge({}, node.propertyExpl, block.propertyExpl);
        }
        if (typeof template.DataType !== 'undefined') {
            block.DataType = template.DataType;
        } else {
            block.DataType = node.DataType || block.DataType;
        }
        if (typeof template.VariableName !== 'undefined') {
            block.VariableName = template.VariableName;
        } else {
            block.VariableName = node.VariableName || block.VariableName;
        }
        if (typeof template.params !== 'undefined') {
            block.params = tine.merge({}, node.params, template.params);
        } else {
            block.params = tine.merge({}, node.params, block.params);
        }
        if (typeof template.ModelRoot !== 'undefined') {
            block.ModelRoot = tine.merge({}, node.ModelRoot, template.ModelRoot);
        } else {
            block.ModelRoot = tine.merge({}, node.ModelRoot, block.ModelRoot);
        }
        if (typeof template.Image !== 'undefined') {
            block.Image = template.Image;
        } else {
            block.Image = node.Image || block.Image;
        }
        if (typeof template.Json !== 'undefined') {
            block.Json = template.Json;
        } else {
            block.Json = node.Json || block.Json;
        }
        
        // redraw canvas
        if (!block.properties.Applicability  && block.name == "Explanation Method") {
            block._redraw(true);
        }else{
            block._redraw();
        } 

        var _newValues = {
            name: block.name,
            title: block.title,
            description: block.description,
            properties: block.properties,
            propertyExpl: block.propertyExpl,
            DataType: block.DataType,
            VariableName: block.VariableName,
            params: block.params,
            idModel: block.ModelRoot.idModel,
            query: block.ModelRoot.query,
            query_id: block.ModelRoot.query_id,
            img: block.ModelRoot.img,
            Image: block.Image,
            Json: block.Json
        };

        // redraw connections linked to the entity
        if (block._inConnection) {
            block._inConnection._redraw();
        }
        for (var j = 0; j < block._outConnections.length; j++) {
            block._outConnections[j]._redraw();
        }

        if (!mustSave) project.history._lock();

        project.history._beginBatch();

        if (block.category === 'root') {
            project.nodes.update(tree._id, { title: block.title || 'A behavior tree' });
        }

        var _old = [this, this.update, [block, _oldValues]];
        var _new = [this, this.update, [block, _newValues]];
        project.history._add(new b3e.Command(_old, _new));
        project.history._endBatch();

        if (!mustSave) project.history._unlock();

        editor.trigger('blockchanged', block);
    };

    this.removeMutilple = function (BlockDelete,firstNode) {
        if (firstNode == true && BlocksDelet != []) {
            BlocksDelet = [];
        }

        for (let index = 0; index < BlockDelete.length; index++) {
            BlocksDelet.push(this.removeCategorty( BlockDelete[index]._outBlock));
        }

        if (firstNode == true && BlocksDelet != []) {
            BlocksDelet.forEach(element => {
                
                if (element._inConnection) {
                    tree.connections.remove(element._inConnection);
                }
        
                if (element._outConnections.length > 0) {
                    for (var i = element._outConnections.length - 1; i >= 0; i--) {
                        tree.connections.remove(element._outConnections[i]);
                    }
                }
                this.remove(element);
            });
        }
    }

    this.removeCategorty = function (block) {
        switch (block.category) {
            case "action":
            case "condition":
                return block;
                break;
            case "composite":
            case "decorator":
                this.removeMutilple(block._outConnections,false);
                return block;
                break;
            default:
                break;
        }

    }


    this.remove = function (block) {
        project.history._beginBatch();
        tree._blocks.removeChild(block);

        if (block._inConnection) {
            tree.connections.remove(block._inConnection);
        }

        if (block._outConnections.length > 0) {
            for (var i = block._outConnections.length - 1; i >= 0; i--) {
                tree.connections.remove(block._outConnections[i]);
            }
        }

        if (block._isSelected) {
            tree.selection.deselect(block);
        }

        var _old = [this, this.add, [block, block.x, block.y]];
        var _new = [this, this.remove, [block]];
        project.history._add(new b3e.Command(_old, _new));

        project.history._endBatch();
        editor.trigger('blockremoved', block);
    };
    this.cut = function (block) {
        project.history._beginBatch();
        tree._blocks.removeChild(block);

        if (block._inConnection) {
            if (!block._inConnection._outBlock._isSelected) {
                tree.connections.remove(block._inConnection);
            } else {
                block._inConnection.visible = false;
            }
        }

        if (block._outConnections.length > 0) {
            for (var i = block._outConnections.length - 1; i >= 0; i--) {
                if (!block._outConnections[i]._inBlock._isSelected) {
                    tree.connections.remove(block._outConnections[i]);
                } else {
                    block._outConnections[i].visible = false;
                }
            }
        }

        var _old = [this, this.add, [block, block.x, block.y]];
        var _new = [this, this.remove, [block]];
        project.history._add(new b3e.Command(_old, _new));

        editor.trigger('blockremoved', block);
        project.history._endBatch();
    };
    this.each = function (callback, thisarg) {
        tree._blocks.children.forEach(callback, thisarg);
    };

    this._applySettings = function (settings) {
        this.each(function (block) {
            block._applySettings(settings);
        });
    };
};

