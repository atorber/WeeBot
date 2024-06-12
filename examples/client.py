import frida
import codecs
import sys

def on_message(message, data):
    if message['type'] == 'response':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)

processname = "some.app"
scriptpath = "./inject.js"

manager = frida.get_device_manager()
device  = manager.add_remote_device("192.168.0.2:23946")
pid     = device.spawn([processname])
session = device.attach(pid)

with codecs.open(scriptpath, "r", "utf-8") as f:
    jscode = f.read();

script = session.create_script(jscode)
script.on('message', on_message)
script.load()
device.resume(pid)

# sending message to inject.js script
script.post_message({
    'type': 'task', 
    'payload': "some serializable data"
})
sys.stdin.read()