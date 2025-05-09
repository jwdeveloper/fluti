import type {GeminiConfig} from "$lib/fluti/utils/ai/types";

export async function askGemini(config: GeminiConfig): Promise<any> {

    let returnJson = config?.jsonOutput ?? true
    let model = config?.model ?? 'gemini-2.0-flash-lite'
    let api = 'streamGenerateContent'

    if (config.image)
        api = 'generateContent'
    //https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${api}?key=${config.apiKey}`;
    const body = {
        systemInstruction: {
            parts: [{text: config.systemMessage}]
        },
        contents: [{parts: []}],
        generationConfig: {}
    };

    if (config.jsonOutput) {
        body.generationConfig = {
            temperature: config.temperature ?? 1,
            responseMimeType: "application/json",
        }
    }
    if (config.image) {
        let imagePrompt = {
            inline_data: {
                mime_type: "image/jpeg",
                data: config.image,
            },
        }
        //@ts-ignore
        body.contents[0].parts.push(imagePrompt)
    }

    if (config.prompt) {
        let content = {text: config.prompt}
        //@ts-ignore
        body.contents[0].parts.push(content)
    }

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    if (!response.ok) {
        let text = await response.text();
        console.log("ERROR", text, body, response)

        throw new Error(`Response AI error ${config.prompt}:`)
    }

    let result = await response.json();
    let resultList = [];
    if (Array.isArray(result)) {
        resultList = result;
    } else {
        resultList = [result];
    }

    let resultMessage = ''
    for (let item of resultList) {
        for (let candidate of item.candidates) {
            let parts = candidate.content.parts ?? [];
            for (let part of parts) {
                resultMessage += part.text
            }
        }
        // console.log("Gemini response:", item.candidates);
    }

    if (!returnJson)
        return resultMessage;

    let object = extractJson(resultMessage);
    return object;
}

function fixJson(text: string) {
    return text
        .replace(/,\s*}/g, '}')   // Remove comma before }
        .replace(/,\s*]/g, ']');   // (optional) Remove comma before ]
}


function extractJson(resultMessage: string) {
    try {
        return JSON.parse(resultMessage);
    } catch (e) {
        return extractJsonFromText(resultMessage)
    }
}

function extractJsonFromText(text: string) {
    if (!text.includes("json")) {
        throw new Error(`Response is not JSON: ${text}`)
    }
    const regex = /```json\s*([\s\S]*?)\s*```/i;
    const match = text.match(regex);

    if (!match) {
        throw new Error('No JSON block found between ```json and ```');
    }

    let jsonString = match[1];
    jsonString = fixJson(jsonString)

    try {
        return JSON.parse(jsonString);
    } catch (e) {

        throw new Error(`Invalid JSON structure. ${jsonString}`);
    }
}