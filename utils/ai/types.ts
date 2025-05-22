export interface GeminiConfig {
    sessionId?: string
    apiKey: string
    prompt?: string
    image?: string
    systemMessage?: string
    temperature?: number
    jsonOutput?: boolean
    imageOutput?: boolean
    model?:
        string |
        'learnlm-2.0-flash-experimental' |
        'gemini-2.5-pro-preview-03-25' |
        'gemini-2.5-flash-preview-04-17' |
        'gemini-2.0-flash-lite' |
        'gemma-2-27b-it' |
        'gemini-2.0-flash' |
        'gemini-pro-vision'
}
