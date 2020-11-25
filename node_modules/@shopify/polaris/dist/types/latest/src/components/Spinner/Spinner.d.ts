/// <reference types="react" />
declare type Color = 'white' | 'teal' | 'inkLightest';
declare type NewDesignLanguageColor = 'highlight';
declare type Size = 'small' | 'large';
export interface SpinnerProps {
    /**
     * Color of spinner
     * @default 'teal'
     */
    color?: Color | NewDesignLanguageColor;
    /**
     * Size of spinner
     * @default 'large'
     */
    size?: Size;
    /** Accessible label for the spinner */
    accessibilityLabel?: string;
    /** Allows the component to apply the correct accessibility roles based on focus */
    hasFocusableParent?: boolean;
}
export declare function Spinner({ size, color, accessibilityLabel, hasFocusableParent, }: SpinnerProps): JSX.Element;
export {};
