import React, { Component } from 'react';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


import '../../css/styles.scss';

import Header from '../components/Header';
import ListContainer from './ListContainer';
// import MapContainer from './MapContainer';

class AppContainer extends Component {
  render() {
    return (
      <div>
        <Header />
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div className="main-container">
            <ListContainer />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AppContainer;
