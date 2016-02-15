from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from django.shortcuts import render_to_response

import RoomHTML

def index(request, day=-1, time=''):
    output = '<code>'
    try:
    	output += RoomHTML.run(time=time, day=int(day)) #.replace(' ', '&nbsp;')
    except:
	output += 'Invalid Input'
    output += '<br><br><br>Usage:<br>To check current available rooms:<br>'
    output += ' <a href="http://rooms.kujira.ca">rooms.kujira.ca</a><br><br>'
    output += 'To manually select the day and time to check.<br>http://rooms.kujira.ca/[day]/[time]<br><br>day  - 0-6       [0=Mon, 6=Sun]<br>time - 0-2400    [13=1:00PM, 1220=12:20PM]<br><br>'.replace(' ', '&nbsp;')
    output += 'Ex. <a href="http://rooms.kujira.ca/0/1200">rooms.kujira.ca/0/1200</a> - To check for Monday 12:00PM<br><br>Under Development<br><a href="https://github.com/Sunakujira1/UTSCRooms">Github - UTSCRooms</a><br><br><br></code>'
    output = output
    return HttpResponse(output)

def test(request):
    return render_to_response('example.html')
