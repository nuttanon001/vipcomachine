// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import {
    trigger,state,style,
    animate,transition
} from "@angular/animations";
// models
import { JobCardMaster, JobCardDetail, Employee, AttachFile } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
import {
    JobCardMasterService, JobCardDetailService,
    JobCardMasterServiceCommunicate, DialogsService
} from "../../services/service.index";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// primeng
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "jobcard-edit",
    templateUrl: "./jobcard-edit.component.html",
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
// jobcard-edit component
export class JobCardEditComponent
    extends BaseEditComponent<JobCardMaster, JobCardMasterService> {
    // paramater
    // columns: Array<TableColumn> = [
    //    { prop: "CuttingPlanString", name: "CuttingPlan", flexGrow: 1 },
    //    { prop: "Material", name: "Material", flexGrow: 1 },
    //    { prop: "StandardTimeString", name: "StandardTime", flexGrow: 1 },
    //    { prop: "Quality", name: "Quality", flexGrow: 1 },
    //    { prop: "UnitsMeasureString", name: "Uom", flexGrow: 1 },
    // ];
    jobDetail?: JobCardDetail;
    indexJobDetail: number;
    machineTypes: Array<SelectItem>;
    attachFiles: Array<AttachFile> = new Array;
    // jobcard-edit ctor
    constructor(
        service: JobCardMasterService,
        serviceCom: JobCardMasterServiceCommunicate,
        private serviceDialogs: DialogsService,
        private serviceDetail: JobCardDetailService,
        private serviceMachineType: TypeMachineService,
        private viewContainerRef : ViewContainerRef,
        private fb: FormBuilder,
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: JobCardMaster): void {
        if (value) {
            this.service.getOneKeyNumber(value.JobCardMasterId)
                .subscribe(dbJobCardMaster => {
                    this.editValue = dbJobCardMaster;
                    // set Date
                    if (this.editValue.JobCardDate) {
                        this.editValue.JobCardDate = this.editValue.JobCardDate != null ?
                            new Date(this.editValue.JobCardDate) : new Date();
                    }

                    if (this.editValue.DueDate) {
                        this.editValue.DueDate = this.editValue.DueDate != null ?
                            new Date(this.editValue.DueDate) : new Date();
                    }

                    if (this.editValue.JobCardMasterId) {
                        this.serviceDetail.getByMasterId(this.editValue.JobCardMasterId)
                            .subscribe(dbDetail => {
                                this.editValue.JobCardDetails = dbDetail.slice();
                                this.editValueForm.patchValue({
                                    JobCardDetails: this.editValue.JobCardDetails.slice(),
                                });
                            });
                    }
                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                JobCardMasterId: 0,
                JobCardMasterStatus: 1,
                JobCardDate: new Date(),
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();
        this.jobDetail = undefined;

        // machineType ComboBox
        this.serviceMachineType.getAll()
            .subscribe(dbTypeMachines => {
                this.machineTypes = new Array;
                this.machineTypes.push({ label: "-", value: undefined });
                for (let item of dbTypeMachines) {
                    this.machineTypes.push({ label: `${(item.TypeMachineCode || "")} ${(item.Name || "")}`, value: item.TypeMachineId });
                }
            }, error => console.error(error));

        this.getAttach();
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            JobCardMasterId: [this.editValue.JobCardMasterId],
            JobCardMasterNo: [this.editValue.JobCardMasterNo,
                [
                    Validators.maxLength(50),
                ]
            ],
            JobCardMasterStatus: [this.editValue.JobCardMasterStatus],
            Description: [this.editValue.Description,
                [
                    Validators.maxLength(200),
                ]
            ],
            Remark: [this.editValue.Remark,
                [
                    Validators.maxLength(200)
                ]
            ],
            JobCardDate: [this.editValue.JobCardDate,
                [
                    Validators.required,
                ]
            ],
            DueDate: [this.editValue.DueDate,
                [
                    Validators.required,
                ]
            ],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            // fK
            EmpWrite: [this.editValue.EmpWrite],
            EmpRequire: [this.editValue.EmpRequire],
            ProjectCodeDetailId: [this.editValue.ProjectCodeDetailId,
                [
                    Validators.required
                ]
            ],
            TypeMachineId: [this.editValue.TypeMachineId,
                [
                    Validators.required
                ]
            ],
            JobCardDetails: [this.editValue.JobCardDetails],
            // viewModel
            ProjectDetailString: [this.editValue.ProjectDetailString,
                [
                    Validators.required
                ]
            ],
            TypeMachineString: [this.editValue.TypeMachineString],
            StatusString: [this.editValue.StatusString],
            EmployeeRequireString: [this.editValue.EmployeeRequireString],
            EmployeeWriteString: [this.editValue.EmployeeWriteString],
            // attach
            AttachFile: [this.editValue.AttachFile],
            RemoveAttach: [this.editValue.RemoveAttach],
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // new Detail
    onNewOrEditDetail(detail?: JobCardDetail):void {
        if (detail) {
            if (detail.JobCardDetailStatus === 2) {
                this.serviceDialogs.context("Warning Message","คุณไม่สามารถแก้ไขข้อมูล ที่ดำเนินการแล้วได้ !!!",this.viewContainerRef);
                return;
            }

            if (this.editValue.JobCardDetails) {
                this.indexJobDetail = this.editValue.JobCardDetails.indexOf(detail);
            } else {
                this.indexJobDetail = -1;
            }
            this.jobDetail = Object.assign({}, detail);
        } else {
            this.jobDetail = {
                JobCardDetailId: 0,
                JobCardDetailStatus: 1,
                StatusString: "Wait"
            };
            this.indexJobDetail = -1;
        }
    }

    // edit Detail
    onComplateOrCancel(detail?: JobCardDetail):void {
        if (!this.editValue.JobCardDetails) {
            this.editValue.JobCardDetails = new Array;
        }

        if (detail && this.editValue.JobCardDetails) {
            if (this.indexJobDetail > -1) {
                // remove item
                this.editValue.JobCardDetails.splice(this.indexJobDetail, 1);
            }
            // cloning an object
            this.editValue.JobCardDetails.push(Object.assign({}, detail));
            this.editValueForm.patchValue({
                JobCardDetails: this.editValue.JobCardDetails.slice(),
            });
        }
        this.jobDetail = undefined;
    }

    // remove Detail
    onRemoveDetail(detail: JobCardDetail):void {
        if (detail && this.editValue.JobCardDetails) {
            if (detail.JobCardDetailStatus === 3) {
                return;
            }

            if (detail.JobCardDetailId > 0 && detail.JobCardDetailStatus !== 1) {
                this.serviceDialogs.error("Deny Action", "ข้อมูลมีการอ้างอิงถึงระบบไม่สามารถให้การกระทำนี้มีผลต่อระบบได้.",
                    this.viewContainerRef);
                return;
            }
            // find id
            let index: number = this.editValue.JobCardDetails.indexOf(detail);

            if (index > -1) {
                if (detail.JobCardDetailId < 1) {
                    if (index > -1) {
                        // remove item
                        this.editValue.JobCardDetails.splice(index, 1);
                    }
                } else {
                    const editJobDetail:JobCardDetail|undefined = this.editValue.JobCardDetails
                        .find((value, index) => value.JobCardDetailId === detail.JobCardDetailId);

                    if (editJobDetail) {
                        editJobDetail.JobCardDetailStatus = 3;
                        editJobDetail.StatusString = "Cancel";
                    }
                }

                // update array
                this.editValue.JobCardDetails = [...this.editValue.JobCardDetails];
                // cloning an object
                this.editValueForm.patchValue({
                    JobCardDetails: this.editValue.JobCardDetails.slice(),
                });
            }
        }
    }

    // on ProjectDetail click
    onProjectDetailClick():void {
        this.serviceDialogs.dialogSelectedDetail(this.viewContainerRef)
            .subscribe(resultDetail => {
                if (resultDetail) {
                    this.editValueForm.patchValue({
                        ProjectDetailString: resultDetail.FullProjectLevelString,
                        ProjectCodeDetailId: resultDetail.ProjectCodeDetailId,
                    });
                }
            });
    }

    // on Employee Write click
    onEmployeeWriteClick(mode:string):void {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef,"singe")
            .subscribe(resultEmp => {
                if (resultEmp) {
                    let emp: Employee = Object.assign({}, resultEmp[0]);
                    if (mode === "W") {
                        this.editValueForm.patchValue({
                            EmpWrite: emp.EmpCode,
                            EmployeeWriteString: emp.NameThai,
                        });
                    } else {
                        this.editValueForm.patchValue({
                            EmpRequire: emp.EmpCode,
                            EmployeeRequireString: emp.NameThai,
                        });
                    }
                }
            });
    }

    // get attact file
    getAttach(): void {
        if (this.editValue && this.editValue.JobCardMasterId > 0) {
            this.service.getAttachFile(this.editValue.JobCardMasterId)
                .subscribe(dbAttach => {
                    this.attachFiles = dbAttach.slice();
                }, error => console.error(error));
        }
    }

    // on Attach Update List
    onUpdateAttachResults(results: FileList): void {
        // debug here
        // console.log("File: ", results);
        this.editValue.AttachFile = results;
        // debug here
        // console.log("Att File: ", this.editValue.AttachFile);
        this.editValueForm.patchValue({
            AttachFile: this.editValue.AttachFile
        });
        this.onValueChanged(undefined);
    }

    // on Attach delete file
    onDeleteAttachFile(attach: AttachFile):void {
        if (attach) {
            if (!this.editValue.RemoveAttach) {
                this.editValue.RemoveAttach = new Array;
            }

            // remove
            this.editValue.RemoveAttach.push(attach.AttachFileId);
            // debug here
            // console.log("Remove :",this.editValue.RemoveAttach);


            this.editValueForm.patchValue({
                RemoveAttach: this.editValue.RemoveAttach
            });
            let template: Array<AttachFile> =
                this.attachFiles.filter((e: AttachFile) => e.AttachFileId !== attach.AttachFileId);

            this.attachFiles = new Array();
            setTimeout(() => this.attachFiles = template.slice(), 50);

            this.onValueChanged(undefined);
        }
    }

    // open file attach
    onOpenNewLink(link: string): void {
        if (link) {
            window.open(link, "_blank");
        }
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        // console.log("getCellClass", value);
        // return {
        //    "is-cancel": value === "Cancel"
        // };

        if (value === "Task") {
            return { "is-complate": true };
        } else if (value === "Cancel") {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }
}