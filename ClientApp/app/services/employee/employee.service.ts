import { Injectable,ViewContainerRef } from '@angular/core';
import { Http } from "@angular/http";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
// rxjs
import { Observable } from "rxjs/Rx";
// model
import { Employee } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class EmployeeService extends BaseRestService<Employee> {
    constructor(
        http: Http,
        private dialog: MdDialog
    ) {
        super(http, "api/Employee/");
    }
}