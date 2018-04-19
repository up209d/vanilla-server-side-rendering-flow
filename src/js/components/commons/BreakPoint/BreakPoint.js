import React from 'react';
import { withWidth } from 'material-ui';

class BreakPoint extends React.Component {
  static defaultProps = {
    updateBreakpoint: ()=>{}
  };
  constructor(props,context) {
    super(props);
    props.updateBreakpoint(props.width);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width) {
      console.log('BREAK POINT UPDATED: ' + nextProps.width);
      nextProps.updateBreakpoint(nextProps.width);
    }
  }
  render() {
    return null;
  }
}

export default withWidth()(BreakPoint);
