import { DBConnection } from "./DBConnection";
import { SessionManager } from "./services/ISessionManager";

export class AppGlobals {
    static db: DBConnection;
    static sessionManager: SessionManager;
    static port: string | number;
}