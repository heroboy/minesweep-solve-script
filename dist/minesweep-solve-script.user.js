// ==UserScript==
// @name       minesweep-solve-script
// @namespace  npm/vite-plugin-monkey
// @version    0.0.0
// @icon       https://vitejs.dev/logo.svg
// @match      https://mop.com/*
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
        return new URL("data:application/wasm;base64,AGFzbQEAAAABwAIwYAF/AX9gA39/fwF/YAJ/fwF/YAF/AGACf38AYAABf2ADf39/AGAAAGAEf39/fwBgBH9/f38Bf2AFf39/f38AYAV/fn5+fgBgBn9/f39/fwBgBX9/f39/AX9gA39+fwF+YAF8AXxgBn9/f39/fwF/YAR/fn5/AGABfwF8YAF+AX9gAnx/AXxgBn98f39/fwF/YAJ+fwF/YAR+fn5+AX9gCH9/f39/f39/AX9gAn9+AX9gAn98AXxgAnx8AXxgAXwBf2ACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGACf34AYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf38BfGAEf39/fgF+YAd/f39/f39/AX9gA35/fwF/YAF8AX5gAn98AGACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwL+Ag8DZW52C19fY3hhX3Rocm93AAYDZW52BGV4aXQAAxZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCXByb2NfZXhpdAADFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UAAANlbnYVX2Vtc2NyaXB0ZW5fbWVtY3B5X2pzAAYDZW52EF9fc3lzY2FsbF9vcGVuYXQACQNlbnYRX19zeXNjYWxsX2ZjbnRsNjQAAQNlbnYPX19zeXNjYWxsX2lvY3RsAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfcmVhZAAJA2Vudg5lbXNjcmlwdGVuX2VycgADA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAADZW52CV9hYm9ydF9qcwAHA2Vudg1fX2Fzc2VydF9mYWlsAAgWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQdmZF9zZWVrAA0D8wLxAgcHAwAEBQMFBQADBwMCDQMAAwIAAwMCBAMDAgQAAwIEAAAEAQQAAwEEBgQGAQIEAwIEAgIEAwICBAQBDQEEBgQEBgEDAwIEBwYDBgQDAAADAQQCBAAEBgYEAgQACAEGAwYEAwQAAgAECgYGBAMHAAIBAgYBAQAAAAAAAQEBARgAAAADAgMCAgICAgIAGQIABAACCQIBABADAwgDAwgEBgYBBAEFAwMAAAEBAAMDAAAADgEBAAICAQEAAgICAgAAAwEJBQICCQICAgIDAw4BBQcAAQ8aDxISDxscExMPHR4fIAICBQUHAAAABQUHAgABBAIDAQIJAA4CAgICAAAAACEAFAsRIgsjCAAMJCUIJicAAQACFA0oBgAIKRYWCgEVBCoBAQkBAAECAQABAwICBAUACxEXFwsrLAQEBQURCwsLLQAABwADBAcHBAAFAAcAAwMDAwEAAQkEEA0QCAgICggKCgwMAAMFBwUFBQMABS4NLwQFAXABNjYFBwEBgQaAgAIGGAR/AUGAgIAQC38BQQALfwFBAAt/AUEACwe8AxgGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMADw9jcmVhdGVUaGVTb2x2ZXIAEAllbnN1cmVWYXIAEQlhZGRDbGF1c2UAEgVzb2x2ZQAUC2dldFNvbHV0aW9uABYKZ2V0TnVtVmFycwAXDXNvbHZlQXNzdW1pbmcAGAlyZXRpcmVWYXIAGRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAQX19tYWluX2FyZ2NfYXJndgAcDHNvbHZlX3N0cmluZwAhBm1hbGxvYwC4AghzdHJlcnJvcgCKAgZmZmx1c2gAvQEVZW1zY3JpcHRlbl9zdGFja19pbml0APYCGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA9wIZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQD4AhhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA+QIZX2Vtc2NyaXB0ZW5fc3RhY2tfcmVzdG9yZQD6AhdfZW1zY3JpcHRlbl9zdGFja19hbGxvYwD7AhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50APwCDGR5bkNhbGxfamlqaQD+AglXAQBBAQs1FR4gIyskJSYn3AIoKSosLS40NVJTVFVYXV57rwGwAZQBlwGZAb8BwAHBAcIBgAKEAoUCrQKuArMC3QLgAt4C3wLkAvIC8ALrAuEC8QLvAuwCCoqNCfECDgAQ9gIQGhBWEHwQ9AELLAEBf0EAQZAGENACEDAiADYC1MmBECAAQQEQPBpBACgC1MmBEEEBQQEQNhoLQgEBfwJAIABBACgC0MmBEEwNAANAQQAoAtTJgRBBAUEBEDYaQQBBACgC0MmBEEEBaiIBNgLQyYEQIAAgAUoNAAsLC5YEAQp/AkACQAJAIAAoAgAiAQ0AQQAhAkEAIQMMAQtBACEEQQAhA0EAIQIDQAJAIAEgAUEfdSIFcyAFayIGQQAoAtDJgRBMDQADQEEAKALUyYEQQQFBARA2GkEAQQAoAtDJgRBBAWoiBTYC0MmBECAGIAVKDQALCwJAIAIgBEcNACAEQQF2Qf7///8DcUECaiIFIARB/////wdzSw0DIAMgBSAEaiIEQQJ0ELsCIgNFDQMLIAMgAkECdGogBkEBdCABQR92cjYCACACQQFqIQIgACgCBCEBIABBBGohACABDQALC0EAKALUyYEQIgdBjARqIQgCQCAHKAKMBEUNACAHQQA2ApAECyAIIAIQEwJAAkACQCACRQ0AIAJBA3EhCSAIKAIAIQZBACEAQQAhBQJAIAJBBEkNACACQXxxIQpBACEFQQAhAgNAIAYgBUECdCIBaiADIAFqKAIANgIAIAYgAUEEciIEaiADIARqKAIANgIAIAYgAUEIciIEaiADIARqKAIANgIAIAYgAUEMciIBaiADIAFqKAIANgIAIAVBBGohBSACQQRqIgIgCkcNAAsLAkAgCUUNAANAIAYgBUECdCIBaiADIAFqKAIANgIAIAVBAWohBSAAQQFqIgAgCUcNAAsLIAcgCBBFIQUMAQsgByAIEEUhBSADRQ0BCyADELoCCyAFDwtBARDbAkGAgIAQQQAQAAALwwIBBH8CQAJAIAAoAgQgAU4NAAJAIAAoAggiAiABTg0AIAJBAXVBfnFBAmoiAyABIAJrQQFqQX5xIgQgAyAEShsiAyACQf////8Hc0oNAiAAIAMgAmoiAjYCCCAAIAAoAgAgAkECdBC7AiICNgIAIAINABCyASgCAEEwRg0CCwJAIAAoAgQiBSABTg0AIAUhAgJAIAEgBWtBA3EiBEUNAEEAIQMgBSECA0AgACgCACACQQJ0akEANgIAIAJBAWohAiADQQFqIgMgBEcNAAsLIAUgAWtBfU8NAANAIAAoAgAgAkECdCIDakEANgIAIAAoAgAgA2pBBGpBADYCACAAKAIAIANqQQhqQQA2AgAgACgCACADakEMakEANgIAIAJBBGoiAiABRw0ACwsgACABNgIECw8LQQEQ2wJBgICAEEEAEAAAC0ABAX9BACgC1MmBECIAQn83A7AEIABBuARqQn83AwACQCAAKAKgA0UNACAAQQA2AqQDCyAAQQFBABA7Qf8BcUULNwEBfwJAQQAoAtjJgRAiAUUNAEEAQQA2AtzJgRAgARC6AkEAQQA2AuDJgRBBAEEANgLYyYEQCwsQAEEAKALUyYEQKAIEQQFqCwoAQQAoAtDJgRALXAECf0EAKALUyYEQIgFCfzcDsAQgAUG4BGpCfzcDACABQaADaiECAkAgASgCoANFDQAgAUEANgKkAwsgAkEBEBMgASgCoAMgAEEBdDYCACABQQFBABA7Qf8BcUULywEBBH9BACEBAkACQEEAKALUyYEQIgIoAowEIgMNACACKAKQBCEBDAELIAJBADYCkAQLAkACQCABIAIoApQERw0AIAFBAXVBfnEiBEEAIARBAEobQQJqIgQgAUH/////B3NLDQEgAiAEIAFqIgE2ApQEIAIgAyABQQJ0ELsCIgM2AowEIANFDQEgAigCkAQhAQsgAiABQQFqNgKQBCADIAFBAnRqIABBAXRBAXI2AgAgAiACQYwEahBFGg8LQQEQ2wJBgICAEEEAEAAACyMAQQBCADcC2MmBEEEAQQA2AuDJgRBBAUEAQYCAgBAQsQEaC7kCAwJ/An4BfCMAQYACayIBJABBACABQegAahDXARogASkDaCEDIAEoAnAhAiABIAApA5ABNwNgQZqegBAgAUHgAGoQ8AEaIAEgACkDsAEiBDcDUCABIAS6IAK3RAAAAACAhC5BoyADuaAiBaM5A1hB+aeAECABQdAAahDxARogACkDoAEhBCABQcAAaiAAKQOYASIDuiAFozkDACABIAM3AzAgASAEtUMAAMhClCADtZW7OQM4QYmngBAgAUEwahDxARogASAAKQOoASIDNwMgIAEgA7ogBaM5AyhByqeAECABQSBqEPEBGiAAKQPQASEDIAEgACkD2AEiBDcDECABIAMgBH1C5AB+uiADuqM5AxhBwqaAECABQRBqEPEBGiABIAU5AwBBwZ+AECABEPEBGiABQYACaiQAC9YXAwt/A34CfCMAQcCIwABrIgIkACACIAA2AqQIQa+kgBAQWyACQYQIakHojoAQQfqWgBBBlI+AEEHdj4AQEB0iA0EBNgIcIANCgICAgCA3AhQgA0HQqIAQNgIAIAJB7AdqQemLgBBBsZWAEEGUj4AQQbyPgBAQHSIEQQE6ABQgBEHAqYAQNgIAIAJB1AdqQdmGgBBBtJaAEEGUj4AQQcOPgBAQHSIFQQA2AhQgBUH8qYAQNgIAIAJBtAdqQdyJgBBB/qKAEEGUj4AQQd2PgBAQHSIGQf////8HNgIcIAZCgICAgPD/////ADcCFCAGQdCogBA2AgAgAkGUB2pB5ImAEEG8oYAQQZSPgBBB3Y+AEBAdIgdB/////wc2AhwgB0KAgICA8P////8ANwIUIAdB0KiAEDYCACACQaQIaiABQQEQVyACQYABahAwIQBBACACQagIahDXARogAikDqAghDSACKAKwCCEIAkAgBC0AFA0AIABBARA8GgsgACADKAIcNgIcQQAgADYC5MmBEEECQQIQggIaQRhBAhCCAhoCQCAGKAIcQf////8HRg0AQQAgAkGoCGoQ1gEaIAY0AhwhDgJAIAIpA7AIIg9Cf1ENACAPIA5YDQELIAIgDjcDqAhBACACQagIahD/AUF/Rw0AQYOWgBAQ/AEaCwJAIAcoAhwiBkH/////B0YNAEEJIAJBqAhqENYBGiAGrEIUhiEOAkAgAikDsAgiD0J/UQ0AIA4gD1oNAQsgAiAONwOoCEEJIAJBqAhqEP8BQX9HDQBBrJKAEBD8ARoLAkACQCACKAKkCEEBRw0AQfeTgBAQ/AEaIAIoAqQIQQFHDQBBAEHqjoAQEIABIQkMAQsgASgCBEHqjoAQEH4hCQsCQCAJDQBBtI+AECEAAkAgAigCpAhBAUYNACABKAIEIQALIAIgADYCAEGUn4AQIAIQ8AEaQQEQAQALIAi3RAAAAACAhC5BoyEQIA25IRECQCAAKAIcQQFIDQBB5Y+AEBD8ARpByYGAEBD8ARoLIBAgEaAhECACQgA3AqyIQCACIAk2AqgIIAIgCSACQawIaiIHQYCAwAAQggEiAzYCsIhAIAJBADYCvIhAIAJCADcCtIhAQQAhCkEAIQtBACEMAkACQAJAAkADQAJAIAIoAqyIQCIGIANODQADQCAHIAZqLQAAIgRBCUkNAQJAIARBDkkNACAEQSBHDQILIAIgBkEBaiIGNgKsiEACQCAGIANIDQAgAkEANgKsiEAgAiACKAKoCCAHQYCAwAAQggEiAzYCsIhAIAIoAqyIQCEGCyAGIANIDQALCwJAIAYgA04NAAJAAkACQAJAIAcgBmotAABBnX9qDg4BAgICAgICAgICAgICAAILIAIgBkEBaiIGNgKsiEACQCAGIANIDQAgAkEANgKsiEAgAiACKAKoCCAHQYCAwAAQggEiAzYCsIhAIAIoAqyIQCEGCwJAIAYgA04NACAHIAZqLQAAQSBHDQAgAiAGQQFqIgY2AqyIQAJAIAYgA0gNACACQQA2AqyIQCACIAIoAqgIIAdBgIDAABCCASIDNgKwiEAgAigCrIhAIQYLIAYgA04NACAHIAZqLQAAQeMARw0AIAIgBkEBaiIGNgKsiEACQCAGIANIDQAgAkEANgKsiEAgAiACKAKoCCAHQYCAwAAQggEiAzYCsIhAIAIoAqyIQCEGCyAGIANODQAgByAGai0AAEHuAEcNACACIAZBAWoiBjYCrIhAAkAgBiADSA0AIAJBADYCrIhAIAIgAigCqAggB0GAgMAAEIIBIgM2ArCIQCACKAKsiEAhBgsgBiADTg0AIAcgBmotAABB5gBHDQAgAiAGQQFqIgY2AqyIQAJAIAYgA0gNACACQQA2AqyIQCACIAIoAqgIIAdBgIDAABCCATYCsIhACyACQagIahAfIQogAkGoCGoQHyELIAIoArCIQCEDDAULQX8hAAJAIAYgA04NACAHIAZqLQAAIQALIAIgADYCEEGfoIAQIAJBEGoQ8AEaQQMQAQALA0AgByAGai0AACEEIAIgBkEBaiIGNgKsiEACQCAEQQpHDQAgBiADSA0DIAJBADYCrIhAIAIgAigCqAggB0GAgMAAEIIBNgKwiEAgAigCsIhAIQMMBQsCQCAGIANIDQAgAkEANgKsiEAgAiACKAKoCCAHQYCAwAAQggEiAzYCsIhAIAIoAqyIQCEGCyAGIANIDQAMAgsACwJAIAIoArSIQEUNACACQQA2AriIQAsCQCACQagIahAfIgRFDQADQAJAIAQgBEEfdSIGcyAGayIGIAAoAogDTA0AA0AgAEEBQQEQNhogBiAAKAKIA0oNAAsLAkACQCACKAK4iEAiAyACKAK8iEBGDQAgAigCtIhAIQgMAQsgA0EBdUF+cSIIQQAgCEEAShtBAmoiCCADQf////8Hc0sNBiACIAggA2oiAzYCvIhAIAIgAigCtIhAIANBAnQQuwIiCDYCtIhAIAhFDQYgAigCuIhAIQMLIAIgA0EBajYCuIhAIAggA0ECdGogBkEBdCAEQQFIckF+ajYCACACQagIahAfIgQNAAsLIAxBAWohDCAAIAJBtIjAAGoQRRoLIAIoArCIQCEDDAELCwJAIAogACgCiANGDQBBnKKAEEE8QQFBACgCoK+BEBDQARoLAkAgDCALRg0AQeGhgBBBOkEBQQAoAqCvgRAQ0AEaCwJAIAIoArSIQCIGRQ0AIAJBADYCuIhAIAYQugILIAkQfRpBACEEAkAgAigCpAhBA0gNACABKAIIQeWOgBAQxAEhBAsCQCAAKAIcQQFIDQAgAiAAKAKIAzYCcEGInYAQIAJB8ABqEPABGiACIAAoAugBNgJgQdGdgBAgAkHgAGoQ8AEaC0EAIAJBqAhqENcBGiACKAKwCLdEAAAAAICELkGjIAIpA6gIuaAhEQJAIAAoAhxBAUgNACACIBEgEKE5A1BBvZyAECACQdAAahDxARoLQQJBAxCCAhpBGEEDEIICGiAAQQEQPBpBACACQagIahDXARoCQCAAKAIcQQFIDQAgAiACKAKwCLdEAAAAAICELkGjIAIpA6gIuaAgEaE5A0BB8puAECACQcAAahDxARpByYGAEBD8ARoLAkAgAC0A4AENAAJAIARFDQBByKCAEEEGQQEgBBDQARogBBC8ARoLAkAgACgCHEEBSA0AQdWRgBAQ/AEaQZqJgBAQ/AEaIAAQG0EKEPUBGgtBpo+AEBD8ARpBFBABAAsCQCAFKAIUIgZFDQACQCAAKAIcQQFIDQBBhZGAEBD8ARogBSgCFCEGCyACQQA2ArAIIAJCADcCqAggACAGIAJBqAhqEHgCQCACKAKoCCIGRQ0AIAJBADYCrAggBhC6AgsCQCAAKAIcQQFIDQAgABAbC0EAEAEACyAAQaADaiEGAkAgACgCoANFDQAgAEEANgKkAwsgBkEAEBMgAEEBQQAQOyEGAkAgACgCHEEBSA0AIAAQG0EKEPUBGgsCQCAGQf8BcSIDDQBB4KCAEEEAEPABGkEKIQYgBEUNBEHKoIAQQQRBASAEENABGgJAIAAoAogDIgNBAUgNAAJAIAAoAgQtAAAiBkECcQ0AIAJBATYCOCACQceogBA2AjAgAkGml4AQQceogBAgBhs2AjQgBEHGjoAQIAJBMGoQxQEaIAAoAogDIQMLIANBAkgNAEEBIQYDQAJAAkAgACgCBCAGai0AACIHQQJxRQ0AIAZBAWohBgwBCyACQdmZgBA2AiAgAiAGQQFqIgY2AiggAkGml4AQQceogBAgBxs2AiQgBEHGjoAQIAJBIGoQxQEaIAAoAogDIQMLIAYgA0gNAAsLQbihgBBBA0EBIAQQ0AEaIAQQvAEaQQoQAQALQd6ggBBBz6CAECADQQFGG0EAEPABGiAEDQEMAgtBARDbAkGAgIAQQQAQAAALQciggBBBwaCAECAGQf8BcUEBRhtBBkEBIAQQ0AEaIAQQvAEaC0EUQQAgBkH/AXFBAUYbIQYLIAYQAQALlAIAIAAgBDYCECAAIAM2AgwgACACNgIIIAAgATYCBCAAQaipgBA2AgACQEEALQD0yYEQQQFxDQBBAEIANwLoyYEQQQBBADYC8MmBEEEEQQBBgICAEBCxARpBAEEBOgD0yYEQCwJAAkACQEEAKALsyYEQIgRBACgC8MmBEEYNAEEAKALoyYEQIQMMAQsgBEEBdUF+cSIDQQAgA0EAShtBAmoiAyAEQf////8Hc0sNAUEAIAMgBGoiBDYC8MmBEEEAQQAoAujJgRAgBEECdBC7AiIDNgLoyYEQIANFDQFBACgC7MmBECEEC0EAIARBAWo2AuzJgRAgAyAEQQJ0aiAANgIAIAAPC0EBENsCQYCAgBBBABAAAAtBAQF/QQoQ9QEaQaiXgBAQ/AEaAkBBACgC5MmBECIBKAIcQQFIDQAgARAbQQoQ9QEaQaiXgBAQ/AEaC0EBELQBAAv7AwEHfyMAQRBrIgEkAAJAIAAoAoSAQCICIAAoAoiAQCIDTg0AIABBBGohBANAIAQgAmotAAAiBUEJSQ0BAkAgBUEOSQ0AIAVBIEcNAgsgACACQQFqIgI2AoSAQAJAIAIgA0gNACAAQQA2AoSAQCAAIAAoAgAgBEGAgMAAEIIBIgM2AoiAQCAAKAKEgEAhAgsgAiADSA0ACwtBACEGAkAgAiADTg0AAkACQAJAIABBBGoiBSACai0AAEFVag4DAQMAAwtBASEGIAAgAkEBaiICNgKEgEAgAiADTg0BDAILIAAgAkEBaiICNgKEgEBBACEGIAIgA0gNAQsgAEEANgKEgEAgACAAKAIAIAVBgIDAABCCASIDNgKIgEALAkACQCAAKAKEgEAiAiADSA0AQX8hBQwBCyAAQQRqIgcgAmotAAAiBUFGakH/AXFB9QFNDQBBACEFAkADQCAHIAJqLQAAIgRBUGpB/wFxQQlLDQEgACACQQFqIgI2AoSAQCAFQQpsIARqIQUCQCACIANIDQAgAEEANgKEgEAgACAAKAIAIAdBgIDAABCCASIDNgKIgEAgACgChIBAIQILIAVBUGohBSACIANIDQALCyABQRBqJABBACAFayAFIAYbDwsgASAFNgIAQQAoAqCvgRBBn6CAECABEMUBGkEDEAEACxAAQQAoAuTJgRBBAToAwAQLvwwBCX8jAEHQBmsiAiQAQQAgAkEoahAwIgM2AuTJgRAgAiABNgLABiACQQA2ArwGIAIgADYCuAYgAkEANgLMBiACQgA3AsQGQQAhAEEAIQRBACEFQQAhBgJAAkACQANAAkAgACABTg0AIAIoArgGIQcDQCAHIABqLQAAIghBCUkNAQJAIAhBDkkNACAIQSBHDQILIAIgAEEBaiIANgK8BiAAIAFHDQAMBQsACyAAIAFODQMCQAJAAkACQAJAIAIoArgGIgcgAGotAABBnX9qDg4BAgICAgICAgICAgICAAILIAIgAEEBaiIINgK8BgJAIAggAU4NACAHIAhqLQAAQSBHDQAgAiAAQQJqIgg2ArwGIAggAU4NACAHIAhqLQAAQeMARw0AIAIgAEEDaiIINgK8BiAIIAFODQAgByAIai0AAEHuAEcNACACIABBBGoiCDYCvAYgCCABTg0AIAcgCGotAABB5gBHDQAgAiAAQQVqNgK8BiACQbgGahAiIQQgAkG4BmoQIiEFDAMLQX8hAAJAIAggAU4NACAHIAhqLQAAIQALIAIgADYCIEGfoIAQIAJBIGoQ8AEaQQMQAQALA0AgByAAai0AACEIIAIgAEEBaiIANgK8BiAIQQpGDQIgACABRw0ADAILAAsCQCACKALEBkUNACACQQA2AsgGCwJAIAJBuAZqECIiAUUNAANAAkAgASABQR91IgBzIABrIgAgAygCiANMDQADQCADQQFBARA2GiAAIAMoAogDSg0ACwsCQAJAIAIoAsgGIgggAigCzAZGDQAgAigCxAYhBwwBCyAIQQF1QX5xIgdBACAHQQBKG0ECaiIHIAhB/////wdzSw0EIAIgByAIaiIINgLMBiACIAIoAsQGIAhBAnQQuwIiBzYCxAYgB0UNBCACKALIBiEICyACIAhBAWo2AsgGIAcgCEECdGogAEEBdCABQQFIckF+ajYCAAJAIAIoArwG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QQJ0aigCACIAKAIMIAIgBUECdGooAgAiBygCDBCIAiIGQQBIDQAgBg0BIAAoAhAgBygCEBCIAkF/Sg0BCyAEIQULIARBAWoiBCABRw0ACyACIAhBAnRqIgQoAgAhBiAEIAIgBUECdGoiBSgCADYCACAFIAY2AgAgCCAJRiEEIAohCCAERQ0ACwsLDABBACAANgLYy4EQC6IFAgF/AXwgAEIANwIEIABBtKuAEDYCACAAQQxqQgA3AgAgAEEUakIANwIAIABBHGpBADYCACAAQQArA5DMgRA5AyAgAEEAKwPIzIEQOQMoIABBACsDgM2BEDkDMCAAQQArA7jNgRA5AzggAEEALQCszoEQOgBAIABBACgC3M2BEDYCREEAKAL8zYEQIQEgAEEAOgBMIAAgATYCSCAAQQAtAJTOgRA6AE0gAEEAKwO4z4EQOQNQIABBACgCzM6BEDYCWEEAKwOAz4EQIQIgAEKAgICAgICA/D83A4ABIABB5AA2AnggAEKas+bMmbPm+D83A3AgAELVqtWq1arV6j83A2ggACACOQNgIABBiAFqQQBB2AAQuAEaIABCADcC5AEgAEEBOgDgASAAQewBakIANwIAIABB9AFqQgA3AgAgAEIANwOgAiAAQoCAgICAgID4PzcDmAIgAEEANgKQAiAAQgA3A4gCIABCgICAgICAgPg/NwOAAiAAQagCakIANwMAIABBsAJqQgA3AwAgAEG4AmpCADcDACAAQcACakEANgIAIAAgAEHUA2oiATYCxAIgAEHIAmpBAEHMABC4ARogAEIANwOYAyAAQX82ApQDIABBoANqQgA3AwAgAEGoA2pBADYCACAAQgA3A7ADIAAgAEGIAmo2AqwDIABBuANqQgA3AwAgAEHAA2pCADcDACAAQcgDakIANwMAIABCADcC1AMgAEEBOgDQAyAAQdwDakIANwIAIAFBgIDAABAzIABCADcD6AMgAEEAOgDkAyAAQfADakIANwMAIABB+ANqQgA3AwAgAEGABGpCADcDACAAQYgEakIANwMAIABBkARqQgA3AwAgAEJ/NwOwBCAAQbgEakJ/NwMAIABBADoAwAQgAAuICAEEfyAAQbSrgBA2AgACQCAAKAKMBCIBRQ0AIABBADYCkAQgARC6AiAAQQA2ApQEIABBADYCjAQLAkAgACgCgAQiAUUNACAAQQA2AoQEIAEQugIgAEEANgKIBCAAQQA2AoAECwJAIAAoAvQDIgFFDQAgAEEANgL4AyABELoCIABBADYC/AMgAEEANgL0AwsCQCAAKALoAyIBRQ0AIABBADYC7AMgARC6AiAAQQA2AvADIABBADYC6AMLAkAgACgC1AMiAUUNACABELoCCwJAIAAoArwDIgFFDQAgAEEANgLAAyABELoCIABBADYCxAMgAEEANgK8AwsCQCAAKAKwAyIBRQ0AIABBADYCtAMgARC6AiAAQQA2ArgDIABBADYCsAMLAkAgACgCoAMiAUUNACAAQQA2AqQDIAEQugIgAEEANgKoAyAAQQA2AqADCwJAIAAoAoQDIgFFDQAgAEEANgKIAyABELoCIABBADYCjAMgAEEANgKEAwsCQCAAKAL4AiIBRQ0AIABBADYC/AIgARC6AiAAQQA2AoADIABBADYC+AILAkAgACgC7AIiAUUNACAAQQA2AvACIAEQugIgAEEANgL0AiAAQQA2AuwCCwJAIAAoAuACIgFFDQAgAEEANgLkAiABELoCIABBADYC6AIgAEEANgLgAgsCQCAAKALUAiIBRQ0AIABBADYC2AIgARC6AiAAQQA2AtwCIABBADYC1AILAkAgACgCyAIiAUUNACAAQQA2AswCIAEQugIgAEEANgLQAiAAQQA2AsgCCwJAIAAoArgCIgFFDQAgAEEANgK8AiABELoCIABBADYCwAIgAEEANgK4AgsCQCAAKAKsAiIBRQ0AIABBADYCsAIgARC6AiAAQQA2ArQCIABBADYCrAILAkAgACgCoAIiAkUNAEEAIQECQCAAKAKkAiIDQQBMDQADQAJAIAAoAqACIAFBDGxqIgIoAgAiBEUNACACQQA2AgQgBBC6AiACQQA2AgggAkEANgIAIAAoAqQCIQMLIAFBAWoiASADSA0ACyAAKAKgAiECCyAAQQA2AqQCIAIQugIgAEEANgKoAiAAQQA2AqACCwJAIAAoAogCIgFFDQAgAEEANgKMAiABELoCIABBADYCkAIgAEEANgKIAgsCQCAAKALwASIBRQ0AIABBADYC9AEgARC6AiAAQQA2AvgBIABBADYC8AELAkAgACgC5AEiAUUNACAAQQA2AugBIAEQugIgAEEANgLsASAAQQA2AuQBCwJAIAAoAhAiAUUNACAAQQA2AhQgARC6AiAAQQA2AhggAEEANgIQCwJAIAAoAgQiAUUNACAAQQA2AgggARC6AiAAQQA2AgwgAEEANgIECyAACwwAIAAQXUHIBBDVAgumCwMGfwJ8AX4jAEEQayIDJAAgAEGgAmoiBCAAKAKIAyIFQQF0IgZBAXIiBxBgIANBADoADiAAQawCaiIIIAcgA0EOahA4IAQgBkECaiIGEGAgA0EAOgAPIAggBiADQQ9qEDgCQAJAAkACQAJAAkACQAJAAkAgACgCzAIiBCAAKALQAkYNACAAKALIAiEGDAELIARBAXVBfnEiBkEAIAZBAEobQQJqIgYgBEH/////B3NLDQEgACAGIARqIgQ2AtACIAAgACgCyAIgBBC7AiIGNgLIAiAGRQ0BIAAoAswCIQQLIAAgBEEBajYCzAIgBiAEakECOgAAAkACQCAAKAKIAyIEIAAoAowDRg0AIAAoAoQDIQYMAQsgBEEBdUF+cSIGQQAgBkEAShtBAmoiBiAEQf////8Hc0sNAiAAIAYgBGoiBDYCjAMgACAAKAKEAyAEQQN0ELsCIgY2AoQDIAZFDQIgACgCiAMhBAsgACAEQQFqNgKIAyAGIARBA3RqQv////8PNwIARAAAAAAAAAAAIQkCQCAALQBNQQFHDQACQAJAIAArAzhEAAAAAOQ0NUGiIglEAADA////30GjIgqZRAAAAAAAAOBBY0UNACAKqiEEDAELQYCAgIB4IQQLIAAgCSAEt0QAAMD////fQaKhIgk5AzggCUQAAMD////fQaNE8WjjiLX45D6iIQkLAkACQCAAKAKMAiIEIAAoApACRg0AIAAoAogCIQYMAQsgBEEBdUF+cSIGQQAgBkEAShtBAmoiBiAEQf////8Hc0sNAyAAIAYgBGoiBDYCkAIgACAAKAKIAiAEQQN0ELsCIgY2AogCIAZFDQMgACgCjAIhBAsgACAEQQFqNgKMAiAGIARBA3RqIAk5AwACQAJAIAAoAuwDIgQgACgC8ANGDQAgACgC6AMhBgwBCyAEQQF1QX5xIgZBACAGQQBKG0ECaiIGIARB/////wdzSw0EIAAgBiAEaiIENgLwAyAAIAAoAugDIAQQuwIiBjYC6AMgBkUNBCAAKALsAyEECyAAIARBAWo2AuwDIAYgBGpBADoAAAJAAkAgACgC2AIiBCAAKALcAkYNACAAKALUAiEGDAELIARBAXVBfnEiBkEAIAZBAEobQQJqIgYgBEH/////B3NLDQUgACAGIARqIgQ2AtwCIAAgACgC1AIgBBC7AiIGNgLUAiAGRQ0FIAAoAtgCIQQLIAAgBEEBajYC2AIgBiAEaiABOgAAAkACQCAAKALkAiIEIAAoAugCRg0AIAAoAuACIQYMAQsgBEEBdUF+cSIGQQAgBkEAShtBAmoiBiAEQf////8Hc0sNBiAAIAYgBGoiBDYC6AIgACAAKALgAiAEELsCIgY2AuACIAZFDQYgACgC5AIhBAsgBiAEakEAOgAAIAAgACgC5AJBAWo2AuQCAkAgACgC9AIiBCAFSg0AIARBAXVBfnFBAmoiBiAFIARrQQJqQX5xIgcgBiAHShsiBiAEQf////8Hc0oNByAAIAYgBGoiBDYC9AIgACAAKALsAiAEQQJ0ELsCIgQ2AuwCIAQNABCyASgCAEEwRg0HCyAAKALgAiAFaiIELQAAIQYCQAJAAkAgAkUNACAGQf8BcQ0CQgEhCwwBCyAGQf8BcUUNAUJ/IQsLIAAgACkDuAEgC3w3A7gBCyAEIAI6AAACQAJAIAUgACgCwANODQAgACgCvAMgBUECdGooAgBBf0oNAQsgACgC4AIgBWotAABFDQAgAEGsA2ogBRBMCyADQRBqJAAgBQ8LQQEQ2wJBgICAEEEAEAAAC0EBENsCQYCAgBBBABAAAAtBARDbAkGAgIAQQQAQAAALQQEQ2wJBgICAEEEAEAAAC0EBENsCQYCAgBBBABAAAAtBARDbAkGAgIAQQQAQAAALQQEQ2wJBgICAEEEAEAAAC78BAQN/AkACQCAAKAIEIAFODQACQCAAKAIIIgIgAU4NACACQQF1QX5xQQJqIgMgASACa0EBakF+cSIEIAMgBEobIgMgAkH/////B3NKDQIgACADIAJqIgI2AgggACAAKAIAIAJBDGwQuwIiAjYCACACDQAQsgEoAgBBMEYNAgsCQCABIAAoAgQiAkwNACAAKAIAIAJBDGxqQQAgASACa0EMbBC4ARoLIAAgATYCBAsPC0EBENsCQYCAgBBBABAAAAubBAEKf0EAIQICQAJAIAAtAOABQQFHDQAgASgCACABKAIEEGICQCABKAIEIgNBAUgNACAAKALIAiEEIAEoAgAhBUEAIQZBfiEHQQEhAkEAIQgDQCAEIAUgBkECdGooAgAiCUEBdWotAAAiCiAJQQFxIgtGDQIgCSAHc0EBRg0CAkAgCiALc0EBRg0AIAkgB0YNACAFIAhBAnRqIAk2AgAgCEEBaiEIIAEoAgQhAyAJIQcLIAZBAWoiBiADSA0ACyAGIAhrIglBAUgNACABIAMgCWsiAzYCBAsCQAJAAkAgAw4CAAECCyAAQQA6AOABQQAPCyAAKALIAiABKAIAKAIAIglBAXUiBmogCUEBcToAACAAKAKEAyAGQQN0aiAANQL8AkIghkL/////D4Q3AgAgACAAKALwAiIGQQFqNgLwAiAAKALsAiAGQQJ0aiAJNgIAIAAgABBjQX9GIgk6AOABIAkPCyAAQdQDaiABQQAQMiEGAkACQCAAKALoASIJIAAoAuwBRg0AIAAoAuQBIQcMAQsgCUEBdUF+cSIHQQAgB0EAShtBAmoiByAJQf////8Hc0sNAiAAIAcgCWoiCTYC7AEgACAAKALkASAJQQJ0ELsCIgc2AuQBIAdFDQIgACgC6AEhCQtBASECIAAgCUEBajYC6AEgByAJQQJ0aiAGNgIAIAAgBhBkCyACDwtBARDbAkGAgIAQQQAQAAAL3wMBCH8CQAJAIAFBD0oNACAAIQIMAQsDQCAAIAFBAXRBfHFqKAIAIQMgASEEQX8hBQNAIAAgBUEBaiIFQQJ0aiICKAIAIgYgA0gNAANAIAMgACAEQX9qIgRBAnRqIgcoAgAiCEgNAAsCQCAFIARODQAgAiAINgIAIAcgBjYCAAwBCwsgACAFEGIgAiEAIAEgBWsiAUEQTg0ACwsCQCABQQJIDQAgAUF+aiEIQQAhBwNAIAdBAWoiCSEFIAchBEEAIQACQCABIAdBf3NqQQNxIgNFDQADQCAFIAQgAiAFQQJ0aigCACACIARBAnRqKAIASBshBCAFQQFqIQUgAEEBaiIAIANHDQALCwJAIAggB2tBA0kNAANAIAVBA2oiACAFQQJqIgMgBUEBaiIGIAUgBCACIAVBAnRqKAIAIAIgBEECdGooAgBIGyIEIAIgBkECdGooAgAgAiAEQQJ0aigCAEgbIgQgAiADQQJ0aigCACACIARBAnRqKAIASBsiBCACIABBAnRqKAIAIAIgBEECdGooAgBIGyEEIAVBBGoiBSABRw0ACwsgAiAHQQJ0aiIFKAIAIQAgBSACIARBAnRqIgQoAgA2AgAgBCAANgIAIAggB0YhBSAJIQcgBUUNAAsLC4wJAhB/AX4CQCAAKAK8AiIBQQFIDQBBACECA0ACQCAAKAKsAiAAKAK4AiACQQJ0aiIDKAIAIgRqLQAARQ0AQQAhAUEAIQUCQCAAKAKgAiAEQQxsaiIEKAIEIgZBAUgNAANAAkAgACgCxAIoAgAgBCgCACIHIAFBA3RqIggoAgBBAnRqKAIAQQNxQQFGDQAgByAFQQN0aiAIKQIANwIAIAVBAWohBSAEKAIEIQYLIAFBAWoiASAGSA0ACyABIAVrIgFBAUgNACAEIAYgAWs2AgQLIAAoAqwCIAMoAgBqQQA6AAAgACgCvAIhAQsgAkEBaiICIAFIDQALCwJAIAAoArgCRQ0AIABBADYCvAILAkACQAJAIAAoApADIgEgACgC8AJIDQBBfyEJQgAhEQwBC0F/IQlBACEKA0AgACABQQFqNgKQAyAAKAKgAiAAKALsAiABQQJ0aigCACIFQQxsaiILKAIAIQECQAJAIAsoAgQiBA0AIAEhCAwBCyABIARBA3RqIQggBUEBcyEMIAEhBQNAAkACQCAAKALIAiIHIAEoAgQiBEEBdWotAAAgBEEBcUcNACAFIAEpAgA3AgAgBUEIaiEFIAFBCGohAQwBCwJAIAAoAtQDIAEoAgAiDUECdGoiDigCBCIDIAxHDQAgDigCCCEDIA4gDDYCCCAOIAM2AgQLIAFBCGohAQJAIAMgBEYNACAHIANBAXVqLQAAIANBAXFHDQAgBSADrUIghiANrYQ3AgAgBUEIaiEFDAELAkAgDigCACIEQd8ATQ0AIA5BBGohAiAEQQV2IQ9BAiEEAkADQCACIARBAnRqIhAoAgAiBkEBcSAHIAZBAXVqLQAAc0H/AXFBAUcNASAEQQFqIgQgD0YNAgwACwALIA4gBjYCCCAQIAw2AgACQAJAIAAoAqACIA4oAghBAXNBDGxqIgQoAgQiBiAEKAIIRg0AIAQoAgAhBwwBCyAGQQF1QX5xIgdBACAHQQBKG0ECaiIHIAZB/////wdzSw0HIAQgByAGaiIGNgIIIAQgBCgCACAGQQN0ELsCIgc2AgAgB0UNByAEKAIEIQYLIAQgBkEBajYCBCAHIAZBA3RqIAOtQiCGIA2thDcCAAwBCyAFIAOtQiCGIA2tIhGENwIAIAVBCGohBQJAIAAoAsgCIANBAXUiBGoiBi0AACADQQFxIgdzQf8BcUEBRw0AIAAgACgC8AI2ApADAkAgASAISQ0AIA0hCQwCCwNAIAUgASkCADcCACAFQQhqIQUgAUEIaiIBIAhJDQALIA0hCQwBCyAGIAc6AAAgACgChAMgBEEDdGogADUC/AJCIIYgEYQ3AgAgACAAKALwAiIEQQFqNgLwAiAAKALsAiAEQQJ0aiADNgIACyABIAhHDQALIAUhAQsCQCAIIAFrQQN1IgFBAUgNACALIAsoAgQgAWs2AgQLIApBAWohCiAAKAKQAyIBIAAoAvACSA0ACyAKrSERCyAAIAApA6gBIBF8NwOoASAAIAApA5gDIBF9NwOYAyAJDwtBARDbAkGAgIAQQQAQAAALpQMCBH8CfiAAKALUAyABQQJ0aiICNQIIIQYCQAJAAkACQCAAKAKgAiACKAIEQQFzQQxsaiIDKAIEIgQgAygCCEYNACADKAIAIQUMAQsgBEEBdUF+cSIFQQAgBUEAShtBAmoiBSAEQf////8Hc0sNASADIAUgBGoiBDYCCCADIAMoAgAgBEEDdBC7AiIFNgIAIAVFDQEgAygCBCEECyADIARBAWo2AgQgBSAEQQN0aiAGQiCGIAGtIgaENwIAIAI1AgQhBwJAAkAgACgCoAIgAigCCEEBc0EMbGoiAygCBCIEIAMoAghGDQAgAygCACEBDAELIARBAXVBfnEiAUEAIAFBAEobQQJqIgEgBEH/////B3NLDQIgAyABIARqIgQ2AgggAyADKAIAIARBA3QQuwIiATYCACABRQ0CIAMoAgQhBAsgAyAEQQFqNgIEIAEgBEEDdGogB0IghiAGhDcCACAAQcgBQcABIAIoAgAiA0EEcRtqIgAgACkDACADQQV2rXw3AwAPC0EBENsCQYCAgBBBABAAAAtBARDbAkGAgIAQQQAQAAALWAEBfyAAKALIAiABQQF1IgNqIAFBAXE6AAAgACgChAMgA0EDdGogADUC/AJCIIYgAq2ENwIAIAAgACgC8AIiAkEBajYC8AIgACgC7AIgAkECdGogATYCAAuXBgEFfyAAKALUAyABQQJ0aiEDAkACQAJAAkAgAkUNAAJAIAAoAqACIgQgAygCBEEBc0EMbGoiBSgCBCIGQQFODQBBACECDAILIAUoAgAhB0EAIQIDQCAHIAJBA3RqKAIAIAFGDQIgAkEBaiICIAZHDQALIAZBf2ohBgwCCwJAAkACQCAAKAKsAiICIAMoAgRBAXMiAWoiBS0AAA0AIAVBAToAAAJAAkAgACgCvAIiAiAAKALAAkYNACAAKAK4AiEFDAELIAJBAXVBfnEiBUEAIAVBAEobQQJqIgUgAkH/////B3NLDQIgACAFIAJqIgI2AsACIAAgACgCuAIgAkECdBC7AiIFNgK4AiAFRQ0CIAAoArwCIQILIAAgAkEBajYCvAIgBSACQQJ0aiABNgIAIAAoAqwCIQILIAIgAygCCEEBcyIFaiICLQAADQQgAkEBOgAAAkACQCAAKAK8AiICIAAoAsACRg0AIAAoArgCIQEMAQsgAkEBdUF+cSIBQQAgAUEAShtBAmoiASACQf////8Hc0sNAiAAIAEgAmoiAjYCwAIgACAAKAK4AiACQQJ0ELsCIgE2ArgCIAFFDQIgACgCvAIhAgsgACACQQFqNgK8AiABIAJBAnRqIAU2AgAMBAtBARDbAkGAgIAQQQAQAAALQQEQ2wJBgICAEEEAEAAACyACIAZBf2oiBk4NAANAIAUoAgAiBiACQQN0aiAGIAJBAWoiAkEDdGopAgA3AgAgAiAFKAIEQX9qIgZIDQALIAAoAqACIQQLIAUgBjYCBAJAAkACQCAEIAMoAghBAXNBDGxqIgUoAgQiBkEBTg0AQQAhAgwBCyAFKAIAIQdBACECA0AgByACQQN0aigCACABRg0BIAJBAWoiAiAGRw0ACyAGQX9qIQEMAQsgAiAGQX9qIgFODQADQCAFKAIAIgEgAkEDdGogASACQQFqIgJBA3RqKQIANwIAIAIgBSgCBEF/aiIBSA0ACwsgBSABNgIECyAAQcgBQcABIAMoAgAiAkEEcRtqIgUgBSkDACACQQV2rX03AwALqQEBA38gACgC1AMhAiAAIAFBABBmAkAgACgCyAIgAiABQQJ0IgNqIgEoAgQiAkEBdSIEai0AACACQQFxRw0AIAAoAoQDIARBA3RqIgQoAgAiAkF/Rg0AIAAoAtQDIAJBAnRqIAFHDQAgBEF/NgIACyABIAEoAgBBfHFBAXI2AgAgACAAKALUAyADaigCACIBQQV2IAAoAuADaiABQQN2QQFxakEBajYC4AMLYgEDf0EAIQICQCABKAIAIgNBIEkNACABQQRqIQQgA0EFdiEDIAAoAsgCIQBBACEBA0AgACAEIAFBAnRqKAIAIgJBAXVqLQAAIAJBAXFGIgINASABQQFqIgEgA0cNAAsLIAILvwIBBn8CQCAAKAL8AiABTA0AAkAgACgC8AIiAiAAKAL4AiABQQJ0IgNqIgQoAgAiBUwNACAAQawDaiEGA0AgACgCyAIgACgC7AIgAkF/aiICQQJ0IgVqKAIAQQF1IgRqQQI6AAACQAJAIAAoAkgiB0EBSg0AIAdBAUcNASACIAAoAvgCIAAoAvwCQQJ0akF8aigCAEwNAQsgACgC1AIgBGogACgC7AIgBWotAABBAXE6AAALAkACQCAEIAAoAsADTg0AIAAoArwDIARBAnRqKAIAQX9KDQELIAAoAuACIARqLQAARQ0AIAYgBBBMCyACIAAoAvgCIANqIgQoAgAiBUoNAAsgACgC8AIhAgsgACAFNgKQAwJAIAIgBCgCACIETA0AIAAgBDYC8AILIAAoAvwCIAFMDQAgACABNgL8AgsLngcCBHwOfwJAAkAgACsDOEQAAAAA5DQ1QaIiAUQAAMD////fQaMiAplEAAAAAAAA4EFjRQ0AIAKqIQUMAQtBgICAgHghBQsgACABIAW3RAAAwP///99BoqEiAzkDOAJAAkAgA0QAAMD////fQaMgACsDMGMNAEF/IQYMAQsCQCAAKAK0AyIFDQBBfyEGDAELAkACQCADRAAAAADkNDVBoiIBRAAAwP///99BoyICmUQAAAAAAADgQWNFDQAgAqohBwwBC0GAgICAeCEHCyAAIAEgB7dEAADA////30GioSIDOQM4AkACQCADRAAAwP///99BoyAFt6IiAZlEAAAAAAAA4EFjRQ0AIAGqIQUMAQtBgICAgHghBQsgACgCyAIgACgCsAMgBUECdGooAgAiBmotAABBAnFFDQAgACgC4AIgBmotAABFDQAgACAAKQOgAUIBfDcDoAELIAAoArADIghBfGohCSAAKAK8AyEKIAAoAuACIQsgACgCyAIhDAJAA0ACQCAGQX9GDQAgDCAGai0AAEECcUUNACALIAZqLQAADQILAkAgACgCtAMiBQ0AQX4PCyAIKAIAIQYgCCAJIAVBAnRqKAIAIgU2AgAgCiAFQQJ0akEANgIAIAogBkECdGpBfzYCACAAIAAoArQDIgVBf2oiBzYCtAMgBUEDSA0AIAAoAqwDKAIAIg0gCCgCACIOQQN0aisDACECIAAoArwDIQ9BACEQQQEhEUEAIRIDQAJAAkACQCAQQQJqIgUgB0gNACANIAggEUECdGooAgAiB0EDdGorAwAhAQwBCyANIAggBUECdGooAgAiB0EDdGorAwAiASANIAggEUECdGooAgAiEEEDdGorAwAiBGQNASAEIQEgECEHCyARIQULAkACQCABIAJkDQAgEiEFDAELIAggEkECdGogBzYCACAPIAdBAnRqIBI2AgAgBSESIAVBAXQiEEEBciIRIAAoArQDIgdIDQELCyAIIAVBAnRqIA42AgAgDyAOQQJ0aiAFNgIADAALAAsCQAJAIAAtAExBAUcNAAJAAkAgA0QAAAAA5DQ1QaIiAUQAAMD////fQaMiAplEAAAAAAAA4EFjRQ0AIAKqIQUMAQtBgICAgHghBQsgACABIAW3RAAAwP///99BoqEiATkDOCABRAAAwP///99Bo0QAAAAAAADgP2MhBQwBCyAAKALUAiAGai0AAEEARyEFCyAGQQF0IAVyC+UTBBF/AXwBfQF+AkACQAJAAkACQCACKAIEIgQgAigCCEYNACACKAIAIQUMAQsgBEEBdUF+cSIFQQAgBUEAShtBAmoiBSAEQf////8Hc0sNASACIAUgBGoiBDYCCCACIAIoAgAgBEECdBC7AiIFNgIAIAVFDQEgAigCBCEECyAFIARBAnRqQQA2AgAgAiACKAIEQQFqNgIEIAAoAvACQX9qIQVBfiEEQQAhBgNAAkAgACgC1AMiByABQQJ0aiIIKAIAIgFBBHFFDQAgCCABQQN2Qfz///8BcWoiCSAAKwOAAiIVIAkqAgS7oLYiFjgCBCAWu0RAjLV4Ha8VRGRFDQACQCAAKAL0ASIJQQFIDQAgCUEBcSEKIAAoAvABIQtBACEBAkAgCUEBRg0AIAlB/v///wdxIQxBACEBQQAhCQNAIAcgCyABQQJ0aiINKAIAQQJ0aiIOIA4oAgBBA3ZB/P///wFxaiIOIA4qAgS7RCNCkgyhnMc7orY4AgQgByANQQRqKAIAQQJ0aiINIA0oAgBBA3ZB/P///wFxaiINIA0qAgS7RCNCkgyhnMc7orY4AgQgAUECaiEBIAlBAmoiCSAMRw0ACwsgCkUNACAHIAsgAUECdGooAgBBAnRqIgEgASgCAEEDdkH8////AXFqIgEgASoCBLtEI0KSDKGcxzuitjgCBAsgACAVRCNCkgyhnMc7ojkDgAIgCCgCACEBCwJAAkAgAUEFdiAEQX5HIgdLDQAgBiEPDAELIAhBBGohECAGIQ8CQANAAkAgACgC6AMgECAHQQJ0aigCACIRQQF1IgxqIgotAAANACAAKAKEAyAMQQN0IhJqKAIEQQFIDQAgACgCiAIiDSASaiIEIAArA5gCIAQrAwCgIhU5AwACQCAVRH3DlCWtSbJUZEUNAAJAIAAoAogDIgFBAUgNACABQQNxIQZBACEJQQAhBAJAIAFBBEkNACABQfz///8HcSETQQAhBEEAIQ4DQCANIARBA3RqIgEgASsDAEQwBY7kLv8rK6I5AwAgAUEIaiILIAsrAwBEMAWO5C7/KyuiOQMAIAFBEGoiCyALKwMARDAFjuQu/ysrojkDACABQRhqIgEgASsDAEQwBY7kLv8rK6I5AwAgBEEEaiEEIA5BBGoiDiATRw0ACwsgBkUNAANAIA0gBEEDdGoiASABKwMARDAFjuQu/ysrojkDACAEQQFqIQQgCUEBaiIJIAZHDQALCyAAIAArA5gCRDAFjuQu/ysrojkDmAILAkAgDCAAKALAA04NACAAKAK8AyIGIAxBAnRqKAIAIgRBAEgNACAAKAKwAyIBIARBAnRqKAIAIRQCQAJAIAQNAEEAIQQMAQsgACgCrAMoAgAiEyAUQQN0aisDACEVA0AgASAEQQJ0aiEJAkAgFSATIAEgBEF/aiIOQQF1Ig1BAnRqIgsoAgAiDEEDdGorAwBkDQAgCSEBDAILIAkgDDYCACAGIAsoAgBBAnRqIAQ2AgAgDSEEIA5BAUsNAAsgDSEECyABIBQ2AgAgBiAUQQJ0aiAENgIACyAKQQE6AAACQCAAKAKEAyASaigCBCAAKAL8AkgNACAPQQFqIQ8MAQsCQAJAIAIoAgQiBCACKAIIRg0AIAIoAgAhAQwBCyAEQQF1QX5xIgFBACABQQBKG0ECaiIBIARB/////wdzSw0DIAIgASAEaiIENgIIIAIgAigCACAEQQJ0ELsCIgE2AgAgAUUNAyACKAIEIQQLIAIgBEEBajYCBCABIARBAnRqIBE2AgALIAdBAWoiByAIKAIAQQV2Tw0CDAALAAtBARDbAkGAgIAQQQAQAAALIAAoAugDIQEgACgC7AIhBwNAIAVBAnQhBCAFQX9qIgkhBSABIAcgBGooAgAiBEEBdSINaiIOLQAARQ0ACyAAKAKEAyANQQN0aigCACEBIA5BADoAACAPQX9qIQYgCSEFIA9BAUoNAAsgAigCACAEQQFzNgIAIABBgARqIQQCQCAAKAKABEUNACAAQQA2AoQECyAEIAIoAgQQEwJAIAIoAgQiBUEBSA0AIAQoAgAhASACKAIAIQdBACEEA0AgASAEQQJ0IgVqIAcgBWooAgA2AgAgBEEBaiIEIAIoAgQiBUgNAAsLIAUhDiAFIQ0CQAJAAkAgACgCREF/ag4CAAEFCyAFQQJODQEMAwsgBUECSA0CQQEhBCAFQX9qIgFBAXEhDCAAKAKEAyEHIAIoAgAhDQJAAkAgBUECRw0AQQAhAQwBCyANQQRqIQ4gAUF+cSELQQAhAUEBIQRBACEFA0BBASAHIA4gBEECdCIJaigCAEECdEF4cWpBBGooAgB0QQEgByANIAlqKAIAQQJ0QXhxakEEaigCAHQgAXJyIQEgBEECaiEEIAVBAmoiBSALRw0ACwsCQCAMRQ0AQQEgByANIARBAnRqKAIAQQJ0QXhxakEEaigCAHQgAXIhAQtBASENQQEhDgNAAkACQCAAKAKEAyACKAIAIgUgDUECdCIHaigCACIEQQJ0QXhxaigCAEF/Rg0AIAAgBCABEGwNASACKAIAIgUgB2ooAgAhBAsgBSAOQQJ0aiAENgIAIA5BAWohDgsgDUEBaiINIAIoAgQiBUgNAAwECwALIAAoAugDIQkgACgC1AMhCiAAKAKEAyELIAIoAgAhDEEBIQ1BASEOA0ACQAJAIAsgDCANQQJ0aigCACIGQQJ0QXhxaigCACIEQX9GDQAgCiAEQQJ0aiIEKAIAIgVBwABJDQEgBUEFdiEHIARBBGohAUEBIQQDQAJAIAkgASAEQQJ0aigCAEEBdSIFai0AAA0AIAsgBUEDdGooAgRBAEoNAgsgBEEBaiIEIAdHDQAMAgsACyAMIA5BAnRqIAY2AgAgDkEBaiEOCyANQQFqIg0gAigCBCIFSA0ADAMLAAtBARDbAkGAgIAQQQAQAAALQQEhDkEBIQ0LIAAgACkD0AEgBawiF3w3A9ABAkAgDSAOayIEQQFIDQAgAiAFIARrIgU2AgQgBawhFwsgACAAKQPYASAXfDcD2AFBACEEQQAhAQJAIAVBAUYNAEECIQEgACgChAMhDSACKAIAIQlBASEHAkAgBUECTA0AA0AgASAHIA0gCSABQQJ0aigCAEECdEF4cWpBBGooAgAgDSAJIAdBAnRqKAIAQQJ0QXhxakEEaigCAEobIQcgAUEBaiIBIAVHDQALCyAJIAdBAnRqIgEoAgAhBSABIAkoAgQ2AgAgCSAFNgIEIA0gBUECdEF4cWpBBGooAgAhAQsgAyABNgIAAkAgACgChARBAEwNAANAIAAoAugDIAAoAoAEIARBAnRqKAIAQQF1akEAOgAAIARBAWoiBCAAKAKEBEgNAAsLC88GAQh/AkACQCAAKAL0AyIDDQAgACgC+AMhBAwBC0EAIQQgAEEANgL4AwsCQAJAIAQgACgC/ANHDQAgBEEBdUF+cSIFQQAgBUEAShtBAmoiBSAEQf////8Hc0sNASAAIAUgBGoiBDYC/AMgACADIARBAnQQuwIiAzYC9AMgA0UNASAAKAL4AyEEC0EBIQUgACAEQQFqNgL4AyADIARBAnRqIAE2AgACQCAAKAL4AyIEQQFIDQAgACgChAQhBgNAIAAoAoQDIAAoAvQDIARBAnRqQXxqKAIAQQJ0QXhxaigCACEDIAAgBEF/aiIENgL4AwJAIAAoAtQDIANBAnRqIgcoAgAiAUHAAEkNACAHQQRqIQhBASEEAkACQAJAAkADQAJAIAAoAugDIAggBEECdGooAgAiA0EBdSIFaiIJLQAADQAgACgChAMgBUEDdGoiBSgCBCIKQQFIDQAgBSgCAEF/Rg0CIAIgCnZBAXFFDQIgCUEBOgAAAkACQCAAKAL4AyIFIAAoAvwDRg0AIAAoAvQDIQEMAQsgBUEBdUF+cSIBQQAgAUEAShtBAmoiASAFQf////8Hc0sNBCAAIAEgBWoiBTYC/AMgACAAKAL0AyAFQQJ0ELsCIgE2AvQDIAFFDQQgACgC+AMhBQsgACAFQQFqNgL4AyABIAVBAnRqIAM2AgACQAJAIAAoAoQEIgUgACgCiARGDQAgACgCgAQhAQwBCyAFQQF1QX5xIgFBACABQQBKG0ECaiIBIAVB/////wdzSw0FIAAgASAFaiIFNgKIBCAAIAAoAoAEIAVBAnQQuwIiATYCgAQgAUUNBSAAKAKEBCEFCyAAIAVBAWo2AoQEIAEgBUECdGogAzYCACAHKAIAIQELIARBAWoiBCABQQV2Tw0EDAALAAsCQCAGIAAoAoQEIgNODQAgBiEEA0AgACgC6AMgACgCgAQgBEECdGooAgBBAXVqQQA6AAAgBEEBaiIEIAAoAoQEIgNIDQALC0EAIQUgAyAGTA0FIAAgBjYChAQMBQtBARDbAkGAgIAQQQAQAAALQQEQ2wJBgICAEEEAEAAACyAAKAL4AyEEC0EBIQUgBEEBTg0ACwsgBQ8LQQEQ2wJBgICAEEEAEAAAC+UEAQd/AkACQCACKAIAIgMNACACKAIEIQQMAQtBACEEIAJBADYCBAsCQAJAAkAgBCACKAIIRw0AIARBAXVBfnEiBUEAIAVBAEobQQJqIgUgBEH/////B3NLDQEgAiAFIARqIgQ2AgggAiADIARBAnQQuwIiAzYCACADRQ0BIAIoAgQhBAsgAiAEQQFqNgIEIAMgBEECdGogATYCAAJAIAAoAvwCRQ0AIAAoAugDIAFBAXUiBmpBAToAAAJAIAAoAvACIgcgACgC+AIoAgAiBEwNAANAAkAgACgC6AMgACgC7AIgB0F/aiIHQQJ0aigCACIDQQF1IghqLQAARQ0AAkACQCAAKAKEAyAIQQN0aigCACIEQX9HDQACQAJAIAIoAgQiBCACKAIIRg0AIAIoAgAhAQwBCyAEQQF1QX5xIgFBACABQQBKG0ECaiIBIARB/////wdzSw0IIAIgASAEaiIENgIIIAIgAigCACAEQQJ0ELsCIgE2AgAgAUUNCCACKAIEIQQLIAIgBEEBajYCBCABIARBAnRqIANBAXM2AgAMAQsgACgC1AMgBEECdGoiCSgCACIDQcAASQ0AIAlBBGohBUEBIQQDQAJAIAAoAoQDIAUgBEECdGooAgBBAXUiAUEDdGooAgRBAUgNACAAKALoAyABakEBOgAAIAkoAgAhAwsgBEEBaiIEIANBBXZJDQALCyAAKALoAyAIakEAOgAAIAAoAvgCKAIAIQQLIAcgBEoNAAsLIAAoAugDIAZqQQA6AAALDwtBARDbAkGAgIAQQQAQAAALQQEQ2wJBgICAEEEAEAAAC+EDAgF8DH8gACsDgAIhASAAKALwASAAKAL0ASICIABB1ANqIgMQbwJAIAAoAvQBIgRBAUgNACABIAK3oyEBIAAoAtQDIQVBACECQQAhBgNAAkACQCAFIAAoAvABIgcgAkECdGooAgAiCEECdCIJaiIKKAIAIgtB4ABJDQACQCAAKALIAiAKKAIEIgxBAXUiDWotAAAgDEEBcUcNACAAKAKEAyANQQN0aigCACIMQX9GDQAgDCAIRg0BCyAKQQRqIQwCQCACIARBAm1IDQAgASAMIAtBBXZBAnRqKgIAu2RFDQELIAAgCEEAEGYCQCAAKALIAiAMKAIAIghBAXUiB2otAAAgCEEBcUcNACAAKAKEAyAHQQN0aiIHKAIAIghBf0YNACADKAIAIAhBAnRqIApHDQAgB0F/NgIACyAKIAooAgBBfHFBAXI2AgAgACAAKALUAyIFIAlqKAIAIgpBBXYgACgC4ANqIApBA3ZBAXFqQQFqNgLgAwwBCyAHIAZBAnRqIAg2AgAgBkEBaiEGCyACQQFqIgIgACgC9AEiBEgNAAsgAiAGayICQQFIDQAgACAEIAJrNgL0AQsCQCAAKwNQIAAoAtgDuKIgACgC4AO4Y0UNACAAIAAoAgAoAggRAwALC5IFAgx/AX0CQAJAIAFBD0oNACAAIQMMAQsDQCACKAIAIgQgACABQQF0QXxxaigCAEECdGoiBUEEaiEGIAEhB0F/IQgDQCAFKAIAIQkCQCAEIAAgCEEBaiIIQQJ0aiIDKAIAIgpBAnRqIgsoAgAiDEHgAEkNAAJAIAlBBXYiDUECRw0AA0AgBCAAIAhBAWoiCEECdGoiAygCACIKQQJ0aigCAEHfAEsNAAwCCwALIAsgDEEFdkECdGoqAgQgBiANQQJ0aioCACIPXUUNAANAIAQgACAIQQFqIghBAnRqIgMoAgAiCkECdGoiCygCACIMQd8ATQ0BIAsgDEEDdkH8////AXFqKgIEIA9dDQALCyAAIAdBf2oiB0ECdGoiDSgCACELAkAgCUHgAEkNACAGIAlBA3ZB/P///wFxaiEOA0ACQCAEIAtBAnRqIgwoAgBBBXYiCUECRg0AIA4qAgAgDCAJQQJ0aioCBF1FDQILIAAgB0F/aiIHQQJ0aiINKAIAIQsMAAsACwJAIAggB04NACADIAs2AgAgDSAKNgIADAELCyAAIAggAhBvIAMhACABIAhrIgFBEE4NAAsLAkAgAUECSA0AIAFBfmohCiACKAIAIQtBACEIA0AgCCEAIAhBAWoiDiEHA0ACQCALIAMgB0ECdGooAgBBAnRqIgwoAgAiCUHgAEkNAAJAIAsgAyAAQQJ0aigCAEECdGoiBCgCAEEFdiINQQJGDQAgDCAJQQV2QQJ0aioCBCAEIA1BAnRqKgIEXUUNAQsgByEACyAHQQFqIgcgAUcNAAsgAyAIQQJ0aiIHKAIAIQwgByADIABBAnRqIgkoAgA2AgAgCSAMNgIAIAggCkYhByAOIQggB0UNAAsLC+8CAQx/AkAgASgCBEEBSA0AIAAoAtQDIQJBACEDQQAhBANAAkACQCACIAEoAgAiBSADQQJ0aigCACIGQQJ0IgdqIggoAgAiCUEgSQ0AIAhBBGohCiAJQQV2IQsgACgCyAIhDEEAIQkCQANAIAwgCiAJQQJ0aigCACINQQF1ai0AACANQQFxRg0BIAlBAWoiCSALRg0CDAALAAsgACAGQQAQZgJAIAAoAsgCIAooAgAiCUEBdSINai0AACAJQQFxRw0AIAAoAoQDIA1BA3RqIg0oAgAiCUF/Rg0AIAAoAtQDIAlBAnRqIAhHDQAgDUF/NgIACyAIIAgoAgBBfHFBAXI2AgAgACAAKALUAyICIAdqKAIAIglBBXYgACgC4ANqIAlBA3ZBAXFqQQFqNgLgAwwBCyAFIARBAnRqIAY2AgAgBEEBaiEECyADQQFqIgMgASgCBCIJSA0ACyADIARrIg1BAUgNACABIAkgDWs2AgQLC5oCAQV/IwBBEGsiASQAIAFBADYCDCABQgA3AgQCQCAAKAKIAyICQQFIDQBBACEDQQAhBANAAkAgACgC4AIgA2otAABFDQAgACgCyAIgA2otAABBAnFFDQACQCABKAIIIgIgASgCDEcNAAJAIAJBAXVBfnEiBUEAIAVBAEobQQJqIgUgAkH/////B3NLDQAgASAFIAJqIgU2AgwgASAEIAVBAnQQuwIiBDYCBCAEDQELQQEQ2wJBgICAEEEAEAAACyABIAJBAWo2AgggBCACQQJ0aiADNgIAIAAoAogDIQILIANBAWoiAyACSA0ACwsgAEGsA2ogAUEEahByAkAgASgCBCIDRQ0AIAFBADYCCCADELoCCyABQRBqJAAL9gQCC38DfCAAKAIEIQICQAJAAkAgACgCCEEBSA0AIAAoAhAhA0EAIQQDQCADIAIgBEECdGooAgBBAnRqQX82AgAgBEEBaiIEIAAoAghIDQAMAgsACyACRQ0BCyAAQQA2AggLAkACQCABKAIEQQFIDQBBACEDA0AgACgCECABKAIAIANBAnRqIgUoAgBBAnRqIAM2AgACQCAAKAIIIgQgACgCDEcNACAEQQF1QX5xIgZBACAGQQBKG0ECaiIGIARB/////wdzSw0DIAAgBiAEaiIENgIMIAAgAiAEQQJ0ELsCIgI2AgQgAkUNAyAAKAIIIQQLIAUoAgAhBSAAIARBAWo2AgggAiAEQQJ0aiAFNgIAIANBAWoiAyABKAIESA0ACyAAKAIIIgRBAkgNACAEQQF2IQcgACgCECEIA0AgAiAHIglBf2oiB0ECdGooAgAhCiAIIQsgByEDAkAgB0EBdCIBQQFyIgUgACgCCCIGTg0AIAAoAgAoAgAiDCAKQQN0aisDACENIAAoAhAhCyAHIQMDQAJAAkACQCABQQJqIgQgBkgNACAMIAIgBUECdGooAgAiAUEDdGorAwAhDgwBCyAMIAIgBEECdGooAgAiAUEDdGorAwAiDiAMIAIgBUECdGooAgAiBkEDdGorAwAiD2QNASAPIQ4gBiEBCyAFIQQLIA4gDWRFDQEgAiADQQJ0aiABNgIAIAsgAUECdGogAzYCACAEIQMgBEEBdCIBQQFyIgUgACgCCCIGSA0ACyAEIQMLIAIgA0ECdGogCjYCACALIApBAnRqIAM2AgAgCUEBSg0ACwsPC0EBENsCQYCAgBBBABAAAAu9AQEBfwJAAkAgAC0A4AFBAUcNACAAEGNBf0YNAQsgAEEAOgDgAUEADwtBASEBAkAgACgC8AIgACgClANGDQAgACkDmANCAFUNACAAIABB8AFqEHACQCAALQDQA0EBRw0AIAAgAEHkAWoQcAsCQCAAKwNQIAAoAtgDuKIgACgC4AO4Y0UNACAAIAAoAgAoAggRAwALIAAQcSAAIAAoAvACNgKUAyAAIAApA8gBIAApA8ABfDcDmANBASEBCyABC/0UBBp/AX4FfAF9IwBBwABrIgIkACACQQA2AjggAkIANwIwIAAgACkDkAFCAXw3A5ABIABB1ANqIQMgAEHwAmohBCACQRhqIQUgAkEUaiEGIAJBEGohByACQSBqIQhBACEJAkACQANAAkAgABBjIgpBf0cNAAJAIAFBAEgNACAJIAFODQMLA0AgAC0AwAQNAwJAIAApA7AEIhxCAFMNACAAKQOwASAcWg0ECwJAIAApA7gEIhxCAFMNACAAKQOoASAcWg0ECwJAIAAoAvwCDQAgABBzDQBBASELDAULAkAgACsDmAQgACgC9AEgACgC8AJrt2VFDQAgABBuCwJAAkAgACgC/AIiCiAAKAKkA04NAANAAkACQCAAKALIAiAAKAKgAyAKQQJ0aigCACIMQQF1ai0AACILIAxBAXEiDUcNACAAKALwAiELAkAgCiAAKAKAA0YNACAAKAL4AiEMDAILAkAgCkEBdUF+cSIMQQAgDEEAShtBAmoiDCAKQf////8Hc0sNACAAIAwgCmoiCjYCgAMgACAAKAL4AiAKQQJ0ELsCIgw2AvgCIAxFDQAgACgC/AIhCgwCC0EBENsCQYCAgBBBABAAAAsCQCALIA1zQQFHDQBBASELIAAgDEEBcyAAQRBqEG0MCQsgDEF+Rw0DDAILIAAgCkEBajYC/AIgDCAKQQJ0aiALNgIAIAAoAvwCIgogACgCpANIDQALCyAAIAApA5gBQgF8NwOYAQJAIAAQaiIMQX5HDQBBACELDAYLIAAoAvwCIQoLIAAoAvACIQ0CQAJAAkAgCiAAKAKAA0YNACAAKAL4AiELDAELIApBAXVBfnEiC0EAIAtBAEobQQJqIgsgCkH/////B3NLDQEgACALIApqIgo2AoADIAAgACgC+AIgCkECdBC7AiILNgL4AiALRQ0BIAAoAvwCIQoLIAAgCkEBajYC/AIgCyAKQQJ0aiANNgIAIAAoAsgCIAxBAXUiCmogDEEBcToAACAAKAKEAyAKQQN0aiAANQL8AkIghkL/////D4Q3AgAgACAAKALwAiIKQQFqNgLwAiAAKALsAiAKQQJ0aiAMNgIAIAAQYyIKQX9GDQEMAgsLQQEQ2wJBgICAEEEAEAAACyAAIAApA7ABQgF8NwOwAUEBIQsgACgC/AJFDQICQCACKAIwRQ0AIAJBADYCNAsgACAKIAJBMGogAkE8ahBrIAAgAigCPBBpAkACQAJAIAIoAjRBAUcNACAAKALIAiACKAIwKAIAIgpBAXUiDGogCkEBcToAACAAKAKEAyAMQQN0aiAANQL8AkIghkL/////D4Q3AgAMAQsgAyACQTBqQQEQMiEOAkACQCAAKAL0ASIKIAAoAvgBRg0AIAAoAvABIQwMAQsgCkEBdUF+cSIMQQAgDEEAShtBAmoiDCAKQf////8Hc0sNAiAAIAwgCmoiCjYC+AEgACAAKALwASAKQQJ0ELsCIgw2AvABIAxFDQIgACgC9AEhCgsgACAKQQFqNgL0ASAMIApBAnRqIA42AgAgACAOEGQgACgC1AMiDCAOQQJ0aiIKIAooAgBBA3ZB/P///wFxaiIKIAArA4ACIh0gCioCBLugtiIiOAIEAkAgIrtEQIy1eB2vFURkRQ0AAkAgACgC9AEiC0EBSA0AIAtBAXEhDyAAKALwASEQQQAhCgJAIAtBAUYNACALQf7///8HcSERQQAhCkEAIQsDQCAMIBAgCkECdGoiDSgCAEECdGoiEiASKAIAQQN2Qfz///8BcWoiEiASKgIEu0QjQpIMoZzHO6K2OAIEIAwgDUEEaigCAEECdGoiDSANKAIAQQN2Qfz///8BcWoiDSANKgIEu0QjQpIMoZzHO6K2OAIEIApBAmohCiALQQJqIgsgEUcNAAsLIA9FDQAgDCAQIApBAnRqKAIAQQJ0aiIKIAooAgBBA3ZB/P///wFxaiIKIAoqAgS7RCNCkgyhnMc7orY4AgQLIAAgHUQjQpIMoZzHO6I5A4ACCyAAKALIAiACKAIwKAIAIgpBAXUiDGogCkEBcToAACAAKAKEAyAMQQN0aiAANQL8AkIghiAOrYQ3AgALIAlBAWohCSAAIAAoAvACIgxBAWo2AvACIAAoAuwCIAxBAnRqIAo2AgAgACAAKAKoBEF/aiIKNgKoBCAAIAArA5gCRAAAAAAAAPA/IAArAyCjojkDmAIgACAAKwOAAkQAAAAAAADwPyAAKwMoo6I5A4ACIAoNASAAIAArA4ABIAArA6AEoiIdOQOgBCAAIAArA3AgACsDmASiIh45A5gEAkACQCAdmUQAAAAAAADgQWNFDQAgHaohCgwBC0GAgICAeCEKCyAAIAo2AqgEIAAoAhxBAUgNASAAKAL4AiINIAQgACgC/AIiCxsoAgAhCiAAKAK4ASEMIAAoAogDIRIgACgC9AEiE7chHSAAKQPIASEcIAtBAEghEAJAAkAgHplEAAAAAAAA4EFjRQ0AIB6qIRQMAQtBgICAgHghFAsgErchHyAMIAprIRUgHLogHaMhICAAKALAASEWIAAoAugBIRcgACgCsAEhGAJAAkAgEEUNAEQAAAAAAAAAACEdDAELIAq3IR0gC0UNAEQAAAAAAADwPyAfoyEeIA1BfGohGUEBIQogC0EBcSEaAkAgC0EBRg0AIAtB/v///wdxIRtBACESQQEhCgNAIAQgDSAKQQJ0IgxqIhAgCiALRhsoAgAhESAZIAxqKAIAIQ4gHiAKuBDnASEhIAQgDSAKQQFqIgxBAnRqIAwgC0YbKAIAIQ8gECgCACEQIB4gDLgQ5wEgDyAQa7eiICEgESAOa7eiIB2goCEdIApBAmohCiASQQJqIhIgG0cNAAsLIBpFDQAgBCANIApBAnQiDGogCiALRhsoAgAhCyAZIAxqKAIAIQwgHiAKuBDnASALIAxrt6IgHaAhHQsgBSAgOQMAIAYgEzYCACAHIBQ2AgAgCCAdIB+jRAAAAAAAAFlAojkDACACIBY2AgwgAiAXNgIIIAIgFTYCBCACIBg2AgBBspqAECACEPEBGgwBCwtBARDbAkGAgIAQQQAQAAALIAAoAogDtyEfAkACQCAAKAL8AiILQQBODQBEAAAAAAAAAAAhHQwBCyAAKAL4AiINIAQgCxsoAgC3IR0gC0UNAEQAAAAAAADwPyAfoyEeIA1BfGohCUEBIQogC0EBcSEbAkAgC0EBRg0AIAtB/v///wdxIRlBACESQQEhCgNAIAQgDSAKQQJ0IgxqIhAgCiALRhsoAgAhESAJIAxqKAIAIQ4gHiAKuBDnASEhIAQgDSAKQQFqIgxBAnRqIAwgC0YbKAIAIQ8gECgCACEQIB4gDLgQ5wEgDyAQa7eiICEgESAOa7eiIB2goCEdIApBAmohCiASQQJqIhIgGUcNAAsLIBtFDQAgBCANIApBAnQiDGogCiALRhsoAgAhCyAJIAxqKAIAIQwgHiAKuBDnASALIAxrt6IgHaAhHQsgACAdIB+jOQPIAyAAQQAQaUECIQsLAkAgAigCMCIARQ0AIAJBADYCNCAAELoCCyACQcAAaiQAIAsL0wQDBn8CfAF+AkAgACgCBEUNACAAQQA2AggLAkAgACgCEEUNACAAQQA2AhQLQQEhAQJAIAAtAOABQQFHDQAgACAAKAJ4IgI2AqgEIAAgACkDiAFCAXw3A4gBIAAgArc5A6AEIAAgACsDaCAAKALoAbeiOQOYBAJAIAAoAhxBAUgNAEG1kIAQEPwBGkGpgIAQEPwBGkH5gIAQEPwBGkHVkYAQEPwBGgsgAEEEaiEDQQAhBANAIAArA2AhBwJAAkACQAJAIAAtAEBBAUcNAEEBIQVBACECQQAhASAEDQEMAgsgBLghCAwCCwNAIAFBAWohASAFQQF0IgJBAXIhBSACIARIDQALCyAEIQUCQCACIARGDQADQCABQX9qIQEgAkEBdSIGQX9qIgIgBSAGbyIFRw0ACwsgAbchCAsgACgCWCECAkACQCAHIAgQ5wEgAreiIgeZRAAAAAAAAOBBY0UNACAHqiECDAELQYCAgIB4IQILIAAgAhB0IQECQCAALQDABA0AAkAgACkDsAQiCUIAUw0AIAApA7ABIAlaDQELIAApA7gEIglCf1UgACkDqAEgCVpxDQAgBEEBaiEEIAFB/wFxQQFLDQELCwJAIAAoAhxBAUgNAEHVkYAQEPwBGgsCQAJAIAFB/wFxIgINACADIAAoAogDEHYgACgCiANBAUgNAUEAIQIDQCAAKAIEIAJqIAAoAsgCIAJqLQAAOgAAIAJBAWoiAiAAKAKIA0gNAAwCCwALIAJBAUcNACAAKAIUDQAgAEEAOgDgAQsgAEEAEGkLIAELtgEBA38CQAJAIAAoAgQgAU4NAAJAIAAoAggiAiABTg0AIAJBAXVBfnFBAmoiAyABIAJrQQFqQX5xIgQgAyAEShsiAyACQf////8Hc0oNAiAAIAMgAmoiAjYCCCAAIAAoAgAgAhC7AiICNgIAIAINABCyASgCAEEwRg0CCwJAIAEgACgCBCICTA0AIAAoAgAgAmpBACABIAJrELgBGgsgACABNgIECw8LQQEQ2wJBgICAEEEAEAAAC9cCAQd/IwBBEGsiBSQAAkACQCACKAIAIgZBIEkNACACQQRqIQcgBkEFdiEIIAAoAsgCIQlBACEKA0AgCSAHIApBAnRqKAIAIgtBAXVqLQAAIAtBAXFGDQIgCkEBaiIKIAhHDQALQQAhCgNAAkAgACgCyAIgByAKQQJ0aigCACIJQQF1IgtqLQAAIAlBAXEiCXNB/wFxQQFGDQBBppeAEEHHqIAQIAkbIQkCQAJAIAMoAgQgC0wNACADKAIAIAtBAnRqKAIAIgZBf0YNACAGQQFqIQYMAQsgBUF/NgIMIAMgC0EBaiAFQQxqEDogBCAEKAIAIghBAWoiBjYCACADKAIAIAtBAnRqIAg2AgALIAUgBjYCBCAFIAk2AgAgAUHEmYAQIAUQxQEaIAIoAgAhBgsgCkEBaiIKIAZBBXZJDQALC0G5oYAQQQJBASABENABGgsgBUEQaiQAC1IBAn8jAEEQayIDJAACQCABQfWGgBAQxAEiBA0AIAMgATYCAEEAKAKgr4EQQfyegBAgAxDFARpBARABAAsgACAEIAQQeSAEELwBGiADQRBqJAAL2AkBD38jAEHAAGsiAyQAAkACQCAALQDgAQ0AQaihgBBBE0EBIAEQ0AEaDAELIANCADcCOEEAIQQgA0EANgIwAkACQCAAKALoASIFQQFODQBBACEGQQAhB0EAIQgMAQsgACgCyAIhCSAAKALUAyEKIAAoAuQBIQtBACEGQQAhCANAAkACQCAKIAsgCEECdGooAgBBAnRqIgwoAgAiDUEfTQ0AIAxBBGohDiANQQV2IQ9BACEMA0AgCSAOIAxBAnRqKAIAIg1BAXVqLQAAIA1BAXFGDQIgDEEBaiIMIA9HDQALCyAGQQFqIQYLIAhBAWoiCCAFRw0AC0EAIQdBACEQQQAhCEEAIQoCQANAAkAgACgC1AMgACgC5AEgEEECdGooAgBBAnRqIhEoAgAiCUEgSQ0AIBFBBGohDiAJQQV2IQsgACgCyAIhD0EAIQwDQCAPIA4gDEECdGooAgAiDUEBdWotAAAgDUEBcUYNASAMQQFqIgwgC0cNAAtBACEMA0ACQCAAKALIAiAOIAxBAnRqKAIAIg9BAXUiDWotAAAgD0EBcXNB/wFxQQFGDQACQAJAIAMoAjgiDyANTA0AIAogDUECdGooAgBBf0YNAQwCCwJAIAMoAjwiCSANSg0AIAlBAXVBfnFBAmoiCyANIAlrQQJqQX5xIgcgCyAHShsiCyAJQf////8Hc0oNBiADIAsgCWoiCTYCPCADIAogCUECdBC7AiIHNgI0IAchCiAHDQBBACEHQQAhChCyASgCAEEwRg0GCyAKIA9BAnRqQf8BIA1BAWoiCSAPa0ECdBC4ARogAyAJNgI4CyAKIA1BAnRqIAg2AgAgCEEBaiEIIBEoAgAhCQsgDEEBaiIMIAlBBXZJDQALIAAoAugBIQULIBBBAWoiECAFTg0CDAALAAtBARDbAkGAgIAQQQAQAAALIAMgCDYCMCAAKAKkAyEMIAMgCDYCICADIAwgBmoiCzYCJCABQZKggBAgA0EgahDFARoCQCAAKAKkA0EATA0AAkADQAJAAkACQCADKAI4Ig4gACgCoAMgBEECdGooAgAiDUEBdSIMTA0AIAcgDEECdGooAgAiDkF/Rg0BIA5BAWohDAwCCwJAIAMoAjwiDyAMSg0AIA9BAXVBfnFBAmoiCSAMIA9rQQJqQX5xIgogCSAKShsiCSAPQf////8Hc0oNBCADIAkgD2oiDzYCPCAHIA9BAnQQuwIiBw0AQQAhBxCyASgCAEEwRg0ECyAHIA5BAnRqQf8BIAxBAWoiDyAOa0ECdBC4ARogAyAPNgI4CyAHIAxBAnRqIAg2AgAgCEEBaiIMIQgLIAMgDDYCFCADQaaXgBBBx6iAECANQQFxGzYCECABQaChgBAgA0EQahDFARogBEEBaiIEIAAoAqQDSA0ADAILAAtBARDbAkGAgIAQQQAQAAALIAMgCDYCMCADIAc2AjQCQCAAKALoAUEBSA0AQQAhDANAIAAgASAAKALUAyAAKALkASAMQQJ0aigCAEECdGogA0E0aiADQTBqEHcgDEEBaiIMIAAoAugBSA0ACwsCQCAAKAIcQQBMDQAgAyALNgIAIAMgAygCMDYCBEHZooAQIAMQ8AEaCyADKAI0IgxFDQAgA0EANgI4IAwQugILIANBwABqJAAL6g0BEn8CQCAAKAK8AiICQQFIDQBBACEDA0ACQCAAKAKsAiAAKAK4AiADQQJ0aiIEKAIAIgVqLQAARQ0AQQAhAkEAIQYCQCAAKAKgAiAFQQxsaiIFKAIEIgdBAUgNAANAAkAgACgCxAIoAgAgBSgCACIIIAJBA3RqIgkoAgBBAnRqKAIAQQNxQQFGDQAgCCAGQQN0aiAJKQIANwIAIAZBAWohBiAFKAIEIQcLIAJBAWoiAiAHSA0ACyACIAZrIgJBAUgNACAFIAcgAms2AgQLIAAoAqwCIAQoAgBqQQA6AAAgACgCvAIhAgsgA0EBaiIDIAJIDQALCwJAIAAoArgCRQ0AIABBADYCvAILAkAgACgCiANBAUgNAEEAIQoDQCAKQRhsIQtBASEMQQAhAgNAQQAhCQJAIAAoAqACIAJBDGxqIAtqIg0oAgRBAEwNAAJAAkADQAJAAkAgACgC1AMgDSgCACAJQQN0aiIDKAIAQQJ0aiIFKAIAIgZBEHFFDQAgAyAFKAIENgIADAELIAEoAggiByECAkAgByAGQQV2IAEtABAgBkEEcSIEQQJ2ciIIQQFxakEBaiIOIAEoAgQiD2oiBk8NAAJAA0AgAiAGTw0BIAEgAiACQQF2IAJBA3ZqQX5xakECaiICNgIIIAIgB0sNAAtBARDbAkGAgIAQQQAQAAALAkAgASgCACACQQJ0ELsCIgINABCyASgCAEEwRg0ECyABIAI2AgAgASgCBCIPIA5qIQYLIAEgBjYCBCAGIA9JDQMgASgCACAPQQJ0aiIQIAQgECgCAEFgcXIgCEH/AXEiDkEAR0EDdCICcjYCACAQIAQgBSgCACIRQWBxciACcjYCAAJAIAUoAgBBIEkNACAQQQRqIQcgBUEEaiEIQQAhAgNAIAcgAkECdCIGaiAIIAZqKAIANgIAIAJBAWoiAiAFKAIAQQV2SQ0ACwsCQCAORQ0AAkAgBEUNACAQIBFBA3ZB/P///wFxakEANgIEDAELIBFBBXYhEkEAIQYCQCARQSBJDQAgEkEDcSERIBBBBGohBEEAIQhBACEGQQAhAgJAIBJBf2pBA0kNACASQfz//z9xIRNBACEGQQAhAkEAIQ4DQEEBIAQgAkECdGoiB0EMaigCAEEBdnRBASAHQQhqKAIAQQF2dEEBIAdBBGooAgBBAXZ0QQEgBygCAEEBdnQgBnJycnIhBiACQQRqIQIgDkEEaiIOIBNHDQALCyARRQ0AA0BBASAEIAJBAnRqKAIAQQF2dCAGciEGIAJBAWohAiAIQQFqIgggEUcNAAsLIBAgEkECdGogBjYCBAsgAyAPNgIAIAUgDzYCBCAFIAUoAgAiAkEQcjYCACABKAIAIAMoAgBBAnRqIgYgBigCAEF8cSACQQNxcjYCAAJAIAEoAgAgAygCAEECdGoiDigCACICQQRxRQ0AIA4gAkEDdkH8////AXFqIAVBBGogBSgCAEEDdkH8////AXFqKgIAOAIEDAELIAJBCHFFDQAgAkEFdiEQQQAhBgJAIAJBIEkNACAQQQNxIQQgDkEEaiEIQQAhB0EAIQZBACECAkAgEEF/akEDSQ0AIBBB/P//P3EhD0EAIQZBACECQQAhAwNAQQEgCCACQQJ0aiIFQQxqKAIAQQF2dEEBIAVBCGooAgBBAXZ0QQEgBUEEaigCAEEBdnRBASAFKAIAQQF2dCAGcnJyciEGIAJBBGohAiADQQRqIgMgD0cNAAsLIARFDQADQEEBIAggAkECdGooAgBBAXZ0IAZyIQYgAkEBaiECIAdBAWoiByAERw0ACwsgDiAQQQJ0aiAGNgIECyAJQQFqIgkgDSgCBE4NAwwACwALQQEQ2wJBgICAEEEAEAAAC0EBENsCQYCAgBBBABAAAAtBASECIAxBAXEhBkEAIQwgBg0ACyAKQQFqIgogACgCiANIDQALCwJAIAAoAvACIgVBAUgNACAAQdQDaiEJQQAhAgNAAkAgACgChAMiCCAAKALsAiACQQJ0aigCAEECdEF4cWoiBygCACIGQX9GDQACQCAJKAIAIAZBAnRqIgMtAABBEHENACAAKALIAiADKAIEIgNBAXUiBGotAAAgA0EBcUcNASAIIARBA3RqKAIAIghBf0YNASAIIAZHDQELIAkgByABEFAgACgC8AIhBQsgAkEBaiICIAVIDQALCwJAIAAoAvQBQQFIDQAgAEHUA2ohBkEAIQIDQCAGIAAoAvABIAJBAnRqIAEQUCACQQFqIgIgACgC9AFIDQALCwJAIAAoAugBQQFIDQAgAEHUA2ohBkEAIQIDQCAGIAAoAuQBIAJBAnRqIAEQUCACQQFqIgIgACgC6AFIDQALCwvSAQEDfyMAQSBrIgEkACAAKALgAyECIAAoAtgDIQMgAUEQakIANwMAIAFCADcDCCABQQhqIAMgAmsQMyABQQA6ABggACABQQhqEHoCQCAAKAIcQQJIDQAgACgC2AMhAiABIAEoAgxBAnQ2AgQgASACQQJ0NgIAQeSagBAgARDwARoLIAAgAS0AGDoA5AMCQCAAKALUAyICRQ0AIAIQugILIAAgASgCCDYC1AMgACABKAIMNgLYAyAAIAEoAhA2AtwDIAAgASgCFDYC4AMgAUEgaiQAC/0GAEHgy4EQQfiCgBBBmYeAEEGhj4AQQcyPgBAQHRpBAELmzJmz5syZ9z83A5DMgRBBAEKAgICAgICA+D83A4DMgRBBAEIANwP4y4EQQQBB9KqAEDYC4MuBEEEAQQA7AYjMgRBBmMyBEEGCg4AQQfiGgBBBoY+AEEHMj4AQEB0aQQBCq47ayO35/fc/NwPIzIEQQQBCgICAgICAgPg/NwO4zIEQQQBCADcDsMyBEEEAQfSqgBA2ApjMgRBBAEEAOwHAzIEQQdDMgRBBmIiAEEGXjIAQQaGPgBBBzI+AEBAdGkEAQgA3A4DNgRBBAEGBAjsB+MyBEEEAQoCAgICAgID4PzcD8MyBEEEAQgA3A+jMgRBBAEH0qoAQNgLQzIEQQYjNgRBBuY6AEEH0iIAQQaGPgBBBzI+AEBAdGkEAQoCAgKC/uPbKwQA3A7jNgRBBAEKAgICAgICA+P8ANwOozYEQQQBCADcDoM2BEEEAQfSqgBA2AojNgRBBAEEAOwGwzYEQQcDNgRBB6YyAEEHrl4AQQaGPgBBB3Y+AEBAdGkEAQQI2AtzNgRBBAEKAgICAIDcC1M2BEEEAQdCogBA2AsDNgRBB4M2BEEHAi4AQQbKYgBBBoY+AEEHdj4AQEB0aQQBBAjYC/M2BEEEAQoCAgIAgNwL0zYEQQQBB0KiAEDYC4M2BEEGAzoEQQaeEgBBBmYKAEEGhj4AQQbyPgBAQHRpBAEHAqYAQNgKAzoEQQQBBADoAlM6BEEGYzoEQQfOCgBBBpo2AEEGhj4AQQbyPgBAQHRpBAEEBOgCszoEQQQBBwKmAEDYCmM6BEEGwzoEQQbODgBBB+4mAEEGhj4AQQd2PgBAQHRpBAEHkADYCzM6BEEEAQoGAgIDw/////wA3AsTOgRBBAEHQqIAQNgKwzoEQQdDOgRBB046AEEG8h4AQQaGPgBBBzI+AEBAdGkEAQoCAgICAgICAwAA3A4DPgRBBAEKAgICAgICA+P8ANwPwzoEQQQBCgICAgICAgPg/NwPozoEQQQBB9KqAEDYC0M6BEEEAQQA7AfjOgRBBiM+BEEHdjoAQQeqNgBBBoY+AEEHMj4AQEB0aQQBCmrPmzJmz5uQ/NwO4z4EQQQBCgICAgICAgPj/ADcDqM+BEEEAQgA3A6DPgRBBAEH0qoAQNgKIz4EQQQBBADsBsM+BEAslAAJAIAANAEF+DwsCQCAAKAIQQc84Rw0AIAAQiAEPCyAAEJ0BCwoAIABBfyABEH8L3QUCCH8BfiMAQSBrIgMkAEEAIQQCQCAARQ0AQagBELgCIgVFDQBBACEGIAVBADYCaCAFQoCAgICAgAg3AhwgBUL/////DzcDSCAFQQA2AhAgBUEANgIsAkACQCACLQAAIgdFDQBBACEIQQAhCUEAIQoDQCACIQQCQAJAIAdBUGpB/wFxIgJBCUsNACAFIAI2AkgMAQsCQAJAAkACQAJAAkACQAJAAkACQCAHQf8BcUFVag5ODAoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCAoKCgoKCgoKCgoKBwoJCgoKCgoKCgoKCgoKAgoKCgMFCgYKCgoKCgoKCgoACgoKCgEECgtBzzghCCAFQc84NgIQDAkLQbHzASEIIAVBsfMBNgIQDAgLQQEhCCAFQQE2AhAMBwtBASEKDAYLQQEhCQwFCyAFQQE2AkwMBAsgBUECNgJMDAMLIAVBAzYCTAwCCyAFQQQ2AkwMAQtBASEGIAVBATYCLAsgBEEBaiECIAQtAAEiBw0ACwJAAkAgCEHPOEYNACAIDQEMAgsgBg0BIAVBATYCLAsgBSAAEIsCQQFqIgcQuAIiBDYCGCAERQ0AIAMgADYCECAEIAdB8oaAECADQRBqEIMCGgJAIAFBAEgNACAFIAE2AhQMAgsgA0G2AzYCACAFIABBAEGABEGACCAIQbHzAUYbQcEBQcEAIAkbciAIQc84RhtBgIAiQYCAAiAKG3IgAxDgASIBNgIUIAFBf0cNASAEELoCCyAFELoCQQAhBAwBCwJAAkACQAJAIAhBAUcNACABQgBBAhDbARogBUGx8wE2AhAMAQsgCEHPOEYNAQsgBUEANgIAQdAAIQQMAQsgAUIAQQEQ2wEhCyAFQgA3A0AgBUEANgIAIAVCACALIAtCf1EbNwM4QTAhBAsgBSAEakEANgIAIAVBADYCcCAFQgA3AwggBUIANwNgIAUhBAsgA0EgaiQAIAQLUwEDfyMAQRBrIgIkAEEAIQMCQCAAQX9GDQBBExC4AiIERQ0AIAIgADYCACAEQRNB1Y+AECACEIMCGiAEIAAgARB/IQMgBBC6AgsgAkEQaiQAIAML0wEBA38jAEEQayIDJAACQCAAKAJoIgRFDQACQCAAKAJkQXxGDQAgBBC6AgsgAEEANgJoCwJAAkAgAUEFag4GAQAAAAABAAsgAEEANgIACyAAIAE2AmQCQCABQXxGDQAgAkUNACAAIAAoAhgiBBCLAiACEIsCakEDahC4AiIBNgJoAkAgAQ0AIABBfDYCZAwBCyAEEIsCIQAgAhCLAiEFIAMgAjYCCCADQdOZgBA2AgQgAyAENgIAIAEgACAFakEDakHghoAQIAMQgwIaCyADQRBqJAALcwEBf0F/IQMCQCAARQ0AIAAoAhBBzzhHDQACQCAAKAJkQQVqDgYAAQEBAQABCwJAIAJBf0oNACAAQX5BiISAEBCBAUF/DwsCQCAAIAEgAhCDASICDQBBfyEDIAAoAmRBBWoOBgABAQEBAAELIAIhAwsgAwv+AwICfgN/AkAgAg0AQQAPCwJAIAAoAmBFDQAgAEEANgJgIAApA1giA1ANAANAAkACQCAAKAIAIgVFDQAgACAFIAOnIAUgAyAFrVMbIgZrNgIAIAAgACgCBCAGajYCBCAAIAApAwggBq0iBHw3AwggAyAEfSEDDAELAkAgACgCQEUNACAAKAJwRQ0DCyAAEIQBQX9HDQBBAA8LIANCAFINAAsLQQAhBwNAAkACQAJAIAAoAgAiBUUNACABIAAoAgQgBSACIAUgAkkbIgUQtwEaIAAgACgCBCAFajYCBCAAIAAoAgAgBWs2AgAMAQsCQCAAKAJARQ0AIAAoAnANACAAQQE2AkQgBw8LAkACQCAAKAIwIgZFDQAgAiAAKAIcQQF0Tw0BCyAAEIQBQX9HDQJBAA8LQQAhBQJAIAZBAUcNAAJAA0AgACgCFCABIAVqIAIgBWsiBkGAgICABCAGQYCAgIAESRsQ/QEiBkEBSA0BIAYgBWoiBSACSQ0ADAMLAAsCQCAGQQBIDQAgAEEBNgJADAILIABBfxCyASgCABCKAhCBAUEADwsgACABNgJ4IAAgAjYCfAJAIAAQhQFBf0cNAEEADwsgACgCACEFIABBADYCAAsgACAAKQMIIAWtfDcDCCAFIAdqIQcgASAFaiEBIAIgBWshAgsgAg0ACyAHC5QCAQN/AkACQANAAkACQAJAAkAgACgCMA4DAAECAwtBfyEBIAAQhgFBf0YNBCAAKAIwDQJBAA8LQQAhASAAQQA2AgAgACgCHEEBdCECIAAoAighAwJAAkADQCAAKAIUIAMgAWogAiABayIBQYCAgIAEIAFBgICAgARJGxD9ASIBQQFIDQEgACAAKAIAIAFqIgE2AgAgASACSQ0ADAILAAsgAUEASA0FIABBATYCQAsgACAAKAIoNgIEQQAPCyAAIAAoAig2AnggACAAKAIcQQF0NgJ8QX8hASAAEIUBQX9GDQILQQAhASAAKAIADQEgACgCQEUNACAAKAJwDQALCyABDwsgAEF/ELIBKAIAEIoCEIEBQX8L8QEBBH8gAEHsAGohASAAKAJ8IQJBACEDAkACQANAAkAgACgCcA0AQX8hBCAAEIcBQX9GDQMgACgCcA0AIABBe0GAjIAQEIEBIAAoAnwhBAwCCwJAAkACQAJAIAFBABCiASIDQQRqDgcBAgADAwMAAwsgAEF+QbqDgBAQgQFBfw8LIABBfEHVgoAQEIEBQX8PCyAAQX0gACgChAEiA0GCiIAQIAMbEIEBQX8PCyAAKAJ8IQQgA0EBRg0BIAQNAAsLIAAgAiAEayIENgIAIAAgACgCeCAEazYCBEEAIQQgA0EBRw0AQQAhBCAAQQA2AjALIAQL8QIBBH8gAEHsAGohAQJAIAAoAhwNACAAIAAoAiAiAhC4AiIDNgIkIAAgAkEBdBC4AiIENgIoAkACQCADRQ0AIAQNAQsgBBC6AiADELoCIABBfEHVgoAQEIEBQX8PCyAAQQA2ApQBIABCADcCjAEgACACNgIcIABCADcCbCABQR9BpZKAEEE4EKEBRQ0AIAAoAigQugIgACgCJBC6AiAAQQA2AhwgAEF8QdWCgBAQgQFBfw8LAkACQAJAIAAoAnAiAkEBSw0AQX8hAiAAEIcBQX9GDQIgACgCcCICDgICAQALIAEoAgAiAy0AAEEfRw0AIAMtAAFBiwFHDQAgARCfARogAEKAgICAIDcCLEEADwsCQCAAKAIsDQAgAEEBNgJAIABBADYCcCAAQQA2AgBBAA8LIAAgACgCKCIBNgIEIAEgACgCbCACELcBGiAAQoGAgIAQNwIsIAAoAnAhAUEAIQIgAEEANgJwIAAgATYCAAsgAguqAwEHf0F/IQECQAJAAkAgACgCZEEFag4GAAEBAQEAAQsCQCAAKAJADQBBACECQQAhAwJAIAAoAnAiBEUNACAAKAJsIQEgACgCJCEDAkACQCAEQQdxIgUNACAEIQYMAQtBACEHIAQhBgNAIAMgAS0AADoAACAGQX9qIQYgA0EBaiEDIAFBAWohASAHQQFqIgcgBUcNAAsLAkAgBEEISQ0AA0AgAyABLQAAOgAAIAMgAS0AAToAASADIAEtAAI6AAIgAyABLQADOgADIAMgAS0ABDoABCADIAEtAAU6AAUgAyABLQAGOgAGIAMgAS0ABzoAByADQQhqIQMgAUEIaiEBIAZBeGoiBg0ACwsgACgCcCEDCyAAKAIcIANrIQEgACgCJCADaiEGAkACQANAIAAoAhQgBiACaiABIAJrIgNBgICAgAQgA0GAgICABEkbEP0BIgNBAUgNASADIAJqIgIgAUkNAAwCCwALIANBAEgNAyAAQQE2AkALIAAgACgCJDYCbCAAIAAoAnAgAmo2AnALQQAhAQsgAQ8LIABBfxCyASgCABCKAhCBAUF/C3oBAn9BfiEBAkAgAEUNACAAKAIQQc84Rw0AAkAgACgCHEUNACAAQewAahCkARogACgCKBC6AiAAKAIkELoCCyAAKAJkIQEgAEEAQQAQgQEgACgCGBC6AiAAKAIUELYBIQIgABC6AkF/QXtBACABQXtGGyACGyEBCyABC80HAQV/IABB//8DcSEDIABBEHYhBEEBIQACQCACQQFHDQAgAyABLQAAaiIAQY+AfGogACAAQfD/A0sbIgAgBGoiA0EQdCIEQYCAPGogBCADQfD/A0sbIAByDwsCQCABRQ0AAkACQAJAAkACQCACQRBJDQACQAJAIAJBrytNDQADQCACQdBUaiECQdsCIQUgASEAA0AgAyAALQAAaiIDIARqIAMgAC0AAWoiA2ogAyAALQACaiIDaiADIAAtAANqIgNqIAMgAC0ABGoiA2ogAyAALQAFaiIDaiADIAAtAAZqIgNqIAMgAC0AB2oiA2ogAyAALQAIaiIDaiADIAAtAAlqIgNqIAMgAC0ACmoiA2ogAyAALQALaiIDaiADIAAtAAxqIgNqIAMgAC0ADWoiA2ogAyAALQAOaiIDaiADIAAtAA9qIgNqIQQgAEEQaiEAIAVBf2oiBQ0ACyAEQfH/A3AhBCADQfH/A3AhAyABQbAraiEBIAJBrytLDQALIAJFDQYgAkEQSQ0BCwNAIAMgAS0AAGoiACAEaiAAIAEtAAFqIgBqIAAgAS0AAmoiAGogACABLQADaiIAaiAAIAEtAARqIgBqIAAgAS0ABWoiAGogACABLQAGaiIAaiAAIAEtAAdqIgBqIAAgAS0ACGoiAGogACABLQAJaiIAaiAAIAEtAApqIgBqIAAgAS0AC2oiAGogACABLQAMaiIAaiAAIAEtAA1qIgBqIAAgAS0ADmoiAGogACABLQAPaiIDaiEEIAFBEGohASACQXBqIgJBD0sNAAsgAkUNBAsgAkEDcSIGDQEgAiEADAILAkAgAkUNAAJAAkAgAkEDcSIGDQAgAiEADAELQQAhByACIQAgASEFA0AgAEF/aiEAIAMgBS0AAGoiAyAEaiEEIAVBAWoiASEFIAdBAWoiByAGRw0ACwsgAkEESQ0AA0AgAyABLQAAaiIFIAEtAAFqIgIgAS0AAmoiByABLQADaiIDIAcgAiAFIARqampqIQQgAUEEaiEBIABBfGoiAA0ACwsgBEHx/wNwQRB0IANBj4B8aiADIANB8P8DSxtyDwtBACEHIAIhACABIQUDQCAAQX9qIQAgAyAFLQAAaiIDIARqIQQgBUEBaiIBIQUgB0EBaiIHIAZHDQALCyACQQRJDQADQCADIAEtAABqIgUgAS0AAWoiAiABLQACaiIHIAEtAANqIgMgByACIAUgBGpqamohBCABQQRqIQEgAEF8aiIADQALCyAEQfH/A3AhBCADQfH/A3AhAwsgBEEQdCADciEACyAACwsAIAAgASACEIkBC4wOAQl/AkAgAQ0AQQAPCyAAQX9zIQACQCACQRdJDQACQCABQQNxRQ0AIAEtAAAgAHNB/wFxQQJ0QeCrgBBqKAIAIABBCHZzIQAgAUEBaiEDAkAgAkF/aiIERQ0AIANBA3FFDQAgAS0AASAAc0H/AXFBAnRB4KuAEGooAgAgAEEIdnMhACABQQJqIQMCQCACQX5qIgRFDQAgA0EDcUUNACABLQACIABzQf8BcUECdEHgq4AQaigCACAAQQh2cyEAIAFBA2ohAwJAIAJBfWoiBEUNACADQQNxRQ0AIAEtAAMgAHNB/wFxQQJ0QeCrgBBqKAIAIABBCHZzIQAgAUEEaiEBIAJBfGohAgwDCyAEIQIgAyEBDAILIAQhAiADIQEMAQsgBCECIAMhAQsgAkEUbiIDQWxsIQUCQAJAIANBf2oiBg0AQQAhB0EAIQhBACEJQQAhCgwBCyADQRRsQWxqIQtBACEKIAEhA0EAIQlBACEIQQAhBwNAIAMoAhAgCnMiBEEWdkH8B3FB4MuAEGooAgAgBEEOdkH8B3FB4MOAEGooAgAgBEEGdkH8B3FB4LuAEGooAgAgBEH/AXFBAnRB4LOAEGooAgBzc3MhCiADKAIMIAlzIgRBFnZB/AdxQeDLgBBqKAIAIARBDnZB/AdxQeDDgBBqKAIAIARBBnZB/AdxQeC7gBBqKAIAIARB/wFxQQJ0QeCzgBBqKAIAc3NzIQkgAygCCCAHcyIEQRZ2QfwHcUHgy4AQaigCACAEQQ52QfwHcUHgw4AQaigCACAEQQZ2QfwHcUHgu4AQaigCACAEQf8BcUECdEHgs4AQaigCAHNzcyEHIAMoAgQgCHMiBEEWdkH8B3FB4MuAEGooAgAgBEEOdkH8B3FB4MOAEGooAgAgBEEGdkH8B3FB4LuAEGooAgAgBEH/AXFBAnRB4LOAEGooAgBzc3MhCCADKAIAIABzIgBBFnZB/AdxQeDLgBBqKAIAIABBDnZB/AdxQeDDgBBqKAIAIABBBnZB/AdxQeC7gBBqKAIAIABB/wFxQQJ0QeCzgBBqKAIAc3NzIQAgA0EUaiEDIAZBf2oiBg0ACyABIAtqIQELIAUgAmohAiABKAIAIABzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBB/wFxQQJ0QeCrgBBqKAIAIAhzIAEoAgRzIABBCHZzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBB/wFxQQJ0QeCrgBBqKAIAIAdzIAEoAghzIABBCHZzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBB/wFxQQJ0QeCrgBBqKAIAIAlzIAEoAgxzIABBCHZzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBB/wFxQQJ0QeCrgBBqKAIAIApzIAEoAhBzIABBCHZzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIgBBCHYgAEH/AXFBAnRB4KuAEGooAgBzIQAgAUEUaiEBCwJAIAJBB00NAANAIAEtAAAgAHNB/wFxQQJ0QeCrgBBqKAIAIABBCHZzIgBBCHYgAS0AASAAc0H/AXFBAnRB4KuAEGooAgBzIgBBCHYgAS0AAiAAc0H/AXFBAnRB4KuAEGooAgBzIgBBCHYgAS0AAyAAc0H/AXFBAnRB4KuAEGooAgBzIgBBCHYgAS0ABCAAc0H/AXFBAnRB4KuAEGooAgBzIgBBCHYgAS0ABSAAc0H/AXFBAnRB4KuAEGooAgBzIgBBCHYgAS0ABiAAc0H/AXFBAnRB4KuAEGooAgBzIgBBCHYgAS0AByAAc0H/AXFBAnRB4KuAEGooAgBzIQAgAUEIaiEBIAJBeGoiAkEHSw0ACwsCQCACRQ0AAkACQCACQQFxDQAgAiEDDAELIAEtAAAgAHNB/wFxQQJ0QeCrgBBqKAIAIABBCHZzIQAgAUEBaiEBIAJBf2ohAwsgAkEBRg0AA0AgAS0AASABLQAAIABzQf8BcUECdEHgq4AQaigCACAAQQh2cyIAc0H/AXFBAnRB4KuAEGooAgAgAEEIdnMhACABQQJqIQEgA0F+aiIDDQALCyAAQX9zCwsAIAAgASACEIsBC/8EAQJ/QXohCAJAIAZFDQAgB0E4Rw0AIAYtAABB/wFxQTFHDQBBfiEIIABFDQAgAEEANgIYAkAgACgCICIGDQAgAEEANgIoQRshBiAAQRs2AiALAkAgACgCJA0AIABBHDYCJAsCQAJAAkAgA0F/Sg0AIANBcUkNA0EAIQlBACADayEDDAELAkAgA0EQTw0AQQEhCUEAIQcMAgsgA0FwaiEDQQIhCQtBASEHCyAFQQRLDQBBBiABIAFBf0YbIgFBCUsNACACQQhHDQAgBEF2akF3SQ0AIANBcGpBeEkNACADQQhGIAdxDQBBfCEIIAAoAihBAUHELSAGEQEAIgZFDQAgACAGNgIcIAZBADYCHCAGIAk2AhggBkEqNgIEIAYgADYCACAGIARBB2o2AlAgBkGAASAEdCIINgJMIAZBCSADIANBCEYbIgM2AjAgBiAIQX9qNgJUIAZBASADdCIINgIsIAYgBEEJakH/AXFBA242AlggBiAIQX9qNgI0IAYgACgCKCAIQQIgACgCIBEBADYCOCAGIAAoAiggBigCLEECIAAoAiARAQA2AkAgACgCKCAGKAJMQQIgACgCIBEBACEIIAZBADYCwC0gBiAINgJEIAZBwAAgBHQiCDYCnC0gBiAAKAIoIAhBBCAAKAIgEQEAIgg2AgggBiAGKAKcLSIDQQJ0NgIMAkACQCAGKAI4RQ0AIAYoAkBFDQAgBigCREUNACAIDQELIAZBmgU2AgQgAEHA/YAQKAIYNgIYIAAQjgEaQXwPCyAGIAU2AogBIAYgATYChAEgBkEIOgAkIAYgCCADajYCmC0gBiADQQNsQX1qNgKkLSAAEI8BIQgLIAgLzwIBBH9BfiEBAkAgAEUNACAAKAIgRQ0AIAAoAiQiAkUNACAAKAIcIgNFDQAgAygCACAARw0AAkACQCADKAIEIgRBR2oOOQECAgICAgICAgICAgECAgIBAgICAgICAgICAgICAgICAgIBAgICAgICAgICAgIBAgICAgICAgICAQALIARBmgVGDQAgBEEqRw0BCwJAIAMoAggiAUUNACAAKAIoIAEgAhEEACAAKAIkIQIgACgCHCEDCwJAIAMoAkQiAUUNACAAKAIoIAEgAhEEACAAKAIkIQIgACgCHCEDCwJAIAMoAkAiAUUNACAAKAIoIAEgAhEEACAAKAIkIQIgACgCHCEDCwJAIAMoAjgiAUUNACAAKAIoIAEgAhEEACAAKAIcIQMgACgCJCECCyAAKAIoIAMgAhEEACAAQQA2AhxBfUEAIARB8QBGGyEBCyABC8ABAQN/AkAgABCQASIBDQAgACgCHCIAIAAoAixBAXQ2AjwgACgCTEEBdEF+aiICIAAoAkQiA2pBADsBACADQQAgAhC4ARogAEEANgK0LSAAQoCAgIAgNwJ0IABCADcCaCAAQoCAgIAgNwJcIABBADYCSCAAIAAoAoQBQQxsIgJB5NOAEGovAQA2ApABIAAgAkHg04AQai8BADYCjAEgACACQeLTgBBqLwEANgKAASAAIAJB5tOAEGovAQA2AnwLIAELnQIBA39BfiEBAkAgAEUNACAAKAIgRQ0AIAAoAiRFDQAgACgCHCICRQ0AIAIoAgAgAEcNAAJAAkAgAigCBCIDQUdqDjkBAgICAgICAgICAgIBAgICAQICAgICAgICAgICAgICAgICAQICAgICAgICAgICAQICAgICAgICAgEACyADQZoFRg0AIANBKkcNAQsgAEECNgIsIABBADYCCCAAQgA3AhQgAkEANgIUIAIgAigCCDYCEAJAIAIoAhgiAUF/Sg0AIAJBACABayIBNgIYCyACQTlBKiABQQJGGzYCBAJAAkAgAUECRw0AQQBBAEEAEIwBIQEMAQtBAEEAQQAQigEhAQsgACABNgIwIAJBfjYCKCACEKYBQQAhAQsgAQuiCQEMfyAAKAIsIgFB+n1qIQIgACgCdCEDA0AgACgCPCADIAAoAmwiBGprIQUCQCAEIAIgACgCLGpJDQAgACgCOCIGIAYgAWogASAFaxC3ARogACAAKAJwIAFrNgJwIAAgACgCbCABayIENgJsIAAgACgCXCABazYCXAJAIAAoArQtIARNDQAgACAENgK0LQsgACgCTCIHQX9qIQggACgCRCAHQQF0aiEJIAAoAiwhBkEAIQoCQCAHQQNxIgtFDQADQCAJQX5qIglBACAJLwEAIgMgBmsiDCAMIANLGzsBACAHQX9qIQcgCkEBaiIKIAtHDQALCwJAIAhBA0kNAANAIAlBfmoiCkEAIAovAQAiCiAGayIDIAMgCksbOwEAIAlBfGoiCkEAIAovAQAiCiAGayIDIAMgCksbOwEAIAlBemoiCkEAIAovAQAiCiAGayIDIAMgCksbOwEAIAlBeGoiCUEAIAkvAQAiCiAGayIDIAMgCksbOwEAIAdBfGoiBw0ACwsgBkF/aiEIIAAoAkAgBkEBdGohCUEAIQogBiEHAkAgBkEDcSILRQ0AA0AgCUF+aiIJQQAgCS8BACIDIAZrIgwgDCADSxs7AQAgB0F/aiEHIApBAWoiCiALRw0ACwsCQCAIQQNJDQADQCAJQX5qIgpBACAKLwEAIgogBmsiAyADIApLGzsBACAJQXxqIgpBACAKLwEAIgogBmsiAyADIApLGzsBACAJQXpqIgpBACAKLwEAIgogBmsiAyADIApLGzsBACAJQXhqIglBACAJLwEAIgogBmsiAyADIApLGzsBACAHQXxqIgcNAAsLIAUgAWohBQsCQCAAKAIAIgYoAgQiB0UNACAHIAUgByAFSRshCSAAKAJ0IQoCQCAFRQ0AIAAoAjghAyAGIAcgCWs2AgQgAyAEaiAKaiAGKAIAIAkQtwEhBwJAAkACQCAGKAIcKAIYQX9qDgIAAQILIAYgBigCMCAHIAkQigE2AjAMAQsgBiAGKAIwIAcgCRCMATYCMAsgBiAGKAIAIAlqNgIAIAYgBigCCCAJajYCCCAAKAJ0IQoLIAAgCiAJaiIDNgJ0AkAgACgCtC0iCSADakEDSQ0AIAAgACgCOCIKIAAoAmwgCWsiBmoiBy0AACILNgJIIAAgCyAAKAJYIgx0IAdBAWotAABzIAAoAlQiC3EiBzYCSCAKQQJqIQUDQCAJRQ0BIAAgByAMdCAFIAZqLQAAcyALcSIHNgJIIAAoAkAgACgCNCAGcUEBdGogACgCRCAHQQF0aiIKLwEAOwEAIAogBjsBACAAIAlBf2oiCTYCtC0gBkEBaiEGIAkgA2pBAksNAAsLIANBhQJLDQAgACgCACgCBA0BCwsCQCAAKAI8IgcgACgCwC0iBk0NAAJAAkAgBiAAKAJ0IAAoAmxqIglPDQAgACgCOCAJakEAIAcgCWsiBkGCAiAGQYICSRsiBhC4ARogBiAJaiEGDAELIAlBggJqIgkgBk0NASAAKAI4IAZqQQAgCSAGayIJIAcgBmsiBiAJIAZJGyIGELgBGiAAKALALSAGaiEGCyAAIAY2AsAtCwuJIgEIf0F+IQICQCAARQ0AIAAoAiBFDQAgACgCJEUNACAAKAIcIgNFDQAgAygCACAARw0AAkACQCADKAIEIgRBR2oOOQECAgICAgICAgICAgECAgIBAgICAgICAgICAgICAgICAgIBAgICAgICAgICAgIBAgICAgICAgICAQALIARBmgVGDQAgBEEqRw0BCyABQQVLDQACQAJAIAAoAgxFDQACQCAAKAIEIgJFDQAgACgCAEUNAQsgAUEERg0BIARBmgVHDQELIABBwP2AECgCEDYCGEF+DwsCQCAAKAIQDQAgAEHA/YAQKAIcNgIYQXsPCyADKAIoIQUgAyABNgIoAkACQCADKAIURQ0AIAMQqQECQCADKAIUIgYgACgCECIEIAYgBEkbIgJFDQAgACgCDCADKAIQIAIQtwEaIAAgACgCDCACajYCDCADIAMoAhAgAmo2AhAgACAAKAIUIAJqNgIUIAAgACgCECACayIENgIQIAMgAygCFCIFIAJrIgY2AhQgBSACRw0AIAMgAygCCDYCEEEAIQYLAkAgBEUNACADKAIEIQQMAgsgA0F/NgIoQQAPC0EAIQYgAg0AQQAhBiABQQRGDQBBd0EAIAFBBUYbIAFBAXRqQXdBACAFQQRKGyAFQQF0akoNACAAQcD9gBAoAhw2AhhBew8LAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIARBKkYNACAEQZoFRw0BIAAoAgRFDQwgAEHA/YAQKAIcNgIYQXsPCwJAIAMoAhgNACADQfEANgIEDAsLIAMoAjBBDHRBgJB+aiEEQQAhAgJAIAMoAogBQQFKDQAgAygChAEiBUECSA0AQcAAIQIgBUEGSQ0AQYABQcABIAVBBkYbIQILIAMgBkEBajYCFCADKAIIIAZqIAIgBHIiAkEgciACIAMoAmwbIgJBCHY6AAAgAyADKAIUIgRBAWo2AhQgBCADKAIIaiACQR9wIAJyQR9zOgAAAkAgAygCbEUNACAAKAIwIQIgAyADKAIUIgRBAWo2AhQgBCADKAIIaiACQRh2OgAAIAMgAygCFCIEQQFqNgIUIAQgAygCCGogAkEQdjoAACAAKAIwIQIgAyADKAIUIgRBAWo2AhQgBCADKAIIaiACQQh2OgAAIAMgAygCFCIEQQFqNgIUIAQgAygCCGogAjoAAAsgAEEAQQBBABCKATYCMCADQfEANgIEIAAQkwEgAygCFA0BIAMoAgQhBAsCQCAEQTlHDQAgAEEAQQBBABCMATYCMCADIAMoAhQiAkEBajYCFCACIAMoAghqQR86AAAgAyADKAIUIgJBAWo2AhQgAiADKAIIakGLAToAACADIAMoAhQiAkEBajYCFCACIAMoAghqQQg6AAACQAJAIAMoAhwiAg0AIAMgAygCFCICQQFqNgIUIAIgAygCCGpBADoAACADIAMoAhQiAkEBajYCFCACIAMoAghqQQA6AAAgAyADKAIUIgJBAWo2AhQgAiADKAIIakEAOgAAIAMgAygCFCICQQFqNgIUIAIgAygCCGpBADoAACADIAMoAhQiAkEBajYCFCACIAMoAghqQQA6AABBAiECAkAgAygChAEiBEEJRg0AQQQgAygCiAFBAUpBAnQgBEECSBshAgsgAyADKAIUIgRBAWo2AhQgBCADKAIIaiACOgAAIAMgAygCFCICQQFqNgIUIAIgAygCCGpBAzoAACADQfEANgIEIAAQkwEgAygCFEUNASADQX82AihBAA8LIAIoAiQhBCACKAIcIQYgAigCECEFIAIoAiwhByACKAIAIQggAyADKAIUIglBAWo2AhRBAiECIAkgAygCCGogB0EAR0EBdCAIQQBHciAFQQBHQQJ0ciAGQQBHQQN0ciAEQQBHQQR0cjoAACADKAIcKAIEIQQgAyADKAIUIgZBAWo2AhQgBiADKAIIaiAEOgAAIAMoAhwoAgQhBCADIAMoAhQiBkEBajYCFCAGIAMoAghqIARBCHY6AAAgAygCHC8BBiEEIAMgAygCFCIGQQFqNgIUIAYgAygCCGogBDoAACADKAIcLQAHIQQgAyADKAIUIgZBAWo2AhQgBiADKAIIaiAEOgAAAkAgAygChAEiBEEJRg0AQQQgAygCiAFBAUpBAnQgBEECSBshAgsgAyADKAIUIgRBAWo2AhQgBCADKAIIaiACOgAAIAMoAhwoAgwhAiADIAMoAhQiBEEBajYCFCAEIAMoAghqIAI6AAACQCADKAIcIgIoAhBFDQAgAigCFCECIAMgAygCFCIEQQFqNgIUIAQgAygCCGogAjoAACADKAIcKAIUIQIgAyADKAIUIgRBAWo2AhQgBCADKAIIaiACQQh2OgAAIAMoAhwhAgsCQCACKAIsRQ0AIAAgACgCMCADKAIIIAMoAhQQjAE2AjALIANBxQA2AgQgA0EANgIgDAMLIAMoAgQhBAsgBEG7f2oOIwEJCQkCCQkJCQkJCQkJCQkJCQkJCQkDCQkJCQkJCQkJCQkECQsgA0F/NgIoQQAPCwJAIAMoAhwiBCgCECIGRQ0AAkAgAygCFCICIAQvARQgAygCICIEayIFaiADKAIMIgdNDQAgAygCCCACaiADKAIcKAIQIAMoAiBqIAcgAmsiBhC3ARogAyADKAIMIgQ2AhQCQCADKAIcKAIsRQ0AIAQgAk0NACAAIAAoAjAgAygCCCACaiAEIAJrEIwBNgIwCyADIAMoAiAgBmo2AiAgACgCHCICEKkBAkAgAigCFCIEIAAoAhAiByAEIAdJGyIERQ0AIAAoAgwgAigCECAEELcBGiAAIAAoAgwgBGo2AgwgAiACKAIQIARqNgIQIAAgACgCFCAEajYCFCAAIAAoAhAgBGs2AhAgAiACKAIUIgcgBGs2AhQgByAERw0AIAIgAigCCDYCEAsgAygCFA0IAkAgBSAGayIFIAMoAgwiBk0NAANAIAMoAgggAygCHCgCECADKAIgaiAGELcBGiADIAMoAgwiAjYCFAJAIAMoAhwoAixFDQAgAkUNACAAIAAoAjAgAygCCCACEIwBNgIwCyADIAMoAiAgBmo2AiAgACgCHCICEKkBAkAgAigCFCIEIAAoAhAiByAEIAdJGyIERQ0AIAAoAgwgAigCECAEELcBGiAAIAAoAgwgBGo2AgwgAiACKAIQIARqNgIQIAAgACgCFCAEajYCFCAAIAAoAhAgBGs2AhAgAiACKAIUIgcgBGs2AhQgByAERw0AIAIgAigCCDYCEAsgAygCFA0KIAUgBmsiBSADKAIMIgZLDQALCyADKAIgIQQgAygCHCgCECEGQQAhAgsgAygCCCACaiAGIARqIAUQtwEaIAMgAygCFCAFaiIENgIUAkAgAygCHCgCLEUNACAEIAJNDQAgACAAKAIwIAMoAgggAmogBCACaxCMATYCMAsgA0EANgIgCyADQckANgIECwJAIAMoAhwoAhxFDQAgAygCFCEFA0AgAygCHCEEAkAgAygCFCICIAMoAgxHDQACQCAEKAIsRQ0AIAIgBU0NACAAIAAoAjAgAygCCCAFaiACIAVrEIwBNgIwCyAAKAIcIgIQqQECQCACKAIUIgQgACgCECIGIAQgBkkbIgRFDQAgACgCDCACKAIQIAQQtwEaIAAgACgCDCAEajYCDCACIAIoAhAgBGo2AhAgACAAKAIUIARqNgIUIAAgACgCECAEazYCECACIAIoAhQiBiAEazYCFCAGIARHDQAgAiACKAIINgIQCyADKAIUDQUgAygCHCEEQQAhAkEAIQULIAQoAhwhBCADIAMoAiAiBkEBajYCICAEIAZqLQAAIQQgAyACQQFqNgIUIAMoAgggAmogBDoAACAEDQALAkAgAygCHCgCLEUNACADKAIUIgIgBU0NACAAIAAoAjAgAygCCCAFaiACIAVrEIwBNgIwCyADQQA2AiALIANB2wA2AgQLAkAgAygCHCgCJEUNACADKAIUIQUDQCADKAIcIQQCQCADKAIUIgIgAygCDEcNAAJAIAQoAixFDQAgAiAFTQ0AIAAgACgCMCADKAIIIAVqIAIgBWsQjAE2AjALIAAoAhwiAhCpAQJAIAIoAhQiBCAAKAIQIgYgBCAGSRsiBEUNACAAKAIMIAIoAhAgBBC3ARogACAAKAIMIARqNgIMIAIgAigCECAEajYCECAAIAAoAhQgBGo2AhQgACAAKAIQIARrNgIQIAIgAigCFCIGIARrNgIUIAYgBEcNACACIAIoAgg2AhALIAMoAhQNBSADKAIcIQRBACECQQAhBQsgBCgCJCEEIAMgAygCICIGQQFqNgIgIAQgBmotAAAhBCADIAJBAWo2AhQgAygCCCACaiAEOgAAIAQNAAsgAygCHCgCLEUNACADKAIUIgIgBU0NACAAIAAoAjAgAygCCCAFaiACIAVrEIwBNgIwCyADQecANgIECwJAIAMoAhwoAixFDQACQCADKAIUIgJBAmogAygCDE0NACAAEJMBIAMoAhQNBEEAIQILIAAoAjAhBCADIAJBAWo2AhQgAygCCCACaiAEOgAAIAAoAjAhAiADIAMoAhQiBEEBajYCFCAEIAMoAghqIAJBCHY6AAAgAEEAQQBBABCMATYCMAsgA0HxADYCBCAAEJMBIAMoAhRFDQQgA0F/NgIoQQAPCyADQX82AihBAA8LIANBfzYCKEEADwsgA0F/NgIoQQAPCyADQX82AihBAA8LIAAoAgQNAQsgAygCdA0AAkAgAQ0AQQAPCyADKAIEQZoFRg0BCwJAAkAgAygChAEiAg0AIAMgARCUASECDAELAkACQAJAIAMoAogBQX5qDgIAAQILIAMgARCVASECDAILIAMgARCWASECDAELIAMgASACQQxsQejTgBBqKAIAEQIAIQILAkAgAkF+cUECRw0AIANBmgU2AgQLAkAgAkF9cQ0AQQAhAiAAKAIQDQIgA0F/NgIoQQAPCyACQQFHDQACQAJAAkAgAUF/ag4FAAEBAQIBCyADEKoBDAELIANBAEEAQQAQqAEgAUEDRw0AIAMoAkxBAXRBfmoiAiADKAJEIgRqQQA7AQAgBEEAIAIQuAEaIAMoAnQNACADQQA2ArQtIANBADYCXCADQQA2AmwLIAAQkwEgACgCEA0AIANBfzYCKEEADwsCQCABQQRGDQBBAA8LQQEhAiADKAIYIgFBAUgNACAAKAIwIQICQAJAIAFBAkcNACADIAMoAhQiAUEBajYCFCABIAMoAghqIAI6AAAgACgCMCECIAMgAygCFCIBQQFqNgIUIAEgAygCCGogAkEIdjoAACAALwEyIQIgAyADKAIUIgFBAWo2AhQgASADKAIIaiACOgAAIAAtADMhAiADIAMoAhQiAUEBajYCFCABIAMoAghqIAI6AAAgACgCCCECIAMgAygCFCIBQQFqNgIUIAEgAygCCGogAjoAACAAKAIIIQIgAyADKAIUIgFBAWo2AhQgASADKAIIaiACQQh2OgAAIAAvAQohAiADIAMoAhQiAUEBajYCFCABIAMoAghqIAI6AAAgAC0ACyECDAELIAMgAygCFCIBQQFqNgIUIAEgAygCCGogAkEYdjoAACADIAMoAhQiAUEB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DBshBQsgCiEICyALIAJHDQALCwsKACACIAFsELgCCwcAIAEQugILBABBAAsHAEHAz4EQCwcAIAAQAgALCAAgABCzAQALBAAgAAsWAEEAIAAQtQEQAyIAIABBG0YbELQCC5AEAQN/AkAgAkGABEkNACAAIAEgAhAEIAAPCyAAIAJqIQMCQAJAIAEgAHNBA3ENAAJAAkAgAEEDcQ0AIAAhAgwBCwJAIAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsgA0F8cSEEAkAgA0HAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQcAAaiEBIAJBwABqIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQAMAgsACwJAIANBBE8NACAAIQIMAQsCQCAAIANBfGoiBE0NACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLAkAgAiADTw0AA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAAgAmoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFk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fk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EMwCIANB6IF9IANB6IF9SxtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDMAiAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9IGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQwgJFDQAgAyAEEJMCRQ0AIAJCMIinIgZB//8BcSIHQf//AUcNAQsgBUEQaiABIAIgAyAEEMwCIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQxAIgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEMICQQBKDQACQCABIAkgAyAKEMICRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEMwCIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhCAJAAkAgB0UNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDMAiAFQegAaikDACIJQjCIp0GIf2ohByAFKQNgIQQLAkAgCA0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQzAIgBUHYAGopAwAiCkIwiKdBiH9qIQggBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAHIAhMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEMwCIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAdBf2oiByAISg0ACyAIIQcLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABDMAiAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAdBf2ohByAE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QAJAIAJFDQAgACABTQ0BCyAAEL4CTQ0BIAAQCw0BCxCyAUEwNgIAQX8PC0EAIAA2AsTJgRAgAQvqCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgxCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDBAkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAxC////////P4MhAQJAIAgNACAFQdAAaiADIAEgAyABIAFQIgcbeSAHQQZ0rXynIgdBcWoQwQJBECAHayEIIAVB2ABqKQMAIQEgBSkDUCEDCyABQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhDCADQgOGIQogBCAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEMECIAVBMGogCiABIAcQywIgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAMQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDBAiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDBAiAFIAIgBEEBIAZrEMsCIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDJAg4DAAECAwsCQCAGQQRGDQAgBCADIAZBBEutfCIKIANUrXwhBCAKIQMMAwsgBCADIANCAYN8IgogA1StfCEEIAohAwwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEMoCGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+YBAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AAkAgACACVCABIANTIAEgA1EbRQ0AQX8PCyAAIAKFIAEgA4WEQgBSDwsCQCAAIAJWIAEgA1UgASADURtFDQBBfw8LIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQwQJBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDBAiAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDNAiAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDNAiAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDNAiAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDNAiAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDNAiAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDNAiAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDNAiAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDNAiAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDNAiAFQZABaiADQg+GQgAgBEIAEM0CIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQzQIgBUGAAWpCASACfUIAIARCABDNAiAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCILIA8gCn58Ig1CIIggBCAQVK0gCyAEVK18IA0gC1StfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgtCIIggCyACVK1CIIaEfCICIBhUrSACIA1CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEM0CIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQogBkH+/wBqIQZCACABfSELDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEM0CIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiC0IAUq19IQogBkH//wBqIQZCACALfSELIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgCkIBhiALQj+IhCEBIAatQjCGIARC////////P4OEIQogC0IBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQywIgBUEwaiAWIBMgBkHwAGoQwQIgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIgoQzQIgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgtUrX0hASAEIAt9IQQLIAVBEGogAyAOQgNCABDNAiAFIAMgDkIFQgAQzQIgCiACIAJCAYMiCyAEfCIEIANWIAEgBCALVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAAL+gECAn8EfiMAQRBrIgIkACABvSIEQv////////8HgyEFAkACQCAEQjSIQv8PgyIGUA0AAkAgBkL/D1ENACAFQgSIIQcgBUI8hiEFIAZCgPgAfCEGDAILIAVCBIghByAFQjyGIQVC//8BIQYMAQsCQCAFUEUNAEIAIQVCACEHQgAhBgwBCyACIAVCACAEp2dBIHIgBUIgiKdnIAVCgICAgBBUGyIDQTFqEMECQYz4ACADa60hBiACQQhqKQMAQoCAgICAgMAAhSEHIAIpAwAhBQsgACAFNwMAIAAgBkIwhiAEQoCAgICAgICAgH+DhCAHhDcDCCACQRBqJAAL3gECBX8CfiMAQRBrIgIkACABvCIDQf///wNxIQQCQAJAIANBF3YiBUH/AXEiBkUNAAJAIAZB/wFGDQAgBK1CGYYhByAFQf8BcUGA/wBqIQRCACEIDAILIAStQhmGIQdCACEIQf//ASEEDAELAkAgBA0AQgAhCEEAIQRCACEHDAELIAIgBK1CACAEZyIEQdEAahDBAkGJ/wAgBGshBCACQQhqKQMAQoCAgICAgMAAhSEHIAIpAwAhCAsgACAINwMAIAAgBK1CMIYgA0Efdq1CP4aEIAeENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEMECIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3UCAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAQfAAIAFnIgFBH3NrEMECIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLmgsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEMECQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEMECIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IhUgEEIgiCAQIA9UrUIghoR8IhAgAiANQoCABIQiCn4iFiAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58Ig8gAyAEfnwiFEIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gCn58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgCn58IA4gESATVK0gFSARVK18fCIEIA5UrXwgAyAKfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBRCIIggDSAWVK0gDyANVK18IBQgD1StfEIghoR8IgQgAlStfCAEIBAgFVStIBcgEFStfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEMECIAVBIGogAiAEIAYQwQIgBUEQaiASIAEgBxDLAiAFIAIgBCAHEMsCIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiAVCtfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQwAIgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC5AEAgV/An4jAEEgayICJAAgAUL///////8/gyEHAkACQCABQjCIQv//AYMiCKciA0H/h39qQf0PSw0AIABCPIggB0IEhoQhByADQYCIf2qtIQgCQAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAHQgF8IQcMAQsgAEKAgICAgICAgAhSDQAgB0IBgyAHfCEHC0IAIAcgB0L/////////B1YiAxshACADrSAIfCEHDAELAkAgACAHhFANACAIQv//AVINACAAQjyIIAdCBIaEQoCAgICAgIAEhCEAQv8PIQcMAQsCQCADQf6HAU0NAEL/DyEHQgAhAAwBCwJAQYD4AEGB+AAgCFAiBBsiBSADayIGQfAATA0AQgAhAEIAIQcMAQsgAkEQaiAAIAcgB0KAgICAgIDAAIQgBBsiB0GAASAGaxDBAiACIAAgByAGEMsCIAIpAwAiB0I8iCACQQhqKQMAQgSGhCEAAkACQCAHQv//////////D4MgBSADRyACKQMQIAJBEGpBCGopAwCEQgBSca2EIgdCgYCAgICAgIAIVA0AIABCAXwhAAwBCyAHQoCAgICAgICACFINACAAQgGDIAB8IQALIABCgICAgICAgAiFIAAgAEL/////////B1YiAxshACADrSEHCyACQSBqJAAgB0I0hiABQoCAgICAgICAgH+DhCAAhL8LEwACQCAAENECIgANABDSAgsgAAsxAQJ/IABBASAAQQFLGyEBAkADQCABELgCIgINARDaAiIARQ0BIAARBwAMAAsACyACCwYAENcCAAsHACAA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YXkAY2xhLWRlY2F5AGltYXgALSsgICAwWDB4AC0wWCswWCAwWC0weCsweCAweABncm93AHJmaXJzdABpbnRlcm5hbCBlcnJvcjogaW5mbGF0ZSBzdHJlYW0gY29ycnVwdABpbnRlcm5hbCBlcnJvcjogZGVmbGF0ZSBzdHJlYW0gY29ycnVwdAByZXF1ZXN0IGRvZXMgbm90IGZpdCBpbiBhbiBpbnQAcm5kLWluaXQAVmFyaWFibGVzIGFyZSBub3QgZWxpbWluYXRlZCBpZiBpdCBwcm9kdWNlcyBhIHJlc29sdmVudCB3aXRoIGEgbGVuZ3RoIGFib3ZlIHRoaXMgbGltaXQuIC0xIG1lYW5zIG5vIGxpbWl0AGludmFsaWQgbGl0ZXJhbC9sZW5ndGhzIHNldABpbnZhbGlkIGNvZGUgbGVuZ3RocyBzZXQAdW5rbm93biBoZWFkZXIgZmxhZ3Mgc2V0AGludmFsaWQgZGlzdGFuY2VzIHNldABpbnZhbGlkIGJpdCBsZW5ndGggcmVwZWF0AHRvbyBtYW55IGxlbmd0aCBvciBkaXN0YW5jZSBzeW1ib2xzAGludmFsaWQgc3RvcmVkIGJsb2NrIGxlbmd0aHMAZGltYWNzACVzJXMlcwAgIC0lcywgLW5vLSVzAHdyAFRoZSBjbGF1c2UgYWN0aXZpdHkgZGVjYXkgZmFjdG9yAFRoZSB2YXJpYWJsZSBhY3Rpdml0eSBkZWNheSBmYWN0b3IAUmVzdGFydCBpbnRlcnZhbCBpbmNyZWFzZSBmYWN0b3IAYnVmZmVyIGVycm9yAHN0cmVhbSBlcnJvcgBmaWxlIGVycm9yAGNvbXByZXNzZWQgZGF0YSBlcnJvcgBybmQtZnJlcQAuLi8uLi8uLi8uLi8uLi8uLi91c3IvbGliL2Vtc2NyaXB0ZW4vc3lzdGVtL2xpYi9saWJjeHhhYmkvc3JjL3ByaXZhdGVfdHlwZWluZm8uY3BwAFVzZWQgYnkgdGhlIHJhbmRvbSB2YXJpYWJsZSBzZWxlY3Rpb24AU29sdmVkIGJ5IHNpbXBsaWZpY2F0aW9uAGluY29tcGF0aWJsZSB2ZXJzaW9uAGltaW4AbmFuAGFzeW1tAGVsaW0AY3B1LWxpbQBtZW0tbGltAGNsLWxpbQBzdWItbGltAFRoZSBiYXNlIHJlc3RhcnQgaW50ZXJ2YWwAaW52YWxpZCBjb2RlIC0tIG1pc3NpbmcgZW5kLW9mLWJsb2NrAHJjaGVjawBpbmNvcnJlY3QgaGVhZGVyIGNoZWNrAGluY29ycmVjdCBsZW5ndGggY2hlY2sAaW5jb3JyZWN0IGRhdGEgY2hlY2sAaW52YWxpZCBkaXN0YW5jZSB0b28gZmFyIGJhY2sAaGVhZGVyIGNyYyBtaXNtYXRjaABjYW5fY2F0Y2gAcGhhc2Utc2F2aW5nAGluZgBvZmYAaW52YWxpZCB3aW5kb3cgc2l6ZQBwcmUAaW52YWxpZCBibG9jayB0eXBlAHVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUAVGhlIGZyZXF1ZW5jeSB3aXRoIHdoaWNoIHRoZSBkZWNpc2lvbiBoZXVyaXN0aWMgdHJpZXMgdG8gY2hvb3NlIGEgcmFuZG9tIHZhcmlhYmxlAGNjbWluLW1vZGUAaW52YWxpZCBsaXRlcmFsL2xlbmd0aCBjb2RlAGludmFsaWQgZGlzdGFuY2UgY29kZQBVc2UgdGhlIEx1YnkgcmVzdGFydCBzZXF1ZW5jZQB1bmtub3duIGNvbXByZXNzaW9uIG1ldGhvZABzdHJlYW0gZW5kAFRoZSBmcmFjdGlvbiBvZiB3YXN0ZWQgbWVtb3J5IGFsbG93ZWQgYmVmb3JlIGEgZ2FyYmFnZSBjb2xsZWN0aW9uIGlzIHRyaWdnZXJlZABybmQtc2VlZAAlNGQAJXMlcyVkACAlcyVkAHJpbmMAc2ltcC1nYy1mcmFjAHdiAHZlcmIAcndhACAgLSUtMTJzID0gJS04cyBbAElOREVUAFVOU0FUAFNJTVAATUFJTgBOQU4ASU5GAENPUkUAVU5TQVRJU0ZJQUJMRQA8c3RkaW4+ADxib29sPgA8c3RyaW5nPgA8ZG91YmxlPgA8ZmQ6JWQ+ADxpbnQzMj4APT09PT09PT09PT09PT09PT09PT09PT09PT09PVsgUHJvYmxlbSBTdGF0aXN0aWNzIF09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQA9PT09PT09PT09PT09PT09PT09PT09PT09PT09WyBTZWFyY2ggU3RhdGlzdGljcyBdPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09AD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVsgV3JpdGluZyBESU1BQ1MgXT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0APT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQAxLjIuMTMAV0FSTklORyEgQ291bGQgbm90IHNldCByZXNvdXJjZSBsaW1pdDogVmlydHVhbCBtZW1vcnkuAERvIG5vdCBjaGVjayBpZiBzdWJzdW1wdGlvbiBhZ2FpbnN0IGEgY2xhdXNlIGxhcmdlciB0aGFuIHRoaXMuIC0xIG1lYW5zIG5vIGxpbWl0LgBBbGxvdyBhIHZhcmlhYmxlIGVsaW1pbmF0aW9uIHN0ZXAgdG8gZ3JvdyBieSBhIG51bWJlciBvZiBjbGF1c2VzLgBSZWFkaW5nIGZyb20gc3RhbmRhcmQgaW5wdXQuLi4gVXNlICctLWhlbHAnIGZvciBoZWxwLgBQZXJmb3JtIHZhcmlhYmxlIGVsaW1pbmF0aW9uLgBUaGUgZnJhY3Rpb24gb2Ygd2FzdGVkIG1lbW9yeSBhbGxvd2VkIGJlZm9yZSBhIGdhcmJhZ2UgY29sbGVjdGlvbiBpcyB0cmlnZ2VyZWQgZHVyaW5nIHNpbXBsaWZpY2F0aW9uLgBDb21wbGV0ZWx5IHR1cm4gb24vb2ZmIGFueSBwcmVwcm9jZXNzaW5nLgBTaHJpbmsgY2xhdXNlcyBieSBhc3ltbWV0cmljIGJyYW5jaGluZy4AV0FSTklORyEgQ291bGQgbm90IHNldCByZXNvdXJjZSBsaW1pdDogQ1BVLXRpbWUuAElmIGdpdmVuLCBzdG9wIGFmdGVyIHByZXByb2Nlc3NpbmcgYW5kIHdyaXRlIHRoZSByZXN1bHQgdG8gdGhpcyBmaWxlLgBWZXJib3NpdHkgbGV2ZWwgKDA9c2lsZW50LCAxPXNvbWUsIDI9bW9yZSkuAC0AKioqIElOVEVSUlVQVEVEICoqKgBDaGVjayBpZiBhIGNsYXVzZSBpcyBhbHJlYWR5IGltcGxpZWQuIChjb3N0bHkpAENvbnRyb2xzIGNvbmZsaWN0IGNsYXVzZSBtaW5pbWl6YXRpb24gKDA9bm9uZSwgMT1iYXNpYywgMj1kZWVwKQAobnVsbCkAQ29udHJvbHMgdGhlIGxldmVsIG9mIHBoYXNlIHNhdmluZyAoMD1ub25lLCAxPWxpbWl0ZWQsIDI9ZnVsbCkAYWRqdXN0ZWRQdHIgJiYgImNhdGNoaW5nIGEgY2xhc3Mgd2l0aG91dCBhbiBvYmplY3Q/IgBQdXJlIHZpcnR1YWwgZnVuY3Rpb24gY2FsbGVkIQAlcyVkIABsaWJjKythYmk6IAAgLi4gAGVsaW1pbmF0aW9uIGxlZnQ6ICUxMGQNAHN1YnN1bXB0aW9uIGxlZnQ6ICUxMGQgKCUxMGQgc3Vic3VtZWQsICUxMGQgZGVsZXRlZCBsaXRlcmFscykNAHwgJTlkIHwgJTdkICU4ZCAlOGQgfCAlOGQgJThkICU2LjBmIHwgJTYuM2YgJSUgfAoAfCAgR2FyYmFnZSBjb2xsZWN0aW9uOiAgICUxMmQgYnl0ZXMgPT4gJTEyZCBieXRlcyAgICAgICAgICAgICB8CgB8ICBFbGltaW5hdGVkIGNsYXVzZXM6ICAgICAlMTAuMmYgTWIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwKAHwgIFNpbXBsaWZpY2F0aW9uIHRpbWU6ICAlMTIuMmYgcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwKAHwgIFBhcnNlIHRpbWU6ICAgICAgICAgICAlMTIuMmYgcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwKAHwgIE51bWJlciBvZiB2YXJpYWJsZXM6ICAlMTJkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8CgB8ICBOdW1iZXIgb2YgY2xhdXNlczogICAgJTEyZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfAoAcmVzdGFydHMgICAgICAgICAgICAgIDogJWxsdQoAd2FybmluZzogdW5zdXBwb3J0ZWQgc3lzY2FsbDogX19zeXNjYWxsX3VnZXRybGltaXQKACAgLSUtMTBzID0gJThzCgBjb3VsZCBub3Qgb3BlbiBmaWxlICVzCgBFUlJPUiEgQ291bGQgbm90IG9wZW4gZmlsZTogJXMKAAogICAgICAgICVzCgBDUFUgdGltZSAgICAgICAgICAgICAgOiAlZyBzCgB3YXJuaW5nOiB1bnN1cHBvcnRlZCBzeXNjYWxsOiBfX3N5c2NhbGxfZ2V0cnVzYWdlCgBwIGNuZiAlZCAlZAoAUEFSU0UgRVJST1IhIFVuZXhwZWN0ZWQgY2hhcjogJWMKAElOREVUCgBVTlNBVAoASU5ERVRFUk1JTkFURQoAVU5TQVRJU0ZJQUJMRQoAd2FybmluZzogdW5zdXBwb3J0ZWQgc3lzY2FsbDogX19zeXNjYWxsX3BybGltaXQ2NAoAJXMlZCAwCgBwIGNuZiAxIDIKMSAwCi0xIDAKAExpbWl0IG9uIG1lbW9yeSB1c2FnZSBpbiBtZWdhYnl0ZXMuCgBXQVJOSU5HISBESU1BQ1MgaGVhZGVyIG1pc21hdGNoOiB3cm9uZyBudW1iZXIgb2YgY2xhdXNlcy4KAFdBUk5JTkchIERJTUFDUyBoZWFkZXIgbWlzbWF0Y2g6IHdyb25nIG51bWJlciBvZiB2YXJpYWJsZXMuCgBXcm90ZSAlZCBjbGF1c2VzIHdpdGggJWQgdmFyaWFibGVzLgoATGltaXQgb24gQ1BVIHRpbWUgYWxsb3dlZCBpbiBzZWNvbmRzLgoARVJST1IhIFVua25vd24gZmxhZyAiJXMiLiBVc2UgJy0tJXNoZWxwJyBmb3IgaGVscC4KACAgLS0lc2hlbHAgICAgICAgIFByaW50IGhlbHAgbWVzc2FnZS4KACAgLS0lc2hlbHAtdmVyYiAgIFByaW50IHZlcmJvc2UgaGVscCBtZXNzYWdlLgoAVVNBR0U6ICVzIFtvcHRpb25zXSA8aW5wdXQtZmlsZT4gPHJlc3VsdC1vdXRwdXQtZmlsZT4KCiAgd2hlcmUgaW5wdXQgbWF5IGJlIGVpdGhlciBpbiBwbGFpbiBvciBnemlwcGVkIERJTUFDUy4KAEVSUk9SISB2YWx1ZSA8JXM+IGlzIHRvbyBzbWFsbCBmb3Igb3B0aW9uICIlcyIuCgBFUlJPUiEgdmFsdWUgPCVzPiBpcyB0b28gbGFyZ2UgZm9yIG9wdGlvbiAiJXMiLgoAKGRlZmF1bHQ6ICVzKQoAICAt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ABEHCwAACGIAAAgiAAAJpAAACAIAAAiCAAAIQgAACeQAEAcHAAAIWgAACBoAAAmUABQHQwAACHoAAAg6AAAJ1AASBxMAAAhqAAAIKgAACbQAAAgKAAAIigAACEoAAAn0ABAHBQAACFYAAAgWAEAIAAATBzMAAAh2AAAINgAACcwAEQcPAAAIZgAACCYAAAmsAAAIBgAACIYAAAhGAAAJ7AAQBwkAAAheAAAIHgAACZwAFAdjAAAIfgAACD4AAAncABIHGwAACG4AAAguAAAJvAAACA4AAAiOAAAITgAACfwAYAcAAAAIUQAACBEAFQiDABIHHwAACHEAAAgxAAAJwgAQBwoAAAhhAAAIIQAACaIAAAgBAAAIgQAACEEAAAniABAHBgAACFkAAAgZAAAJkgATBzsAAAh5AAAIOQAACdIAEQcRAAAIaQAACCkAAAmyAAAICQAACIkAAAhJAAAJ8gAQBwQAAAhVAAAIFQAQCAIBEwcrAAAIdQAACDUAAAnKABEHDQAACGUAAAglAAAJqgAACAUAAAiFAAAIRQAACeoAEAcIAAAIXQAACB0AAAmaABQHUwAACH0AAAg9AAAJ2gASBxcAAAhtAAAILQAACboAAAgNAAAIjQAACE0AAAn6ABAHAwAACFMAAAgTABUIwwATByMAAAhzAAAIMwAACcYAEQcLAAAIYwAACCMAAAmmAAAIAwAACIMAAAhDAAAJ5gAQBwcAAAhbAAAIGwAACZYAFAdDAAAIewAACDsAAAnWABIHEwAACGsAAAgrAAAJtgAACAsAAAiLAAAISwAACfYAEAcFAAAIVwAACBcAQAgAABMHMwAACHcAAAg3AAAJzgARBw8AAAhnAAAIJwAACa4AAAgHAAAIhwAACEcAAAnuABAHCQAACF8AAAgfAAAJngAUB2MAAAh/AAAIPwAACd4AEgcbAAAIbwAACC8AAAm+AAAIDwAACI8AAAhPAAAJ/gBgBwAAAAhQAAAIEAAUCHMAEgcfAAAIcAAACDAAAAnBABAHCgAACGAAAAggAAAJoQAACAAAAAiAAAAIQAAACeEAEAcGAAAIWAAACBgAAAmRABMHOwAACHgAAAg4AAAJ0QARBxEAAAhoAAAIKAAACbEAAAgIAAAIiAAACEgAAAnxABAHBAAACFQAAAgUABUI4wATBysAAAh0AAAINAAACckAEQcNAAAIZAAACCQAAAmpAAAIBAAACIQAAAhEAAAJ6QAQBwgAAAhcAAAIHAAACZkAFAdTAAAIfAAACDwAAAnZABIHFwAACGwAAAgsAAAJuQAACAwAAAiMAAAITAAACfkAEAcDAAAIUgAACBIAFQijABMHIwAACHIAAAgyAAAJxQARBwsAAAhiAAAIIgAACaUAAAgCAAAIggAACEIAAAnlABAHBwAACFoAAAgaAAAJlQAUB0MAAAh6AAAIOgAACdUAEgcTAAAIagAACCoAAAm1AAAICgAACIoAAAhKAAAJ9QAQBwUAAAhWAAAIFgBACAAAEwczAAAIdgAACDYAAAnNABEHDwAACGYAAAgmAAAJrQAACAYAAAiGAAAIRgAACe0AEAcJAAAIXgAACB4AAAmdABQHYwAACH4AAAg+AAAJ3QASBxsAAAhuAAAILgAACb0AAAgOAAAIjgAACE4AAAn9AGAHAAAACFEAAAgRABUIgwASBx8AAAhxAAAIMQAACcMAEAcKAAAIYQAACCEAAAmjAAAIAQAACIEAAAhBAAAJ4wAQBwYAAAhZAAAIGQAACZMAEwc7AAAIeQAACDkAAAnTABEHEQAACGkAAAgpAAAJswAACAkAAAiJAAAISQAACfMAEAcEAAAIVQAACBUAEAgCARMHKwAACHUAAAg1AAAJywARBw0AAAhlAAAIJQAACasAAAgFAAAIhQAACEUAAAnrABAHCAAACF0AAAgdAAAJmwAUB1MAAAh9AAAIPQAACdsAEgcXAAAIbQAACC0AAAm7AAAIDQAACI0AAAhNAAAJ+wAQBwMAAAhTAAAIEwAVCMMAEwcjAAAIcwAACDMAAAnHABEHCwAACGMAAAgjAAAJpwAACAMAAAiDAAAIQwAACecAEAcHAAAIWwAACBsAAAmXABQHQwAACHsAAAg7AAAJ1wASBxMAAAhrAAAIKwAACbcAAAgLAAAIiwAACEsAAAn3ABAHBQAACFcAAAgXAEAIAAATBzMAAAh3AAAINwAACc8AEQcPAAAIZwAACCcAAAmvAAAIBwAACIcAAAhHAAAJ7wAQBwkAAAhfAAAIHwAACZ8AFAdjAAAIfwAACD8AAAnfABIHGwAACG8AAAgvAAAJvwAACA8AAAiPAAAITwAACf8AEAUBABcFAQETBREAGwUBEBEFBQAZBQEEFQVBAB0FAUAQBQMAGAUBAhQFIQAcBQEgEgUJABoFAQgWBYEAQAUAABAFAgAXBYEBEwUZABsFARgRBQcAGQUBBhUFYQAdBQFgEAUEABgFAQMUBTEAHAUBMBIFDQAaBQEMFgXBAEAFAAADAAQABQAGAAcACAAJAAoACwANAA8AEQATABcAGwAfACMAKwAzADsAQwBTAGMAcwCDAKMAwwDjAAIBAAAAAAAAEAAQABAAEAAQABAAEAAQABEAEQARABEAEgASABIAEgATABMAEwATABQAFAAUABQAFQAVABUAFQAQAMIAQQAAAAEAAgADAAQABQAHAAkADQARABkAIQAxAEEAYQCBAMEAAQGBAQECAQMBBAEGAQgBDAEQARgBIAEwAUABYAAAAAAQABAAEAAQABEAEQASABIAEwATABQAFAAVABUAFgAWABcAFwAYABgAGQAZABoAGgAbABsAHAAcAB0AHQBAAEAAAAECAwQEBQUGBgYGBwcHBwgICAgICAgICQkJCQkJCQkKCgoKCgoKCgoKCgoKCgoKCwsLCwsLCwsLCwsLCwsLCwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDwAAEBESEhMTFBQUFBUVFRUWFhYWFhYWFhcXFxcXFxcXGBgYGBgYGBgYGBgYGBgYGBkZGRkZGRkZGRkZGRkZGRkaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHB0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0AAQIDBAUGBwgICQkKCgsLDAwMDA0NDQ0ODg4ODw8PDxAQEBAQEBAQERERERERERESEhISEhISEhMTExMTExMTFBQUFBQUFBQUFBQUFBQUFBUVFRUVFRUVFRUVFRUVFRUWFhYWFhYWFhYWFhYWFhYWFxcXFxcXFxcXFxcXFxcXFxgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxscUDcAAlA8AAIBAQAAHgEAAA8AAADQOwAC0DwAAgAAAAAeAAAADwAAAAAAAABQPQACAAAAABMAAAAHAAAAAAAAAAwACACMAAgATAAIAMwACAAsAAgArAAIAGwACADsAAgAHAAIAJwACABcAAgA3AAIADwACAC8AAgAfAAIAPwACAACAAgAggAIAEIACADCAAgAIgAIAKIACABiAAgA4gAIABIACACSAAgAUgAIANIACAAyAAgAsgAIAHIACADyAAgACgAIAIoACABKAAgAygAIACoACACqAAgAagAIAOoACAAaAAgAmgAIAFoACADaAAgAOgAIALoACAB6AAgA+gAIAAYACACGAAgARgAIAMYACAAmAAgApgAIAGYACADmAAgAFgAIAJYACABWAAgA1gAIADYACAC2AAgAdgAIAPYACAAOAAgAjgAIAE4ACADOAAgALgAIAK4ACABuAAgA7gAIAB4ACACeAAgAXgAIAN4ACAA+AAgAvgAIAH4ACAD+AAgAAQAIAIEACABBAAgAwQAIACEACAChAAgAYQAIAOEACAARAAgAkQAIAFEACADRAAgAMQAIALEACABxAAgA8QAIAAkACACJAAgASQAIAMkACAApAAgAqQAIAGkACADpAAgAGQAIAJkACABZAAgA2QAIADkACAC5AAgAeQAIAPkACAAFAAgAhQAIAEUACADFAAgAJQAIAKUACABlAAgA5QAIABUACACVAAgAVQAIANUACAA1AAgAtQAIAHUACAD1AAgADQAIAI0ACABNAAgAzQAIAC0ACACtAAgAbQAIAO0ACAAdAAgAnQAIAF0ACADdAAgAPQAIAL0ACAB9AAgA/QAIABMACQATAQkAkwAJAJMBCQBTAAkAUwEJANMACQDTAQkAMwAJADMBCQCzAAkAswEJ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bmVjdGlvbiByZWZ1c2VkAEhvc3QgaXMgZG93bgBIb3N0IGlzIHVucmVhY2hhYmxlAEFkZHJlc3MgaW4gdXNlAEJyb2tlbiBwaXBlAEkvTyBlcnJvcgBObyBzdWNoIGRldmljZSBvciBhZGRyZXNzAEJsb2NrIGRldmljZSByZXF1aXJlZABObyBzdWNoIGRldmljZQBOb3QgYSBkaXJlY3RvcnkASXMgYSBkaXJlY3RvcnkAVGV4dCBmaWxlIGJ1c3kARXhlYyBmb3JtYXQgZXJyb3IASW52YWxpZCBhcmd1bWVudABBcmd1bWVudCBsaXN0IHRvbyBsb25nAFN5bWJvbGljIGxpbmsgbG9vcABGaWxlbmFtZSB0b28gbG9uZwBUb28gbWFueSBvcGVuIGZpbGVzIGluIHN5c3RlbQBObyBmaWxlIGRlc2NyaXB0b3JzIGF2YWlsYWJsZQBCYWQgZmlsZSBkZXNjcmlwdG9yAE5vIGNoaWxkIHByb2Nlc3MAQmFkIGFkZHJlc3MARmlsZSB0b28gbGFyZ2UAVG9vIG1hbnkgbGlua3MATm8gbG9ja3MgYXZhaWxhYmxlAFJlc291cmNlIGRlYWRsb2NrIHdvdWxkIG9jY3VyAFN0YXRlIG5vdCByZWNvdmVyYWJsZQBQcmV2aW91cyBvd25lciBkaWVkAE9wZXJhdGlvbiBjYW5jZWxlZABGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQATm8gbWVzc2FnZSBvZiBkZXNpcmVkIHR5cGUASWRlbnRpZmllciByZW1vdmVkAERldmljZSBub3QgYSBzdHJlYW0ATm8gZGF0YSBhdmFpbGFibGUARGV2aWNlIHRpbWVvdXQAT3V0IG9mIHN0cmVhbXMgcmVzb3VyY2VzAExpbmsgaGFzIGJlZW4gc2V2ZXJlZABQcm90b2NvbCBlcnJvcgBCYWQgbWVzc2FnZQBGaWxlIGRlc2NyaXB0b3IgaW4gYmFkIHN0YXRlAE5vdCBhIHNvY2tldABEZXN0aW5hdGlvbiBhZGRyZXNzIHJlcXVpcmVkAE1lc3NhZ2UgdG9vIGxhcmdlAFByb3RvY29sIHdyb25nIHR5cGUgZm9yIHNvY2tldABQcm90b2NvbCBub3QgYXZhaWxhYmxlAFByb3RvY29sIG5vdCBzdXBwb3J0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", (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href)).href;
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
  function getGame() {
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
  function renderUI(data) {
    const board = document.getElementById("board");
    if (!board) return;
    const cells = Array.from(board.querySelectorAll(".cell"));
    const overlay = new Overlay(board);
    for (let i = 0; i < cells.length; i++) {
      if (data[i] === 0 || data[i] === 1) {
        const color = data[i] === 0 ? "green" : "red";
        overlay.setDot(i, color);
      }
    }
  }
  class Overlay {
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
  }
  injectMop(async () => {
    const game = getGame();
    if (!game) {
      console.warn("not find game");
      return;
    }
    console.log("game=", game);
    const solver = new MineSweepSolver(game);
    renderUI(await solver.solve());
  });
  const __viteBrowserExternal = Object.freeze( Object.defineProperty({
    __proto__: null
  }, Symbol.toStringTag, { value: "Module" }));

})();