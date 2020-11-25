import React from 'react';
import { AnimationProps } from '../../../../types';
interface BaseDialogProps {
    labelledBy?: string;
    instant?: boolean;
    children?: React.ReactNode;
    limitHeight?: boolean;
    large?: boolean;
    onClose(): void;
    onEntered?(): void;
    onExited?(): void;
}
export declare type DialogProps = BaseDialogProps & AnimationProps;
export declare function Dialog({ instant, labelledBy, children, onClose, onExited, onEntered, large, limitHeight, ...props }: DialogProps): JSX.Element;
export {};
