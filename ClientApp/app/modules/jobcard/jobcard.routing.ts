﻿import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { JobCardCenterComponent } from "../../components/jobcard/jobcard-center.component";
import { JobCardMasterComponent } from "../../components/jobcard/jobcard-master.component";

const jobcardRoutes: Routes = [
    {
        path: "jobcard",
        component: JobCardCenterComponent,
        children: [
            {
                path: "",
                component: JobCardMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(jobcardRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class JobCardRouters { }