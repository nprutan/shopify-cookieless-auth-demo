/// <reference types="react" />
export default function initHeadManager(): {
    mountedInstances: Set<unknown>;
    updateHead: (head: JSX.Element[]) => void;
};
