import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RouterModule } from "@angular/router";
// components
import { AppComponent } from "./components/app/app.component";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { ProjectMasterComponent } from "./components/project-master/project-master.component";
// modules
import {
    CustomMaterialModule, ValidationModule,
    DialogsModule, DeveloperModule, JobCardModule,
    ProjectModule, MachineModule, CuttingPlanModule,
    StandardTimeModule,TaskMachineModule
 } from "./modules/module.index";
// services
import { AuthGuard, AuthService } from "./services/service.index";
// 3rd party
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import "hammerjs";
import "popper.js";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        NavMenuComponent,
        // ProjectMasterComponent,
    ],
    imports: [
        HttpModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: HomeComponent },
            { path: "login", component: LoginComponent },
            // { path: "project", component: ProjectMasterComponent },
            { path: "**", redirectTo: "home" }
        ]),
        // module
        ValidationModule,
        CustomMaterialModule,
        DeveloperModule,
        JobCardModule,
        ProjectModule,
        MachineModule,
        CuttingPlanModule,
        StandardTimeModule,
        TaskMachineModule,
        DialogsModule,
        // 3rd party
        // NgxDatatableModule,
    ],
    providers: [
        AuthGuard,
        AuthService
    ]
})
export class AppModuleShared {
}
