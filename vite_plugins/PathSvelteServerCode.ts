import {type Plugin, type ViteDevServer} from "vite";
import path from "path";
import fs from "fs";

let currentFunction2 = `
export async function get_hooks() {
\tlet handle;
\tlet handleFetch;
\tlet handleError;
\tlet init;
\t({ handle, handleFetch, handleError, init } = await import("../../../src/hooks.server.ts"));

\tlet reroute;
\tlet transport;
\t

\treturn {
\t\thandle,
\t\thandleFetch,
\t\thandleError,
\t\tinit,
\t\treroute,
\t\ttransport
\t};
}
`

let currentFunction = `
async function get_hooks() {
  let handle;
  let handleFetch;
  let handleError;
  let init;
  ({ handle, handleFetch, handleError, init } = await import("./hooks.server.js"));
  let reroute;
  let transport;
  return {
    handle,
    handleFetch,
    handleError,
    init,
    reroute,
    transport
  };
}
`
let wantedFunction2 = `
export async function get_hooks() {
    let hooks = await import("../../../src/hooks.server.ts");

    console.log('calling wanted function');

    let handleWebsocket = hooks?.handleWebsocket;
    let handle = hooks?.handle;
    let handleFetch = hooks?.handleFetch;
    let handleError = hooks?.handleError;
    let init = hooks?.init;
    let reroute = hooks?.reroute;
    let transport = hooks?.transport;
    
    console.log('calling wanted function',hooks);
    
    return {
        handleWebsocket,
        handle,
        handleFetch,
        handleError,
        init,
        reroute,
        transport
    };
}
`

let wantedFunction = `
export async function get_hooks() {
    let hooks = await import("./hooks.server.js");

    let handleWebsocket = hooks?.handleWebsocket;
    let handle = hooks?.handle;
    let handleFetch = hooks?.handleFetch;
    let handleError = hooks?.handleError;
    let init = hooks?.init;
    let reroute = hooks?.reroute;
    let transport = hooks?.transport;
    return {
        handleWebsocket,
        handle,
        handleFetch,
        handleError,
        init,
        reroute,
        transport
    };
}
`
const targetFileName = 'internal.js';


export async function updateHooksFunction(filePath: string) {
    // Assume typical SvelteKit output path
    console.log('updating hooks function')
    // const outDir = path.resolve(process.cwd(), '.svelte-kit/output/server/chunks');
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf-8');
    // console.log(code)
    const updated = code.replace(currentFunction2, wantedFunction2);

    if (updated !== code) {
        fs.writeFileSync(filePath, updated, 'utf-8');
        console.log(`[patchSvelteServerHooks] Patched get_hooks in ${filePath}`);
    }

}


async function findInternalJs(startDir: string): Promise<string | null> {
    let entries: fs.Dirent[];

    try {
        entries = fs.readdirSync(startDir, {withFileTypes: true});
    } catch (err: any) {
        // Log or handle specific error (e.g., directory doesn't exist)
        if (err.code !== 'ENOENT') {
            console.error(`Error reading directory "${startDir}":`, err);
        }
        return null; // gracefully return null on error
    }

    for (const entry of entries) {
        const fullPath = path.join(startDir, entry.name);
        if (entry.isDirectory()) {
            const result = await findInternalJs(fullPath);
            if (result) return result;
        } else if (entry.name === targetFileName) {
            return fullPath;
        }
    }

    return null;
}

export function pathSvelteSeverHooks(): Plugin[] {
    return [
        {
            name: 'patch-node-module',
            apply: 'build', // or 'serve' for dev too
            async closeBundle() {
                const buildOutDir = path.resolve(process.cwd(), '.svelte-kit/output/server/chunks');
                const file = await findInternalJs(buildOutDir);
                if (file) {
                    await updateHooksFunction(file);
                }
            }
        },
        {
            name: 'vite:rewrite-get-hooks',
            apply: 'serve', // Also valid for build

            configureServer(server: ViteDevServer) {

                server.watcher.on('add', async (file) => {
                    if (path.basename(file) === targetFileName) {
                        console.log(`[patchSvelteServerHooks] Detected internal.js created`);
                        await updateHooksFunction(file);
                    }
                });

                server.watcher.on('change', async (file) => {
                    if (path.basename(file) === targetFileName) {
                        console.log(`[patchSvelteServerHooks] Detected internal.js changed`);
                        await updateHooksFunction(file);
                    }
                });
                try {
                    const root = path.resolve(process.cwd(), '.svelte-kit/output/server/chunks');
                    findInternalJs(root).then(file => {
                        if (file) {
                            updateHooksFunction(file);
                        }
                    });

                    console.log('looking for internal file')
                    const root2 = path.resolve(process.cwd(), '.svelte-kit/generated');
                    findInternalJs(root2).then(file => {
                        console.log('find root2')
                        if (file) {
                            updateHooksFunction(file);
                        }
                    });

                } catch (e) {
                    console.log(e)
                }

            }
        }]
}

