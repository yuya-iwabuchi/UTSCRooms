#!/usr/bin/env python
# Author: Yuya Iwabuchi
# Email:  yuya.iwabuchi@gmail.com

import requests
import re
import datetime
import json
import timeit
import os
import sys

URL = 'https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd'
ROOM_URL = 'https://intranet.utsc.utoronto.ca/intranet2/RegistrarService'


def get_html(url, data={}):
    try:
        html = requests.post(url, data=data).text
    except requests.exceptions.SSLError:
        sys.stderr = open(os.devnull, "w")
        html = requests.post(url, data=data, verify=False).text
        sys.stderr = sys.__stderr__
    return html

def collect(date, day):

    start = timeit.default_timer()
    default_html = get_html(URL)

    post_rooms = ""
    rooms = []

    room_html = re.search('<div id="listRooms".*?</div>', default_html, re.DOTALL).group(0)
    for room in re.findall('value=".*?"', room_html):
        post_rooms += room[7:-1].replace('%20', '-').encode('ascii', 'ignore') + ','
        rooms.append(room[7:-1].replace('%20', '-').encode('ascii', 'ignore'))
    post_rooms = post_rooms[:-1]

    data = {'room': post_rooms,
            'day': '2015-06-15'}

    post = get_html(ROOM_URL, data=data).encode('ascii', 'ignore')
    not_found = []
    found = []
    room_data = {'collect': {'collected_on': datetime.datetime.now().strftime('%b %d, %Y'), 'collected_week_of': date}}
    for room in rooms:
        room_regex = ('\"%s":"<table.*?table>' % room)
        try:
            data = re.search(room_regex, post, re.DOTALL).group(0)
            found.append(room)
            room_data[room] = []
        except:
            not_found.append(room)
            continue
        data = re.findall('<tr>.*?tr>', data, re.DOTALL)
        for i in range(48):
            if i == 0:
                for day in re.findall('<th>.*?<\\\\/th>', data[i], re.DOTALL):
                    if len(day) > 10:
                        room_data[room].append([day[4:-6]] + [None]*47)
            else:
                if 'rowspan' in data[i]:
                    days = re.findall('<td.*?<\\\\/td>', data[i], re.DOTALL)
                    same_time = 0
                    for k in range(len(days)):
                        if 'rowspan' in days[k]:
                            rows = int(re.search('rowspan=\'.*?\'', days[k]).group(0)[9:-1])
                            name = re.search('>.*?<', days[k]).group(0)[1:-1]
                            count = 0
                            for j in range(k):
                                if room_data[room][j][i]:
                                    count += 1
                            for l in range(rows):
                                room_data[room][(k - 1) + count - same_time][i+l] = name
                            same_time += 1

    with open('room_data.json', 'w') as f:
        json.dump(room_data, f, indent=4)
    return timeit.default_timer() - start

# def collect2(date):
#
#     start = timeit.default_timer()
#     default_html = get_html(URL)
#
#     try:
#         week_html = re.search('<tr>.*?' + date + '.*?</tr>', default_html).group(0)
#     except AttributeError:
#         print 'Error!\nCould not find current day/week. Usage in weekend is currently not supported.'
#         exit()
#
#     week_days = []
#     for d in re.findall('>[0-9]+<', week_html):
#         week_days.append(d[1:-1])
#     day = week_days.index(date)
#     post_week = re.search('value=".*?"', week_html).group(0)[7:-1]
#     # print 'Date of Month: %s\nPost Week: %s\nWeek Day Index: %s\n' % \
#     #       (date, post_week, day)
#
#     post_rooms = []
#
#     room_html = re.search('<div id="listRooms".*?</div>', default_html, re.DOTALL).group(0)
#     for room in re.findall('value=".*?"', room_html):
#         post_rooms.append(room[7:-1])
#
#     # post_rooms = [u'AA%20112', u'AA%20204', u'AA%20205', u'AA%20206', u'AA%20208', u'AA%20209',
#     #               u'AC%20223', u'AC%20332', u'AC%20334', u'BV%20260', u'BV%20264', u'BV%20355',
#     #               u'BV%20359', u'BV%20361', u'BV%20363', u'GYM', u'HW%20214', u'HW%20215',
#     #               u'HW%20216', u'HW%20308', u'HW%20402', u'HW%20408', u'IC%20120', u'IC%20130',
#     #               u'IC%20200', u'IC%20204', u'IC%20208', u'IC%20212', u'IC%20220', u'IC%20230',
#     #               u'IC%20300', u'IC%20302', u'IC%20320', u'IC%20326', u'IC%20328', u'MW%20110',
#     #               u'MW%20120', u'MW%20140', u'MW%20160', u'MW%20170', u'MW%20223', u'MW%20262',
#     #               u'MW%20264', u'PO%20101', u'SW%20128', u'SW%20143', u'SW%20309', u'SW%20319',
#     #               u'SY%20110']
#
#     # post_rooms = [u'AA%20208']
#     # print 'All Rooms:'
#     # i = 0
#     # for r in post_rooms:
#     #     i += 1
#     #     print ('%-8s' % r.replace('%20', ' ')),
#     #     if i % 7 == 0:
#     #         print ''
#     # print ''
#
#     data = {'radio_week': post_week,
#             'chk_room_info': 'Y',
#             'chk_room_pics': 'Y',
#             'sel_day': str(day + 1),
#             'chk_rooms[]': post_rooms,
#             'sbmt_display': 'Display'}
#
#     post_html = get_html(URL, data=data)
#     room_data = {'collect': [datetime.datetime.now().strftime('%b %d, %Y'), date, day, post_week]}
#     for room in re.findall('<script type="text/javascript">.*?</script>', post_html, re.DOTALL):
#         name = re.search('<h5>.*?</h5>', room).group(0)[4:-5]
#         name = name.split('<br>')[0]    # Sometimes contains contact here
#         room_data[name] = {
#             'building': re.search('<td>Building: .*?</td>', room).group(0)[14:-5],
#             'capacity': re.search('<td>Capacity: .*?</td>', room).group(0)[14:-5],
#             'type': re.search('<td>Type: .*?</td>', room).group(0)[10:-5],
#             'furniture': re.search('<td>Furniture: .*?</td>', room).group(0)[15:-5],
#             'blackboard': re.search('<td>Blackboard: .*?</td>', room).group(0)[16:-5],
#             'floor': re.search('<td>Floor: .*?</td>', room).group(0)[11:-5],
#             'clock': re.search('<td>Clock: .*?</td>', room).group(0)[11:-5],
#             'lectern': re.search('<td>Lectern: .*?</td>', room).group(0)[13:-5],
#             'storage': re.search('<td>Storage: .*?</td>', room).group(0)[13:-5],
#             'wheelchair': re.search('<td>Wheelchair: .*?</td>', room).group(0)[16:-5],
#             'window': re.search('<td>Window: .*?</td>', room).group(0)[12:-5],
#             'FM Hearing Assist Transmitter': re.search('<td>FM Hearing Assist Transmitter: .*?</td>',
#                                                        room).group(0)[35:-5]}
#
#         room_data[name]['images'] = []
#         for img in re.findall('<img src=".*?"', room):
#             room_data[name]['images'].append(img[10:-1])
#
#         room_data[name]['times'] = []
#         time_html = re.search('<!-- START ROW OUTPUT -->.*?<!-- END ROW OUTPUT -->', room, re.DOTALL).group(0)
#         for ti in re.findall("<center>[^=]*?colspan='[1-9][0-9]*' rowspan='[1-9][0-9]*'", time_html):
#             t = re.search("<center>.*?</center>", ti).group(0)[8:-9].split(':')
#             for block in range(int(re.search("rowspan='[1-9][0-9]*'", ti).group(0)[9:-1])):
#                 room_data[name]['times'].append(
#                     str(int(t[0]) + block//2 + (int(t[1])//30 + block % 2) // 2) + ':' + '{0:02}'.format(
#                         ((int(t[1])//30 + block) % 2) * 30))
#     with open('room_data.json', 'w') as f:
#         json.dump(room_data, f, indent=4)
#     print room_data
#     return timeit.default_timer() - start


def find_avail_rooms(room_data, current_time_number, day):
    room_data.pop('collect')
    avail_rooms = []
    for room, data in room_data.iteritems():
        counter = 0
        while not data[day][current_time_number + counter]:           # FIND DAY
            if current_time_number + counter == 47:
                break
            counter += 1

        if counter != 0:
            avail_rooms.append([room, counter])
    sorted_list = avail_rooms[:]
    sorted_list.sort(key=lambda x: x[1])
    sorted_list.reverse()
    return sorted_list


def display(sorted_list, current_time_block):

    print 'Currently Available Rooms:\n%-9s|%13s' % ('Room', 'Next Class')
    print '---------|-------------'
    for r in sorted_list:
        t = str(int(current_time_block[0]) + r[1]//2 +
                (int(current_time_block[1])//30 + r[1] % 2) // 2) + \
            ':' + '{0:02}'.format(((int(current_time_block[1])//30 +
            r[1]) % 2) * 30)

        print '%-9s|%13s' % (r[0], t)


def choose_time(time):
    current_time = ['00', '00']
    if time == '':
        current_time = datetime.datetime.now().strftime('%H:%M').split(':')
    elif len(time) <= 2:
        try:
            current_time = [str(int(time)), '00']
        except:
            print 'Invalid Input'
            exit()
    elif len(time) == 3:
        if ':' in time:
            print 'Invalid Input'
            exit()
        try:
            current_time = [str(int(time[0])), '{0:02}'.format(int(time[1:3]))]
        except:
            print 'Invalid Input'
            exit()
    elif len(time) == 4:
        if ':' in time:
            try:
                current_time = [str(int(time[0])), '{0:02}'.format(int(time[1:3]))]
            except:
                print 'Invalid Input'
                exit()
        else:
            try:
                current_time = [str(int(time[0:2])), '{0:02}'.format(int(time[2:4]))]
            except:
                print 'Invalid Input'
                exit()
    elif len(time) == 5:
        if ':' in time:
            try:
                current_time = [str(int(time[0:2])), '{0:02}'.format(int(time[3:5]))]
            except:
                print 'Invalid Input'
                exit()
        else:
            print 'Invalid Input'
            exit()
    else:
        print 'Invalid Input'
        exit()
    current_time_block = [current_time[0], '{0:02}'.format(int(current_time[1])//30 * 30)]
    print('Time: %s:%s\nBlock Time: %s:%s\n' % (current_time[0], current_time[1],
                                                current_time_block[0], current_time_block[1]))
    current_time_number = (int(current_time_block[0]))*2 + int(current_time_block[1])//30 + 1
    return [current_time_number] + current_time_block


def run(time=''):
    json_date, data = None, None
    try:
        with open('room_data.json') as g:
            data = json.load(g)
            print 'JSON stored date: %s' % data['collect']['collected_on']
            json_date = datetime.datetime.strptime(data['collect']['collected_on'], '%b %d, %Y')
    except:
        pass

    date = datetime.datetime.now().strftime('%Y-%m-%d')
    day = (int(datetime.datetime.now().strftime('%w'))-1) % 7

    if not json_date or (json_date + datetime.timedelta(days=1)).date() <= datetime.datetime.now().date():
        print 'The data you have is outdated.\nUpdating data ...',

        t = collect(date, day)
        with open('room_data.json') as g:
            data = json.load(g)
        print 'done! Took %.2fs' % t
        print 'New JSON stored date: %s' % data['collect']['collected_on']

    time = choose_time(time)
    avail_rooms = find_avail_rooms(data, time[0], day)
    display(avail_rooms, time[1:])


if __name__ == '__main__':
    run(time='')
