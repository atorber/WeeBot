const frida = require("frida");
const fs = require("fs");

const agentSource = fs.readFileSync('../agent/xp-3.9.10.19-lite.js', 'utf8');

// console.log(agentSource);

async function main() {
  const session = await frida.attach('WeChat.exe');

  const script = await session.createScript(agentSource);
  script.message.connect(message => {
    console.log('[*] Message:', message);
  });
  await script.load();
  console.log('[*] Script loaded');

  const api = script.exports;
  await api.callFunction('filehelper', 'Hello, world!');
  console.log('[*] Function called three times');

//   await script.unload();
//   console.log('[*] Script unloaded');
}

main()
  .catch(e => {
    console.error('报错了：', e);
  });

