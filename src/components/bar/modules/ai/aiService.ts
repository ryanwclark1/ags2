import { execAsync } from 'astal';
import { AIProvider, AIResponse } from 'src/lib/types/ai';
import options from 'src/options';
import { addMessage, setTyping } from 'src/globals/ai';

export class AIService {
    private static async callOpenAI(message: string): Promise<AIResponse> {
        const { apiKey, model } = options.ai.openai;
        const response = await execAsync(`curl https://api.openai.com/v1/chat/completions \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${apiKey}" \
            -d '{
                "model": "${model}",
                "messages": [{"role": "user", "content": "${message}"}],
                "temperature": 0.7
            }'`);

        const data = JSON.parse(response);
        return {
            content: data.choices[0].message.content,
            provider: 'openai',
            timestamp: Date.now(),
        };
    }

    private static async callGemini(message: string): Promise<AIResponse> {
        const { apiKey, model } = options.ai.gemini;
        const response = await execAsync(`curl https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${apiKey}" \
            -d '{
                "contents": [{"parts": [{"text": "${message}"}]}]
            }'`);

        const data = JSON.parse(response);
        return {
            content: data.candidates[0].content.parts[0].text,
            provider: 'gemini',
            timestamp: Date.now(),
        };
    }

    private static async callOllama(message: string): Promise<AIResponse> {
        const { endpoint, model } = options.ai.ollama;
        const response = await execAsync(`curl ${endpoint}/api/generate \
            -H "Content-Type: application/json" \
            -d '{
                "model": "${model}",
                "prompt": "${message}"
            }'`);

        const data = JSON.parse(response);
        return {
            content: data.response,
            provider: 'ollama',
            timestamp: Date.now(),
        };
    }

    static async sendMessage(provider: AIProvider, message: string): Promise<AIResponse> {
        setTyping(true);

        try {
            let response: AIResponse;

            switch (provider) {
                case 'openai':
                    response = await this.callOpenAI(message);
                    break;
                case 'gemini':
                    response = await this.callGemini(message);
                    break;
                case 'ollama':
                    response = await this.callOllama(message);
                    break;
                default:
                    throw new Error(`Unsupported AI provider: ${provider}`);
            }

            addMessage({
                role: 'assistant',
                content: response.content,
                timestamp: response.timestamp,
            });

            return response;
        } catch (error) {
            console.error(`AI service error: ${error}`);
            throw error;
        } finally {
            setTyping(false);
        }
    }
}
