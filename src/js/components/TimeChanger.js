import React, { Component, PropTypes } from 'react';

import * as timeFormat from '../constants/timeFormat';

const propTypes = {
  time: PropTypes.object,
  timeActions: PropTypes.object,
};

export const debounce = (func, wait, immediate) => {
  let timeout;
  return function debouncedFunc(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

class TimeChanger extends Component {
  constructor(props) {
    super(props);

    this.onChangeTime = this.onChangeTime.bind(this);

    this.changeTime = debounce(this.changeTime.bind(this), 500);
    this.state = {
      tempTime: 480,
    };
  }

  componentWillMount() {
    const { timeActions } = this.props;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (hour >= 22) timeActions.setTime(1320);
    else if (hour <= 8) timeActions.setTime(480);
    else {
      timeActions.setTime(hour * 60 + minute);
    }
    timeActions.setDay((now.getDay() === 0 ? 7 : now.getDay()));
    // timeActions.setTime(943);
  }

  onChangeTime(event) {
    const time = parseInt(event.target.value, 10);
    this.changeTime(time);
    this.setState({ tempTime: time });
  }

  changeTime(time) {
    const { timeActions } = this.props;
    timeActions.setTime(time);
  }

  render() {
    // const { time } = this.props;
    const { tempTime } = this.state;

    return (
      <div className="time-changer-container">
        <div className="time">{timeFormat.timeToString(tempTime)}</div>
        <input
          className="time-picker"
          type="range"
          onChange={this.onChangeTime}
          min="480"
          max="1320"
          step="1"
          value={tempTime}
        />
      </div>
    );
  }
}

TimeChanger.propTypes = propTypes;

export default TimeChanger;
