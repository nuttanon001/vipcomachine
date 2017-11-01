import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { OverTimeMaster,OptionOverTimeSchedule } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OverTimeMasterService extends BaseRestService<OverTimeMaster> {
    constructor(http: Http) {
        super(http, "api/OverTimeMaster/");
    }

    // get last OverTimeMaster
    getLastOverTimeMaster(LastOverTimeMasterId: number, GroupCode: string, CurrentId:number): Observable<OverTimeMaster> {
        let url: string = `${this.actionUrl}GetLastOverTime/${LastOverTimeMasterId}/${GroupCode}/${CurrentId}`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    //===================== OverTime Schedule ===========================\\
    // get OverTime Schedule
    getOverTimeMasterSchedule(option: OptionOverTimeSchedule): Observable<any> {
        let url: string = `${this.actionUrl}OverTimeSchedule/`;
        return this.http.post(url, JSON.stringify(option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class OverTimeMasterServiceCommunicate extends BaseCommunicateService<OverTimeMaster> {
    constructor() {
        super();
    }
}