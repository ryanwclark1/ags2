import { Gtk } from 'astal/gtk3';
import { globalAIVar } from 'src/globals/ai';
import { bind } from 'astal';
import { cycleAIProvider, clearMessages } from 'src/globals/ai';

export const HeaderWidget = (): JSX.Element => {
    return (
        <box className={'ai-menu-item-container header'} halign={Gtk.Align.FILL}>
            <box className={'header-container-box'}>
                <box className={'provider-info'} hexpand>
                    <label
                        className={'provider-label'}
                        label={bind(globalAIVar).as(ai =>
                            `${ai.currentProvider.toUpperCase()} ${ai.isTyping ? '(typing...)' : ''}`
                        )}
                    />
                </box>
                <box className={'header-actions'}>
                    <button
                        className={'action-button switch-provider'}
                        tooltipText={'Switch AI Provider'}
                        onClick={cycleAIProvider}
                    >
                        <label className={'action-icon'} label={'󰒟'} />
                    </button>
                    <button
                        className={'action-button clear'}
                        tooltipText={'Clear Chat'}
                        onClick={clearMessages}
                    >
                        <label className={'action-icon'} label={'󰃢'} />
                    </button>
                </box>
            </box>
        </box>
    );
};