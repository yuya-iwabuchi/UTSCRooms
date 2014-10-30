import requests
import re


URL = 'https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd'

HTML = requests.get(URL).text

WEEK_PICKER = 'bgcolor="#FFF0F1"' # Pivot
WEEK_PICKER_RE = '<tr>.*?' + WEEK_PICKER  + '.*?</tr>'    # This would contain the current week with day with the above color

week_html = re.search(WEEK_PICKER_RE, HTML).group(0)
week_days = []
for d in re.findall('>[0-9]+<',week_html):
    week_days.append(d[1:-1])
date = re.search(WEEK_PICKER + '.*?<', week_html).group(0)[len(WEEK_PICKER)+ 1:-1]
day = week_days.index(date)
print date
print week_days
print day

post_week = re.search('value=".*?"', week_html).group(0)[7:-1]
print post_week


# data = {'radio_week':'26:80',
# 'chk_room_info':'Y',
# 'chk_room_pics':'Y',
# 'chk_rooms[]':['IC%20120','IC%20200','IC%20204','IC%20208','IC%20212','IC%20220',
#              'IC%20230','IC%20300','IC%20302','IC%20320','IC%20326','IC%20328'],
# 'sbmt_display':'Display'}
#
# r = requests.post(URL, data=data)
#
# f = open('test.html', 'w')

# f.write(r.text)

# f.close()


