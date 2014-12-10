import requests
import re
import datetime
import json


import timeit


URL = 'https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd'
HTML = requests.get(URL).text
WEEK_PICKER = 'bgcolor="#FFF0F1"'   # Pivot
# This would contain the current week with day with the above color
WEEK_PICKER_RE = '<tr>.*?' + WEEK_PICKER + '.*?</tr>'


def collect():

    start = timeit.default_timer()

    week_html = re.search(WEEK_PICKER_RE, HTML).group(0)
    week_days = []
    for d in re.findall('>[0-9]+<', week_html):
        week_days.append(d[1:-1])
    date = re.search(WEEK_PICKER + '.*?<', week_html).group(0)[len(WEEK_PICKER) + 1: -1]
    day = week_days.index(date)
    post_week = re.search('value=".*?"', week_html).group(0)[7:-1]

    # print 'Date of Month: %s\nPost Week: %s\nWeek Day Index: %s\n' % \
    #       (date, post_week, day)

    post_rooms = []

    room_html = re.search('<div id="listRooms".*?</div>', HTML, re.DOTALL).group(0)
    for room in re.findall('value=".*?"', room_html):
        post_rooms.append(room[7:-1])

    # post_rooms = [u'AA%20112', u'AA%20204', u'AA%20205', u'AA%20206', u'AA%20208', u'AA%20209',
    #               u'AC%20223', u'AC%20332', u'AC%20334', u'BV%20260', u'BV%20264', u'BV%20355',
    #               u'BV%20359', u'BV%20361', u'BV%20363', u'GYM', u'HW%20214', u'HW%20215',
    #               u'HW%20216', u'HW%20308', u'HW%20402', u'HW%20408', u'IC%20120', u'IC%20130',
    #               u'IC%20200', u'IC%20204', u'IC%20208', u'IC%20212', u'IC%20220', u'IC%20230',
    #               u'IC%20300', u'IC%20302', u'IC%20320', u'IC%20326', u'IC%20328', u'MW%20110',
    #               u'MW%20120', u'MW%20140', u'MW%20160', u'MW%20170', u'MW%20223', u'MW%20262',
    #               u'MW%20264', u'PO%20101', u'SW%20128', u'SW%20143', u'SW%20309', u'SW%20319',
    #               u'SY%20110']

    # post_rooms = [u'AA%20208']

    # print 'All Rooms:'
    # i = 0
    # for r in post_rooms:
    #     i += 1
    #     print ('%-8s' % r.replace('%20', ' ')),
    #     if i % 7 == 0:
    #         print ''
    # print ''

    data = {'radio_week': post_week,
            'chk_room_info': 'Y',
            'chk_room_pics': 'Y',
            'sel_day': day + 1,
            'chk_rooms[]': post_rooms,
            'sbmt_display': 'Display'}

    r = requests.post(URL, data=data)
    post_html = r.text

    #
    # f = open('test.html', 'w')
    #
    # f.write(r.text)
    #
    # f.close()

    room_data = {'collect': [datetime.datetime.now().strftime('%b %d, %Y'), date, day, post_week]}

    for room in re.findall('<h5>.*?<b>University_of_Toronto</b>', post_html, re.DOTALL):
        name = re.search('<h5>.*?</h5>', room).group(0)[4:-5]
        name = name.split('<br>')[0]    # Sometimes contains contact here
        room_data[name] = {
            'building': re.search('<td>Building: .*?</td>', room).group(0)[14:-5],
            'capacity': re.search('<td>Capacity: .*?</td>', room).group(0)[14:-5],
            'type': re.search('<td>Type: .*?</td>', room).group(0)[10:-5],
            'furniture': re.search('<td>Furniture: .*?</td>', room).group(0)[15:-5],
            'blackboard': re.search('<td>Blackboard: .*?</td>', room).group(0)[16:-5],
            'floor': re.search('<td>Floor: .*?</td>', room).group(0)[11:-5],
            'clock': re.search('<td>Clock: .*?</td>', room).group(0)[11:-5],
            'lectern': re.search('<td>Lectern: .*?</td>', room).group(0)[13:-5],
            'storage': re.search('<td>Storage: .*?</td>', room).group(0)[13:-5],
            'wheelchair': re.search('<td>Wheelchair: .*?</td>', room).group(0)[16:-5],
            'window': re.search('<td>Window: .*?</td>', room).group(0)[12:-5],
            'FM Hearing Assist Transmitter': re.search('<td>FM Hearing Assist Transmitter: .*?</td>',
                                                       room).group(0)[35:-5]}

        room_data[name]['images'] = []
        for img in re.findall('<img src=".*?"', room):
            room_data[name]['images'].append(img[10:-1])

        room_data[name]['times'] = []
        time_html = re.search('<!-- START ROW OUTPUT -->.*?<!-- END ROW OUTPUT -->', room, re.DOTALL).group(0)
        for ti in re.findall("<center>[^=]*?colspan='[1-9][0-9]*' rowspan='[1-9][0-9]*'", time_html):
            t = re.search("<center>.*?</center>", ti).group(0)[8:-9].split(':')
            for block in range(int(re.search("rowspan='[1-9][0-9]*'", ti).group(0)[9:-1])):

                room_data[name]['times'].append(
                    str(int(t[0]) + block//2 + (int(t[1])//30 + block % 2) // 2) + ':' + '{0:02}'.format(
                        ((int(t[1])//30 + block) % 2) * 30))

    with open('room_data.json', 'w') as f:
        json.dump(room_data, f)

    return timeit.default_timer() - start

def display(room_data, current_block_time):

    room_data.pop('collect')
    avail_rooms = []
    for name, data in room_data.iteritems():
        avail_times = 0
        timer = current_block_time[:]
        while timer[0] + ':' + timer[1] not in data['times']:
            if timer[0] == '30':
                avail_times = -1
                break
            avail_times += 1

            if timer[1] == '00':
                timer[1] = '30'
            else:
                timer = [str(int(timer[0]) + 1), '00']

        if avail_times != 0:
            avail_rooms.append([name, avail_times])

    sorted_list = avail_rooms[:]

    sort_by = 1
    if len(sorted_list) >= 10:
        sort_by = 0
    sorted_list.sort(key=lambda x: x[sort_by])
    sorted_list.reverse()

    print 'Currently Available Rooms:\n%-9s|%13s' % ('Room', 'Next Class')
    print '---------|-------------'
    for r in sorted_list:
        if r[1] == -1:
            t = 'None'
        else:
            t = str(int(current_block_time[0]) + r[1]//2 + \
                (int(current_block_time[1])//30 + r[1] % 2) // 2) + \
                ':' + '{0:02}'.format(((int(current_block_time[1])//30 + \
                r[1]) % 2) * 30)

        print '%-9s|%13s' % (r[0], t)


def choose_time(time):
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


    current_block_time = [current_time[0], '{0:02}'.format(int(current_time[1])//30 * 30)]

    print('Time: %s:%s\nBlock Time: %s:%s\n' % (current_time[0], current_time[1],
                                                current_block_time[0], current_block_time[1]))
    return current_block_time

if __name__ == '__main__':
    jsondate = None
    try:
        with open('room_data.json') as g:
            data = json.load(g)
            print 'JSON stored date: %s' % data['collect'][0]
            jsondate = datetime.datetime.strptime(data['collect'][0], '%b %d, %Y')
    except:
        pass
    # data['collect'][0] = (datetime.datetime.strptime(data['collect'][0], '%b %d, %Y') - datetime.timedelta(hours = 1)).strftime('%b %d, %Y')


    #

    if not jsondate or (jsondate + datetime.timedelta(days = 1)).date() <= datetime.datetime.now().date():
        print 'The data you have is outdated.\nUpdating data ...',
        t = collect()
        with open('room_data.json') as g:
            data = json.load(g)
        print 'done! Took %.2fs' % t
        print 'New JSON stored date: %s' % data['collect'][0]


    custom_time = ''

    custom_time = choose_time(custom_time)
    display(data, custom_time)