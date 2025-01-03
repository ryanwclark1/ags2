import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { getAIStatusIcon, globalAIVar } from 'src/globals/ai';
import { BarBoxChild } from 'src/lib/types/bar';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

const { label, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.ai;

export const Ai = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(globalAIVar)], (ai) => {
        const aiStatusIcon = getAIStatusIcon(ai);
        return aiStatusIcon;
    });

    const labelBinding = Variable.derive([bind(globalAIVar)], (ai) => {
        if (ai.isTyping) {
            return '...';
        }
        if (ai.unreadCount > 0) {
            return `(${ai.unreadCount})`;
        }
        return '';
    });

    const aiModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(globalAIVar).as((v) => {
            const status = v.isTyping ? 'Typing...' : v.isActive ? 'Active' : 'Inactive';
            const provider = v.currentProvider.toUpperCase();
            const lastMsg = v.lastMessage ? `\nLast: ${v.lastMessage}` : '';
            return `AI Chat (${provider}) ${status}${lastMsg}`;
        }),
        boxClass: 'ai-custom',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
            onDestroy: () => {
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return aiModule;
};
