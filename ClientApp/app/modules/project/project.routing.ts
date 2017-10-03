import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
// import { ProjectMasterComponent,ProjectCenterComponent } from "../../components/project-master/project.index";
import { ProjectCenterComponent } from "../../components/project-master/project-center.component";
import { ProjectMasterComponent } from "../../components/project-master/project-master.component";

const projectRoutes: Routes = [
    {
        path: "project",
        component: ProjectCenterComponent,
        children: [
            {
                path: "",
                component: ProjectMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(projectRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class ProjectRouters { }