import { log } from "./logger.js";

// Frida.version
log('Frida.version:'+Frida.version);

// Frida.heapSize
log('Frida.heapSize:'+Frida.heapSize);

// Script.runtime
log('Script.runtime:'+Script.runtime);

// Script.pin()
// Script.unpin()

// Process.id
log('Process.id:'+Process.id);

// Process.arch
log('Process.arch:'+Process.arch);

// Process.platform
log('Process.platform:'+Process.platform);

// Process.pageSize
log('Process.pageSize:'+Process.pageSize);

// Process.pointerSize
log('Process.pointerSize:'+Process.pointerSize);

// Process.codeSigningPolicy
log('Process.codeSigningPolicy:'+Process.codeSigningPolicy);

// Process.mainModule
log('Process.mainModule:'+Process.mainModule);

// Process.getCurrentDir()
log('Process.getCurrentDir():'+Process.getCurrentDir());

// Process.getTmpDir()
log('Process.getTmpDir():'+Process.getTmpDir());

// 获取当前程序被注入程序的版本号
// log('Process.getModuleByName("WeChat.exe"):'+JSON.stringify(Process.getModuleByName("WeChat.exe"), null, 2));

var moduleBaseAddress = Module.getBaseAddress('WeChatWin.dll');
var moduleLoad = Module.load('WeChatWin.dll');
log('Module.getBaseAddress("WeChatWin.dll"):'+moduleBaseAddress);
log('Module.load("WeChatWin.dll"):'+JSON.stringify(moduleLoad, null, 2));

// 获取微信版本号
var getWechatVersionFunction = function () {
    var pattern = '55 8B ?? 83 ?? ?? A1 ?? ?? ?? ?? 83 ?? ?? 85 ?? 7F ?? 8D ?? ?? E8 ?? ?? ?? ?? 84 ?? 74 ?? 8B ?? ?? ?? 85 ?? 75 ?? E8 ?? ?? ?? ?? 0F ?? ?? 0D ?? ?? ?? ?? A3 ?? ?? ?? ?? A3 ?? ?? ?? ?? 8B ?? 5D C3';
    var results = Memory.scanSync(moduleLoad.base, moduleLoad.size, pattern);
    if (results.length === 0) {
        return 0;
    }
    var addr = results[0].address;
    var ret = addr.add(0x07).readPointer();
    var ver = ret.add(0x0).readU32();
    return ver;
};

log('WeChat Version:'+getWechatVersionFunction());

const header = Memory.alloc(16);
header
    .writeU32(0xdeadbeef).add(4)
    .writeU32(0xd00ff00d).add(4)
    .writeU64(uint64("0x1122334455667788"));
log(hexdump(header.readByteArray(16) as ArrayBuffer, { ansi: true }));

Process.getModuleByName("libSystem.B.dylib")
    .enumerateExports()
    .slice(0, 16)
    .forEach((exp, index) => {
        log(`export ${index}: ${exp.name}`);
    });

Interceptor.attach(Module.getExportByName(null, "open"), {
    onEnter(args) {
        const path = args[0].readUtf8String();
        log(`open() path="${path}"`);
    }
});
