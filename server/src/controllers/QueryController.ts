import { AdminController } from "./AdminController";
import { QueryService } from "../services/QueryService";

export class QueryController extends AdminController {

    private service: QueryService = new QueryService();

    async queryMedia() {
        // we prepared this.request && this.response !!
        this.response.status(200).send("TODO");
    }

    async querySurvey() {
        // we prepared this.request && this.response !!
        this.response.status(200).send("TODO");
    }

}