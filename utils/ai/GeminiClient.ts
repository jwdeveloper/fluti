import type {GeminiConfig} from "$lib/fluti/utils/ai/types";
import {CacheService} from "$lib/fluti/services/CacheService";

export interface ChatHistory {
    sender: 'user' | 'model',
    message: string
}

let chatHistory = new CacheService<string, ChatHistory[]>();

export async function askGemini(config: GeminiConfig): Promise<any> {

    let returnJson = config?.jsonOutput ?? true
    let model = config?.model ?? 'gemini-2.0-flash-lite'
    let api = 'streamGenerateContent'

    if (config.image)
        api = 'generateContent'

    if (config.imageOutput) {
        // model = 'gemini-2.0-flash-preview-image-generation'
        api = 'generateContent'
        config.systemMessage += '- You must generate an image.'
    }

    //https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${api}?key=${config.apiKey}`;
    const body = {
        systemInstruction: {
            parts: [{text: config.systemMessage}]
        },
        contents: [],
        generationConfig: {}
    };

    if (config.sessionId && chatHistory.has(config.sessionId)) {
        let historyMessages = chatHistory.get(config.sessionId) ?? [];
        for (let message of historyMessages) {
            let content = {
                role: message.sender,
                parts: [{text: message.message}]
            }
            //@ts-ignore
            body.contents.push(content)
        }
    }

    if (config.jsonOutput) {
        body.generationConfig = {
            temperature: config.temperature ?? 1,
            responseMimeType: "application/json",
        }
    }
    if (config.imageOutput) {
        body.generationConfig = {
            responseModalities: ["TEXT", "IMAGE"]
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
        let userMessage = {
            role: 'user',
            parts: [{text: config.prompt}]
        }
        //@ts-ignore
        body.contents.push(userMessage)
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

    saveToHistory(config.sessionId ?? '', {sender: 'user', message: config?.prompt ?? ''})
    saveToHistory(config.sessionId ?? '', {sender: 'model', message: resultMessage})

    if (!returnJson)
        return resultMessage;

    let object = extractJson(resultMessage);
    return object;
}

function saveToHistory(sessionId: string, history: ChatHistory) {
    if (sessionId === undefined)
        return

    if (chatHistory.has(sessionId)) {
        let messages = chatHistory.get(sessionId) ?? [];
        messages.push(history);
        chatHistory.set(sessionId, messages);
    } else {
        chatHistory.set(sessionId, [history]);
    }
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