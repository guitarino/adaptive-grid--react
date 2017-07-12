/**
 * @license MIT
 * @copyright Kirill Shestakov 2017
 * @see https://github.com/guitarino/adaptive-grid--react/
 */

import React from 'react';
import ResizeSensor from 'resize-sensor--react';

export function AdaptiveGridItem(props) {
  return (
    <div className="AdaptiveGridItem" style={props.childStyle}>
      {props.children}
    </div>
  )
};

export class AdaptiveGrid extends React.Component {
  constructor() {
    super();
    this.state = { width: 0 };
    this.onResize = this.onResize.bind(this);
  }

  render() {
    var children = this.getFilteredChildren();
    var gridStyle = {
      overflow: 'visible',
      position: 'relative'
    };
    if (this.canCalculate()) {
      var totalColumns = this.getTotalColumns();
      var colWidth = this.getColWidth(totalColumns);
      var sizes = this.getItemSizes(children, totalColumns);
      var coords = this.getItemCoordinates(children, sizes, totalColumns);
      children = this.applyItemStyles(children, colWidth, sizes, coords);
      gridStyle.height = this.getGridMaxHeight(children, sizes, coords) + 'px';
    }
    else {
      gridStyle.visibility = 'hidden';
      if (!(
        this.props.baseWidth > 0 &&
        this.props.baseHeight > 0
      )) {
        console.error('Base width and base height should be provided and be positive');
      }
    }
    return (
      <div className='AdaptiveGrid' style={ gridStyle }>
        <ResizeSensor onResize={ this.onResize } />
        { children }
      </div>
    );
  }
  
  // callback from resize-sensor
  onResize(width) {
    if (this.state.width !== width) {
      this.setState({width: width});
    }
  }

  // this is to ignore children that are not AdaptiveGridItem
  getFilteredChildren() {
    var children = [];
    this.props.children.forEach((child) => {
      if(child.type === AdaptiveGridItem) {
        children.push(child);
      }
    });
    return children;
  }

  // if calculation can happen without error, returns true
  canCalculate() {
    return (
      this.state.width > 0 &&
      this.props.baseWidth > 0 &&
      this.props.baseHeight > 0
    );
  }

  // also account for max columns
  getTotalColumns() {
    let maxColumns = this.props.maxColumns ? this.props.maxColumns : Infinity;
    return Math.max(1, Math.min(maxColumns, Math.floor(this.state.width / this.props.baseWidth)));
  }

  getColWidth(totalColumns) {
    return this.state.width / totalColumns;
  }

  getItemSizes(children, totalColumns) {
    return children.map((child) => {
      var width = this.props.baseWidth;
      var height = this.props.baseHeight;
      if(child.props) {
        if(child.props.minWidth) {
          width = child.props.minWidth;
        }
        if(child.props.minHeight) {
          height = child.props.minHeight;
        }
      }
      return [
        Math.min(totalColumns, Math.ceil(width / this.props.baseWidth)),
        Math.ceil(height / this.props.baseHeight)
      ];
    });
  }

  getItemCoordinates(children, sizes, totalColumns) {
    var remainingElements = [].slice.call(children);
    // remainingElementsIds is in sync with remainingElements so that
    // we don't have to search for indeces every time
    var remainingElementsIds = Object.keys(children);
    var coords = [];
    var row = 0;
    var boundaries = []; // array for boundaries of current grid items
    // filling up the grid and removing remainingElements until none left
    while(remainingElements.length) {
      for(var col = 0; col < totalColumns; col++) {
        for(var elId = 0; elId < remainingElements.length; elId++) {
          var childId = remainingElementsIds[elId];
          var [cols, rows] = sizes[childId];
          // if not exceeding the boundary
          if(col + cols <= totalColumns) {
            // and if other items are not in the way
            if(!isFilled(col, row, col + cols, row + rows, boundaries)) {
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

  applyItemStyles(children, colWidth, sizes, coords) {
    return children.map((child, i) => (
      <AdaptiveGridItem
        key={i}
        childStyle={{
          position: 'absolute',
          left: coords[i][0] * colWidth + 'px',
          top: coords[i][1] * this.props.baseHeight + 'px',
          width: sizes[i][0] * colWidth + 'px',
          height: sizes[i][1] * this.props.baseHeight + 'px'
        }}
      >
        {child.props.children}
      </AdaptiveGridItem>
    ));
  }

  getGridMaxHeight(children, sizes, coords) {
    var maxRow = 0;
    children.forEach((child, i) => {
      var [col, row] = coords[i];
      var [cols, rows] = sizes[i];
      if (row + rows > maxRow) {
        maxRow = row + rows;
      }
    });
    return maxRow * this.props.baseHeight;
  }
}

// checks if the provided coordinates and sizes for an item
// will overlap with currently placed items
function isFilled(colStart, rowStart, colEnd, rowEnd, arr) {
  var isFilled = false;
  arr.forEach((borders) => {
    var [colStart2, rowStart2, colEnd2, rowEnd2] = borders;
    if (colStart < colEnd2 && colEnd > colStart2 &&
      rowEnd2 > rowStart && rowStart2 < rowEnd ) {
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