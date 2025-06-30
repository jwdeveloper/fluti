// @bun
// src/adapter.ts
import {
  createReadStream,
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
  writeFileSync
} from "fs";
import { exit } from "process";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { promisify } from "util";
import * as zlib from "zlib";
import glob from "tiny-glob";

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

// src/adapter.ts
var pipe = promisify(pipeline);
var svelteRoot = getSvelteProjectRoot();
async function build(options, preserveModules = false) {
  const base = {
    entrypoints: options.entrypoints,
    outdir: options.outdir,
    target: "bun",
    format: "esm",
    splitting: true,
    preserveModules: true,
    packages: "external",
    external: [
      "SERVER",
      "MANIFEST",
      "ENV_PREFIX",
      "dotENV_PREFIX",
      "BUILD_OPTIONS"
    ],
    define: options.define
  };
  try {
    if (preserveModules) {
      for (const entrypoint of options.entrypoints) {
        await Promise.all([
          Bun.build({
            ...base,
            entrypoints: [entrypoint],
            minify: false,
            naming: `[dir]/${options.naming}.[ext]`
          }),
          Bun.build({
            ...base,
            entrypoints: [entrypoint],
            minify: true,
            naming: `[dir]/${options.naming}.min.[ext]`
          })
        ]);
      }
    } else {
      await Promise.all([
        Bun.build({
          ...base,
          entrypoints: options.entrypoints,
          minify: false,
          naming: `[dir]/${options.naming}.[ext]`
        }),
        Bun.build({
          ...base,
          entrypoints: options.entrypoints,
          minify: true,
          naming: `[dir]/${options.naming}.min.[ext]`
        })
      ]);
    }
  } catch (e) {
    console.error(e);
    exit(1);
  }
}
async function adapter(passedOptions) {
  const options = deepMerge({
    out: "build",
    precompress: false,
    envPrefix: "",
    maxRequestSize: 10486,
    development: false,
    dynamicOrigin: false,
    xffDepth: 1,
    assets: true,
    ws: undefined,
    tls: undefined,
    ssl: undefined
  }, passedOptions);
  const { out = "build", precompress } = options;
  const websocketHandlerDetermined = await determineWebSocketHandler({
    outDir: out,
    ws: options.ws,
    debug: false
  });
  return {
    name: "svelte-adapter-bun",
    async adapt(builder) {
      builder.rimraf(out);
      builder.mkdirp(out);
      builder.log.minor("Copying assets");
      builder.writeClient(`${out}/client${builder.config.kit.paths.base}`);
      builder.writePrerendered(`${out}/prerendered${builder.config.kit.paths.base}`);
      if (precompress) {
        builder.log.minor("Compressing assets");
        await Promise.all([
          compress(`${out}/client`, precompress),
          compress(`${out}/prerendered`, precompress)
        ]);
      }
      builder.log.minor("Building server");
      builder.writeServer(`${out}/server`);
      writeFileSync(`${out}/manifest.js`, `export const manifest = ${builder.generateManifest({ relativePath: "./server" })};

` + `export const prerendered = new Set(${JSON.stringify(builder.prerendered.paths)});
`);
      builder.log.minor("Patching server (websocket support)");
      const pkg = JSON.parse(readFileSync(`${getSvelteProjectRoot()}/package.json`, "utf8"));
      if (!Bun) {
        throw "Needs to use the Bun exectuable, make sure Bun is installed and run `bunx --bun vite build` to build";
      }
      const { assets, development, dynamicOrigin, xffDepth, envPrefix = "", maxRequestSize, tls } = options;
      const buildOptions = {
        SERVER: "./server/index.js",
        MANIFEST: "./manifest.js",
        ENV_PREFIX: JSON.stringify(envPrefix),
        dotENV_PREFIX: envPrefix,
        BUILD_OPTIONS: JSON.stringify({
          development,
          dynamicOrigin,
          xffDepth,
          assets,
          maxRequestSize,
          tls
        })
      };
      builder.copy(fileURLToPath(new URL("./templates", import.meta.url).href), out, {
        replace: buildOptions
      });
      if (options.ws) {
        if (typeof options.ws !== "string") {
          throw "The websocket config, 'wsfile' can only be a relative path string.";
        }
        try {
          await build({
            entrypoints: [options.ws],
            outdir: `${out}/server`,
            naming: "websockets"
          });
        } catch (e) {
          console.error("Error building the websocket handler:", e);
        }
      }
      const originalPath = `${svelteRoot}/package.json`;
      let originalPackageJson;
      try {
        originalPackageJson = await Bun.file(originalPath).text();
      } catch (e) {
        throw Error(`Problem reading the package.json in the source folder :: ${JSON.stringify({ lookedFor: getSvelteProjectRoot() })}`);
      }
      const pkgJsonParsed = JSON.parse(originalPackageJson);
      const productionize = {
        ...pkgJsonParsed,
        scripts: "bun run ./build/index.js"
      };
      Bun.write(`${svelteRoot}/${out}/package.json`, JSON.stringify(productionize));
      builder.log.success("Start server with: bun ./build/index.js");
      return;
    },
    async emulate() {
      return {
        async platform({ config, prerender }) {
          return {
            ws: websocketHandlerDetermined
          };
        }
      };
    }
  };
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
async function compress(directory, options) {
  if (!existsSync(directory)) {
    return;
  }
  const filesExt = options && typeof options === "object" && options.files ? options.files : ["html", "js", "json", "css", "svg", "xml", "wasm"];
  const files = await glob(`**/*.{${filesExt.join()}}`, {
    cwd: directory,
    dot: true,
    absolute: true,
    filesOnly: true
  });
  let doBr = false;
  let doGz = false;
  if (options === true) {
    doBr = doGz = true;
  } else if (typeof options === "object") {
    doBr = options.brotli ?? false;
    doGz = options.gzip ?? false;
  }
  await Promise.all(files.map((file) => Promise.all([
    doGz && compressFile(file, "gz"),
    doBr && compressFile(file, "br")
  ])));
}
async function compressFile(file, format = "gz") {
  const compress2 = format === "br" ? zlib.createBrotliCompress({
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
      [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: statSync(file).size
    }
  }) : zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });
  const source = createReadStream(file);
  const destination = createWriteStream(`${file}.${format}`);
  await pipe(source, compress2, destination);
}
export {
  isObject,
  adapter as default
};
