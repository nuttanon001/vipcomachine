// angular
import { Component, Input, Output } from "@angular/core";
import { OnInit, ViewContainerRef, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// model
import { TaskMachineHasOverTime,MachineHasOperator } from "../../models/model.index";
// service
import { DialogsService } from "../../services/dialog/dialogs.service";
import { MachineHasOperatorService } from "../../services/machine-has-operator/machine-has-operator.service";
// rxjs
import { Subscription } from "rxjs/Subscription";
// prme
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "over-time-edit",
    templateUrl: "./over-time-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** over-time-edit component*/
export class OverTimeEditComponent implements OnInit
{
    editValueForm: FormGroup;
    operators: Array<SelectItem>;
    operatorsEmp: Array<MachineHasOperator>;

    @Output("ComplateOrCancel") ComplateOrCancel = new EventEmitter<any>();
    @Input("EditValueOverTime") EditValueOverTime: TaskMachineHasOverTime;
    @Input("machineId") machineId: number;
    /** over-time-edit ctor */
    constructor(
        private serviceOperator: MachineHasOperatorService,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) { }

    /** Called by Angular after over-time-edit component initialized */
    ngOnInit(): void {
        this.buildForm();
        if (this.machineId) {
            this.serviceOperator.getByMasterId(this.machineId)
                .subscribe(dbOperator => {
                    this.operatorsEmp = dbOperator.slice();
                    this.operators = new Array;

                    this.operators.push({ label: "-", value: undefined });
                    for (let item of dbOperator) {
                        this.operators.push({ label: `${(item.EmpCode || "")} ${(item.EmployeeName || "")} `, value: item.EmpCode });
                    }
                });
        }
    }

    buildForm(): void {
        this.editValueForm = this.fb.group({
            JobCardDetailId: [this.EditValueOverTime.OverTimeId],
            Description: [this.EditValueOverTime.Description,
                [
                    Validators.maxLength(200)
                ]
            ],
            OverTimeDate: [this.EditValueOverTime.OverTimeDate,
                [
                    Validators.required
                ]
            ],
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
            TaskMachineId: [this.EditValueOverTime.TaskMachineId],
            EmpCode: [this.EditValueOverTime.EmpCode,
                [
                    Validators.required
                ]
            ]
        });
    }

    // on New/Update
    onNewOrUpdateClick() {
        if (this.editValueForm) {
            let newOrUpdate: TaskMachineHasOverTime = this.editValueForm.value;
            newOrUpdate.NameThai = this.operatorsEmp.filter(item => item.EmpCode === newOrUpdate.EmpCode)[0].EmployeeName || "";
            this.ComplateOrCancel.emit(newOrUpdate);
        }
    }

    // on Cancel
    onCancelClick() {
        this.ComplateOrCancel.emit(undefined);
    }
}