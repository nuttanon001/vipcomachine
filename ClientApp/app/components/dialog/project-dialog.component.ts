import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import {
    ProjectCodeMaster, ProjectCodeDetail,
    Scroll
} from "../../models/model.index";
// service
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";


@Component({
    selector: "project-dialog",
    templateUrl: "./project-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        ProjectCodeMasterService,
        ProjectCodeDetailEditService,
        DataTableServiceCommunicate
    ]
})
/** project-dialog component*/
export class ProjectDialogComponent
    implements OnInit, OnDestroy
{
    details: Array<ProjectCodeDetail>;
    templates: Array<ProjectCodeDetail>;
    //Detail
    selectedDetails: ProjectCodeDetail | undefined;
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    //Subscription
    subscription: Subscription;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    //Column
    columns:Array<TableColumn> = [
        { prop: "ProjectCode", name: "Code", flexGrow: 1 },
        { prop: "ProjectName", name: "Name", flexGrow: 1 },
        { prop: "StartDate", name: "Date", pipe: this.datePipe, flexGrow: 1 },
    ];
    columnsDetail: Array<TableColumn> = [
        { prop: "ProjectCodeDetailCode", name: "Code", flexGrow: 1 },
        { prop: "Description", name: "Description", flexGrow: 3 },
    ];

    get CanSelected(): boolean {
        return this.selectedDetails !== undefined;
    }

    /** project-dialog ctor */
    constructor(
        private serviceMaster: ProjectCodeMasterService,
        private serviceDetail: ProjectCodeDetailEditService,
        private serviceDataTable: DataTableServiceCommunicate<ProjectCodeMaster>,
        public dialogRef: MatDialogRef<ProjectDialogComponent>
    ) { }

    /** Called by Angular after project-dialog component initialized */
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
    onSelectedMaster(master?: ProjectCodeMaster): void {
        if (master) {
            this.serviceDetail.getByMasterId(master.ProjectCodeMasterId)
                .subscribe(dbDetail => {
                    this.details = dbDetail.slice();
                    this.templates = [...dbDetail];
                    this.selectedDetails = undefined;
                });

        }
    }

    // Selected Project Detail
    onSelectedDetail(selected?: any): void {
        if (selected) {
            this.selectedDetails = selected.selected[0];
            this.onSelectedClick();
        }
    }

    // on Filter
    onFilter(search: string) {
        // filter our data
        const temp = this.templates.slice().filter((item, index) => {
            let searchStr = ((item.Description || "") + (item.ProjectCodeDetailCode || "")).toLowerCase();
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
        this.dialogRef.close(this.selectedDetails);
    }
}