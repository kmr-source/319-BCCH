import { AuthController } from "./AuthController";
import { UploadService, VideoFile, MediaFile, PictureFile } from "../services/UploadService";
import * as Busboy from "busboy";

export class UploadController extends AuthController {

    private withID(handler: (i: number) => Promise<void>) {
        // parseInt is too flexible, restrict the format a little bit;
        let rawID = this.request.params.id;
        let testRes = /^\d+$/.test(rawID) && !rawID.startsWith('0');

        if (testRes) {
            handler(parseInt(this.request.params.id))
                .catch(err => {
                    console.log(err);
                    this.response.status(500).send("something goes wrong");
                });
        } else {
            this.response.status(400).send({ message: `non-number id ${this.request.params.id}` });
        }
    }

    async startUpload() {
        this.withID(async (tempID) => {
            let createdID = await (new UploadService()).init(this.user, tempID);
            this.response.send({ id: createdID });
        });
    }

    private async uploadMedia<T extends MediaFile>(
        FileConstructor: new (f: NodeJS.ReadableStream) => T
    ) {
        return new Promise<string>((res, rej) => {
            let busboy = new Busboy({ headers: this.request.headers });
            let storeProm: Promise<string>;

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                storeProm = (new UploadService()).storeMedia(filename, new FileConstructor(file), this.user);
            });

            busboy.on('finish', () => {
                storeProm
                    .then(p => {
                        res(p);
                    })
                    .catch(e => {
                        rej(e);
                    });
            });

            this.request.pipe(busboy);
        });
    }

    async uploadVideo() {
        this.withID(async (id) => {
            let filepath = await this.uploadMedia(VideoFile);
            await (new UploadService()).recordVideo(id, this.user, filepath);
            this.response.status(200).send({ status: true });
        });
    }

    async uploadPicture() {
        this.withID(async (id) => {
            let filepath = await this.uploadMedia(PictureFile);
            await (new UploadService()).recordPicture(id, this.user, filepath);
            this.response.status(200).send({ status: true });
        });
    }

    async uploadSurvey() {
        this.withID(async (id) => {
            await (new UploadService()).recordSurvey(id, this.user, this.request.body);
            this.response.status(200).send({ status: true });
        });
    }

    async endUpload() {
        this.withID(async (assessID) => {
            let res = await (new UploadService()).finalize(assessID);
            this.response.send({ status: res });
        })
    }
}