function onMessage(message) {
    if(message.type == "task"){
        // do something with message.payload
        // you can return response with send({"type": "response", "payoad":"some data"})
        send({"type": "response", "payload": message.payload});
    }
    // listen for other message non-blocking, 
    recv(onMessage);
}
// message can be send by script.post_message in control script
recv(onMessage);