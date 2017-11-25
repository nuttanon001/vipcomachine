import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
// model
import { TaskMachine,OptionSchedule,EmployeeGroup } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
// rx/js
import { Observable } from "rxjs/Observable";

@Injectable()
export class TaskMachineService extends BaseRestService<TaskMachine> {
    constructor(http: Http) {
        super(http, "api/TaskMachine/");
    }

    // get TaskMachine Has OverTime
    getTaskMachineHasOverTime(taskMachineId:number): Observable<any> {
        let url: string = `${this.actionUrl}GetTaskMachineHasOverTime/${taskMachineId}`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // ===================== TaskMachine Schedule ===========================\\
    // get workgroup only has JobCardMaster
    getWorkGroupOnlyHasJobCardMaster(): Observable<Array<EmployeeGroup>> {
        let url: string = `${this.actionUrl}GetWorkGroup/`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

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

    // ===================== TaskMachine Report ===========================\\
    // get Task Machine Number
    getTaskMachinePaper(taskMachineId: number): Observable<any> {
        let url: string = this.actionUrl + "GetReportTaskMachine/" + taskMachineId + "/";
        // console.log(url);

        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .map(res => res.blob())
            .catch(this.handleError);
    }

    // get Task Machine Number
    GetTaskMachinePaperOverTime(taskMachineId: number): Observable<any> {
        let url: string = this.actionUrl + "GetReportTaskMachineOverTime/" + taskMachineId + "/";
        // console.log(url);

        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .map(res => res.blob())
            .catch(this.handleError);
    }

}

@Injectable()
export class TaskMachineServiceCommunicate extends BaseCommunicateService<TaskMachine> {
    constructor() {
        super();
    }
}