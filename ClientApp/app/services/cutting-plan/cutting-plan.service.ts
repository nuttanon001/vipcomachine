import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
// model
import { CuttingPlan ,CuttingImport} from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService, } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CuttingPlanService extends BaseRestService<CuttingPlan> {
    constructor(http: Http) {
        super(http, "api/CuttingPlan/");
    }

    // import Csv file
    postImportCsv(imports: Array<CuttingImport>): Observable<any> {
        let CreateBy: string = "Someone";// this.authService.userName || "Someone";
        let url: string = `${this.actionUrl}ImportData/${CreateBy}`;
        return this.http.post(url, JSON.stringify(imports), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class CuttingPlanServiceCommunicate extends BaseCommunicateService<CuttingPlan> {
    constructor() {
        super();
    }
}