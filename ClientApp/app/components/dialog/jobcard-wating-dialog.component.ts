import { Component, OnInit, Inject } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";;
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";
// models
import { JobCardMaster,JobCardDetail } from "../../models/model.index";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// service
import { JobCardMasterService } from "../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";

@Component({
    selector: "job-card-wating-dialog",
    templateUrl: "./jobcard-wating-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        JobCardMasterService,
        JobCardDetailService
    ]
})
// jobCard-wating-dialog component*/
export class JobCardWatingDialogComponent implements OnInit {
    selected: JobCardMaster;
    columns: Array<TableColumn> = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1 },
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 2 },
    ];
    // jobCard-wating-dialog ctor */
    constructor(
        public dialogRef: MdDialogRef<JobCardWatingDialogComponent>,
        @Inject(MD_DIALOG_DATA) public jobCardMasters: Array<JobCardMaster>
    ) { }

    // Called by Angular after jobCard-wating-dialog component initialized */
    ngOnInit(): void {
        if (this.jobCardMasters) {
            this.selected = this.jobCardMasters[0];
        }
    }

    // selected JobCardMaster
    onSelectedJobCardMaster(selected: any) {
        if (selected) {
            this.selected = selected.selected[0];
        }
    }

    // selected JobCardDetail
    onSelectedJobCardDetail(jobCardDetail?: JobCardDetail): void {
        this.dialogRef.close(jobCardDetail);
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }
}