// angular
import { Component } from "@angular/core";
// models
import { TaskMachine, TaskMachineHasOverTime } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "task-machine-view",
    templateUrl: "./task-machine-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
/** task-machine-view component*/
export class TaskMachineViewComponent extends BaseViewComponent<TaskMachine>
{
    // parameter
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");

    overtimes: Array<TaskMachineHasOverTime> = new Array;
    columns: Array<TableColumn> = [
        { prop: "OverTimeStart", name: "Start", pipe:this.datePipe, flexGrow: 1 },
        { prop: "OverTimeEnd", name: "End", pipe: this.datePipe, flexGrow: 1 },
        { prop: "OverTimePerDate", name: "Hours", flexGrow:1 }
    ];

    /** task-machine-view ctor */
    constructor(
        private service: TaskMachineHasOverTimeService
    ) {
        super();
    }

    // load more data
    onLoadMoreData(value: TaskMachine) {
        this.service.getByMasterId(value.TaskMachineId)
            .subscribe(dbOverTimes => {
                this.overtimes = dbOverTimes.slice();//[...dbDetail];
                // console.log("DataBase is :", this.details);
            }, error => console.error(error));
    }
}