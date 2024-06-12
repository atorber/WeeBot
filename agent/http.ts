import http from 'http';

const callTest = () => {
    // 客户端示例
    const options = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/api/test',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const messageData = { msg: 'Hello, World! I am lych，你好啊啊啊' };
    const message = JSON.stringify(messageData);
    options.headers['Content-Length'] = stringToUint8Array(message).byteLength;

    console.log('开始请求...');

    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => {
            console.log('HTTP 客户端接收到消息:', chunk.toString());
            data += chunk;
        });
        res.on('end', () => {
            console.log('HTTP 客户端接收到消息:', data);
        });
    });

    req.on('error', error => {
        console.error('Failed to send request:', error);
    });

    // 发送请求体
    req.write(message);
    req.end();
};

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

// 创建HTTP服务器
// const server = http.createServer((req, res) => {
//     console.log('HTTP 服务器已连接');   
//     if (req.method === 'POST') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             console.log('HTTP 服务器接收消息:', body);
//             const message = JSON.stringify(JSON.parse(body));

//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(message);
//         });
//     } else {
//         res.writeHead(405, { 'Content-Type': 'text/plain' });
//         res.end('Method Not Allowed');
//     }
// });

// server.listen(8081, '127.0.0.1', () => {
//     console.log('HTTP 服务器正在监听 127.0.0.1:8081');

//     callTest();
// });

if (true) {
    // Socket.listen({
    //     family: 'ipv4',
    //     port: 8082,
    // }).then((server) => {
    //     console.log('Frida IPC 服务器正在监听 127.0.0.1:8082');
    //     console.log('Frida IPC 服务器正在等待连接', JSON.stringify(server));
    //     server.accept().then(async (client) => {
    //         console.log('Frida IPC 服务器接收到连接');

    //         readAll(client.input).then((data) => {
    //             console.log('Frida IPC 服务器接收消息2:', data);
    //             // 发送消息
    //             const message = JSON.stringify(JSON.parse(data));
    //             console.log('Frida IPC 服务器发送消息3:', message);
    //             const dataRes = stringToUint8Array(message);
    //             // console.log('Frida IPC 服务器发送消息3:', dataRes);

    //             client.output.write(dataRes as any);

    //         }).catch((reason) => {
    //             console.error('Failed to read:', reason);
    //         });

    //     }).catch((reason) => {
    //         console.error('Failed to accept:', reason)
    //     });
    // }).catch((reason) => {
    //     console.error('Failed to listen:', reason);
    // });

    // 客户端
    Socket.connect({
        family: 'ipv4',
        host: '127.0.0.1',
        port: 8081,
    }).then((client) => {

        console.log('Frida IPC 客户端连接成功');

        // 发送消息
        const messageData = { msg: 'Hello, Word! I am lych，你好啊啊啊' };
        const message = JSON.stringify(messageData);
        const data = stringToUint8Array(message);

        console.log('Frida IPC 客户端发送消息1:', message);
        // console.log('Frida IPC 客户端发送消息1:', data);
        client.output.write(data as any);

        // 接收响应
        readAll(client.input).then((data) => {
            console.log('Frida IPC 客户端接收到消息4:', data);
            client.close();
        }).catch((reason) => {
            console.error('Failed to read:', reason);
        });

    }).catch((reason) => {
        console.error('Failed to connect:', reason);
    });
}
