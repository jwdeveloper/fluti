import path from "path";
import fs from "fs";


/**
 * Checks if the current file imports the `onSvelteHooksUpdated` method, then if file got hot swapped or updated by vite
 * is calling this method.
 * @param callback
 */
export function onCurrentFileHotSwappedByVite(callback: () => void) {
    let functionClen = () => {
        callback()
        process.off('hooks-updated', functionClen)
    }
    process.on('hooks-updated', functionClen)
}


// Utility: Checks if a file imports a specific method
function fileImportsSymbol(filePath: string, symbolName: string): boolean {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${symbolName}\\b[^}]*\\}\\s+from\\s+['"][^'"]+['"]`, "g");
        return importRegex.test(content);
    } catch (e) {
        return false;
    }
}

function hotCallbackPluginForSymbol(symbolName: string, callback: () => void) {
    return {
        name: 'vite-plugin-hot-symbol',
        //@ts-ignore
        handleHotUpdate({file}) {
            let path = file as string;
            if (!path.includes('src')) {
                return;
            }
            if (path.endsWith('.svelte'))
                return;
            if (path.includes('.svelte-kit'))
                return;

            console.log(`🔁 File imports '${symbolName}', hot-swapping: ${file}`);
            callback();
        }
    };
}

export function fileHotSwapUpdateHookPlugin() {
    return hotCallbackPluginForSymbol(onCurrentFileHotSwappedByVite.name, () => {
        console.log('🔥🔥🔥 hook import detected, triggering callback 🔥🔥🔥');
        //@ts-ignore
        process.emit('hooks-updated', {});
    });
}