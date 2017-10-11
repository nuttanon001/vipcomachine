import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
// models
import {
    JobCardMaster, JobCardDetail,
    Scroll
} from "../../models/model.index";
// service
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { JobCardMasterService } from "../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "jobcard-dialog",
    templateUrl: "./jobcard-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        JobCardMasterService,
        JobCardDetailService,
        DataTableServiceCommunicate,
    ]
})
/** jobcard-dialog component*/
export class JobcardDialogComponent
    implements OnInit, OnDestroy
{
    details: Array<JobCardDetail>;
    templates: Array<JobCardDetail>;
    //Detail
    selectedDetail: JobCardDetail | undefined;
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    //Subscription
    subscription: Subscription;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    //Column
    columns: Array<TableColumn> = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1 },
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 1 },
        { prop: "EmployeeRequireString", name: "Require", flexGrow: 1 },
        { prop: "JobCardDate", name: "Date", pipe: this.datePipe, flexGrow: 1 }
    ];
    columnsDetail: Array<TableColumn> = [
        { prop: "CuttingPlanString", name: "CuttingPlan", flexGrow: 1 },
        { prop: "StandardTimeString", name: "StandardTime", flexGrow: 1 },
        { prop: "Material", name: "Material", flexGrow: 1 },
        //{ prop: "Quality", name: "Quality", flexGrow: 1 },
        //{ prop: "UnitsMeasureString", name: "Uom", flexGrow: 1 },
    ];
    // Property
    get CanSelected(): boolean {
        return this.selectedDetail !== undefined;
    }
    /** jobcard-dialog ctor */
    constructor(
        private serviceMaster: JobCardMasterService,
        private serviceDetail: JobCardDetailService,
        private serviceDataTable: DataTableServiceCommunicate<JobCardMaster>,
        public dialogRef: MdDialogRef<JobcardDialogComponent>,
        @Inject(MD_DIALOG_DATA) public mode: number
    ) { }

    /** Called by Angular after jobcard-dialog component initialized */
    ngOnInit(): void {
        if (!this.details) {
            this.details = new Array;
        }

        this.subscription = this.serviceDataTable.ToParent$
            .subscribe((scroll: Scroll) => this.loadData(scroll));
    }

    // angular hook
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // on get data with lazy load
    loadData(scroll: Scroll): void {
        this.serviceMaster.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // Selected Project Master
    onSelectedMaster(master?: JobCardMaster): void {
        if (master) {
            this.serviceDetail.getByMasterId(master.JobCardMasterId)
                .subscribe(dbDetail => {
                    if (this.mode) {
                        this.details = dbDetail.filter(item => item.JobCardDetailStatus === 1).slice();
                    } else {
                        this.details = dbDetail.slice();
                    }
                    this.templates = [...this.details];
                    this.selectedDetail = undefined;
                });

        }
    }

    // Selected Project Detail
    onSelectedDetail(selected?: any): void {
        if (selected) {
            this.selectedDetail = selected.selected[0];
        }
    }

    // on Filter
    onFilter(search: string) {
        // filter our data
        const temp = this.templates.slice().filter((item, index) => {
            let searchStr = ((item.CuttingPlanString || "") + (item.Material || "")).toLowerCase();
            return searchStr.indexOf(search.toLowerCase()) != -1;
        });

        // update the rows
        this.details = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selectedDetail);
    }
}