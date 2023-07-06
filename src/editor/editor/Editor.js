(function () {
  "use strict";

  /**
   * Editor main class.
   */
  var Editor = function () {
    this.Container_constructor();

    // Variables
    this._project = null;
    this._game = null;
    this._settings = new b3e.SettingsManager();
    this._dirty = 0;

    // Systems
    this._systems = [];

    // Managers
    this.project = null;
    this.export = null;
    this.import = null;
    this.shortcuts = null;

    this._createGame();
  };
  var p = createjs.extend(Editor, createjs.Container);

  p._createGame = function () {
    var self = this;
    this._game = new tine.Game(null, {
      update: function () { self._update(); },
    });

    this._initialize();
  };

  /**
   * Initializes DOM, DOM events, managers and display objects.
   */
  p._initialize = function () {
    var self = this;

    // RESIZE
    var resize = function () {
      self._game.canvas.width = window.innerWidth;
      self._game.canvas.height = window.innerHeight;
    };
    window.onresize = resize;
    resize();

    // GAME
    this._game.stage.addChild(this);

    // MANAGERS
    this.project = new b3e.editor.ProjectManager(this);
    this.export = new b3e.editor.ExportManager(this);
    this.import = new b3e.editor.ImportManager(this);
    this.shortcuts = new b3e.editor.ShortcutManager(this);

    // SYSTEMS
    this._systems.push(new b3e.editor.CameraSystem(this));
    this._systems.push(new b3e.editor.ConnectionSystem(this));
    this._systems.push(new b3e.editor.SelectionSystem(this));
    this._systems.push(new b3e.editor.DragSystem(this));
    this._systems.push(new b3e.editor.CollapseSystem(this));
    this._systems.push(new b3e.editor.ShortcutSystem(this));

    // SETTINGS

    this.applySettings('default');
  };

  /**
   * Called by creatine game.
   */
  p._update = function () {
    var delta = this._game.time.delta;
    this._systems.forEach(function (system) {
      system.update(delta);
    });
  };

  p.trigger = function (name, target, variables) {
    variables = variables || {};

    var event = new createjs.Event(name);
    event._target = target;
    event._data = variables;

    this.dispatchEvent(event);
  };

  p.applySettings = function (settings) {
    if (settings === 'default') {
      settings = b3e.DEFAULT_SETTINGS;
      this._settings.clear();
    }

    if (settings) {
      this._settings.load(settings);
    }
    var canvas = this._game.canvas;
    canvas.style.backgroundColor = this._settings.get('background_color');

    this.project._applySettings(this._settings);
    this.export._applySettings(this._settings);
    this.import._applySettings(this._settings);
    this.shortcuts._applySettings(this._settings);
  };

  p.applySettingsFormat = function (div){

    var canvas = this._game.canvas;
    var context = canvas.getContext("2d");

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.border = "3px solid black";
/*    canvas.style.marginLeft = "390px";
    canvas.style.marginRight = "390px";
    canvas.style.marginTop = "150px";

    const scaleX = 1.3;  // Scale factor for the x-axis
    const scaleY = 1.5; 

    canvas.style.transform = `scale(${scaleX}, ${scaleY})`;*/
  //  canvas.style.fillRect = (0, 0, 20, 20);

  
  };
/*
  p.previewSubtit = function (data, cavansSub) {

    var canvas = cavansSub;
    var p = this.project.get();

    var stage = new createjs.Stage(cavansSub);
    for (var nodeId in data.nodes) {

      var node1 = data.nodes[nodeId];
      var concept = node1.Concept;
      var node = p.nodes.get(concept);

      var tree = p.trees.getSelected();
      if (!node) return;
      var block = new b3e.Block(node);
      block._applySettings(this._settings);

      block.title = node1.Instance;
      block.name = node1.Instance;
      block.x = block._width;
      block.y = block._height;

      stage.scaleX = 0.5;
      stage.scaleY = 0.5;
      stage.addChild(block);
    }
    stage.update();

    return canvas;
  }*/

  p.preview = function (name) {
    var canvas = document.createElement('canvas');

    var p = this.project.get();
    var node = p.nodes.get(name);
    var tree = p.trees.getSelected();

    if (!node) return;
    var block = new b3e.Block(node);
    block._applySettings(this._settings);
    block.x = block._width;
    block.y = block._height;

    canvas.setAttribute('width', block._width * tree.scaleX * 2);
    canvas.setAttribute('height', block._height * tree.scaleY * 2);

    var stage = new createjs.Stage(canvas);
    stage.scaleX = tree.scaleX;
    stage.scaleY = tree.scaleY;
    stage.addChild(block);
    stage.update();

    return canvas;
  };

  p.isDirty = function () {
    return this._dirty !== 0;
  };

  p.clearDirty = function () {
    this._dirty = 0;
  };

  b3e.editor.Editor = createjs.promote(Editor, 'Container');
})();