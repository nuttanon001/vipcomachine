import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { JobCardDetail } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class JobCardDetailService extends BaseRestService<JobCardDetail> {
    constructor(http: Http) {
        super(http, "api/JobCardDetail/");
    }
}

@Injectable()
export class JobCardDetailServiceServiceCommunicate extends BaseCommunicateService<JobCardDetailService> {
    constructor() {
        super();
    }
}