# sudo python phat.py
# sudo apt-get install python-fourletterphat
# curl https://get.pimoroni.com/fourletterphat  | bash ... then reboot
# 

import os
import time
import logging
# import fourletterphat as flp

from socketIO_client_nexus import SocketIO, LoggingNamespace

logging.getLogger('socketIO-client').setLevel(logging.DEBUG)
logging.basicConfig(level=logging.DEBUG)


socketIO = SocketIO('https://coffee-pot-pi.herokuapp.com')

def on_connect():
  print 'Connected to server'
  socketIO.emit('piConnected')

def on_reconnect():
  print('Reconnected to server')
  socketIO.emit('piConnected')

def on_disconnect():
  print('disconnected')
  socketIO.emit('piDisconnected')

def cupToPi(data):
  print('Wahoo!')
  print data;

def main():
  print 'yyyy tho'
  socketIO.on('connect', on_connect);
  socketIO.on('reconnect', on_reconnect);
  socketIO.on('disconnect', on_disconnect);
  socketIO.on('cupToPi', cupToPi);
  socketIO.wait();

if __name__ == '__main__':
  try:
    main()
  except KeyboardInterrupt:
    print 'Killed'
    sys.exit(0)