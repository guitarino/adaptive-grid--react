import React from 'react';
import ReactDOM from 'react-dom';
import { AdaptiveGrid, AdaptiveGridItem } from '../../build/adaptive-grid';

let Card = (props) => (
  <div className="Card">
    <div className="Card__container">
      <div className="Card__centering"></div>
      <div className="Card__content">
        {props.children}
      </div>
    </div>
  </div>
);

let defaultBaseWidth = 300;
let defaultBaseHeight = 200;
let defaultMaxColumns = 8;

export default class App extends React.Component {
  constructor() {
    super();
    this.onChangeBaseWidth = this.onChangeBaseWidth.bind(this);
    this.onChangeBaseHeight = this.onChangeBaseHeight.bind(this);
    this.onChangeMaxColumns = this.onChangeMaxColumns.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  componentWillMount() {
    this.state = {
      baseWidth: defaultBaseWidth,
      baseHeight: defaultBaseHeight,
      maxColumns: defaultMaxColumns,
      items: [
        {},
        {},
        {
          minWidth:2*defaultBaseWidth,
          minHeight:2*defaultBaseHeight
        },
        {
          minWidth:2*defaultBaseWidth
        },
        {
          minWidth:2*defaultBaseWidth,
          minHeight:2*defaultBaseHeight
        },
        {
          minWidth:2*defaultBaseWidth
        },
        {},
        {}
      ]
    }
  }

  onChangeBaseWidth(e) {
    let w = Number(e.currentTarget.value);
    if(this.state.baseWidth !== w) {
      this.state.baseWidth = w > 0 ? w : defaultBaseWidth;
      this.forceUpdate();
    }
  }

  onChangeBaseHeight(e) {
    let h = Number(e.currentTarget.value);
    if(this.state.baseHeight !== h) {
      this.state.baseHeight = h > 0 ? h : defaultBaseHeight;
      this.forceUpdate();
    }
  }

  onChangeMaxColumns(e) {
    let mc = Number(e.currentTarget.value);
    if(this.state.maxColumns !== mc) {
      this.state.maxColumns = mc > 0 ? mc : defaultMaxColumns;
      this.forceUpdate();
    }
  }

  updateItem(item) {
    let self = this;
    return function(e) {
      e.preventDefault();
      let form = e.currentTarget;
      let [inputMinWidth, inputMinHeight] = form.elements;
      let minWidth = Number(inputMinWidth.value);
      let minHeight = Number(inputMinHeight.value);
      if (item.minWidth !== minWidth || item.minHeight !== minHeight) {
        if (minWidth > 0) {
          item.minWidth = minWidth;
        } else {
          delete item.minWidth;
        }
        if (minHeight > 0) {
          item.minHeight = minHeight;
        } else {
          delete item.minHeight;
        }
        self.forceUpdate();
      }
    }
  }

  removeItem(index) {
    let self = this;
    return function() {
      self.state.items.splice(index, 1);
      self.forceUpdate();
    }
  }

  addItem() {
    this.state.items.push({});
    this.forceUpdate();
  }

  render() {
    return (
      <div className='App'>
        <div>
          <a href='index.html'>Regular Adaptive Grid</a>
        </div>
        <dl className='App__baseVals'>
          <dt>Base width</dt>
          <dd>
            <input
              value={this.state.baseWidth}
              onChange={this.onChangeBaseWidth}
            />
          </dd>
          <dt>Base height</dt>
          <dd>
            <input
              value={this.state.baseHeight}
              onChange={this.onChangeBaseHeight}
            />
          </dd>
          <dt>Max columns</dt>
          <dd>
            <input
              value={this.state.maxColumns}
              onChange={this.onChangeMaxColumns}
            />
          </dd>
        </dl>
        <AdaptiveGrid
          baseWidth={this.state.baseWidth}
          baseHeight={this.state.baseHeight}
          maxColumns={this.state.maxColumns}
        >
          {
            this.state.items.map((item, i) => (
              <AdaptiveGridItem { ...item }>
                <Card>
                  <form
                    onSubmit={this.updateItem(item)}
                  >
                    <dl>
                      <dd>Index: {i}</dd>
                      <dt>Min Width</dt>
                      <dd>
                        <input
                          value={item.minWidth !== undefined ? item.minWidth : ""}
                        />
                      </dd>
                      <dt>Min Height</dt>
                      <dd>
                        <input
                          value={item.minHeight !== undefined ? item.minHeight : ""}
                        />
                      </dd>
                    </dl>
                    <button type='submit'>Change</button>
                    <button onClick={this.removeItem(i)}>Remove</button>
                  </form>
                </Card>
              </AdaptiveGridItem>
            ))
          }
        </AdaptiveGrid>
        <div className='App__AddNewItem'>
          <Card>
            <button onClick={this.addItem}>Add New Grid Item</button>
          </Card>
        </div>
      </div>
    );
  }
};

export function renderApp(where) {
  ReactDOM.render(
    <App />,
    where
  );
}