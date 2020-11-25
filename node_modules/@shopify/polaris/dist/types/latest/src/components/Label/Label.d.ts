/// <reference types="react" />
export interface LabelProps {
    /** Label content */
    children?: string;
    /** A unique identifier for the label */
    id: string;
    /** Visually hide the label */
    hidden?: boolean;
}
export declare function labelID(id: string): string;
export declare function Label({ children, id, hidden }: LabelProps): JSX.Element;
