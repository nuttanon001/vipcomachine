import { Component, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { TaskMachine, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { TaskMachineService, TaskMachineServiceCommunicate } from "../../services/task-machine/task-machine.service";
// timezone
import * as moment from "moment-timezone";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "task-machine-master",
    templateUrl: "./task-machine-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
// task-machine-master component*/
export class TaskMachineMasterComponent
    extends BaseMasterComponent<TaskMachine, TaskMachineService> {
    // parameter
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");

    columns: Array<TableColumn> = [
        { prop: "TaskMachineName", name: "TaskMachineName", flexGrow :1 },
        { prop: "MachineString", name: "Code", flexGrow: 1 },
        { prop: "CuttingPlanNo", name: "CuttingPlan", flexGrow: 1 },
        //{ prop: "ActualStartDate", name: "ActualDate", pipe: this.datePipe , flexGrow: 1 },
    ];

    /** task-machine-master ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<TaskMachine>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        super(
            service,
            serviceCom,
            serviceComDataTable,
            dialogsService,
            viewContainerRef
        );
    }

    ngOnInit(): void {
        // debug here
        // console.log("Task-Machine ngOnInit");

        // override class
        super.ngOnInit();
            this.route.params.subscribe((params: any) => {
                let key: number = params["condition"];

                if (key) {
                    let newTaskMachine: TaskMachine = {
                        TaskMachineId: 0,
                        JobCardDetailId: key
                    };
                    setTimeout(() => {
                        this.onDetailEdit(newTaskMachine);
                    }, 1500);

                }
            }, error => console.error(error));
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: TaskMachine): TaskMachine {
        let zone:string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.PlannedStartDate !== null) {
                value.PlannedStartDate = moment.tz(value.PlannedStartDate, zone).toDate();
            }
            if (value.PlannedEndDate !== null) {
                value.PlannedEndDate = moment.tz(value.PlannedEndDate, zone).toDate();
            }
            if (value.ActualStartDate !== null) {
                value.ActualStartDate = moment.tz(value.ActualStartDate, zone).toDate();
            }
            if (value.ActualEndDate !== null) {
                value.ActualEndDate = moment.tz(value.ActualEndDate, zone).toDate();
            }

            if (value.TaskMachineHasOverTimes) {
                value.TaskMachineHasOverTimes.forEach((OverTime, index) => {
                    if (OverTime.CreateDate) {
                        OverTime.CreateDate = moment.tz(OverTime.CreateDate, zone).toDate();
                    }
                    if (OverTime.ModifyDate) {
                        OverTime.ModifyDate = moment.tz(OverTime.ModifyDate, zone).toDate();
                    }
                    if (OverTime.OverTimeStart) {
                        OverTime.OverTimeStart = moment.tz(OverTime.OverTimeStart, zone).toDate();
                    }
                    if (OverTime.OverTimeEnd) {
                        OverTime.OverTimeEnd = moment.tz(OverTime.OverTimeEnd, zone).toDate();
                    }

                    if (value.TaskMachineHasOverTimes) {
                        value.TaskMachineHasOverTimes[index] = OverTime;
                    }
                });
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: TaskMachine): void {
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.editValue.Creator = undefined;
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: TaskMachine): void {
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.TaskMachineId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value: TaskMachine): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.TaskMachineId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}