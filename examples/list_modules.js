// Process.enumerateModules({
//   onMatch: function (module) {
//     console.log(
//       "Module: " + module.name + ", Base Address: " + module.base.toString()
//     );
//   },
//   onComplete: function () {
//     console.log("Module enumeration complete.");
//   },
// });

const moduleBaseAddress = Module.getBaseAddress("WeChatWin.dll");
const moduleLoad = Module.load("WeChatWin.dll");
// console.log(moduleBaseAddress);

const hookAddr = moduleBaseAddress.add(0x23d6f50);

// const uint64_t kSyncMsg = 0xc39680;
// const uint64_t kSyncMsgNext = 0xc39680;

Interceptor.replace(
  hookAddr,
  new NativeCallback(
    (param1, param2, param3) => {
        console.log("targetFunction called");
        console.log("Argument 0: " + param1); // 根据实际情况调整参数类型
        console.log("Argument 1: " + param2);
        console.log("Argument 2: " + param3);
 
        // fromUser: readSkBuiltInString(Memory.readPointer(param2.add(0x18))),
        const fromUser = readSkBuiltInString(Memory.readPointer(param2.add(0x18)));
        console.log("fromUser: ", fromUser)
        // toUser: readSkBuiltInString(Memory.readPointer(param2.add(0x28))),
        const toUser = readSkBuiltInString(Memory.readPointer(param2.add(0x28)));
        console.log("toUser: ", toUser)
        // content: readSkBuiltInString(Memory.readPointer(param2.add(0x30))),
        const content = readSkBuiltInString(Memory.readPointer(param2.add(0x30)));
        console.log("content: ", content)
        // type: Memory.readU32(param2.add(0x24)),
        const type = Memory.readU32(param2.add(0x24));
        console.log("type: ", type)
    },
    "void",
    ["int64", "pointer", "int64"]
  )
);
