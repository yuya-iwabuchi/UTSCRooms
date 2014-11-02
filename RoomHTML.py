import requests
import re
import datetime


import timeit

start = timeit.default_timer()


URL = 'https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd'

HTML = requests.get(URL).text

stop = timeit.default_timer()
print "Initial Download: %f seconds" % (stop - start)
start = timeit.default_timer()

WEEK_PICKER = 'bgcolor="#FFF0F1"'   # Pivot

WEEK_PICKER_RE = '<tr>.*?' + WEEK_PICKER + '.*?</tr>'
# This would contain the current week with day with the above color

week_html = re.search(WEEK_PICKER_RE, HTML).group(0)
week_days = []
for d in re.findall('>[0-9]+<', week_html):
    week_days.append(d[1:-1])
date = re.search(WEEK_PICKER + '.*?<', week_html).group(0)[len(WEEK_PICKER)+1: -1]
day = week_days.index(date)

# print date
# print week_days
# print day


post_week = re.search('value=".*?"', week_html).group(0)[7:-1]
# print post_week

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

# print post_rooms

stop = timeit.default_timer()
print "Regex Infos: %f seconds" % (stop - start)
start = timeit.default_timer()


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

stop = timeit.default_timer()
print "Download Post Data: %f seconds" % (stop - start)
start = timeit.default_timer()

room_data = {}

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
        'FM Hearing Assist Transmitter': re.search('<td>FM Hearing Assist Transmitter: .*?</td>', room).group(0)[35:-5]}

    room_data[name]['images'] = []
    for img in re.findall('<img src=".*?"', room):
        room_data[name]['images'].append(img[10:-1])

    room_data[name]['times'] = []
    time_html = re.search('<!-- START ROW OUTPUT -->.*?<!-- END ROW OUTPUT -->', room, re.DOTALL).group(0)
    for time in re.findall('<tr>.*?</tr>', time_html):
        if '&nbsp;' in time:
            room_data[name]['times'].append(re.search('<center>.*?</center>', time).group(0)[8:-9])

stop = timeit.default_timer()
print "Extract Post Data: %f seconds" % (stop - start)
start = timeit.default_timer()

# print room_data

current_time = datetime.datetime.now().strftime('%H:%M').split(':')
current_time = ['15', '13']
# print current_time
current_block_time = [current_time[0], '{0:02}'.format(int(current_time[1])//30 * 30)]
# print current_block_time

avail_rooms = []
for name, data in room_data.iteritems():
    avail_times = 0
    timer = current_block_time[:]
    while timer[0] + ':' + timer[1] in data['times']:
        avail_times += 1

        if timer[1] == '00':
            timer[1] = '30'
        else:
            timer = [str(int(timer[0]) + 1), '00']

    if avail_times != 0:
        avail_rooms.append([name, avail_times])

print avail_rooms