import { exit } from "node:process";
import { serve } from "bun";
import buildOptions from "./buildoptions";
import {
  env
} from "./handler.js";
import createFetch from "./handler.js";
const hostname = env("HOST", "0.0.0.0");
const dev = !!Bun.env?.DEV || Bun.env?.NODE_ENV === "development" || false;
const port = dev ? 5173 : Number.parseInt(env("PORT", 80));
const maxRequestBodySize = buildOptions.maxRequestSize ?? Number.parseInt(env("BODY_SIZE_LIMIT", 14244));
const tls = buildOptions.tls ?? buildOptions.ssl;
let httpserver = undefined;
const httpConfig = await createServerConfig(false);
async function gatherWebsocketFile() {
  try {
    const fileURLToPath = await import("node:url").then(({ fileURLToPath }) => fileURLToPath);
    const handler = await import(fileURLToPath(new URL("server/websockets.js", import.meta.url).href));
    return handler.default;
  } catch (e) {
    console.log("No websocket handler found");
    return;
  }
}
export async function createServerConfig(https = false) {
  let port = 80;
  if (https) {
    port = dev ? env("HTTPS_PORT", 2045) : env("HTTPS_PORT", 443);
  } else {
    port = dev ? env("PORT", 5173) : env("PORT", 80);
  }
  return {
    maxRequestBodySize: Number.isNaN(maxRequestBodySize) ? undefined : maxRequestBodySize,
    fetch: createFetch(buildOptions.assets ?? true, https),
    hostname,
    port,
    development: Bun.env.MODE === "development" || Bun.env.NODE_ENV === "development" || false,
    error(error) {
      console.error(error);
      return new Response("Uh oh!!", { status: 500 });
    },
    websocket: await gatherWebsocketFile(),
    tls: https && tls ? {
      cert: Bun.file(tls.cert),
      key: Bun.file(tls.key),
      ca: tls?.ca && Bun.file(tls.ca)
    } : undefined
  };
}
try {
  httpserver = serve(httpConfig);
} catch (e) {
  console.warn(e);
  exit(1);
}
console.info(`HTTP server listening on ${`${hostname}:${port}`}`);
if (tls) {
  try {
    const tlsModule = await import("./tls.js");
    setTimeout(() => {
      tlsModule.watchCertificates();
    }, 3000);
  } catch (e) {
    console.error(`Error loading TLS module: "./tls.ts"`, e);
  }
}
