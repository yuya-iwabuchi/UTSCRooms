import * as types from '../constants/actionTypes';

const initialState = {
  day: 0,
  time: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TIME:
      return Object.assign({}, state, { time: action.time });
    case types.SET_DAY:
      return Object.assign({}, state, { day: action.day });
    default:
      return state;
  }
};
