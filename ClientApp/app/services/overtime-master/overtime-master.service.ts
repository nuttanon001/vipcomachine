import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { OverTimeMaster } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OverTimeMasterService extends BaseRestService<OverTimeMaster> {
    constructor(http: Http) {
        super(http, "api/OverTimeMaster/");
    }

    // get last OverTimeMaster
    getOverTimeMaster(LastOverTimeMasterId: number, GroupCode: string): Observable<OverTimeMaster> {
        let url: string = `${this.actionUrl}GetLastOverTime/${LastOverTimeMasterId}/${GroupCode}/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class OverTimeMasterServiceCommunicate extends BaseCommunicateService<OverTimeMaster> {
    constructor() {
        super();
    }
}