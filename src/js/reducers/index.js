
import { combineReducers } from 'redux';
import rooms from '../reducers/rooms';
import time from '../reducers/time';

export default combineReducers({
  rooms,
  time,
});
