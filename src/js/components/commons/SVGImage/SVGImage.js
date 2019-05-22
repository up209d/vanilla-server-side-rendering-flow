import React, {useState, useEffect, useRef} from 'react';
import utils from 'js/utils';

import injectSheet from 'react-jss';

import {
  Grid,
  CircularProgress,
  Fade
} from '@material-ui/core';

const styles = theme => ({
  svgContainer: {
    width: props => props.width || undefined,
    height: props => props.height || undefined,
    ['& > svg']: {
      // Some style for SVG
    }
  }
});

const SVGImage = props => {
  const { classes } = props;

  const size = Math.max(props.width || 0, props.height || 0);
  const [isLoaded, setIsLoaded] = useState(false);
  const svgDom = useRef(null);

  const setSVGInline = src => {
    setIsLoaded(false);
    // Important, we have to place any async action into the callback of setState
    // setState will recall componentWillMount and so on, and if an other setState jump in that time
    // there will be reflected as warning
    utils.axios({
      url: src,
      useCache: true
    }).then((res) => {
      setIsLoaded(true);
      if (svgDom && svgDom.current) {
        svgDom.current.innerHTML = res.data; // set innerHTML is faster the React dangerouslySetInnerHTML
      }
    });
  };

  useEffect(() => {
    setSVGInline(props.src);
  }, [props.src]);

  return isLoaded ? (
    <Fade in={isLoaded}>
      <div className={classes.svgContainer} ref={svgDom}/>
    </Fade>
  ) : (
    <Grid>
      <CircularProgress size={size} style={{padding: size / 4}}/>
    </Grid>
  )
};

// class SVGImage extends React.Component {
//   state = {
//     isLoaded: false
//   };
//
//   static getDerivedStateFromProps(nextProps, prevState) {
//     if (nextProps.src !== prevState.src) {
//       this.setSVGInline(nextProps.src);
//       return {
//         ...prevState,
//         ...props
//       }
//     }
//     return null;
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (this.props.src !== nextProps.src) {
//       this.setSVGInline(nextProps.src);
//     }
//   }
//
//   componentDidMount() {
//     this.setSVGInline(this.props.src);
//   }
//
//   setSVGInline(src) {
//     let self = this;
//     self.setState({
//       isLoaded: false
//     }, () => {
//       // Important, we have to place any async action into the callback of setState
//       // setState will recall componentWillMount and so on, and if an other setState jump in that time
//       // there will be reflected as warning
//       utils.axios({
//         url: src,
//         useCache: true
//       }).then((res) => {
//         self.setState({
//           isLoaded: true
//         }, () => {
//           self.svgDom.innerHTML = res.data; // set innerHTML is faster the React dangerouslySetInnerHTML
//         });
//       });
//     });
//   }
//
//   render() {
//     const props = this.props;
//     const {classes} = props;
//     const size = Math.max(props.width || 0, props.height || 0);
//     return this.state.isLoaded ? (
//       <Fade in={this.state.isLoaded}>
//         <div className={classes.svg} ref={svgDom => this.svgDom = svgDom}/>
//       </Fade>
//     ) : (
//       <Grid>
//         <CircularProgress size={size} style={{padding: size / 4}}/>
//       </Grid>
//     )
//   }
// }

SVGImage.defaultProps = {
  width: 32
};

export default injectSheet(styles)(SVGImage);
