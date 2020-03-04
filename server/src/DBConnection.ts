import * as mysql from "mysql";

export interface DBConfig {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    poolSize: number
}

export class DBConnection {

    private connectionPool: mysql.Pool;
    private static db: DBConnection = null;
    private static config: DBConfig = {
        poolSize: 20,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'admin',
        database: 'BCCH_FUTURE_STAR'
    }

    private constructor() {
        this.connectionPool = mysql.createPool({
            connectionLimit: DBConnection.config.poolSize,
            host: DBConnection.config.host,
            port: DBConnection.config.port,
            user: DBConnection.config.user,
            password: DBConnection.config.password,
            database: DBConnection.config.database
        });
    }

    static updateConfig(c: DBConfig) {
        DBConnection.config = c;
    }

    static getInstance(): DBConnection {
        if (!DBConnection.db) {
            DBConnection.db = new DBConnection();
        }

        return DBConnection.db;
    }

    async send(query: string, values: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connectionPool.query(
                query,
                values,
                (err: mysql.MysqlError, result: any, fields: mysql.FieldInfo[]) => {
                    if (err) {
                        reject(new Error(err.code));
                    } else {
                        resolve(result);
                    }
                })
        });
    }

    async withTransaction(commands: (c :mysql.PoolConnection) => Promise<mysql.PoolConnection>): Promise<any> {
        return new Promise((res, rej) => {
            this.connectionPool.getConnection((err, conn: mysql.PoolConnection) => {
                if (err) {
                    rej(err.code);
                }

                res(conn);
            });
        })
        .then((con: mysql.PoolConnection) => {
            return commands(con);
        })
        .then((connection) => {
            return new Promise((resolve, reject) => {
                connection.commit((err) => {
                    if (err) {
                        reject(err.code);
                    }
                    
                    resolve();
                });
            });
        })

    }

    destroy() {
        this.connectionPool.end((err) => { });
    }
}