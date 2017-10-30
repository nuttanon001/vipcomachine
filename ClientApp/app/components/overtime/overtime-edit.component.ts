// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import {
    trigger, state, style,
    animate, transition
} from "@angular/animations";
// models
import { OverTimeMaster, OverTimeDetail, Employee, ProjectCodeMaster } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import {
    OverTimeMasterService, OverTimeDetailService,
    OverTimeMasterServiceCommunicate, DialogsService,
    EmployeeGroupService, AuthService
} from "../../services/service.index";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "overtime-edit",
    templateUrl: "./overtime-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
    animations: [
        trigger("flyInOut", [
            state("in", style({ transform: "translateX(0)" })),
            transition("void => *", [
                style({ transform: "translateX(-100%)" }),
                animate(250)
            ]),
            transition("* => void", [
                animate("0.2s 0.1s ease-out", style({ opacity: 0, transform: "translateX(100%)" }))
            ])
        ])
    ]
})
// overtime-edit component*/
export class OvertimeEditComponent
    extends BaseEditComponent<OverTimeMaster, OverTimeMasterService> {
    overtimeDetail?: OverTimeDetail;
    indexOverTimeDetail: number;
    lockSave: boolean = false;
    // overtime-edit ctor */
    constructor(
        service: OverTimeMasterService,
        serviceCom: OverTimeMasterServiceCommunicate,
        private serviceDialogs: DialogsService,
        private serviceDetail: OverTimeDetailService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private serviceAuth: AuthService
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: OverTimeMaster): void {
        if (value) {
            this.service.getOneKeyNumber(value.OverTimeMasterId)
                .subscribe(dbJobCardMaster => {
                    this.editValue = dbJobCardMaster;
                    // set Date
                    if (this.editValue.OverTimeDate) {
                        this.editValue.OverTimeDate = this.editValue.OverTimeDate != null ?
                            new Date(this.editValue.OverTimeDate) : new Date();
                    }

                    if (this.editValue.OverTimeMasterId) {
                        this.serviceDetail.getByMasterId(this.editValue.OverTimeMasterId)
                            .subscribe(dbDetail => {
                                this.editValue.OverTimeDetails = dbDetail.slice();
                                this.editValueForm.patchValue({
                                    OverTimeDetails: this.editValue.OverTimeDetails.slice(),
                                });
                            });
                    }
                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                OverTimeMasterId: 0,
                OverTimeStatus: 1,
                OverTimeDate: new Date(),
            };

            if (this.serviceAuth.getAuth) {
                this.editValue.EmpRequire = this.serviceAuth.getAuth.EmpCode || "";
                this.editValue.RequireString = this.serviceAuth.getAuth.NameThai || "";
            }

            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();
        this.overtimeDetail = undefined;
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            OverTimeMasterId: [this.editValue.OverTimeMasterId],
            OverTimeDate: [this.editValue.OverTimeDate],
            InfoPlan: [this.editValue.InfoPlan,
                [
                    Validators.maxLength(500),
                    Validators.required,
                ]
            ],
            InfoActual: [this.editValue.InfoActual,
                [
                    Validators.maxLength(500),
                ]
            ],
            OverTimeStatus: [this.editValue.OverTimeStatus],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            // fK
            EmpApprove: [this.editValue.EmpApprove],
            EmpRequire: [this.editValue.EmpRequire],
            ProjectCodeMasterId: [this.editValue.ProjectCodeMasterId,
                [
                    Validators.required
                ]
            ],
            GroupCode: [this.editValue.GroupCode,
                [
                    Validators.required
                ]
            ],
            OverTimeDetails: [this.editValue.OverTimeDetails],
            // viewModel
            ApproveString: [this.editValue.ApproveString],
            RequireString: [this.editValue.RequireString],
            GroupString: [this.editValue.GroupString,
                [
                    Validators.required
                ]
            ],
            ProjectMasterString: [this.editValue.ProjectMasterString,
                [
                    Validators.required
                ]
            ],
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // new Detail
    onSendOverTimeDetailToEdit(detail?: OverTimeDetail): void {

    }

    // edit Detail
    onReceiveOverTimeDetailFromEdit(detail?: OverTimeDetail): void {

    }

    // remove Detail
    onRemoveOverTimeDetailOrCancelOverTimeDetail(detail?: OverTimeDetail): void {
        if (detail && this.editValue.OverTimeDetails) {
            // find id
            let index: number = this.editValue.OverTimeDetails.indexOf(detail);

            if (index > -1) {
                if (detail.OverTimeDetailId < 1) {
                    if (index > -1) {
                        // remove item
                        this.editValue.OverTimeDetails.splice(index, 1);
                    }
                } else {
                    const editJobDetail: OverTimeDetail | undefined = this.editValue.OverTimeDetails
                        .find((value, index) => value.OverTimeDetailId === detail.OverTimeDetailId);

                    if (editJobDetail) {
                        editJobDetail.OverTimeDetailStatus = 2;
                    }
                }

                // update array
                this.editValue.OverTimeDetails = this.editValue.OverTimeDetails.slice();
                // cloning an object
                this.editValueForm.patchValue({
                    JobCardDetails: this.editValue.OverTimeDetails.slice(),
                });
            }
        }
    }

    // on ProjectDetail click
    onProjectMasterClick(): void {
        // need edit
        this.serviceDialogs.dialogSelectedDetail(this.viewContainerRef)
            .subscribe(resultDetail => {
                if (typeof resultDetail === "ProjectCodeMaster") {
                    this.editValueForm.patchValue({
                        ProjectDetailString: resultDetail.ProjectCodeMasterId,
                        ProjectCodeDetailId: resultDetail.ProjectCodeMasterId,
                    });
                }
            });
    }

    // on Employee Require click
    onEmployeeRequireClick(mode: string): void {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef, "singe")
            .subscribe(resultEmp => {
                if (resultEmp) {
                    let emp: Employee = Object.assign({}, resultEmp[0]);
                    this.editValueForm.patchValue({
                        EmpRequire: emp.EmpCode,
                        RequireString: emp.NameThai,
                    });
                }
            });
    }
    // cell change style
    getCellClass({ row, column, value }: any): any {
        // console.log("getCellClass", value);
        // return {
        //    "is-cancel": value === "Cancel"
        // };

        if (value === 1) {
            return { "is-wait": true };
        } else if (value === 2) {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }
}