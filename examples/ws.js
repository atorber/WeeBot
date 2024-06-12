const WebSocket = require("ws");
// 连接到本机服务器8082端口
const ws = new WebSocket("ws://localhost:8081");
// 发送消息及接收响应
ws.on("open", () => {
  console.log("Connected");
  // 每3秒发送一条消息到服务器
  setInterval(() => {
    ws.send("Hello, Server!");
    console.log('发送消息: "Hello, Server!"');
  }, 3000);
});

ws.on("message", (data) => {
  console.log("Received:", data);
});

ws.on("close", () => {
  console.log("Connection closed");
});

ws.on("error", (error) => {
  console.error("Error:", error);
});
