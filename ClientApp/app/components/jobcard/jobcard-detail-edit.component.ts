// angular
import { Component, Input, Output } from "@angular/core";
import { OnInit, ViewContainerRef, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// model
import { JobCardDetail } from "../../models/model.index";
// service
import { DialogsService } from "../../services/dialog/dialogs.service";
import { MaterialService } from "../../services/material/material.service";
// rxjs
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "jobcard-detail-edit",
    templateUrl: "./jobcard-detail-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
    providers: [MaterialService,]
})
// jobcard-detail-edit component
export class JobcardDetailEditComponent implements OnInit {
    editValueForm: FormGroup;
    @Output("ComplateOrCancel") ComplateOrCancel = new EventEmitter<any>();
    @Input("EditValueDetail") EditValueDetail: JobCardDetail;
    @Input("MachineTypeId") MachineTypeId: number | undefined;
    @Input("ProjectDetailId") ProjectDetailId: number | undefined;

    tempMaterials: Array<string>;
    materials: Array<string>;
    /** jobcard-detail-edit ctor */
    constructor(
        private serviceMaterial: MaterialService,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) { }

    /** Called by Angular after jobcard-detail-edit component initialized */
    ngOnInit(): void {
        this.buildForm();

        if (!this.tempMaterials) {
            this.tempMaterials = new Array;
            this.serviceMaterial.getAutoComplate()
                .subscribe(dbMaterials => {
                    this.tempMaterials = dbMaterials;
                });
        }
        if (!this.materials) {
            this.materials = new Array;
        }
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            JobCardDetailId: [this.EditValueDetail.JobCardDetailId],
            Material: [this.EditValueDetail.Material,
            [
                Validators.maxLength(200),
            ]
            ],
            Quality: [this.EditValueDetail.Quality],
            JobCardDetailStatus: [this.EditValueDetail.JobCardDetailStatus],
            Remark: [this.EditValueDetail.Remark,
            [
                Validators.maxLength(200)
            ]
            ],
            Creator: [this.EditValueDetail.Creator],
            CreateDate: [this.EditValueDetail.CreateDate],
            Modifyer: [this.EditValueDetail.Modifyer],
            ModifyDate: [this.EditValueDetail.ModifyDate],
            // fK
            JobCardMasterId: [this.EditValueDetail.JobCardMasterId],
            UnitMeasureId: [this.EditValueDetail.UnitMeasureId],
            StandardTimeId: [this.EditValueDetail.StandardTimeId],
            CuttingPlanId: [this.EditValueDetail.CuttingPlanId],
            UnitsMeasure: [this.EditValueDetail.UnitsMeasure],
            CuttingPlan: [this.EditValueDetail.CuttingPlan],
            // viewModel
            UnitsMeasureString: [this.EditValueDetail.UnitsMeasureString],
            CuttingPlanString: [this.EditValueDetail.CuttingPlanString],
            StandardTimeString: [this.EditValueDetail.StandardTimeString],
            StatusString: [this.EditValueDetail.StatusString],
        });
    }

    // on New/Update
    onNewOrUpdateClick(): void {
        if (this.editValueForm) {
            let newOrUpdate: JobCardDetail = this.editValueForm.value;

            if (newOrUpdate.JobCardDetailStatus === 3) {
                newOrUpdate.JobCardDetailStatus = 1;
                newOrUpdate.StatusString = "Wait";
            }

            if (newOrUpdate.UnitsMeasureString || newOrUpdate.CuttingPlanString ||
                newOrUpdate.Material || newOrUpdate.Quality || newOrUpdate.StandardTimeString) {
                this.ComplateOrCancel.emit(this.editValueForm.value);
            } else {
                this.serviceDialogs.error("Error Message", "ไม่พบข้อมูลโปรดตรวจสอบ", this.viewContainerRef);
            }
        }
    }

    // on Cancel
    onCancelClick(): void {
        this.ComplateOrCancel.emit(undefined);
    }

    // on CuttingPlan click
    onCuttingPlanClick(): void {
        this.serviceDialogs.dialogSelectCuttingPlan(this.viewContainerRef, this.ProjectDetailId)
            .subscribe(resultCutting => {
                if (resultCutting) {
                    this.editValueForm.patchValue({
                        CuttingPlanId: resultCutting.CuttingPlanId,
                        CuttingPlanString: resultCutting.CuttingPlanNo,
                        CuttingPlan: Object.assign({}, resultCutting),
                        Material: (resultCutting.MaterialSize || "") + (resultCutting.MaterialGrade || ""),
                        Quality: resultCutting.Quantity || 0
                    });
                }
            });
    }

    // on StandardTime click
    onStandardTimeClick(): void {
        // console.log(this.MachineTypeId);
        this.serviceDialogs.dialogSelectStandardTime(this.viewContainerRef, this.MachineTypeId)
            .subscribe(resultStdTime => {
                if (resultStdTime) {
                    this.editValueForm.patchValue({
                        StandardTimeId: resultStdTime.StandardTimeId,
                        StandardTimeString: `${resultStdTime.GradeMaterialString} - ${resultStdTime.StandardTimeCode}`,
                    });
                }
            });
    }

    // on UnitsMeasure click
    onUnitsMeasureClick(): void {
        this.serviceDialogs.dialogSelectUom(this.viewContainerRef)
            .subscribe(resultUom => {
                if (resultUom) {
                    this.editValueForm.patchValue({
                        UnitMeasureId: resultUom.UnitMeasureId,
                        UnitsMeasureString: resultUom.UnitMeasureName,
                        UnitsMeasure: Object.assign({}, resultUom),
                    });
                }
            });
    }

    // on search autocomplate
    onSearchAutoComplate(event:any):void {
        this.materials = new Array;

        for (let i:number = 0; i < this.tempMaterials.length; i++) {
            let material:string = this.tempMaterials[i];
            if (material.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.materials.push(material);
            }
        }
    }
}