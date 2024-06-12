const WebSocket = require('ws');

// 创建一个新的 WebSocket 连接
const ws = new WebSocket('ws://127.0.0.1:8082');

// 连接建立时的回调函数
ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // 发送一条消息到服务器
  ws.send('Hello, WebSocket server!');
});

// 接收到消息时的回调函数
ws.on('message', (message) => {
  console.log(`Received: ${message}`);
});

// 连接关闭时的回调函数
ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

// 连接错误时的回调函数
ws.on('error', (error) => {
  console.error(`WebSocket error: ${error}`);
});