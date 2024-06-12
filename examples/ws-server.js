const WebSocket = require("ws");
// 8081端口启动服务
const wss = new WebSocket.Server({ port: 8081 });
// 服务器监听客户端连接

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("open", () => {
    console.log("Connected");
  });

  ws.on('connect', () => {
    console.log('connect');
  });

  // 监听客户端消息
  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send("You said: " + message);
  });

  // 监听客户端关闭
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // 监听客户端错误
  ws.on("error", (error) => {
    console.error("Error:", error);
  });
});
