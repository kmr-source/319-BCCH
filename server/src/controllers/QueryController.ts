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
        /*{
            "SURVEY": "1" // survey id, we query one survey at a time
            "FILTER": "..."  // same as video/picture
            "GROUP_BY": "time" // "age", "gender", "assessment", "question_number",
            "LIMIT": 20,
            "PAGE": 1
        }
        // We show question number and answer
        {
            "total": 50,
            "current": 1,
            "data": {
            "group_by_attr_1": [{"number": 1, "answer": "..."} ....],
            "group_by_attr_2": ["..."],
                "group_by_attr_3": ["..."],
                "group_by_attr_4": ["..."],
        }
        }
        total  is how many pages in total, if it is hard to tell then just leave it null
        current is the current page showing. "data" should be grouped by the group by attributes: for example if it is age, then it should be {"1": [...] , "2" : [...]}
        */
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