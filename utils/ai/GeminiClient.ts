export interface GeminiConfig {
    apiKey: string
    prompt: string
    systemMessage?: string
    model?: string | 'gemini-2.0-flash-lite' | 'gemma-2-27b-it'
}

export async function askGemini(config: GeminiConfig): Promise<any> {
    let model = config?.model ?? 'gemini-2.0-flash-lite'
    let api = 'streamGenerateContent'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${api}?key=${config.apiKey}`;
    const body = {
        systemInstruction: {
            parts: [{text: config.systemMessage}]
        },
        contents: [
            {
                parts: [{text: config.prompt}]
            }
        ],

    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    if (!response.ok) {
        console.log(response)
        throw new Error(`Response AI error ${prompt}:`)
    }

    const result = await response.json();
    let resultMessage = ''
    for (let item of result) {
        for (let candidate of item.candidates) {
            let parts = candidate.content.parts ?? [];
            for (let part of parts) {
                resultMessage += part.text
            }
        }
        // console.log("Gemini response:", item.candidates);
    }
    if (!resultMessage.includes("json")) {
        throw new Error(`Response is not JSON ${prompt}: ${resultMessage}`)
    }
    let object = extractJson(resultMessage);
    return object;
}

function extractJson(text: string) {
    const regex = /```json\s*([\s\S]*?)\s*```/i;
    const match = text.match(regex);

    if (!match) {
        throw new Error('No JSON block found between ```json and ```');
    }

    const jsonString = match[1];

    try {
        return JSON.parse(jsonString);
    } catch (e) {

        throw new Error(`Invalid JSON structure. ${jsonString}`);
    }
}