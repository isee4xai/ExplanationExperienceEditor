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
    // canvas [More like this?]
    this.canvasSub = null

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
    //udate canvas  button [more like this?]
    if (this.canvasSub) {
      this.canvasSub.style.width =  window.innerWidth < 1400 ? "400px" : window.innerWidth / 3.5 + "px";
      this.canvasSub.style.height = window.innerHeight < 747 ? "250px" : window.innerHeight / 3.5 + "px";
    }

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

  p.applySettingsFormatOnlyNode = function (div, blockTitle, category) {
      var p = this.project.get();
      var tree = p.trees.getSelected();
      var block = new b3e.Block(blockTitle);
  
      var canvas = document.createElement('canvas');
      
      block.category = category,
      block.title = blockTitle,
      block._applySettings(this._settings);
      block.x = block._width/1.2;
      block.y = block._height*1.2;

      canvas.setAttribute('width', block._width/1.2 * tree.scaleX * 2);
      canvas.setAttribute('height', block._height*1.2 * tree.scaleY * 2);
      canvas.style.border = '3px solid black';
      canvas.style.backgroundColor = '#2f2f2f';

      var stage = new createjs.Stage(canvas);
      stage.scaleX = 1;
      stage.scaleY = 1;
      stage.addChild(block);
      stage.update();
      div.appendChild(canvas);
   
    return canvas;
  }

  p.applySettingsFormat = function (div, block) {
    this.canvasSub = div;
    div.style.backgroundColor = '#2f2f2f';
    div.style.border = "3px solid black";
  };

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