import DropdownMenu from '../shared/dropdown/index.js';
import { MessagesWidget } from './chat/MessagesWidget';
import { InputWidget } from './chat/InputWidget';
import { HeaderWidget } from './chat/HeaderWidget';
import options from 'src/options';
import { bind } from 'astal/binding.js';
import Variable from 'astal/variable.js';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';

const { enabled } = options.menus.ai;
const { transition } = options.menus;

export default function AIMenu(): JSX.Element {
    const aiBinding = Variable.derive([bind(enabled)], (isEnabled: boolean) => isEnabled);

    return (
        <DropdownMenu
            name={'aimenu'}
            transition={bind(transition).as((transition: keyof typeof RevealerTransitionMap) => RevealerTransitionMap[transition])}
        >
            <box css={'padding: 1px; margin: -1px;'}>
                <box className={'ai-menu-content'} vexpand={false}>
                    <box className={'ai-content-container'} vertical>
                        <box className={'ai-content-items'} vertical>
                            <HeaderWidget />
                            <MessagesWidget />
                            <InputWidget />
                        </box>
                    </box>
                </box>
            </box>
        </DropdownMenu>
    );
}
