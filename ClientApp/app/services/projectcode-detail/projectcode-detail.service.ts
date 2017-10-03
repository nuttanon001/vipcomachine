import { Injectable, ViewContainerRef } from "@angular/core";
import { Http } from "@angular/http";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
// rxjs
import { Observable } from "rxjs/Rx";
// component
import { ProjectDetailEditComponent } from "../../components/project-master/project.index";
// model
import { ProjectCodeDetail } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class ProjectCodeDetailService extends BaseRestService<ProjectCodeDetail> {
    constructor(
        http: Http,
        private dialog: MdDialog
    ) {
        super(http, "api/ProjectCodeDetail/");
    }

    public dialogProjectDetail(detail: ProjectCodeDetail, viewContainerRef: ViewContainerRef): Observable<ProjectCodeDetail> {
        let dialogRef: MdDialogRef<ProjectDetailEditComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = detail;
        config.height = "450px";
        config.width = "700px";

        // open dialog
        dialogRef = this.dialog.open(ProjectDetailEditComponent,config);
        return dialogRef.afterClosed();
    }
}