import React from 'react';
import ReactDOM from 'react-dom';


import { Provider } from 'react-redux';
import createStore from './js/store/createStore';
const store = createStore();

import AppContainer from './js/containers/AppContainer';

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
