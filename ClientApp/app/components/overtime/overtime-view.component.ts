// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { OverTimeMaster, OverTimeDetail } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "overtime-view",
    templateUrl: "./overtime-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// overtime-view component*/
export class OvertimeViewComponent extends BaseViewComponent<OverTimeMaster> {
    lastOverTimeMaster: OverTimeMaster;
    details: Array<OverTimeDetail>;
    columns: Array<TableColumn> = [
        { prop: "EmpCode", name: "Employee Code", flexGrow: 1 },
        { prop: "EmployeeString", name: "Employee Name", flexGrow: 1 },
        { prop: "TotalHour", name: "Hour", flexGrow: 1 },
        { prop: "Remark", name: "Remark", flexGrow: 1 },
        { prop: "StatusString", name: "Status", flexGrow: 1, cellClass: this.getCellClass }
    ];
    /** overtime-view ctor */
    constructor(
        private service: OverTimeDetailService,
        private serviceMaster: OverTimeMasterService,
    ) { super(); }

    // load more data
    onLoadMoreData(value: OverTimeMaster): void {
        if (this.displayValue) {
            if (this.displayValue.InfoActual) {
                this.displayValue.InfoActual = this.onReplaceMuitLine(this.displayValue.InfoActual);
            }

            if (this.displayValue.InfoPlan) {
                this.displayValue.InfoPlan = this.onReplaceMuitLine(this.displayValue.InfoPlan);
            }
        }

        if (value) {

            this.service.getByMasterId(value.OverTimeMasterId)
                .subscribe(dbDetail => this.details = dbDetail.slice());

            if (value.LastOverTimeId) {
                this.serviceMaster.getOneKeyNumber(value.LastOverTimeId)
                    .subscribe(dbLastMaster => {
                        this.lastOverTimeMaster = dbLastMaster;
                        if (this.lastOverTimeMaster.InfoActual) {
                            this.lastOverTimeMaster.InfoActual = this.onReplaceMuitLine(this.lastOverTimeMaster.InfoActual);
                        }

                        if (this.lastOverTimeMaster.InfoPlan) {
                            this.lastOverTimeMaster.InfoPlan = this.onReplaceMuitLine(this.lastOverTimeMaster.InfoPlan);
                        }
                    });
            }
        }

    }

    onReplaceMuitLine(text: string): string {
        if (text) {
            return text.replace(new RegExp("\n", "g"), "<br />");
        }
        return "";
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        if (value === "Use") {
            return { "is-wait": true };
        } else if (value === "Cancel") {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }
}