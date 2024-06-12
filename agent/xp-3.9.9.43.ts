/**
 * WeChat 3.9.9.43
 * 
 */

// 偏移地址,来自于wxhelper项目
import { wxOffsets_3_9_9_43 as wxOffsets } from './offset.js';

// 当前支持的微信版本
const availableVersion = 1661534743 // 3.9.2.23  ==0x63090217

const moduleBaseAddress = Module.getBaseAddress('WeChatWin.dll')
const moduleLoad = Module.load('WeChatWin.dll')
// console.log('moduleBaseAddress:', moduleBaseAddress)

/* -----------------base------------------------- */
let retidPtr: any = null
let retidStruct: any = null
const initidStruct = ((str: string | any[]) => {

  retidPtr = Memory.alloc(str.length * 2 + 1)
  retidPtr.writeUtf16String(str)

  retidStruct = Memory.alloc(0x14) // returns a NativePointer

  retidStruct
    .writePointer(retidPtr).add(0x04)
    .writeU32(str.length * 2).add(0x04)
    .writeU32(str.length * 2).add(0x04)
    .writeU32(0).add(0x04)
    .writeU32(0)

  return retidStruct
})

let retPtr: any = null
let retStruct: any = null
const initStruct = ((str: any) => {
  retPtr = Memory.alloc(str.length * 2 + 1)
  retPtr.writeUtf16String(str)

  retStruct = Memory.alloc(0x14) // returns a NativePointer

  retStruct
    .writePointer(retPtr).add(0x04)
    .writeU32(str.length * 2).add(0x04)
    .writeU32(str.length * 2).add(0x04)
    .writeU32(0).add(0x04)
    .writeU32(0)

  return retStruct
})

let msgstrPtr: any = null
let msgStruct: any = null
const initmsgStruct = (str: any) => {
  msgstrPtr = Memory.alloc(str.length * 2 + 1)
  msgstrPtr.writeUtf16String(str)

  msgStruct = Memory.alloc(0x14) // returns a NativePointer

  msgStruct
    .writePointer(msgstrPtr).add(0x04)
    .writeU32(str.length * 2).add(0x04)
    .writeU32(str.length * 2).add(0x04)
    .writeU32(0).add(0x04)
    .writeU32(0)

  return msgStruct
}

let atStruct: any = null
const initAtMsgStruct = (wxidStruct: any) => {
  atStruct = Memory.alloc(0x10)

  atStruct.writePointer(wxidStruct).add(0x04)
    .writeU32(wxidStruct.toInt32() + 0x14).add(0x04)// 0x14 = sizeof(wxid structure)
    .writeU32(wxidStruct.toInt32() + 0x14).add(0x04)
    .writeU32(0)
  return atStruct
}

const readStringPtr = (address: any) => {
  const addr: any = ptr(address)
  const size = addr.add(16).readU32()
  const capacity = addr.add(20).readU32()
  addr.ptr = addr
  addr.size = size
  addr.capacity = capacity
  if (capacity > 15 && !addr.readPointer().isNull()) {
    addr.ptr = addr.readPointer()
  }
  addr.ptr._readCString = addr.ptr.readCString
  addr.ptr._readAnsiString = addr.ptr.readAnsiString
  addr.ptr._readUtf8String = addr.ptr.readUtf8String
  addr.readCString = () => {
    return addr.size ? addr.ptr._readCString(addr.size) : ''
  }
  addr.readAnsiString = () => {
    return addr.size ? addr.ptr._readAnsiString(addr.size) : ''
  }
  addr.readUtf8String = () => {
    return addr.size ? addr.ptr._readUtf8String(addr.size) : ''
  }

  // console.log('readStringPtr() address:',address,' -> str ptr:', addr.ptr, 'size:', addr.size, 'capacity:', addr.capacity)
  // console.log('readStringPtr() str:' , addr.readUtf8String())
  // console.log('readStringPtr() address:', addr,'dump:', addr.readByteArray(24))

  return addr
}

const readWStringPtr = (address: any) => {
  const addr: any = ptr(address)
  const size = addr.add(4).readU32()
  const capacity = addr.add(8).readU32()
  addr.ptr = addr.readPointer()
  addr.size = size
  addr.capacity = capacity
  addr.ptr._readUtf16String = addr.ptr.readUtf16String
  addr.readUtf16String = () => {
    return addr.size ? addr.ptr._readUtf16String(addr.size * 2) : ''
  }

  // console.log('readWStringPtr() address:',address,' -> ptr:', addr.ptr, 'size:', addr.size, 'capacity:', addr.capacity)
  // console.log('readWStringPtr() str:' ,  `"${addr.readUtf16String()}"`,'\n',addr.ptr.readByteArray(addr.size*2+2),'\n')
  // console.log('readWStringPtr() address:', addr,'dump:', addr.readByteArray(16),'\n')

  return addr
}

const readString = (address: any) => {
  return readStringPtr(address).readUtf8String()
}

const readWideString = (address: any) => {
  return readWStringPtr(address).readUtf16String()
}

// 发送文本消息
const sendMsgNativeFunction = (talkerId: string, content: any) => {

  const txtAsm: any = Memory.alloc(Process.pageSize)
  // const buffwxid = Memory.alloc(0x20)

  const wxidPtr: any = Memory.alloc(talkerId.length * 2 + 2)
  wxidPtr.writeUtf16String(talkerId)

  const picWxid = Memory.alloc(0x0c)
  picWxid.writePointer(ptr(wxidPtr)).add(0x04)
    .writeU32(talkerId.length * 2).add(0x04)
    .writeU32(talkerId.length * 2).add(0x04)

  const contentPtr = Memory.alloc(content.length * 2 + 2)
  contentPtr.writeUtf16String(content)

  const sizeOfStringStruct = Process.pointerSize * 5
  const contentStruct = Memory.alloc(sizeOfStringStruct)

  contentStruct
    .writePointer(contentPtr).add(0x4)
    .writeU32(content.length).add(0x4)
    .writeU32(content.length * 2)

  const ecxBuffer = Memory.alloc(0x2d8)

  Memory.patchCode(txtAsm, Process.pageSize, code => {
    const cw = new X86Writer(code, {
      pc: txtAsm,
    })
    cw.putPushfx()
    cw.putPushax()

    cw.putPushU32(0x0)
    cw.putPushU32(0x0)
    cw.putPushU32(0x0)
    cw.putPushU32(0x1)
    cw.putPushU32(0x0)

    // cw.putMovRegReg

    cw.putMovRegAddress('eax', contentStruct)
    cw.putPushReg('eax')

    cw.putMovRegAddress('edx', picWxid) // room_id

    cw.putMovRegAddress('ecx', ecxBuffer)
    cw.putCallAddress(moduleBaseAddress.add(
      wxOffsets.sendText.WX_SEND_TEXT_OFFSET,
    ))

    cw.putAddRegImm('esp', 0x18)
    cw.putPopax()
    cw.putPopfx()
    cw.putRet()
    cw.flush()

  })

  // console.log('----------txtAsm', txtAsm)
  const nativeativeFunction = new NativeFunction(ptr(txtAsm), 'void', [])
  nativeativeFunction()

}

// sendMsgNativeFunction('tyutluyc', 'hello world')

// 接收消息回调
const recvMsgNativeCallback = (() => {

  const nativeCallback = new NativeCallback(() => { }, 'void', ['int32', 'pointer', 'pointer', 'pointer', 'pointer', 'int32'])
  const nativeativeFunction = new NativeFunction(nativeCallback, 'void', ['int32', 'pointer', 'pointer', 'pointer', 'pointer', 'int32'])

  try {
    Interceptor.attach(
      moduleBaseAddress.add(wxOffsets.hookMsg.WX_RECV_MSG_HOOK_OFFSET), {
      onEnter() {
        try {
          const addr = (this.context as any).ecx // 0xc30-0x08
          const msgType = addr.add(0x38).readU32()
          const isMyMsg = addr.add(0x3C).readU32() // add isMyMsg

          if (msgType > 0) {

            const talkerIdPtr = addr.add(0x48).readPointer()
            // console.log('txt msg',talkerIdPtr.readUtf16String())
            const talkerIdLen = addr.add(0x48 + 0x04).readU32() * 2 + 2

            const myTalkerIdPtr = Memory.alloc(talkerIdLen)
            Memory.copy(myTalkerIdPtr, talkerIdPtr, talkerIdLen)

            let contentPtr: any = null
            let contentLen = 0
            let myContentPtr: any = null
            // console.log('msgType', msgType)

            if (msgType === 3) { // pic path
              const thumbPtr = addr.add(0x19c).readPointer()
              const hdPtr = addr.add(0x1b0).readPointer()
              const thumbPath = thumbPtr.readUtf16String()
              const hdPath = hdPtr.readUtf16String()
              const picData = [
                thumbPath, //  PUPPET.types.Image.Unknown
                thumbPath, //  PUPPET.types.Image.Thumbnail
                hdPath, //  PUPPET.types.Image.HD
                hdPath, //  PUPPET.types.Image.Artwork
              ]
              const content = JSON.stringify(picData)
              console.log('pic msg', content)
              myContentPtr = Memory.allocUtf16String(content)
            } else {
              contentPtr = addr.add(0x70).readPointer()
              contentLen = addr.add(0x70 + 0x04).readU32() * 2 + 2
              myContentPtr = Memory.alloc(contentLen)
              Memory.copy(myContentPtr, contentPtr, contentLen)
            }

            //  console.log('----------------------------------------')
            //  console.log(msgType)
            //  console.log(contentPtr.readUtf16String())
            //  console.log('----------------------------------------')
            const groupMsgAddr = addr.add(0x174).readU32() //* 2 + 2
            let myGroupMsgSenderIdPtr: any = null
            if (groupMsgAddr === 0) { // weChatPublic is zero，type is 49

              myGroupMsgSenderIdPtr = Memory.alloc(0x10)
              myGroupMsgSenderIdPtr.writeUtf16String('null')

            } else {

              const groupMsgSenderIdPtr = addr.add(0x174).readPointer()
              const groupMsgSenderIdLen = addr.add(0x174 + 0x04).readU32() * 2 + 2
              myGroupMsgSenderIdPtr = Memory.alloc(groupMsgSenderIdLen)
              Memory.copy(myGroupMsgSenderIdPtr, groupMsgSenderIdPtr, groupMsgSenderIdLen)

            }

            const xmlNullPtr = addr.add(0x1f0).readU32() // 3.9.2.23
            let myXmlContentPtr: any = null
            if (xmlNullPtr === 0) {

              myXmlContentPtr = Memory.alloc(0x10)
              myXmlContentPtr.writeUtf16String('null')

            } else {
              const xmlContentPtr = addr.add(0x1f0).readPointer() // 3.9.2.23

              const xmlContentLen = addr.add(0x1f0 + 0x04).readU32() * 2 + 2
              myXmlContentPtr = Memory.alloc(xmlContentLen)
              Memory.copy(myXmlContentPtr, xmlContentPtr, xmlContentLen)
            }
            console.log('msgType', msgType)
            console.log('talkerId', myTalkerIdPtr.readUtf16String())
            console.log('content', myContentPtr.readUtf16String())
            console.log('groupMsgSenderId', myGroupMsgSenderIdPtr.readUtf16String())
            console.log('xmlContent', myXmlContentPtr.readUtf16String())
            console.log('isMyMsg', isMyMsg)
            setImmediate(() => nativeativeFunction(msgType, myTalkerIdPtr, myContentPtr, myGroupMsgSenderIdPtr, myXmlContentPtr, isMyMsg))
          }
        } catch (e: any) {
          console.error('接收消息回调失败：', e)
          throw new Error(e)
        }
      },
    })
    return nativeCallback
  } catch (e) {
    console.error('回调消息失败：')
    return null
  }

})()

const recvMsgNativeCallbackTest = () => {

  const nativeCallback = new NativeCallback(() => { }, 'void', ['int32', 'pointer', 'pointer', 'pointer', 'pointer', 'int32'])
  const nativeativeFunction = new NativeFunction(nativeCallback, 'void', ['int32', 'pointer', 'pointer', 'pointer', 'pointer', 'int32'])

  try {
    Interceptor.attach(
      moduleBaseAddress.add(wxOffsets.hookMsg.WX_RECV_MSG_HOOK_OFFSET), {
      onEnter() {
        try {
          const addr = (this.context as any).ecx // 0xc30-0x08
          const msgType = addr.add(0x38).readU32()
          const isMyMsg = addr.add(0x3C).readU32() // add isMyMsg

          if (msgType > 0) {

            const talkerIdPtr = addr.add(0x48).readPointer()
            // console.log('txt msg',talkerIdPtr.readUtf16String())
            const talkerIdLen = addr.add(0x48 + 0x04).readU32() * 2 + 2

            const myTalkerIdPtr = Memory.alloc(talkerIdLen)
            Memory.copy(myTalkerIdPtr, talkerIdPtr, talkerIdLen)

            let contentPtr: any = null
            let contentLen = 0
            let myContentPtr: any = null
            // console.log('msgType', msgType)

            if (msgType === 3) { // pic path
              const thumbPtr = addr.add(0x19c).readPointer()
              const hdPtr = addr.add(0x1b0).readPointer()
              const thumbPath = thumbPtr.readUtf16String()
              const hdPath = hdPtr.readUtf16String()
              const picData = [
                thumbPath, //  PUPPET.types.Image.Unknown
                thumbPath, //  PUPPET.types.Image.Thumbnail
                hdPath, //  PUPPET.types.Image.HD
                hdPath, //  PUPPET.types.Image.Artwork
              ]
              const content = JSON.stringify(picData)
              console.log('pic msg', content)
              myContentPtr = Memory.allocUtf16String(content)
            } else {
              contentPtr = addr.add(0x70).readPointer()
              contentLen = addr.add(0x70 + 0x04).readU32() * 2 + 2
              myContentPtr = Memory.alloc(contentLen)
              Memory.copy(myContentPtr, contentPtr, contentLen)
            }

            //  console.log('----------------------------------------')
            //  console.log(msgType)
            //  console.log(contentPtr.readUtf16String())
            //  console.log('----------------------------------------')
            const groupMsgAddr = addr.add(0x174).readU32() //* 2 + 2
            let myGroupMsgSenderIdPtr: any = null
            if (groupMsgAddr === 0) { // weChatPublic is zero，type is 49

              myGroupMsgSenderIdPtr = Memory.alloc(0x10)
              myGroupMsgSenderIdPtr.writeUtf16String('null')

            } else {

              const groupMsgSenderIdPtr = addr.add(0x174).readPointer()
              const groupMsgSenderIdLen = addr.add(0x174 + 0x04).readU32() * 2 + 2
              myGroupMsgSenderIdPtr = Memory.alloc(groupMsgSenderIdLen)
              Memory.copy(myGroupMsgSenderIdPtr, groupMsgSenderIdPtr, groupMsgSenderIdLen)

            }

            const xmlNullPtr = addr.add(0x1f0).readU32() // 3.9.2.23
            let myXmlContentPtr: any = null
            if (xmlNullPtr === 0) {

              myXmlContentPtr = Memory.alloc(0x10)
              myXmlContentPtr.writeUtf16String('null')

            } else {
              const xmlContentPtr = addr.add(0x1f0).readPointer() // 3.9.2.23

              const xmlContentLen = addr.add(0x1f0 + 0x04).readU32() * 2 + 2
              myXmlContentPtr = Memory.alloc(xmlContentLen)
              Memory.copy(myXmlContentPtr, xmlContentPtr, xmlContentLen)
            }

            // setImmediate(() => nativeativeFunction(msgType, myTalkerIdPtr, myContentPtr, myGroupMsgSenderIdPtr, myXmlContentPtr, isMyMsg))
          }
        } catch (e: any) {
          console.error('接收消息回调失败：', e)
          throw new Error(e)
        }
      },
    })
    return nativeCallback
  } catch (e) {
    console.error('回调消息失败：')
    return null
  }

}

recvMsgNativeCallbackTest()
