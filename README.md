# WeeBot

WeeBot提供最基本的WeChat消息收发功能，帮助你实现简单的自动化操作

## 下载和启动

1. 下载程序包 [WeeBot-3.9.10.27-0.6.0.zip](https://www.yuque.com/attachments/yuque/0/2024/zip/250308/1718969080072-81e3b9cc-d712-4005-9a38-f1fbb976616a.zip?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2024%2Fzip%2F250308%2F1718969080072-81e3b9cc-d712-4005-9a38-f1fbb976616a.zip%22%2C%22name%22%3A%22WeeBot-3.9.10.27-0.6.0.zip%22%2C%22size%22%3A45898878%2C%22ext%22%3A%22zip%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u515ede7c-14f2-4e3a-93b9-55e8708dc30%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fx-zip-compressed%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u71375e1b%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)
2. 登录WeChat客户端，确认当前版本为3.9.10.27（[下载WeChat客户端](https://github.com/tom-snow/wechat-windows-versions/releases/download/v3.9.10.27/WeChatSetup-3.9.10.27.exe)）
3. 解压缩后启动WeeBot程序，点击【Start】启动服务，点击【Stop】取消程序挂接

![a024aae6eec40d8ddebe01cd52916ffc.png](https://cdn.nlark.com/yuque/0/2024/png/250308/1718327308477-cf36e606-0e52-47af-8809-462fb1d0129e.png#averageHue=%23e6e6e6&clientId=u5d00b06c-dad2-4&from=paste&height=331&id=u16e01af9&originHeight=588&originWidth=1224&originalType=binary&ratio=1.75&rotation=0&showTitle=false&size=174721&status=done&style=none&taskId=uab297acf-d025-410d-ba77-4b8bc6e589b&title=&width=690)

## 接收消息

协议：websoket

连接地址：ws://127.0.0.1:19099

使用任意编程语言启动一个ws client即可实时接收消息推送
接收消息示例：

```json
{
  "id": "1264199305822102857",
  "filename": "",
  "text": "Jim",
  "timestamp": 1718391525,
  "type": 1,
  "talkerId": "luyc",
  "roomId": "21341182572@chatroom",
  "mentionIds": [],
  "listenerId": "",
  "isSelf": false
}
```

## WeeBot API说明

协议：http

API地址： http://127.0.0.1:19088

同时支持GET/POST的接口，在使用POST方法请求时body设置为{}

### 获取联系人列表 GET /api/contacts

```json
{
    "code": 1,
    "data": [
        {
            "id": "wwwang99326",
            "gender": 1,
            "type": 3,
            "name": "踏雪御苍穹",
            "friend": true,
            "star": false,
            "coworker": false,
            "address": null,
            "weixin": "cya89",
            "corporation": "",
            "title": "",
            "description": "",
            "phone": []
        },
        {
            "id": "wxid_sonjrdopx77221",
            "gender": 1,
            "type": 3,
            "name": "一类化学危险品汽车修理",
            "friend": true,
            "star": false,
            "coworker": false,
            "address": null,
            "weixin": "Z3381108383",
            "corporation": "",
            "title": "",
            "description": "",
            "phone": []
        }],
    "msg": "success"
}
```

### 获取群列表 GET /api/rooms

```json
{
    "code": 1,
    "data": [
        {
            "id": "20800000065@chatroom",
            "gender": 1,
            "type": 2,
            "name": "羽毛球俱乐部",
            "friend": true,
            "star": false,
            "coworker": false,
            "address": null,
            "weixin": "",
            "corporation": "",
            "title": "",
            "description": "",
            "phone": []
        },
        {
            "id": "2037110006@chatroom",
            "gender": 1,
            "type": 2,
            "name": "联盟🏸",
            "friend": true,
            "star": false,
            "coworker": false,
            "address": null,
            "weixin": "",
            "corporation": "",
            "title": "",
            "description": "",
            "phone": []
        }],
    "msg": "success"
}
```

### 获取登录用户信息 GET /api/contacts/self

```json
{
    "code": 1,
    "data": {
        "id": "wxid_xxx0o1t51l3f57221",
        "gender": 1,
        "name": "大师",
        "coworker": true,
        "avatar": "https://wx.qlogo.cn/mmhead/ver_1/2FFoLE7eRpAOFHUwYkLyicQwrhsDHZU1Nmp0IcDKJcmRNxlTgXlzrvmAYJDQ32NibNRBRTxfGyK09UyUgPibjAYibc7xJWtJvPoRfwAfRQdvgG8/0",
        "address": "",
        "alias": "",
        "city": "Haidian",
        "province": "Beijing",
        "weixin": "ledongmao",
        "corporation": "",
        "title": "",
        "description": "",
        "phone": [
            "15313358151"
        ]
    },
    "msg": "success"
}
```

### 发送文本消息 POST /api/message/text

```json
{"contactId": "filehelper","text": "1112224"}
```

```json
{
  "code": 1,
  "data": 1,
  "msg": "success"
}
```

## 兼容wxhelper API说明

兼容wxhelper接口，服务端口、路径、请求参数与wxhelper一致，**响应参数中的data有差异**

协议：http

API地址： http://127.0.0.1:19088
同时支持GET/POST的接口，在使用POST方法请求时body设置为{}

### 获取登录用户信息 POST /api/userInfo

入参：

```javascript
{}
```

响应：

```javascript
{
    "code": 1,
    "data": {
        "account": "xxx",
        "city": "Zhengzhou",
        "country": "CN",
        "currentDataPath": "C:\\WeChat Files\\wxid_xxx\\",
        "dataSavePath": "C:\\wechatDir\\WeChat Files\\",
        "dbKey": "965715e30e474da09250cb5aa047e3940ffa1c8f767c4263b132bb512933db49",
        "headImage": "https://wx.qlogo.cn/mmhead/ver_1/MiblV0loY0GILewQ4u2121",
        "mobile": "13949175447",
        "name": "xxx",
        "province": "Henan",
        "signature": "xxx",
        "wxid": "wxid_22222"
    },
    "msg": "success"
}
```

### 获取联系人和群列表 POST /api/getContactList

入参：

```json
{}
```

响应：

```json
{
    "code": 1,
    "data": [
        {
            "customAccount": "",
            "encryptName": "v3_020b3826fd03010000000000e04128fddf4d90000000501ea9a3dba12f95f6b60a0536a1adb6b40fc4086288f46c0b89e6c4eb8062bb1661b4b6fbab708dc4f89d543d7ade135b2be74c14b9cfe3accef377b9@stranger",
            "nickname": "文件传输助手",
            "pinyin": "WJCSZS",
            "pinyinAll": "wenjianchuanshuzhushou",
            "remark": "",
            "remark_pinyin": "",
            "remark_pinyin_all": "",
            "label_ids": "",
            "reserved1": 1,
            "reserved2": 1,
            "type": 3,
            "verifyFlag": 0,
            "wxid": "filehelper"
        }
    ],
    "msg": "success"
}
```

### 发送文本消息 POST /api/sendTextMsg

入参：

```typescript
{"wxid": "filehelper","msg": "1112224"}
```

响应：

```json
{
    "code": 1,
    "data": 1,
    "msg": "success"
}
```

## 兼容wechat-bot API说明

兼容wechat-bot接口，服务端口、路径、请求参数与wechat-bot一致，**响应参数中的data有差异**

协议：http

API地址： http://127.0.0.1:19088

同时支持GET/POST的接口，在使用POST方法请求时body设置为{}

### 获取联系人和群列表 POST **/api/getcontactlist**

```json
{
  "id":"123456",
  "type":5000,
  "roomid":"null",
  "wxid":"null",
  "content":"null",
  "nickname":"null",
  "ext":"null"
}
```

```json
{
    "code": 1,
    "data": [
        {
            "customAccount": "",
            "encryptName": "v3_020b3826fd03010000000000e04128fddf4d90000000501ea9a3dba12f95f6b60a0536a1adb6b40fc4086288f46c0b89e6c4eb8062bb1661b4b6fbab708dc4f89d543d7ade135b2be74c14b9cfe3accef377b9@stranger",
            "nickname": "文件传输助手",
            "pinyin": "WJCSZS",
            "pinyinAll": "wenjianchuanshuzhushou",
            "remark": "",
            "remark_pinyin": "",
            "remark_pinyin_all": "",
            "label_ids": "",
            "reserved1": 1,
            "reserved2": 1,
            "type": 3,
            "verifyFlag": 0,
            "wxid": "filehelper"
        }
    ],
    "msg": "success"
}
```

### 发送文本消息 POST **/api/sendtxtmsg**

```json
{
  "id":"123456",
  "type":555,
  "wxid":"23023281066@chatroom",
  "content":"hello word",
  "nickname":"null",
  "ext":"null"
}
```

```json
{
    "code": 1,
    "data": 1,
    "msg": "success"
}
```

## 更新日志

v0.6.0

- 新增wechat-bot兼容接口API

v0.5.3

- 优化启动逻辑，程序开启时自动启动，可手动停止
- 优化按钮操作显示，增加按钮激活、禁用状态
- 优化图片解析逻辑，增加延时保证缩略图下载

v0.5.0

- 新增接收图片（缩略图）消息
- 新增接收文件消息

v0.4.0

- 新增获取群列表接口/api/rooms
- 修复无法正常退出问题
- 修复联系人列表信息不全问题
- 优化响应数据格式

v0.1.0

- 初始化版本，支持获取联系人列表、获取当前用户信息、发送文本消息、接收消息
