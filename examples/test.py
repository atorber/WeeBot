import frida
import sys

# 读取agent目录下的xp.js文件，获得js代码
# 使用UTF-8编码打开文件
agentSource = open("../agent/xp-3.9.10.19-lite.js", "r", encoding="utf-8").read()
# print(agentSource)

def on_message(message, data):
    print("[on_message] message:", message, "data:", data)
    content = message['payload']['content']
    contactId = message['payload']['fromUser']
    if content == "ding":
        print('content is ding:', content)
        script.post({
            'type': 'send', 
            'payload': {
            'text':'dong',
            'contactId':contactId,
        }})

session = frida.attach("WeChat.exe")

script = session.create_script(agentSource)
script.on("message", on_message)
script.load()
script.post({
            'type': 'send', 
            'payload': {
            'text':'online',
            'contactId':'filehelper',
        }})
print("[*] Press Ctrl+C to detach from process")

# 进入循环，保持脚本运行
# 使脚本持续运行，直到按下Ctrl+D
sys.stdin.read()
session.detach()