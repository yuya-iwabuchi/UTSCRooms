import React, { Component, PropTypes } from 'react';

import * as timeFormat from '../constants/timeFormat';

import locations from '../constants/locations';

const propTypes = {
  rooms: PropTypes.object,
  time: PropTypes.object,
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.onSortRooms = this.onSortRooms.bind(this);
    this.onSortTime = this.onSortTime.bind(this);
    this.onSortClass = this.onSortClass.bind(this);
    this.sort = this.sort.bind(this);

    this.state = {
      sortBy: '',
      sortOrder: '',
    };
  }

  onSortRooms(event) {
    this.setState({
      sortBy: 'rooms',
      sortOrder: event.target.name,
    });
  }

  onSortTime(event) {
    this.setState({
      sortBy: 'time',
      sortOrder: event.target.name,
    });
  }

  onSortClass(event) {
    this.setState({
      sortBy: 'class',
      sortOrder: event.target.name,
    });
  }

  sort(roomsList) {
    const { sortBy, sortOrder } = this.state;
    const sortRooms = (a, b) => {
      if (a.roomId === b.roomId) return 0;
      else if (sortOrder === 'asc') return (a.roomId > b.roomId) ? -1 : 1;
      return (a.roomId < b.roomId) ? -1 : 1;
    };

    const sortTime = (a, b) => {
      if (a.availUntil === b.availUntil) return 0;
      else if (a.availUntil === 'N/A') return sortOrder === 'asc' ? -1 : 1;
      else if (b.availUntil === 'N/A') return sortOrder === 'asc' ? 1 : -1;
      else if (sortOrder === 'asc') return (a.availUntil > b.availUntil) ? 1 : -1;
      return (a.availUntil < b.availUntil) ? 1 : -1;
    };

    const sortClass = (a, b) => {
      const classA = a.currentOrNextClass.toLowerCase();
      const classB = b.currentOrNextClass.toLowerCase();
      if (classA === classB) return 0;
      else if (sortOrder === 'asc') return (classA > classB) ? -1 : 1;
      return (classA < classB) ? -1 : 1;
    };

    if (sortBy === '') return roomsList;
    else if (sortBy === 'rooms') return roomsList.sort(sortRooms);
    else if (sortBy === 'time') return roomsList.sort(sortTime);
    return roomsList.sort(sortClass);
  }


  render() {
    const { rooms, time } = this.props;

    let roomsList = [];

    Object.keys(rooms.roomAvails).forEach(roomId => {
      const roomInfo = roomId.split('-');
      const buildingId = roomInfo[0];
      const roomNumber = roomInfo[1];
      if (locations[buildingId]) {
        if (locations[buildingId].rooms[`${buildingId}${roomNumber}`]) {
          let availUntil = 'N/A'; // eslint-disable-line
          let slotTime = Math.floor(time.time / 30) * 30;
          let currentOrNextClass = '';
          if (rooms.roomAvails[roomId][slotTime]) {
            currentOrNextClass = rooms.roomAvails[roomId][slotTime][time.day];
            if (rooms.roomAvails[roomId][slotTime][time.day] === '') {
              slotTime += 30;
              while (
                rooms.roomAvails[roomId][slotTime] &&
                rooms.roomAvails[roomId][slotTime][time.day] === ''
              ) {
                slotTime += 30;
              }
              availUntil = slotTime;
              currentOrNextClass = rooms.roomAvails[roomId][slotTime] ?
                rooms.roomAvails[roomId][slotTime][time.day] : 'None';
            }
          }

          roomsList.push({
            roomId,
            availUntil,
            currentOrNextClass,
          });
        }
      }
    });

    roomsList = this.sort(roomsList);

    return (
      <div className="table-container">
        <div className="table">
          <div className="thead">
            <div className="th">
              <div className="heading">Room</div>
              <button className="sorting" name="asc" onClick={this.onSortRooms}>&#9650;</button>
              <button className="sorting" name="desc" onClick={this.onSortRooms}>&#9660;</button>
            </div>
            <div className="th">
              <div className="heading">Availability</div>
              <button className="sorting" name="asc" onClick={this.onSortTime}>&#9650;</button>
              <button className="sorting" name="desc" onClick={this.onSortTime}>&#9660;</button>
            </div>
            <div className="th">
              <div className="heading">Current or Next Class</div>
              <button className="sorting" name="asc" onClick={this.onSortClass}>&#9650;</button>
              <button className="sorting" name="desc" onClick={this.onSortClass}>&#9660;</button>
            </div>
          </div>
          <div className="tbody">
          {
            roomsList.map(room => (
              <div className="tr" key={room.roomId}>
                <div className="td">{room.roomId}</div>
                <div className="td">
                  {room.availUntil === 'N/A' ? 'N/A' : timeFormat.timeToString(room.availUntil)}
                </div>
                <div className="td">{room.currentOrNextClass}</div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
    );
  }
}

Table.propTypes = propTypes;

export default Table;
