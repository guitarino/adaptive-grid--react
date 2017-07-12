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

export default class App extends React.Component {
  render() {
    let w = 150;
    let h = 150;
    return (
      <div className='App'>
        <div>
          <a href='builder.html'>Play with it!</a>
        </div>
        <AdaptiveGrid baseWidth={w} baseHeight={h} maxColumns={8}>
          <AdaptiveGridItem>
            <Card>One</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Two</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minWidth={2*w} minHeight={2*h}>
            <Card>Three</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minWidth={2*w}>
            <Card>Four</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minWidth={2*w} minHeight={2*h}>
            <Card>Five</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minWidth={2*w}>
            <Card>Six</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Seven</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Eight</Card>
          </AdaptiveGridItem>

          
          <AdaptiveGridItem minWidth={2*w} minHeight={2*h}>
            <Card>Nine</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minHeight={2*h}>
            <Card>Ten</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Eleven</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Twelve</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minHeight={2*h}>
            <Card>Thirteen</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minWidth={2*w} minHeight={2*h}>
            <Card>Fourteen</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem minWidth={2*w}>
            <Card>Fifteen</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Sixteen</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Seventeen</Card>
          </AdaptiveGridItem>
          <AdaptiveGridItem>
            <Card>Eighteen</Card>
          </AdaptiveGridItem>
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