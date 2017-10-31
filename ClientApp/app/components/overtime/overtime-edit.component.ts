﻿// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
// models
import { OverTimeMaster, OverTimeDetail, Employee, ProjectCodeMaster } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { OverTimeMasterService,OverTimeMasterServiceCommunicate } from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
import { AuthService } from "../../services/auth/auth.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "overtime-edit",
    templateUrl: "./overtime-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// overtime-edit component*/
export class OvertimeEditComponent
    extends BaseEditComponent<OverTimeMaster, OverTimeMasterService> {
    lastOverTimeMaster?: OverTimeMaster;
    overtimeDetail?: OverTimeDetail;
    indexOverTimeDetail: number;
    lockSave: boolean = false;
    defaultHour: number;
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
        this.defaultHour = 3;

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

                    if (this.editValue.LastOverTimeId) {
                        this.service.getOneKeyNumber(this.editValue.LastOverTimeId)
                            .subscribe(dbLastMaster => this.lastOverTimeMaster);
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

    // onValueChanged Override
    onValueChanged(data?: any): void {
        if (!this.editValueForm) {
            return;
        }

        const form: FormGroup = this.editValueForm;
        const controlMaster: AbstractControl | null = form.get("ProjectCodeMasterId");
        const controlGroup: AbstractControl | null = form.get("GroupCode");

        if (controlMaster && controlGroup) {
            if (controlMaster.value && controlGroup.value) {
                // check if alrady have last overtime master check if don't same get new last over time master
                let getData: boolean = false;
                if (this.lastOverTimeMaster) {
                    if (controlMaster.value !== this.lastOverTimeMaster.ProjectCodeMasterId ||
                        controlGroup.value !== this.lastOverTimeMaster.GroupCode) {
                        getData = true;
                    }
                } else {
                    getData = true;
                }

                if (getData) {
                    this.service.getLastOverTimeMaster(controlMaster.value, controlGroup.value)
                        .subscribe(lastMaster => this.lastOverTimeMaster = lastMaster);
                }
            }
        }

        super.onValueChanged();
    }

    // new Detail
    onChooseEmployeeToOverTime(): void {
        const form: FormGroup = this.editValueForm;
        const controlGroup: AbstractControl | null = form.get("GroupCode");

        let group: string = "";
        if (controlGroup) {
            if (controlGroup.value) {
                group = controlGroup.value;
            }
        }

        this.serviceDialogs.dialogSelectEmployeeWithGroup(this.viewContainerRef, group)
            .subscribe(selectEmpoyee => {
                if (selectEmpoyee) {
                    selectEmpoyee.forEach(item => {
                        let detail: OverTimeDetail = {
                            OverTimeDetailId: 0,
                            EmpCode: item.EmpCode,
                            EmployeeString: item.NameThai,
                            TotalHour: 3,
                            OverTimeDetailStatus: 1,
                            OverTimeMasterId : this.editValue.OverTimeMasterId
                        };
                        // if array is null
                        if (!this.editValue.OverTimeDetails) {
                            this.editValue.OverTimeDetails = new Array;
                        }

                        if (this.editValue.OverTimeDetails) {
                            if (!this.editValue.OverTimeDetails.find(item2 => item2.EmpCode === item.EmpCode)) {
                                // cloning an object
                                this.editValue.OverTimeDetails.push(Object.assign({}, detail));
                                this.editValueForm.patchValue({
                                    OverTimeDetails: this.editValue.OverTimeDetails.slice(),
                                });
                            }
                        }
                    });
                }
            });
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
        this.serviceDialogs.dialogSelectedMaster(this.viewContainerRef)
            .subscribe(resultMaster => {
                if (resultMaster) {
                    this.editValueForm.patchValue({
                        ProjectMasterString: `${resultMaster.ProjectCode}/${resultMaster.ProjectName}`,
                        ProjectCodeMasterId: resultMaster.ProjectCodeMasterId,
                    });
                }
            });
    }

    // on Employee Group Click
    onEmployeeGroupClick(): void {
        this.serviceDialogs.dialogSelectedEmployeeGroup(this.viewContainerRef)
            .subscribe(resultGroup => {
                if (resultGroup) {
                    this.editValueForm.patchValue({
                        GroupCode: resultGroup.GroupCode,
                        GroupString: resultGroup.Description,
                    });
                }
            });
    }

    // on Employee Require click
    onEmployeeRequireClick(mode: string): void {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef, "single")
            .subscribe(resultEmp => {
                if (resultEmp) {
                    let emp: Employee = Object.assign({}, resultEmp[0]);
                    this.editValueForm.patchValue({
                        EmpRequire: emp.EmpCode,
                        RequireString: `คุณ${emp.NameThai}`,
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

    // update value
    updateValue(event: any, cell: string, rowIndex: number): void {
        // console.log("inline editing rowIndex", rowIndex);
        // console.log(rowIndex + "-" + cell);
        // console.log("value:", event.target.value);

        if (this.editValue.OverTimeDetails) {
            // console.log("Get By index!", this.editValue.OverTimeDetails[rowIndex][cell]);
            // befor use index must add [key: string]: string | number | Date | undefined; in interface
            this.editValue.OverTimeDetails[rowIndex][cell] = event.target.value;
            this.editValue.OverTimeDetails = [...this.editValue.OverTimeDetails];
        }

        // console.log("UPDATED!", this.employees[rowIndex][cell]);
    }
}