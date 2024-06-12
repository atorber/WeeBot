import frida
import sys
import time

session = frida.attach("hello.exe")
script = session.create_script("""
Interceptor.attach(ptr("%s"), {
    onEnter(args) {                   
        send(args[0].toInt32());
                               args[0] = ptr("1337");
    }
});
""" % int(sys.argv[1], 16))
def on_message(message, data):
    print(time.time())
    print(message)
script.on('message', on_message)
script.load()
sys.stdin.read()