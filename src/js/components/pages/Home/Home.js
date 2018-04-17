import React from 'react';
import {
  withStyles
} from 'material-ui';

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions,dispatch)
});

const style = theme => ({

});

const Home = props => {
  const { classes } = props;
  return (
    <div>
      <h1>HOMEPAGE</h1>
    </div>
  )
};

export default withStyles(style,{withTheme: true})(Home);