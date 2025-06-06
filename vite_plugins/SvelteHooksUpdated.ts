import path from "path";

export function onSvelteHooksUpdated(callback: () => void) {
    let functionClen = () => {
        callback()
        process.off('hooks-updated', functionClen)
    }
    process.on('hooks-updated', functionClen)
}


function hotCallbackPlugin(watchedFilePath: string, callback: () => void) {
    const resolvedPath = path.resolve(watchedFilePath);
    return {
        name: 'vite-plugin-hot-callback',
        //@ts-ignore
        handleHotUpdate({file}) {
            if (path.resolve(file) === resolvedPath) {
                console.log(`🔁 File hot-swapped: ${file}`);
                callback();
            }
        }
    };
}


export function hooksUpdatedPlugin() {

    const currentPath = __dirname;
    const basePath = currentPath.split('/src/')[0] + '/src/';
    let targetPath = path.resolve(basePath, './hooks.server.ts');
    console.log(targetPath)
    return hotCallbackPlugin(targetPath, () => {
        console.log('🔥🔥🔥 hooks.server.ts hot-swap! 🔥🔥🔥');
        //@ts-ignore
        process.emit('hooks-updated', {});
    })
}