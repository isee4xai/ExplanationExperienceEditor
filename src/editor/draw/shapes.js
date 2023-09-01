(function () {
  "use strict";

  var makeAnchor = function (shape, x, y, radius, bg_color, border_width, border_color, dash_array) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawCircle(x, y, radius);
    shape.graphics.endStroke();
    shape.graphics.endFill();
    if (dash_array && dash_array.length > 0) {
      shape.graphics.setStrokeDash(dash_array);
    }
  };

  var makeRect = function (shape, w, h, radius, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawRoundRect(-w / 2, -h / 2, w, h, radius);
    shape.graphics.endStroke();
    shape.graphics.endFill();
  };

  var makeTree = function (shape, w, h, radius, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.moveTo(-w / 2, 0);
    shape.graphics.lineTo(-w / 2 + 10, -h / 2);
    shape.graphics.lineTo(w / 2 - 10, -h / 2);
    shape.graphics.lineTo(w / 2, 0);
    shape.graphics.lineTo(w / 2 - 10, h / 2);
    shape.graphics.lineTo(-w / 2 + 10, h / 2);
    shape.graphics.lineTo(-w / 2, 0);
    shape.graphics.endStroke();
    shape.graphics.endFill();
  };

  var makeEllipse = function (shape, w, h, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawEllipse(-w / 2, -h / 2, w, h);
    shape.graphics.endStroke();
    shape.graphics.endFill();
  };

  var makeRhombus = function (shape, w, h, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.moveTo(0, h / 2);
    shape.graphics.lineTo(w / 2, 0);
    shape.graphics.lineTo(0, -h / 2);
    shape.graphics.lineTo(-w / 2, 0);
    shape.graphics.lineTo(0, h / 2);
    shape.graphics.endStroke();
    shape.graphics.endFill();
  };

  b3e.draw.rootShape = function (block, settings) {
    var w = block._width;
    var h = block._height;
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }

    makeAnchor(shape, x, y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );
    makeRect(shape, w, h, 15,
      settings.get('root_color'),
      settings.get('block_border_width'),
      settings.get('block_border_color')
    );
    return shape;
  };

  b3e.draw.compositeShape = function (block, settings) {
    var bounds = block._displaySymbol.getBounds();
    var _width = 0;

    if (bounds) { _width = bounds.width + 20; }

    var w = Math.max(_width, block._width);
    var h = block._height;
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;
    block._width = w;
    block._height = h;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }
    makeAnchor(shape, x, y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );
    makeAnchor(shape, -x, -y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );
    makeRect(shape, w, h, 15,
      settings.get('composite_color'),
      settings.get('block_border_width'),
      settings.get('block_border_color')
    );
    return shape;
  };

  b3e.draw.decoratorShape = function (block, settings) {
    var bounds = block._displaySymbol.getBounds();

    var w = Math.max(bounds.width + 40, block._width);
    var h = Math.max(bounds.height + 50, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;
    block._width = w;
    block._height = h;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }
    makeAnchor(shape, x, y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );
    makeAnchor(shape, -x, -y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );

    makeRhombus(shape, w, h,
      settings.get('decorator_color'),
      settings.get('block_border_width'),
      settings.get('block_border_color')
    );
    return shape;
  };

  b3e.draw.actionShape = function (block, settings) {

    var Applicability;
    var PopularityColorBorder = settings.get('block_border_color');
    var BackGraundColor = ['#C5E2FA', '#94ccfc', '#3380C1'];
    var bounds = block._displaySymbol.getBounds();

    var w = Math.max(bounds.width + 15, block._width);
    var h = Math.max(bounds.height + 15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;
    block._width = w;
    block._height = h;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }

    if (block.properties.Applicability == false ) {
      Applicability = [8, 4];
      PopularityColorBorder = "#FF3E31";
    }
    makeAnchor(shape, -x, -y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color'),
      Applicability || undefined
    );

    makeRect(shape, w, h, 15,
      BackGraundColor[block.properties.Popularity] || settings.get('action_color'),
      settings.get('block_border_width'),
      PopularityColorBorder 
    );
    return shape;
  };

  b3e.draw.actionNoRunShape = function (block, settings, border) {
    var BackGraundColor = ['#C5E2FA', '#94ccfc', '#3380C1'];
    var bounds = block._displaySymbol.getBounds();

    var w = Math.max(bounds.width + 15, block._width);
    var h = Math.max(bounds.height + 15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;
    block._width = w;
    block._height = h;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }

    makeAnchor(shape, -x, -y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      "#FF3E31",
      border
    );

    makeRect(shape, w, h, 15,
      BackGraundColor[block.properties.Popularity] || settings.get('action_color'),
      settings.get('block_border_width'),
      "#FF3E31"
    );
    return shape;
  };

  b3e.draw.conditionShape = function (block, settings) {
    var bounds = block._displaySymbol.getBounds();

    var w = Math.max(bounds.width + 15, block._width);
    var h = Math.max(bounds.height + 15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;
    block._width = w;
    block._height = h;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }

    makeAnchor(shape, -x, -y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );
    makeEllipse(shape, w, h,
      settings.get('condition_color'),
      settings.get('block_border_width'),
      settings.get('block_border_color')
    );
    return shape;
  };

  b3e.draw.treeShape = function (block, settings) {
    var bounds = block._displaySymbol.getBounds();
    var w = Math.max(bounds.width + 15, block._width);
    var h = Math.max(bounds.height + 15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._displayShape;
    block._width = w;
    block._height = h;

    var x = 0;
    var y = 0;
    if (settings.get('layout') === 'horizontal') {
      x = w / 2 + anchorOffsetX;
    } else {
      y = h / 2 + anchorOffsetX;
    }
    makeAnchor(shape, -x, -y,
      settings.get('anchor_radius'),
      settings.get('anchor_background_color'),
      settings.get('anchor_border_width'),
      settings.get('block_border_color')
    );
    makeTree(shape, w, h, 15,
      settings.get('tree_color'),
      settings.get('block_border_width'),
      settings.get('block_border_color')
    );
    return shape;
  };

  b3e.draw.SHAPES = {
    'root': b3e.draw.rootShape,
    'tree': b3e.draw.treeShape,
    'composite': b3e.draw.compositeShape,
    'decorator': b3e.draw.decoratorShape,
    'action': b3e.draw.actionShape,
    'condition': b3e.draw.conditionShape,
    'actionNoRun': b3e.draw.actionNoRunShape,
  };

}());
