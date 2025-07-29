//
//This plugin was created since there is bug in handler.js file that make app crash sometimes.
//
// 605 |       FILES["/" + name.normalize().replace(/\\+/g, "/")] = { abs, stats, headers };
// 606 |     });
// 607 |   }
// 608 |   let lookup2 = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);
// 609 |   return function(req, next) {
// 610 |
//                          ^
// TypeError: "/" cannot be parsed as a URL.
//  code: "ERR_INVALID_URL"
//
//
// fix place before line 610 this code
//
//         if (req.url === "/") {
//             return new Response(null, {status: 404});
//         }

// vite-handler-modifier-plugin.ts

import fs from 'fs';
import path from 'path';


export default function fixHandlerJsFilePluginAfterBuild() {
    return {
        name: 'handler-modifier-plugin',
        enforce: 'post',
        closeBundle() {
            // This hook runs after the build is complete
            try {
                // Find the handler.js file in the build output directory
                const buildDir = path.resolve('build'); // Adjust if your build output is in a different directory
                const handlerPath = path.join(buildDir, 'handler.js');

                if (fs.existsSync(handlerPath)) {
                    // Read the file content
                    let fileContent = fs.readFileSync(handlerPath, 'utf-8');

                    // Find the target line
                    const targetLine = 'let pathname = new URL(req.url).pathname;';
                    const targetIndex = fileContent.indexOf(targetLine);

                    if (targetIndex !== -1) {
                        // Get the position right BEFORE the target line
                        const insertPosition = targetIndex;

                        // Insert the new code before the target line
                        const codeToInsert = `    if (req.url === "/") {
        return new Response(null, {status: 404});
    }
    `;

                        fileContent =
                            fileContent.substring(0, insertPosition) +
                            codeToInsert +
                            fileContent.substring(insertPosition);

                        // Save the modified content back to the file
                        fs.writeFileSync(handlerPath, fileContent, 'utf-8');

                        console.log('Successfully modified handler.js file!');
                    } else {
                        console.error('Target code not found in handler.js');
                    }
                } else {
                    console.error('handler.js file not found in build directory');
                }
            } catch (error) {
                console.error('Error processing handler.js:', error);
            }
        }
    };
}