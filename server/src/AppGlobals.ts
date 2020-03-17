import { DBConnection } from "./DBConnection";
import { SessionManager } from "./services/ISessionManager";

export enum AppMode {
    PROD = 1,
    DEV = 2
}

export class AppGlobals {
    static mode: AppMode;
    static db: DBConnection;
    static sessionManager: SessionManager;
    static port: string | number;
}