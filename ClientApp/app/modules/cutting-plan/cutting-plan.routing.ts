import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { CuttingCenterComponent } from "../../components/cutting-plan/cutting-center.component";
import { CuttingMasterComponent } from "../../components/cutting-plan/cutting-master.component";

const cuttingPlanRoutes: Routes = [
    {
        path: "cutting-plan",
        component: CuttingCenterComponent,
        children: [
            {
                path: "",
                component: CuttingMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(cuttingPlanRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class CuttingPlanRouters { }