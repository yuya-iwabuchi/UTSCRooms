/* global L */

import React, { PropTypes, Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as timeFormat from '../constants/timeFormat';

import * as roomsActionsCreator from '../actions/rooms';
import * as timeActionsCreator from '../actions/time';

import * as api from '../api';

import Table from '../components/Table';


const propTypes = {
  rooms: PropTypes.object.isRequired,
  time: PropTypes.object.isRequired,
  roomsActions: PropTypes.object.isRequired,
  timeActions: PropTypes.object.isRequired,
};

class ListContainer extends Component {
  constructor(props) {
    super(props);

    this.onChildClick = this.onChildClick.bind(this);
    this.onTimeSlotChange = this.onTimeSlotChange.bind(this);
  }

  componentWillMount() {
    const { roomsActions } = this.props;
    api.getRoomList(roomsActions);

    const now = new Date();

    // this.props.timeActions.setTime(1043);
    this.props.timeActions.setTime(now.getHours() * 60 + now.getMinutes());
    this.props.timeActions.setDay((now.getDay() === 0 ? 7 : now.getDay()));
  }

  onChildClick(key, childProps) {
    const { roomsActions } = this.props;
    roomsActions.setCurrentRoom(childProps.roomId);
  }

  onTimeSlotChange(event, value) {
    this.setState({ timeSlot: value });
  }

  render() {
    const { rooms, time } = this.props;
    return (
      <div className="list-container">
        <div className="time-changer">
          {timeFormat.timeToString(time.time)}
        </div>
        <Table
          rooms={rooms}
          time={time}
        />
      </div>
    );
  }
}

ListContainer.propTypes = propTypes;

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
)(ListContainer);

