import type {Plugin, PreviewServer, ViteDevServer} from 'vite';
import {Server} from "socket.io";

import http from 'http'
import https from 'https'
import http2 from 'http2'

type Http = typeof http | typeof https | typeof http2
type CreateServer = Http['createServer']

console.log('file createded')
let server: ViteDevServer | PreviewServer | undefined = undefined;
let initialCallback: (server: Server) => void = () => {
}

const handle = () => {
    console.log('vite server check', server)

    if (!server)
        return console.log('server plugin, http server not found!')

    //@ts-ignore
    const io = new Server(server.httpServer)
    initialCallback(io)
    console.log('WebSocket server is running on port!');
}

const devHandle = (viteServer: ViteDevServer | PreviewServer) => {
    server = viteServer
    console.log('dev handle')
}

function WsPlugin() {
    return {
        name: 'vite-sveltekit-node-ws',
        async transform(code, id) {
            if (id.endsWith('@sveltejs/kit/src/runtime/server/index.js')) {
                const rep = `import {handle} from '$lib/fluti/vite_plugins/ServerPlugin';\nhandle();`
                //   console.log(code)
                let output = {code: code = rep + '\n' + code};
                return output;
            }
            return null;
        },
        configurePreviewServer: devHandle,
        configureServer: devHandle
    } satisfies Plugin;
}

const useServer = (callback: (server: Server) => void) => {
    initialCallback = callback;
}

export {useServer, handle};
export default WsPlugin;