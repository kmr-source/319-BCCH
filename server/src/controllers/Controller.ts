
import {Request, Response} from "express";

class Controller {
    request: Request
    response: Response
    
    constructor(req: Request, res: Response) {
        this.request = req;
        this.response = res;
    }
}