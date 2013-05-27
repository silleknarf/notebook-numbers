#!/usr/bin/python

"""Server side validation of email and logging of signups"""

import cgi
import re
import time

def matchEmail(email):
	emailRegex = r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}'
	matchedEmail = re.match(emailRegex, email, re.IGNORECASE).group(0)
	return matchedEmail

print "Content-type: text/html\n"
form = cgi.FieldStorage()
email = form['email'].value

if matchEmail(email):

	# Log email to file
    with open("../signups.txt", "a") as signups:
		emailWithTimestamp = email+","+str(time.time())+"\n"
		signups.write(emailWithTimestamp)
		print "Signed up with: "+email

# Pass the error back to javascript
else:
	print "Error"
