import { Variable } from 'astal';
import { AIState, AIProvider, AIMessage } from '../lib/types/ai';
import options from 'src/options';


export const DEFAULT_AI_STATE: AIState = {
    isActive: false,
    currentProvider: 'openai',
    lastMessage: '',
    unreadCount: 0,
    messages: [],
    isTyping: false,
};

export const globalAIVar = new Variable<AIState>(DEFAULT_AI_STATE);

export const getAIStatusIcon = (aiState: AIState): string => {
    const icons: Record<AIProvider, string> = {
        openai: '󰭹',
        gemini: '󰊗',
        ollama: '󱙺',
    };

    return icons[aiState.currentProvider] || '󰭹';
};

export const cycleAIProvider = (): void => {
    const providers: AIProvider[] = ['openai', 'gemini', 'ollama'];
    const currentState = globalAIVar.value;
    const currentIndex = providers.indexOf(currentState.currentProvider);
    const nextProvider = providers[(currentIndex + 1) % providers.length];

    globalAIVar.value = {
        ...currentState,
        currentProvider: nextProvider,
    };
};

export const addMessage = (message: AIMessage): void => {
    const currentState = globalAIVar.value;
    globalAIVar.value = {
        ...currentState,
        messages: [...currentState.messages, message],
        lastMessage: message.content,
        unreadCount: currentState.unreadCount + 1,
    };
};

export const clearMessages = (): void => {
    const currentState = globalAIVar.value;
    globalAIVar.value = {
        ...currentState,
        messages: [],
        lastMessage: '',
        unreadCount: 0,
    };
};

export const setTyping = (isTyping: boolean): void => {
    const currentState = globalAIVar.value;
    globalAIVar.value = {
        ...currentState,
        isTyping,
    };
};

globalThis['globalAIVar'] = globalAIVar;
