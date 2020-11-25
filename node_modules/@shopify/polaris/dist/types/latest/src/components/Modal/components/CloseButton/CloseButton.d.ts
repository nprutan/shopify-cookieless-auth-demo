/// <reference types="react" />
export interface CloseButtonProps {
    title?: boolean;
    onClick(): void;
}
export declare function CloseButton({ title, onClick }: CloseButtonProps): JSX.Element;
