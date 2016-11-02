UTSCRooms
=========

[Demo](https://utscrooms.js.org/)

A web application that simplifies the method for students to find empty classrooms at University of Toronto Scarborough.

Technology
===
Initially, naive me wrote a crawler in python, and hosted a HTML page using Django. This was very inefficient solution, and had to be hosted somewhere.  
To make things interested, I've decided to do all tasks on Javascript, which allows no infrastructure required on my end.
Currently, it's using React + ES6 syntax for the interface, and Yahoo! Query Language(YQL) is used to overcome cross-origin issues when crawling the data.


Background
====

At UTSC, ["Students are welcome to use empty classrooms as study spaces – as long as there are NO scheduled lectures, tutorials or standing bookings. Classrooms are open from 7 AM until 10 PM each day."](http://www.utsc.utoronto.ca/studentaffairs/study-space)  
That said, it is very tedious task to go to [UTSC Room Schedule](https://www.utsc.utoronto.ca/~registrar/scheduling/room_schd), choose classrooms and date, and check whether there are any schedule for the given time.
This webpage will allow the student to find classroom that is exactly available at given time.

Todo
===

- [x] Implement data crawling
- [x] Show list
- [ ] Memoize crawled data, automatic/manual data refresh
- [ ] Map view with pins
- [ ] Per room detail page
