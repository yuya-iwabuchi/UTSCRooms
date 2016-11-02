/* global L */

import React, { PropTypes, Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as roomsActionsCreator from '../actions/rooms';

import * as api from '../api';
import locations from '../constants/locations';

const propTypes = {
  rooms: PropTypes.object.isRequired,
  roomsActions: PropTypes.object.isRequired,
};

class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.initMap = this.initMap.bind(this);
  }

  componentWillMount() {
    const { roomsActions } = this.props;

    api.getRoomList(roomsActions);
  }

  componentDidMount() {
    this.initMap();
  }

  componentWillReceiveProps(nextProps) {
    const { roomAvails } = nextProps.rooms;

    if (Object.keys(roomAvails).length !== 0) {
      Object.keys(roomAvails).forEach(roomId => {
        const roomInfo = roomId.split('-');
        const buildingId = roomInfo[0];
        const roomNumber = roomInfo[1];
        if (locations[buildingId]) {
          if (locations[buildingId].rooms[`${buildingId}${roomNumber}`]) {
            const room = locations[buildingId].rooms[`${buildingId}${roomNumber}`];
            const circle = L.circle([room.lat, room.lon], 3, {
              stroke: false,
              fillColor: 'red',
              fillOpacity: 0.5,
            }).addTo(this.leafletMap);
            circle.bindPopup(`<b>${roomId}</b>`);
          }
        }
      });
    }
  }

  // componentWillUpdate() {
  //   this.initMap();
  // }

  initMap() {
    /* eslint-disable */
    this.leafletMap = L.map('leafletMap').setView([43.784606, -79.186933], 17);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      minZoom: 17,
      id: 'kujira.14c5e80d',
      accessToken: 'pk.eyJ1Ijoia3VqaXJhIiwiYSI6ImNpcnV6bjkybDBoejl0Mm5reGducWRvYmQifQ.44mVSJwGrw5PdQvmZV0hig',
    }).addTo(this.leafletMap);
    console.log('Map initialized.')
    /* eslint-enable */

    // leafletMap.on('click', this.onMapClick);
  }

  render() {
    // const { rooms } = this.props;
    return (
      <div className="map-container" id="leafletMap">
      </div>
    );
  }
}

MapContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  rooms: state.rooms,
});

const mapDispatchToProps = dispatch => ({
  roomsActions: bindActionCreators(roomsActionsCreator, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapContainer);

