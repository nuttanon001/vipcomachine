import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
// rxjs
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";
// model
import { JobCardMaster } from "../../models/model.index";
// service
import { JobCardMasterService } from "../../services/jobcard-master/jobcard-master.service";
import { DialogsService } from "../../services/dialog/dialogs.service";

@Component({
    selector: "jobcard-waiting",
    templateUrl: "./jobcard-waiting.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// jobcard-waiting component
export class JobCardWaitingComponent implements OnInit, OnDestroy {
    // model
    columns: Array<any>;
    jobCardMasters: Array<any>;

    scrollHeight: string;
    subscription: Subscription;
    // time
    message: number = 0;
    count: number = 0;
    time: number = 300;

    // jobcard-waiting ctor
    constructor(
        private service: JobCardMasterService,
        private serviceDialogs: DialogsService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
    ) { }

    // called by Angular after jobcard-waiting component initialized
    ngOnInit(): void {
        if (window.innerWidth >= 1600) {
            this.scrollHeight = 75 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 68 + "vh";
        } else {
            this.scrollHeight = 65 + "vh";
        }

        this.jobCardMasters = new Array;
        this.onGetJobCardWaitData();
    }

    // destroy
    ngOnDestroy():void {
        if (this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
        }
    }

    // get request data
    onGetJobCardWaitData(): void {
        this.service.getJobCardHasWait()
            .subscribe(dbJobCardWait => {
                this.columns = new Array<any>();

                for (let name of dbJobCardWait.Columns) {
                    if (name.indexOf("Employee") >= 0) {
                        this.columns.push({
                            field: name, header: name,
                            style: { "width": "100px", "text-align": "center" }, styleclass: "time-col"
                        });
                    } else if (name.indexOf("GroupMachine") >= 0) {
                        this.columns.push({
                            field: name, header: name,
                            style: { "width": "100px", "text-align": "center" }, styleclass: "type-col"
                        });
                    } else {
                        this.columns.push({
                            field: name, header: name,
                            style: { "width": "250px" }, styleclass: "singleLine", isButton: true
                        });
                    }
                }

                // debug here

                this.jobCardMasters = dbJobCardWait.DataTable;
                this.reloadData();
            }, error => {
                this.columns = new Array<any>();
                this.jobCardMasters = new Array<any>();
                this.reloadData();
            });
    }

    // reload data
    reloadData(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = Observable.interval(1000)
            .take(this.time).map((x) => x + 1)
            .subscribe((x) => {
                this.message = this.time - x;
                this.count = (x / this.time) * 100;
                if (x === this.time) {
                    this.onGetJobCardWaitData();
                }
            });
    }

    // selected request
    onSelectData(data: any): void {
        let splitArray: Array<string> = data.split("#");

        if (splitArray.length > 0) {
            this.service.postGetMultiKey(splitArray).subscribe(data => {
                this.serviceDialogs.dialogSelectedJobCardDetailForWait(this.viewContainerRef, data)
                    .subscribe(jobCardDetail => {
                        if (jobCardDetail) {
                            if (jobCardDetail.JobCardDetailId === -99) {
                                this.onGetJobCardWaitData();
                            } else {
                                //debug here
                                //console.log("JobCardDetail: ", jobCardDetail);
                                this.router.navigate(["task-machine/jobcard-detail/" + jobCardDetail.JobCardDetailId]);
                            }
                        }
                    });
                // wait for dev
            }, error => this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef));
        } else {
            this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        }
    }

    // cancel data
    onCancelData(data: any):void {
        // split string
        //let splitArray: Array<string> = data.split("#");
        //if (splitArray.length > 0) {
        //    // string to number
        //    let jobCardKey: number = Number(splitArray[1]);
        //    // check job card can cancel
        //    this.service.getCheckJobCardCanCancel(jobCardKey)
        //        .subscribe((result: boolean) => {
        //            if (result) {
        //                this.serviceDialogs.confirm("Question", "Are you want to cancel the MachineRequired ?", this.viewContainerRef)
        //                    .subscribe(result => {
        //                        if (result) {
        //                            this.service.getCancelJobCardMaster(jobCardKey)
        //                                .subscribe(dbUpdate => {
        //                                    this.onGetJobCardWaitData();
        //                                }, error => {
        //                                    this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        //                                });
        //                        }
        //                    });
        //            } else {
        //                this.serviceDialogs.error("Error Message",
        //                    "Cannot cancel requests from the MachineRequired in System !!!", this.viewContainerRef);
        //            }
        //        }, error => {
        //            this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        //        });
        //} else {
        //    this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        //}
    }
}