// angular
import { Component, Input, Output } from "@angular/core";
import { OnInit, ViewContainerRef, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// model
import { TaskMachineHasOverTime } from "../../models/model.index";
// service
import { DialogsService } from "../../services/dialog/dialogs.service";
// rxjs
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "over-time-edit",
    templateUrl: "./over-time-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** over-time-edit component*/
export class OverTimeEditComponent implements OnInit
{
    editValueForm: FormGroup;
    @Output("ComplateOrCancel") ComplateOrCancel = new EventEmitter<any>();
    @Input("EditValueOverTime") EditValueOverTime: TaskMachineHasOverTime;
    /** over-time-edit ctor */
    constructor(
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) { }

    /** Called by Angular after over-time-edit component initialized */
    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.editValueForm = this.fb.group({
            JobCardDetailId: [this.EditValueOverTime.OverTimeId],
            Description: [this.EditValueOverTime.Description],
            OverTimeStart: [this.EditValueOverTime.OverTimeStart,
                [
                    Validators.required
                ]
            ],
            OverTimeEnd: [this.EditValueOverTime.OverTimeEnd],
            OverTimePerDate: [this.EditValueOverTime.OverTimePerDate,
                [
                    Validators.required
                ]
            ],
            Creator: [this.EditValueOverTime.Creator],
            CreateDate: [this.EditValueOverTime.CreateDate],
            Modifyer: [this.EditValueOverTime.Modifyer],
            ModifyDate: [this.EditValueOverTime.ModifyDate],
            //FK
            TaskMachineId: [this.EditValueOverTime.TaskMachineId]
        });
    }

    // on New/Update
    onNewOrUpdateClick() {
        if (this.editValueForm) {
            let newOrUpdate: TaskMachineHasOverTime = this.editValueForm.value;
            this.ComplateOrCancel.emit(this.editValueForm.value);
        }
    }

    // on Cancel
    onCancelClick() {
        this.ComplateOrCancel.emit(undefined);
    }
}