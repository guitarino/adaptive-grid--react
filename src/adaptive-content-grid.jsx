import React from 'react';
import ResizeSensor from 'resize-sensor--react';
import { AdaptiveGrid as DefaultAdaptiveGrid, AdaptiveGridItem } from './adaptive-grid';

export { AdaptiveGridItem };

// wraps content of a grid into an expandable container and content container
// and adds resize sensor on the content container
function ContentContainer(props) {
  var paddingTop, paddingBottom;
  if (props.verticalAlign === 'middle') {
    paddingTop = props.contentGap / 2;
    paddingBottom = props.contentGap / 2;
  }
  else if (props.verticalAlign === 'bottom') {
    paddingTop = props.contentGap;
    paddingBottom = 0;
  }
  else {
    paddingTop = 0;
    paddingBottom = props.contentGap;
  }
  return (
    <div
      ref={props.expandableContainerRef}
      style={{
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        paddingTop: (paddingTop + 'px'),
        paddingBottom: (paddingBottom + 'px')
      }}
    >
      <div
        style={{
          display: 'inline-block',
          width: '100%',
          position: 'relative'
        }}
      >
        <ResizeSensor onResize={props.onContentResize} />
        {props.children}
      </div>
    </div>
  );
};

// This component doesn't really matter
function EmptyComponent(props) {
  return <div>{ props.children }</div>;
};

// this grid composes the regular adaptive grid to add the 'content' functionality
export class AdaptiveGrid extends React.Component {
  render() {
    var
      newChildren = this.props.children.map(this.mapChildren),
      style = this.visible ? {} : {
        visibility: 'hidden'
      }
    ;
    return (
      <div style={style}>
        <DefaultAdaptiveGrid
          ref={(adaptiveGrid) => this.adaptiveGridRef = adaptiveGrid}
          baseWidth={this.props.baseWidth}
          baseHeight={this.props.baseHeight}
          maxColumns={this.props.maxColumns}
        >
          { newChildren }
        </DefaultAdaptiveGrid>
      </div>
    )
  }

  mapChildren(child, i) {
    if(!(this.props.baseWidth > 0))
      return child
    ;
    if(!(this.props.baseHeight > 0))
      return child
    ;
    if (child.type !== AdaptiveGridItem)
      return child
    ;
    if (!child.props)
      return child
    ;
    if (child.props.minHeight !== 'content')
      return child
    ;
    if (this.needsResizing === undefined) {
      this.needsResizing = true;
      this.visible = false;
    }
    var
      nextChild = Array.isArray(child.props.children) ? child.props.children[0] : child.props.children
    ,
      NextChildComponent = nextChild ? nextChild.type : undefined
    ,
      nextChildAttributes = nextChild ? nextChild.props : undefined
    ,
      nextChildChildren = nextChild ? nextChild.props.children : undefined
    ,
      containerHeight = this.state.contentHeight[i] + this.state.padding[i]
    ,
      minHeight = (containerHeight || this.props.baseHeight)
    ,
      fullHeight = Math.ceil(minHeight / this.props.baseHeight) * this.props.baseHeight
    ,
      refs = {}
    ,
      containerRef = function(element) {
        refs.container = element
      }
    ,
      expandableContainerRef = function(element) {
        refs.expandableContainer = element
      }
    ;
    // Edge case for when there's no container for the content provided
    if (typeof nextChild === 'string' || (Array.isArray(child.props.children) && child.props.children.length !== 1)) {
      console.log('true');
      nextChild = <div>{ child.props.children }</div>;
      NextChildComponent = nextChild.type;
      nextChildAttributes = nextChild.props;
      nextChildChildren = nextChild.props.children;
    }
    return (
      <AdaptiveGridItem
        {...child.props}
        key={i}
        minHeight={minHeight}
      >
        <div ref={containerRef}>
          <NextChildComponent {...nextChildAttributes}>
            <ContentContainer
              expandableContainerRef={expandableContainerRef}
              contentGap={fullHeight - minHeight}
              verticalAlign={child.props.verticalAlign}
              onContentResize={this.onContentResize(i, refs)}
            >
              {nextChildChildren}
            </ContentContainer>
          </NextChildComponent>
        </div>
      </AdaptiveGridItem>
    )
  }

  bindAll() {
    this.mapChildren = this.mapChildren.bind(this);
    this.onContentResize = this.onContentResize.bind(this);
  }

  componentWillMount() {
    this.bindAll();
    this.visible = true;
    this.state = {contentHeight: [], padding: []};
  }

  // to avoid seeing overlap between grid items, we defer
  // making grid visible by a few frames so that it has time
  // to change sizes
  makeVisible() {
    var self = this;
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        window.requestAnimationFrame(function() {
          self.visible = true;
          self.forceUpdate();
        })
      })
    })
  }

  // callback for when the content for an item is resized
  onContentResize(i, refs) {
    var self = this;
    return function(w, h) {
      if (self.needsResizing) {
        self.needsResizing = false;
        self.makeVisible();
      }
      var
        contentHeight = self.state.contentHeight.slice()
      ,
        padding = self.state.padding.slice()
      ;
      contentHeight[i] = h;
      // at initial render, the padding will be container - content
      if (!(i in padding)) {
        padding[i] = refs.container.clientHeight - h;
      }
      // at all further renders, the padding will be container - expanded content
      else {
        padding[i] = refs.container.clientHeight - refs.expandableContainer.clientHeight;
      }
      self.setState({
        contentHeight: contentHeight,
        padding: padding
      });
    };
  }
};