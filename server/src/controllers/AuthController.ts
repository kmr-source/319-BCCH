import { Controller } from "./Controller";
import { User } from "../models/IUser";
import { Request, Response } from "express";

class LoginError extends Error {
    constructor(...args: any[]) {
        super(...args);
    }
}

export class AuthController extends Controller {
    protected user: User;
    protected isAdmin: boolean;

    private verify() {
        const users: User[] = [
            {
                username: "admin",
                displayName: "Admin A",
                gender: "N/A",
                birthdate: "1970/01/01",
                password: "admin",
                type: "admin",
                age: 99
            }, {
                username: "lang",
                displayName: "Lang C",
                gender: "Male",
                birthdate: "9999/12/31",
                password: "123",
                type: "user",
                age: 99
            }, {
                username: "raymond",
                displayName: "Raymond Chen",
                gender: "Male",
                birthdate: "1997/01/09",
                password: "123",
                type: "user",
                age: 99
            },
        ];

        const cookie: string = this.request.cookies.access_token;
        if (cookie) {
            for (const u of users) {
                if (u.username === cookie) {
                    return;
                }
            }
        }

        throw new LoginError();
    }

    constructor(req: Request, res: Response) {
        super(req, res);
        try {
            this.verify();
        } catch (e) {
            res.status(401).send({ error: "Not logged in yet" });
        }
    }
}
// const nc = new AssessmentController;
// new AssessmentController().getAllSurveys()