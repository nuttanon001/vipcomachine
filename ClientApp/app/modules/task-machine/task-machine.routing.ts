﻿import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { TaskMachineCenterComponent } from "../../components/task-machine/task-machine-center.component";
import { TaskMachineMasterComponent } from "../../components/task-machine/task-machine-master.component";
import { TaskMachineScheduleComponent } from "../../components/task-machine/task-machine-schedule.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const taskMachineRoutes: Routes = [
    {
        path: "task-machine",
        component: TaskMachineCenterComponent,
        children: [
            {
                path: "jobcard-detail/:condition",
                component: TaskMachineMasterComponent,
                canActivate: [AuthGuard],
            },
            {
                path: "task-machine-schedule/:condition",
                component: TaskMachineScheduleComponent,
            },
            {
                path: "task-machine-schedule",
                component: TaskMachineScheduleComponent,
            },
            {
                path: "",
                component: TaskMachineMasterComponent,
                canActivate: [AuthGuard],
            }
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(taskMachineRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class TaskMachineRouters { }