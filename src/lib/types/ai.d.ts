export type AIProvider = 'openai' | 'gemini' | 'ollama';

export type AIMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: number;
};

export type AIState = {
    isActive: boolean;
    currentProvider: AIProvider;
    lastMessage: string;
    unreadCount: number;
    messages: AIMessage[];
    isTyping: boolean;
};

export type AIConfig = {
    openai?: {
        apiKey: string;
        model: string;
    };
    gemini?: {
        apiKey: string;
        model: string;
    };
    ollama?: {
        endpoint: string;
        model: string;
    };
};

export type AIResponse = {
    content: string;
    provider: AIProvider;
    timestamp: number;
};