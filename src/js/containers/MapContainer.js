import React, { PropTypes, Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as roomsActionsCreator from '../actions/rooms';

import * as api from '../api';

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

  // componentWillUpdate() {
  //   this.initMap();
  // }

  initMap() {
    /* eslint-disable */
    const leafletMap = L.map('leafletMap').setView([43.784606, -79.186933], 17);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      minZoom: 17,
      id: 'kujira.14c5e80d',
      accessToken: 'pk.eyJ1Ijoia3VqaXJhIiwiYSI6ImNpcnV6bjkybDBoejl0Mm5reGducWRvYmQifQ.44mVSJwGrw5PdQvmZV0hig',
    }).addTo(leafletMap);
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

