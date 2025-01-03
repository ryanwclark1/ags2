import { Gtk } from 'astal/gtk3';
import { globalAIVar } from 'src/globals/ai';
import { bind } from 'astal';
import { AIMessage } from 'src/lib/types/ai';

const MessageItem = ({ message }: { message: AIMessage }): JSX.Element => {
    return (
        <box className={`ai-message ${message.role}`} hexpand>
            <box className={'message-content'}>
                <label
                    className={'message-text'}
                    label={message.content}
                    wrap={true}
                    xalign={message.role === 'user' ? 1 : 0}
                />
            </box>
        </box>
    );
};

export const MessagesWidget = (): JSX.Element => {
    return (
        <box className={'ai-menu-item-container messages'} halign={Gtk.Align.FILL} vexpand>
            <box className={'messages-container-box'} vertical>
                {bind(globalAIVar).as((ai) => (
                    <box className={'messages-list'} vertical>
                        {ai.messages.map((msg, i) => (
                            <MessageItem key={i} message={msg} />
                        ))}
                    </box>
                ))}
            </box>
        </box>
    );
};