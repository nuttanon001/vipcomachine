// angular
import { Component,Input,Output } from "@angular/core";
import { OnInit, ViewContainerRef, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// model
import { JobCardDetail } from "../../models/model.index";
// service
import { DialogsService } from "../../services/dialog/dialogs.service";
// rxjs
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "jobcard-detail-edit",
    templateUrl: "./jobcard-detail-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** jobcard-detail-edit component*/
export class JobcardDetailEditComponent implements OnInit
{
    editValueForm: FormGroup;
    @Output("ComplateOrCancel") ComplateOrCancel = new EventEmitter<any>();
    @Input("EditValueDetail") EditValueDetail: JobCardDetail;
    /** jobcard-detail-edit ctor */
    constructor(
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) { }

    /** Called by Angular after jobcard-detail-edit component initialized */
    ngOnInit(): void {
        this.buildForm();
    }

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
            //FK
            JobCardMasterId: [this.EditValueDetail.JobCardMasterId],
            UnitMeasureId: [this.EditValueDetail.UnitMeasureId],
            StandardTimeId: [this.EditValueDetail.StandardTimeId],
            CuttingPlanId: [this.EditValueDetail.CuttingPlanId],
            UnitsMeasure: [this.EditValueDetail.UnitsMeasure],
            CuttingPlan: [this.EditValueDetail.CuttingPlan],
            //ViewModel
            UnitsMeasureString: [this.EditValueDetail.UnitsMeasureString],
            CuttingPlanString: [this.EditValueDetail.CuttingPlanString],
            StandardTimeString: [this.EditValueDetail.StandardTimeString],
            StatusString: [this.EditValueDetail.StatusString],
        });
    }

    // on New/Update
    onNewOrUpdateClick() {
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
    onCancelClick() {
        this.ComplateOrCancel.emit(undefined);
    }

    // on CuttingPlan click
    onCuttingPlanClick() {
        this.serviceDialogs.dialogSelectCuttingPlan(this.viewContainerRef)
            .subscribe(resultCutting => {
                if (resultCutting) {
                    this.editValueForm.patchValue({
                        CuttingPlanId: resultCutting.CuttingPlanId,
                        CuttingPlanString: resultCutting.CuttingPlanNo,
                        CuttingPlan: Object.assign({}, resultCutting),
                    });
                }
            });
    }

    // on StandardTime click
    onStandardTimeClick() {
        this.serviceDialogs.dialogSelectStandardTime(this.viewContainerRef)
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
    onUnitsMeasureClick() {
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
}