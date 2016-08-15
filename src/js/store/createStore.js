import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import DevTools from '../components/DevTools';

import reducers from '../reducers';

export default (initialState = {}) => {
  const middleware = [thunk];
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    )
  );

  // // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  // if (module.hot) {
  //   module.hot.accept('../reducers', () =>
  //     store.replaceReducer(require('../reducers')/* .default if you use Babel 6+ */)
  //   );
  // }

  return store;
};
