import React from 'react';
export interface LinkProps {
    /** ID for the link */
    id?: string;
    /** The url to link to */
    url?: string;
    /** The content to display inside the link */
    children?: React.ReactNode;
    /** Makes the link open in a new tab */
    external?: boolean;
    /** Makes the link color the same as the current text color and adds an underline */
    monochrome?: boolean;
    /** Callback when a link is clicked */
    onClick?(): void;
}
export declare function Link({ url, children, onClick, external, id, monochrome, }: LinkProps): JSX.Element;
