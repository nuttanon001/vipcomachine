﻿import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { OverTimeCenterComponent } from "../../components/overtime/overtime-center.component";
import { OvertimeMasterComponent } from "../../components/overtime/overtime-master.component";
import { OvertimeScheduleComponent } from "../../components/overtime/overtime-schedule.component";
// service
import { AuthGuard } from "../../services/auth/auth-guard.service";

const overTimeRoutes: Routes = [
    {
        path: "overtime",
        component: OverTimeCenterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "approve-overtime",
                component: OvertimeScheduleComponent,
                canActivate: [AuthGuard],
            },
            {
                path: "",
                component: OvertimeMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(overTimeRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class OverTimeRouters { }