import React from 'react';
import type { Key } from '../../types';
export interface PaginationDescriptor {
    /** Keyboard shortcuts for the next button */
    nextKeys?: Key[];
    /** Keyboard shortcuts for the previous button */
    previousKeys?: Key[];
    /** Tooltip for the next button */
    nextTooltip?: string;
    /** Tooltip for the previous button */
    previousTooltip?: string;
    /** The URL of the next page */
    nextURL?: string;
    /** The URL of the previous page */
    previousURL?: string;
    /** Whether there is a next page to show */
    hasNext?: boolean;
    /** Whether there is a previous page to show */
    hasPrevious?: boolean;
    /** Accessible label for the pagination */
    accessibilityLabel?: string;
    /** Callback when next button is clicked */
    onNext?(): void;
    /** Callback when previous button is clicked */
    onPrevious?(): void;
    /** Text to provide more context in between the arrow buttons */
    label?: React.ReactNode;
}
export interface PaginationProps extends PaginationDescriptor {
    /** A more subdued control for use in headers */
    plain?: boolean;
}
export declare function Pagination({ hasNext, hasPrevious, nextURL, previousURL, onNext, onPrevious, nextTooltip, previousTooltip, nextKeys, previousKeys, plain, accessibilityLabel, label, }: PaginationProps): JSX.Element;
