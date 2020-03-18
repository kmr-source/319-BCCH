import { DBConnection } from "../DBConnection";
import { AppGlobals } from "../AppGlobals";

export class QueryService {
    private db: DBConnection = AppGlobals.db;
}