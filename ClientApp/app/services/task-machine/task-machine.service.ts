import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { TaskMachine } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class TaskMachineService extends BaseRestService<TaskMachine> {
    constructor(http: Http) {
        super(http, "api/TaskMachine/");
    }
}

@Injectable()
export class TaskMachineServiceCommunicate extends BaseCommunicateService<TaskMachine> {
    constructor() {
        super();
    }
}