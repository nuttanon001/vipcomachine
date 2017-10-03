import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 3rd party
import "hammerjs";

// component
import { JobCardCenterComponent } from "../../components/jobcard/jobcard-center.component";
import { JobCardMasterComponent } from "../../components/jobcard/jobcard-master.component";
import { JobCardViewComponent } from "../../components/jobcard/jobcard-view.component";
import { JobCardEditComponent } from "../../components/jobcard/jobcard-edit.component";
import { JobcardDetailEditComponent } from "../../components/jobcard/jobcard-detail-edit.component";
// module
import { JobCardRouters } from "./jobcard.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
import {
    JobCardMasterService, JobCardDetailService,
    JobCardMasterServiceCommunicate, DataTableServiceCommunicate
} from "../../services/service.index";

@NgModule({
    declarations: [
        JobCardCenterComponent,
        JobCardMasterComponent,
        JobCardViewComponent,
        JobCardEditComponent,
        JobcardDetailEditComponent
    ],
    imports: [
        //Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Custom
        CustomMaterialModule,
        ValidationModule,
        JobCardRouters,
    ],
    providers: [
        JobCardMasterService,
        JobCardDetailService,
        JobCardMasterServiceCommunicate,
        // DataTableServiceCommunicate
    ]
})

export class JobCardModule { }