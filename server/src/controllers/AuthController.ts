import { Controller } from "./Controller";
import { User } from "../models/IUser";
import { UserService } from "../services/UserService";

export class AuthController extends Controller {
    protected user: User;
    protected isAdmin: boolean;

    private async verify() {
        let cookie = this.request.cookies.access_token;
        try {
            this.user = await (new UserService()).getUser(cookie);
            this.isAdmin = this.user.type === "admin";
        } catch {
            this.response.status(401).send({ error: "Invalid credentials" });
        }
    }

    async setup(config?: any): Promise<boolean> {
        try {
            await this.verify();
            return true;
        } catch (e) {
            this.response.status(401).send({ error: "Not logged in yet" });
            return false;
        }
    }
}