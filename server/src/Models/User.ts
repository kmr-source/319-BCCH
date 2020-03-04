import { User } from "./IUser";
import { DBConnection } from "../DBConnection";

export class UserImpl implements User {
    private _username: string;
    private _displayName: string;
    private _gender: string;
    private _birthdate: string;
    private _password: string;
    private _type: string;
    private _age: number;

    constructor(
        username: string,
        displayName: string,
        gender: string,
        birthdate: string,
        password: string,
        type: string,
        age: number,
    ) {
        this._username = username;
        this._displayName = displayName;
        this._gender = gender;
        this._birthdate = birthdate;
        this._password = password;
        this._type = type;
        this._age = age;
    }

    get username(): string { return this._username; }
    get displayName(): string { return this._displayName; }
    get gender(): string { return this._gender; }
    get birthdate(): string { return this._birthdate; }
    get password(): string { return this._password; }
    get type(): string { return this._type; }
    get age(): number { return this._age; }

    private static buildUser(u: any): User | undefined {
        let user = undefined;
        if (u) {
            user = new UserImpl(
                u.username,
                u.displayName,
                u.gender,
                u.birthdate,
                u.password,
                u.type,
                u.age
            );
        }

        return user;
    }

    static async getById(id: number): Promise<User | undefined> {
        let db = DBConnection.getInstance();
        let result: any[] = await db.send("SELECT * FROM User WHERE id=?", [id]);
        return UserImpl.buildUser(result[0]);
    }

    static async getByName(uName: string): Promise<User | undefined> {
        let db = DBConnection.getInstance();
        let result: any[] = await db.send("SELECT * FROM User WHERE username=?", [uName]);
        return UserImpl.buildUser(result[0]);
    }

    static async getAll(): Promise<User[]> {
        let db = DBConnection.getInstance();
        let result: any[] = await db.send("SELECT * FROM User", []);
        let user: User[] = [];
        for (let u of result) {
            user.push(UserImpl.buildUser(u));
        }

        return user;
    }

}