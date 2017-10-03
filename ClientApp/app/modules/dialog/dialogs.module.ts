import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import "rxjs/Rx";
import "hammerjs";
// services
import { DialogsService } from "../../services/service.index";
// components
import {
    ConfirmDialog, ContextDialog,
    CuttingPlanDialogComponent, EmployeeDialogComponent,
    ErrorDialog, MachineDialogComponent,
    MaterialDialogComponent, ProjectDialogComponent,
    StandardTimeDialogComponent, StdtimeSelectDialogComponent,
    UomDialogComponent,
} from "../../components/dialog/dialog.index";
// modules
import { CustomMaterialModule } from "../customer-material/customer-material.module";
import { ValidationModule } from "../validation/validation.module";
import { CuttingPlanModule } from "../cutting-plan/cutting-plan.module";

@NgModule({
    imports: [
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Customer Module
        ValidationModule,
        CustomMaterialModule,
    ],
    exports: [
        ErrorDialog,
        ConfirmDialog,
        ContextDialog,
        UomDialogComponent,
        ProjectDialogComponent,
        MachineDialogComponent,
        EmployeeDialogComponent,
        MaterialDialogComponent,
        CuttingPlanDialogComponent,
        StandardTimeDialogComponent,
        StdtimeSelectDialogComponent
    ],
    declarations: [
        ErrorDialog,
        ConfirmDialog,
        ContextDialog,
        UomDialogComponent,
        MachineDialogComponent,
        ProjectDialogComponent,
        EmployeeDialogComponent,
        MaterialDialogComponent,
        CuttingPlanDialogComponent,
        StandardTimeDialogComponent,
        StdtimeSelectDialogComponent
    ],
    providers: [
        DialogsService,
    ],
    // A list of components that are not referenced in a reachable component template.
    // doc url is :https://angular.io/guide/ngmodule-faq
    entryComponents: [
        ErrorDialog,
        ConfirmDialog,
        ContextDialog,
        UomDialogComponent,
        ProjectDialogComponent,
        MachineDialogComponent,
        MaterialDialogComponent,
        EmployeeDialogComponent,
        CuttingPlanDialogComponent,
        StandardTimeDialogComponent,
        StdtimeSelectDialogComponent
    ],
})
export class DialogsModule { }
