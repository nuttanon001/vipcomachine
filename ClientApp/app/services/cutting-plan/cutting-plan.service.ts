import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { CuttingPlan } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService, } from "../service.index";

@Injectable()
export class CuttingPlanService extends BaseRestService<CuttingPlan> {
    constructor(http: Http) {
        super(http, "api/CuttingPlan/");
    }
}

@Injectable()
export class CuttingPlanServiceCommunicate extends BaseCommunicateService<CuttingPlan> {
    constructor() {
        super();
    }
}