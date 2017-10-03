import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
// models
import { CuttingPlan, Scroll } from "../../models/model.index";
// service
import { CuttingPlanService, CuttingPlanServiceCommunicate } from "../../services/cutting-plan/cutting-plan.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "cutting-plan-dialog",
    templateUrl: "./cutting-plan-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        CuttingPlanService,
        CuttingPlanServiceCommunicate,
        ProjectCodeDetailEditService,
        DataTableServiceCommunicate
    ]
})
/** cutting-plan-dialog component*/
export class CuttingPlanDialogComponent
    implements OnInit, OnDestroy {
    selected: CuttingPlan | undefined;
    //Subscription
    subscription: Subscription;
    //Column
    columns: Array<TableColumn> = [
        { prop: "CuttingPlanNo", name: "No.", flexGrow: 2 },
        { prop: "ProjectCodeString", name: "JobLevel2/3", flexGrow: 1 },
    ];
    get CanSelected(): boolean {
        return this.selected !== undefined;
    }
    /** cutting-plan-dialog ctor */
    constructor(
        private service: CuttingPlanService,
        private serviceCom: CuttingPlanServiceCommunicate,
        private serviceDetail: ProjectCodeDetailEditService,
        private serviceDataTable: DataTableServiceCommunicate<CuttingPlan>,
        public dialogRef: MdDialogRef<CuttingPlanDialogComponent>
    ) { }

    /** Called by Angular after cutting-plan-dialog component initialized */
    ngOnInit(): void {
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
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // Selected Value
    onSelectedValue(value?: CuttingPlan): void {
        if (value) {
            this.selected = value;
        }
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selected);
    }
}