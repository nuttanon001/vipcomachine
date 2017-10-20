import { Component, OnInit, Inject } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
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
    onCancel: boolean = false;
    showContextCancel: boolean;

    selected: JobCardMaster;
    columns: Array<TableColumn> = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1 },
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 2 },
    ];
    // jobCard-wating-dialog ctor */
    constructor(
        private service : JobCardMasterService,
        public dialogRef: MdDialogRef<JobCardWatingDialogComponent>,
        @Inject(MD_DIALOG_DATA) public jobCardMasters: Array<JobCardMaster>
    ) { }

    // called by Angular after jobCard-wating-dialog component initialized */
    ngOnInit(): void {
        if (this.jobCardMasters) {
            this.selected = this.jobCardMasters[0];
            this.onCheckCancel();
        }
    }

    // selected JobCardMaster
    onSelectedJobCardMaster(selected: any): void {
        if (selected) {
            this.selected = selected.selected[0];
            this.onCheckCancel();
        }
    }

    // selected JobCardDetail
    onSelectedJobCardDetail(jobCardDetail?: JobCardDetail): void {
        // debug here
        // console.log("JobCardDetail: ", jobCardDetail);
        this.dialogRef.close(jobCardDetail);
    }

    // check Can Cancel
    onCheckCancel(): void {
        if (this.selected) {
            this.service.getCheckJobCardCanCancel(this.selected.JobCardMasterId)
                .subscribe(result => {
                    // console.log(result);
                    this.onCancel = result.Result;
                }, Error => this.onCancel = false);
        } else {
            this.onCancel = false;
        }
    }

    // on Cancel JobCardDetail
    onCancelJobCard(): void {
        if (this.selected) {
            this.service.getCancelJobCardMaster(this.selected.JobCardMasterId)
                .subscribe(dbUpdate => {
                    // send -99 for reload data
                    let result1: JobCardDetail = {
                        JobCardDetailId : -99
                    }
                    this.dialogRef.close(result1);
                }, Error => console.error(Error));
        }
    }

    // on Add or Edit JobCard
    onAddOrEditJobCard(mode: number): void {
        if (this.selected) {
            let result1: JobCardDetail = {
                JobCardDetailId: mode,
                JobCardMasterId:this.selected.JobCardMasterId
            }
            this.dialogRef.close(result1);
        }
    }

    // no Click
    onCancelDialog(): void {
        this.dialogRef.close();
    }
}