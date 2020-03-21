import { DBConnection } from "../DBConnection";
import { AppGlobals } from "../AppGlobals";
import { PictureImpl, VideoImpl } from "../models/Media";

export class QueryService {
    private db: DBConnection = AppGlobals.db;
    private userAssessmentTable = "SELECT assessment.id AS assess_id, temp_id, age, gender FROM Assessment INNER JOIN User ON Assessment.user_id = User.id";

    async runMediaQuery(type: string, filter: any[], groupBy: string, limit: number, page: number): Promise<any> {
        console.log(filter);
        let query = `SELECT * FROM ${type} INNER JOIN (${this.userAssessmentTable}) AS A ON A.assess_id = ${type}.assess_id`;
        query += this.buildFilter(filter);
        query += this.buildGroupBy(groupBy);
        let result: any[] = await this.db.send(query);
        return this.buildResult(result, groupBy !== "none", limit, page);
    }

    private buildFilter(filter: any[]): string {
        let conditions: string[] = [];
        filter.forEach(f => {
            let type = f.type;
            let value = f.value;
            let condition = this.buildCondition(type, value);
            if (condition !== null) conditions.push(condition);
        })
        if (conditions.length != 0) return ` WHERE ${conditions.join(" AND ")} `;
        return "";
    }

    private buildCondition(type: string, value: any): any {
        switch(type) {
            case "assessment":
                let values = value.map((v: string) => `'${v}'`);
                return `temp_id IN (${values.join(",")})`;
            case "time":
                return `${value.max} >= time_created AND time_created >= ${value.min}`
            case "age":
                return `${value.max} >= age AND age >= ${value.min}`
            case "gender":
                return `gender = '${value.toUpperCase()}'`;
        }
        return null;
    }

    private buildGroupBy(groupBy: string): string {
        let group = "none";
        switch(groupBy) {
            case "assessment":
                group = "temp_id";
                break;
            case "age":
                group = "age";
                break;
            case "gender":
                group = "gender";
                break;
        }
        return group === "none" ? "" : " ORDER BY " + group;;
    }

    private buildPagination(limit: number, page: number): string {
        return ""
    }

    private buildResult(rawData: any[], isGrouped: boolean, limit: number, page: number): any {
        let pagedData = rawData.slice((page - 1) * limit, Math.min(page * limit, rawData.length));
        let data = pagedData.map((d: any) => { return { path: d.path, date: d.time_created}; });
        let result: any;
        if (isGrouped) {
            result = { none: data };
        } else {
            result = { none: data };
        }
        return {
            total: Math.ceil(rawData.length / limit),
            current: page,
            data: result
        };
    }
}