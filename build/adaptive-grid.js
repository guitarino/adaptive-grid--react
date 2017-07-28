'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdaptiveGrid = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.AdaptiveGridItem = AdaptiveGridItem;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _resizeSensorReact = require('resize-sensor--react');

var _resizeSensorReact2 = _interopRequireDefault(_resizeSensorReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright Kirill Shestakov 2017
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://github.com/guitarino/adaptive-grid--react/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function AdaptiveGridItem(props) {
  return _react2.default.createElement(
    'div',
    { className: 'AdaptiveGridItem', style: props.childStyle },
    props.children
  );
};

var AdaptiveGrid = exports.AdaptiveGrid = function (_React$Component) {
  _inherits(AdaptiveGrid, _React$Component);

  function AdaptiveGrid() {
    _classCallCheck(this, AdaptiveGrid);

    return _possibleConstructorReturn(this, (AdaptiveGrid.__proto__ || Object.getPrototypeOf(AdaptiveGrid)).apply(this, arguments));
  }

  _createClass(AdaptiveGrid, [{
    key: 'render',
    value: function render() {
      var children = [],
          gridStyle = {
        overflow: 'visible',
        position: 'relative'
      };
      if (this.canCalculate()) {
        children = this.getFilteredChildren();
        var totalColumns = this.getTotalColumns(),
            colWidth = this.getColWidth(totalColumns),
            sizes = this.getItemSizes(children, totalColumns),
            coords = this.getItemCoordinates(children, sizes, totalColumns),
            children = this.applyItemStyles(children, colWidth, sizes, coords);
        gridStyle.height = this.getGridMaxHeight(children, sizes, coords) + 'px';
      } else {
        gridStyle.visibility = 'hidden';
        if (!(this.props.baseWidth > 0 && this.props.baseHeight > 0)) {
          console.error('Base width and base height should be provided and be positive');
        }
      }
      return _react2.default.createElement(
        'div',
        { className: 'AdaptiveGrid', style: gridStyle },
        _react2.default.createElement(_resizeSensorReact2.default, { onResize: this.onResize }),
        children
      );
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.state = { width: 0 };
      this.onResize = this.onResize.bind(this);
    }

    // callback from resize-sensor

  }, {
    key: 'onResize',
    value: function onResize(width) {
      if (this.state.width !== width) {
        this.setState({ width: width });
      }
    }

    // this is to ignore children that are not AdaptiveGridItem

  }, {
    key: 'getFilteredChildren',
    value: function getFilteredChildren() {
      var children = [];
      this.props.children.forEach(function (child) {
        if (child.type === AdaptiveGridItem) {
          children.push(child);
        }
      });
      return children;
    }

    // if calculation can happen without error, returns true

  }, {
    key: 'canCalculate',
    value: function canCalculate() {
      return this.state.width > 0 && this.props.baseWidth > 0 && this.props.baseHeight > 0;
    }

    // also account for max columns

  }, {
    key: 'getTotalColumns',
    value: function getTotalColumns() {
      var maxColumns = this.props.maxColumns ? this.props.maxColumns : Infinity;
      return Math.max(1, Math.min(maxColumns, Math.floor(this.state.width / this.props.baseWidth)));
    }
  }, {
    key: 'getColWidth',
    value: function getColWidth(totalColumns) {
      return this.state.width / totalColumns;
    }
  }, {
    key: 'getItemSizes',
    value: function getItemSizes(children, totalColumns) {
      var _this2 = this;

      return children.map(function (child) {
        var width = _this2.props.baseWidth,
            height = _this2.props.baseHeight;
        if (child.props) {
          if (child.props.minWidth) {
            width = child.props.minWidth;
          }
          if (child.props.minHeight) {
            height = child.props.minHeight;
          }
        }
        return [Math.min(totalColumns, Math.ceil(width / _this2.props.baseWidth)), Math.ceil(height / _this2.props.baseHeight)];
      });
    }
  }, {
    key: 'getItemCoordinates',
    value: function getItemCoordinates(children, sizes, totalColumns) {
      var remainingElements = [].slice.call(children),

      // remainingElementsIds is in sync with remainingElements so that
      // we don't have to search for indeces every time
      remainingElementsIds = Object.keys(children),
          coords = [],
          row = 0,
          boundaries = [] // array for boundaries of current grid items
      ;
      // filling up the grid and removing remainingElements until none left
      while (remainingElements.length) {
        for (var col = 0; col < totalColumns; col++) {
          for (var elId = 0; elId < remainingElements.length; elId++) {
            var childId = remainingElementsIds[elId],
                _sizes$childId = _slicedToArray(sizes[childId], 2),
                cols = _sizes$childId[0],
                rows = _sizes$childId[1];
            // if not exceeding the boundary
            if (col + cols <= totalColumns) {
              // and if other items are not in the way
              if (!isFilled(col, row, col + cols, row + rows, boundaries)) {
                // then the current item can claim those coordinates
                coords[childId] = [col, row];
                // and, don't forget to update the filled space
                doFill(col, row, col + cols, row + rows, boundaries);
                // now, there's 1 less item remaining
                remainingElements.splice(elId, 1);
                remainingElementsIds.splice(elId, 1);
                elId--; // since we removed an element, we gotta go back by 1 id
                break;
              }
            }
          }
        }
        row++;
      }
      return coords;
    }
  }, {
    key: 'applyItemStyles',
    value: function applyItemStyles(children, colWidth, sizes, coords) {
      var _this3 = this;

      return children.map(function (child, i) {
        return _react2.default.createElement(
          AdaptiveGridItem,
          _extends({}, child.props, {
            key: i,
            childStyle: {
              position: 'absolute',
              left: coords[i][0] * colWidth + 'px',
              top: coords[i][1] * _this3.props.baseHeight + 'px',
              width: sizes[i][0] * colWidth + 'px',
              height: sizes[i][1] * _this3.props.baseHeight + 'px'
            }
          }),
          child.props.children
        );
      });
    }
  }, {
    key: 'getGridMaxHeight',
    value: function getGridMaxHeight(children, sizes, coords) {
      var maxRow = 0;
      children.forEach(function (child, i) {
        var _coords$i = _slicedToArray(coords[i], 2),
            col = _coords$i[0],
            row = _coords$i[1],
            _sizes$i = _slicedToArray(sizes[i], 2),
            cols = _sizes$i[0],
            rows = _sizes$i[1];

        if (row + rows > maxRow) {
          maxRow = row + rows;
        }
      });
      return maxRow * this.props.baseHeight;
    }
  }]);

  return AdaptiveGrid;
}(_react2.default.Component);

// checks if the provided coordinates and sizes for an item
// will overlap with currently placed items


function isFilled(colStart, rowStart, colEnd, rowEnd, arr) {
  var isFilled = false;
  arr.forEach(function (borders) {
    var _borders = _slicedToArray(borders, 4),
        colStart2 = _borders[0],
        rowStart2 = _borders[1],
        colEnd2 = _borders[2],
        rowEnd2 = _borders[3];

    if (colStart < colEnd2 && colEnd > colStart2 && rowEnd2 > rowStart && rowStart2 < rowEnd) {
      isFilled = true;
      return false;
    }
  });
  return isFilled;
}

// adds provided coordinates and sizes as a currently placed item
function doFill(colStart, rowStart, colEnd, rowEnd, arr) {
  arr.push([colStart, rowStart, colEnd, rowEnd]);
}
//# sourceMappingURL=adaptive-grid.js.map