﻿import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { Injectable, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs/Rx";

// models
import {
    ProjectCodeDetail, Material,
    Employee, Machine, StandardTime,
    CuttingPlan, UnitsMeasure
} from "../../models/model.index";

// components
import { ConfirmDialog } from "../../components/dialog/confirm-dialog.component";
import { ContextDialog } from "../../components/dialog/context-dialog.component";
import { ErrorDialog } from "../../components/dialog/error-dialog.component";
import { ProjectDialogComponent } from "../../components/dialog/project-dialog.component";
import { MaterialDialogComponent } from "../../components/dialog/material-dialog.component";
import { EmployeeDialogComponent } from "../../components/dialog/employee-dialog.component";
import { MachineDialogComponent } from "../../components/dialog/machine-dialog.component";
import { StandardTimeDialogComponent } from "../../components/dialog/standard-time-dialog.component";
import { StdtimeSelectDialogComponent } from "../../components/dialog/stdtime-select-dialog.component";
import { CuttingPlanDialogComponent } from "../../components/dialog/cutting-plan-dialog.component";
import { UomDialogComponent } from "../../components/dialog/uom-dialog.component";

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public confirm(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<ConfirmDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ConfirmDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public context(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<ContextDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ContextDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public error(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<ErrorDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ErrorDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public dialogSelectedDetail(viewContainerRef: ViewContainerRef): Observable<ProjectCodeDetail> {
        let dialogRef: MdDialogRef<ProjectDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(ProjectDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectMaterial(viewContainerRef: ViewContainerRef): Observable<Material> {
        let dialogRef: MdDialogRef<MaterialDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(MaterialDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectEmployee(viewContainerRef: ViewContainerRef, mode:string = ""): Observable<Array<Employee>> {

        let dialogRef: MdDialogRef<EmployeeDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = mode;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(EmployeeDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectMachine(viewContainerRef: ViewContainerRef): Observable<Machine> {
        let dialogRef: MdDialogRef<MachineDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(MachineDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogNewEditStandardTime(viewContainerRef: ViewContainerRef, standard: StandardTime,): Observable<StandardTime> {
        let dialogRef: MdDialogRef<StandardTimeDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = standard;
        config.height = "450px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(StandardTimeDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectCuttingPlan(viewContainerRef: ViewContainerRef): Observable<CuttingPlan> {
        let dialogRef: MdDialogRef<CuttingPlanDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(CuttingPlanDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectStandardTime(viewContainerRef: ViewContainerRef): Observable<StandardTime> {
        let dialogRef: MdDialogRef<StdtimeSelectDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(StdtimeSelectDialogComponent, config);
        return dialogRef.afterClosed();
    }

    public dialogSelectUom(viewContainerRef: ViewContainerRef): Observable<UnitsMeasure> {
        let dialogRef: MdDialogRef<UomDialogComponent>;
        let config = new MdDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.height = "650px";
        config.width = "1000px";
        config.hasBackdrop = true;

        // open dialog
        dialogRef = this.dialog.open(UomDialogComponent, config);
        return dialogRef.afterClosed();
    }
}
