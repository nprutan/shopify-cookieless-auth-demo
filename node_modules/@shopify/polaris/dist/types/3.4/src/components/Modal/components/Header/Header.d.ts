import React from 'react';
export interface HeaderProps {
    id: string;
    children?: React.ReactNode;
    onClose(): void;
}
export declare function Header({ id, children, onClose }: HeaderProps): JSX.Element;
