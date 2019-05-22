import React, {useState, useEffect} from 'react';
import {withWidth} from '@material-ui/core';

const BreakPoint = props => {
  const [state, setState] = useState({});

  useEffect(() => {
    const nextProps = props;
    const prevState = state;
    if (nextProps.width !== prevState.width) {
      console.log('BREAK POINT UPDATED: ' + nextProps.width);
      nextProps.updateBreakpoint(nextProps.width);
      setState({
        ...prevState,
        ...nextProps
      })
    }
  });
  return null;
};

BreakPoint.defaultProps = {
  updateBreakpoint: () => {}
};

// class BreakPoint extends React.Component {
//   state = {}
//   static defaultProps = {
//     updateBreakpoint: () => {}
//   };
//
//   static getDerivedStateFromProps(nextProps, prevState) {
//     if (nextProps.width !== prevState.width) {
//       console.log('BREAK POINT UPDATED: ' + nextProps.width);
//       nextProps.updateBreakpoint(nextProps.width);
//       return {
//         ...prevState,
//         ...nextProps
//       }
//     }
//     return null;
//   }
//
//   render() {
//     return null;
//   }
// }

export default withWidth()(BreakPoint);
