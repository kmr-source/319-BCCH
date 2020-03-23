import { DBConnection } from "./DBConnection";
import { SessionManager } from "./services/ISessionManager";
import { StorageManager } from "./StorageManager";

export enum AppMode {
    PROD = 1,
    DEV = 2
}

export class AppGlobals {
    static mode: AppMode;
    static db: DBConnection;
    static storageManager: StorageManager;
    static sessionManager: SessionManager;
    static port: string | number;
}