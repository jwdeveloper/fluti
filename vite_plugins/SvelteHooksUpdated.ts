import path from "path";
import fs from "fs";

const HOOKS_FILE_PATH = path.resolve("src/hooks.server.ts");

/**
 * Checks if the current file imports the `onSvelteHooksUpdated` method, then if file got hot swapped or updated by vite
 * is calling this method.
 * @param callback
 */
export function onCurrentFileHotSwappedByVite(callback: () => void) {
    let functionClen = () => {
        console.log('event executed')
        callback()
        process.off('hooks-updated', functionClen)
    }
    process.on('hooks-updated', functionClen)
}

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


function hotCallbackPluginForSymbol(symbolName: string, callback: () => void) {
    return {
        name: 'vite-plugin-hot-symbol',
        //@ts-ignore
        handleHotUpdate({file}) {
            // console.log(`File reported change ${file}`);
            if (
                !file.includes('src') ||
                file.includes('.svelte-kit')
            ) {
                return;
            }
            console.log(`🔁 File changed: ${file}`);
            callback();
            //@ts-ignore
            process.emit('hooks-updated', {});
            if (file !== HOOKS_FILE_PATH)
                appendInvisibleCharToHooksFile();
        }
    };
}

export function fileHotSwapUpdateHookPlugin() {
    return hotCallbackPluginForSymbol('', () => {
        console.log('🔥 Detected hook usage, emitting process event 🔥');
        //@ts-ignore
        process.emit('hooks-updated', {});
    });
}