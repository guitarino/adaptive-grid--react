import React from 'react';
import ReactDOM from 'react-dom';
import { AdaptiveGrid, AdaptiveGridItem } from '../../build/adaptive-content-grid';

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

export default class App extends React.Component {
  componentWillMount() {
    let
      w = 225,
      h = 200
    ;
    this.state = {
      w: w,
      h: h,
      grid: (
        [...Array(50)].map((u,i)=>(
          Math.random() > 0.4 ? (
            <AdaptiveGridItem
              key={i}
              minWidth={Math.random()*2*w}
              minHeight={Math.random()*2*h}
            >
              <Card>{ i }</Card>
            </AdaptiveGridItem>
          ) : (
            <AdaptiveGridItem
              key={i}
              minWidth={(Math.random()*2+1)*w}
              minHeight='content'
              verticalAlign='middle'
            >
              <Card>
                {
                  Array(Math.ceil(50*Math.random()+1)).join("lore m ip sum ")
                }
              </Card>
            </AdaptiveGridItem>
          )
        ))
      )
    };
  }
  render() {
    return (
      <div className='App'>
        <div>
          <a href='index.html'>Regular Adaptive Grid</a>
        </div>
        <AdaptiveGrid baseWidth={ this.state.w } baseHeight={ this.state.h }>
          { this.state.grid }
        </AdaptiveGrid>
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