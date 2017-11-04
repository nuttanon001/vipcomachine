import { NgModule } from "@angular/core";
import {
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
} from "@angular/material";

import {
    DataTableModule,
    DialogModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    InputMaskModule,
    TreeModule,
    TreeTableModule,
    AccordionModule,
    AutoCompleteModule,
} from "primeng/primeng";

import { AngularSplitModule } from "angular-split";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// component
import { DataTableComponent } from "../../components/base-component/data-table.component";
import { SearchBoxComponent } from "../../components/base-component/search-box.component";
import { AttactFileComponent } from "../../components/base-component/attact-file.component";
import { ReuseTableComponent } from "../../components/base-component/reuse-table.component";
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@NgModule({
    declarations: [
        // component
        DataTableComponent,
        SearchBoxComponent,
        AttactFileComponent,
        ReuseTableComponent,
        // pipe
        DateOnlyPipe,
    ],
    imports: [
        //Material
        MatButtonModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTabsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        //AngularSplit
        AngularSplitModule,
        //NgxDataTable
        NgxDatatableModule,
        //PrimeNg
        DataTableModule,
        DialogModule,
        SharedModule,
        CalendarModule,
        DropdownModule,
        InputMaskModule,
        TreeModule,
        TreeTableModule,
        AccordionModule,
        AutoCompleteModule,
    ],
    exports: [
        //Material
        MatButtonModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTabsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        //AngularSplit
        AngularSplitModule,
        //NgxDataTable
        NgxDatatableModule,
        //PrimeNg
        DataTableModule,
        DialogModule,
        SharedModule,
        CalendarModule,
        DropdownModule,
        InputMaskModule,
        TreeModule,
        TreeTableModule,
        AccordionModule,
        AutoCompleteModule,
        //Component
        SearchBoxComponent,
        DataTableComponent,
        AttactFileComponent,
        ReuseTableComponent,
        //Pipe
        DateOnlyPipe
    ],
    entryComponents: [
        SearchBoxComponent,
        DataTableComponent,
        AttactFileComponent,
        ReuseTableComponent,
    ]
})
export class CustomMaterialModule { }