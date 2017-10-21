import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { TaskMachine,OptionSchedule } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
// rx/js
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TaskMachineService extends BaseRestService<TaskMachine> {
    constructor(http: Http) {
        super(http, "api/TaskMachine/");
    }

    //===================== TaskMachine Schedule ===========================\\
    // get TaskMachine WaitAndProcess
    getTaskMachineWaitAndProcess(option: OptionSchedule): Observable<any> {
        let url: string = `${this.actionUrl}TaskMachineWaitAndProcess/`;
        return this.http.post(url, JSON.stringify(option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

    // post Check Task Machine Time
    postTaskMachineTime(taskMachine: TaskMachine): Observable<any> {
        let url: string = `${this.actionUrl}CheckMachineTime/`;
        return this.http.post(url, JSON.stringify(taskMachine), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class TaskMachineServiceCommunicate extends BaseCommunicateService<TaskMachine> {
    constructor() {
        super();
    }
}