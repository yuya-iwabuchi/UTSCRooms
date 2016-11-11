import './jqueryMod';
/* global $ */

const parseRoomAvail = (response, roomsActions) => {
  const roomAvails = {};
  Object.keys(response).forEach(room => {
    roomAvails[room] = {};
    const parsedRoom = $($.parseHTML(response[room]));

    parsedRoom.find('tbody tr').each((index, timeRow) => {
      let rowTime;
      let rowAddedCount = 0;
      $(timeRow).find('td').each((i, timeColumn) => {
        const parsedColumn = $(timeColumn);
        if (i === 0) {
          const rowTimeString = (parsedColumn.text().split(':'));
          rowTime = (parseInt(rowTimeString[0], 10) * 60) + parseInt(rowTimeString[1], 10);
          if (!roomAvails[room][rowTime]) {
            roomAvails[room][rowTime] = {
              1: '',
              2: '',
              3: '',
              4: '',
              5: '',
              6: '',
              7: '',
            };
          }
        } else {
          if (parsedColumn.hasClass('booked')) {
            let loopCount = parseInt(parsedColumn.attr('rowspan'), 10);
            let currentTime = rowTime;
            let column = 1;
            let padding = 0;
            while (column <= i) {
              if (roomAvails[room][currentTime][column] !== '') padding += 1;
              column += 1;
            }
            while (loopCount > 0) {
              if (!roomAvails[room][currentTime]) {
                roomAvails[room][currentTime] = {
                  1: '',
                  2: '',
                  3: '',
                  4: '',
                  5: '',
                  6: '',
                  7: '',
                };
              }
              roomAvails[room][currentTime][i + padding - rowAddedCount] = parsedColumn.text();
              currentTime += 30;
              // console.log(currentTime)
              loopCount -= 1;
            }
            rowAddedCount += 1;
          }
        }
      });
      // console.log(time);
    });
  });
  // console.table(roomAvails['IC-220']);
  roomsActions.setRoomAvails(roomAvails);
};

export const getRoomAvail = (roomList, roomsActions) => {
  const url = 'https://intranet.utsc.utoronto.ca/intranet2/RegistrarService';

  let rooms = '';
  roomList.forEach(room => { rooms += `${room},`; });
  rooms = rooms.substring(0, rooms.length - 1);

  const today = new Date();
  const todayDay = (((today.getDay()) + 6) % 7); // 1=Mon, 7=Sun
  let date = `${today.getFullYear()}-`;
  date += `${(`00${(today.getMonth() + 1)}`).slice(-2)}-`;
  date += `${(`00${(today.getDate() - todayDay)}`).slice(-2)}`;

  $.ajax({
    url,
    dataType: 'jsonp',
    data: {
      room: rooms,
      day: date,
    },
    type: 'GET',
    success: response => parseRoomAvail(response, roomsActions),
  });
};

const parseRoomList = (response, roomsActions) => {
  const roomList = [];
  // let weekCode;
  // console.log($.parseHTML(`<div>${response.responseText}</div>`))
  // $(response.responseText)
  const parsedRespose = $($.parseHTML(response.responseText));

  parsedRespose
    .find('div#listRooms > table > tbody > tr:not(:first-child) > td:nth-child(2)')
    .each((index, room) => roomList.push($(room).text().replace(' ', '-')));
  roomsActions.setRoomList(roomList);

  // const today = new Date();
  // const todayDay = (((today.getDay()) + 6) % 7) + 1; // 1=Mon, 7=Sun
  // const todayDate = String(today.getDate());

  /* eslint-disable */
  // parsedRespose
  //   .find('form > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(n+3)') // eslint-disable-line
  //   .each((index, week) => {
  //     let weekFound = false;
  //     $(week).find('td').each((i, date) => {
  //       if (i === 0) weekCode = $(date).find('input[name=radio_week]').val();
  //       else if (i === todayDay && $(date).text() === todayDate) {
  //         weekFound = true;
  //         return false;
  //       }
  //       return true;
  //     });
  //     if (weekFound) return false;
  //     return true;
  //   });
  /* eslint-enable */

  // console.log(weekCode);
  getRoomAvail(roomList, roomsActions);
};

export const getRoomList = roomsActions => {
  const url = 'https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd';
  $.ajax({
    url,
    type: 'GET',
    success: response => parseRoomList(response, roomsActions),
  });
};

