import * as types from '../constants/actionTypes';

const initialState = {
  roomList: [],
  roomAvails: {},
  currentRoom: null,
  collecting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ROOM_LIST:
      return Object.assign({}, state, { roomList: action.roomList });
    case types.SET_ROOM_AVAILS:
      return Object.assign({}, state, { roomAvails: action.roomAvails });
    case types.SET_CURRENT_ROOM:
      return Object.assign({}, state, { currentRoom: action.currentRoom });
    case types.SET_ROOM_COLLECTING:
      return Object.assign({}, state, { collecting: action.collecting });
    default:
      return state;
  }
};
