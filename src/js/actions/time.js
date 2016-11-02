import * as types from '../constants/actionTypes';

export const setDay = day => ({
  type: types.SET_DAY,
  day,
});

export const setTime = time => ({
  type: types.SET_TIME,
  time,
});
