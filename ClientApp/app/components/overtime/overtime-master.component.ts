﻿import { Component, ViewContainerRef, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { OverTimeMaster, Scroll, ScrollData } from "../../models/model.index";
// services
import {
    DialogsService, OverTimeMasterService, OverTimeDetailService,
    DataTableServiceCommunicate, OverTimeMasterServiceCommunicate,
    AuthService
} from "../../services/service.index";
// rxjs
import "rxjs/add/operator/switchMap";
// timezone
import * as moment from "moment-timezone";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "overtime-master",
    templateUrl: "./overtime-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
// overtime-master component*/
export class OvertimeMasterComponent
    extends BaseMasterComponent<OverTimeMaster, OverTimeMasterService> {
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    useTemplate: boolean = false;
    templateScroll: Scroll;

    columns = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1 },
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 1 },
        { prop: "EmployeeRequireString", name: "Require", flexGrow: 1 },
        { prop: "JobCardDate", name: "Date", pipe: this.datePipe, flexGrow: 1 }
    ];

    // overtime-master ctor */
    constructor(
        service: OverTimeMasterService,
        serviceCom: OverTimeMasterServiceCommunicate,
        dataTableServiceCom: DataTableServiceCommunicate<OverTimeMaster>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute,
        private serverAuth: AuthService,
    ) {
        super(
            service,
            serviceCom,
            dataTableServiceCom,
            dialogsService,
            viewContainerRef
        );
    }

    // called by Angular after overtime-master component initialized */

    // on inti override
    ngOnInit(): void {
        // debug here
        // console.log("Task-Machine ngOnInit");

        // override class
        super.ngOnInit();
        // this.route.paramMap.switchMap((params: ParamMap) => this.routeToEdit(0));

        this.route.paramMap
            .subscribe((params: ParamMap) => {
                // console.log("params : ", params);

                let key: number = Number(params.get("condition") || 0);
                if (key) {
                    this.service.getOneKeyNumber(key)
                        .subscribe(dbData => {
                            setTimeout(() => {
                                this.onDetailEdit(dbData);
                            }, 500);
                        }, error => this.displayValue = undefined);
                }
            }, error => console.error(error));
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        if (this.useTemplate) {
            scroll = this.templateScroll;
            scroll.Reload = true;
        } else {
            if (scroll.HasCondition) {
                if (this.serverAuth.getAuth) {
                    scroll.Where = this.serverAuth.getAuth.UserName || "";
                }
            } else {
                scroll.Where = "";
            }

            this.templateScroll = scroll;
        }


        this.service.getAllWithScroll(scroll)
            .subscribe((scrollData: ScrollData<OverTimeMaster>) => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                    this.useTemplate = false;
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: OverTimeMaster): OverTimeMaster {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.OverTimeDate !== null) {
                value.OverTimeDate = moment.tz(value.OverTimeDate, zone).toDate();
            }
        }
        return value;
    }

    // on detail edit override
    onDetailEdit(value?: OverTimeMaster): void {
        if (value) {
            if (value.OverTimeStatus !== 1) {
                this.dialogsService.error("Access Denied", "Status war not waited. you can't edit it.", this.viewContainerRef);
                return;
            }

            if (this.serverAuth.getAuth) {
                if (this.serverAuth.getAuth.LevelUser < 2) {
                    if (this.serverAuth.getAuth.UserName !== value.Creator) {
                        this.dialogsService.error("Access Denied", "You don't have permission to access.", this.viewContainerRef);
                        return;
                    }
                }
            }
        }
        super.onDetailEdit(value);
    }

    // on insert data
    onInsertToDataBase(value: OverTimeMaster): void {
        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.useTemplate = true;
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
    onUpdateToDataBase(value: OverTimeMaster): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.OverTimeMasterId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.useTemplate = true;
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
    onDetailView(value: OverTimeMaster): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.OverTimeMasterId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}