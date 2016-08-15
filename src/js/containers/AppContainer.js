import React, { Component } from 'react';
import '../../css/styles.scss';

import DevTools from '../components/DevTools';
import Header from '../components/Header';
import MapContainer from './MapContainer';

class AppContainer extends Component {
  render() {
    return (
      <div>
      <DevTools />
        <Header />
        <MapContainer />
      </div>
    );
  }
}

export default AppContainer;
