import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { StandardTime } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class StandardTimeService extends BaseRestService<StandardTime> {
    constructor(http: Http) {
        super(http, "api/StandardTime/");
    }
}