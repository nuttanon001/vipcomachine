// angular
import { Component } from "@angular/core";
// models
import { JobCardMaster,JobCardDetail,AttachFile } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { JobCardDetailService,JobCardMasterService } from "../../services/service.index";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "jobcard-view",
    templateUrl: "./jobcard-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})

/** jobcard-view component*/
export class JobCardViewComponent extends BaseViewComponent<JobCardMaster>
{
    details: Array<JobCardDetail>;
    attachFiles: Array<AttachFile> = new Array;
    columns: Array<TableColumn> = [
        { prop: "CuttingPlanString", name: "CuttingPlan", flexGrow: 1 },
        { prop: "StandardTimeString", name: "StandardTime", flexGrow: 1 },
        { prop: "Material", name: "Material", flexGrow: 1 },
        { prop: "Quality", name: "Quality", flexGrow: 1 },
        { prop: "UnitsMeasureString", name: "Uom", flexGrow: 1 },
    ];
    /** jobcard-view ctor */
    constructor(
        private serviceMaster: JobCardMasterService,
        private service : JobCardDetailService
    ) {
        super();
    }
    // load more data
    onLoadMoreData(value: JobCardMaster) {
        this.service.getByMasterId(value.JobCardMasterId)
            .subscribe(dbDetail => {
                this.details = dbDetail.slice();
            });

        this.serviceMaster.getAttachFile(value.JobCardMasterId)
            .subscribe(dbAttach => this.attachFiles = dbAttach.slice());
    }

    // open attact file
    onOpenNewLink(link: string): void {
        if (link) {
            window.open(link, "_blank");
        }
    }
}