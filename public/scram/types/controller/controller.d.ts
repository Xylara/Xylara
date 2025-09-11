import { ScramjetInitConfig } from "../types";
import { ScramjetFrame } from "./frame";
import { ScramjetGlobalEvents } from "../client/events";
export declare class ScramjetController extends EventTarget {
    #private;
    private db;
    constructor(config: Partial<ScramjetInitConfig>);
    init(): Promise<void>;
    createFrame(frame?: HTMLIFrameElement): ScramjetFrame;
    encodeUrl(url: string | URL): string;
    decodeUrl(url: string | URL): string;
    openIDB(): Promise<IDBDatabase>;
    modifyConfig(newconfig: Partial<ScramjetInitConfig>): Promise<void>;
    addEventListener<K extends keyof ScramjetGlobalEvents>(type: K, listener: (event: ScramjetGlobalEvents[K]) => void, options?: boolean | AddEventListenerOptions): void;
}
