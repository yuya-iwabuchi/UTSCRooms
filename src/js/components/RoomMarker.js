import React, { PropTypes, Component } from 'react';

const propTypes = {
  roomId: PropTypes.string.isRequired,
  available: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
};

class RoomMarker extends Component {
  render() {
    const { roomId, available, selected } = this.props;

    const color = available ? 'blue' : 'red';

    return (
      <div className="room-marker">
        <div
          className="inner-circle"
          style={{ backgroundColor: color }}
        />
        <div
          className="outer-circle"
          style={{
            borderColor: color,
            opacity: selected ? 1 : 0,
          }}
        />
      </div>
    );
  }
}
RoomMarker.propTypes = propTypes;

export default RoomMarker;
