﻿// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { TaskMachine, TaskMachineHasOverTime, Employee } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { TaskMachineService, TaskMachineServiceCommunicate } from "../../services/task-machine/task-machine.service";
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
// primeng
import { SelectItem } from "primeng/primeng";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable"

@Component({
    selector: "task-machine-edit",
    templateUrl: "./task-machine-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** task-machine-edit component*/
export class TaskMachineEditComponent
    extends BaseEditComponent<TaskMachine, TaskMachineService>
{
    /** task-machine-edit ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        private serviceOverTime: TaskMachineHasOverTimeService,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: TaskMachine): void {
        if (value) {
            this.service.getOneKeyNumber(value.TaskMachineId)
                .subscribe(dbData => {
                    this.editValue = dbData;
                    // Set Date
                    //PlanStartDate
                    if (this.editValue.PlannedStartDate) {
                        this.editValue.PlannedStartDate = this.editValue.PlannedStartDate != null ?
                            new Date(this.editValue.PlannedStartDate) : new Date();
                    }
                    //PlanEndDate
                    if (this.editValue.PlannedEndDate) {
                        this.editValue.PlannedEndDate = this.editValue.PlannedEndDate != null ?
                            new Date(this.editValue.PlannedEndDate) : new Date();
                    }
                    //ActualStartDate
                    if (this.editValue.ActualStartDate) {
                        this.editValue.ActualStartDate = this.editValue.ActualStartDate != null ?
                            new Date(this.editValue.ActualStartDate) : new Date();
                    }
                    //ActualEndDate
                    if (this.editValue.ActualEndDate) {
                        this.editValue.ActualEndDate = this.editValue.ActualEndDate != null ?
                            new Date(this.editValue.ActualEndDate) : new Date();
                    }
                    // OverTime
                    if (this.editValue.TaskMachineId) {
                        this.serviceOverTime.getByMasterId(this.editValue.TaskMachineId)
                            .subscribe(dbOperator => {
                                this.editValue.TaskMachineHasOverTimes = dbOperator.slice();
                                this.editValueForm.patchValue({
                                    TaskMachineHasOverTimes: this.editValue.TaskMachineHasOverTimes.slice(),
                                });
                            });
                    }

                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                TaskMachineId: 0
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            TaskMachineId: [this.editValue.TaskMachineId],
            TaskMachineName: [this.editValue.TaskMachineName,
                [
                    Validators.maxLength(200),
                ]
            ],
            Description: [this.editValue.Description,
                [
                    Validators.maxLength(50),
                ]
            ],
            Priority: [this.editValue.Priority],
            TotalQuantity: [this.editValue.TotalQuantity],
            CurrentQuantity: [this.editValue.CurrentQuantity],
            PlannedStartDate: [this.editValue.PlannedStartDate,
                [
                    Validators.required
                ]
            ],
            PlannedEndDate: [this.editValue.PlannedEndDate,
                [
                    Validators.required
                ]
            ],
            ActualStartDate: [this.editValue.ActualStartDate],
            ActualEndDate: [this.editValue.ActualEndDate],
            ActualManHours: [this.editValue.ActualManHours],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            //Fk
            MachineId: [this.editValue.MachineId],
            JobCardDetailId: [this.editValue.JobCardDetailId],
            AssignedBy: [this.editValue.AssignedBy],
            PrecedingTaskMachineId: [this.editValue.PrecedingTaskMachineId],
            TaskMachineHasOverTimes: [this.editValue.TaskMachineHasOverTimes],
            //ViewModel
            PlannedStartTime: [this.editValue.PlannedStartTime,
                [
                    Validators.required
                ]
            ],
            PlannedEndTime: [this.editValue.PlannedEndTime,
                [
                    Validators.required
                ]
            ],
            ActualStartTime: [this.editValue.ActualStartTime],
            ActualEndTime: [this.editValue.ActualEndTime],
            MachineString: [this.editValue.MachineString],
            JobCardDetailString: [this.editValue.JobCardDetailString],
            AssignedByString: [this.editValue.AssignedByString]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

    }

    // AssignedBy
    onSelectedAssignedBy() {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef,"Employee")
            .subscribe(employees => {
                if (employees) {
                    let employee: Employee = Object.assign({}, employees[0]);
                    // cloning an object
                    this.editValueForm.patchValue({
                        AssignedByString: employee.NameThai,
                        AssignedBy: employee.EmpCode,
                    });
                }
            });
    }

    // Machine
    onSelectedMachine() {
        this.serviceDialogs.dialogSelectMachine(this.viewContainerRef)
            .subscribe(machine => {
                if (machine) {
                    this.editValueForm.patchValue({
                        MachineId: machine.MachineId,
                        MachineString: `${machine.MachineCode}/${machine.MachineName}`
                    })
                }
            });
    }
}