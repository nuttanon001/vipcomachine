import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { CuttingPlan, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { CuttingPlanService, CuttingPlanServiceCommunicate } from "../../services/cutting-plan/cutting-plan.service";
// timezone
import * as moment from "moment-timezone";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "cutting-master",
    templateUrl: "./cutting-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
/** cutting-master component*/
export class CuttingMasterComponent
    extends BaseMasterComponent<CuttingPlan, CuttingPlanService>
{
    columns: Array<TableColumn> = [
        { prop: "CuttingPlanNo", name: "No.", flexGrow: 2 },
        { prop: "ProjectCodeString", name: "JobLevel2/3", flexGrow: 1 },
        //{ prop: "Description", name: "Description", flexGrow: 1 },
    ];

    /** cutting-master ctor */
    constructor(
        service: CuttingPlanService,
        serviceCom: CuttingPlanServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<CuttingPlan>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
    ) {
        super(
            service,
            serviceCom,
            serviceComDataTable,
            dialogsService,
            viewContainerRef
        );
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: CuttingPlan): CuttingPlan {
        var zone = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: CuttingPlan): void {
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.editValue.Creator = undefined;
                this.canSave = true;
                this.dialogsService.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef)
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: CuttingPlan): void {
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.CuttingPlanId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef)
            }
        );
    }

    // on detail view
    onDetailView(value: CuttingPlan): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.CuttingPlanId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}