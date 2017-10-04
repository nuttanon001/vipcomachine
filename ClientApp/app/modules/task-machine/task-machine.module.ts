﻿import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 3rd party
import "hammerjs";
// component
import { OverTimeEditComponent } from "../../components/task-machine/over-time-edit.component";
import { TaskMachineCenterComponent } from "../../components/task-machine/task-machine-center.component";
import { TaskMachineEditComponent } from "../../components/task-machine/task-machine-edit.component";
import { TaskMachineMasterComponent } from "../../components/task-machine/task-machine-master.component";
import { TaskMachineViewComponent } from "../../components/task-machine/task-machine-view.component";
// module
import { TaskMachineRouters } from "./task-machine.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
import {
    TaskMachineService, JobCardMasterService,JobCardDetailService,
    TaskMachineServiceCommunicate,
} from "../../services/service.index";

@NgModule({
    declarations: [
        OverTimeEditComponent,
        TaskMachineCenterComponent,
        TaskMachineEditComponent,
        TaskMachineMasterComponent,
        TaskMachineViewComponent
    ],
    imports: [
        //Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Custom
        CustomMaterialModule,
        ValidationModule,
        TaskMachineRouters,
    ],
    providers: [
        TaskMachineService,
        JobCardMasterService,
        JobCardDetailService,
        TaskMachineServiceCommunicate,
        TaskMachineHasOverTimeService,
    ]
})

export class TaskMachineModule { }