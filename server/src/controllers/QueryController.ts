import { AdminController } from "./AdminController";
import { QueryService, DownloadFileInfo } from "../services/QueryService";

export class QueryController extends AdminController {

    private service: QueryService = new QueryService();

    async queryMedia() {
        try {
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
        } catch (e) {
            console.log(e);
            this.response.status(500).send("something went wrong");
        }
    }

    async querySurvey() {
        try {
            let body = this.request.body;
            if (body.SURVEY == null || body.FILTER == null) {
                this.response.status(400).send({ error: "Missing required parameters" });
                return;
            }
            let groupBy: string = body.GROUP_BY ?? "none";
            let limit: number = body.LIMIT ?? 20;
            let page: number = body.PAGE ?? 1;
            let result = await (this.service.runSurveyQuery(body.SURVEY, body.FILTER, groupBy, limit, page));
            this.response.status(200).send(result);
        } catch (e) {
            console.log(e);
            this.response.status(500).send("something went wrong");
        }
    }
    
    async queryPlain() {
        try {
            let query = this.request.body.query;
            let res = await this.service.plainQuery(query);
            this.response.status(200).send(res);
        } catch (e) {
            console.log(e);
            this.response.status(400).send(e.message);
        }
    }

    async downloadFile() {
        try {
            let uri = this.request.query.uri;
            let info: DownloadFileInfo = await this.service.downloadFile(uri);
            this.response.setHeader('Content-disposition', 'attachment; filename=' + info.filename);
            this.response.setHeader('Content-type', info.mimeType);
            info.file.pipe(this.response.status(200));
        } catch (e) {
            console.log(e);
            this.response.status(400).send(e.message);
        }
    }

}