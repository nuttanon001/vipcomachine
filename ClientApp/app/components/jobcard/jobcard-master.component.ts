import { Component, ViewContainerRef,PipeTransform } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { JobCardMaster, Page, PageData, Scroll, ScrollData } from "../../models/model.index";
// services
import {
    DialogsService, JobCardMasterService, JobCardDetailService,
    DataTableServiceCommunicate , JobCardMasterServiceCommunicate
} from "../../services/service.index";
// timezone
import * as moment from "moment-timezone";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "jobcard-master",
    templateUrl: "./jobcard-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})

export class JobCardMasterComponent
    extends BaseMasterComponent<JobCardMaster, JobCardMasterService> {
    datePipe: DateOnlyPipe  = new DateOnlyPipe("it");
    // parameter
    columns = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1},
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 1},
        { prop: "EmployeeRequireString", name: "Require", flexGrow: 1},
        { prop: "JobCardDate", name: "Date", pipe: this.datePipe, flexGrow: 1}
    ];

    // holla! {{"column.name" | translate }}

    constructor(
        service: JobCardMasterService,
        serviceCom: JobCardMasterServiceCommunicate,
        dataTableServiceCom: DataTableServiceCommunicate<JobCardMaster>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
    ) {
        super(
            service,
            serviceCom,
            dataTableServiceCom,
            dialogsService,
            viewContainerRef
        );
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        this.service.getAllWithScroll(scroll)
            .subscribe((scrollData: ScrollData<JobCardMaster>) => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: JobCardMaster): JobCardMaster {
        let zone:string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.DueDate !== null) {
                value.DueDate = moment.tz(value.DueDate, zone).toDate();
            }
            if (value.JobCardDate !== null) {
                value.JobCardDate = moment.tz(value.JobCardDate, zone).toDate();
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: JobCardMaster): void {
        let attachs: FileList | undefined = value.AttachFile;
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                if (complete && attachs) {
                    this.onAttactFileToDataBase(complete.JobCardMasterId, attachs);
                }
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.editValue.Creator = undefined;
                this.canSave = true;
                this.dialogsService.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!",
                    this.viewContainerRef);
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: JobCardMaster): void {
        let attachs: FileList | undefined = value.AttachFile;

        // console.log("ATT: ", attachs);
        // console.log("JobCardMaster: ", value);

        // remove attach
        if (value.RemoveAttach) {
            // debug here
            // console.log("Remove: ",value.RemoveAttach);

            this.onRemoveFileFromDataBase(value.RemoveAttach);
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.JobCardMasterId).subscribe(
            (complete: any) => {
                if (complete && attachs) {
                    this.onAttactFileToDataBase(complete.JobCardMasterId, attachs);
                }
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!",
                    this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value:JobCardMaster): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.JobCardMasterId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                },error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }

    // on attact file
    onAttactFileToDataBase(JobCardMasterId: number, Attacts: FileList): void {
        this.service.postAttactFile(JobCardMasterId, Attacts)
            .subscribe(complate => console.log("Upload Complate"), error => console.error(error));
    }

    // on remove file
    onRemoveFileFromDataBase(Attachs: Array<number>): void {
        Attachs.forEach((value: number) => {
            this.service.deleteAttactFile(value)
                .subscribe(complate => console.log("Delete Complate"), error => console.error(error));
        });
    }
}
