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
    ]
})
/** machine-dialog component*/
export class MachineDialogComponent
    implements OnInit
{
    machines: Array<Machine>;
    templates: Array<Machine>;
    typeMachines: Array<TypeMachine>;
    typeMachine: TypeMachine;
    // Machine
    selectedMachine: Machine | undefined;
    // Column
    columns: Array<TableColumn> = [
        { prop: "MachineCode", name: "Code", flexGrow: 1 },
        { prop: "MachineName", name: "Name", flexGrow: 3 }
    ];
    columnsType: Array<TableColumn> = [
        { prop: "TypeMachineCode", name: "Code", flexGrow: 1 },
        { prop: "Name", name: "Name", flexGrow: 3}
    ];
    // table
    @ViewChild(DatatableComponent) table: DatatableComponent;
    // proprty
    get CanSelected(): boolean {
        return this.selectedMachine !== undefined;
    }

    /** machine-dialog ctor */
    constructor(
        private serviceMachine: MachineService,
        private serviceTypeMachine: TypeMachineService,
        public dialogRef: MdDialogRef<MachineDialogComponent>,
        @Inject(MD_DIALOG_DATA) public mode: number
    ) { }

    /** Called by Angular after machine-dialog component initialized */
    ngOnInit(): void {
        if (!this.typeMachines) {
            this.typeMachines = new Array;
        }

        if (!this.machines) {
            this.machines = new Array;
        }

        this.serviceTypeMachine.getAll()
            .subscribe(dbTypeMachine => {
                if (this.mode) {
                    this.typeMachines = dbTypeMachine.filter(item => item.TypeMachineId == this.mode).slice();
                } else {
                    this.typeMachines = dbTypeMachine.slice();
                }

                if (this.typeMachines) {
                    this.typeMachine = this.typeMachines[0];
                    this.serviceMachine.getByMasterId(this.typeMachine.TypeMachineId)
                        .subscribe(dbMachine => {
                            this.machines = dbMachine.slice();
                        });
                }
            });
    }

    // Selected Machine
    onSelectedMachine(selected?: any): void {
        if (selected) {
            this.selectedMachine = selected.selected[0];
        }
    }

    // Selected Type Machine
    onSelectedTypeMachine(selected?: any): void {
        if (selected) {
            this.typeMachine = selected.selected[0];
            this.serviceMachine.getByMasterId(this.typeMachine.TypeMachineId)
                .subscribe(dbMachine => {
                    this.machines = dbMachine.slice();
                });
        }
    }

    // on Filter
    onFilter(search: string) {
        // filter our data
        const temp = this.templates.slice().filter((item, index) => {
            let searchStr = ((item.MachineName || "") + (item.MachineCode || "") + (item.TypeMachineString || "")).toLowerCase();
            return searchStr.indexOf(search.toLowerCase()) != -1;
        });

        // update the rows
        this.machines = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
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