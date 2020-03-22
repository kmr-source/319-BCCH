import { AdminController } from "./AdminController";
import { QueryService } from "../services/QueryService";

export class QueryController extends AdminController {

    private service: QueryService = new QueryService();

    async queryMedia() {
        let body = this.request.body;
        if (body.TYPE == null || body.FILTER == null) {
            this.response.status(400).send({ error: "Missing required parameters" });
            return;
        }
        let groupBy: string = body.GROUP_BY ?? "none";
        let limit: number = body.LIMIT ?? 20;
        let page: number = body.PAGE ?? 1;
        let result = await (this.service.runMediaQuery(body.TYPE, body.FILTER, groupBy, limit, page));
        this.response.status(200).send(result);
    }

    async querySurvey() {
        // we prepared this.request && this.response !!
        this.response.status(200).send("TODO");
    }

}