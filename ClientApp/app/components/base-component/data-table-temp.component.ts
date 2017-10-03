import {
    Component, Input, Output,
    EventEmitter, OnInit , OnDestroy
} from "@angular/core";
// models
import { Page, PageData } from "../../models/model.index";
// services
import { DataTableServiceCommunicate } from "../../services/service.index";
// rxjs
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "data-table",
    template: `
    <ngx-datatable style="height: 87vh;"
        class="material"
        [rows]="rows"
        [loadingIndicator]="loadingIndicator"
        [columns]="columns"
        [columnMode]="'flex'"
        [scrollbarV]="true"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [externalPaging]="true"
        [count]="page.TotalElements"
        [offset]="page.pageNumber"
        (page)="setPage($event)"
        [selectionType]="'single'"
        (select)="onSelect($event)">
    </ngx-datatable>
  `
})

export class DataTableComponent implements OnInit,OnDestroy {
    rows: Array<any> = new Array<any>();
    @Output("selected") selected = new EventEmitter<any>();
    @Input("columns")columns: any;

    page: Page = {
        PageNumber: 0,
        Size: 0,
        TotalElements: 0,
        TotalPages: 0,
    };
    cache: any = {};
    //boolean
    loadingIndicator: boolean = true;
    reorderable: boolean = true;
    // subscription
    subscription: Subscription;

    constructor(
        private dataTableService:DataTableServiceCommunicate<any>
    ) { }

    ngOnInit(): void {
        this.page.PageNumber = 0;

        // wait load data
        this.subscription = this.dataTableService.toChild$
            .subscribe((pageData: PageData<any>) => {
                if (pageData && pageData.Data && pageData.Data.length > 0) {

                    //debug here
                    // console.log("LoadTable:", pageData);

                    if (pageData.Page) {
                        this.page = pageData.Page;
                    }

                    // calc start
                    const start = (this.page.PageNumber || 0) * (this.page.Size || 10);

                    // copy rows
                    const rows: Array<any> = Array(this.rows); //[...this.rows];

                    // insert rows into new position
                    if (pageData.Data) {
                        rows.splice(start, 0, ...pageData.Data);
                    }

                    // set rows to our new rows
                    this.rows = rows;

                    // add flag for results
                    this.cache[this.page.PageNumber || 0] = true;
                }
                this.loadingIndicator = false;
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
        }
    }

    // emit row selected to output
    onSelect(selected: any) {
        if (selected) {
            this.selected.emit(selected.selected[0]);
        }
    }

    /**
     * Populate the table with new data based on the page number
     * @param page The page to select
     **/

    setPage(pageInfo: any) {
        // Debug here
        // console.log("PageInfo:", pageInfo);

        this.loadingIndicator = true;
        this.page.PageNumber = pageInfo.offset;
        this.page.Size = pageInfo.pageSize;

        // Debug here
        // console.log("page:", this.page);

        // cache results
        // if(this.cache[this.page.pageNumber]) return;

        // load data page
        this.dataTableService.toParent(this.page);
    }
}