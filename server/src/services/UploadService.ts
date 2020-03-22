import { User } from "../models/IUser";
import { AssessmentImpl } from "../models/Assessment";
import { VideoImpl, PictureImpl } from "../models/Media";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { SurveyImpl } from "../models/Survey";


export abstract class MediaFile {

    protected file: NodeJS.ReadableStream;
    protected type: string;

    constructor(file: NodeJS.ReadableStream) { this.file = file; }
    getFile(): NodeJS.ReadableStream { return this.file; }
    toType(): string { return this.type; }
}

export class VideoFile extends MediaFile {
    protected type = "video";
}

export class PictureFile extends MediaFile {
    protected type = "picture";
}

export interface Answers {
    sId: string,
    answers: any
}

export class UploadService {

    async init(user: User, tempID: number): Promise<number> {
        let assess = new AssessmentImpl(tempID, user);
        return assess.store();
    }

    storeMedia(rawFileName: string, mediaFile: MediaFile, user: User): Promise<string> {
        let file = mediaFile.getFile();
        let tpe = mediaFile.toType();
        let ext = path.extname(rawFileName);
        let filename = `${uuid()}${ext}`;

        let folderPath = path.resolve(__dirname, `../../../upload_test/${user.id}/${tpe}`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let storedPath = `${folderPath}/${filename}`;

        return new Promise((resolve, reject) => {
            let writeStream = fs.createWriteStream(storedPath);
            file.on('error', (e) => {
                reject(e);
            });
            writeStream.on('error', (e) => {
                reject(e);
            });
            writeStream.on('finish', () => {
                resolve(storedPath);
            });
            file.pipe(writeStream);
        });
    }

    async recordVideo(assessID: number, user: User, path: string) {
        let video = new VideoImpl(assessID, user, path);
        let storeRes = await video.store()
        return storeRes;
    }

    async recordPicture(assessID: number, user: User, path: string) {
        let pic = new PictureImpl(assessID, user, path);
        let storeRes = pic.store();
        return storeRes;
    }

    async recordSurvey(assessID: number, user: User, ans: Answers) {
        let tempID = parseInt(ans.sId);
        let allAnswers = Object.keys(ans.answers).map(k => {
            let resp: string = ans.answers[k];
            return {
                number: parseInt(k),
                answer: resp
            }
        });

        let sur = new SurveyImpl(
            assessID,
            tempID,
            user,
            allAnswers
        );

        let storeRes = await sur.store();
        return storeRes;
    }

    async finalize(id: number): Promise<boolean> {
        let finalRes = await AssessmentImpl.finalize(id);
        return finalRes;
    }

}