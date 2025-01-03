import { Gtk } from 'astal/gtk3';
import { globalAIVar } from 'src/globals/ai';
import { AIService } from 'src/components/bar/modules/ai/aiService';

export const InputWidget = (): JSX.Element => {
    const handleSubmit = async (entry: Gtk.Entry) => {
        const text = entry.get_text();
        if (!text.trim()) return;

        const currentState = globalAIVar.value;
        globalAIVar.value = {
            ...currentState,
            messages: [
                ...currentState.messages,
                { role: 'user', content: text, timestamp: Date.now() }
            ],
            isTyping: true,
        };

        entry.set_text('');

        try {
            await AIService.sendMessage(currentState.currentProvider, text);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <box className={'ai-menu-item-container input'} halign={Gtk.Align.FILL}>
            <box className={'input-container-box'}>
                <entry
                    className={'message-input'}
                    hexpand
                    placeholderText={'Type a message...'}
                    onActivate={self => handleSubmit(self)}
                />
                <button
                    className={'send-button'}
                    onClick={() => {
                        const entry = document.querySelector('.message-input') as Gtk.Entry;
                        if (entry) handleSubmit(entry);
                    }}
                >
                    <label className={'send-icon'} label={'󰜎'} />
                </button>
            </box>
        </box>
    );
};