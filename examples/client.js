var frida = require('frida');

frida.attach('cat')
.then(function (session) {
  console.log('attached:', session);
  return session.createScript(
      'function onMessage(message) {' +
        'send({ name: "pong", payload: message });' +
        'recv(onMessage);' +
      '}' +
      'recv(onMessage);'
  );
})
.then(function (script) {
  console.log('script created:', script);
  script.events.listen('message', function (message, data) {
    console.log('message from script:', message, data);
  });
  script.load()
  .then(function () {
    console.log('script loaded');
    setInterval(function () {
      script.postMessage({ name: 'ping' });
    }, 1000);
  });
})
.catch(function (error) {
  console.log('error:', error.message);
});