﻿import {
    Component, Input, Output,
    EventEmitter, OnInit, OnDestroy, ElementRef
} from "@angular/core";
// models
import { Page, PageData, Scroll, ScrollData } from "../../models/model.index";
// services
import { DataTableServiceCommunicate } from "../../services/service.index";
// rxjs
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "data-table",
    template: `
    <search-box (search)="onFilter($event)" class="w-100"></search-box>
    <ngx-datatable
        class="material datatable-scrolling"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="'flex'"
        [headerHeight]="headerHeight"
        [rowHeight]="rowHeight"
        [loadingIndicator]="isLoading"
        [scrollbarV]="true"
        (scroll)="onScroll($event.offsetY)"
        [externalSorting]="true"
        (sort)="onSort($event)"
        [selectionType]="'single'"
        (select)="onSelect($event)"
        [style.height]="height">
    </ngx-datatable>
  `,
    styleUrls: ['./data-table.style.scss'],
})

export class DataTableComponent implements OnInit,OnDestroy {
    rows: Array<any> = new Array<any>();
    @Output("selected") selected = new EventEmitter<any>();
    @Input("height") height: string = "calc(100vh - 165px)";
    private _columns: any;
    @Input("columns")
    set columns(setColumns: any) {
        this._columns = setColumns;
        if (setColumns) {
            //debug here
            // console.log("Column :", setColumns);
            setTimeout(() => {
                this.onScroll(0);
            }, 150);
        }
    }
    get columns(): any { return this._columns; }

    readonly headerHeight = 50;
    readonly rowHeight = 50;
    readonly pageLimit = 10;

    scroll: Scroll = {
        Skip: 0,
        Take: 0,
    };
    //boolean
    isLoading: boolean;
    isFilter: boolean;
    isSort: boolean;
    // subscription
    subscription: Subscription;

    constructor(
        private dataTableService: DataTableServiceCommunicate<any>,
        private el: ElementRef
    ) { }

    ngOnInit(): void {
        // this.onScroll(0);
        // wait load data
        this.subscription = this.dataTableService.toChild$
            .subscribe((scrollData: ScrollData<any>) => {
                // debug here
                //console.log("Row", this.rows);

                if (scrollData && scrollData.Data && scrollData.Data.length > 0) {
                    if (scrollData.Scroll) {
                        if (scrollData.Scroll.Reload) {
                            this.rows = scrollData.Data.slice();
                            return;
                        }

                        if (this.isSort || this.isFilter) {
                            this.rows = scrollData.Data.slice();
                            this.isSort = false;
                            this.isFilter = false;
                            return;
                        }
                    }
                    this.rows.push(...scrollData.Data);
                }
                else {
                    if (this.isFilter) {
                        this.rows = new Array;
                        this.isFilter = false;
                    }
                }
                this.isLoading = false;
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
    // on Scroll bar
    onScroll(offsetY: number) {
        // total height of all rows in the viewport
        const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

        // check if we scrolled to the end of the viewport
        if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight) {

            // total number of results to load
            let limit = this.pageLimit;

            // check if we haven't fetched any results yet
            if (this.rows.length === 0) {

                // calculate the number of rows that fit within viewport
                const pageSize = Math.ceil(viewHeight / this.rowHeight);

                // change the limit to pageSize such that we fill the first page entirely
                // (otherwise, we won't be able to scroll past it)
                limit = Math.max(pageSize, this.pageLimit);
            }
            this.loadPage(limit);
        }
    }
    // loadPage
    private loadPage(limit: number) {
        // set the loading flag, which serves two purposes:
        // 1) it prevents the same page from being loaded twice
        // 2) it enables display of the loading indicator
        this.isLoading = true;
        this.scroll.Skip = this.rows.length;
        this.scroll.Take = limit;

        //debug here
        //console.log("Scroll here :", this.scroll);

        this.dataTableService.toParent(this.scroll);

        //this.serverResultsService.getResults(this.rows.length, limit).subscribe(results => {
        //    this.rows.push(...results.data);
        //    this.isLoading = false;
        //});
    }

    onSort(event:any) {
        // event was triggered, start sort sequence
        // console.log('Sort Event', event);
        this.isSort = true;
        const sort = event.sorts[0];
        this.scroll.Skip = 0;
        this.scroll.Take = this.rows.length;
        this.scroll.SortField = sort.prop;
        this.scroll.SortOrder = sort.dir === "desc" ? -1 : 1;
        //LoadData
        //debug here
        // console.log("Scroll here :", this.scroll);
        this.dataTableService.toParent(this.scroll);
    }

    onFilter(search: string) {
        this.isFilter = true;
        this.scroll.Skip = 0;
        this.scroll.Take = 13;
        this.scroll.Filter = search;
        //LoadData
        //debug here
        // console.log("Scroll here :", this.scroll);
        this.dataTableService.toParent(this.scroll);
    }
}