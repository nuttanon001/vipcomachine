import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
// models
import {
    Machine, TypeMachine,
    Scroll
} from "../../models/model.index";
// service
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { MachineService } from "../../services/machine/machine.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";


@Component({
    selector: 'machine-dialog',
    templateUrl: './machine-dialog.component.html',
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        MachineService,
        TypeMachineService,
        DataTableServiceCommunicate
    ]
})
/** machine-dialog component*/
export class MachineDialogComponent
    implements OnInit, OnDestroy
{
    typeMachines: Array<TypeMachine>;
    typeMachine: TypeMachine;
    // Machine
    selectedMachine: Machine | undefined;
    // Subscription
    subscription: Subscription;
    // Column
    columns: Array<TableColumn> = [
        { prop: "MachineCode", name: "Code", flexGrow: 1 },
        { prop: "MachineName", name: "Name", flexGrow: 2 },
    ];
    columnsType: Array<TableColumn> = [
        //{ prop: "TypeMachineCode", name: "Code", flexGrow: 1 },
        { prop: "Name", name: "Name", flexGrow: 2 },
    ];

    // proprty
    get CanSelected(): boolean {
        return this.selectedMachine !== undefined;
    }

    /** machine-dialog ctor */
    constructor(
        private serviceMachine: MachineService,
        private serviceTypeMachine: TypeMachineService,
        private serviceDataTable: DataTableServiceCommunicate<Machine>,
        public dialogRef: MdDialogRef<MachineDialogComponent>

    ) { }

    /** Called by Angular after machine-dialog component initialized */
    ngOnInit(): void {
        if (!this.typeMachines) {
            this.typeMachines = new Array;
        }

        this.serviceTypeMachine.getAll()
            .subscribe(dbTypeMachine => {
                this.typeMachines = dbTypeMachine.slice();
            });

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
        if (scroll && this.typeMachine) {
            scroll.Filter += "#Condition" + this.typeMachine.TypeMachineId;
        }

        //debug here
        console.log("Scroll :", scroll);

        this.serviceMachine.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // Selected Machine
    onSelectedMachine(machine?: Machine): void {
        if (machine) {
            this.selectedMachine = machine;
        }
    }

    // Selected Type Machine
    onSelectedTypeMachine(selected?: any): void {
        if (selected) {
            this.typeMachine = selected.selected[0];
            this.loadData({Filter:"",Skip:0,Take:10});
        }
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selectedMachine);
    }
}