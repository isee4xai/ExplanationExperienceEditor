(function() {
    "use strict";

    var Project = function(editor) {
        this.Container_constructor();

        // Variables
        this._id = b3.createUUID();
        this._editor = editor;
        this._selectedTree = null;
        this._clipboard = null;
        this._nodes = {};

        // Managers
        this.trees = null;
        this.nodes = null;
        this.history = null;

        this._initialize();
    };
    var p = createjs.extend(Project, createjs.Container);

    p._initialize = function() {
        this.trees = new b3e.project.TreeManager(this._editor, this);
        this.nodes = new b3e.project.NodeManager(this._editor, this);
        this.history = new b3e.project.HistoryManager(this._editor, this);

        this.nodes.add(b3e.Root, true);
        this.nodes.add(b3.Sequence, true);
        this.nodes.add(b3.Priority, true);
        this.nodes.add(b3.Supplement, true);
        this.nodes.add(b3.Replacement,true);
        this.nodes.add(b3.Variant,true);
        this.nodes.add(b3.Complement,true);

        this.nodes.add(b3.Repeater, true);
        this.nodes.add(b3.RepeatUntilFailure, true);
        this.nodes.add(b3.RepeatUntilSuccess, true);

        this.nodes.add(b3.Inverter, true);
        this.nodes.add(b3.Limiter, true);
        this.nodes.add(b3.XM, true);

        this.nodes.add(b3.Condition, true);
        this.nodes.add(b3.Failer, true);
        this.nodes.add(b3.Succeeder, true);
        this.nodes.add(b3.UserQuestion,true);


        this._applySettings(this._editor._settings);
        this.history.clear();
        this._editor.clearDirty();


    };

    p._applySettings = function(settings) {
        this.trees._applySettings(settings);
        this.nodes._applySettings(settings);
        this.history._applySettings(settings);
    };

    b3e.project.Project = createjs.promote(Project, 'Container');
})();