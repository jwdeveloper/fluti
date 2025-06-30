// @bun
// src/deepMerge.ts
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

// src/determineWebsocketHandler.ts
import fs from "fs";
import path from "path";
var fallbackWebSocketHandler = {
  open(ws) {
    console.log("Using default websocket");
    setTimeout(() => {
      ws.send(JSON.stringify({
        message: "Sending from server"
      }));
    }, 1500);
  },
  message(ws, msg) {
    console.log(msg);
  },
  close(ws) {
    console.log("Closed");
  }
};
function getSvelteProjectRoot() {
  const stack = new Error().stack;
  const stackLines = stack?.split(`
`) || [];
  for (let i = 2;i < stackLines.length; i++) {
    const line = stackLines[i];
    if (line.includes("svelte-adapter-bun")) {
      continue;
    }
    const filePathMatch = line.match(/\((.+?):\d+:\d+\)/) || line.match(/at\s+(.+?):\d+:\d+/);
    if (filePathMatch?.[1]) {
      const filePath = filePathMatch[1];
      if (filePath.includes("svelte.config") || !filePath.includes("node_modules")) {
        return path.dirname(filePath);
      }
    }
  }
  let dir = process.cwd();
  while (dir !== "/") {
    if (fs.existsSync(path.join(dir, "svelte.config.js")) || fs.existsSync(path.join(dir, "svelte.config.ts"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}
async function determineWebSocketHandler(passedOptions) {
  try {
    const options = deepMerge({ ws: undefined, debug: false }, passedOptions);
    if (options.ws instanceof Object && "open" in options.ws) {
      return options.ws;
    }
    const cwd = process.cwd();
    if (typeof options.ws === "string") {
      let handler;
      if (options.ws.startsWith("file://") || options.ws.startsWith("http://") && options.ws.startsWith("https://")) {
        handler = await import(options.ws);
      } else if (options.ws.startsWith(".")) {
        handler = await import(path.resolve(getSvelteProjectRoot(), options.ws));
      } else if (options.ws.startsWith("/")) {
        handler = await import(options.ws);
      } else {
        handler = await import(path.resolve(process.cwd(), options.ws));
      }
      return handler.default;
    }
    try {
      const hooksServerPath = path.resolve(cwd, "src/hooks.server.ts");
      const exists = fs.existsSync(hooksServerPath);
      if (exists) {
        try {
          const hooksPathImport = await import(`file://${hooksServerPath}`);
          if (typeof hooksPathImport === "object" && "handleWebsocket" in hooksPathImport) {
            return hooksPathImport.handleWebsocket;
          }
        } catch (e) {
          console.error("Error importing hooks.server.ts:", e);
        }
      }
    } catch (e) {
      console.error("Error checking hooks.server.ts:", e);
    }
    try {
      const hooksServerJsPath = path.resolve(cwd, "src/hooks.server.js");
      const exists = fs.existsSync(hooksServerJsPath);
      if (exists) {
        try {
          const hooksPathImport = await import(`file://${hooksServerJsPath}`);
          if (typeof hooksPathImport === "object" && "handleWebsocket" in hooksPathImport) {
            return hooksPathImport.handleWebsocket;
          }
        } catch (e) {
          console.error("Error importing hooks.server.js:", e);
        }
      }
    } catch (e) {
      console.error("Error checking hooks.server.js:", e);
    }
    try {
      const websocketTsPath = path.resolve(cwd, "src/websockets.ts");
      const exists = fs.existsSync(websocketTsPath);
      if (exists) {
        try {
          const srcWebSocketImport = await import(`file://${websocketTsPath}`);
          if (typeof srcWebSocketImport === "object" && "default" in srcWebSocketImport) {
            return srcWebSocketImport.default;
          }
        } catch (e) {
          console.error("Error importing websockets.ts:", e);
        }
      }
    } catch (e) {
      console.error("Error checking websockets.ts:", e);
    }
    console.log("No custom handlers found, using fallback WebSocket handler");
    return fallbackWebSocketHandler;
  } catch (mainError) {
    console.error("Critical error in determineWebSocketHandler:", mainError);
    return fallbackWebSocketHandler;
  }
}

// src/viteWsPlugin.ts
var bunViteWSPlugin = async (passedOptions) => {
  const options = deepMerge({
    port: 10234,
    hmrPaths: [],
    ws: undefined,
    debug: false
  }, passedOptions);
  const portToUse = process.env?.PUBLIC_DEVWSPORT || 10234;
  const listeners = {};
  const websocketHandlerDetermined = await determineWebSocketHandler({
    ws: options.ws,
    debug: options.debug
  });
  let bunserverinst;
  const bunconfig = {
    port: portToUse,
    fetch: (req, server) => {
      if (req.headers.get("connection")?.toLowerCase().includes("upgrade") && req.headers.get("upgrade")?.toLowerCase() === "websocket") {
        server.upgrade(req, {
          data: {
            url: req.url,
            client: req.headers.get("origin"),
            headers: req.headers,
            listeners,
            requester: server.requestIP(req)
          }
        });
      }
    },
    websocket: websocketHandlerDetermined,
    listeners
  };
  return {
    name: "bun-adapter-websockets",
    async configureServer(server) {
      if (bunserverinst !== undefined) {
        bunserverinst.stop();
        bunserverinst.reload(bunconfig);
      } else {
        try {
          bunserverinst = Bun.serve(bunconfig);
        } catch (e) {
          console.log(e);
        }
      }
      server.httpServer?.on("upgrade", (req, socket, head) => {
        socket.on("error", (err) => {
          console.error("Socket error during forwarding:", err);
        });
        bunserverinst?.fetch(req);
      });
    },
    handleHotUpdate({ file, server }) {
      const watchFiles = [
        "vite.config.js",
        "vite.config.ts",
        "vitehmrplugin.ts",
        "vitehmrplugin.js",
        "hooks.server.ts"
      ];
      const isConfigChange = watchFiles.some((configFile) => file.endsWith(configFile));
      if (isConfigChange) {
        bunserverinst?.stop();
        bunserverinst = undefined;
        server.ws.send({
          type: "full-reload",
          path: "*"
        });
        return [];
      }
    }
  };
};
var viteWsPlugin_default = bunViteWSPlugin;
export {
  viteWsPlugin_default as default
};
