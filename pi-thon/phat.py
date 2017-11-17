# sudo python phat.py
# sudo apt-get install python-fourletterphat
# curl https://get.pimoroni.com/fourletterphat  | bash ... then reboot
# 

import os
import time
import logging
import fourletterphat as flp

from socketIO_client import SocketIO

logging.getLogger('socketIO-client').setLevel(logging.DEBUG)

socketIO = SocketIO('https://coffee-pot-pi.herokuapp.com')

def connect():
  print('Connected to server')
  socketIO.emit()