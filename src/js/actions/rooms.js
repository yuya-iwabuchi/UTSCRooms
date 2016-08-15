
import * as types from '../constants/actionTypes';

export const setRoomList = roomList => ({
  type: types.SET_ROOM_LIST,
  roomList,
});

export const setRoomAvails = roomAvails => ({
  type: types.SET_ROOM_AVAILS,
  roomAvails,
});
