import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { StandardTimeCenterComponent } from "../../components/standard-time/standard-time-center.component";
import { StandardTimeMasterComponent } from "../../components/standard-time/standard-time-master.component";

const standardTimeRoutes: Routes = [
    {
        path: "standard-time",
        component: StandardTimeCenterComponent,
        children: [
            {
                path: "",
                component: StandardTimeMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(standardTimeRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class StandardTimeRouters { }