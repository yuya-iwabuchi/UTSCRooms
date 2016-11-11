import React, { PropTypes, Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as roomsActionsCreator from '../actions/rooms';
import * as timeActionsCreator from '../actions/time';

import * as api from '../api';


import TimeChanger from '../components/TimeChanger';
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
  }

  onChildClick(key, childProps) {
    const { roomsActions } = this.props;
    roomsActions.setCurrentRoom(childProps.roomId);
  }

  onTimeSlotChange(event, value) {
    this.setState({ timeSlot: value });
  }

  render() {
    const { rooms, time, timeActions } = this.props;
    return (
      <div className="list-container">
        <TimeChanger
          time={time}
          timeActions={timeActions}
        />
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

