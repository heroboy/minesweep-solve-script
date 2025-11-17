// ==UserScript==
// @name       minesweep-solve-script
// @namespace  npm/vite-plugin-monkey
// @version    0.0.0
// @icon       https://vitejs.dev/logo.svg
// @match      https://mop.com/*
// @match      https://www.253874.net/next/mine/indexdb.php
// @resource   minisat_static.wasm  https://github.com/arfelious/logic-solver-plus/raw/refs/heads/main/mjs/minisat_static.wasm
// @grant      GM_getResourceURL
// ==/UserScript==

(function () {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  const scriptRel = (function detectScriptRel() {
    const relList = typeof document !== "undefined" && document.createElement("link").relList;
    return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  })();
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (deps && deps.length > 0) {
      let allSettled = function(promises$2) {
        return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
          status: "fulfilled",
          value: value$1
        }), (reason) => ({
          status: "rejected",
          reason
        }))));
      };
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
      const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
      promise = allSettled(deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) link.as = "script";
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) link.setAttribute("nonce", cspNonce);
        document.head.appendChild(link);
        if (isCss) return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej( new Error(`Unable to preload CSS for ${dep}`)));
        });
      }));
    }
    function handlePreloadError(err$2) {
      const e$1 = new Event("vite:preloadError", { cancelable: true });
      e$1.payload = err$2;
      window.dispatchEvent(e$1);
      if (!e$1.defaultPrevented) throw err$2;
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  var MINISAT = (() => {
    var _scriptName = (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href);
    return (async function(moduleArg = {}) {
      var moduleRtn;
      var Module = moduleArg;
      var readyPromiseResolve, readyPromiseReject;
      var readyPromise = new Promise((resolve, reject) => {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      ["cwrap", "_memory", "_createTheSolver", "_ensureVar", "_addClause", "_solve", "_getSolution", "_getNumVars", "_solveAssuming", "_retireVar", "___indirect_function_table", "_solve_string", "_main", "onRuntimeInitialized"].forEach((prop) => {
        if (!Object.getOwnPropertyDescriptor(readyPromise, prop)) {
          Object.defineProperty(readyPromise, prop, {
            get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
            set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
          });
        }
      });
      var ENVIRONMENT_IS_WEB = typeof window == "object";
      var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";
      var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
      var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
      if (ENVIRONMENT_IS_NODE) {
        const { createRequire } = await __vitePreload(async () => {
          const { createRequire: createRequire2 } = await Promise.resolve().then(() => __viteBrowserExternal);
          return { createRequire: createRequire2 };
        }, void 0 );
        let dirname = (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href);
        if (dirname.startsWith("data:")) {
          dirname = "/";
        }
        var require2 = createRequire(dirname);
      }
      var moduleOverrides = Object.assign({}, Module);
      var arguments_ = [];
      var thisProgram = "./this.program";
      var quit_ = (status, toThrow) => {
        throw toThrow;
      };
      var scriptDirectory = "";
      function locateFile(path) {
        if (Module["locateFile"]) {
          return Module["locateFile"](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }
      var readAsync, readBinary;
      if (ENVIRONMENT_IS_NODE) {
        if (typeof process == "undefined" || !process.release || process.release.name !== "node") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
        var nodeVersion = process.versions.node;
        var numericVersion = nodeVersion.split(".").slice(0, 3);
        numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
        if (numericVersion < 16e4) {
          throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
        }
        var fs = require2("fs");
        var nodePath = require2("path");
        if (!(_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href).startsWith("data:")) {
          scriptDirectory = nodePath.dirname(require2("url").fileURLToPath((_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href))) + "/";
        }
        readBinary = (filename) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
          var ret = fs.readFileSync(filename);
          assert(ret.buffer);
          return ret;
        };
        readAsync = (filename, binary = true) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
          return new Promise((resolve, reject) => {
            fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
              if (err2) reject(err2);
              else resolve(binary ? data.buffer : data);
            });
          });
        };
        if (!Module["thisProgram"] && process.argv.length > 1) {
          thisProgram = process.argv[1].replace(/\\/g, "/");
        }
        arguments_ = process.argv.slice(2);
        quit_ = (status, toThrow) => {
          process.exitCode = status;
          throw toThrow;
        };
      } else if (ENVIRONMENT_IS_SHELL) {
        if (typeof process == "object" && typeof require2 === "function" || typeof window == "object" || typeof WorkerGlobalScope != "undefined") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href;
        } else if (typeof document != "undefined" && document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }
        if (_scriptName) {
          scriptDirectory = _scriptName;
        }
        if (scriptDirectory.startsWith("blob:")) {
          scriptDirectory = "";
        } else {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
        }
        if (!(typeof window == "object" || typeof WorkerGlobalScope != "undefined")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
        {
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(
xhr.response
              );
            };
          }
          readAsync = (url) => {
            if (isFileURI(url)) {
              return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = () => {
                  if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                    resolve(xhr.response);
                    return;
                  }
                  reject(xhr.status);
                };
                xhr.onerror = reject;
                xhr.send(null);
              });
            }
            return fetch(url, { credentials: "same-origin" }).then((response) => {
              if (response.ok) {
                return response.arrayBuffer();
              }
              return Promise.reject(new Error(response.status + " : " + response.url));
            });
          };
        }
      } else {
        throw new Error("environment detection error");
      }
      var out = Module["print"] || console.log.bind(console);
      var err = Module["printErr"] || console.error.bind(console);
      Object.assign(Module, moduleOverrides);
      moduleOverrides = null;
      checkIncomingModuleAPI();
      if (Module["arguments"]) arguments_ = Module["arguments"];
      legacyModuleProp("arguments", "arguments_");
      if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
      legacyModuleProp("thisProgram", "thisProgram");
      assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
      assert(typeof Module["read"] == "undefined", "Module.read option was removed");
      assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
      assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
      assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
      assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
      legacyModuleProp("asm", "wasmExports");
      legacyModuleProp("readAsync", "readAsync");
      legacyModuleProp("readBinary", "readBinary");
      legacyModuleProp("setWindowTitle", "setWindowTitle");
      assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
      var wasmBinary = Module["wasmBinary"];
      legacyModuleProp("wasmBinary", "wasmBinary");
      if (typeof WebAssembly != "object") {
        err("no native wasm support detected");
      }
      var wasmMemory;
      var ABORT = false;
      var EXITSTATUS;
      function assert(condition, text) {
        if (!condition) {
          abort("Assertion failed" + (text ? ": " + text : ""));
        }
      }
      var HEAP8, HEAPU8, HEAP16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
      function updateMemoryViews() {
        var b = wasmMemory.buffer;
        Module["HEAP8"] = HEAP8 = new Int8Array(b);
        Module["HEAP16"] = HEAP16 = new Int16Array(b);
        Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
        Module["HEAPU16"] = new Uint16Array(b);
        Module["HEAP32"] = HEAP32 = new Int32Array(b);
        Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
        Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
        Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
      }
      assert(!Module["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
      assert(
        typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0,
        "JS engine does not provide full typed array support"
      );
      assert(!Module["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
      assert(!Module["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
      function writeStackCookie() {
        var max = _emscripten_stack_get_end();
        assert((max & 3) == 0);
        if (max == 0) {
          max += 4;
        }
        HEAPU32[max >> 2] = 34821223;
        HEAPU32[max + 4 >> 2] = 2310721022;
        HEAPU32[0 >> 2] = 1668509029;
      }
      function checkStackCookie() {
        if (ABORT) return;
        var max = _emscripten_stack_get_end();
        if (max == 0) {
          max += 4;
        }
        var cookie1 = HEAPU32[max >> 2];
        var cookie2 = HEAPU32[max + 4 >> 2];
        if (cookie1 != 34821223 || cookie2 != 2310721022) {
          abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
        }
        if (HEAPU32[0 >> 2] != 1668509029) {
          abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
        }
      }
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATMAIN__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      function preRun() {
        if (Module["preRun"]) {
          if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
          while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function initRuntime() {
        assert(!runtimeInitialized);
        runtimeInitialized = true;
        checkStackCookie();
        if (!Module["noFSInit"] && !FS.initialized)
          FS.init();
        FS.ignorePermissions = false;
        callRuntimeCallbacks(__ATINIT__);
      }
      function preMain() {
        checkStackCookie();
        callRuntimeCallbacks(__ATMAIN__);
      }
      function postRun() {
        checkStackCookie();
        if (Module["postRun"]) {
          if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
          while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }
      function addOnInit(cb) {
        __ATINIT__.unshift(cb);
      }
      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }
      assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;
      var runDependencyTracking = {};
      function getUniqueRunDependency(id) {
        var orig = id;
        while (1) {
          if (!runDependencyTracking[id]) return id;
          id = orig + Math.random();
        }
      }
      function addRunDependency(id) {
        runDependencies++;
        Module["monitorRunDependencies"]?.(runDependencies);
        if (id) {
          assert(!runDependencyTracking[id]);
          runDependencyTracking[id] = 1;
          if (runDependencyWatcher === null && typeof setInterval != "undefined") {
            runDependencyWatcher = setInterval(() => {
              if (ABORT) {
                clearInterval(runDependencyWatcher);
                runDependencyWatcher = null;
                return;
              }
              var shown = false;
              for (var dep in runDependencyTracking) {
                if (!shown) {
                  shown = true;
                  err("still waiting on run dependencies:");
                }
                err(`dependency: ${dep}`);
              }
              if (shown) {
                err("(end of list)");
              }
            }, 1e4);
          }
        } else {
          err("warning: run dependency added without ID");
        }
      }
      function removeRunDependency(id) {
        runDependencies--;
        Module["monitorRunDependencies"]?.(runDependencies);
        if (id) {
          assert(runDependencyTracking[id]);
          delete runDependencyTracking[id];
        } else {
          err("warning: run dependency removed without ID");
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      function abort(what) {
        Module["onAbort"]?.(what);
        what = "Aborted(" + what + ")";
        err(what);
        ABORT = true;
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }
      var dataURIPrefix = "data:application/octet-stream;base64,";
      var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
      var isFileURI = (filename) => filename.startsWith("file://");
      function createExportWrapper(name, nargs) {
        return (...args) => {
          assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
          var f = wasmExports[name];
          assert(f, `exported native function \`${name}\` not found`);
          assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
          return f(...args);
        };
      }
      function findWasmBinary() {
        if (Module["locateFile"]) {
          var f = "minisat_static.wasm";
          if (!isDataURI(f)) {
            return locateFile(f);
          }
          return f;
        }
        return new URL(GM_getResourceURL("minisat_static.wasm").replace("application", "application/wasm")).href;
      }
      var wasmBinaryFile;
      function getBinarySync(file) {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        }
        throw "both async and sync fetching of the wasm failed";
      }
      function getBinaryPromise(binaryFile) {
        if (!wasmBinary) {
          return readAsync(binaryFile).then(
            (response) => new Uint8Array(
response
            ),
() => getBinarySync(binaryFile)
          );
        }
        return Promise.resolve().then(() => getBinarySync(binaryFile));
      }
      function instantiateArrayBuffer(binaryFile, imports, receiver) {
        return getBinaryPromise(binaryFile).then((binary) => {
          return WebAssembly.instantiate(binary, imports);
        }).then(receiver, (reason) => {
          err(`failed to asynchronously prepare wasm: ${reason}`);
          if (isFileURI(wasmBinaryFile)) {
            err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
          }
          abort(reason);
        });
      }
      function instantiateAsync(binary, binaryFile, imports, callback) {
        if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) &&
!isFileURI(binaryFile) &&





!ENVIRONMENT_IS_NODE && typeof fetch == "function") {
          return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
            var result = WebAssembly.instantiateStreaming(response, imports);
            return result.then(
              callback,
              function(reason) {
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              }
            );
          });
        }
        return instantiateArrayBuffer(binaryFile, imports, callback);
      }
      function getWasmImports() {
        return {
          "env": wasmImports,
          "wasi_snapshot_preview1": wasmImports
        };
      }
      function createWasm() {
        function receiveInstance(instance, module) {
          wasmExports = instance.exports;
          wasmMemory = wasmExports["memory"];
          assert(wasmMemory, "memory not found in wasm exports");
          updateMemoryViews();
          addOnInit(wasmExports["__wasm_call_ctors"]);
          removeRunDependency("wasm-instantiate");
          return wasmExports;
        }
        addRunDependency("wasm-instantiate");
        var trueModule = Module;
        function receiveInstantiationResult(result) {
          assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
          trueModule = null;
          receiveInstance(result["instance"]);
        }
        var info = getWasmImports();
        if (Module["instantiateWasm"]) {
          try {
            return Module["instantiateWasm"](info, receiveInstance);
          } catch (e) {
            err(`Module.instantiateWasm callback failed with error: ${e}`);
            readyPromiseReject(e);
          }
        }
        wasmBinaryFile ??= findWasmBinary();
        instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
        return {};
      }
      var tempDouble;
      var tempI64;
      (() => {
        var h16 = new Int16Array(1);
        var h8 = new Int8Array(h16.buffer);
        h16[0] = 25459;
        if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
      })();
      if (Module["ENVIRONMENT"]) {
        throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
      }
      function legacyModuleProp(prop, newName, incoming = true) {
        if (!Object.getOwnPropertyDescriptor(Module, prop)) {
          Object.defineProperty(Module, prop, {
            configurable: true,
            get() {
              let extra = incoming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
              abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
            }
          });
        }
      }
      function ignoredModuleProp(prop) {
        if (Object.getOwnPropertyDescriptor(Module, prop)) {
          abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
        }
      }
      function isExportedByForceFilesystem(name) {
        return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" ||
name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
      }
      function hookGlobalSymbolAccess(sym, func) {
        if (typeof globalThis != "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
          Object.defineProperty(globalThis, sym, {
            configurable: true,
            get() {
              func();
              return void 0;
            }
          });
        }
      }
      function missingGlobal(sym, msg) {
        hookGlobalSymbolAccess(sym, () => {
          warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
        });
      }
      missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
      missingGlobal("asm", "Please use wasmExports instead");
      function missingLibrarySymbol(sym) {
        hookGlobalSymbolAccess(sym, () => {
          var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
          var librarySymbol = sym;
          if (!librarySymbol.startsWith("_")) {
            librarySymbol = "$" + sym;
          }
          msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
          if (isExportedByForceFilesystem(sym)) {
            msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
          }
          warnOnce(msg);
        });
        unexportedRuntimeSymbol(sym);
      }
      function unexportedRuntimeSymbol(sym) {
        if (!Object.getOwnPropertyDescriptor(Module, sym)) {
          Object.defineProperty(Module, sym, {
            configurable: true,
            get() {
              var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
              if (isExportedByForceFilesystem(sym)) {
                msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
              }
              abort(msg);
            }
          });
        }
      }
      class ExitStatus {
        name = "ExitStatus";
        constructor(status) {
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
      }
      var callRuntimeCallbacks = (callbacks) => {
        while (callbacks.length > 0) {
          callbacks.shift()(Module);
        }
      };
      function getValue(ptr, type = "i8") {
        if (type.endsWith("*")) type = "*";
        switch (type) {
          case "i1":
            return HEAP8[ptr];
          case "i8":
            return HEAP8[ptr];
          case "i16":
            return HEAP16[ptr >> 1];
          case "i32":
            return HEAP32[ptr >> 2];
          case "i64":
            abort("to do getValue(i64) use WASM_BIGINT");
          case "float":
            return HEAPF32[ptr >> 2];
          case "double":
            return HEAPF64[ptr >> 3];
          case "*":
            return HEAPU32[ptr >> 2];
          default:
            abort(`invalid type for getValue: ${type}`);
        }
      }
      Module["noExitRuntime"] || true;
      var ptrToString = (ptr) => {
        assert(typeof ptr === "number");
        ptr >>>= 0;
        return "0x" + ptr.toString(16).padStart(8, "0");
      };
      function setValue(ptr, value, type = "i8") {
        if (type.endsWith("*")) type = "*";
        switch (type) {
          case "i1":
            HEAP8[ptr] = value;
            break;
          case "i8":
            HEAP8[ptr] = value;
            break;
          case "i16":
            HEAP16[ptr >> 1] = value;
            break;
          case "i32":
            HEAP32[ptr >> 2] = value;
            break;
          case "i64":
            abort("to do setValue(i64) use WASM_BIGINT");
          case "float":
            HEAPF32[ptr >> 2] = value;
            break;
          case "double":
            HEAPF64[ptr >> 3] = value;
            break;
          case "*":
            HEAPU32[ptr >> 2] = value;
            break;
          default:
            abort(`invalid type for setValue: ${type}`);
        }
      }
      var stackRestore = (val) => __emscripten_stack_restore(val);
      var stackSave = () => _emscripten_stack_get_current();
      var warnOnce = (text) => {
        warnOnce.shown ||= {};
        if (!warnOnce.shown[text]) {
          warnOnce.shown[text] = 1;
          if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
          err(text);
        }
      };
      var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : void 0;
      var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        }
        var str = "";
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
        return str;
      };
      var UTF8ToString = (ptr, maxBytesToRead) => {
        assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
      };
      var ___assert_fail = (condition, filename, line, func) => {
        abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
      };
      class ExceptionInfo {
constructor(excPtr) {
          this.excPtr = excPtr;
          this.ptr = excPtr - 24;
        }
        set_type(type) {
          HEAPU32[this.ptr + 4 >> 2] = type;
        }
        get_type() {
          return HEAPU32[this.ptr + 4 >> 2];
        }
        set_destructor(destructor) {
          HEAPU32[this.ptr + 8 >> 2] = destructor;
        }
        get_destructor() {
          return HEAPU32[this.ptr + 8 >> 2];
        }
        set_caught(caught) {
          caught = caught ? 1 : 0;
          HEAP8[this.ptr + 12] = caught;
        }
        get_caught() {
          return HEAP8[this.ptr + 12] != 0;
        }
        set_rethrown(rethrown) {
          rethrown = rethrown ? 1 : 0;
          HEAP8[this.ptr + 13] = rethrown;
        }
        get_rethrown() {
          return HEAP8[this.ptr + 13] != 0;
        }
init(type, destructor) {
          this.set_adjusted_ptr(0);
          this.set_type(type);
          this.set_destructor(destructor);
        }
        set_adjusted_ptr(adjustedPtr) {
          HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
        }
        get_adjusted_ptr() {
          return HEAPU32[this.ptr + 16 >> 2];
        }
      }
      var ___cxa_throw = (ptr, type, destructor) => {
        var info = new ExceptionInfo(ptr);
        info.init(type, destructor);
        assert(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
      };
      var syscallGetVarargI = () => {
        assert(SYSCALLS.varargs != void 0);
        var ret = HEAP32[+SYSCALLS.varargs >> 2];
        SYSCALLS.varargs += 4;
        return ret;
      };
      var syscallGetVarargP = syscallGetVarargI;
      var PATH = {
        isAbs: (path) => path.charAt(0) === "/",
        splitPath: (filename) => {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        },
        normalizeArray: (parts, allowAboveRoot) => {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1);
            } else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..");
            }
          }
          return parts;
        },
        normalize: (path) => {
          var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = ".";
          }
          if (path && trailingSlash) {
            path += "/";
          }
          return (isAbsolute ? "/" : "") + path;
        },
        dirname: (path) => {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) {
            return ".";
          }
          if (dir) {
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        },
        basename: (path) => {
          if (path === "/") return "/";
          path = PATH.normalize(path);
          path = path.replace(/\/$/, "");
          var lastSlash = path.lastIndexOf("/");
          if (lastSlash === -1) return path;
          return path.substr(lastSlash + 1);
        },
        join: (...paths) => PATH.normalize(paths.join("/")),
        join2: (l, r) => PATH.normalize(l + "/" + r)
      };
      var initRandomFill = () => {
        if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
          return (view) => crypto.getRandomValues(view);
        } else if (ENVIRONMENT_IS_NODE) {
          try {
            var crypto_module = require2("crypto");
            var randomFillSync = crypto_module["randomFillSync"];
            if (randomFillSync) {
              return (view) => crypto_module["randomFillSync"](view);
            }
            var randomBytes = crypto_module["randomBytes"];
            return (view) => (view.set(randomBytes(view.byteLength)),
view);
          } catch (e) {
          }
        }
        abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
      };
      var randomFill = (view) => {
        return (randomFill = initRandomFill())(view);
      };
      var PATH_FS = {
        resolve: (...args) => {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? args[i] : FS.cwd();
            if (typeof path != "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!path) {
              return "";
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = PATH.isAbs(path);
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        },
        relative: (from, to) => {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "") break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "") break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..");
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        }
      };
      var FS_stdin_getChar_buffer = [];
      var lengthBytesUTF8 = (str) => {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var c = str.charCodeAt(i);
          if (c <= 127) {
            len++;
          } else if (c <= 2047) {
            len += 2;
          } else if (c >= 55296 && c <= 57343) {
            len += 4;
            ++i;
          } else {
            len += 3;
          }
        }
        return len;
      };
      var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
        assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
        if (!(maxBytesToWrite > 0))
          return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023;
          }
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          } else {
            if (outIdx + 3 >= endIdx) break;
            if (u > 1114111) warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx;
      };
      function intArrayFromString(stringy, dontAddNull, length) {
        var len = lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        u8array.length = numBytesWritten;
        return u8array;
      }
      var FS_stdin_getChar = () => {
        if (!FS_stdin_getChar_buffer.length) {
          var result = null;
          if (ENVIRONMENT_IS_NODE) {
            var BUFSIZE = 256;
            var buf = Buffer.alloc(BUFSIZE);
            var bytesRead = 0;
            var fd = process.stdin.fd;
            try {
              bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
            } catch (e) {
              if (e.toString().includes("EOF")) bytesRead = 0;
              else throw e;
            }
            if (bytesRead > 0) {
              result = buf.slice(0, bytesRead).toString("utf-8");
            }
          } else if (typeof window != "undefined" && typeof window.prompt == "function") {
            result = window.prompt("Input: ");
            if (result !== null) {
              result += "\n";
            }
          } else
            ;
          if (!result) {
            return null;
          }
          FS_stdin_getChar_buffer = intArrayFromString(result);
        }
        return FS_stdin_getChar_buffer.shift();
      };
      var TTY = {
        ttys: [],
        init() {
        },
        shutdown() {
        },
        register(dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops };
          FS.registerDevice(dev, TTY.stream_ops);
        },
        stream_ops: {
          open(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
              throw new FS.ErrnoError(43);
            }
            stream.tty = tty;
            stream.seekable = false;
          },
          close(stream) {
            stream.tty.ops.fsync(stream.tty);
          },
          fsync(stream) {
            stream.tty.ops.fsync(stream.tty);
          },
          read(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
              throw new FS.ErrnoError(60);
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = stream.tty.ops.get_char(stream.tty);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === void 0 && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === void 0) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
              throw new FS.ErrnoError(60);
            }
            try {
              for (var i = 0; i < length; i++) {
                stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
              }
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        },
        default_tty_ops: {
          get_char(tty) {
            return FS_stdin_getChar();
          },
          put_char(tty, val) {
            if (val === null || val === 10) {
              out(UTF8ArrayToString(tty.output));
              tty.output = [];
            } else {
              if (val != 0) tty.output.push(val);
            }
          },
          fsync(tty) {
            if (tty.output && tty.output.length > 0) {
              out(UTF8ArrayToString(tty.output));
              tty.output = [];
            }
          },
          ioctl_tcgets(tty) {
            return {
              c_iflag: 25856,
              c_oflag: 5,
              c_cflag: 191,
              c_lflag: 35387,
              c_cc: [
                3,
                28,
                127,
                21,
                4,
                0,
                1,
                0,
                17,
                19,
                26,
                0,
                18,
                15,
                23,
                22,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ]
            };
          },
          ioctl_tcsets(tty, optional_actions, data) {
            return 0;
          },
          ioctl_tiocgwinsz(tty) {
            return [24, 80];
          }
        },
        default_tty1_ops: {
          put_char(tty, val) {
            if (val === null || val === 10) {
              err(UTF8ArrayToString(tty.output));
              tty.output = [];
            } else {
              if (val != 0) tty.output.push(val);
            }
          },
          fsync(tty) {
            if (tty.output && tty.output.length > 0) {
              err(UTF8ArrayToString(tty.output));
              tty.output = [];
            }
          }
        }
      };
      var alignMemory = (size, alignment) => {
        assert(alignment, "alignment argument is required");
        return Math.ceil(size / alignment) * alignment;
      };
      var mmapAlloc = (size) => {
        abort("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
      };
      var MEMFS = {
        ops_table: null,
        mount(mount) {
          return MEMFS.createNode(null, "/", 16384 | 511, 0);
        },
        createNode(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63);
          }
          MEMFS.ops_table ||= {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null;
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.timestamp = Date.now();
          if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp;
          }
          return node;
        },
        getFileDataAsTypedArray(node) {
          if (!node.contents) return new Uint8Array(0);
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
          return new Uint8Array(node.contents);
        },
        expandFileStorage(node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return;
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity);
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
        },
        resizeFileStorage(node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
          } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
            }
            node.usedBytes = newSize;
          }
        },
        node_ops: {
          getattr(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
              attr.size = 4096;
            } else if (FS.isFile(node.mode)) {
              attr.size = node.usedBytes;
            } else if (FS.isLink(node.mode)) {
              attr.size = node.link.length;
            } else {
              attr.size = 0;
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr;
          },
          setattr(node, attr) {
            if (attr.mode !== void 0) {
              node.mode = attr.mode;
            }
            if (attr.timestamp !== void 0) {
              node.timestamp = attr.timestamp;
            }
            if (attr.size !== void 0) {
              MEMFS.resizeFileStorage(node, attr.size);
            }
          },
          lookup(parent, name) {
            throw new FS.ErrnoError(44);
          },
          mknod(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev);
          },
          rename(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name);
              } catch (e) {
              }
              if (new_node) {
                for (var i in new_node.contents) {
                  throw new FS.ErrnoError(55);
                }
              }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now();
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
          },
          unlink(parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now();
          },
          rmdir(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
              throw new FS.ErrnoError(55);
            }
            delete parent.contents[name];
            parent.timestamp = Date.now();
          },
          readdir(node) {
            var entries = [".", ".."];
            for (var key of Object.keys(node.contents)) {
              entries.push(key);
            }
            return entries;
          },
          symlink(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node;
          },
          readlink(node) {
            if (!FS.isLink(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            return node.link;
          }
        },
        stream_ops: {
          read(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) {
              buffer.set(contents.subarray(position, position + size), offset);
            } else {
              for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
            }
            return size;
          },
          write(stream, buffer, offset, length, position, canOwn) {
            assert(!(buffer instanceof ArrayBuffer));
            if (buffer.buffer === HEAP8.buffer) {
              canOwn = false;
            }
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
              if (canOwn) {
                assert(position === 0, "canOwn must imply no weird position inside the file");
                node.contents = buffer.subarray(offset, offset + length);
                node.usedBytes = length;
                return length;
              } else if (node.usedBytes === 0 && position === 0) {
                node.contents = buffer.slice(offset, offset + length);
                node.usedBytes = length;
                return length;
              } else if (position + length <= node.usedBytes) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
                return length;
              }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
              node.contents.set(buffer.subarray(offset, offset + length), position);
            } else {
              for (var i = 0; i < length; i++) {
                node.contents[position + i] = buffer[offset + i];
              }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length;
          },
          llseek(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
              position += stream.position;
            } else if (whence === 2) {
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.usedBytes;
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(28);
            }
            return position;
          },
          allocate(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
          },
          mmap(stream, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
              allocated = false;
              ptr = contents.byteOffset;
            } else {
              allocated = true;
              ptr = mmapAlloc();
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              if (contents) {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(contents, position, position + length);
                  }
                }
                HEAP8.set(contents, ptr);
              }
            }
            return { ptr, allocated };
          },
          msync(stream, buffer, offset, length, mmapFlags) {
            MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0;
          }
        }
      };
      var asyncLoad = (url, onload, onerror, noRunDep) => {
        var dep = getUniqueRunDependency(`al ${url}`);
        readAsync(url).then(
          (arrayBuffer) => {
            assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep);
          },
          (err2) => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          }
        );
        if (dep) addRunDependency(dep);
      };
      var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
        FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
      };
      var preloadPlugins = Module["preloadPlugins"] || [];
      var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
        if (typeof Browser != "undefined") Browser.init();
        var handled = false;
        preloadPlugins.forEach((plugin) => {
          if (handled) return;
          if (plugin["canHandle"](fullname)) {
            plugin["handle"](byteArray, fullname, finish, onerror);
            handled = true;
          }
        });
        return handled;
      };
      var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency(`cp ${fullname}`);
        function processData(byteArray) {
          function finish(byteArray2) {
            preFinish?.();
            if (!dontCreateFile) {
              FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
            }
            onload?.();
            removeRunDependency(dep);
          }
          if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
            onerror?.();
            removeRunDependency(dep);
          })) {
            return;
          }
          finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == "string") {
          asyncLoad(url, processData, onerror);
        } else {
          processData(url);
        }
      };
      var FS_modeStringToFlags = (str) => {
        var flagModes = {
          "r": 0,
          "r+": 2,
          "w": 512 | 64 | 1,
          "w+": 512 | 64 | 2,
          "a": 1024 | 64 | 1,
          "a+": 1024 | 64 | 2
        };
        var flags = flagModes[str];
        if (typeof flags == "undefined") {
          throw new Error(`Unknown file open mode: ${str}`);
        }
        return flags;
      };
      var FS_getMode = (canRead, canWrite) => {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      };
      var strError = (errno) => {
        return UTF8ToString(_strerror(errno));
      };
      var ERRNO_CODES = {
        "EPERM": 63,
        "ENOENT": 44,
        "ESRCH": 71,
        "EINTR": 27,
        "EIO": 29,
        "ENXIO": 60,
        "E2BIG": 1,
        "ENOEXEC": 45,
        "EBADF": 8,
        "ECHILD": 12,
        "EAGAIN": 6,
        "EWOULDBLOCK": 6,
        "ENOMEM": 48,
        "EACCES": 2,
        "EFAULT": 21,
        "ENOTBLK": 105,
        "EBUSY": 10,
        "EEXIST": 20,
        "EXDEV": 75,
        "ENODEV": 43,
        "ENOTDIR": 54,
        "EISDIR": 31,
        "EINVAL": 28,
        "ENFILE": 41,
        "EMFILE": 33,
        "ENOTTY": 59,
        "ETXTBSY": 74,
        "EFBIG": 22,
        "ENOSPC": 51,
        "ESPIPE": 70,
        "EROFS": 69,
        "EMLINK": 34,
        "EPIPE": 64,
        "EDOM": 18,
        "ERANGE": 68,
        "ENOMSG": 49,
        "EIDRM": 24,
        "ECHRNG": 106,
        "EL2NSYNC": 156,
        "EL3HLT": 107,
        "EL3RST": 108,
        "ELNRNG": 109,
        "EUNATCH": 110,
        "ENOCSI": 111,
        "EL2HLT": 112,
        "EDEADLK": 16,
        "ENOLCK": 46,
        "EBADE": 113,
        "EBADR": 114,
        "EXFULL": 115,
        "ENOANO": 104,
        "EBADRQC": 103,
        "EBADSLT": 102,
        "EDEADLOCK": 16,
        "EBFONT": 101,
        "ENOSTR": 100,
        "ENODATA": 116,
        "ETIME": 117,
        "ENOSR": 118,
        "ENONET": 119,
        "ENOPKG": 120,
        "EREMOTE": 121,
        "ENOLINK": 47,
        "EADV": 122,
        "ESRMNT": 123,
        "ECOMM": 124,
        "EPROTO": 65,
        "EMULTIHOP": 36,
        "EDOTDOT": 125,
        "EBADMSG": 9,
        "ENOTUNIQ": 126,
        "EBADFD": 127,
        "EREMCHG": 128,
        "ELIBACC": 129,
        "ELIBBAD": 130,
        "ELIBSCN": 131,
        "ELIBMAX": 132,
        "ELIBEXEC": 133,
        "ENOSYS": 52,
        "ENOTEMPTY": 55,
        "ENAMETOOLONG": 37,
        "ELOOP": 32,
        "EOPNOTSUPP": 138,
        "EPFNOSUPPORT": 139,
        "ECONNRESET": 15,
        "ENOBUFS": 42,
        "EAFNOSUPPORT": 5,
        "EPROTOTYPE": 67,
        "ENOTSOCK": 57,
        "ENOPROTOOPT": 50,
        "ESHUTDOWN": 140,
        "ECONNREFUSED": 14,
        "EADDRINUSE": 3,
        "ECONNABORTED": 13,
        "ENETUNREACH": 40,
        "ENETDOWN": 38,
        "ETIMEDOUT": 73,
        "EHOSTDOWN": 142,
        "EHOSTUNREACH": 23,
        "EINPROGRESS": 26,
        "EALREADY": 7,
        "EDESTADDRREQ": 17,
        "EMSGSIZE": 35,
        "EPROTONOSUPPORT": 66,
        "ESOCKTNOSUPPORT": 137,
        "EADDRNOTAVAIL": 4,
        "ENETRESET": 39,
        "EISCONN": 30,
        "ENOTCONN": 53,
        "ETOOMANYREFS": 141,
        "EUSERS": 136,
        "EDQUOT": 19,
        "ESTALE": 72,
        "ENOTSUP": 138,
        "ENOMEDIUM": 148,
        "EILSEQ": 25,
        "EOVERFLOW": 61,
        "ECANCELED": 11,
        "ENOTRECOVERABLE": 56,
        "EOWNERDEAD": 62,
        "ESTRPIPE": 135
      };
      var FS = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: false,
        ignorePermissions: true,
        ErrnoError: class extends Error {
          name = "ErrnoError";





constructor(errno) {
            super(runtimeInitialized ? strError(errno) : "");
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          }
        },
        filesystems: null,
        syncFSRequests: 0,
        readFiles: {},
        FSStream: class {
          shared = {};
          get object() {
            return this.node;
          }
          set object(val) {
            this.node = val;
          }
          get isRead() {
            return (this.flags & 2097155) !== 1;
          }
          get isWrite() {
            return (this.flags & 2097155) !== 0;
          }
          get isAppend() {
            return this.flags & 1024;
          }
          get flags() {
            return this.shared.flags;
          }
          set flags(val) {
            this.shared.flags = val;
          }
          get position() {
            return this.shared.position;
          }
          set position(val) {
            this.shared.position = val;
          }
        },
        FSNode: class {
          node_ops = {};
          stream_ops = {};
          readMode = 292 | 73;
          writeMode = 146;
          mounted = null;
          constructor(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.rdev = rdev;
          }
          get read() {
            return (this.mode & this.readMode) === this.readMode;
          }
          set read(val) {
            val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
          }
          get write() {
            return (this.mode & this.writeMode) === this.writeMode;
          }
          set write(val) {
            val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
          }
          get isFolder() {
            return FS.isDir(this.mode);
          }
          get isDevice() {
            return FS.isChrdev(this.mode);
          }
        },
        lookupPath(path, opts = {}) {
          path = PATH_FS.resolve(path);
          if (!path) return { path: "", node: null };
          var defaults = {
            follow_mount: true,
            recurse_count: 0
          };
          opts = Object.assign(defaults, opts);
          if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32);
          }
          var parts = path.split("/").filter((p) => !!p);
          var current = FS.root;
          var current_path = "/";
          for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
              break;
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
              if (!islast || islast && opts.follow_mount) {
                current = current.mounted.root;
              }
            }
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                current = lookup.node;
                if (count++ > 40) {
                  throw new FS.ErrnoError(32);
                }
              }
            }
          }
          return { path: current_path, node: current };
        },
        getPath(node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
            }
            path = path ? `${node.name}/${path}` : node.name;
            node = node.parent;
          }
        },
        hashName(parentid, name) {
          var hash = 0;
          for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
          }
          return (parentid + hash >>> 0) % FS.nameTable.length;
        },
        hashAddNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        },
        hashRemoveNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        },
        lookupNode(parent, name) {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          return FS.lookup(parent, name);
        },
        createNode(parent, name, mode, rdev) {
          assert(typeof parent == "object");
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node;
        },
        destroyNode(node) {
          FS.hashRemoveNode(node);
        },
        isRoot(node) {
          return node === node.parent;
        },
        isMountpoint(node) {
          return !!node.mounted;
        },
        isFile(mode) {
          return (mode & 61440) === 32768;
        },
        isDir(mode) {
          return (mode & 61440) === 16384;
        },
        isLink(mode) {
          return (mode & 61440) === 40960;
        },
        isChrdev(mode) {
          return (mode & 61440) === 8192;
        },
        isBlkdev(mode) {
          return (mode & 61440) === 24576;
        },
        isFIFO(mode) {
          return (mode & 61440) === 4096;
        },
        isSocket(mode) {
          return (mode & 49152) === 49152;
        },
        flagsToPermissionString(flag) {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) {
            perms += "w";
          }
          return perms;
        },
        nodePermissions(node, perms) {
          if (FS.ignorePermissions) {
            return 0;
          }
          if (perms.includes("r") && !(node.mode & 292)) {
            return 2;
          } else if (perms.includes("w") && !(node.mode & 146)) {
            return 2;
          } else if (perms.includes("x") && !(node.mode & 73)) {
            return 2;
          }
          return 0;
        },
        mayLookup(dir) {
          if (!FS.isDir(dir.mode)) return 54;
          var errCode = FS.nodePermissions(dir, "x");
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0;
        },
        mayCreate(dir, name) {
          try {
            var node = FS.lookupNode(dir, name);
            return 20;
          } catch (e) {
          }
          return FS.nodePermissions(dir, "wx");
        },
        mayDelete(dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var errCode = FS.nodePermissions(dir, "wx");
          if (errCode) {
            return errCode;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10;
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 31;
            }
          }
          return 0;
        },
        mayOpen(node, flags) {
          if (!node) {
            return 44;
          }
          if (FS.isLink(node.mode)) {
            return 32;
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" ||
flags & 512) {
              return 31;
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
        },
        MAX_OPEN_FDS: 4096,
        nextfd() {
          for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(33);
        },
        getStreamChecked(fd) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          return stream;
        },
        getStream: (fd) => FS.streams[fd],
        createStream(stream, fd = -1) {
          assert(fd >= -1);
          stream = Object.assign(new FS.FSStream(), stream);
          if (fd == -1) {
            fd = FS.nextfd();
          }
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        },
        closeStream(fd) {
          FS.streams[fd] = null;
        },
        dupStream(origStream, fd = -1) {
          var stream = FS.createStream(origStream, fd);
          stream.stream_ops?.dup?.(stream);
          return stream;
        },
        chrdev_stream_ops: {
          open(stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            stream.stream_ops.open?.(stream);
          },
          llseek() {
            throw new FS.ErrnoError(70);
          }
        },
        major: (dev) => dev >> 8,
        minor: (dev) => dev & 255,
        makedev: (ma, mi) => ma << 8 | mi,
        registerDevice(dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        },
        getDevice: (dev) => FS.devices[dev],
        getMounts(mount) {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push(...m.mounts);
          }
          return mounts;
        },
        syncfs(populate, callback) {
          if (typeof populate == "function") {
            callback = populate;
            populate = false;
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) {
            err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
          }
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;
          function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(errCode);
          }
          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode);
              }
              return;
            }
            if (++completed >= mounts.length) {
              doCallback(null);
            }
          }
          mounts.forEach((mount) => {
            if (!mount.type.syncfs) {
              return done(null);
            }
            mount.type.syncfs(mount, populate, done);
          });
        },
        mount(type, opts, mountpoint) {
          if (typeof type == "string") {
            throw type;
          }
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) {
            throw new FS.ErrnoError(10);
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
          }
          var mount = {
            type,
            opts,
            mountpoint,
            mounts: []
          };
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) {
            FS.root = mountRoot;
          } else if (node) {
            node.mounted = mount;
            if (node.mount) {
              node.mount.mounts.push(mount);
            }
          }
          return mountRoot;
        },
        unmount(mountpoint) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
          }
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          Object.keys(FS.nameTable).forEach((hash) => {
            var current = FS.nameTable[hash];
            while (current) {
              var next = current.name_next;
              if (mounts.includes(current.mount)) {
                FS.destroyNode(current);
              }
              current = next;
            }
          });
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          assert(idx !== -1);
          node.mount.mounts.splice(idx, 1);
        },
        lookup(parent, name) {
          return parent.node_ops.lookup(parent, name);
        },
        mknod(path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        },
        create(path, mode) {
          mode = mode !== void 0 ? mode : 438;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        },
        mkdir(path, mode) {
          mode = mode !== void 0 ? mode : 511;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        },
        mkdirTree(path, mode) {
          var dirs = path.split("/");
          var d = "";
          for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
              FS.mkdir(d, mode);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
        },
        mkdev(path, mode, dev) {
          if (typeof dev == "undefined") {
            dev = mode;
            mode = 438;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        },
        symlink(oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
          }
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        },
        rename(old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
          }
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28);
          }
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55);
          }
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (old_node === new_node) {
            return;
          }
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10);
          }
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
            old_node.parent = new_dir;
          } catch (e) {
            throw e;
          } finally {
            FS.hashAddNode(old_node);
          }
        },
        rmdir(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
        },
        readdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54);
          }
          return node.node_ops.readdir(node);
        },
        unlink(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
        },
        readlink(path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44);
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
        },
        stat(path, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63);
          }
          return node.node_ops.getattr(node);
        },
        lstat(path) {
          return FS.stat(path, true);
        },
        chmod(path, mode, dontFollow) {
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & -4096,
            timestamp: Date.now()
          });
        },
        lchmod(path, mode) {
          FS.chmod(path, mode, true);
        },
        fchmod(fd, mode) {
          var stream = FS.getStreamChecked(fd);
          FS.chmod(stream.node, mode);
        },
        chown(path, uid, gid, dontFollow) {
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, {
            timestamp: Date.now()
});
        },
        lchown(path, uid, gid) {
          FS.chown(path, uid, gid, true);
        },
        fchown(fd, uid, gid) {
          var stream = FS.getStreamChecked(fd);
          FS.chown(stream.node, uid, gid);
        },
        truncate(path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(28);
          }
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.nodePermissions(node, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
          });
        },
        ftruncate(fd, len) {
          var stream = FS.getStreamChecked(fd);
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
          }
          FS.truncate(stream.node, len);
        },
        utime(path, atime, mtime) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
          });
        },
        open(path, flags, mode) {
          if (path === "") {
            throw new FS.ErrnoError(44);
          }
          flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
          if (flags & 64) {
            mode = typeof mode == "undefined" ? 438 : mode;
            mode = mode & 4095 | 32768;
          } else {
            mode = 0;
          }
          var node;
          if (typeof path == "object") {
            node = path;
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, {
                follow: !(flags & 131072)
              });
              node = lookup.node;
            } catch (e) {
            }
          }
          var created = false;
          if (flags & 64) {
            if (node) {
              if (flags & 128) {
                throw new FS.ErrnoError(20);
              }
            } else {
              node = FS.mknod(path, mode, 0);
              created = true;
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (FS.isChrdev(node.mode)) {
            flags &= -513;
          }
          if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          if (flags & 512 && !created) {
            FS.truncate(node, 0);
          }
          flags &= -131713;
          var stream = FS.createStream({
            node,
            path: FS.getPath(node),
flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
ungotten: [],
            error: false
          });
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (Module["logReadFiles"] && !(flags & 1)) {
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
            }
          }
          return stream;
        },
        close(stream) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (stream.getdents) stream.getdents = null;
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        },
        isClosed(stream) {
          return stream.fd === null;
        },
        llseek(stream, offset, whence) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        },
        read(stream, buffer, offset, length, position) {
          assert(offset >= 0);
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
          }
          var seeking = typeof position != "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        },
        write(stream, buffer, offset, length, position, canOwn) {
          assert(offset >= 0);
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
          }
          if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2);
          }
          var seeking = typeof position != "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten;
        },
        allocate(stream, offset, length) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138);
          }
          stream.stream_ops.allocate(stream, offset, length);
        },
        mmap(stream, length, position, prot, flags) {
          if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
          }
          if (!length) {
            throw new FS.ErrnoError(28);
          }
          return stream.stream_ops.mmap(stream, length, position, prot, flags);
        },
        msync(stream, buffer, offset, length, mmapFlags) {
          assert(offset >= 0);
          if (!stream.stream_ops.msync) {
            return 0;
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
        },
        ioctl(stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        },
        readFile(path, opts = {}) {
          opts.flags = opts.flags || 0;
          opts.encoding = opts.encoding || "binary";
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error(`Invalid encoding type "${opts.encoding}"`);
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf);
          } else if (opts.encoding === "binary") {
            ret = buf;
          }
          FS.close(stream);
          return ret;
        },
        writeFile(path, data, opts = {}) {
          opts.flags = opts.flags || 577;
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data == "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
          } else {
            throw new Error("Unsupported data type");
          }
          FS.close(stream);
        },
        cwd: () => FS.currentPath,
        chdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) {
            throw new FS.ErrnoError(44);
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
          }
          var errCode = FS.nodePermissions(lookup.node, "x");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          FS.currentPath = lookup.path;
        },
        createDefaultDirectories() {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user");
        },
        createDefaultDevices() {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), {
            read: () => 0,
            write: (stream, buffer, offset, length, pos) => length,
            llseek: () => 0
          });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var randomBuffer = new Uint8Array(1024), randomLeft = 0;
          var randomByte = () => {
            if (randomLeft === 0) {
              randomLeft = randomFill(randomBuffer).byteLength;
            }
            return randomBuffer[--randomLeft];
          };
          FS.createDevice("/dev", "random", randomByte);
          FS.createDevice("/dev", "urandom", randomByte);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp");
        },
        createSpecialDirectories() {
          FS.mkdir("/proc");
          var proc_self = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({
            mount() {
              var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
              node.node_ops = {
                lookup(parent, name) {
                  var fd = +name;
                  var stream = FS.getStreamChecked(fd);
                  var ret = {
                    parent: null,
                    mount: { mountpoint: "fake" },
                    node_ops: { readlink: () => stream.path }
                  };
                  ret.parent = ret;
                  return ret;
                }
              };
              return node;
            }
          }, {}, "/proc/self/fd");
        },
        createStandardStreams(input, output, error) {
          if (input) {
            FS.createDevice("/dev", "stdin", input);
          } else {
            FS.symlink("/dev/tty", "/dev/stdin");
          }
          if (output) {
            FS.createDevice("/dev", "stdout", null, output);
          } else {
            FS.symlink("/dev/tty", "/dev/stdout");
          }
          if (error) {
            FS.createDevice("/dev", "stderr", null, error);
          } else {
            FS.symlink("/dev/tty1", "/dev/stderr");
          }
          var stdin = FS.open("/dev/stdin", 0);
          var stdout = FS.open("/dev/stdout", 1);
          var stderr = FS.open("/dev/stderr", 1);
          assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
          assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
          assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
        },
        staticInit() {
          FS.nameTable = new Array(4096);
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
          FS.filesystems = {
            "MEMFS": MEMFS
          };
        },
        init(input, output, error) {
          assert(!FS.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
          FS.initialized = true;
          input ??= Module["stdin"];
          output ??= Module["stdout"];
          error ??= Module["stderr"];
          FS.createStandardStreams(input, output, error);
        },
        quit() {
          FS.initialized = false;
          _fflush(0);
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue;
            }
            FS.close(stream);
          }
        },
        findObject(path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (!ret.exists) {
            return null;
          }
          return ret.object;
        },
        analyzePath(path, dontResolveLastLink) {
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
          };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/";
          } catch (e) {
            ret.error = e.errno;
          }
          return ret;
        },
        createPath(parent, path, canRead, canWrite) {
          parent = typeof parent == "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
            }
            parent = current;
          }
          return current;
        },
        createFile(parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(canRead, canWrite);
          return FS.create(path, mode);
        },
        createDataFile(parent, name, data, canRead, canWrite, canOwn) {
          var path = name;
          if (parent) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent;
          }
          var mode = FS_getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data == "string") {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr;
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
        },
        createDevice(parent, name, input, output) {
          var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(!!input, !!output);
          FS.createDevice.major ??= 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, {
            open(stream) {
              stream.seekable = false;
            },
            close(stream) {
              if (output?.buffer?.length) {
                output(10);
              }
            },
            read(stream, buffer, offset, length, pos) {
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = input();
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === void 0 && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === void 0) break;
                bytesRead++;
                buffer[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write(stream, buffer, offset, length, pos) {
              for (var i = 0; i < length; i++) {
                try {
                  output(buffer[offset + i]);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          });
          return FS.mkdev(path, mode, dev);
        },
        forceLoadFile(obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (typeof XMLHttpRequest != "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else {
            try {
              obj.contents = readBinary(obj.url);
              obj.usedBytes = obj.contents.length;
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          }
        },
        createLazyFile(parent, name, url, canRead, canWrite) {
          class LazyUint8Array {
            lengthKnown = false;
            chunks = [];
get(idx) {
              if (idx > this.length - 1 || idx < 0) {
                return void 0;
              }
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = idx / this.chunkSize | 0;
              return this.getter(chunkNum)[chunkOffset];
            }
            setDataGetter(getter) {
              this.getter = getter;
            }
            cacheLength() {
              var xhr = new XMLHttpRequest();
              xhr.open("HEAD", url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
              var chunkSize = 1024 * 1024;
              if (!hasByteServing) chunkSize = datalength;
              var doXHR = (from, to) => {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr2 = new XMLHttpRequest();
                xhr2.open("GET", url, false);
                if (datalength !== chunkSize) xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                xhr2.responseType = "arraybuffer";
                if (xhr2.overrideMimeType) {
                  xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                }
                xhr2.send(null);
                if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
                if (xhr2.response !== void 0) {
                  return new Uint8Array(
xhr2.response || []
                  );
                }
                return intArrayFromString(xhr2.responseText || "");
              };
              var lazyArray2 = this;
              lazyArray2.setDataGetter((chunkNum) => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                  lazyArray2.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
                return lazyArray2.chunks[chunkNum];
              });
              if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
              }
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
            }
            get length() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._length;
            }
            get chunkSize() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._chunkSize;
            }
          }
          if (typeof XMLHttpRequest != "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array();
            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url };
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          Object.defineProperties(node, {
            usedBytes: {
              get: function() {
                return this.contents.length;
              }
            }
          });
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach((key) => {
            var fn = node.stream_ops[key];
            stream_ops[key] = (...args) => {
              FS.forceLoadFile(node);
              return fn(...args);
            };
          });
          function writeChunks(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length)
              return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            } else {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents.get(position + i);
              }
            }
            return size;
          }
          stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            return writeChunks(stream, buffer, offset, length, position);
          };
          stream_ops.mmap = (stream, length, position, prot, flags) => {
            FS.forceLoadFile(node);
            var ptr = mmapAlloc();
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            writeChunks(stream, HEAP8, ptr, length, position);
            return { ptr, allocated: true };
          };
          node.stream_ops = stream_ops;
          return node;
        },
        absolutePath() {
          abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
        },
        createFolder() {
          abort("FS.createFolder has been removed; use FS.mkdir instead");
        },
        createLink() {
          abort("FS.createLink has been removed; use FS.symlink instead");
        },
        joinPath() {
          abort("FS.joinPath has been removed; use PATH.join instead");
        },
        mmapAlloc() {
          abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
        },
        standardizePath() {
          abort("FS.standardizePath has been removed; use PATH.normalize instead");
        }
      };
      var SYSCALLS = {
        DEFAULT_POLLMASK: 5,
        calculateAt(dirfd, path, allowEmpty) {
          if (PATH.isAbs(path)) {
            return path;
          }
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = SYSCALLS.getStreamFromFD(dirfd);
            dir = dirstream.path;
          }
          if (path.length == 0) {
            if (!allowEmpty) {
              throw new FS.ErrnoError(44);
            }
            return dir;
          }
          return PATH.join2(dir, path);
        },
        doStat(func, path, buf) {
          var stat = func(path);
          HEAP32[buf >> 2] = stat.dev;
          HEAP32[buf + 4 >> 2] = stat.mode;
          HEAPU32[buf + 8 >> 2] = stat.nlink;
          HEAP32[buf + 12 >> 2] = stat.uid;
          HEAP32[buf + 16 >> 2] = stat.gid;
          HEAP32[buf + 20 >> 2] = stat.rdev;
          tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >> 2] = tempI64[0], HEAP32[buf + 28 >> 2] = tempI64[1];
          HEAP32[buf + 32 >> 2] = 4096;
          HEAP32[buf + 36 >> 2] = stat.blocks;
          var atime = stat.atime.getTime();
          var mtime = stat.mtime.getTime();
          var ctime = stat.ctime.getTime();
          tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
          HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
          tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1];
          HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
          tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1];
          HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
          tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1];
          return 0;
        },
        doMsync(addr, stream, len, flags, offset) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (flags & 2) {
            return 0;
          }
          var buffer = HEAPU8.slice(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags);
        },
        getStreamFromFD(fd) {
          var stream = FS.getStreamChecked(fd);
          return stream;
        },
        varargs: void 0,
        getStr(ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        }
      };
      function ___syscall_fcntl64(fd, cmd, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (cmd) {
            case 0: {
              var arg = syscallGetVarargI();
              if (arg < 0) {
                return -28;
              }
              while (FS.streams[arg]) {
                arg++;
              }
              var newStream;
              newStream = FS.dupStream(stream, arg);
              return newStream.fd;
            }
            case 1:
            case 2:
              return 0;
case 3:
              return stream.flags;
            case 4: {
              var arg = syscallGetVarargI();
              stream.flags |= arg;
              return 0;
            }
            case 12: {
              var arg = syscallGetVarargP();
              var offset = 0;
              HEAP16[arg + offset >> 1] = 2;
              return 0;
            }
            case 13:
            case 14:
              return 0;
          }
          return -28;
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return -e.errno;
        }
      }
      function ___syscall_ioctl(fd, op, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (op) {
            case 21509: {
              if (!stream.tty) return -59;
              return 0;
            }
            case 21505: {
              if (!stream.tty) return -59;
              if (stream.tty.ops.ioctl_tcgets) {
                var termios = stream.tty.ops.ioctl_tcgets(stream);
                var argp = syscallGetVarargP();
                HEAP32[argp >> 2] = termios.c_iflag || 0;
                HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                for (var i = 0; i < 32; i++) {
                  HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
                }
                return 0;
              }
              return 0;
            }
            case 21510:
            case 21511:
            case 21512: {
              if (!stream.tty) return -59;
              return 0;
            }
            case 21506:
            case 21507:
            case 21508: {
              if (!stream.tty) return -59;
              if (stream.tty.ops.ioctl_tcsets) {
                var argp = syscallGetVarargP();
                var c_iflag = HEAP32[argp >> 2];
                var c_oflag = HEAP32[argp + 4 >> 2];
                var c_cflag = HEAP32[argp + 8 >> 2];
                var c_lflag = HEAP32[argp + 12 >> 2];
                var c_cc = [];
                for (var i = 0; i < 32; i++) {
                  c_cc.push(HEAP8[argp + i + 17]);
                }
                return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
              }
              return 0;
            }
            case 21519: {
              if (!stream.tty) return -59;
              var argp = syscallGetVarargP();
              HEAP32[argp >> 2] = 0;
              return 0;
            }
            case 21520: {
              if (!stream.tty) return -59;
              return -28;
            }
            case 21531: {
              var argp = syscallGetVarargP();
              return FS.ioctl(stream, op, argp);
            }
            case 21523: {
              if (!stream.tty) return -59;
              if (stream.tty.ops.ioctl_tiocgwinsz) {
                var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                var argp = syscallGetVarargP();
                HEAP16[argp >> 1] = winsize[0];
                HEAP16[argp + 2 >> 1] = winsize[1];
              }
              return 0;
            }
            case 21524: {
              if (!stream.tty) return -59;
              return 0;
            }
            case 21515: {
              if (!stream.tty) return -59;
              return 0;
            }
            default:
              return -28;
          }
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return -e.errno;
        }
      }
      function ___syscall_openat(dirfd, path, flags, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          path = SYSCALLS.getStr(path);
          path = SYSCALLS.calculateAt(dirfd, path);
          var mode = varargs ? syscallGetVarargI() : 0;
          return FS.open(path, flags, mode).fd;
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return -e.errno;
        }
      }
      var __abort_js = () => {
        abort("native code called abort()");
      };
      var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
      var _emscripten_err = (str) => err(UTF8ToString(str));
      var getHeapMax = () => (



2147483648
      );
      var growMemory = (size) => {
        var b = wasmMemory.buffer;
        var pages = (size - b.byteLength + 65535) / 65536 | 0;
        try {
          wasmMemory.grow(pages);
          updateMemoryViews();
          return 1;
        } catch (e) {
          err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
        }
      };
      var _emscripten_resize_heap = (requestedSize) => {
        var oldSize = HEAPU8.length;
        requestedSize >>>= 0;
        assert(requestedSize > oldSize);
        var maxHeapSize = getHeapMax();
        if (requestedSize > maxHeapSize) {
          err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
          return false;
        }
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
          var replacement = growMemory(newSize);
          if (replacement) {
            return true;
          }
        }
        err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
        return false;
      };
      var runtimeKeepaliveCounter = 0;
      var _proc_exit = (code) => {
        EXITSTATUS = code;
        quit_(code, new ExitStatus(code));
      };
      var exitJS = (status, implicit) => {
        EXITSTATUS = status;
        checkUnflushedContent();
        if (!implicit) {
          var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
          readyPromiseReject(msg);
          err(msg);
        }
        _proc_exit(status);
      };
      var _exit = exitJS;
      function _fd_close(fd) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          FS.close(stream);
          return 0;
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return e.errno;
        }
      }
      var doReadv = (stream, iov, iovcnt, offset) => {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAPU32[iov >> 2];
          var len = HEAPU32[iov + 4 >> 2];
          iov += 8;
          var curr = FS.read(stream, HEAP8, ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break;
        }
        return ret;
      };
      function _fd_read(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = doReadv(stream, iov, iovcnt);
          HEAPU32[pnum >> 2] = num;
          return 0;
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return e.errno;
        }
      }
      var convertI32PairToI53Checked = (lo, hi) => {
        assert(lo == lo >>> 0 || lo == (lo | 0));
        assert(hi === (hi | 0));
        return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
      };
      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        var offset = convertI32PairToI53Checked(offset_low, offset_high);
        try {
          if (isNaN(offset)) return 61;
          var stream = SYSCALLS.getStreamFromFD(fd);
          FS.llseek(stream, offset, whence);
          tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
          if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
          return 0;
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return e.errno;
        }
      }
      var doWritev = (stream, iov, iovcnt, offset) => {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAPU32[iov >> 2];
          var len = HEAPU32[iov + 4 >> 2];
          iov += 8;
          var curr = FS.write(stream, HEAP8, ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) {
            break;
          }
        }
        return ret;
      };
      function _fd_write(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = doWritev(stream, iov, iovcnt);
          HEAPU32[pnum >> 2] = num;
          return 0;
        } catch (e) {
          if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
          return e.errno;
        }
      }
      var handleException = (e) => {
        if (e instanceof ExitStatus || e == "unwind") {
          return EXITSTATUS;
        }
        checkStackCookie();
        if (e instanceof WebAssembly.RuntimeError) {
          if (_emscripten_stack_get_current() <= 0) {
            err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 33554432)");
          }
        }
        quit_(1, e);
      };
      var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
        assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      };
      var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
      var stringToUTF8OnStack = (str) => {
        var size = lengthBytesUTF8(str) + 1;
        var ret = stackAlloc(size);
        stringToUTF8(str, ret, size);
        return ret;
      };
      var ALLOC_STACK = 1;
      var allocate = (slab, allocator) => {
        var ret;
        assert(typeof allocator == "number", "allocate no longer takes a type argument");
        assert(typeof slab != "number", "allocate no longer takes a number as arg0");
        if (allocator == ALLOC_STACK) {
          ret = stackAlloc(slab.length);
        } else {
          ret = _malloc(slab.length);
        }
        if (!slab.subarray && !slab.slice) {
          slab = new Uint8Array(slab);
        }
        HEAPU8.set(slab, ret);
        return ret;
      };
      var getCFunc = (ident) => {
        var func = Module["_" + ident];
        assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
        return func;
      };
      var writeArrayToMemory = (array, buffer) => {
        assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
        HEAP8.set(array, buffer);
      };
      var ccall = (ident, returnType, argTypes, args, opts) => {
        var toC = {
          "string": (str) => {
            var ret2 = 0;
            if (str !== null && str !== void 0 && str !== 0) {
              ret2 = stringToUTF8OnStack(str);
            }
            return ret2;
          },
          "array": (arr) => {
            var ret2 = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret2);
            return ret2;
          }
        };
        function convertReturnValue(ret2) {
          if (returnType === "string") {
            return UTF8ToString(ret2);
          }
          if (returnType === "boolean") return Boolean(ret2);
          return ret2;
        }
        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        assert(returnType !== "array", 'Return type should not be "array".');
        if (args) {
          for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
              if (stack === 0) stack = stackSave();
              cArgs[i] = converter(args[i]);
            } else {
              cArgs[i] = args[i];
            }
          }
        }
        var ret = func(...cArgs);
        function onDone(ret2) {
          if (stack !== 0) stackRestore(stack);
          return convertReturnValue(ret2);
        }
        ret = onDone(ret);
        return ret;
      };
      var cwrap = (ident, returnType, argTypes, opts) => {
        return (...args) => ccall(ident, returnType, argTypes, args);
      };
      Module["cwrap"] = cwrap;
      FS.createPreloadedFile = FS_createPreloadedFile;
      FS.staticInit();
      function checkIncomingModuleAPI() {
        ignoredModuleProp("fetchSettings");
      }
      var wasmImports = {
__assert_fail: ___assert_fail,
__cxa_throw: ___cxa_throw,
__syscall_fcntl64: ___syscall_fcntl64,
__syscall_ioctl: ___syscall_ioctl,
__syscall_openat: ___syscall_openat,
_abort_js: __abort_js,
_emscripten_memcpy_js: __emscripten_memcpy_js,
emscripten_err: _emscripten_err,
emscripten_resize_heap: _emscripten_resize_heap,
exit: _exit,
fd_close: _fd_close,
fd_read: _fd_read,
fd_seek: _fd_seek,
fd_write: _fd_write,
proc_exit: _proc_exit
      };
      var wasmExports = createWasm();
      Module["_createTheSolver"] = createExportWrapper("createTheSolver", 0);
      Module["_ensureVar"] = createExportWrapper("ensureVar", 1);
      Module["_addClause"] = createExportWrapper("addClause", 1);
      Module["_solve"] = createExportWrapper("solve", 0);
      Module["_getSolution"] = createExportWrapper("getSolution", 0);
      Module["_getNumVars"] = createExportWrapper("getNumVars", 0);
      Module["_solveAssuming"] = createExportWrapper("solveAssuming", 1);
      Module["_retireVar"] = createExportWrapper("retireVar", 1);
      var _main = Module["_main"] = createExportWrapper("__main_argc_argv", 2);
      Module["_solve_string"] = createExportWrapper("solve_string", 2);
      var _malloc = createExportWrapper("malloc", 1);
      var _strerror = createExportWrapper("strerror", 1);
      var _fflush = createExportWrapper("fflush", 1);
      var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports["emscripten_stack_init"])();
      var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();
      var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports["_emscripten_stack_restore"])(a0);
      var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"])(a0);
      var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
      Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji", 5);
      Module["stackSave"] = stackSave;
      Module["stackRestore"] = stackRestore;
      Module["setValue"] = setValue;
      Module["getValue"] = getValue;
      Module["ALLOC_STACK"] = ALLOC_STACK;
      Module["allocate"] = allocate;
      var missingLibrarySymbols = [
        "writeI53ToI64",
        "writeI53ToI64Clamped",
        "writeI53ToI64Signaling",
        "writeI53ToU64Clamped",
        "writeI53ToU64Signaling",
        "readI53FromI64",
        "readI53FromU64",
        "convertI32PairToI53",
        "convertU32PairToI53",
        "getTempRet0",
        "setTempRet0",
        "inetPton4",
        "inetNtop4",
        "inetPton6",
        "inetNtop6",
        "readSockaddr",
        "writeSockaddr",
        "emscriptenLog",
        "readEmAsmArgs",
        "jstoi_q",
        "getExecutableName",
        "listenOnce",
        "autoResumeAudioContext",
        "dynCallLegacy",
        "getDynCaller",
        "dynCall",
        "runtimeKeepalivePush",
        "runtimeKeepalivePop",
        "callUserCallback",
        "maybeExit",
        "asmjsMangle",
        "HandleAllocator",
        "getNativeTypeSize",
        "STACK_SIZE",
        "STACK_ALIGN",
        "POINTER_SIZE",
        "ASSERTIONS",
        "uleb128Encode",
        "sigToWasmTypes",
        "generateFuncType",
        "convertJsFunctionToWasm",
        "getEmptyTableSlot",
        "updateTableMap",
        "getFunctionAddress",
        "addFunction",
        "removeFunction",
        "reallyNegative",
        "unSign",
        "strLen",
        "reSign",
        "formatString",
        "intArrayToString",
        "AsciiToString",
        "stringToAscii",
        "UTF16ToString",
        "stringToUTF16",
        "lengthBytesUTF16",
        "UTF32ToString",
        "stringToUTF32",
        "lengthBytesUTF32",
        "stringToNewUTF8",
        "registerKeyEventCallback",
        "maybeCStringToJsString",
        "findEventTarget",
        "getBoundingClientRect",
        "fillMouseEventData",
        "registerMouseEventCallback",
        "registerWheelEventCallback",
        "registerUiEventCallback",
        "registerFocusEventCallback",
        "fillDeviceOrientationEventData",
        "registerDeviceOrientationEventCallback",
        "fillDeviceMotionEventData",
        "registerDeviceMotionEventCallback",
        "screenOrientation",
        "fillOrientationChangeEventData",
        "registerOrientationChangeEventCallback",
        "fillFullscreenChangeEventData",
        "registerFullscreenChangeEventCallback",
        "JSEvents_requestFullscreen",
        "JSEvents_resizeCanvasForFullscreen",
        "registerRestoreOldStyle",
        "hideEverythingExceptGivenElement",
        "restoreHiddenElements",
        "setLetterbox",
        "softFullscreenResizeWebGLRenderTarget",
        "doRequestFullscreen",
        "fillPointerlockChangeEventData",
        "registerPointerlockChangeEventCallback",
        "registerPointerlockErrorEventCallback",
        "requestPointerLock",
        "fillVisibilityChangeEventData",
        "registerVisibilityChangeEventCallback",
        "registerTouchEventCallback",
        "fillGamepadEventData",
        "registerGamepadEventCallback",
        "registerBeforeUnloadEventCallback",
        "fillBatteryEventData",
        "battery",
        "registerBatteryEventCallback",
        "setCanvasElementSize",
        "getCanvasElementSize",
        "jsStackTrace",
        "getCallstack",
        "convertPCtoSourceLocation",
        "getEnvStrings",
        "checkWasiClock",
        "wasiRightsToMuslOFlags",
        "wasiOFlagsToMuslOFlags",
        "safeSetTimeout",
        "setImmediateWrapped",
        "safeRequestAnimationFrame",
        "clearImmediateWrapped",
        "polyfillSetImmediate",
        "registerPostMainLoop",
        "registerPreMainLoop",
        "getPromise",
        "makePromise",
        "idsToPromises",
        "makePromiseCallback",
        "findMatchingCatch",
        "Browser_asyncPrepareDataCounter",
        "isLeapYear",
        "ydayFromDate",
        "arraySum",
        "addDays",
        "getSocketFromFD",
        "getSocketAddress",
        "FS_unlink",
        "FS_mkdirTree",
        "_setNetworkCallback",
        "heapObjectForWebGLType",
        "toTypedArrayIndex",
        "webgl_enable_ANGLE_instanced_arrays",
        "webgl_enable_OES_vertex_array_object",
        "webgl_enable_WEBGL_draw_buffers",
        "webgl_enable_WEBGL_multi_draw",
        "webgl_enable_EXT_polygon_offset_clamp",
        "webgl_enable_EXT_clip_control",
        "webgl_enable_WEBGL_polygon_mode",
        "emscriptenWebGLGet",
        "computeUnpackAlignedImageSize",
        "colorChannelsInGlTextureFormat",
        "emscriptenWebGLGetTexPixelData",
        "emscriptenWebGLGetUniform",
        "webglGetUniformLocation",
        "webglPrepareUniformLocationsBeforeFirstUse",
        "webglGetLeftBracePos",
        "emscriptenWebGLGetVertexAttrib",
        "__glGetActiveAttribOrUniform",
        "writeGLArray",
        "registerWebGlEventCallback",
        "runAndAbortIfError",
        "writeStringToMemory",
        "writeAsciiToMemory",
        "setErrNo",
        "demangle",
        "stackTrace"
      ];
      missingLibrarySymbols.forEach(missingLibrarySymbol);
      var unexportedSymbols = [
        "run",
        "addOnPreRun",
        "addOnInit",
        "addOnPreMain",
        "addOnExit",
        "addOnPostRun",
        "addRunDependency",
        "removeRunDependency",
        "out",
        "err",
        "callMain",
        "abort",
        "wasmMemory",
        "wasmExports",
        "writeStackCookie",
        "checkStackCookie",
        "convertI32PairToI53Checked",
        "stackAlloc",
        "ptrToString",
        "zeroMemory",
        "exitJS",
        "getHeapMax",
        "growMemory",
        "ENV",
        "ERRNO_CODES",
        "strError",
        "DNS",
        "Protocols",
        "Sockets",
        "timers",
        "warnOnce",
        "readEmAsmArgsArray",
        "jstoi_s",
        "handleException",
        "keepRuntimeAlive",
        "asyncLoad",
        "alignMemory",
        "mmapAlloc",
        "wasmTable",
        "noExitRuntime",
        "getCFunc",
        "ccall",
        "cwrap",
        "freeTableIndexes",
        "functionsInTableMap",
        "PATH",
        "PATH_FS",
        "UTF8Decoder",
        "UTF8ArrayToString",
        "UTF8ToString",
        "stringToUTF8Array",
        "stringToUTF8",
        "lengthBytesUTF8",
        "intArrayFromString",
        "UTF16Decoder",
        "stringToUTF8OnStack",
        "writeArrayToMemory",
        "JSEvents",
        "specialHTMLTargets",
        "findCanvasEventTarget",
        "currentFullscreenStrategy",
        "restoreOldWindowedStyle",
        "UNWIND_CACHE",
        "ExitStatus",
        "doReadv",
        "doWritev",
        "initRandomFill",
        "randomFill",
        "promiseMap",
        "uncaughtExceptionCount",
        "exceptionLast",
        "exceptionCaught",
        "ExceptionInfo",
        "Browser",
        "getPreloadedImageData__data",
        "wget",
        "MONTH_DAYS_REGULAR",
        "MONTH_DAYS_LEAP",
        "MONTH_DAYS_REGULAR_CUMULATIVE",
        "MONTH_DAYS_LEAP_CUMULATIVE",
        "SYSCALLS",
        "preloadPlugins",
        "FS_createPreloadedFile",
        "FS_modeStringToFlags",
        "FS_getMode",
        "FS_stdin_getChar_buffer",
        "FS_stdin_getChar",
        "FS_createPath",
        "FS_createDevice",
        "FS_readFile",
        "FS",
        "FS_createDataFile",
        "FS_createLazyFile",
        "MEMFS",
        "TTY",
        "PIPEFS",
        "SOCKFS",
        "tempFixedLengthArray",
        "miniTempWebGLFloatBuffers",
        "miniTempWebGLIntBuffers",
        "GL",
        "AL",
        "GLUT",
        "EGL",
        "GLEW",
        "IDBStore",
        "SDL",
        "SDL_gfx",
        "ALLOC_NORMAL",
        "allocateUTF8",
        "allocateUTF8OnStack",
        "print",
        "printErr"
      ];
      unexportedSymbols.forEach(unexportedRuntimeSymbol);
      var calledRun;
      dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller;
      };
      function callMain(args = []) {
        assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
        assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
        var entryFunction = _main;
        args.unshift(thisProgram);
        var argc = args.length;
        var argv = stackAlloc((argc + 1) * 4);
        var argv_ptr = argv;
        args.forEach((arg) => {
          HEAPU32[argv_ptr >> 2] = stringToUTF8OnStack(arg);
          argv_ptr += 4;
        });
        HEAPU32[argv_ptr >> 2] = 0;
        try {
          var ret = entryFunction(argc, argv);
          exitJS(
            ret,
true
          );
          return ret;
        } catch (e) {
          return handleException(e);
        }
      }
      function stackCheckInit() {
        _emscripten_stack_init();
        writeStackCookie();
      }
      function run(args = arguments_) {
        if (runDependencies > 0) {
          return;
        }
        stackCheckInit();
        preRun();
        if (runDependencies > 0) {
          return;
        }
        function doRun() {
          if (calledRun) return;
          calledRun = true;
          Module["calledRun"] = true;
          if (ABORT) return;
          initRuntime();
          preMain();
          readyPromiseResolve(Module);
          Module["onRuntimeInitialized"]?.();
          if (shouldRunNow) callMain(args);
          postRun();
        }
        if (Module["setStatus"]) {
          Module["setStatus"]("Running...");
          setTimeout(() => {
            setTimeout(() => Module["setStatus"](""), 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
        checkStackCookie();
      }
      function checkUnflushedContent() {
        var oldOut = out;
        var oldErr = err;
        var has = false;
        out = err = (x) => {
          has = true;
        };
        try {
          _fflush(0);
          ["stdout", "stderr"].forEach((name) => {
            var info = FS.analyzePath("/dev/" + name);
            if (!info) return;
            var stream = info.object;
            var rdev = stream.rdev;
            var tty = TTY.ttys[rdev];
            if (tty?.output?.length) {
              has = true;
            }
          });
        } catch (e) {
        }
        out = oldOut;
        err = oldErr;
        if (has) {
          warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
        }
      }
      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
          Module["preInit"].pop()();
        }
      }
      var shouldRunNow = false;
      if (Module["noInitialRun"]) shouldRunNow = false;
      run();
      moduleRtn = readyPromise;
      for (const prop of Object.keys(Module)) {
        if (!(prop in moduleArg)) {
          Object.defineProperty(moduleArg, prop, {
            configurable: true,
            get() {
              abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
            }
          });
        }
      }
      return moduleRtn;
    });
  })();
  class MiniSat {
    _minisat;
    hasInitialized = false;
    async initialize() {
      if (!this.hasInitialized) {
        this._minisat = await MINISAT();
        this.hasInitialized = true;
        this._minisat.__createTheSolver = this._minisat.cwrap("createTheSolver", null, []);
        this._minisat.__ensureVar = this._minisat.cwrap("ensureVar", null, ["number"]);
        this._minisat.__addClause = this._minisat.cwrap("addClause", "boolean", ["number"]);
        this._minisat.__solve = this._minisat.cwrap("solve", "boolean", []);
        this._minisat.__getSolution = this._minisat.cwrap("getSolution", "number", []);
        this._minisat.__getNumVars = this._minisat.cwrap("getNumVars", "number", []);
        this._minisat.__solveAssuming = this._minisat.cwrap("solveAssuming", "boolean", ["number"]);
        this._minisat.__retireVar = this._minisat.cwrap("retireVar", null, ["number"]);
        this._minisat.__solveOptional = this._minisat.cwrap("solveOptional", null, ["number", "number"]);
        this._minisat.__addOptionalClause = this._minisat.cwrap("addOptionalClause", null, ["number"]);
        this._minisat.__createTheSolver();
      }
    }
    ensureVar(v) {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      this._minisat.__ensureVar(v);
    }
    addClause(terms) {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      this._clauses.push(terms);
      let curr = this;
      return this._native.savingStack(function(native, C) {
        let arr = new Uint8Array((terms.length + 1) * 4);
        var termsPtr = curr._minisat.allocate(arr, curr._minisat.ALLOC_STACK);
        terms.forEach(function(t, i) {
          curr._minisat.setValue(termsPtr + i * 4, t, "i32");
        });
        curr._minisat.setValue(termsPtr + terms.length * 4, 0, "i32");
        let retVal = curr._minisat.__addClause(termsPtr);
        return retVal ? true : false;
      });
    }
    addOptionalClause(terms) {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      let curr = this;
      return this._native.savingStack(function(native, C) {
        let arr = new Uint8Array((terms.length + 1) * 4);
        var termsPtr = curr._minisat.allocate(arr, curr._minisat.ALLOC_STACK);
        terms.forEach(function(t, i) {
          curr._minisat.setValue(termsPtr + i * 4, t, "i32");
        });
        curr._minisat.setValue(termsPtr + terms.length * 4, 0, "i32");
        let retVal = curr._minisat.__addOptionalClause(termsPtr);
        return retVal ? true : false;
      });
    }
    solve() {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      return this._minisat.__solve() ? true : false;
    }
    solveOptional() {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      let arr1 = new Uint8Array(4);
      let arr2 = new Uint8Array(4);
      const resultPtr = this._minisat.allocate(arr1, this._minisat.ALLOC_STACK);
      const indexPtr = this._minisat.allocate(arr2, this._minisat.ALLOC_STACK);
      this._minisat.__solveOptional(resultPtr, indexPtr);
      const result = this._minisat.getValue(resultPtr, "i32") !== 0;
      const index = this._minisat.getValue(indexPtr, "i32");
      return { result, index };
    }
    solveAssuming(v) {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      return this._minisat.__solveAssuming(v) ? true : false;
    }
    getSolution() {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      var solution = [null];
      var C = this._minisat;
      var numVars = C.__getNumVars();
      var solPtr = C.__getSolution();
      for (var i = 0; i < numVars; i++) {
        solution[i + 1] = C.getValue(solPtr + i, "i8") === 0;
      }
      return solution;
    }
    retireVar(v) {
      if (!this.hasInitialized) {
        throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
      }
      this._minisat.__retireVar(v);
    }
    constructor() {
      let curr = this;
      this._clauses = [];
      this._native = {
        getStackPointer: function() {
          if (!curr.hasInitialized) {
            throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
          }
          return curr._minisat.stackSave();
        },
        setStackPointer: function(ptr) {
          if (!curr.hasInitialized) {
            throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
          }
          curr._minisat.stackRestore(ptr);
        },
        allocateBytes: function(len) {
          if (!curr.hasInitialized) {
            throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
          }
          return curr._minisat.allocate(len, curr._minisat.ALLOC_STACK);
        },
        pushString: function(str) {
          if (!curr.hasInitialized) {
            throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
          }
          return curr._minisat.allocateBytes(curr._minisat.intArrayFromString(str));
        },
        savingStack: function(func) {
          if (!curr.hasInitialized) {
            throw new Error("MiniSat has not been initialized. use await solver.initialize() before calling any other methods");
          }
          var SP = this.getStackPointer();
          try {
            return func(this, curr._minisat);
          } finally {
            this.setStackPointer(SP);
          }
        }
      };
    }
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var logic;
  var hasRequiredLogic;
  function requireLogic() {
    if (hasRequiredLogic) return logic;
    hasRequiredLogic = 1;
    var Logic2;
    Logic2 = {};
    var withDescription = function(description, tester) {
      tester.description = description;
      return tester;
    };
    var lazyInstanceofTester = function(description, obj, constructorName) {
      return withDescription(description, function(x) {
        return x instanceof obj[constructorName];
      });
    };
    Logic2.isNumTerm = withDescription(
      "a NumTerm (non-zero integer)",
      function(x) {
        return x === (x | 0) && x !== 0;
      }
    );
    Logic2.isNameTerm = withDescription(
      "a NameTerm (string)",
      function(x) {
        return typeof x === "string" && !/^-*[0-9]*$/.test(x);
      }
    );
    Logic2.isTerm = withDescription(
      "a Term (appropriate string or number)",
      function(x) {
        return Logic2.isNumTerm(x) || Logic2.isNameTerm(x);
      }
    );
    Logic2.isWholeNumber = withDescription(
      "a whole number (integer >= 0)",
      function(x) {
        return Number.isInteger(x) && x >= 0;
      }
    );
    Logic2.isFormula = lazyInstanceofTester("a Formula", Logic2, "Formula");
    Logic2.isClause = lazyInstanceofTester("a Clause", Logic2, "Clause");
    Logic2.isBits = lazyInstanceofTester("a Bits", Logic2, "Bits");
    Logic2._isInteger = withDescription(
      "an integer",
      function(x) {
        return x === (x | 0);
      }
    );
    Logic2._isFunction = withDescription(
      "a Function",
      function(x) {
        return typeof x === "function";
      }
    );
    Logic2._isString = withDescription(
      "a String",
      function(x) {
        return typeof x === "string";
      }
    );
    Logic2._isArrayWhere = function(tester) {
      var description = "an array";
      if (tester.description) {
        description += " of " + tester.description;
      }
      return withDescription(description, function(x) {
        if (!Array.isArray(x)) {
          return false;
        } else {
          for (var i = 0; i < x.length; i++) {
            if (!tester(x[i])) {
              return false;
            }
          }
          return true;
        }
      });
    };
    Logic2._isFormulaOrTerm = withDescription(
      "a Formula or Term",
      function(x) {
        return Logic2.isFormula(x) || Logic2.isTerm(x);
      }
    );
    Logic2._isFormulaOrTermOrBits = withDescription(
      "a Formula, Term, or Bits",
      function(x) {
        return Logic2.isFormula(x) || Logic2.isBits(x) || Logic2.isTerm(x);
      }
    );
    var isInteger = Logic2._isInteger;
    var isFunction = Logic2._isFunction;
    var isString = Logic2._isString;
    var isArrayWhere = Logic2._isArrayWhere;
    var isFormulaOrTerm = Logic2._isFormulaOrTerm;
    var isFormulaOrTermOrBits = Logic2._isFormulaOrTermOrBits;
    Logic2._assert = function(value, tester, description) {
      if (!tester(value)) {
        var displayValue = JSON.stringify(value);
        throw new Error(displayValue + " is not " + (tester.description || description));
      }
    };
    var assertNumArgs = function(actual, expected, funcName) {
      if (actual !== expected) {
        throw new Error("Expected " + expected + " args in " + funcName + ", got " + actual);
      }
    };
    var assert = Logic2._assert;
    Logic2._assertIfEnabled = function(value, tester, description) {
      if (assert) assert(value, tester, description);
    };
    Logic2.disablingAssertions = function(f) {
      var oldAssert = assert;
      try {
        assert = null;
        return f();
      } finally {
        assert = oldAssert;
      }
    };
    Logic2._disablingTypeChecks = Logic2.disablingAssertions;
    Logic2.not = function(operand) {
      if (assert) assert(operand, isFormulaOrTerm);
      if (operand instanceof Logic2.Formula) {
        return new Logic2.NotFormula(operand);
      } else {
        if (typeof operand === "number") {
          return -operand;
        } else if (operand.charAt(0) === "-") {
          return operand.slice(1);
        } else {
          return "-" + operand;
        }
      }
    };
    Logic2.NAME_FALSE = "$F";
    Logic2.NAME_TRUE = "$T";
    Logic2.NUM_FALSE = 1;
    Logic2.NUM_TRUE = 2;
    Logic2.TRUE = Logic2.NAME_TRUE;
    Logic2.FALSE = Logic2.NAME_FALSE;
    Logic2.Formula = function() {
    };
    Logic2._defineFormula = function(constructor, typeName, methods) {
      if (assert) assert(constructor, isFunction);
      if (assert) assert(typeName, isString);
      constructor.prototype = new Logic2.Formula();
      constructor.prototype.type = typeName;
      if (methods) {
        Object.assign(constructor.prototype, methods);
      }
    };
    Logic2.Formula.prototype.generateClauses = function(isTrue, termifier) {
      throw new Error("Cannot generate this Formula; it must be expanded");
    };
    Logic2.Formula._nextGuid = 1;
    Logic2.Formula.prototype._guid = null;
    Logic2.Formula.prototype.guid = function() {
      if (this._guid === null) {
        this._guid = Logic2.Formula._nextGuid++;
      }
      return this._guid;
    };
    Logic2.Clause = function() {
      var terms = Array.prototype.concat.apply([], arguments);
      if (assert) assert(terms, isArrayWhere(Logic2.isNumTerm));
      this.terms = terms;
    };
    Logic2.Clause.prototype.append = function() {
      return new Logic2.Clause(this.terms.concat(Array.prototype.concat.apply([], arguments)));
    };
    var FormulaInfo = function() {
      this.varName = null;
      this.varNum = null;
      this.occursPositively = false;
      this.occursNegatively = false;
      this.isRequired = false;
      this.isForbidden = false;
    };
    Logic2.Termifier = function(solver) {
      this.solver = solver;
    };
    Logic2.Termifier.prototype.clause = function() {
      var self2 = this;
      var formulas = Array.prototype.concat.apply([], arguments);
      if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
      return new Logic2.Clause(formulas.map((e) => self2.term(e)));
    };
    Logic2.Termifier.prototype.term = function(formula) {
      return this.solver._formulaToTerm(formula);
    };
    Logic2.Termifier.prototype.generate = function(isTrue, formula) {
      return this.solver._generateFormula(isTrue, formula, this);
    };
    Logic2.Solver = class Solver {
      hasInitialized = false;
      clauses = [];
_num2name = [null];
_name2num = {};
_minisat = null;
      _formulaInfo = {};
_nextFormulaNumByType = {};
_ungeneratedFormulas = {};
_F_used = false;
      _T_used = false;
      _numClausesAddedToMiniSat = 0;
      _MiniSatConstructor = null;
      _unsat = false;
_optionalFormulas = [];
      _optionalFormulaStatuses = [];
      _optionalFormulaWeights = [];
      _optionalFormulaRatios = [];
      async initialize() {
        if (this.hasInitialized) {
          return;
        }
        this._minisat = new (await this._MiniSatConstructor)();
        this.hasInitialized = true;
        await this._minisat.initialize();
      }
      requireOptional(formulas, weights = 1, options = { checkIsValid: false, requiredRatio: 0.9 }) {
        if (!Array.isArray(formulas)) {
          formulas = [formulas];
        }
        if (!Array.isArray(weights)) {
          weights = [weights];
        }
        if (Array.isArray(formulas[0])) {
          let last;
          formulas.forEach((formula, i, a) => {
            let curr = this.requireOptional(formula, weights[i], options);
            if (i == a.length - 1) last = curr;
          });
          return last;
        }
        if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
        if (formulas.length != weights) {
          if (weights.length != 1) {
            throw new Error("Formula array and weight array must be same length; they are " + formulas.length + " and " + weights.length);
          }
          weights = Array(formulas.length).fill(weights[0]);
        }
        let status;
        options.requiredRatio = options.requiredRatio ?? 0.9;
        if (options.checkIsValid) {
          status = this.solveOptional({ method: "greedy", requiredRatio: options.requiredRatio }, [formulas, weights]);
        } else status = { isValid: false, ratio: 0 };
        this._optionalFormulas.push(formulas) - 1;
        this._optionalFormulaWeights.push(weights);
        this._optionalFormulaStatuses.push(status);
        this._optionalFormulaRatios.push(options.requiredRatio);
        return status;
      }
      _getMaximumSatisfiable(formulas, weights, lastCondition, options, formulaIndex, isRecursive) {
        let totalSatisfied = 0;
        let nextLast = lastCondition;
        let combinedLast = Logic2.and(lastCondition, ...formulas);
        if (this.solveAssuming(combinedLast)) {
          totalSatisfied += weights.reduce((x, y) => x + y, 0);
          nextLast = combinedLast;
        } else {
          if (!isRecursive) {
            formulas = formulas.slice(0).map((e, i) => [e, i]).sort((x, y) => weights[y[1]] - weights[x[1]]).map((e) => e[0]);
            weights = weights.slice(0).sort((x, y) => y - x);
          }
          let formulaAmount = formulas.length;
          if (formulaAmount > 1) {
            let halfFormulaAmount = formulas.length / 2;
            let formulasLeft = formulas.slice(0, halfFormulaAmount);
            let weightsLeft = weights.slice(0, halfFormulaAmount);
            let [leftSatisfiedNum, leftLast] = this._getMaximumSatisfiable(formulasLeft, weightsLeft, nextLast, options, formulaIndex, true);
            totalSatisfied += leftSatisfiedNum;
            nextLast = leftLast;
            let formulasRight = formulas.slice(halfFormulaAmount, formulaAmount);
            let weightsRight = weights.slice(halfFormulaAmount, formulaAmount);
            let [rightSatisfiedNum, rightLast] = this._getMaximumSatisfiable(formulasRight, weightsRight, nextLast, options, formulaIndex, true);
            totalSatisfied += rightSatisfiedNum;
            nextLast = rightLast;
          }
        }
        if (!isRecursive) {
          let ratio = totalSatisfied / (weights.reduce((x, y) => x + y, 0) || 1);
          let isValid = ratio >= options.requiredRatio;
          if (formulaIndex != -1) {
            let statusObj = this._optionalFormulaStatuses[formulaIndex];
            statusObj.isValid = isValid;
            statusObj.ratio = ratio;
          } else return { isValid, ratio };
        }
        return [totalSatisfied, nextLast];
      }
      _solveOptional(options = { method: "greedy" }, requireeToBe) {
        if (typeof options != "object") {
          throw new Error("Options argument must be an object.");
        }
        let method = options.method || "greedy";
        options.requiredRatio = options.requiredRatio ?? 0.9;
        if (method == "greedy") {
          let last = Logic2.TRUE;
          for (let i = 0; i < this._optionalFormulas.length; i++) {
            let formulas = this._optionalFormulas[i];
            let weights = this._optionalFormulaWeights[i];
            last = this._getMaximumSatisfiable(formulas, weights, last, options, i)[1];
          }
          if (Array.isArray(requireeToBe)) {
            let [formulas, weights] = requireeToBe;
            if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
            return this._getMaximumSatisfiable(formulas, weights, last, options, -1);
          }
          return this.solveAssuming(last);
        } else {
          throw new Error("Unknown method in options object.");
        }
      }
      solveOptional(options) {
        return this._solveOptional(options);
      }
      constructor() {
        this._termifier = new Logic2.Termifier(this);
        if (!this.getVarNum) {
          throw new Error("Logic.Solver must be invoked using new.");
        }
        var F = this.getVarNum(Logic2.NAME_FALSE, false, true);
        var T = this.getVarNum(Logic2.NAME_TRUE, false, true);
        if (F !== Logic2.NUM_FALSE || T !== Logic2.NUM_TRUE) {
          throw new Error("Assertion failure: $T and $F have wrong numeric value");
        }
        this._F_used = false;
        this._T_used = false;
        this.clauses.push(new Logic2.Clause(-Logic2.NUM_FALSE));
        this.clauses.push(new Logic2.Clause(Logic2.NUM_TRUE));
      }
    };
    Logic2.Solver.prototype.getVarNum = function(vname, noCreate, _createInternals) {
      var key = " " + vname;
      if (this._name2num.hasOwnProperty(key)) {
        return this._name2num[key];
      } else if (noCreate) {
        return 0;
      } else {
        if (typeof vname == "string" && vname.charAt(0) === "$" && !_createInternals) {
          throw new Error("Only generated variable names can start with $");
        }
        var vnum = this._num2name.length;
        this._name2num[key] = vnum;
        this._num2name.push(vname);
        return vnum;
      }
    };
    Logic2.Solver.prototype.getVarName = function(vnum) {
      if (assert) assert(vnum, isInteger);
      var num2name = this._num2name;
      if (vnum < 1 || vnum >= num2name.length) {
        throw new Error("Bad variable num: " + vnum);
      } else {
        return num2name[vnum];
      }
    };
    Logic2.Solver.prototype.toNumTerm = function(t, noCreate) {
      var self2 = this;
      if (assert) assert(t, Logic2.isTerm);
      if (typeof t === "number") {
        return t;
      } else {
        var not = false;
        if (typeof t == "string") {
          while (t.charAt(0) === "-") {
            t = t.slice(1);
            not = !not;
          }
        }
        var n = self2.getVarNum(t, noCreate);
        if (!n) {
          return 0;
        } else {
          return not ? -n : n;
        }
      }
    };
    Logic2.Solver.prototype.toNameTerm = function(t) {
      var self2 = this;
      if (assert) assert(t, Logic2.isTerm);
      if (typeof t === "string") {
        while (t.slice(0, 2) === "--") {
          t = t.slice(2);
        }
        return t;
      } else {
        var not = false;
        if (t < 0) {
          not = true;
          t = -t;
        }
        t = self2.getVarName(t);
        if (not) {
          t = "-" + t;
        }
        return t;
      }
    };
    Logic2.Solver.prototype._addClause = function(cls, _extraTerms, _useTermOverride) {
      var self2 = this;
      if (assert) assert(cls, Logic2.isClause);
      var extraTerms = null;
      if (_extraTerms) {
        extraTerms = _extraTerms;
        if (assert) assert(extraTerms, isArrayWhere(Logic2.isNumTerm));
      }
      var usedF = false;
      var usedT = false;
      var numRealTerms = cls.terms.length;
      if (extraTerms) {
        cls = cls.append(extraTerms);
      }
      for (var i = 0; i < cls.terms.length; i++) {
        var t = cls.terms[i];
        var v = t < 0 ? -t : t;
        if (v === Logic2.NUM_FALSE) {
          usedF = true;
        } else if (v === Logic2.NUM_TRUE) {
          usedT = true;
        } else if (v < 1 || v >= self2._num2name.length) {
          throw new Error("Bad variable number: " + v);
        } else if (i < numRealTerms) {
          if (_useTermOverride) {
            _useTermOverride(t);
          } else {
            self2._useFormulaTerm(t);
          }
        }
      }
      this._F_used = this._F_used || usedF;
      this._T_used = this._T_used || usedT;
      this.clauses.push(cls);
    };
    Logic2.Solver.prototype._useFormulaTerm = function(t, _addClausesOverride) {
      var self2 = this;
      if (assert) assert(t, Logic2.isNumTerm);
      var v = t < 0 ? -t : t;
      if (!self2._ungeneratedFormulas.hasOwnProperty(v)) {
        return;
      }
      var formula = self2._ungeneratedFormulas[v];
      var info = self2._getFormulaInfo(formula);
      var positive = t > 0;
      var deferredAddClauses = null;
      var addClauses;
      if (!_addClausesOverride) {
        deferredAddClauses = [];
        addClauses = function(clauses2, extraTerms) {
          deferredAddClauses.push({
            clauses: clauses2,
            extraTerms
          });
        };
      } else {
        addClauses = _addClausesOverride;
      }
      if (positive && !info.occursPositively) {
        info.occursPositively = true;
        var clauses = self2._generateFormula(true, formula);
        addClauses(clauses, [-v]);
      } else if (!positive && !info.occursNegatively) {
        info.occursNegatively = true;
        var clauses = self2._generateFormula(false, formula);
        addClauses(clauses, [v]);
      }
      if (info.occursPositively && info.occursNegatively) {
        delete self2._ungeneratedFormulas[v];
      }
      if (!(deferredAddClauses && deferredAddClauses.length)) {
        return;
      }
      var useTerm = function(t2) {
        self2._useFormulaTerm(t2, addClauses);
      };
      while (deferredAddClauses.length) {
        var next = deferredAddClauses.pop();
        self2._addClauses(next.clauses, next.extraTerms, useTerm);
      }
    };
    Logic2.Solver.prototype._addClauses = function(array, _extraTerms, _useTermOverride) {
      if (assert) assert(array, isArrayWhere(Logic2.isClause));
      var self2 = this;
      array.forEach(function(cls) {
        self2._addClause(cls, _extraTerms, _useTermOverride);
      });
    };
    Logic2.Solver.prototype.require = function() {
      this._requireForbidImpl(true, Array.prototype.concat.apply([], arguments));
    };
    Logic2.Solver.prototype.forbid = function() {
      this._requireForbidImpl(false, Array.prototype.concat.apply([], arguments));
    };
    Logic2.Solver.prototype._requireForbidImpl = function(isRequire, formulas) {
      var self2 = this;
      if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
      formulas.forEach((f) => {
        if (f instanceof Logic2.NotFormula) {
          self2._requireForbidImpl(!isRequire, [f.operand]);
        } else if (f instanceof Logic2.Formula) {
          var info = self2._getFormulaInfo(f);
          if (info.varNum !== null) {
            var sign = isRequire ? 1 : -1;
            self2._addClause(new Logic2.Clause(sign * info.varNum));
          } else {
            self2._addClauses(self2._generateFormula(isRequire, f));
          }
          if (isRequire) {
            info.isRequired = true;
          } else {
            info.isForbidden = true;
          }
        } else {
          self2._addClauses(self2._generateFormula(isRequire, f));
        }
      });
    };
    Logic2.Solver.prototype._generateFormula = function(isTrue, formula, _termifier) {
      var self2 = this;
      if (assert) assert(formula, isFormulaOrTerm);
      if (formula instanceof Logic2.NotFormula) {
        return self2._generateFormula(!isTrue, formula.operand);
      } else if (formula instanceof Logic2.Formula) {
        var info = self2._getFormulaInfo(formula);
        if (isTrue && info.isRequired || !isTrue && info.isForbidden) {
          return [];
        } else if (isTrue && info.isForbidden || !isTrue && info.isRequired) {
          return [new Logic2.Clause()];
        } else {
          var ret = formula.generateClauses(
            isTrue,
            _termifier || self2._termifier
          );
          return Array.isArray(ret) ? ret : [ret];
        }
      } else {
        var t = self2.toNumTerm(formula);
        var sign = isTrue ? 1 : -1;
        if (t === sign * Logic2.NUM_TRUE || t === -sign * Logic2.NUM_FALSE) {
          return [];
        } else if (t === sign * Logic2.NUM_FALSE || t === -sign * Logic2.NUM_TRUE) {
          return [new Logic2.Clause()];
        } else {
          return [new Logic2.Clause(sign * t)];
        }
      }
    };
    Logic2.Solver.prototype._clauseData = function() {
      var clauses = this.clauses.map(function(clause) {
        return clause.terms;
      });
      if (!this._T_used) {
        clauses.splice(1, 1);
      }
      if (!this._F_used) {
        clauses.splice(0, 1);
      }
      return clauses;
    };
    Logic2.Solver.prototype._clauseStrings = function() {
      var self2 = this;
      var clauseData = self2._clauseData();
      return clauseData.map(function(clause) {
        return clause.map(function(nterm) {
          var str = self2.toNameTerm(nterm);
          if (/\s/.test(str)) {
            var sign = "";
            if (str.charAt(0) === "-") {
              sign = "-";
              str = str.slice(1);
            }
            str = sign + '"' + str + '"';
          }
          return str;
        }).join(" v ");
      });
    };
    Logic2.Solver.prototype._getFormulaInfo = function(formula, _noCreate) {
      var self2 = this;
      var guid = formula.guid();
      if (!self2._formulaInfo[guid]) {
        if (_noCreate) {
          return null;
        }
        self2._formulaInfo[guid] = new FormulaInfo();
      }
      return self2._formulaInfo[guid];
    };
    Logic2.Solver.prototype._formulaToTerm = function(formula) {
      var self2 = this;
      if (Array.isArray(formula)) {
        if (assert) assert(formula, isArrayWhere(isFormulaOrTerm));
        return formula.map(self2._formulaToTerm.bind(self2));
      } else {
        if (assert) assert(formula, isFormulaOrTerm);
      }
      if (formula instanceof Logic2.NotFormula) {
        return Logic2.not(self2._formulaToTerm(formula.operand));
      } else if (formula instanceof Logic2.Formula) {
        var info = this._getFormulaInfo(formula);
        if (info.isRequired) {
          return Logic2.NUM_TRUE;
        } else if (info.isForbidden) {
          return Logic2.NUM_FALSE;
        } else if (info.varNum === null) {
          var type = formula.type;
          if (!this._nextFormulaNumByType[type]) {
            this._nextFormulaNumByType[type] = 1;
          }
          var numForVarName = this._nextFormulaNumByType[type]++;
          info.varName = "$" + formula.type + numForVarName;
          info.varNum = this.getVarNum(info.varName, false, true);
          this._ungeneratedFormulas[info.varNum] = formula;
        }
        return info.varNum;
      } else {
        return self2.toNumTerm(formula);
      }
    };
    Logic2.or = function() {
      var args = Array.prototype.concat.apply([], arguments);
      if (args.length === 0) {
        return Logic2.FALSE;
      } else if (args.length === 1) {
        if (assert) assert(args[0], isFormulaOrTerm);
        return args[0];
      } else {
        return new Logic2.OrFormula(args);
      }
    };
    Logic2.OrFormula = function(operands) {
      if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
      this.operands = operands;
    };
    Logic2._defineFormula(Logic2.OrFormula, "or", {
      generateClauses: function(isTrue, t) {
        if (isTrue) {
          return t.clause(this.operands);
        } else {
          var result = [];
          this.operands.forEach(function(o) {
            result.push.apply(result, t.generate(false, o));
          });
          return result;
        }
      }
    });
    Logic2.NotFormula = function(operand) {
      if (assert) assert(operand, isFormulaOrTerm);
      this.operand = operand;
    };
    Logic2._defineFormula(Logic2.NotFormula, "not");
    Logic2.and = function() {
      var args = Array.prototype.concat.apply([], arguments);
      if (args.length === 0) {
        return Logic2.TRUE;
      } else if (args.length === 1) {
        if (assert) assert(args[0], isFormulaOrTerm);
        return args[0];
      } else {
        return new Logic2.AndFormula(args);
      }
    };
    Logic2.AndFormula = function(operands) {
      if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
      this.operands = operands;
    };
    Logic2._defineFormula(Logic2.AndFormula, "and", {
      generateClauses: function(isTrue, t) {
        if (isTrue) {
          var result = [];
          this.operands.forEach(function(o) {
            result.push.apply(result, t.generate(true, o));
          });
          return result;
        } else {
          return t.clause(this.operands.map(Logic2.not));
        }
      }
    });
    var group = function(array, N) {
      var ret = [];
      for (var i = 0; i < array.length; i += N) {
        ret.push(array.slice(i, i + N));
      }
      return ret;
    };
    Logic2.xor = function() {
      var args = Array.prototype.concat.apply([], arguments);
      if (args.length === 0) {
        return Logic2.FALSE;
      } else if (args.length === 1) {
        if (assert) assert(args[0], isFormulaOrTerm);
        return args[0];
      } else {
        return new Logic2.XorFormula(args);
      }
    };
    Logic2.XorFormula = function(operands) {
      if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
      this.operands = operands;
    };
    Logic2._defineFormula(Logic2.XorFormula, "xor", {
      generateClauses: function(isTrue, t) {
        var args = this.operands;
        var not = Logic2.not;
        if (args.length > 3) {
          return t.generate(
            isTrue,
            Logic2.xor(
              this.operands.map(group).map(function(group2) {
                return Logic2.xor(group2);
              })
            )
          );
        } else if (isTrue) {
          if (args.length === 0) {
            return t.clause();
          } else if (args.length === 1) {
            return t.clause(args[0]);
          } else if (args.length === 2) {
            var A = args[0], B = args[1];
            return [
              t.clause(A, B),
t.clause(not(A), not(B))
            ];
          } else if (args.length === 3) {
            var A = args[0], B = args[1], C = args[2];
            return [
              t.clause(A, B, C),
t.clause(A, not(B), not(C)),
t.clause(not(A), B, not(C)),
t.clause(not(A), not(B), C)
            ];
          }
        } else {
          if (args.length === 0) {
            return [];
          } else if (args.length === 1) {
            return t.clause(not(args[0]));
          } else if (args.length === 2) {
            var A = args[0], B = args[1];
            return [
              t.clause(A, not(B)),
t.clause(not(A), B)
            ];
          } else if (args.length === 3) {
            var A = args[0], B = args[1], C = args[2];
            return [
              t.clause(not(A), not(B), not(C)),
t.clause(not(A), B, C),
t.clause(A, not(B), C),
t.clause(A, B, not(C))
            ];
          }
        }
      }
    });
    Logic2.atMostOne = function() {
      var args = Array.prototype.concat.apply([], arguments);
      if (args.length <= 1) {
        return Logic2.TRUE;
      } else {
        return new Logic2.AtMostOneFormula(args);
      }
    };
    Logic2.AtMostOneFormula = function(operands) {
      if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
      this.operands = operands;
    };
    Logic2._defineFormula(Logic2.AtMostOneFormula, "atMostOne", {
      generateClauses: function(isTrue, t) {
        var args = this.operands;
        var not = Logic2.not;
        if (args.length <= 1) {
          return [];
        } else if (args.length === 2) {
          return t.generate(isTrue, Logic2.not(Logic2.and(args)));
        } else if (isTrue && args.length === 3) {
          var clauses = [];
          for (var i = 0; i < args.length; i++) {
            for (var j = i + 1; j < args.length; j++) {
              clauses.push(t.clause(not(args[i]), not(args[j])));
            }
          }
          return clauses;
        } else if (!isTrue && args.length === 3) {
          var A = args[0], B = args[1], C = args[2];
          return [t.clause(A, B), t.clause(A, C), t.clause(B, C)];
        } else {
          var groups = group(args, 3);
          var ors = groups.map(function(g) {
            return Logic2.or(g);
          });
          if (groups[groups.length - 1].length < 2) {
            groups.pop();
          }
          var atMostOnes = groups.map(function(g) {
            return Logic2.atMostOne(g);
          });
          return t.generate(isTrue, Logic2.and(Logic2.atMostOne(ors), atMostOnes));
        }
      }
    });
    Logic2.implies = function(A, B) {
      if (assert) assertNumArgs(arguments.length, 2, "Logic.implies");
      return new Logic2.ImpliesFormula(A, B);
    };
    Logic2.ImpliesFormula = function(A, B) {
      if (assert) assert(A, isFormulaOrTerm);
      if (assert) assert(B, isFormulaOrTerm);
      if (assert) assertNumArgs(arguments.length, 2, "Logic.implies");
      this.A = A;
      this.B = B;
    };
    Logic2._defineFormula(Logic2.ImpliesFormula, "implies", {
      generateClauses: function(isTrue, t) {
        return t.generate(isTrue, Logic2.or(Logic2.not(this.A), this.B));
      }
    });
    Logic2.equiv = function(A, B) {
      if (assert) assertNumArgs(arguments.length, 2, "Logic.equiv");
      return new Logic2.EquivFormula(A, B);
    };
    Logic2.EquivFormula = function(A, B) {
      if (assert) assert(A, isFormulaOrTerm);
      if (assert) assert(B, isFormulaOrTerm);
      if (assert) assertNumArgs(arguments.length, 2, "Logic.equiv");
      this.A = A;
      this.B = B;
    };
    Logic2._defineFormula(Logic2.EquivFormula, "equiv", {
      generateClauses: function(isTrue, t) {
        return t.generate(!isTrue, Logic2.xor(this.A, this.B));
      }
    });
    Logic2.exactlyOne = function() {
      var args = Array.prototype.concat.apply([], arguments);
      if (args.length === 0) {
        return Logic2.FALSE;
      } else if (args.length === 1) {
        if (assert) assert(args[0], isFormulaOrTerm);
        return args[0];
      } else {
        return new Logic2.ExactlyOneFormula(args);
      }
    };
    Logic2.ExactlyOneFormula = function(operands) {
      if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
      this.operands = operands;
    };
    Logic2._defineFormula(Logic2.ExactlyOneFormula, "exactlyOne", {
      generateClauses: function(isTrue, t) {
        var args = this.operands;
        if (args.length < 3) {
          return t.generate(isTrue, Logic2.xor(args));
        } else {
          return t.generate(isTrue, Logic2.and(
            Logic2.atMostOne(args),
            Logic2.or(args)
          ));
        }
      }
    });
    Logic2.Bits = function(formulas) {
      if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
      this.bits = formulas;
    };
    Logic2.constantBits = function(wholeNumber) {
      if (assert) assert(wholeNumber, Logic2.isWholeNumber);
      var result = [];
      while (wholeNumber) {
        result.push(wholeNumber & 1 ? Logic2.TRUE : Logic2.FALSE);
        wholeNumber >>>= 1;
      }
      return new Logic2.Bits(result);
    };
    Logic2.variableBits = function(baseName, nbits) {
      if (assert) assert(nbits, Logic2.isWholeNumber);
      var result = [];
      for (var i = 0; i < nbits; i++) {
        result.push(baseName + "$" + i);
      }
      return new Logic2.Bits(result);
    };
    Logic2.lessThanOrEqual = function(bits1, bits2) {
      return new Logic2.LessThanOrEqualFormula(bits1, bits2);
    };
    Logic2.LessThanOrEqualFormula = function(bits1, bits2) {
      if (assert) assert(bits1, Logic2.isBits);
      if (assert) assert(bits2, Logic2.isBits);
      if (assert) assertNumArgs(arguments.length, 2, "Bits comparison function");
      this.bits1 = bits1;
      this.bits2 = bits2;
    };
    var genLTE = function(bits1, bits2, t, notEqual) {
      var ret = [];
      var A = bits1.bits.slice();
      var B = bits2.bits.slice();
      if (notEqual && !bits2.bits.length) {
        return t.clause();
      }
      while (A.length > B.length) {
        var hi = A.pop();
        ret.push(t.clause(Logic2.not(hi)));
      }
      var xors = B.map(function(b, i2) {
        if (i2 < A.length) {
          return Logic2.xor(A[i2], b);
        } else {
          return b;
        }
      });
      for (var i = A.length - 1; i >= 0; i--) {
        ret.push(t.clause(xors.slice(i + 1), Logic2.not(A[i]), B[i]));
      }
      if (notEqual) {
        ret.push.apply(ret, t.generate(true, Logic2.or(xors)));
      }
      return ret;
    };
    Logic2._defineFormula(Logic2.LessThanOrEqualFormula, "lte", {
      generateClauses: function(isTrue, t) {
        if (isTrue) {
          return genLTE(this.bits1, this.bits2, t, false);
        } else {
          return genLTE(this.bits2, this.bits1, t, true);
        }
      }
    });
    Logic2.lessThan = function(bits1, bits2) {
      return new Logic2.LessThanFormula(bits1, bits2);
    };
    Logic2.LessThanFormula = function(bits1, bits2) {
      if (assert) assert(bits1, Logic2.isBits);
      if (assert) assert(bits2, Logic2.isBits);
      if (assert) assertNumArgs(arguments.length, 2, "Bits comparison function");
      this.bits1 = bits1;
      this.bits2 = bits2;
    };
    Logic2._defineFormula(Logic2.LessThanFormula, "lt", {
      generateClauses: function(isTrue, t) {
        if (isTrue) {
          return genLTE(this.bits1, this.bits2, t, true);
        } else {
          return genLTE(this.bits2, this.bits1, t, false);
        }
      }
    });
    Logic2.greaterThan = function(bits1, bits2) {
      return Logic2.lessThan(bits2, bits1);
    };
    Logic2.greaterThanOrEqual = function(bits1, bits2) {
      return Logic2.lessThanOrEqual(bits2, bits1);
    };
    Logic2.equalBits = function(bits1, bits2) {
      return new Logic2.EqualBitsFormula(bits1, bits2);
    };
    Logic2.EqualBitsFormula = function(bits1, bits2) {
      if (assert) assert(bits1, Logic2.isBits);
      if (assert) assert(bits2, Logic2.isBits);
      if (assert) assertNumArgs(arguments.length, 2, "Logic.equalBits");
      this.bits1 = bits1;
      this.bits2 = bits2;
    };
    Logic2._defineFormula(Logic2.EqualBitsFormula, "equalBits", {
      generateClauses: function(isTrue, t) {
        var A = this.bits1.bits;
        var B = this.bits2.bits;
        var nbits = Math.max(A.length, B.length);
        var facts = [];
        for (var i = 0; i < nbits; i++) {
          if (i >= A.length) {
            facts.push(Logic2.not(B[i]));
          } else if (i >= B.length) {
            facts.push(Logic2.not(A[i]));
          } else {
            facts.push(Logic2.equiv(A[i], B[i]));
          }
        }
        return t.generate(isTrue, Logic2.and(facts));
      }
    });
    Logic2.HalfAdderSum = function(formula1, formula2) {
      if (assert) assert(formula1, isFormulaOrTerm);
      if (assert) assert(formula2, isFormulaOrTerm);
      if (assert) assertNumArgs(arguments.length, 2, "Logic.HalfAdderSum");
      this.a = formula1;
      this.b = formula2;
    };
    Logic2._defineFormula(Logic2.HalfAdderSum, "hsum", {
      generateClauses: function(isTrue, t) {
        return t.generate(isTrue, Logic2.xor(this.a, this.b));
      }
    });
    Logic2.HalfAdderCarry = function(formula1, formula2) {
      if (assert) assert(formula1, isFormulaOrTerm);
      if (assert) assert(formula2, isFormulaOrTerm);
      if (assert) assertNumArgs(arguments.length, 2, "Logic.HalfAdderCarry");
      this.a = formula1;
      this.b = formula2;
    };
    Logic2._defineFormula(Logic2.HalfAdderCarry, "hcarry", {
      generateClauses: function(isTrue, t) {
        return t.generate(isTrue, Logic2.and(this.a, this.b));
      }
    });
    Logic2.FullAdderSum = function(formula1, formula2, formula3) {
      if (assert) assert(formula1, isFormulaOrTerm);
      if (assert) assert(formula2, isFormulaOrTerm);
      if (assert) assert(formula3, isFormulaOrTerm);
      if (assert) assertNumArgs(arguments.length, 3, "Logic.FullAdderSum");
      this.a = formula1;
      this.b = formula2;
      this.c = formula3;
    };
    Logic2._defineFormula(Logic2.FullAdderSum, "fsum", {
      generateClauses: function(isTrue, t) {
        return t.generate(isTrue, Logic2.xor(this.a, this.b, this.c));
      }
    });
    Logic2.FullAdderCarry = function(formula1, formula2, formula3) {
      if (assert) assert(formula1, isFormulaOrTerm);
      if (assert) assert(formula2, isFormulaOrTerm);
      if (assert) assert(formula3, isFormulaOrTerm);
      if (assert) assertNumArgs(arguments.length, 3, "Logic.FullAdderCarry");
      this.a = formula1;
      this.b = formula2;
      this.c = formula3;
    };
    Logic2._defineFormula(Logic2.FullAdderCarry, "fcarry", {
      generateClauses: function(isTrue, t) {
        return t.generate(
          !isTrue,
          Logic2.atMostOne(this.a, this.b, this.c)
        );
      }
    });
    function clone(obj) {
      if (Array.isArray(obj)) {
        return obj.slice(0);
      }
      if (obj instanceof Object) {
        return Object.assign({}, obj);
      }
    }
    var binaryWeightedSum = function(varsByWeight) {
      if (assert) assert(
        varsByWeight,
        isArrayWhere(isArrayWhere(isFormulaOrTerm))
      );
      var buckets = varsByWeight.map(clone);
      var lowestWeight = 0;
      var output = [];
      while (lowestWeight < buckets.length) {
        var bucket = buckets[lowestWeight];
        if (!bucket.length) {
          output.push(Logic2.FALSE);
          lowestWeight++;
        } else if (bucket.length === 1) {
          output.push(bucket[0]);
          lowestWeight++;
        } else if (bucket.length === 2) {
          var sum = new Logic2.HalfAdderSum(bucket[0], bucket[1]);
          var carry = new Logic2.HalfAdderCarry(bucket[0], bucket[1]);
          bucket.length = 0;
          bucket.push(sum);
          pushToNth(buckets, lowestWeight + 1, carry);
        } else {
          var c = bucket.pop();
          var b = bucket.pop();
          var a = bucket.pop();
          var sum = new Logic2.FullAdderSum(a, b, c);
          var carry = new Logic2.FullAdderCarry(a, b, c);
          bucket.push(sum);
          pushToNth(buckets, lowestWeight + 1, carry);
        }
      }
      return output;
    };
    var pushToNth = function(arrayOfArrays, n, newItem) {
      while (n >= arrayOfArrays.length) {
        arrayOfArrays.push([]);
      }
      arrayOfArrays[n].push(newItem);
    };
    var checkWeightedSumArgs = function(formulas, weights) {
      if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
      if (typeof weights === "number") {
        if (assert) assert(weights, Logic2.isWholeNumber);
      } else {
        if (assert) assert(weights, isArrayWhere(Logic2.isWholeNumber));
        if (formulas.length !== weights.length) {
          throw new Error("Formula array and weight array must be same length; they are " + formulas.length + " and " + weights.length);
        }
      }
    };
    Logic2.weightedSum = function(formulas, weights) {
      checkWeightedSumArgs(formulas, weights);
      if (formulas.length === 0) {
        return new Logic2.Bits([]);
      }
      if (typeof weights === "number") {
        weights = formulas.map(function() {
          return weights;
        });
      }
      var binaryWeighted = [];
      formulas.forEach(function(f, i) {
        var w = weights[i];
        var whichBit = 0;
        while (w) {
          if (w & 1) {
            pushToNth(binaryWeighted, whichBit, f);
          }
          w >>>= 1;
          whichBit++;
        }
      });
      return new Logic2.Bits(binaryWeightedSum(binaryWeighted));
    };
    Logic2.sum = function() {
      var things = Array.prototype.concat.apply([], arguments);
      if (assert) assert(things, isArrayWhere(isFormulaOrTermOrBits));
      var binaryWeighted = [];
      things.forEach(function(x) {
        if (x instanceof Logic2.Bits) {
          x.bits.forEach(function(b, i) {
            pushToNth(binaryWeighted, i, b);
          });
        } else {
          pushToNth(binaryWeighted, 0, x);
        }
      });
      return new Logic2.Bits(binaryWeightedSum(binaryWeighted));
    };
    let prodSingle = function(xs, ys) {
      const bs = [];
      const ws = [];
      xs.bits.forEach(
        (x, i) => ys.bits.forEach(
          (y, j) => {
            bs.push(Logic2.and(x, y));
            ws.push(Math.pow(2, i + j));
          }
        )
      );
      return Logic2.weightedSum(bs, ws);
    };
    Logic2.product = function() {
      var things = Array.prototype.concat.apply([], arguments);
      if (assert) assert(things, isArrayWhere(isFormulaOrTermOrBits));
      if (things.length === 0) {
        return new Logic2.Bits([]);
      }
      var result = things[0];
      for (var i = 1; i < things.length; i++) {
        result = prodSingle(result, things[i]);
      }
      return result;
    };
    Logic2.subtract = function(minuend, subtrahend) {
      var things = Array.prototype.concat.apply([], [minuend, subtrahend]);
      if (assert) assert(things, isArrayWhere(isFormulaOrTermOrBits));
      var binaryWeightedMinuend = [];
      if (minuend instanceof Logic2.Bits) {
        minuend.bits.forEach(function(b2, i2) {
          pushToNth(binaryWeightedMinuend, i2, b2);
        });
      } else {
        pushToNth(binaryWeightedMinuend, 0, minuend);
      }
      var binaryWeightedSubtrahend = [];
      if (subtrahend instanceof Logic2.Bits) {
        subtrahend.bits.forEach(function(b2, i2) {
          pushToNth(binaryWeightedSubtrahend, i2, b2);
        });
      } else {
        pushToNth(binaryWeightedSubtrahend, 0, subtrahend);
      }
      if (binaryWeightedMinuend.length < binaryWeightedSubtrahend.length) {
        return new Logic2.Bits(Array(binaryWeightedSubtrahend.length).fill(Logic2.FALSE));
      }
      var output = [];
      var borrow = Logic2.FALSE;
      for (var i = 0; i < binaryWeightedMinuend.length; i++) {
        var a = binaryWeightedMinuend[i] || Logic2.FALSE;
        var b = binaryWeightedSubtrahend[i] || Logic2.FALSE;
        var diff = Logic2.xor(Logic2.xor(a, b), borrow);
        var newBorrow = Logic2.or(
          Logic2.and(Logic2.not(Logic2.or(a, Logic2.FALSE)), b),
          Logic2.and(Logic2.not(Logic2.xor(a, b)), borrow)
        );
        output.push(diff);
        borrow = newBorrow;
      }
      return new Logic2.Bits(output);
    };
    Logic2.Solver.prototype.solve = function(_assumpVar) {
      var self2 = this;
      if (_assumpVar !== void 0) {
        if (!(_assumpVar >= 1)) {
          throw new Error("_assumpVar must be a variable number");
        }
      }
      if (self2._unsat) {
        return null;
      }
      while (self2._numClausesAddedToMiniSat < self2.clauses.length) {
        var i = self2._numClausesAddedToMiniSat;
        var terms = self2.clauses[i].terms;
        if (assert) assert(terms, isArrayWhere(Logic2.isNumTerm));
        var stillSat = self2._minisat.addClause(terms);
        self2._numClausesAddedToMiniSat++;
        if (!stillSat) {
          self2._unsat = true;
          return null;
        }
      }
      if (assert) assert(this._num2name.length - 1, Logic2.isWholeNumber);
      self2._minisat.ensureVar(this._num2name.length - 1);
      var stillSat = _assumpVar ? self2._minisat.solveAssuming(_assumpVar) : self2._minisat.solve();
      if (!stillSat) {
        if (!_assumpVar) {
          self2._unsat = true;
        }
        return null;
      }
      return new Logic2.Solution(self2, self2._minisat.getSolution());
    };
    Logic2.Solver.prototype.solveAssuming = function(formula) {
      if (assert) assert(formula, isFormulaOrTerm);
      var assump = new Logic2.Assumption(formula);
      var assumpVar = this._formulaToTerm(assump);
      if (!(typeof assumpVar === "number" && assumpVar > 0)) {
        throw new Error("Assertion failure: not a positive numeric term");
      }
      this._useFormulaTerm(assumpVar);
      var result = this.solve(assumpVar);
      this._minisat.retireVar(assumpVar);
      return result;
    };
    Logic2.Assumption = function(formula) {
      if (assert) assert(formula, isFormulaOrTerm);
      this.formula = formula;
    };
    Logic2._defineFormula(Logic2.Assumption, "assump", {
      generateClauses: function(isTrue, t) {
        if (isTrue) {
          return t.clause(this.formula);
        } else {
          return t.clause(Logic2.not(this.formula));
        }
      }
    });
    Logic2.Solution = function(_solver, _assignment) {
      var self2 = this;
      self2._solver = _solver;
      self2._assignment = _assignment;
      self2._ungeneratedFormulas = clone(_solver._ungeneratedFormulas);
      self2._formulaValueCache = {};
      self2._termifier = new Logic2.Termifier(self2._solver);
      self2._termifier.term = function(formula) {
        return self2.evaluate(formula) ? Logic2.NUM_TRUE : Logic2.NUM_FALSE;
      };
      self2._ignoreUnknownVariables = false;
    };
    Logic2.Solution.prototype.ignoreUnknownVariables = function() {
      this._ignoreUnknownVariables = true;
    };
    Logic2.Solution.prototype.getMap = function() {
      var solver = this._solver;
      var assignment = this._assignment;
      var result = {};
      for (var i = 1; i < assignment.length; i++) {
        var name = solver.getVarName(i);
        if (name && name.charAt(0) !== "$") {
          result[name] = assignment[i];
        }
      }
      return result;
    };
    Logic2.Solution.prototype.getTrueVars = function() {
      var solver = this._solver;
      var assignment = this._assignment;
      var result = [];
      for (var i = 1; i < assignment.length; i++) {
        if (assignment[i]) {
          var name = solver.getVarName(i);
          if (name && name.charAt(0) !== "$") {
            result.push(name);
          }
        }
      }
      result.sort();
      return result;
    };
    Logic2.Solution.prototype.getFormula = function() {
      var solver = this._solver;
      var assignment = this._assignment;
      var terms = [];
      for (var i = 1; i < assignment.length; i++) {
        var name = solver.getVarName(i);
        if (name && name.charAt(0) !== "$") {
          terms.push(assignment[i] ? i : -i);
        }
      }
      return Logic2.and(terms);
    };
    Logic2.Solution.prototype.evaluate = function(formulaOrBits) {
      var self2 = this;
      if (assert) assert(formulaOrBits, isFormulaOrTermOrBits);
      if (formulaOrBits instanceof Logic2.Bits) {
        var ret = 0;
        formulaOrBits.bits.forEach(function(f, i) {
          if (self2.evaluate(f)) {
            ret += 1 << i;
          }
        });
        return ret;
      }
      var solver = self2._solver;
      var ignoreUnknownVariables = self2._ignoreUnknownVariables;
      var assignment = self2._assignment;
      var formula = formulaOrBits;
      if (formula instanceof Logic2.NotFormula) {
        return !self2.evaluate(formula.operand);
      } else if (formula instanceof Logic2.Formula) {
        var cachedResult = self2._formulaValueCache[formula.guid()];
        if (typeof cachedResult === "boolean") {
          return cachedResult;
        } else {
          var value;
          var info = solver._getFormulaInfo(formula, true);
          if (info && info.varNum && info.varNum < assignment.length && !self2._ungeneratedFormulas.hasOwnProperty(info.varNum)) {
            value = assignment[info.varNum];
          } else {
            var clauses = solver._generateFormula(true, formula, self2._termifier);
            var value = clauses.every(function(cls) {
              return cls.terms.some((t) => self2.evaluate(t));
            });
          }
          self2._formulaValueCache[formula.guid()] = value;
          return value;
        }
      } else {
        var numTerm = solver.toNumTerm(formula, true);
        if (!numTerm) {
          if (ignoreUnknownVariables) {
            return false;
          } else {
            var vname = String(formula).replace(/^-*/, "");
            throw new Error("No such variable: " + vname);
          }
        }
        var v = numTerm;
        var isNot = false;
        if (numTerm < 0) {
          v = -v;
          isNot = true;
        }
        if (v < 1 || v >= assignment.length) {
          var vname = v;
          if (v >= 1 && v < solver._num2name.length) {
            vname = solver._num2name[v];
          }
          if (ignoreUnknownVariables) {
            return false;
          } else {
            throw new Error("Variable not part of solution: " + vname);
          }
        }
        var ret = assignment[v];
        if (isNot) {
          ret = !ret;
        }
        return ret;
      }
    };
    Logic2.Solution.prototype.getWeightedSum = function(formulas, weights) {
      checkWeightedSumArgs(formulas, weights);
      var total = 0;
      if (typeof weights === "number") {
        for (var i = 0; i < formulas.length; i++) {
          total += weights * (this.evaluate(formulas[i]) ? 1 : 0);
        }
      } else {
        for (var i = 0; i < formulas.length; i++) {
          total += weights[i] * (this.evaluate(formulas[i]) ? 1 : 0);
        }
      }
      return total;
    };
    var getNonZeroWeightedTerms = function(costTerms, costWeights) {
      if (typeof costWeights === "number") {
        return costWeights ? costTerms : [];
      } else {
        var terms = [];
        for (var i = 0; i < costTerms.length; i++) {
          if (costWeights[i]) {
            terms.push(costTerms[i]);
          }
        }
        return terms;
      }
    };
    var minMaxWS = function(solver, solution, costTerms, costWeights, options, isMin) {
      var curSolution = solution;
      var curCost = curSolution.getWeightedSum(costTerms, costWeights);
      var iniCost = curCost;
      var optFormula = options && options.formula;
      var weightedSum = optFormula || Logic2.weightedSum(costTerms, costWeights);
      var progress = options && options.progress;
      var strategy = options && options.strategy;
      var nonZeroTerms = null;
      var chosenRatio = options && options.chosenRatio || 0;
      var chosenGoal = options && options.chosenGoal || 0;
      chosenGoal = Math.max(chosenGoal, chosenRatio * iniCost, 0);
      if (isMin && curCost > 0 && chosenRatio == 0) {
        if (progress) {
          progress("trying", 0);
        }
        var zeroSolution = null;
        nonZeroTerms = getNonZeroWeightedTerms(costTerms, costWeights);
        var zeroSolution = solver.solveAssuming(Logic2.not(Logic2.or(nonZeroTerms)));
        if (zeroSolution) {
          curSolution = zeroSolution;
          curCost = 0;
        }
      }
      if (isMin && strategy === "bottom-up") {
        for (var trialCost = 1; trialCost < curCost; trialCost++) {
          if (progress) {
            progress("trying", trialCost);
          }
          var costIsTrialCost = Logic2.equalBits(
            weightedSum,
            Logic2.constantBits(trialCost)
          );
          var newSolution = solver.solveAssuming(costIsTrialCost);
          if (newSolution) {
            curSolution = newSolution;
            curCost = trialCost;
            break;
          }
        }
      } else if (strategy && strategy !== "default") {
        throw new Error("Bad strategy: " + strategy);
      } else {
        strategy = "default";
      }
      if (strategy === "default") {
        while (isMin ? curCost > chosenGoal : true) {
          if (progress) {
            progress("improving", curCost);
          }
          var improvement = (isMin ? Logic2.lessThan : Logic2.greaterThan)(
            weightedSum,
            Logic2.constantBits(curCost)
          );
          var newSolution = solver.solveAssuming(improvement);
          if (!newSolution) {
            break;
          }
          solver.require(improvement);
          curSolution = newSolution;
          curCost = curSolution.getWeightedSum(costTerms, costWeights);
        }
      }
      if (isMin && curCost === 0) {
        if (!nonZeroTerms) {
          nonZeroTerms = getNonZeroWeightedTerms(costTerms, costWeights);
        }
        solver.forbid(nonZeroTerms);
      } else {
        solver.require(Logic2.equalBits(weightedSum, Logic2.constantBits(curCost)));
      }
      if (progress) {
        progress("finished", curCost);
      }
      return curSolution;
    };
    Logic2.Solver.prototype.minimizeWeightedSum = function(solution, costTerms, costWeights, options) {
      return minMaxWS(this, solution, costTerms, costWeights, options, true);
    };
    Logic2.Solver.prototype.maximizeWeightedSum = function(solution, costTerms, costWeights, options) {
      return minMaxWS(this, solution, costTerms, costWeights, options, false);
    };
    logic = Logic2;
    return logic;
  }
  var logicExports = requireLogic();
  const Logic = getDefaultExportFromCjs(logicExports);
  Logic.Solver = class Solver extends Logic.Solver {
    _MiniSatConstructor = MiniSat;
    initialize() {
      return super.initialize.bind(this)();
    }
  };
  class MineSweepSolver {
    width;
    height;
    cells;
    constructor(game) {
      this.width = game.width;
      this.height = game.height;
      this.cells = game.cells.slice();
    }
    solveAB() {
      const result = Array.from({ length: this.width * this.height }, () => -1);
      const length = this.width * this.height;
      for (let i = 0; i < length; ++i) {
        if (this.cells[i] > 0) {
          const unknownPos = [];
          for (let next of this.adjancent8(i)) {
            if (this.cells[next] === -1) {
              unknownPos.push(next);
            }
          }
          if (unknownPos.length === this.cells[i]) {
            for (const next of unknownPos) {
              result[next] = 1;
            }
          }
        }
      }
      for (let i = 0; i < length; ++i) {
        if (this.cells[i] > 0) {
          const unknownPos = [];
          let flags = 0;
          for (let next of this.adjancent8(i)) {
            if (result[next] === 1) {
              flags++;
            } else if (this.cells[next] === -1) {
              unknownPos.push(next);
            }
          }
          if (flags === this.cells[i]) {
            for (let next of unknownPos) {
              result[next] = 0;
            }
          }
        }
      }
      return result;
    }
    computeNodeGroups() {
      const ret = [];
      const length = this.width * this.height;
      const processed = Object.create(null);
      for (let i = 0; i < length; ++i) {
        if (processed[i]) continue;
        if (this.cells[i] <= 0) continue;
        const g = new NodeGroup();
        ret.push(g);
        const start = new Node(i, this.cells[i]);
        const stack = [start];
        while (stack.length > 0) {
          const n = stack.pop();
          if (processed[n.pos]) continue;
          processed[n.pos] = n;
          if (n.isRevealed) {
            if (g.revealedNodes.indexOf(n) !== -1) throw new Error("assert error");
            g.revealedNodes.push(n);
            for (let next of this.adjancent8(n.pos)) {
              if (this.cells[next] === -1) {
                let n2;
                if (processed[next]) {
                  n2 = processed[next];
                } else {
                  n2 = new Node(next, this.cells[next]);
                  stack.push(n2);
                }
                n.adjacentNodes.push(n2);
              }
            }
          } else {
            if (g.unknownNodes.indexOf(n) !== -1) throw new Error("assert error");
            g.unknownNodes.push(n);
            for (let next of this.adjancent8(n.pos)) {
              if (this.cells[next] > 0) {
                let n2;
                if (processed[next]) {
                  n2 = processed[next];
                } else {
                  n2 = new Node(next, this.cells[next]);
                  stack.push(n2);
                }
                n.adjacentNodes.push(n2);
              }
            }
          }
        }
      }
      return ret;
    }
    computeRulesFromGroup(g) {
      const rules = [];
      const C = [];
      for (let i = 0; i <= 8; ++i) {
        C[i] = Logic.constantBits(i);
      }
      for (let i = 0; i < g.revealedNodes.length; ++i) {
        const n = g.revealedNodes[i];
        if (!(n.adjacentNodes.length >= n.value))
          throw new Error(`assert failed.node adjacent nodes:${n.adjacentNodes.length}, node value:${n.value}`);
        if (!(n.value >= 1 && n.value <= 8))
          throw new Error("assert failed.");
        rules.push(Logic.equalBits(Logic.sum(...n.adjacentNodes.map((x) => x.name)), C[n.value]));
      }
      return rules;
    }
    async solve() {
      const length = this.width * this.height;
      const result = Array.from({ length }, () => -1);
      const groups = this.computeNodeGroups();
      for (const g of groups) {
        const solver = new Logic.Solver();
        await solver.initialize();
        solver.require(...this.computeRulesFromGroup(g));
        for (const node of g.unknownNodes) {
          if (result[node.pos] !== -1) continue;
          if (solver.solveAssuming(node.name) == null) {
            result[node.pos] = 0;
          } else if (solver.solveAssuming("-" + node.name) == null) {
            result[node.pos] = 1;
          }
        }
      }
      return result;
    }
    *adjancent8(pos) {
      const { width, height } = this;
      var x = pos % width;
      var y = pos / width | 0;
      if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
        yield pos - width - 1;
        yield pos - width;
        yield pos - width + 1;
        yield pos - 1;
        yield pos + 1;
        yield pos + width - 1;
        yield pos + width;
        yield pos + width + 1;
      } else {
        if (x > 0) {
          yield y * width + x - 1;
          if (y > 0)
            yield (y - 1) * width + x - 1;
          if (y < height - 1)
            yield (y + 1) * width + x - 1;
        }
        if (x < width - 1) {
          yield y * width + x + 1;
          if (y > 0)
            yield (y - 1) * width + x + 1;
          if (y < height - 1)
            yield (y + 1) * width + x + 1;
        }
        if (y > 0)
          yield (y - 1) * width + x;
        if (y < height - 1)
          yield (y + 1) * width + x;
      }
    }
  }
  class Node {
    name;
    pos;
    value;
adjacentNodes = [];
    constructor(pos, value) {
      this.pos = pos;
      this.value = value;
      this.name = Node.makeNodeName(pos);
    }
    get isRevealed() {
      return this.value >= 0;
    }
    static makeNodeName(pos) {
      return `Node` + pos;
    }
  }
  class NodeGroup {
    unknownNodes = [];
    revealedNodes = [];
  }
  function injectMop(onClickSolve) {
    if (location.hostname.toLowerCase() !== "mop.com") return false;
    const main = document.querySelector(".main-content");
    if (main) {
      main.style.flexDirection = "column";
      const div = document.createElement("div");
      div.innerHTML = "<button>solve</button>";
      main.prepend(div);
      const button = div.querySelector("button");
      button.addEventListener("click", () => onClickSolve());
    }
    return false;
  }
  function getGame$1() {
    const board = document.getElementById("board");
    if (!board) return null;
    const parseRepeat = (s) => {
      if (!s) return 0;
      const m = s.match(/repeat\(([0-9]+),.*\)/);
      if (m) {
        const i = parseInt(m[1]);
        if (i > 0) return i;
      }
      return 0;
    };
    const width = parseRepeat(board.style.gridTemplateColumns);
    const height = parseRepeat(board.style.gridTemplateRows);
    const cells = Array.from(board.querySelectorAll(".cell"));
    if (!(cells.length === width * height)) {
      console.warn(`not find board, cells.length=${cells.length}, width=${width}, height=${height}`);
      return null;
    }
    const result = Array.from({ length: width * height }, () => -1);
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (cell.classList.contains("revealed")) {
        let text = cell.innerText.trim();
        if (text === "") result[i] = 0;
        else result[i] = parseInt(text);
        if (!(result[i] >= 0 && result[i] <= 8)) {
          console.warn(`invalid cell value, cell=${cell.innerHTML}, value=${result[i]}`);
          return null;
        }
      }
    }
    return { width, height, cells: result };
  }
  function renderUI$1(data) {
    const board = document.getElementById("board");
    if (!board) return;
    const cells = Array.from(board.querySelectorAll(".cell"));
    const overlay = new Overlay$1(board);
    for (let i = 0; i < cells.length; i++) {
      if (data[i] === 0 || data[i] === 1) {
        const color = data[i] === 0 ? "green" : "red";
        overlay.setDot(i, color);
      }
    }
  }
  let Overlay$1 = class Overlay {
    cells;
    constructor(board) {
      this.cells = [];
      const p = board.parentElement;
      p.style.position = "relative";
      const oldoverlay = p.querySelector("._overlay");
      oldoverlay?.remove();
      const length = board.querySelectorAll(".cell").length;
      const overlay = document.createElement("div");
      overlay.className = "_overlay";
      overlay.style = `position:absolute;border:3px solid rgba(0,0,0,0);left:${board.offsetLeft}px;top:${board.offsetTop}px;box-sizing: border-box;gap:1px;display:grid;grid-template-columns:${board.style.gridTemplateColumns};grid-template-rows:${board.style.gridTemplateRows};pointer-events:none;`;
      for (let i = 0; i < length; ++i) {
        let cc = document.createElement("div");
        cc.style = `width:20px;height:20px;position:relative`;
        overlay.appendChild(cc);
        this.cells.push(cc);
      }
      p.appendChild(overlay);
    }
    clear() {
      this.cells.forEach((c) => c.innerHTML = "");
    }
    setDot(pos, color) {
      const style = `position:absolute;width:0px;height:0px;left:1px;top:1px;border-radius:50%;border:2px solid ${color}`;
      const div = document.createElement("div");
      div.className = "_overlay_dot";
      div.style = style;
      this.cells[pos].querySelector("._overlay_dot")?.remove();
      this.cells[pos].appendChild(div);
    }
  };
  function injectLiWu(onClickSolve, onClickSolve2) {
    if (location.hostname.toLowerCase() !== "www.253874.net") return false;
    const tag = document.querySelector(".game-info");
    if (!tag) return false;
    const div = document.createElement("div");
    div.innerHTML = '<button class="btn-solve">solve</button><button class="btn-solve-reveal">solve&reveal</button>';
    tag.insertAdjacentElement("afterend", div);
    div.querySelector(".btn-solve")?.addEventListener("click", () => {
      onClickSolve();
    });
    div.querySelector(".btn-solve-reveal")?.addEventListener("click", () => {
      onClickSolve2();
    });
    return true;
  }
  function getGame() {
    const width = 24;
    const height = 18;
    const cells = Array.from(document.querySelectorAll("#game-board .cell"));
    if (cells.length !== width * height) {
      console.warn(`get game null, cells.length=${cells.length}, should be ${width * height}`);
      return null;
    }
    const data = Array.from({ length: width * height }, () => -1);
    for (let i = 0; i < width * height; ++i) {
      if (cells[i].classList.contains("revealed")) {
        const text = cells[i].textContent.trim();
        let v;
        if (text === "")
          v = 0;
        else
          v = parseInt(text);
        if (v >= 0 && v <= 8)
          data[i] = v;
        else
          return null;
      }
    }
    return { width, height, cells: data };
  }
  function renderUI(data) {
    const board = document.getElementById("game-board");
    if (!board) return;
    const overlay = new Overlay2(board);
    for (let i = 0; i < overlay.cells.length; i++) {
      if (data[i] === 0 || data[i] === 1) {
        const color = data[i] === 0 ? "green" : "red";
        overlay.setDot(i, color);
      }
    }
  }
  class Overlay2 {
    cells = [];
    constructor(board) {
      const parent = board.parentElement;
      const oldoverlay = parent.querySelector("._overlay");
      if (oldoverlay) oldoverlay.remove();
      parent.style.position = "relative";
      const overlay = document.createElement("div");
      overlay.className = "_overlay";
      overlay.style = `position:absolute;left:${board.offsetLeft}px;top:${board.offsetTop}px;display:grid;grid-template-columns:repeat(24,30px);grid-template-rows:repeat(18,30px);border: 2px solid rgba(0,0,0,0);pointer-events:none;`;
      for (let i = 0; i < 24 * 18; ++i) {
        const cell = document.createElement("div");
        cell.style = `width:30px;height:30px;position:relative;`;
        overlay.appendChild(cell);
        this.cells.push(cell);
      }
      parent.appendChild(overlay);
    }
    clear() {
      this.cells.forEach((c) => c.innerHTML = "");
    }
    setDot(pos, color) {
      const style = `position:absolute;width:0px;height:0px;left:1px;top:1px;border-radius:50%;border:2px solid ${color}`;
      const div = document.createElement("div");
      div.className = "_overlay_dot";
      div.style = style;
      this.cells[pos].querySelector("._overlay_dot")?.remove();
      this.cells[pos].appendChild(div);
    }
  }
  injectMop(async () => {
    const game = getGame$1();
    if (!game) {
      console.warn("not find game");
      return;
    }
    console.log("game=", game);
    const solver = new MineSweepSolver(game);
    renderUI$1(await solver.solve());
  });
  injectLiWu(async () => {
    const game = getGame();
    if (!game) {
      console.warn("not find game");
      return;
    }
    console.log("game=", game);
    const solver = new MineSweepSolver(game);
    renderUI(await solver.solve());
  }, async () => {
    const game = getGame();
    if (!game) {
      console.warn("not find game");
      return;
    }
    console.log("game=", game);
    const solver = new MineSweepSolver(game);
    const solveResult = await solver.solve();
    renderUI(solveResult);
    const MAX_CLICK_COUNT = 10;
    let solveCount = 0;
    const cells = Array.from(document.querySelectorAll("#game-board .cell"));
    if (cells.length !== solveResult.length) {
      console.error(`error,cells.length !== solveResult.length,cells.length =${cells.length}, solveResult.length =${solveResult.length}`);
    }
    for (let i = 0; i < solveResult.length; ++i) {
      if (solveResult[i] === 0) {
        ++solveCount;
        console.info("click element ", cells[i].getAttribute("data-row"), cells[i].getAttribute("data-col"));
        cells[i].click();
        if (solveCount >= MAX_CLICK_COUNT) break;
      }
    }
  });
  const __viteBrowserExternal = Object.freeze( Object.defineProperty({
    __proto__: null
  }, Symbol.toStringTag, { value: "Module" }));

})();