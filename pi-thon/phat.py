# sudo python phat.py
# sudo apt-get install python-fourletterphat
# curl https://get.pimoroni.com/fourletterphat  | bash ... then reboot
# 

import os
import time
import logging
import fourletterphat as flp

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
  if data is None:
    print(data)
    flp.print_str("BREW")
    flp.show()
    flp.glow(period=1, duration=10)
  else:
    if data is 0:
      flp.clear()
      flp.print_str("0CUP")
      flp.show()
    else:
        num = int(data)
        if num > 9:
          flp.print_str(data+ "CP")
          flp.show()
        else:
          flp.print_str(data+"CUP")
          flp.show()

def main():
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
