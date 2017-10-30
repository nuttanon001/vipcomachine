// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { OverTimeMaster, OverTimeDetail } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { OverTimeDetailService, OverTimeMasterService } from "../../services/service.index";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "overtime-view",
    templateUrl: "./overtime-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
/** overtime-view component*/
export class OvertimeViewComponent extends BaseViewComponent<OverTimeMaster>
{
    details: Array<OverTimeDetail>;
    columns: Array<TableColumn> = [
        { prop: "EmpCode", name: "Employee Code", flexGrow: 1 },
        { prop: "EmployeeString", name: "Employee Name", flexGrow: 1 },
        { prop: "TotalHour", name: "Hour", flexGrow: 1 },
        { prop: "Remark", name: "Remark", flexGrow: 1 },
        { prop: "OverTimeDetailStatus", name: "Status", flexGrow: 1, cellClass: this.getCellClass }
    ];
    /** overtime-view ctor */
    constructor(
        private service: OverTimeDetailService
    ) { super(); }

    // load more data
    onLoadMoreData(value: OverTimeMaster) {
        this.service.getByMasterId(value.OverTimeMasterId)
            .subscribe(dbDetail => {
                this.details = dbDetail.slice();
            });
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        if (value === 1) {
            return { "is-wait": true };
        } else if (value === 2) {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }
}