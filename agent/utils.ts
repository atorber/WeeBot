/* -----------------base------------------------- */

/* -----------------base------------------------- */
let retidPtr: any = null
let retidStruct: any = null
export const initidStruct = ((str: string | any[]) => {

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
export const initStruct = ((str: any) => {
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
export const initmsgStruct = (str: any) => {
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
export const initAtMsgStruct = (wxidStruct: any) => {
  atStruct = Memory.alloc(0x10)

  atStruct.writePointer(wxidStruct).add(0x04)
    .writeU32(wxidStruct.toInt32() + 0x14).add(0x04)// 0x14 = sizeof(wxid structure)
    .writeU32(wxidStruct.toInt32() + 0x14).add(0x04)
    .writeU32(0)
  return atStruct
}

export const readStringPtr = (address: any) => {
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

export const readString = (address: any) => {
  return readStringPtr(address).readUtf8String()
}

export const readWideString = (address: any) => {
  return readWStringPtr(address).readUtf16String()
}

export const writeWStringPtr = (str: string) => {
    // console.log(`输入字符串内容: ${str}`);
    const strLength = str.length;
    // console.log(`字符串长度: ${strLength}`);

    // 计算UTF-16编码的字节长度（每个字符2个字节）
    const utf16Length = strLength * 2;

    // 计算我们需要为字符串对象结构分配的总内存空间，结构包含：指针 (Process.pointerSize) + 长度 (4 bytes) + 容量 (4 bytes)
    const structureSize = Process.pointerSize + 4 + 4;

    // 为字符串数据和结构体分配连续的内存空间
    const totalSize = utf16Length + 2 + structureSize; // +2 用于 null 终止符
    const basePointer = Memory.alloc(totalSize);

    // 将结构体指针定位到分配的内存起始位置
    const structurePointer = basePointer;
    // console.log(`字符串分配空间内存指针: ${structurePointer}`);

    // 将字符串数据指针定位到结构体之后的位置
    const stringDataPointer = basePointer.add(structureSize);
    // console.log(`字符串保存地址指针: ${stringDataPointer}`);

    // 将 JavaScript 字符串转换成 UTF-16 编码格式，并写入分配的内存空间
    stringDataPointer.writeUtf16String(str);
    // console.log(`写入字符串到地址: ${stringDataPointer.readUtf16String()}`);

    // 检查分配的内存内容
    const allocatedMemoryContent = stringDataPointer.readUtf16String();
    // console.log(`检查分配的内存内容: ${allocatedMemoryContent}`);

    // 在分配的内存空间中写入字符串对象的信息
    // 写入字符串数据指针
    structurePointer.writePointer(stringDataPointer);
    // console.log(`写入字符串地址存放指针: ${structurePointer.readPointer()}`);
    // console.log(`写入字符串内容确认: ${structurePointer.readPointer().readUtf16String()}`);

    // 写入字符串长度（确保是长度，不包含 null 终止符）
    structurePointer.add(Process.pointerSize).writeU32(strLength);
    // console.log(`写入字符串长度指针: ${structurePointer.add(Process.pointerSize)}`);

    // 写入字符串容量，这里我们假设容量和长度是相同的
    structurePointer.add(Process.pointerSize + 4).writeU32(strLength);
    // console.log(`写入字符串容量指针: ${structurePointer.add(Process.pointerSize + 4)}`);

    // console.log(`写入字符串内容再次确认: ${structurePointer.readPointer().readUtf16String()}`);
    // console.log(`写入字符地址再次确认: ${structurePointer.readPointer()}`);
    // console.log(`读取32位测试: ${structurePointer.readPointer().readS32()}`);
    // console.log(`return写入字符串结构体: ${structurePointer}`);

    // 返回分配的结构体表面的起始地址
    return structurePointer;
};

export const readWStringPtr = (addr: any) => {
    // console.log(`input读取字符串地址指针4: ${addr}`);
    // console.log(`读取字符串内容指针4: ${addr.readPointer().readUtf16String()}`);
    const stringPointer = addr.readPointer();
    // console.log(`读取数据指针地址1: ${stringPointer}`);
    // console.log(`读取数据指针内容1: ${stringPointer.readUtf16String()}`);

    const size = addr.add(Process.pointerSize).readU32();
    // console.log(`读取字符串长度: ${size}`);

    const capacity = addr.add(Process.pointerSize + 4).readU32();
    // console.log(`读取字符串容量: ${capacity}`);

    return {
        ptr: stringPointer,
        size: size,
        capacity: capacity,
        readUtf16String: () => {
            // UTF-16字符串长度需要乘以2，因为每个字符占2个字节
            const content = size ? stringPointer.readUtf16String()?.replace(/\0+$/, '') : '';
            // console.log(`读取字符串内容: ${content}`);
            return content;
        }
    };
};

//   string GetStringByStrAddr(UINT64 addr)
// {
//     size_t strLength = GET_DWORD(addr + 8);
//     return strLength ? string(GET_STRING(addr), strLength) : string();
// }
export const getStringByStrAddr = (addr:any)=>{
  const strLength = addr.add(8).readU32();
  // console.log('strLength:', strLength)
 return strLength ? addr.readPointer().readUtf16String(strLength) : '';
}

export interface WeChatMessage {
    // 发送者的用户标识
    fromUser: string;

    // 接收者的用户标识
    toUser?: string;

    room?:string;

    // 消息内容，这里提供的是 XML 格式的数据
    content: string;

    // 消息签名，包含了一些描述和验证信息
    signature: string;

    // 消息的唯一识别码
    msgId: string;

    // 消息的序列号
    msgSequence: number;

    // 消息的创建时间戳
    createTime: number;

    // 全文展示的标记，这里为空字符串，具体情况需要根据实际的业务逻辑确定
    displayFullContent: string;

    // 消息的类型，这里为 3，具体指代意义在业务中确定
    type: number;

    base64Img?: string;
    isSelf?: boolean;
}

export function ReadWeChatStr(addr: any) {
    // console.log("addr: " + addr);
    addr = ptr(addr);
    var len = addr.add(0x10).readS64(); // 使用 ptr的`.readS64`方法
    // console.log("len: " + len);

    if (len == 0) return "";

    var max_len = addr.add(0x18).readS64();
    // console.log("max_len: " + max_len);
    let res = ''
    if ((max_len.or(0xF)).equals(0xF)) {
        res = addr.readUtf8String(len);

    } else {
        var char_from_user = addr.readPointer();
        res = char_from_user.readUtf8String(len);
    }
    // console.log("res: " + res);
    return res;
}

export function ReadSKBuiltinString(addr: { add: (arg0: number) => string | number; }) {
    console.log("addr: " + addr);
    var inner_string = ptr(addr.add(0x8)).readS64();
    console.log("inner_string: " + inner_string);

    // if (inner_string.isNull()) return "";
    return ReadWeChatStr(inner_string);
}

export const findIamgePathAddr = (param2: any) => {
    const len = 0x180
    console.log('param2:', param2)
    console.log('len:', len)
    let path = ''
    let isPath = false
    for (let i = 0; i < len; i++) {
        const offset = (i + 1) + 0x280 * 0
        console.log('offset:', offset)
        try {
            path = ReadSKBuiltinString(param2.add(offset).readS64()) // 发送者
            isPath = hasPath(path)
            if (isPath) {
                console.log('ReadSKBuiltinString offset:', offset)
                console.log('path:', path)
                break
            }
        } catch (error) {
            // console.error('error:', error)
        }
        try {
            path = ReadWeChatStr(param2.add(offset).readS64()) // 消息签名
            isPath = hasPath(path)
            if (isPath) {
                console.log('ReadWeChatStr offset:', offset)
                console.log('path:', path)
                break
            }
        } catch (error) {
            // console.error('error:', error)
        }
    }
}

export const hasPath = (path: string | undefined) => {
    // return path.indexOf('Thumb') !== -1
    if (path && path.length > 0) {
        console.log('path is :', path)
    }
    return false
}

// 接收消息
export function uint8ArrayToString(arr: Uint8Array) {
    const utf8 = Array.from(arr).map(byte => String.fromCharCode(byte as number)).join('');
    return decodeURIComponent(escape(utf8));
}

// 将字符串转换为 Uint8Array
export function stringToUint8Array(str: string) {
    const utf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        arr[i] = utf8.charCodeAt(i);
    }
    return arr;
}

// 读取流数据
export const readAll = async (input: InputStream): Promise<any> => {
    const chunks: any[] = [];
    const size = 1024;
    let chunk: any;
    let i = 0;
    let isEnd = false;
    while (!isEnd) {
        try {
            chunk = await input.read(size)
            // console.log('chunk:', chunk);
            // console.log('chunk.byteLength:', chunk.byteLength);

            // 示例接收数据
            const receivedData = new Uint8Array(chunk);

            const message = uint8ArrayToString(receivedData);
            chunks.push(message);

            if (chunk.byteLength < size) {
                isEnd = true;
                break;
            }
            // console.log('isEnd:', isEnd);
        } catch (error) {
            console.error('Failed to read chunk:', error);
        }
    }

    return chunks.join('');
};