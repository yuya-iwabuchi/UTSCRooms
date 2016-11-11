// 8:30 AM => (8*60)+30 => 510
// time - 510
// timeString - [8, 30]
export const timeToString = (time, ampm = true) => {
  const hour = Math.floor(time / 60);
  const minute = time % 60;
  if (ampm) {
    const ampmHour = hour % 12 === 0 ? 12 : hour % 12;
    if (minute < 10) return `${ampmHour}:0${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
    return `${ampmHour}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
  }
  if (minute < 10) return `${hour}:0${minute}`;
  return `${hour}:${minute}`;
};

export const stringToTime = timeString => timeString[0] * 60 + timeString[1];
