import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { TaskMachineCenterComponent } from "../../components/task-machine/task-machine-center.component";
import { TaskMachineMasterComponent } from "../../components/task-machine/task-machine-master.component";

const taskMachineRoutes: Routes = [
    {
        path: "task-machine",
        component: TaskMachineCenterComponent,
        children: [
            {
                path: "jobcard-detail/:condition",
                component: TaskMachineMasterComponent,
            },
            {
                path: "",
                component: TaskMachineMasterComponent,
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