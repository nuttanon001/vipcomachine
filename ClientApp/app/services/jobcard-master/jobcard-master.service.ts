import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { JobCardMaster, AttachFile } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JobCardMasterService extends BaseRestService<JobCardMaster> {
    constructor(http: Http) {
        super(http, "api/JobCardMaster/");
    }

    //===================== Upload File ===============================\\
    // get file
    getAttachFile(JobCardMasterId: number): Observable<Array<AttachFile>> {
        let url: string = `${this.actionUrl}GetAttach/${JobCardMasterId}/`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // upload file
    postAttactFile(JobCardMasterId: number, files: FileList): Observable<any> {
        let input = new FormData();

        for (var i = 0; i < files.length; i++) {
            if (files[i].size <= 5242880)
                input.append("files", files[i]);
        }

        console.log("Files : ", input);

        let CreateBy: string = "Someone";// this.authService.userName || "Someone";
        let url: string = `${this.actionUrl}PostAttach/${JobCardMasterId}/${CreateBy}`;
        return this.http.post(url, input).map(this.extractData).catch(this.handleError);
    }

    // delete file
    deleteAttactFile(AttachId: number): Observable<any> {
        let url: string = this.actionUrl + "DeleteAttach/" + AttachId;
        return this.http.delete(url).catch(this.handleError);
    }

    //===================== End Upload File ===========================\\
}

@Injectable()
export class JobCardMasterServiceCommunicate extends BaseCommunicateService<JobCardMaster> {
    constructor() {
        super();
    }
}