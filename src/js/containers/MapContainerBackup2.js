/* global L */

import React, { PropTypes, Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as roomsActionsCreator from '../actions/rooms';
import * as timeActionsCreator from '../actions/time';

import * as api from '../api';
import locations from '../constants/locations';

import RoomMarker from '../components/RoomMarker';

const propTypes = {
  rooms: PropTypes.object.isRequired,
  time: PropTypes.object.isRequired,
  roomsActions: PropTypes.object.isRequired,
  timeActions: PropTypes.object.isRequired,
};

class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.updateTime = this.updateTime.bind(this);
  }

  componentWillMount() {
    const { roomsActions } = this.props;
    this.updateTime();
    api.getRoomList(roomsActions);
    // setInterval(this.updateTime, 1000);
  }

  updateTime() {
    const { time, timeActions } = this.props;
    const today = new Date();
    const newDay = today.getDay() + 1;
    const newHour = 9;
    const newMinute = 50;
    // const newHour = today.getHours();
    // const newMinute = today.getMinutes();
    if (time.minute !== newMinute) timeActions.setTime(newHour, newMinute);
    if (time.day !== newDay) timeActions.setDay(newDay);
  }

  render() {
    const { rooms, time } = this.props;

    const position = [43.784606, -79.186933];
    const accessToken = 'pk.eyJ1Ijoia3VqaXJhIiwiYSI6ImNpcnV6bjkybDBoejl0Mm5reGducWRvYmQifQ.44mVSJwGrw5PdQvmZV0hig'; // eslint-disable-line
    const id = 'kujira.14c5e80d';
    return (
      <Map center={position} zoom={17} className="map-container">
        <TileLayer
          url={`https://api.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${accessToken}`}
          // url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={20}
          minZoom={17}
        />
        {
          Object.keys(rooms.roomAvails).map(roomId => {
            const roomInfo = roomId.split('-');
            const buildingId = roomInfo[0];
            const roomNumber = roomInfo[1];
            if (locations[buildingId]) {
              if (locations[buildingId].rooms[`${buildingId}${roomNumber}`]) {
                const room = locations[buildingId].rooms[`${buildingId}${roomNumber}`];
                return (
                  <RoomMarker
                    key={roomId}
                    roomId={roomId}
                    center={[room.lat, room.lon]}
                    avails={rooms.roomAvails[roomId]}
                    time={time}
                  />
                );
              }
            }
            return null;
          })
        }
      </Map>
    );
  }
}

MapContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  rooms: state.rooms,
  time: state.time,
});

const mapDispatchToProps = dispatch => ({
  roomsActions: bindActionCreators(roomsActionsCreator, dispatch),
  timeActions: bindActionCreators(timeActionsCreator, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapContainer);

