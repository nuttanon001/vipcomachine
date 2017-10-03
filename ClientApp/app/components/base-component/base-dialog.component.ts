﻿import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
// services
import { DialogsService, DataTableServiceCommunicate } from "../../services/service.index";
// models
import { Scroll } from "../../models/model.index";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";

/** base-dialog component*/
export abstract class BaseDialogComponent
    <Model,Service> implements OnInit {
    selected: Model | undefined;
    //Subscription
    subscription: Subscription;
    //Column
    columns: Array<TableColumn>;
    /** cutting-plan-dialog ctor */
    constructor(
        protected service: Service,
        protected serviceDataTable: DataTableServiceCommunicate<Model>,
        protected dialogRef: MdDialogRef<any>
    ) { }

    //Property
    get CanSelected(): boolean {
        return this.selected !== undefined;
    }

    /** Called by Angular after cutting-plan-dialog component initialized */
    ngOnInit(): void {
        this.onInit();

        this.subscription = this.serviceDataTable.ToParent$
            .subscribe((scroll: Scroll) => this.loadDataScroll(scroll));
    }

    // on Init data
    abstract onInit(): void;

    // on get data with lazy load
    abstract loadDataScroll(scroll: Scroll): void;

    // Selected Value
    onSelectedValue(value?: Model): void {
        if (value) {
            this.selected = value;
        }
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selected);
    }
}