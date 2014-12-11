UTSCRooms
=========

Simply checks available rooms within UTSC and finds out when it is available until.

##Current Usage

Directly execute the script or import and call `run()` function which will check the available rooms and displays it.  
By default it checks for current time. You can also set custom time by passing `time` variable.  

Example: 
```python
run()                # Current Time
run(time='')         # Current Time
run(time='1730')     # 5:30PM
run(time='12')       # 12:00PM
```

====
Using [UTSC Room Schedule](https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd)
