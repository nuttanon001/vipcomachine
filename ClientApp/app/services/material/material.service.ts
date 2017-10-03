import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { Material } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class MaterialService extends BaseRestService<Material> {
    constructor(http: Http) {
        super(http, "api/Material/");
    }
}
@Injectable()
export class MaterialServiceCommunicate extends BaseCommunicateService<Material> {
    constructor() {
        super();
    }
}