import net from '@frida/net';
import { HTTPParser } from 'http-parser-js';

function parseHttpRequest(rawRequest) {
    const parser = new HTTPParser(HTTPParser.REQUEST);
    const headersArr: string[] = [];
    const body: any = [];
    let method;
    let url
    parser[HTTPParser.kOnHeadersComplete] = (info) => {
        method = info.method
        url = info.url
        headersArr.push(...info.headers);
    };

    parser[HTTPParser.kOnBody] = (chunk, offset, length) => {
        body.push(chunk.slice(offset, offset + length));
    };

    parser.execute(rawRequest as any);
    const headers = {};
    headersArr.forEach((header, i) => {
        if (i % 2 === 0) {
            headers[header] = headersArr[i + 1];
        }
    });

    return {
        method,
        url,
        headers,
        body: rawRequest.toString().split('\r\n\r\n').pop(),
    };
}

const server = net.createServer((socket: any) => {

    socket.on('connect', () => {
        console.log('客户端已连接');
    });

    socket.on('data', (data: any) => {
        console.log('收到数据:\n', data.toString());
        // console.log('收到数据:\n', uint8ArrayToString(data));

        const parsedRequest = parseHttpRequest(data);
        console.log('parsedRequest', JSON.stringify(parsedRequest, null, 2));

        // 创建响应
        const responseBody = JSON.stringify({
            msg: 'Hello, Word! I am server，你好'
        });

        const response = `HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: ${stringToUint8Array(responseBody).byteLength}\r\n\r\n${responseBody}`;

        // 发送响应
        socket.write(response);
    });

    socket.on('end', () => {
        console.log('客户端已断开连接');
    });

    socket.on('close', () => {
        console.log('客户端已断开连接');
    });

    socket.on('timeout', () => { });

    socket.on('error', (err: any) => {
        console.error('Socket 错误:', err);
    });

    socket.on('listening', () => {
        console.log('Socket 正在监听');
    });
});

server.listen(8082, () => {
    console.log('服务器正在监听端口 8082');
});

// 接收消息
function uint8ArrayToString(arr: Uint8Array) {
    const utf8 = Array.from(arr).map(byte => String.fromCharCode(byte as number)).join('');
    return decodeURIComponent(escape(utf8));
}

// 将字符串转换为 Uint8Array
function stringToUint8Array(str: string) {
    const utf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        arr[i] = utf8.charCodeAt(i);
    }
    return arr;
}

// 读取流数据
const readAll = async (input: InputStream): Promise<any> => {
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