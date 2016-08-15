import * as types from '../constants/actionTypes';

const initialState = {
  roomList: [],
  roomAvails: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ROOM_LIST:
      return Object.assign({}, state, { roomList: action.roomList });
    case types.SET_ROOM_AVAILS:
      return Object.assign({}, state, { roomAvails: action.roomAvails });
    default:
      return state;
  }
};
