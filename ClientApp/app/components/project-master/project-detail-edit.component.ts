import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { ProjectCodeDetail } from "../../models/model.index";
// services
import { TemplateProjectDetailService } from "../../services/service.index";
// primeng
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "project-detail-edit",
    templateUrl: "./project-detail-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** project-detail-edit component*/
export class ProjectDetailEditComponent implements OnInit {
    templateCode: Array<SelectItem>;
    detailForm: FormGroup;
    /** project-detail-edit ctor */
    constructor(
        private service: TemplateProjectDetailService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProjectDetailEditComponent>,
        @Inject(MAT_DIALOG_DATA) public detail: ProjectCodeDetail
    ) { }

    /** Called by Angular after project-detail-edit component initialized */
    ngOnInit(): void {
        this.detailForm = this.fb.group({
            ProjectCodeDetailId: [this.detail.ProjectCodeDetailId],
            ProjectCodeDetailCode: [this.detail.ProjectCodeDetailCode,
                [
                    Validators.required,
                ]
            ],
            Description: [this.detail.Description,
                [
                    Validators.maxLength(200)
                ]
            ],
            ProjectCodeMasterId: [this.detail.ProjectCodeMasterId],
            Creator: [this.detail.Creator],
            CreateDate: [this.detail.CreateDate],
            Modifyer: [this.detail.Modifyer],
            ModifyDate: [this.detail.ModifyDate],
        });

        this.service.getAll()
            .subscribe(dbData => {
                this.templateCode = new Array;
                this.templateCode.push({ label: "-", value: undefined });
                for (let item of dbData) {
                    this.templateCode.push({ label: item.TemplateName || "", value: item.TemplateName || "" });
                }
            }, error => console.error(error));
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onUpdateClick(): void {
        this.dialogRef.close(this.detailForm.value);
    }
}