import path from "path";
import fs from "fs";
import type {Plugin} from "vite";

const HOOKS_FILE_PATH = path.resolve("src/hooks.server.ts");

/**
 * Append zero-width space to a file (no visible change but triggers hot reload)
 */
function appendInvisibleCharToHooksFile() {
    try {
        let content = fs.readFileSync(HOOKS_FILE_PATH, "utf-8");
        if (!content.endsWith(' ')) {
            content += ' ';
        } else {
            // toggle to force file update (remove and add again)
            content = content.slice(0, -1);
            content += ' ';
        }
        fs.writeFileSync(HOOKS_FILE_PATH, content, "utf-8");
        console.log("✏️ Appended invisible character to hooks.server.ts");
    } catch (err) {
        console.error("Failed to append to hooks.server.ts:", err);
    }
}


let SERVER;

/**
 * Creates a Vite plugin that restarts the dev server if a symbol-related file changes.
 */
function hotCallbackPluginForSymbol(symbolName: string, callback: () => void): Plugin {
    return {
        name: 'vite-plugin-hot-symbol',

        configureServer(server) {
            //@ts-ignore
            SERVER = server;
        },

        handleHotUpdate(ctx) {
            const file = ctx.file;

            if (
                !file.includes('src') ||
                file.includes('.svelte-kit')
            ) {
                return;
            }

            console.log(`🔁 File changed: ${file}`);
            callback();

            // Notify listeners
            //@ts-ignore
            process.emit('hooks-updated', {});

            if (file !== HOOKS_FILE_PATH) {
                appendInvisibleCharToHooksFile();
            }

            //@ts-ignore
            if (SERVER) {
                console.log('♻️ Restarting Vite dev server...');
                //@ts-ignore
                SERVER.restart();
            }
        }
    };
}

/**
 * Plugin used to restart the Vite dev server when any hook-related file changes.
 */
export function resetServerPlugin(): Plugin {
    return hotCallbackPluginForSymbol('', () => {
        console.log('🔥 Detected hook usage, emitting process event 🔥');
        //@ts-ignore
        process.emit('hooks-updated', {});
    });
}